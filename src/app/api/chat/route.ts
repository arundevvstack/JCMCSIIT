import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText, embed } from "ai";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const MAX_RAW_BODY_BYTES = 32_768; // 32 KB ceiling
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_TOTAL_CONVERSATION_CHARS = 12_000;

const CHAT_RATE_WINDOW_MS = 60_000; // 1 minute
const CHAT_RATE_MAX_REQUESTS = 12;
const MAX_TRACKED_CHAT_IPS = 2_000;

const chatRateBuckets = new Map<string, number[]>();

interface MatchedDocumentChunk {
    content: string;
}

function getClientIp(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
        forwarded?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip")?.trim() ||
        "local-chat-client";
    return ip.slice(0, 64);
}

function checkChatRateLimit(ipKey: string, now = Date.now()): {
    allowed: boolean;
    retryAfterSeconds: number;
} {
    if (chatRateBuckets.size > MAX_TRACKED_CHAT_IPS) {
        for (const [key, stamps] of chatRateBuckets.entries()) {
            const active = stamps.filter(
                (ts) => now - ts < CHAT_RATE_WINDOW_MS
            );
            if (active.length === 0) {
                chatRateBuckets.delete(key);
            } else {
                chatRateBuckets.set(key, active);
            }
        }
        if (chatRateBuckets.size > MAX_TRACKED_CHAT_IPS) {
            const oldestKey = chatRateBuckets.keys().next().value;
            if (oldestKey) chatRateBuckets.delete(oldestKey);
        }
    }

    const existing = chatRateBuckets.get(ipKey) ?? [];
    const active = existing.filter((ts) => now - ts < CHAT_RATE_WINDOW_MS);

    if (active.length >= CHAT_RATE_MAX_REQUESTS) {
        chatRateBuckets.set(ipKey, active);
        const oldestActive = active[0] ?? now;
        const retryAfterSeconds = Math.max(
            1,
            Math.ceil((CHAT_RATE_WINDOW_MS - (now - oldestActive)) / 1000)
        );
        return { allowed: false, retryAfterSeconds };
    }

    active.push(now);
    chatRateBuckets.set(ipKey, active);
    return { allowed: true, retryAfterSeconds: 0 };
}

const TextPartSchema = z.object({
    type: z.string(),
    text: z.string().max(MAX_MESSAGE_CHARS).optional(),
});

// Restrict client-supplied roles strictly to `user` and `assistant` to prevent
// untrusted callers from injecting `system` or `tool` instructions.
const IncomingChatMessageSchema = z
    .object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(MAX_MESSAGE_CHARS).optional(),
        parts: z.array(TextPartSchema).max(10).optional(),
    })
    .transform((msg, ctx) => {
        const rawText =
            typeof msg.content === "string" && msg.content.trim().length > 0
                ? msg.content
                : Array.isArray(msg.parts)
                  ? msg.parts
                        .filter((p) => p.type === "text" && typeof p.text === "string")
                        .map((p) => p.text)
                        .join("\n")
                  : "";

        const cleaned = rawText
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
            .trim();

        if (cleaned.length === 0) {
            ctx.addIssue({
                code: "custom",
                message: "Each chat message must include non-empty text content.",
            });
            return z.NEVER;
        }

        if (cleaned.length > MAX_MESSAGE_CHARS) {
            ctx.addIssue({
                code: "custom",
                message: `Individual messages must not exceed ${MAX_MESSAGE_CHARS} characters.`,
            });
            return z.NEVER;
        }

        return {
            role: msg.role,
            content: cleaned,
        };
    });

