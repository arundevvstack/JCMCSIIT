import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicInstitutionalPage {
    id: string;
    slug: string;
    route_path: string;
    title: string;
    subtitle?: string | null;
    summary?: string | null;
    content: string;
    template_type: string;
    hero_image_url?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    status: string;
    is_published: boolean;
    updated_at: string;
}

/**
 * Normalizes route path by trimming leading/trailing slashes and prepending a single slash.
 */
function normalizeRoutePath(path: string): string {
    const trimmed = path.trim().replace(/^\/+|\/+$/g, "");
    if (!trimmed || trimmed.toLowerCase() === "home") return "/";
    return `/${trimmed}`;
}

/**
 * Resolves a dynamic CMS-managed page by its route path (e.g. '/about/history', '/privacy').
 * Returns null if Supabase is offline or if no published record matches the path.
 */
export const getPublicPageByRoute = cache(
    async (routePath: string): Promise<PublicInstitutionalPage | null> => {
        const cleanPath = normalizeRoutePath(routePath);

        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return null;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("pages")
                .select(
                    "id, slug, route_path, title, subtitle, summary, content, template_type, hero_image_url, seo_title, seo_description, status, is_published, updated_at"
                )
                .or(`route_path.eq.${cleanPath},slug.eq.${cleanPath.replace(/^\//, "")}`)
                .eq("is_published", true)
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error || !data) {
                return null;
            }

            return {
                id: data.id,
                slug: data.slug,
                route_path: data.route_path || cleanPath,
                title: data.title,
                subtitle: data.subtitle,
                summary: data.summary,
                content: data.content || "",
                template_type: data.template_type || "content_layout",
                hero_image_url: data.hero_image_url,
                seo_title: data.seo_title,
                seo_description: data.seo_description,
                status: data.status || "published",
                is_published: Boolean(data.is_published),
                updated_at: data.updated_at,
            };
        } catch {
            return null;
        }
    }
);

/**
 * Resolves a dynamic page by its slug.
 */
export const getPublicPageBySlug = cache(
    async (slug: string): Promise<PublicInstitutionalPage | null> => {
        const cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, "");

        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return null;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("pages")
                .select(
                    "id, slug, route_path, title, subtitle, summary, content, template_type, hero_image_url, seo_title, seo_description, status, is_published, updated_at"
                )
                .eq("slug", cleanSlug)
                .eq("is_published", true)
                .maybeSingle();

            if (error || !data) {
                return null;
            }

            return {
                id: data.id,
                slug: data.slug,
                route_path: data.route_path || `/${data.slug}`,
                title: data.title,
                subtitle: data.subtitle,
                summary: data.summary,
                content: data.content || "",
                template_type: data.template_type || "content_layout",
                hero_image_url: data.hero_image_url,
                seo_title: data.seo_title,
                seo_description: data.seo_description,
                status: data.status || "published",
                is_published: Boolean(data.is_published),
                updated_at: data.updated_at,
            };
        } catch {
            return null;
        }
    }
);
