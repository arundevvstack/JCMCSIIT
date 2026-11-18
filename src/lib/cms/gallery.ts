import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicGalleryItem {
    id: string;
    title: string;
    caption?: string | null;
    category: string;
    album_name?: string | null;
    image_url: string;
    sort_order: number;
    status: string;
}

export const BASELINE_GALLERY_ITEMS: PublicGalleryItem[] = [
    {
        id: "gallery-1",
        title: "Amazon Placement Drive",
        category: "Placements",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Amazon%20Placement%20Drive%20on%2001082025%20Friday/amazon%202025.jpeg",
        sort_order: 1,
        status: "published",
    },
    {
        id: "gallery-2",
        title: "Annual Athletic Meet",
        category: "Sports",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Annual%20Athletic%20Meet/IMG-20250320-WA0093.jpg",
        sort_order: 2,
        status: "published",
    },
    {
        id: "gallery-3",
        title: "Bishops Visit our college",
        category: "Campus",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Bishops%20Visit%20%20our%20college/WhatsApp%20Image%202025-06-04%20at%2016.20.50.jpeg",
        sort_order: 3,
        status: "published",
    },
    {
        id: "gallery-4",
        title: "Congratulations POWER QUIZ WINNERS",
        category: "Events",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Congratulations%20POWER%20QUIZ%20WINNERS/WhatsApp%20Image%202025-11-10%20at%2018.41.59-imageonline.co-merged.jpeg",
        sort_order: 4,
        status: "published",
    },
    {
        id: "gallery-5",
        title: "Interactive Session on Sustainable Lifestyle",
        category: "Events",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Interactive%20Session%20on%20Sustainable%20Lifestyle/WhatsApp%20Image%202025-02-14%20at%2012.09.19_00c566ec.jpg",
        sort_order: 5,
        status: "published",
    },
    {
        id: "gallery-6",
        title: "JIT Campus Pool Recruitment 2026",
        category: "Placements",
        album_name: "2026",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20Campus%20Pool%20Recruitment%202026/WhatsApp%20Image%202026-01-12%20at%2021.34.10.jpeg",
        sort_order: 6,
        status: "published",
    },
    {
        id: "gallery-7",
        title: "JIT ROBOGREET 2026",
        category: "Events",
        album_name: "2026",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20ROBOGREET%202026/WhatsApp%20Image%202025-12-31%20at%2018.26.31.jpeg",
        sort_order: 7,
        status: "published",
    },
    {
        id: "gallery-8",
        title: "JIT Super League 25",
        category: "Sports",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20Super%20League%2025/CRICKET%20RUNNER-UP%20RUBY%20HOUSE.jpg",
        sort_order: 8,
        status: "published",
    },
    {
        id: "gallery-9",
        title: "Liver Foundation of Kerala",
        category: "Events",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Liver%20Foundation%20of%20Kerala/IMG-20250320-WA0098.jpg",
        sort_order: 9,
        status: "published",
    },
    {
        id: "gallery-10",
        title: "Mega Placement Drive 2025",
        category: "Placements",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Mega%20Placement%20Drive%202025/Campus%20Placement%20Drive'25.jpeg",
        sort_order: 10,
        status: "published",
    },
    {
        id: "gallery-11",
        title: "Nabhas 2K25",
        category: "Cultural Fest",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/Nabhas%202K25/IMG-20250320-WA0074.jpg",
        sort_order: 11,
        status: "published",
    },
    {
        id: "gallery-12",
        title: "SAYONARA 2K25",
        category: "Cultural Fest",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/SAYONARA%202K25/20250327_160913.jpg",
        sort_order: 12,
        status: "published",
    },
    {
        id: "gallery-13",
        title: "TECHNO VISTA 2025 National Conference",
        category: "Events",
        album_name: "2025",
        image_url: "https://jcmcsiit.ac.in/Photogallery/2025/TECHNO%20VISTA%202025%20%20National%20Conference/IMG-20250324-WA0037.jpg",
        sort_order: 13,
        status: "published",
    },
];

export type GalleryQueryOptions = {
    category?: string;
    limit?: number;
};

/**
 * Fetches gallery items from `public.gallery_items`, optionally filtered by category or limited in count.
 */
export const getPublicGalleryItems = cache(
    async (
        categoryOrOptions?: string | GalleryQueryOptions,
        options?: { limit?: number }
    ): Promise<PublicGalleryItem[]> => {
        const category =
            typeof categoryOrOptions === "string"
                ? categoryOrOptions
                : categoryOrOptions?.category;
        const limit =
            typeof categoryOrOptions === "object"
                ? categoryOrOptions?.limit
                : options?.limit;

        let items: PublicGalleryItem[] = [];

        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            if (category && category !== "All") {
                items = BASELINE_GALLERY_ITEMS.filter(
                    (item) => item.category.toLowerCase() === category.toLowerCase()
                );
            } else {
                items = BASELINE_GALLERY_ITEMS;
            }
            return limit && limit > 0 ? items.slice(0, limit) : items;
        }

        try {
            const supabase = await createClient();
            let query = supabase
                .from("gallery_items")
                .select("id, title, caption, category, album_name, image_url, sort_order, status")
                .eq("status", "published")
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false });

            if (category && category !== "All") {
                query = query.ilike("category", category);
            }

            if (limit && limit > 0) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error || !Array.isArray(data) || data.length === 0) {
                if (category && category !== "All") {
                    items = BASELINE_GALLERY_ITEMS.filter(
                        (item) => item.category.toLowerCase() === category.toLowerCase()
                    );
                } else {
                    items = BASELINE_GALLERY_ITEMS;
                }
                return limit && limit > 0 ? items.slice(0, limit) : items;
            }

            items = data.map((item) => ({
                id: item.id,
                title: item.title,
                caption: item.caption,
                category: item.category || "Campus",
                album_name: item.album_name,
                image_url: item.image_url,
                sort_order: item.sort_order || 0,
                status: item.status,
            }));

            return limit && limit > 0 ? items.slice(0, limit) : items;
        } catch {
            if (category && category !== "All") {
                items = BASELINE_GALLERY_ITEMS.filter(
                    (item) => item.category.toLowerCase() === category.toLowerCase()
                );
            } else {
                items = BASELINE_GALLERY_ITEMS;
            }
            return limit && limit > 0 ? items.slice(0, limit) : items;
        }
    }
);

/**
 * Resolves gallery categories and photo counts.
 */
export const getPublicGalleryCategories = cache(
    async (): Promise<{ name: string; count: number }[]> => {
        const items = await getPublicGalleryItems();
        const counts: Record<string, number> = {};

        for (const item of items) {
            const cat = item.category || "Campus";
            counts[cat] = (counts[cat] || 0) + 1;
        }

        return Object.entries(counts).map(([name, count]) => ({
            name,
            count,
        }));
    }
);
