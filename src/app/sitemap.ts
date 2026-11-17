import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://jcmcsiit.ac.in";

    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: `${baseUrl}/admissions`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/academics/departments`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/academics/faculty`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about/college/principal`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
        return routes;
    }

    try {
        const supabase = await createClient();

        const [departmentsRes, newsRes, eventsRes] = await Promise.all([
            supabase.from("departments").select("slug, updated_at"),
            supabase.from("news").select("slug, updated_at"),
            supabase.from("events").select("slug, updated_at"),
        ]);

        for (const dept of departmentsRes.data ?? []) {
            routes.push({
                url: `${baseUrl}/academics/departments/${dept.slug}`,
                lastModified: new Date(dept.updated_at || Date.now()),
                changeFrequency: "monthly",
                priority: 0.7,
            });
        }

        for (const article of newsRes.data ?? []) {
            routes.push({
                url: `${baseUrl}/news-events/news/${article.slug}`,
                lastModified: new Date(article.updated_at || Date.now()),
                changeFrequency: "weekly",
                priority: 0.6,
            });
        }

        for (const ev of eventsRes.data ?? []) {
            routes.push({
                url: `${baseUrl}/news-events/events/${ev.slug}`,
                lastModified: new Date(ev.updated_at || Date.now()),
                changeFrequency: "weekly",
                priority: 0.6,
            });
        }
    } catch {
        // Return static baseline sitemap safely if Supabase is unreachable.
    }

    return routes;
}
