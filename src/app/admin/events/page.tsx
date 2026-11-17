import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveEventItem, deleteEventItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: events } = await supabase
        .from("events")
        .select(
            "id, title, slug, category, display_date_text, location, description, poster_url, registration_url, event_state, is_featured, status, updated_at"
        )
        .order("updated_at", { ascending: false });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Campus Calendar"
                title="Events & Symposiums"
                description="Manage technical fests, workshops, cultural programs, and academic conferences in public.events."
            />

            <AdminHonestNotice
                title="Connected to public.events"
                variant="info"
            >
                Events created or edited here save directly to{" "}
                <code className="text-[#E5C158]">public.events</code> via your
                SSR session. Existing static event pages remain preserved until
                frontend binding is activated.
            </AdminHonestNotice>

            <CmsCollectionManager
                entityLabel="Event"
                role={admin.role}
                items={(events ?? []) as Record<string, unknown>[]}
                searchKeys={["title", "slug", "category", "location"]}
                columns={[
                    { key: "title", label: "Event Title" },
                    { key: "category", label: "Category" },
                    { key: "display_date_text", label: "Schedule" },
                    {
                        key: "event_state",
                        label: "Event State",
                        isStatus: true,
                    },
                    { key: "status", label: "Workflow", isStatus: true },
                ]}
                fields={[
                    {
                        name: "title",
                        label: "Event Title",
                        type: "text",
                        required: true,
                        placeholder: "TechFest 2026 — National Technical Symposium",
                    },
                    {
                        name: "slug",
                        label: "URL Slug",
                        type: "text",
                        placeholder: "techfest-2026",
                    },
                    {
                        name: "category",
                        label: "Category",
                        type: "text",
                        defaultValue: "Campus Event",
                        placeholder: "Workshop / Cultural / Symposium",
                    },
                    {
                        name: "display_date_text",
                        label: "Display Date Text",
                        type: "text",
                        placeholder: "March 18–20, 2026",
                    },
                    {
                        name: "location",
                        label: "Venue / Location",
                        type: "text",
                        placeholder: "Main Auditorium, Kannammoola Campus",
                    },
                    {
                        name: "event_state",
                        label: "Event Lifecycle State",
                        type: "select",
                        defaultValue: "upcoming",
                        options: [
                            { label: "Upcoming", value: "upcoming" },
                            { label: "Ongoing", value: "ongoing" },
                            { label: "Completed", value: "completed" },
                            { label: "Cancelled", value: "cancelled" },
                        ],
                    },
                    {
                        name: "poster_url",
                        label: "Event Poster URL",
                        type: "url",
                        placeholder: "/events/poster.jpg",
                        mediaPicker: {
                            category: "image",
                            allowedBuckets: ["cms-media", "galleries"],
                            modalTitle: "Select Event Poster Image",
                        },
                    },
                    {
                        name: "registration_url",
                        label: "Registration Link (Optional)",
                        type: "url",
                        placeholder: "https://...",
                    },
                    {
                        name: "status",
                        label: "Workflow Status",
                        type: "select",
                        defaultValue: "draft",
                    },
                    {
                        name: "is_featured",
                        label: "Highlight as Featured Event",
                        type: "checkbox",
                        defaultValue: false,
                    },
                    {
                        name: "description",
                        label: "Event Description",
                        type: "textarea",
                        placeholder: "Event agenda, speakers, and participation guidelines...",
                    },
                ]}
                saveAction={saveEventItem}
                deleteAction={deleteEventItem}
            />
        </div>
    );
}
