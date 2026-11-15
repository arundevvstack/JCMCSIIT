import { Metadata } from "next";
import { signOutAdmin } from "@/actions/auth";
import { getCurrentAdmin } from "@/lib/auth/rbac";
import { AdminShell } from "./admin-shell";

export const metadata: Metadata = {
    title: "CMS Admin | JCMCSIIT",
    description: "Content Management System for JCMCSIIT",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const admin = await getCurrentAdmin();

    return (
        <AdminShell admin={admin} signOutAction={signOutAdmin}>
            {children}
        </AdminShell>
    );
}
