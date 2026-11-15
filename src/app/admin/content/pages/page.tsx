import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import PagesManager from "./pages-manager";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: pages, error } = await supabase
        .from("pages")
        .select(
            "id, slug, route_path, title, subtitle, summary, content, status, integration_status, is_published, updated_at"
        )
        .order("updated_at", { ascending: false });

    const refreshKey = (pages || [])
        .map((p) => `${p.id}:${p.updated_at}`)
        .join("|");

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Website Pages"
                title="Universal Page Registry"
                description="Create, draft, and publish page records in public.pages. Public static routes remain preserved until explicitly bound."
            />

            <AdminHonestNotice
                title="Public Route Preservation Active"
                variant="pending"
            >
                Records saved here persist directly to{" "}
                <code className="text-[#E5C158]">public.pages</code> via your
                SSR session. Existing code-managed public pages (~160 static
                routes) remain untouched until per-route frontend binding is
                enabled in a subsequent migration step.
            </AdminHonestNotice>

            {error ? (
                <AdminHonestNotice
                    title="Unable to load pages"
                    variant="restricted"
                >
                    {error.message}
                </AdminHonestNotice>
            ) : null}

            <PagesManager
                key={refreshKey}
                initialPages={pages || []}
                role={admin.role}
            />
        </div>
    );
}
