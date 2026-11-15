import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";

export default async function AdminContentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    return <>{children}</>;
}
