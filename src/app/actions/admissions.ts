"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export interface PublicInquiryResult {
    success?: boolean;
    error?: string;
    message?: string;
}

const MAX_FORM_FIELDS = 20;
const MAX_TOTAL_TEXT_CHARS = 8_192;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_TRACKED_IPS = 2_000;

const inquiryRateBuckets = new Map<string, number[]>();

function stripControlChars(input: string): string {
    return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function normalizeInlineText(input: string): string {
    return stripControlChars(input).replace(/\s+/g, " ").trim();
}

function normalizeMultilineText(input: string): string {
    return stripControlChars(input)
        .replace(/\r\n/g, "\n")
        .replace(/\n{4,}/g, "\n\n\n")
        .trim();
}

function extractClientIp(reqHeaders: Headers): string {
    const forwardedFor = reqHeaders.get("x-forwarded-for");
    const ip =
        forwardedFor?.split(",")[0]?.trim() ||
        reqHeaders.get("x-real-ip")?.trim() ||
        "local-client";
    return ip.slice(0, 64);
}

function checkInquiryRateLimit(ipKey: string, now = Date.now()): boolean {
    if (inquiryRateBuckets.size > MAX_TRACKED_IPS) {
        for (const [key, timestamps] of inquiryRateBuckets.entries()) {
            const recent = timestamps.filter(
                (ts) => now - ts < RATE_LIMIT_WINDOW_MS
            );
            if (recent.length === 0) {
                inquiryRateBuckets.delete(key);
            } else {
                inquiryRateBuckets.set(key, recent);
            }
        }
        if (inquiryRateBuckets.size > MAX_TRACKED_IPS) {
            const oldestKey = inquiryRateBuckets.keys().next().value;
            if (oldestKey) inquiryRateBuckets.delete(oldestKey);
        }
    }

    const existing = inquiryRateBuckets.get(ipKey) ?? [];
    const active = existing.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

    if (active.length >= RATE_LIMIT_MAX_REQUESTS) {
        inquiryRateBuckets.set(ipKey, active);
        return false;
    }

    active.push(now);
    inquiryRateBuckets.set(ipKey, active);
    return true;
}

function validateFormDataEnvelope(formData: FormData): string | null {
    let fieldCount = 0;
    let totalChars = 0;

    for (const [key, value] of formData.entries()) {
        fieldCount += 1;
        if (fieldCount > MAX_FORM_FIELDS) {
            return "Submission contains too many fields.";
        }
        if (typeof value !== "string") {
            return "File attachments are not permitted in inquiry forms.";
        }
        totalChars += key.length + value.length;
        if (totalChars > MAX_TOTAL_TEXT_CHARS) {
            return "Submission exceeds the maximum allowed size.";
        }
    }

    // Honeypot fields commonly filled by automated bots
    const honeypot =
        (formData.get("website") as string | null) ||
        (formData.get("company_url") as string | null) ||
        (formData.get("_gotcha") as string | null);

    if (honeypot && honeypot.trim().length > 0) {
        return "SPAM_BLOCKED";
    }

    return null;
}

const PublicInquirySchema = z.object({
    name: z
        .string()
        .transform(normalizeInlineText)
        .pipe(
            z
                .string()
                .min(2, "Full name must be at least 2 characters.")
                .max(255, "Full name must not exceed 255 characters.")
        ),
    email: z
        .string()
        .transform((val) => normalizeInlineText(val).toLowerCase())
        .pipe(
            z
                .string()
                .min(5, "Please enter a valid email address.")
                .max(255, "Email address must not exceed 255 characters.")
                .email("Please enter a valid email address.")
                .regex(
                    /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    "Please enter a valid email address."
                )
        ),
    phone: z
        .string()
        .transform(normalizeInlineText)
        .pipe(
            z
                .string()
                .max(50, "Phone number must not exceed 50 characters.")
                .refine(
                    (val) =>
                        val === "" || /^[0-9+\-() .\s]{7,50}$/.test(val),
                    "Please enter a valid phone number."
                )
        )
        .optional(),
    course_interest: z
        .string()
        .transform(normalizeInlineText)
        .pipe(
            z
                .string()
                .max(255, "Course selection must not exceed 255 characters.")
        )
        .optional(),
    message: z
        .string()
        .transform(normalizeMultilineText)
        .pipe(
            z
                .string()
                .max(5000, "Message must not exceed 5,000 characters.")
        )
        .optional(),
});

async function persistPublicInquiry(
    formData: FormData,
    requireMessage: boolean
): Promise<PublicInquiryResult> {
    if (!(formData instanceof FormData)) {
        return { error: "Invalid submission payload." };
    }

    const envelopeErr = validateFormDataEnvelope(formData);
    if (envelopeErr === "SPAM_BLOCKED") {
        // Silently reject automated bot honeypot hits without database writes.
        return { error: "Unable to process submission right now." };
    }
    if (envelopeErr) {
        return { error: envelopeErr };
    }

    try {
        const reqHeaders = await headers();
        const clientIp = extractClientIp(reqHeaders);
        if (!checkInquiryRateLimit(clientIp)) {
            return {
                error: "Too many submissions from your network. Please wait a few minutes before trying again.",
            };
        }
    } catch {
        // Continue validation if request headers are unavailable in non-HTTP unit tests.
    }

    const rawSubject = normalizeInlineText(
        typeof formData.get("subject") === "string"
            ? (formData.get("subject") as string)
            : ""
    );
    const rawMessage = normalizeMultilineText(
        typeof formData.get("message") === "string"
            ? (formData.get("message") as string)
            : ""
    );

    const combinedMessage =
        rawSubject && rawMessage
            ? `Subject: ${rawSubject}\n\n${rawMessage}`
            : rawSubject
              ? `Subject: ${rawSubject}`
              : rawMessage;

    const parsed = PublicInquirySchema.safeParse({
        name:
            typeof formData.get("name") === "string"
                ? (formData.get("name") as string)
                : "",
        email:
            typeof formData.get("email") === "string"
                ? (formData.get("email") as string)
                : "",
        phone:
            typeof formData.get("phone") === "string"
                ? (formData.get("phone") as string)
                : undefined,
        course_interest:
            typeof formData.get("course_interest") === "string"
                ? (formData.get("course_interest") as string)
                : undefined,
        message: combinedMessage || undefined,
    });

    if (!parsed.success) {
        return {
            error:
                parsed.error.issues[0]?.message ||
                "Please check your form details and try again.",
        };
    }

    if (requireMessage) {
        if (rawSubject.length < 2) {
            return { error: "Subject must be at least 2 characters." };
        }
        if (rawSubject.length > 200) {
            return { error: "Subject must not exceed 200 characters." };
        }
        if (rawMessage.length < 5) {
            return {
                error: "Please enter a message of at least 5 characters.",
            };
        }
        if (rawMessage.length > 4500) {
            return {
                error: "Message must not exceed 4,500 characters.",
            };
        }
    }

    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
        return {
            error: "Submission service is temporarily unavailable. Please contact the college office directly.",
        };
    }

    try {
        // Uses the ordinary SSR/anon Supabase client under `inquiries_public_insert` RLS.
        // Intentionally omits `.select()` because `anon` has INSERT-only access (zero SELECT on student PII).
        const supabase = await createClient();
        const { error } = await supabase.from("inquiries").insert({
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone || null,
            course_interest: parsed.data.course_interest || null,
            message: parsed.data.message || null,
            status: "new",
        });

        if (error) {
            console.error("Public inquiry insert failed:", error.code);
            return {
                error: "Failed to submit inquiry. Please try again later.",
            };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/admissions");
        revalidatePath("/admin/messages");

        return {
            success: true,
            message: requireMessage
                ? "Thank you! Your message has been received by the JCMCSIIT office."
                : "Thank you! Our admissions counselor will contact you shortly.",
        };
    } catch {
        return {
            error: "An unexpected error occurred. Please try again later.",
        };
    }
}

const PROGRAM_LABELS: Record<string, string> = {
    btech: "B.Tech Engineering",
    mtech: "M.Tech (PG)",
};

const DEPARTMENT_LABELS: Record<string, string> = {
    aiml: "Artificial Intelligence & Machine Learning",
    bme: "Biomedical & Robotic Engineering",
    cse: "Computer Science & Engineering",
    ece: "Electronics & Communication Engineering",
    eee: "Electrical & Electronics Engineering",
    me: "Mechanical Engineering",
    ce: "Civil Engineering",
};

export async function submitAdmissionLead(
    formData: FormData
): Promise<PublicInquiryResult> {
    if (!(formData instanceof FormData)) {
        return { error: "Invalid submission payload." };
    }

    // When submitted from the structured Admission Enquiry Form (`program` / `department` fields present),
    // validate both selections and phone number on the server and compose `course_interest`.
    const hasStructuredProgramFields =
        formData.has("program") || formData.has("department");

    if (hasStructuredProgramFields) {
        const rawPhone = normalizeInlineText(
            typeof formData.get("phone") === "string"
                ? (formData.get("phone") as string)
                : ""
        );
        if (!rawPhone) {
            return { error: "Phone number is required." };
        }

        const rawProgram = normalizeInlineText(
            typeof formData.get("program") === "string"
                ? (formData.get("program") as string)
                : ""
        ).toLowerCase();
        const programLabel = PROGRAM_LABELS[rawProgram];
        if (!programLabel) {
            return { error: "Please select a valid academic program." };
        }

        const rawDepartment = normalizeInlineText(
            typeof formData.get("department") === "string"
                ? (formData.get("department") as string)
                : ""
        ).toLowerCase();
        const departmentLabel = DEPARTMENT_LABELS[rawDepartment];
        if (!departmentLabel) {
            return { error: "Please select a valid preferred department." };
        }

        const normalizedFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            if (key !== "program" && key !== "department" && key !== "course_interest") {
                normalizedFormData.append(key, value);
            }
        }
        normalizedFormData.set(
            "course_interest",
            `${programLabel} — ${departmentLabel}`
        );

        return persistPublicInquiry(normalizedFormData, false);
    }

    return persistPublicInquiry(formData, false);
}

export async function submitContactMessage(
    formData: FormData
): Promise<PublicInquiryResult> {
    if (!(formData instanceof FormData)) {
        return { error: "Invalid submission payload." };
    }

    // Build a sanitized FormData that explicitly omits `course_interest`, `program`,
    // and `department` so contact messages always persist with `course_interest = null`
    // and route strictly to `/admin/messages` (never misclassified as admission leads).
    const sanitizedContactData = new FormData();
    for (const [key, value] of formData.entries()) {
        if (
            key !== "course_interest" &&
            key !== "program" &&
            key !== "department"
        ) {
            sanitizedContactData.append(key, value);
        }
    }

    return persistPublicInquiry(sanitizedContactData, true);
}
