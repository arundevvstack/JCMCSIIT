import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveNoticeItem, deleteNoticeItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminNoticesPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: notices } = await supabase
        .from("notices")
        .select(
            "id, title, slug, category, summary, file_url, notice_date, expiry_date, is_pinned, show_in_ticker, status, updated_at"
        )
        .order("is_pinned", { ascending: false })
        .order("notice_date", { ascending: false });

    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Official Circulars"
                title="Notices & Exam Notifications"
                description="Publish official circulars, KTU examination timetables, scholarship alerts, and pinned notices in public.notices."
            />

            <AdminHonestNotice
                title="Connected to public.notices (Automatic Expiry Filtering)"
                variant="info"
            >
                Notices saved here persist to{" "}
                <code className="text-[#E5C158]">public.notices</code>.
                PostgreSQL RLS automatically hides expired notices (
                <code className="text-zinc-200">expiry_date &lt; today</code>)
                from anonymous public queries while preserving them here for
                institutional archive review.
            </AdminHonestNotice>

            <CmsCollectionManager
                entityLabel="Notice"
                role={admin.role}
                items={(notices ?? []) as Record<string, unknown>[]}
                searchKeys={["title", "slug", "category"]}
                columns={[
                    { key: "title", label: "Notice Title" },
                    { key: "category", label: "Category" },
                    { key: "notice_date", label: "Notice Date", isMono: true },
                    { key: "is_pinned", label: "Pinned" },
                    { key: "status", label: "Status", isStatus: true },
                ]}
                fields={[
                    {
                        name: "title",
                        label: "Notice Title",
                        type: "text",
                        required: true,
                        placeholder:
                            "S6 B.Tech University Examination Registration Circular",
                    },
                    {
                        name: "slug",
                        label: "Slug",
                        type: "text",
                        placeholder: "s6-btech-exam-registration-circular",
                    },
                    {
                        name: "category",
                        label: "Category",
                        type: "text",
                        defaultValue: "Circular",
                        placeholder: "Circular / Exam / Scholarship / Tender",
                    },
                    {
                        name: "status",
                        label: "Workflow Status",
                        type: "select",
                        defaultValue: "draft",
                    },
                    {
                        name: "notice_date",
                        label: "Notice Date",
                        type: "date",
                        required: true,
                        defaultValue: today,
                    },
                    {
                        name: "expiry_date",
                        label: "Expiry Date (Optional)",
                        type: "date",
                    },
                    {
                        name: "file_url",
                        label: "Attached PDF / Circular URL",
                        type: "url",
                        placeholder: "/pdfs/circular.pdf",
                        colSpan: 2,
                    },
                    {
                        name: "is_pinned",
                        label: "Pin to Top of Notice Board",
                        type: "checkbox",
                        defaultValue: false,
                    },
                    {
                        name: "show_in_ticker",
                        label: "Display in Scrolling Ticker",
                        type: "checkbox",
                        defaultValue: false,
                    },
                    {
                        name: "summary",
                        label: "Notice Summary / Instructions",
                        type: "textarea",
                        placeholder: "Key dates, instructions, and applicable batches...",
                    },
                ]}
                saveAction={saveNoticeItem}
                deleteAction={deleteNoticeItem}
            />
        </div>
    );
}
