import { Metadata } from "next";
import { requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { SettingsManager, type SiteSettingRow } from "./settings-manager";

export const metadata: Metadata = {
    title: "Settings | JCMCSIIT CMS",
    description: "Global institutional configuration in public.site_settings.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    await requireAdminRole(["SUPER_ADMIN", "ADMIN"], {
        redirectTo: "/admin/login",
        forbiddenRedirectTo: "/admin",
    });

    const supabase = await createClient();
    const { data: settings } = await supabase
        .from("site_settings")
        .select("key, category, value_json, description, is_public, updated_at")
        .order("category", { ascending: true })
        .order("key", { ascending: true });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="System Configuration"
                title="Institutional Site Settings"
                description="Manage structured JSONB settings in public.site_settings with public/internal RLS visibility controls."
            />

            <AdminHonestNotice
                title="Connected to public.site_settings (Admin & Super Admin Only)"
                variant="info"
            >
                Keys with <code className="text-[#E5C158]">is_public = true</code>{" "}
                are readable by public pages once bound; internal keys (
                <code className="text-zinc-200">is_public = false</code>) remain
                strictly hidden from anonymous queries via PostgreSQL RLS.
            </AdminHonestNotice>

            <SettingsManager
                settings={(settings ?? []) as SiteSettingRow[]}
            />
        </div>
    );
}
