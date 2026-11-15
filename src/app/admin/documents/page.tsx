import { FileSpreadsheet } from "lucide-react";
import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminEmptyState,
    AdminHonestNotice,
    AdminPageHeader,
    AdminStatusBadge,
} from "@/components/admin/admin-primitives";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default async function AdminDocumentsPage() {
    await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: documents } = await supabase
        .from("media")
        .select(
            "id, bucket_id, original_filename, public_url, mime_type, size_bytes, caption, is_archived, created_at"
        )
        .in("bucket_id", ["cms-documents", "pdfs"])
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Documents & PDFs"
                title="Institutional Document Repository"
                description="Inspect official PDFs, mandatory disclosures, AICTE/KTU approvals, and syllabi registered in public.media."
            />

            <AdminHonestNotice
                title="Direct PDF Storage Uploader — Coming Soon"
                variant="pending"
            >
                Supabase Storage buckets{" "}
                <code className="text-[#E5C158]">cms-documents</code> and{" "}
                <code className="text-[#E5C158]">pdfs</code> (15 MB PDF-only
                RLS policy) are live in PostgreSQL, and this table reads live
                rows from <code className="text-[#E5C158]">public.media</code>.
                Interactive browser PDF upload & SHA-256 deduplication UI is
                not implemented yet; meanwhile, PDF links can be attached
                directly in Courses and Notices, and all existing static PDFs in{" "}
                <code className="text-zinc-200">/public</code> remain untouched.
            </AdminHonestNotice>

            {(documents ?? []).length === 0 ? (
                <AdminEmptyState
                    icon={FileSpreadsheet}
                    title="No CMS PDF Uploads Registered Yet"
                    description="When PDFs are uploaded into the cms-documents or pdfs Supabase Storage buckets, their metadata, file sizes, and public download URLs appear here automatically."
                />
            ) : (
                <div className="rounded-2xl border border-white/[0.07] bg-[#12141C] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.07] bg-[#0E1017]">
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Document Filename
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Bucket
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Size
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        State
                                    </th>
                                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Link
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05] text-xs">
                                {(documents ?? []).map((doc) => (
                                    <tr
                                        key={doc.id}
                                        className="hover:bg-white/[0.02]"
                                    >
                                        <td className="px-5 py-3.5 font-medium text-zinc-100">
                                            {doc.original_filename}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-[#E5C158]">
                                            {doc.bucket_id}
                                        </td>
                                        <td className="px-5 py-3.5 text-zinc-400">
                                            {formatBytes(
                                                Number(doc.size_bytes ?? 0)
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <AdminStatusBadge
                                                status={
                                                    doc.is_archived
                                                        ? "archived"
                                                        : "active"
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <a
                                                href={doc.public_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold text-[#E5C158] hover:underline"
                                            >
                                                Open PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
