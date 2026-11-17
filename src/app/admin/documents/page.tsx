import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import {
    DocumentsLibraryManager,
    type DocumentAssetRecord,
} from "./documents-library-manager";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("media")
        .select(
            "id, bucket_id, storage_path, original_filename, public_url, mime_type, size_bytes, alt_text, caption, uploaded_by, is_archived, created_at, updated_at"
        )
        .in("bucket_id", ["cms-documents", "pdfs"])
        .order("created_at", { ascending: false })
        .limit(200);

    const documents = (data ?? []) as DocumentAssetRecord[];

    const docRefreshKey = documents
        .map((d) => `${d.id}:${d.updated_at ?? d.created_at}`)
        .join("|");

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Documents & PDFs"
                title="Institutional Document Repository"
                description="Manage official PDFs, mandatory disclosures, AICTE/KTU approvals, syllabi, and academic circulars registered in public.media."
            />

            <AdminHonestNotice
                title="Supabase Storage Document Pipeline"
                variant="info"
            >
                Official PDF assets are stored in Supabase Storage buckets{" "}
                <code className="text-[#E5C158]">cms-documents</code> and{" "}
                <code className="text-[#E5C158]">pdfs</code> (15 MB PDF-only
                storage policy). Every upload undergoes binary magic-byte
                verification (<code className="text-zinc-200">%PDF-</code>),
                SHA-256 duplicate checking, and metadata registration in{" "}
                <code className="text-[#E5C158]">public.media</code>.
            </AdminHonestNotice>

            <DocumentsLibraryManager
                key={docRefreshKey}
                initialDocuments={documents}
                role={admin.role}
                currentAdminId={admin.id}
                loadError={error ? error.message : null}
            />
        </div>
    );
}
