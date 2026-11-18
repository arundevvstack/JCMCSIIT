import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicNewsItem {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    content: string;
    category: string;
    featured_image_url?: string | null;
    is_featured: boolean;
    published_at: string;
}

export const BASELINE_NEWS_ITEMS: PublicNewsItem[] = [
    {
        id: "nba-accreditation",
        slug: "nba-accreditation",
        title: "JCMCSIIT Receives NBA Accreditation for ECE Program",
        published_at: "Feb 20, 2026",
        category: "Achievement",
        excerpt:
            "The National Board of Accreditation has officially accredited our Electronics & Communication Engineering program, recognizing our commitment to quality education.",
        content: `The National Board of Accreditation (NBA) has officially granted accreditation to the Electronics & Communication Engineering (ECE) program at JCMCSIIT. This prestigious recognition validates the institution's commitment to maintaining the highest standards of engineering education.\n\nThe accreditation process involved a rigorous assessment of the department's infrastructure, faculty qualifications, curriculum design, research output, and student outcomes. The evaluation committee praised the department for its industry-aligned curriculum and the exceptional placement record of its graduates.\n\n"This accreditation is a testament to the hard work of our faculty, students, and the entire JCMCSIIT community," said the Principal. "We remain committed to continuous improvement and excellence in all our academic programs."\n\nWith this addition, JCMCSIIT now has multiple NBA-accredited programs, reinforcing its position as one of the leading engineering institutions in Kerala.`,
        is_featured: true,
    },
    {
        id: "ai-research-grant",
        slug: "ai-research-grant",
        title: "AI Department Secures ₹50L Research Grant from DST",
        published_at: "Feb 10, 2026",
        category: "Research",
        excerpt:
            "The Department of Science and Technology has awarded a major grant to our AI lab for developing predictive healthcare models.",
        content: `The Department of Science and Technology (DST) has awarded a significant research grant of ₹50 Lakhs to the AI & Machine Learning department at JCMCSIIT. The funding will support a three-year project focused on developing predictive healthcare models using federated learning.\n\nThe project, led by the department faculty, aims to create AI systems that can predict disease outbreaks and patient outcomes while maintaining strict data privacy through decentralized machine learning techniques.\n\n"This grant validates the quality of research we are pursuing at JCMCSIIT," said the project lead. "Our goal is to create AI tools that can be deployed in rural healthcare centers across Kerala, making advanced diagnostics accessible to underserved communities."`,
        is_featured: true,
    },
    {
        id: "microsoft-coe",
        slug: "microsoft-coe",
        title: "Microsoft Center of Excellence Inaugurated on Campus",
        published_at: "Jan 25, 2026",
        category: "Campus News",
        excerpt:
            "A state-of-the-art innovation lab in partnership with Microsoft has been opened to provide hands-on cloud computing experience.",
        content: `A state-of-the-art innovation lab in partnership with Microsoft has been opened to provide hands-on cloud computing, AI, and cybersecurity experience to students across all engineering disciplines.\n\nThe center was inaugurated by industry leaders and college management, setting a new benchmark for corporate-academic collaboration in Trivandrum.`,
        is_featured: false,
    },
];

/**
 * Fetches all published news articles from `public.news`, sorted by `published_at DESC`.
 * Falls back cleanly to `BASELINE_NEWS_ITEMS` if the table is empty or pending.
 */
export const getPublicNewsList = cache(
    async (): Promise<PublicNewsItem[]> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return BASELINE_NEWS_ITEMS;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("news")
                .select(
                    "id, slug, title, excerpt, content, category, featured_image_url, is_featured, published_at"
                )
                .eq("status", "published")
                .order("published_at", { ascending: false });

            if (error || !Array.isArray(data) || data.length === 0) {
                return BASELINE_NEWS_ITEMS;
            }

            return data.map((item) => ({
                id: item.id,
                slug: item.slug,
                title: item.title,
                excerpt: item.excerpt,
                content: item.content,
                category: item.category,
                featured_image_url: item.featured_image_url,
                is_featured: Boolean(item.is_featured),
                published_at: item.published_at
                    ? new Date(item.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                      })
                    : "Recent",
            }));
        } catch {
            return BASELINE_NEWS_ITEMS;
        }
    }
);

/**
 * Resolves a single news article by slug from `public.news` (status='published'),
 * falling back cleanly to the baseline articles if not found in database.
 */
export const getPublicNewsBySlug = cache(
    async (slug: string): Promise<PublicNewsItem | null> => {
        const cleanSlug = slug.trim().toLowerCase();

        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("news")
                    .select(
                        "id, slug, title, excerpt, content, category, featured_image_url, is_featured, published_at"
                    )
                    .eq("slug", cleanSlug)
                    .eq("status", "published")
                    .maybeSingle();

                if (!error && data) {
                    return {
                        id: data.id,
                        slug: data.slug,
                        title: data.title,
                        excerpt: data.excerpt,
                        content: data.content,
                        category: data.category,
                        featured_image_url: data.featured_image_url,
                        is_featured: Boolean(data.is_featured),
                        published_at: data.published_at
                            ? new Date(data.published_at).toLocaleDateString(
                                  "en-US",
                                  {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                  }
                              )
                            : "2026",
                    };
                }
            } catch {
                // Fail closed to baseline
            }
        }

        const baseline = BASELINE_NEWS_ITEMS.find((n) => n.slug === cleanSlug);
        if (baseline) {
            return baseline;
        }

        return {
            id: cleanSlug,
            slug: cleanSlug,
            title: cleanSlug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" "),
            published_at: "2026",
            category: "News",
            content:
                "Full article content will be updated shortly. Please check back soon for the complete story.",
            is_featured: false,
        };
    }
);

/**
 * Resolves a list of public news items, optionally limited to `limit` items.
 */
export const getPublicNews = cache(
    async (options?: { limit?: number }): Promise<PublicNewsItem[]> => {
        const items = await getPublicNewsList();
        if (options?.limit && options.limit > 0) {
            return items.slice(0, options.limit);
        }
        return items;
    }
);