const ChatRequestSchema = z
    .object({
        messages: z
            .array(IncomingChatMessageSchema)
            .min(1, "At least one message is required.")
            .max(
                MAX_MESSAGES,
                `Conversation history cannot exceed ${MAX_MESSAGES} messages.`
            ),
    })
    .superRefine((val, ctx) => {
        const last = val.messages[val.messages.length - 1];
        if (!last || last.role !== "user") {
            ctx.addIssue({
                code: "custom",
                message: "The latest message must be from the user.",
            });
        }

        const totalChars = val.messages.reduce(
            (sum, m) => sum + m.content.length,
            0
        );
        if (totalChars > MAX_TOTAL_CONVERSATION_CHARS) {
            ctx.addIssue({
                code: "custom",
                message: `Total conversation payload exceeds ${MAX_TOTAL_CONVERSATION_CHARS} characters.`,
            });
        }
    });

export async function POST(req: Request) {
    // 1. Rate-limit abusive or automated callers per IP
    const rate = checkChatRateLimit(getClientIp(req));
    if (!rate.allowed) {
        return NextResponse.json(
            {
                error: "Too many chat requests. Please wait before sending another message.",
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(rate.retryAfterSeconds),
                },
            }
        );
    }

    // 2. Enforce strict raw request payload ceiling before JSON parsing
    const declaredLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_RAW_BODY_BYTES) {
        return NextResponse.json(
            { error: "Request payload exceeds maximum allowed size." },
            { status: 413 }
        );
    }

    let rawBodyText: string;
    try {
        rawBodyText = await req.text();
    } catch {
        return NextResponse.json(
            { error: "Unable to read request body." },
            { status: 400 }
        );
    }

    if (Buffer.byteLength(rawBodyText, "utf8") > MAX_RAW_BODY_BYTES) {
        return NextResponse.json(
            { error: "Request payload exceeds maximum allowed size." },
            { status: 413 }
        );
    }

    let jsonBody: unknown;
    try {
        jsonBody = JSON.parse(rawBodyText);
    } catch {
        return NextResponse.json(
            { error: "Malformed JSON request body." },
            { status: 400 }
        );
    }

    // 3. Validate message count, allowed roles, and text lengths with Zod
    const parsed = ChatRequestSchema.safeParse(jsonBody);
    if (!parsed.success) {
        return NextResponse.json(
            {
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid chat messages payload.",
            },
            { status: 400 }
        );
    }

    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            { error: "AI Campus Assistant is currently unavailable." },
            { status: 503 }
        );
    }

    const validatedMessages = parsed.data.messages;
    const lastMessageText =
        validatedMessages[validatedMessages.length - 1].content;

    let contextText = "";

    // 4. Optional server-only RAG lookup (`match_documents` is restricted from `anon` by RLS/grants)
    try {
        const supabaseAdmin = createAdminClient();
        const { embedding } = await embed({
            model: openai.embedding("text-embedding-ada-002"),
            value: lastMessageText,
        });

        const { data: documents, error } = await supabaseAdmin.rpc(
            "match_documents",
            {
                query_embedding: embedding,
                match_threshold: 0.75,
                match_count: 5,
            }
        );

        if (!error && Array.isArray(documents) && documents.length > 0) {
            contextText = (documents as MatchedDocumentChunk[])
                .map((doc) => doc.content)
                .join("\n\n---\n\n");
        }
    } catch {
        // Degrade gracefully without leaking internal DB/credential errors.
    }

    const systemPrompt = `You are the official AI Campus Assistant for John Cox Memorial CSI Institute of Technology (JCMCSIIT).
You are a highly intelligent, futuristic, and helpful assistant.
Use a premium, professional, yet welcoming tone.

You must ground your responses strictly in the provided Context below.
If the answer is not in the context, politely state that you don't have that specific information and direct them to contact admissions or the relevant department.
NEVER invent statistics, placement rates, approvals, fee structures, deadlines, or rankings.

Context Retrieved from Database:
=========================
${contextText || "No specific context found. Rely on general verified knowledge about JCMCSIIT."}
=========================`;

    try {
        const result = streamText({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            messages: validatedMessages,
        });

        return result.toTextStreamResponse();
    } catch {
        return NextResponse.json(
            { error: "Unable to generate a response right now." },
            { status: 500 }
        );
    }
}
