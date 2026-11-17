import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveGalleryItem, deleteGalleryItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";
import { BASELINE_GALLERY_ITEMS } from "@/lib/cms/gallery";
import {
    MediaLibraryManager,
    type MediaAssetRecord,
} from "./media-library-manager";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const [galleryRes, mediaRes] = await Promise.all([
        supabase
            .from("gallery_items")
            .select(
                "id, title, category, album_name, image_url, caption, status, updated_at"
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
    ]);

    // Fallback to baseline gallery items if database table has not yet been seeded
    const galleryItems =
        galleryRes.data && galleryRes.data.length > 0
            ? galleryRes.data
            : BASELINE_GALLERY_ITEMS;
    const imageAssets = (mediaRes.data ?? []) as MediaAssetRecord[];

    const mediaRefreshKey = imageAssets
        .map((a) => `${a.id}:${a.updated_at ?? a.created_at}`)
        .join("|");

    return (
        <div className="space-y-10">
            <AdminPageHeader
                eyebrow="Gallery & Media Library"
                title="Campus Gallery & Image Assets"
                description="Upload verified images directly to Supabase Storage, manage accessibility metadata in public.media, and curate campus gallery items."
            />

            <AdminHonestNotice
                title="Connected to Supabase Storage & public.media (Authenticated SSR)"
                variant="info"
            >
                Images uploaded below are verified by binary signature, checked
                for SHA-256 duplicates, stored in{" "}
                <code className="text-[#E5C158]">cms-media</code>,{" "}
                <code className="text-[#E5C158]">galleries</code>, or{" "}
                <code className="text-[#E5C158]">faculty-profiles</code> without
                overwriting existing files, and registered in{" "}
                <code className="text-[#E5C158]">public.media</code>. All
                existing static images in{" "}
                <code className="text-zinc-200">/public</code> remain untouched.
            </AdminHonestNotice>

            <section className="space-y-3">
                <h2 className="text-base font-bold text-zinc-100">
                    Storage Image Library (public.media)
                </h2>
                <MediaLibraryManager
                    key={mediaRefreshKey}
                    initialAssets={imageAssets}
                    role={admin.role}
                    currentAdminId={admin.id}
                    loadError={mediaRes.error?.message ?? null}
                />
            </section>

            <section className="space-y-3">
                <h2 className="text-base font-bold text-zinc-100">
                    Campus Gallery Items (public.gallery_items)
                </h2>
                <CmsCollectionManager
                    entityLabel="Gallery Item"
                    role={admin.role}
                    items={galleryItems as Record<string, unknown>[]}
                    searchKeys={["title", "category", "album_name"]}
                    columns={[
                        { key: "image_url", label: "Preview", isImage: true },
                        { key: "title", label: "Title" },
                        { key: "category", label: "Category" },
                        { key: "album_name", label: "Album" },
                        { key: "status", label: "Status", isStatus: true },
                    ]}
                    fields={[
                        {
                            name: "title",
                            label: "Photo Title",
                            type: "text",
                            required: true,
                            placeholder: "Main Academic Block Aerial View",
                        },
                        {
                            name: "category",
                            label: "Category",
                            type: "text",
                            defaultValue: "Campus",
                            placeholder: "Campus / Labs / Convocation / Sports",
                        },
                        {
                            name: "album_name",
                            label: "Album Name (Optional)",
                            type: "text",
                            placeholder: "Graduation 2026",
                        },
                        {
                            name: "status",
                            label: "Workflow Status",
                            type: "select",
                            defaultValue: "draft",
                        },
                        {
                            name: "image_url",
                            label: "Image URL or Public Asset Path",
                            type: "url",
                            required: true,
                            placeholder: "/campus/aerial-main.jpg",
                            colSpan: 2,
                            mediaPicker: {
                                category: "image",
                                allowedBuckets: ["galleries", "cms-media"],
                                modalTitle: "Select Campus Gallery Photo",
                            },
                        },
                        {
                            name: "caption",
                            label: "Caption",
                            type: "textarea",
                            placeholder: "Optional descriptive caption...",
                        },
                    ]}
                    saveAction={saveGalleryItem}
                    deleteAction={deleteGalleryItem}
                />
            </section>
        </div>
    );
}
