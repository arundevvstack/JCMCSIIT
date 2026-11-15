import { Metadata } from "next";
import { requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { AuditLogsViewer, type AuditLogRow } from "./audit-logs-viewer";

export const metadata: Metadata = {
    title: "Audit Logs | JCMCSIIT CMS",
    description: "Immutable security and content audit trail.",
};

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
    await requireAdminRole(["SUPER_ADMIN", "ADMIN"], {
        redirectTo: "/admin/login",
        forbiddenRedirectTo: "/admin",
    });

    const supabase = await createClient();
    const { data: logs } = await supabase
        .from("audit_logs")
        .select(
            "id, actor_email, actor_role, action, entity_type, entity_id, ip_address, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(200);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Governance & Compliance"
                title="Immutable Audit Logs"
                description="Read-only ledger of administrator sign-ins, sign-outs, and database mutations captured by PostgreSQL triggers."
            />

            <AdminHonestNotice
                title="Append-Only Ledger Enforced by PostgreSQL Trigger"
                variant="info"
            >
                Every record in{" "}
                <code className="text-[#E5C158]">public.audit_logs</code> is
                protected by{" "}
                <code className="text-zinc-200">trg_audit_logs_immutable</code>{" "}
                — <code className="text-zinc-200">UPDATE</code> and{" "}
                <code className="text-zinc-200">DELETE</code> operations are
                blocked at the database engine level for all roles.
            </AdminHonestNotice>

            <AuditLogsViewer logs={(logs ?? []) as AuditLogRow[]} />
        </div>
    );
}
