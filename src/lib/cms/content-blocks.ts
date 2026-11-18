import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicContentBlock {
    id: string;
    key: string;
    title: string;
    block_type: string;
    content: string;
    structured_data?: Record<string, unknown>;
    status: string;
    updated_at?: string;
}

export const BASELINE_CONTENT_BLOCKS: Record<string, PublicContentBlock> = {
    about_vision: {
        id: "baseline-about-vision",
        key: "about_vision",
        title: "Our Vision",
        block_type: "markdown",
        content:
            "To emerge as a center of excellence in engineering education and research, producing innovative leaders who contribute to the technological and socio-economic development of the nation.",
        status: "published",
    },
    about_mission: {
        id: "baseline-about-mission",
        key: "about_mission",
        title: "Our Mission",
        block_type: "markdown",
        content:
            "To provide quality technical education that fosters innovation, critical thinking, and ethical values, producing graduates who are globally competent engineers and responsible citizens.",
        status: "published",
    },
    about_heritage: {
        id: "baseline-about-heritage",
        key: "about_heritage",
        title: "Our Heritage",
        block_type: "markdown",
        content:
            "The institution was established in 2002 under the auspices of the Church of South India (CSI), Diocese of South Kerala, as a memorial to the late Rev. John Cox, a revered church leader and educator who dedicated his life to the upliftment of the community through knowledge.",
        status: "published",
    },
    placement_overview: {
        id: "baseline-placement-overview",
        key: "placement_overview",
        title: "Career Guidance & Placement Unit",
        block_type: "markdown",
        content:
            "Our Career Guidance and Placement Unit (CGPU) ensures every student is industry-ready, securing top-tier offers globally through rigorous training, workshops, and industry collaborations.",
        status: "published",
    },
    admission_helpline: {
        id: "baseline-admission-helpline",
        key: "admission_helpline",
        title: "Admission Helpline",
        block_type: "contact",
        content:
            "For admission enquiries and prospectus, contact our admissions office at Kannammoola, Thiruvananthapuram.",
        status: "published",
    },
    chairman_profile: {
        id: "baseline-chairman-profile",
        key: "chairman_profile",
        title: "Rev. Dr. Princeton Ben Bishop",
        block_type: "profile",
        content:
            "The institution is under the administrative control of the Society for Technical Training (STT) of South Kerala Diocese (SKD) of Church of South India (CSI). The management of the institution is vested with the Governing Body and the Executive Committee headed by the Reverend Chairman & Manager.",
        structured_data: {
            name: "Rev. Dr. Princeton Ben Bishop",
            designation_line1: "Bishop, South Kerala Diocese",
            designation_line2: "Chairman & Manager",
            quote: "",
            message:
                "The institution is under the administrative control of the Society for Technical Training (STT) of South Kerala Diocese (SKD) of Church of South India (CSI). The management of the institution is vested with the Governing Body and the Executive Committee headed by the Reverend Chairman & Manager.",
            image_url: "/images/new chair.jpeg",
        },
        status: "published",
    },
};

/**
 * Resolves a single content block by its unique key.
 * Falls back cleanly to `BASELINE_CONTENT_BLOCKS` if the database record is missing.
 */
export const getPublicContentBlock = cache(
    async (key: string): Promise<PublicContentBlock | null> => {
        const cleanKey = key.trim().toLowerCase();

        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return BASELINE_CONTENT_BLOCKS[cleanKey] || null;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("content_blocks")
                .select("id, key, title, block_type, content, structured_data, status, updated_at")
                .eq("key", cleanKey)
                .in("status", ["published", "archived"])
                .maybeSingle();

            if (error || !data || data.status !== "published") {
                return BASELINE_CONTENT_BLOCKS[cleanKey] || null;
            }

            return {
                id: data.id,
                key: data.key,
                title: data.title,
                block_type: data.block_type || "markdown",
                content: data.content || "",
                structured_data: (data.structured_data as Record<string, unknown>) || {},
                status: data.status,
                updated_at: data.updated_at,
            };
        } catch {
            return BASELINE_CONTENT_BLOCKS[cleanKey] || null;
        }
    }
);

/**
 * Resolves multiple content blocks in a single query by their keys.
 */
export const getPublicContentBlocks = cache(
    async (keys: string[]): Promise<Record<string, PublicContentBlock>> => {
        const cleanKeys = keys.map((k) => k.trim().toLowerCase());
        const result: Record<string, PublicContentBlock> = {};

        // Prepopulate from baseline
        for (const k of cleanKeys) {
            if (BASELINE_CONTENT_BLOCKS[k]) {
                result[k] = BASELINE_CONTENT_BLOCKS[k];
            }
        }

        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
            cleanKeys.length === 0
        ) {
            return result;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("content_blocks")
                .select("id, key, title, block_type, content, structured_data, status, updated_at")
                .in("key", cleanKeys)
                .eq("status", "published");

            if (error || !Array.isArray(data)) {
                return result;
            }

            for (const item of data) {
                result[item.key] = {
                    id: item.id,
                    key: item.key,
                    title: item.title,
                    block_type: item.block_type || "markdown",
                    content: item.content || "",
                    structured_data: (item.structured_data as Record<string, unknown>) || {},
                    status: item.status,
                    updated_at: item.updated_at,
                };
            }

            return result;
        } catch {
            return result;
        }
    }
);
