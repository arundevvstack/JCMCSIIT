import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveDepartmentItem, deleteDepartmentItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: departments } = await supabase
        .from("departments")
        .select(
            "id, name, slug, code, programme_type, hod_name, contact_email, short_description, status, updated_at"
        )
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Academic Structure"
                title="Departments Directory"
                description="Manage engineering, diploma, science & humanities, and administrative departments in public.departments."
            />

            <AdminHonestNotice
                title="Connected to public.departments (Cascade-Protected Foreign Keys)"
                variant="info"
            >
                Departments saved here persist to{" "}
                <code className="text-[#E5C158]">public.departments</code> and
                power relational links for Courses and Faculty profiles.
                Deleting a department with linked faculty or laboratories is
                safely blocked by PostgreSQL{" "}
                <code className="text-zinc-200">ON DELETE RESTRICT</code>.
            </AdminHonestNotice>

            <CmsCollectionManager
                entityLabel="Department"
                role={admin.role}
                items={(departments ?? []) as Record<string, unknown>[]}
                searchKeys={["name", "slug", "code", "hod_name"]}
                columns={[
                    { key: "name", label: "Department Name" },
                    { key: "code", label: "Code", isMono: true },
                    { key: "programme_type", label: "Stream" },
                    { key: "hod_name", label: "Head of Department" },
                    { key: "status", label: "Status", isStatus: true },
                ]}
                fields={[
                    {
                        name: "name",
                        label: "Department Name",
                        type: "text",
                        required: true,
                        placeholder:
                            "Department of Computer Science & Engineering",
                    },
                    {
                        name: "slug",
                        label: "URL Slug",
                        type: "text",
                        placeholder: "cse",
                    },
                    {
                        name: "code",
                        label: "Department Code",
                        type: "text",
                        placeholder: "CSE",
                    },
                    {
                        name: "programme_type",
                        label: "Programme Stream",
                        type: "select",
                        defaultValue: "UG",
                        options: [
                            { label: "Undergraduate (UG)", value: "UG" },
                            { label: "Postgraduate (PG)", value: "PG" },
                            { label: "Diploma", value: "DIPLOMA" },
                            {
                                label: "Science & Humanities",
                                value: "SCIENCE_HUMANITIES",
                            },
                            {
                                label: "Administration",
                                value: "ADMINISTRATION",
                            },
                        ],
                    },
                    {
                        name: "hod_name",
                        label: "Head of Department (HoD)",
                        type: "text",
                        placeholder: "Dr. Faculty Name",
                    },
                    {
                        name: "contact_email",
                        label: "Department Email",
                        type: "text",
                        placeholder: "hod.cse@jcmcsiit.ac.in",
                    },
                    {
                        name: "status",
                        label: "Workflow Status",
                        type: "select",
                        defaultValue: "draft",
                        colSpan: 2,
                    },
                    {
                        name: "short_description",
                        label: "Department Overview",
                        type: "textarea",
                        placeholder: "Summary of department vision and focus areas...",
                    },
                ]}
                saveAction={saveDepartmentItem}
                deleteAction={deleteDepartmentItem}
            />
        </div>
    );
}
