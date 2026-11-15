import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { AdminAuthError, requireAdminRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

        const body = (await req.json()) as {
            content?: unknown;
            instruction?: unknown;
        };
        const content = typeof body.content === "string" ? body.content : "";
        const instruction =
            typeof body.instruction === "string" ? body.instruction : "";

        if (!content.trim()) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an expert academic editor and content strategist for John Cox Memorial CSI Institute of Technology (JCMCSIIT).
You format raw text into premium, elite, highly readable Markdown suitable for a world-class university website.
Adhere to these rules:
1. Use professional, inspiring academic tone (like Oxford or MIT).
2. Fix any grammar and structural issues.
3. Keep it concise but impactful.
4. Output ONLY valid Markdown. No conversational filler like "Here is the improved text:".

Specific user instruction: ${instruction || "Enhance for professionalism, clarity, and formatting."}`;

        const { text } = await generateText({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            prompt: content,
        });

        return NextResponse.json({ enhancedContent: text });
    } catch (error: unknown) {
        if (error instanceof AdminAuthError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        console.error("AI Enhance Error:", error);
        return NextResponse.json(
            { error: "Failed to enhance content" },
            { status: 500 }
        );
    }
}
