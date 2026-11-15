import { Metadata } from "next";
import { requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { UsersManager, type AdminUserRow } from "./users-manager";

export const metadata: Metadata = {
    title: "Staff & Administrators | JCMCSIIT CMS",
    description: "SUPER_ADMIN governance for CMS staff and administrators.",
};

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const currentSuperAdmin = await requireAdminRole(["SUPER_ADMIN"], {
        redirectTo: "/admin/login",
        forbiddenRedirectTo: "/admin",
    });

    const supabase = await createClient();
    const { data: members } = await supabase
        .from("admin_users")
        .select(
            "id, email, full_name, role, is_active, last_login_at, created_at"
        )
        .order("created_at", { ascending: true });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="SUPER_ADMIN Exclusive"
                title="Staff & Administrators"
                description="Manage allowlisted CMS staff roles (SUPER_ADMIN, ADMIN, PUBLISHER, EDITOR) and account activation status in public.admin_users."
            />

            <AdminHonestNotice
                title="Protected Allowlist Governance (Zero Service-Role Key Exposure)"
                variant="pending"
            >
                Role and active-status updates below execute via your{" "}
                <code className="text-[#E5C158]">SUPER_ADMIN</code> SSR session
                under <code className="text-[#E5C158]">admin_users_super_admin_all</code>{" "}
                and <code className="text-zinc-200">trg_protect_last_super_admin</code>.
                In-app email invitation of brand-new Supabase Auth users is not
                implemented yet so that ordinary CMS pages never invoke the
                service-role key; create new Auth accounts in Supabase Dashboard
                → Authentication first, then insert their UUID into{" "}
                <code className="text-zinc-200">public.admin_users</code>.
            </AdminHonestNotice>

            <UsersManager
                members={(members ?? []) as AdminUserRow[]}
                currentAdminId={currentSuperAdmin.id}
            />
        </div>
    );
}
