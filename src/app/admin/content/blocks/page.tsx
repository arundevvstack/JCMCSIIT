import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import BlocksManager from "./blocks-manager";

export const dynamic = "force-dynamic";

export default async function BlocksPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: blocks, error } = await supabase
        .from("content_blocks")
        .select("id, key, title, block_type, content, status, updated_at")
        .order("updated_at", { ascending: false });

    const refreshKey = (blocks || [])
        .map((b) => `${b.id}:${b.updated_at}`)
        .join("|");

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Content Blocks"
                title="Reusable Institutional Snippets"
                description="Manage keyed markdown, hero, CTA, and contact snippets in public.content_blocks via your authenticated SSR session."
            />

            <AdminHonestNotice
                title="Real Database Persistence — Frontend Binding Controlled Explicitly"
                variant="info"
            >
                Blocks created or updated here are stored directly in{" "}
                <code className="text-[#E5C158]">public.content_blocks</code>{" "}
                with full audit logging and workflow status protection.
            </AdminHonestNotice>

            {error ? (
                <AdminHonestNotice
                    title="Unable to load content blocks"
                    variant="restricted"
                >
                    {error.message}
                </AdminHonestNotice>
            ) : null}

            <BlocksManager
                key={refreshKey}
                initialBlocks={blocks || []}
                role={admin.role}
            />
        </div>
    );
}
