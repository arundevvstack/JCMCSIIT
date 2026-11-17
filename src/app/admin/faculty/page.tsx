import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveFacultyItem, deleteFacultyItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";
import { facultyData } from "@/data/faculty";

export const dynamic = "force-dynamic";

export default async function AdminFacultyPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const [{ data: facultyRows }, { data: departments }] = await Promise.all([
        supabase
            .from("faculty")
            .select(
                "id, name, slug, designation, department_id, qualifications, email, image_url, bio, is_visible, status, updated_at"
            )
            .order("display_order", { ascending: true })
            .order("name", { ascending: true }),
        supabase
            .from("departments")
            .select("id, name")
            .order("name", { ascending: true }),
    ]);

    const deptMap = new Map(
        (departments ?? []).map((d) => [d.id as string, d.name as string])
    );

    const enrichedFaculty = (facultyRows ?? []).map((f) => ({
        ...f,
        department_name: f.department_id
            ? deptMap.get(f.department_id) || "Unassigned"
            : "Unassigned",
    }));

    // Fallback to baseline faculty profiles if database table is not yet seeded
    const baselineFacultyRows = facultyData.map((f) => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        designation: f.designation,
        department_id: f.department_id,
        department_name:
            f.departments?.name ?? "Computer Science & Engineering",
        qualifications: f.profile_data?.highestQualification ?? "",
        email: f.email ?? "",
        image_url: f.image_url ?? "",
        bio: f.bio ?? "",
        is_visible: true,
        status: "published",
        updated_at: new Date().toISOString(),
    }));

    const sourceFaculty =
        facultyRows && facultyRows.length > 0
            ? enrichedFaculty
            : baselineFacultyRows;

    const departmentOptions = [
        { label: "— Unassigned —", value: "" },
        ...(departments ?? []).map((d) => ({
            label: d.name as string,
            value: d.id as string,
        })),
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Faculty & Staff"
                title="Faculty Profiles Directory"
                description="Manage faculty designations, qualifications, departmental assignments, and visibility in public.faculty."
            />

            <AdminHonestNotice
                title="Connected to public.faculty"
                variant="info"
            >
                Profiles created below persist directly to{" "}
                <code className="text-[#E5C158]">public.faculty</code>. Direct
                portrait photo cropping/upload to the{" "}
                <code className="text-zinc-200">faculty-profiles</code> Storage
                bucket is scheduled for the Media Upload phase; image URLs or
                existing asset paths can be set now.
            </AdminHonestNotice>

            <CmsCollectionManager
                entityLabel="Faculty Member"
                role={admin.role}
                items={sourceFaculty as Record<string, unknown>[]}
                searchKeys={[
                    "name",
                    "designation",
                    "department_name",
                    "email",
                ]}
                columns={[
                    { key: "image_url", label: "Photo", isImage: true },
                    { key: "name", label: "Faculty Name" },
                    { key: "designation", label: "Designation" },
                    { key: "department_name", label: "Department" },
                    { key: "is_visible", label: "Visible" },
                    { key: "status", label: "Status", isStatus: true },
                ]}
                fields={[
                    {
                        name: "name",
                        label: "Full Name",
                        type: "text",
                        required: true,
                        placeholder: "Prof. Name",
                    },
                    {
                        name: "slug",
                        label: "Profile Slug",
                        type: "text",
                        placeholder: "prof-name",
                    },
                    {
                        name: "designation",
                        label: "Designation",
                        type: "text",
                        placeholder: "Assistant Professor",
                    },
                    {
                        name: "department_id",
                        label: "Department",
                        type: "select",
                        defaultValue: "",
                        options: departmentOptions,
                    },
                    {
                        name: "qualifications",
                        label: "Qualifications",
                        type: "text",
                        placeholder: "M.Tech, Ph.D.",
                    },
                    {
                        name: "email",
                        label: "Official Email",
                        type: "text",
                        placeholder: "faculty@jcmcsiit.ac.in",
                    },
                    {
                        name: "image_url",
                        label: "Photo URL / Asset Path",
                        type: "url",
                        placeholder: "/faculty/cse/member.jpg",
                        mediaPicker: {
                            category: "image",
                            allowedBuckets: [
                                "faculty-profiles",
                                "cms-media",
                            ],
                            modalTitle: "Select Faculty Portrait Photo",
                        },
                    },
                    {
                        name: "status",
                        label: "Workflow Status",
                        type: "select",
                        defaultValue: "draft",
                    },
                    {
                        name: "is_visible",
                        label: "Visible on Public Directory",
                        type: "checkbox",
                        defaultValue: true,
                        colSpan: 2,
                    },
                    {
                        name: "bio",
                        label: "Biography & Research Interests",
                        type: "textarea",
                        placeholder: "Academic background, publications, and areas of specialization...",
                    },
                ]}
                saveAction={saveFacultyItem}
                deleteAction={deleteFacultyItem}
                layoutMode="grid"
                defaultPageSize={12}
            />
        </div>
    );
}
