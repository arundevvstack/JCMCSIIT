import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    savePopupItem,
    deletePopupItem,
    saveNavigationItem,
    deleteNavigationItem,
} from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
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
            .select(
                "id, menu_location, label, href, parent_id, sort_order, is_visible, status, updated_at"
            )
            .order("menu_location", { ascending: true })
            .order("sort_order", { ascending: true }),
    ]);

    // Fallback to baseline campaign popup if database table is not yet seeded
    const baselinePopups = [
        {
            id: "popup-graduation-2026",
            title: "Graduation Ceremony 2026",
            description:
                "Registration is now open for the 2026 Graduating Batch.",
            image_url:
                "https://jcmcsiit.ac.in/Photogallery/2025/Annual%20Athletic%20Meet/IMG-20250320-WA0093.jpg",
            cta_label: "Register Now",
            cta_url: "/events/graduation-ceremony-2026",
            frequency: "every_session",
            is_enabled: true,
            status: "published",
            updated_at: new Date().toISOString(),
        },
    ];

    const sourcePopups =
        popups && popups.length > 0 ? popups : baselinePopups;

    return (
        <div className="space-y-8">
            <AdminPageHeader
                eyebrow="Homepage Management"
                title="Homepage Campaigns & Navigation"
                description="Manage promotional popups in public.popups and live navigation/ticker entries in public.navigation_items."
            />

            <AdminHonestNotice
                title="Homepage Hero & Ticker Connected to CMS"
                variant="info"
            >
                Promotional popups, News Ticker items, and the Homepage Hero
                are wired to CMS data with resilient fallbacks. Live updates
                to <code className="text-[#E5C158]">public.navigation_items</code>{" "}
                (with menu location <code className="text-zinc-200">ticker</code>)
                or <code className="text-[#E5C158]">public.site_settings</code>{" "}
                (<code className="text-zinc-200">homepage_hero</code>) will
                revalidate and render on the public website.
            </AdminHonestNotice>

            <section className="space-y-3">
                <h2 className="text-base font-bold text-zinc-100">
                    Promotional & Ceremony Popups (public.popups)
                </h2>
                <CmsCollectionManager
                    entityLabel="Popup"
                    role={admin.role}
                    items={sourcePopups as Record<string, unknown>[]}
                    searchKeys={["title", "cta_label", "frequency"]}
                    columns={[
                        { key: "image_url", label: "Banner", isImage: true },
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
                            mediaPicker: {
                                category: "image",
                                allowedBuckets: ["cms-media"],
                                modalTitle: "Select Popup Campaign Banner",
                            },
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

            <section className="space-y-3">
                <h2 className="text-base font-bold text-zinc-100">
                    Navigation & Ticker Items (public.navigation_items)
                </h2>
                <CmsCollectionManager
                    entityLabel="Navigation Item"
                    role={admin.role}
                    items={(navItems ?? []) as Record<string, unknown>[]}
                    columns={[
                        { key: "label", label: "Label / Headline" },
                        { key: "href", label: "Target URL", isMono: true },
                        { key: "menu_location", label: "Location", isMono: true },
                        { key: "sort_order", label: "Sort" },
                        { key: "status", label: "Status", isStatus: true },
                    ]}
                    searchKeys={["label", "href", "menu_location"]}
                    fields={[
                        {
                            name: "label",
                            label: "Menu Label / Ticker Headline",
                            type: "text",
                            required: true,
                            placeholder: "e.g. Admission 2026 Open or Placements",
                        },
                        {
                            name: "href",
                            label: "Target Link URL",
                            type: "text",
                            required: true,
                            placeholder: "/admissions or https://...",
                        },
                        {
                            name: "menu_location",
                            label: "Menu Location",
                            type: "select",
                            required: true,
                            options: [
                                { label: "News Ticker (Top Bar)", value: "ticker" },
                                { label: "Main Navbar", value: "navbar" },
                                { label: "Quick Links (Homepage/Drawer)", value: "quick_links" },
                                { label: "Floating Action Menu", value: "floating_actions" },
                                { label: "Footer Links", value: "footer" },
                            ],
                            defaultValue: "ticker",
                        },
                        {
                            name: "sort_order",
                            label: "Sort Order (Numeric)",
                            type: "number",
                            defaultValue: "0",
                        },
                        {
                            name: "status",
                            label: "Workflow Status",
                            type: "select",
                            required: true,
                            options: [
                                { label: "Draft", value: "draft" },
                                { label: "Published", value: "published" },
                                { label: "Archived", value: "archived" },
                            ],
                            defaultValue: "published",
                        },
                        {
                            name: "is_visible",
                            label: "Visible to Visitors",
                            type: "checkbox",
                            defaultValue: true,
                        },
                        {
                            name: "open_in_new_tab",
                            label: "Open in New Browser Tab",
                            type: "checkbox",
                            defaultValue: false,
                        },
                    ]}
                    saveAction={saveNavigationItem}
                    deleteAction={deleteNavigationItem}
                />
            </section>
        </div>
    );
}
