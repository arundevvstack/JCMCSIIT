import "server-only";

import { cache } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
    CHAIRMAN_PROFILE_CMS_BLOCK_KEY,
    OFFICIAL_CHAIRMAN_PROFILE,
    type ChairmanProfileData,
} from "@/data/chairman-profile";

const ChairmanProfileOverrideSchema = z.object({
    name: z.string().min(1).optional(),
    designationLine1: z.string().min(1).optional(),
    designation_line1: z.string().min(1).optional(),
    designationLine2: z.string().min(1).optional(),
    designation_line2: z.string().min(1).optional(),
    quote: z.string().optional(),
    quotation: z.string().optional(),
    message: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    imagePath: z.string().min(1).optional(),
    image_url: z.string().min(1).optional(),
});

/**
 * Resolves the Chairman Profile from `public.content_blocks`
 * (`key = 'chairman_profile'`, `status in ('published', 'archived')`),
 * falling back cleanly to `OFFICIAL_CHAIRMAN_PROFILE` without modifying database records.
 */
export const getChairmanProfileContent = cache(
    async (): Promise<{
        data: ChairmanProfileData;
        source: "cms" | "static_default";
    }> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return { data: OFFICIAL_CHAIRMAN_PROFILE, source: "static_default" };
        }

        try {
            const supabase = await createClient();

            // 1. Try unified structured content block: chairman_profile
            const { data: block } = await supabase
                .from("content_blocks")
                .select("content, block_type, structured_data, status")
                .eq("key", CHAIRMAN_PROFILE_CMS_BLOCK_KEY)
                .in("status", ["published", "archived"])
                .maybeSingle();

            if (block) {
                let candidate: unknown = null;
                if (
                    block.structured_data &&
                    typeof block.structured_data === "object" &&
                    Object.keys(block.structured_data as Record<string, unknown>).length > 0
                ) {
                    candidate = block.structured_data;
                } else if (block.block_type === "json" && block.content) {
                    candidate = JSON.parse(block.content);
                }

                if (candidate) {
                    const parsed = ChairmanProfileOverrideSchema.safeParse(candidate);
                    if (parsed.success) {
                        const d = parsed.data;
                        return {
                            data: {
                                name: d.name || OFFICIAL_CHAIRMAN_PROFILE.name,
                                designationLine1:
                                    d.designationLine1 ||
                                    d.designation_line1 ||
                                    OFFICIAL_CHAIRMAN_PROFILE.designationLine1,
                                designationLine2:
                                    d.designationLine2 ||
                                    d.designation_line2 ||
                                    OFFICIAL_CHAIRMAN_PROFILE.designationLine2,
                                quote:
                                    d.quote !== undefined
                                        ? d.quote
                                        : d.quotation !== undefined
                                        ? d.quotation
                                        : OFFICIAL_CHAIRMAN_PROFILE.quote,
                                message:
                                    d.message ||
                                    d.description ||
                                    (block.content && block.block_type !== "json"
                                        ? block.content
                                        : OFFICIAL_CHAIRMAN_PROFILE.message),
                                imagePath:
                                    d.imagePath || d.image_url || OFFICIAL_CHAIRMAN_PROFILE.imagePath,
                            },
                            source: "cms",
                        };
                    }
                } else if (block.content) {
                    return {
                        data: {
                            ...OFFICIAL_CHAIRMAN_PROFILE,
                            message: block.content,
                        },
                        source: "cms",
                    };
                }
            }

            // 2. Try backward-compatible individual blocks
            const { data: individualBlocks } = await supabase
                .from("content_blocks")
                .select("key, content")
                .in("key", [
                    "chairman_name",
                    "chairman_designation",
                    "chairman_quote",
                    "chairman_message",
                    "chairman_image",
                ])
                .in("status", ["published", "archived"]);

            if (individualBlocks && individualBlocks.length > 0) {
                const map: Record<string, string> = {};
                for (const b of individualBlocks) {
                    map[b.key] = b.content;
                }
                const designationParts = map.chairman_designation?.split("\n") || [];
                return {
                    data: {
                        name: map.chairman_name || OFFICIAL_CHAIRMAN_PROFILE.name,
                        designationLine1:
                            designationParts[0] || OFFICIAL_CHAIRMAN_PROFILE.designationLine1,
                        designationLine2:
                            designationParts[1] || OFFICIAL_CHAIRMAN_PROFILE.designationLine2,
                        quote:
                            map.chairman_quote !== undefined
                                ? map.chairman_quote
                                : OFFICIAL_CHAIRMAN_PROFILE.quote,
                        message: map.chairman_message || OFFICIAL_CHAIRMAN_PROFILE.message,
                        imagePath: map.chairman_image || OFFICIAL_CHAIRMAN_PROFILE.imagePath,
                    },
                    source: "cms",
                };
            }
        } catch {
            // Fail safe to official static content if DB is offline or error occurs.
        }

        return { data: OFFICIAL_CHAIRMAN_PROFILE, source: "static_default" };
    }
);
