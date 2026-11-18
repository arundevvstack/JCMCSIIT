import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import {
    BASELINE_GALLERY_ITEMS,
    BASELINE_GALLERY_ALBUMS,
    type PublicGalleryAlbum,
    type PublicGalleryItem,
} from "@/lib/cms/gallery";
import {
    MediaLibraryManager,
    type MediaAssetRecord,
} from "./media-library-manager";
import { GalleryManagementView } from "./gallery-management-view";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const [galleryRes, mediaRes, dbAlbumsRes, blocksRes] = await Promise.all([
        supabase
            .from("gallery_items")
            .select(
                "id, title, category, album_name, image_url, caption, sort_order, status, created_at, updated_at"
            )
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false }),
        supabase
            .from("media")
            .select(
                "id, bucket_id, storage_path, original_filename, public_url, mime_type, size_bytes, width, height, alt_text, caption, uploaded_by, is_archived, created_at, updated_at"
            )
            .in("bucket_id", ["cms-media", "galleries", "faculty-profiles"])
            .order("created_at", { ascending: false })
            .limit(120),
        supabase
            .from("gallery_albums")
            .select("*")
            .order("sort_order", { ascending: true }),
        supabase
            .from("content_blocks")
            .select("key, content, structured_data, status")
            .like("key", "gallery_album_%"),
    ]);

    // Fallback to baseline gallery items if database table has not yet been seeded
    const galleryItems: PublicGalleryItem[] =
        galleryRes.data && galleryRes.data.length > 0
            ? (galleryRes.data as PublicGalleryItem[])
            : BASELINE_GALLERY_ITEMS;
    const imageAssets = (mediaRes.data ?? []) as MediaAssetRecord[];

    // Aggregate admin albums
    const albumsMap = new Map<string, PublicGalleryAlbum>();

    // Baseline albums as defaults
    for (const base of BASELINE_GALLERY_ALBUMS) {
        albumsMap.set(base.title.toLowerCase(), { ...base });
    }

    // DB albums if table exists
    if (!dbAlbumsRes.error && Array.isArray(dbAlbumsRes.data)) {
        for (const row of dbAlbumsRes.data) {
            albumsMap.set(row.title.toLowerCase(), {
                id: row.id,
                title: row.title,
                slug: row.slug || row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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

    // Content blocks albums
    if (!blocksRes.error && Array.isArray(blocksRes.data)) {
        for (const b of blocksRes.data) {
            const raw = b.structured_data as Record<string, unknown> | null;
            if (raw && typeof raw.title === "string") {
                albumsMap.set(raw.title.toLowerCase(), {
                    id: b.key,
                    title: raw.title,
                    slug: (raw.slug as string) || b.key.replace(/^gallery_album_/, ""),
                    description: (raw.description as string) || b.content,
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

    // Count photos per album
    for (const item of galleryItems) {
        if (!item.album_name) continue;
        const key = item.album_name.toLowerCase();
        let alb = albumsMap.get(key);
        if (!alb) {
            alb = {
                id: `derived-${key}`,
                title: item.album_name,
                slug: item.album_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                category: item.category || "Campus",
                cover_image_url: item.image_url,
                sort_order: 100,
                status: "published",
                photo_count: 0,
            };
            albumsMap.set(key, alb);
        }
        alb.photo_count = (alb.photo_count || 0) + 1;
        if (!alb.cover_image_url) {
            alb.cover_image_url = item.image_url;
        }
    }

    const adminAlbums = Array.from(albumsMap.values()).sort(
        (a, b) => a.sort_order - b.sort_order
    );

    const mediaRefreshKey = imageAssets
        .map((a) => `${a.id}:${a.updated_at ?? a.created_at}`)
        .join("|");

    return (
        <div className="space-y-12">
            <AdminPageHeader
                eyebrow="Campus Media & Gallery"
                title="College Photo Gallery & Album Management"
                description="Manage institutional event albums, curate campus photographs with sort ordering, and upload verified media assets directly to Supabase Storage."
            />

            <AdminHonestNotice
                title="Connected to Supabase Storage & public.gallery_items (Authenticated SSR)"
                variant="info"
            >
                Photographs and albums configured here update the public{" "}
                <code className="text-[#E5C158]">/gallery</code> and{" "}
                <code className="text-[#E5C158]">/news-events/gallery</code> pages
                instantly upon publish. Batch uploads are securely verified and stored
                in the <code className="text-[#E5C158]">galleries</code> bucket.
            </AdminHonestNotice>

            {/* Main Interactive Gallery Management Experience */}
            <GalleryManagementView
                initialItems={galleryItems}
                initialAlbums={adminAlbums}
                role={admin.role}
            />

            {/* Storage Media Asset Library (Raw Files & public.media) */}
            <section className="space-y-4 pt-10 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-zinc-100">
                            Storage Media Asset Library (public.media)
                        </h2>
                        <p className="text-xs text-zinc-400">
                            Direct asset inspection, binary signature validation, and metadata for raw storage files across all CMS buckets.
                        </p>
                    </div>
                </div>

                <MediaLibraryManager
                    key={mediaRefreshKey}
                    initialAssets={imageAssets}
                    role={admin.role}
                    currentAdminId={admin.id}
                    loadError={mediaRes.error?.message ?? null}
                />
            </section>
        </div>
    );
}
