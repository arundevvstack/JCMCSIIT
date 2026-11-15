import "server-only";

import { z } from "zod";
import {
    OFFICIAL_PRINCIPAL_MESSAGE,
    PRINCIPAL_MESSAGE_CMS_BLOCK_KEY,
    type PrincipalMessageData,
} from "@/data/principal-message";
import { createClient } from "@/lib/supabase/server";

const PrincipalMessageOverrideSchema = z.object({
    heading: z.string().min(1).optional(),
    greeting: z.string().min(1).optional(),
    openingQuote: z.string().min(1).optional(),
    paragraphs: z.array(z.string().min(1)).min(1).optional(),
    closingWish: z.string().min(1).optional(),
    principalName: z.string().min(1).optional(),
    designation: z.string().min(1).optional(),
    institutionName: z.string().min(1).optional(),
    additionalRole: z.string().min(1).optional(),
    imagePath: z.string().min(1).optional(),
    imageAlt: z.string().min(1).optional(),
});

/**
 * Resolves the Principal's Message from `public.content_blocks`
 * (`key = 'principal_message'`, `status = 'published'`) when a published
 * JSON override has been saved in the JCMCSIIT CMS, falling back cleanly
 * to `OFFICIAL_PRINCIPAL_MESSAGE` without modifying any database records.
 */
export async function getPrincipalMessageContent(): Promise<{
    data: PrincipalMessageData;
    source: "cms" | "static_default";
}> {
    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
        return { data: OFFICIAL_PRINCIPAL_MESSAGE, source: "static_default" };
    }

    try {
        const supabase = await createClient();
        const { data: block, error } = await supabase
            .from("content_blocks")
            .select("content, block_type, structured_data, status")
            .eq("key", PRINCIPAL_MESSAGE_CMS_BLOCK_KEY)
            .eq("status", "published")
            .maybeSingle();

        if (error || !block) {
            return {
                data: OFFICIAL_PRINCIPAL_MESSAGE,
                source: "static_default",
            };
        }

        let candidate: unknown = null;
        if (
            block.structured_data &&
            typeof block.structured_data === "object" &&
            Object.keys(block.structured_data as Record<string, unknown>)
                .length > 0
        ) {
            candidate = block.structured_data;
        } else if (block.block_type === "json" && block.content) {
            candidate = JSON.parse(block.content);
        }

        if (candidate) {
            const parsed = PrincipalMessageOverrideSchema.safeParse(candidate);
            if (parsed.success) {
                return {
                    data: {
                        ...OFFICIAL_PRINCIPAL_MESSAGE,
                        ...parsed.data,
                    },
                    source: "cms",
                };
            }
        }
    } catch {
        // Fail safe to official static content if DB is offline or JSON is malformed.
    }

    return { data: OFFICIAL_PRINCIPAL_MESSAGE, source: "static_default" };
}
