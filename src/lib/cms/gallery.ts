import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
    GALLERY_CATEGORIES,
    type GalleryCategory,
    type PublicGalleryItem,
    type PublicGalleryAlbum,
    BASELINE_GALLERY_ITEMS,
    BASELINE_GALLERY_ALBUMS,
} from "@/types/gallery";

export {
    GALLERY_CATEGORIES,
    type GalleryCategory,
    type PublicGalleryItem,
    type PublicGalleryAlbum,
    BASELINE_GALLERY_ITEMS,
    BASELINE_GALLERY_ALBUMS,
};

export type GalleryQueryOptions = {
    category?: string;
    album?: string;
    limit?: number;
};

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

/**
 * Fetches gallery items from `public.gallery_items`, optionally filtered by category or album.
 */
export const getPublicGalleryItems = cache(
    async (
        categoryOrOptions?: string | GalleryQueryOptions,
        options?: { limit?: number; album?: string }
    ): Promise<PublicGalleryItem[]> => {
        const category =
            typeof categoryOrOptions === "string"
                ? categoryOrOptions
                : categoryOrOptions?.category;
        const album =
            typeof categoryOrOptions === "object"
                ? categoryOrOptions?.album
                : options?.album;
        const limit =
            typeof categoryOrOptions === "object"
                ? categoryOrOptions?.limit
                : options?.limit;

        const filterBaseline = () => {
            let items = BASELINE_GALLERY_ITEMS;
            if (category && category !== "All") {
                items = items.filter(
                    (i) => i.category.toLowerCase() === category.toLowerCase()
                );
            }
            if (album && album !== "All") {
                const normAlbum = album.toLowerCase();
                items = items.filter(
                    (i) =>
                        i.album_name?.toLowerCase() === normAlbum ||
                        slugify(i.album_name || "") === normAlbum
                );
            }
            items.sort((a, b) => a.sort_order - b.sort_order);
            return limit && limit > 0 ? items.slice(0, limit) : items;
        };

        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return filterBaseline();
        }

        try {
            const supabase = await createClient();
            let query = supabase
                .from("gallery_items")
                .select("id, title, caption, category, album_name, image_url, sort_order, status, created_at")
                .eq("status", "published")
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false });

            if (category && category !== "All") {
                query = query.ilike("category", category);
            }

            if (album && album !== "All") {
                query = query.ilike("album_name", album);
            }

            if (limit && limit > 0) {
                query = query.limit(limit);
            }

            const { data, error } = await query;

            if (error || !Array.isArray(data) || data.length === 0) {
                return filterBaseline();
            }

            const items: PublicGalleryItem[] = data.map((item) => ({
                id: item.id,
                title: item.title,
                caption: item.caption,
                category: item.category || "Campus",
                album_name: item.album_name,
                image_url: item.image_url,
                sort_order: item.sort_order ?? 0,
                status: item.status,
                created_at: item.created_at,
            }));

            return items;
        } catch {
            return filterBaseline();
        }
    }
);

/**
 * Fetches gallery albums:
 * 1. Checks `public.gallery_albums` if the table exists.
 * 2. Checks `public.content_blocks` (prefix `gallery_album_`).
 * 3. Derives albums dynamically from `gallery_items`.
 * 4. Merges with `BASELINE_GALLERY_ALBUMS` as fallback.
 */
export const getPublicGalleryAlbums = cache(
    async (categoryFilter?: string): Promise<PublicGalleryAlbum[]> => {
        const albumsMap = new Map<string, PublicGalleryAlbum>();

        // 1. Populate baseline albums
        for (const base of BASELINE_GALLERY_ALBUMS) {
            albumsMap.set(base.slug, { ...base });
        }

        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();

                // Attempt to query formal table `gallery_albums`
                const { data: dbAlbums, error: dbError } = await supabase
                    .from("gallery_albums")
                    .select("*")
                    .eq("status", "published")
                    .order("sort_order", { ascending: true });

                if (!dbError && Array.isArray(dbAlbums) && dbAlbums.length > 0) {
                    for (const row of dbAlbums) {
                        const albumSlug = row.slug || slugify(row.title);
                        albumsMap.set(albumSlug, {
                            id: row.id,
                            title: row.title,
                            slug: albumSlug,
                            description: row.description,
                            category: row.category || "College Events",
                            event_date: row.event_date,
                            cover_image_url: row.cover_image_url,
                            sort_order: row.sort_order ?? 0,
                            status: row.status,
                            photo_count: 0,
                        });
                    }
                }

                // Check content blocks fallback for albums created before formal table migration
                const { data: blocks } = await supabase
                    .from("content_blocks")
                    .select("key, content, structured_data, status")
                    .like("key", "gallery_album_%")
                    .eq("status", "published");

                if (Array.isArray(blocks)) {
                    for (const b of blocks) {
                        const raw = b.structured_data as Record<string, unknown> | null;
                        if (raw && typeof raw.title === "string") {
                            const albumSlug = (raw.slug as string) || slugify(raw.title);
                            albumsMap.set(albumSlug, {
                                id: b.key,
                                title: raw.title,
                                slug: albumSlug,
                                description: (raw.description as string) || null,
                                category: (raw.category as string) || "College Events",
                                event_date: (raw.event_date as string) || null,
                                cover_image_url: (raw.cover_image_url as string) || null,
                                sort_order: Number(raw.sort_order) || 0,
                                status: b.status,
                                photo_count: 0,
                            });
                        }
                    }
                }
            } catch {
                // Non-blocking, continue with in-memory derivation
            }
        }

        // Attach actual photo counts & cover image fallbacks from live published items
        const allItems = await getPublicGalleryItems();
        for (const item of allItems) {
            if (!item.album_name) continue;
            const albumSlug = slugify(item.album_name);
            let album = albumsMap.get(albumSlug);

            if (!album) {
                // Auto-derive album from photos if not yet formally registered
                album = {
                    id: `derived-${albumSlug}`,
                    title: item.album_name,
                    slug: albumSlug,
                    category: item.category || "Campus",
                    cover_image_url: item.image_url,
                    sort_order: 100,
                    status: "published",
                    photo_count: 0,
                };
                albumsMap.set(albumSlug, album);
            }

            album.photo_count = (album.photo_count || 0) + 1;
            if (!album.cover_image_url) {
                album.cover_image_url = item.image_url;
            }
        }

        let albums = Array.from(albumsMap.values());

        if (categoryFilter && categoryFilter !== "All") {
            albums = albums.filter(
                (a) => a.category.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        albums.sort((a, b) => a.sort_order - b.sort_order);
        return albums;
    }
);

/**
 * Resolves gallery categories and photo counts.
 */
export const getPublicGalleryCategories = cache(
    async (): Promise<{ name: string; count: number }[]> => {
        const items = await getPublicGalleryItems();
        const counts: Record<string, number> = {};

        for (const cat of GALLERY_CATEGORIES) {
            counts[cat] = 0;
        }

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
