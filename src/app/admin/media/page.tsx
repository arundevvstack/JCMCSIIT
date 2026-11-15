import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveGalleryItem, deleteGalleryItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
    AdminStatusBadge,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const [{ data: galleryItems }, { data: imageAssets }] = await Promise.all([
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
                "id, bucket_id, original_filename, public_url, mime_type, size_bytes, is_archived, created_at"
            )
            .in("bucket_id", ["cms-media", "galleries", "faculty-profiles"])
            .order("created_at", { ascending: false })
            .limit(30),
    ]);

    return (
        <div className="space-y-8">
            <AdminPageHeader
                eyebrow="Gallery & Media Library"
                title="Campus Gallery & Image Assets"
                description="Manage curated campus gallery items in public.gallery_items and inspect registered Storage assets in public.media."
            />

            <AdminHonestNotice
                title="Direct Binary Image Upload & WebP Compression Pipeline — Coming Soon"
                variant="pending"
            >
                Gallery entries below save directly to{" "}
                <code className="text-[#E5C158]">public.gallery_items</code>{" "}
                using Storage or static asset URLs. Drag-and-drop browser binary
                uploads with client-side WebP compression to the{" "}
                <code className="text-zinc-200">cms-media</code> and{" "}
                <code className="text-zinc-200">galleries</code> buckets are
                not implemented yet.
            </AdminHonestNotice>

            <section className="space-y-3">
                <h2 className="text-base font-bold text-zinc-100">
                    Campus Gallery Items (public.gallery_items)
                </h2>
                <CmsCollectionManager
                    entityLabel="Gallery Item"
                    role={admin.role}
                    items={(galleryItems ?? []) as Record<string, unknown>[]}
                    searchKeys={["title", "category", "album_name"]}
                    columns={[
                        { key: "title", label: "Title" },
                        { key: "category", label: "Category" },
                        { key: "album_name", label: "Album" },
                        { key: "image_url", label: "Image Path", isMono: true },
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

            <section className="rounded-2xl border border-white/[0.07] bg-[#12141C] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.07] bg-[#0E1017] flex items-center justify-between">
                    <h2 className="text-sm font-bold text-zinc-100">
                        Registered Storage Image Assets (public.media)
                    </h2>
                    <span className="text-xs text-zinc-400">
                        {(imageAssets ?? []).length} asset
                        {(imageAssets ?? []).length === 1 ? "" : "s"}
                    </span>
                </div>
                {(imageAssets ?? []).length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-500">
                        No uploaded image records in{" "}
                        <code className="text-zinc-300">public.media</code> yet.
                        All existing static images in{" "}
                        <code className="text-zinc-300">/public</code> remain
                        preserved.
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.05] text-xs">
                        {(imageAssets ?? []).map((asset) => (
                            <div
                                key={asset.id}
                                className="px-6 py-3 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <div className="font-semibold text-zinc-200 truncate">
                                        {asset.original_filename}
                                    </div>
                                    <div className="font-mono text-[11px] text-zinc-500 truncate">
                                        {asset.public_url}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="font-mono text-[11px] text-[#E5C158]">
                                        {asset.bucket_id}
                                    </span>
                                    <AdminStatusBadge
                                        status={
                                            asset.is_archived
                                                ? "archived"
                                                : "active"
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
