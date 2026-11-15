import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { savePopupItem, deletePopupItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
    AdminStatusBadge,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const [{ data: popups }, { data: navItems }] = await Promise.all([
        supabase
            .from("popups")
            .select(
                "id, title, description, image_url, cta_label, cta_url, frequency, is_enabled, status, updated_at"
            )
            .order("updated_at", { ascending: false }),
        supabase
            .from("navigation_items")
            .select("id, menu_location, label, href, is_visible, status")
            .in("menu_location", ["ticker", "quick_links", "navbar"])
            .order("menu_location", { ascending: true })
            .order("sort_order", { ascending: true })
            .limit(20),
    ]);

    return (
        <div className="space-y-8">
            <AdminPageHeader
                eyebrow="Homepage Management"
                title="Homepage Campaigns & Quick Links"
                description="Manage promotional popups in public.popups and inspect navigation/ticker entries stored in public.navigation_items."
            />

            <AdminHonestNotice
                title="Homepage Hero & Ticker Frontend Binding — Coming Soon"
                variant="pending"
            >
                Popup records below save directly to{" "}
                <code className="text-[#E5C158]">public.popups</code>. The live
                public homepage (<code className="text-zinc-200">/</code>),
                graduation ceremony popup, and scrolling news ticker remain
                preserved in their existing static components until explicit
                frontend data binding is enabled.
            </AdminHonestNotice>

            <section className="space-y-3">
                <h2 className="text-base font-bold text-zinc-100">
                    Promotional & Ceremony Popups (public.popups)
                </h2>
                <CmsCollectionManager
                    entityLabel="Popup"
                    role={admin.role}
                    items={(popups ?? []) as Record<string, unknown>[]}
                    searchKeys={["title", "cta_label", "frequency"]}
                    columns={[
                        { key: "title", label: "Campaign Title" },
                        { key: "frequency", label: "Frequency", isMono: true },
                        { key: "is_enabled", label: "Enabled" },
                        { key: "status", label: "Status", isStatus: true },
                    ]}
                    fields={[
                        {
                            name: "title",
                            label: "Popup Title",
                            type: "text",
                            required: true,
                            placeholder: "Graduation Ceremony 2026",
                        },
                        {
                            name: "frequency",
                            label: "Display Frequency",
                            type: "select",
                            defaultValue: "every_session",
                            options: [
                                {
                                    label: "Every Session",
                                    value: "every_session",
                                },
                                {
                                    label: "Once Per Day",
                                    value: "once_per_day",
                                },
                                { label: "Once Ever", value: "once_ever" },
                                { label: "Every Visit", value: "every_visit" },
                            ],
                        },
                        {
                            name: "image_url",
                            label: "Banner / Poster Image URL",
                            type: "url",
                            placeholder: "/graduation-2026.png",
                        },
                        {
                            name: "status",
                            label: "Workflow Status",
                            type: "select",
                            defaultValue: "draft",
                        },
                        {
                            name: "cta_label",
                            label: "Primary CTA Label",
                            type: "text",
                            placeholder: "Register Now",
                        },
                        {
                            name: "cta_url",
                            label: "Primary CTA Link",
                            type: "url",
                            placeholder: "/admissions",
                        },
                        {
                            name: "is_enabled",
                            label: "Enable Campaign Switch",
                            type: "checkbox",
                            defaultValue: false,
                            colSpan: 2,
                        },
                        {
                            name: "description",
                            label: "Description",
                            type: "textarea",
                            placeholder: "Short announcement copy...",
                        },
                    ]}
                    saveAction={savePopupItem}
                    deleteAction={deletePopupItem}
                />
            </section>

            <section className="rounded-2xl border border-white/[0.07] bg-[#12141C] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.07] bg-[#0E1017] flex items-center justify-between">
                    <h2 className="text-sm font-bold text-zinc-100">
                        Registered Navigation & Ticker Items
                        (public.navigation_items)
                    </h2>
                    <span className="text-xs text-zinc-400">
                        {(navItems ?? []).length} item
                        {(navItems ?? []).length === 1 ? "" : "s"}
                    </span>
                </div>
                {(navItems ?? []).length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-500">
                        No navigation or ticker items have been seeded into{" "}
                        <code className="text-zinc-300">
                            public.navigation_items
                        </code>{" "}
                        yet. Visual menu builder is scheduled for a future CMS
                        phase.
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.05] text-xs">
                        {(navItems ?? []).map((nav) => (
                            <div
                                key={nav.id}
                                className="px-6 py-3 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <span className="font-semibold text-zinc-200">
                                        {nav.label}
                                    </span>
                                    <span className="ml-3 font-mono text-zinc-400">
                                        {nav.href}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[11px] text-[#E5C158]">
                                        {nav.menu_location}
                                    </span>
                                    <AdminStatusBadge status={nav.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
