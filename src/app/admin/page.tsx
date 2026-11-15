import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient, type DashboardSnapshot } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const isAdminOrSuper =
        admin.role === "SUPER_ADMIN" || admin.role === "ADMIN";
    const isSuperAdmin = admin.role === "SUPER_ADMIN";

    const [
        pagesRes,
        newsRes,
        coursesRes,
        departmentsRes,
        facultyRes,
        eventsRes,
        noticesRes,
        blocksRes,
        mediaRes,
        inquiriesRes,
        adminsRes,
        auditLogsRes,
    ] = await Promise.all([
        supabase.from("pages").select("id", { count: "exact", head: true }),
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase
            .from("departments")
            .select("id", { count: "exact", head: true }),
        supabase.from("faculty").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("notices").select("id", { count: "exact", head: true }),
        supabase
            .from("content_blocks")
            .select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
        isAdminOrSuper
            ? supabase
                  .from("inquiries")
                  .select("id", { count: "exact", head: true })
            : Promise.resolve({ count: null }),
        isSuperAdmin
            ? supabase
                  .from("admin_users")
                  .select("id", { count: "exact", head: true })
                  .eq("is_active", true)
            : Promise.resolve({ count: null }),
        isAdminOrSuper
            ? supabase
                  .from("audit_logs")
                  .select(
                      "id, actor_email, actor_role, action, entity_type, created_at"
                  )
                  .order("created_at", { ascending: false })
                  .limit(8)
            : Promise.resolve({ data: [] }),
    ]);

    const snapshot: DashboardSnapshot = {
        pagesCount: pagesRes.count ?? 0,
        newsCount: newsRes.count ?? 0,
        coursesCount: coursesRes.count ?? 0,
        departmentsCount: departmentsRes.count ?? 0,
        facultyCount: facultyRes.count ?? 0,
        eventsCount: eventsRes.count ?? 0,
        noticesCount: noticesRes.count ?? 0,
        blocksCount: blocksRes.count ?? 0,
        mediaCount: mediaRes.count ?? 0,
        inquiriesCount: inquiriesRes.count ?? null,
        activeAdminsCount: adminsRes.count ?? null,
        recentLogs: (auditLogsRes.data ?? []) as DashboardSnapshot["recentLogs"],
    };

    return <AdminDashboardClient admin={admin} snapshot={snapshot} />;
}
