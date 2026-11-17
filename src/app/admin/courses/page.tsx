import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveCourseItem, deleteCourseItem } from "@/actions/cms";
import { coursesData } from "@/data/courses";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: courses } = await supabase
        .from("courses")
        .select(
            "id, name, slug, code, degree, category, duration, intake, eligibility, overview, syllabus_pdf_url, status, updated_at"
        )
        .order("category", { ascending: true })
        .order("name", { ascending: true });

    const staticProgrammeCount = Object.keys(coursesData).length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Academic Programmes"
                title="Courses & Curriculum Catalogue"
                description="Manage B.Tech, M.Tech, Diploma, and Certificate programme records in public.courses."
            />

            <AdminHonestNotice
                title={`Connected to public.courses (${staticProgrammeCount} Static Baseline Programmes Preserved)`}
                variant="info"
            >
                Records created below persist directly to{" "}
                <code className="text-[#E5C158]">public.courses</code>. The{" "}
                {staticProgrammeCount} existing public programme pages in{" "}
                <code className="text-zinc-200">src/data/courses.ts</code>{" "}
                remain preserved until initial data seeding and frontend binding
                are executed.
            </AdminHonestNotice>

            <CmsCollectionManager
                entityLabel="Course"
                role={admin.role}
                items={(courses ?? []) as Record<string, unknown>[]}
                searchKeys={["name", "slug", "code", "category", "degree"]}
                columns={[
                    { key: "name", label: "Programme Name" },
                    { key: "category", label: "Level" },
                    { key: "degree", label: "Degree" },
                    { key: "intake", label: "Intake" },
                    { key: "status", label: "Status", isStatus: true },
                ]}
                fields={[
                    {
                        name: "name",
                        label: "Programme Name",
                        type: "text",
                        required: true,
                        placeholder: "Computer Science & Engineering",
                    },
                    {
                        name: "slug",
                        label: "URL Slug",
                        type: "text",
                        placeholder: "cse",
                    },
                    {
                        name: "code",
                        label: "Course Code",
                        type: "text",
                        placeholder: "CSE",
                    },
                    {
                        name: "degree",
                        label: "Degree Title",
                        type: "text",
                        placeholder: "B.Tech",
                    },
                    {
                        name: "category",
                        label: "Category",
                        type: "select",
                        defaultValue: "UG",
                        options: [
                            { label: "Undergraduate (UG)", value: "UG" },
                            { label: "Postgraduate (PG)", value: "PG" },
                            { label: "Diploma", value: "DIPLOMA" },
                            { label: "Certificate", value: "CERTIFICATE" },
                        ],
                    },
                    {
                        name: "duration",
                        label: "Duration",
                        type: "text",
                        placeholder: "4 Years (8 Semesters)",
                    },
                    {
                        name: "intake",
                        label: "Sanctioned Intake",
                        type: "number",
                        placeholder: "60",
                    },
                    {
                        name: "status",
                        label: "Workflow Status",
                        type: "select",
                        defaultValue: "draft",
                    },
                    {
                        name: "syllabus_pdf_url",
                        label: "Syllabus PDF URL",
                        type: "url",
                        placeholder: "/pdfs/ktu-cse-syllabus.pdf",
                        colSpan: 2,
                        mediaPicker: {
                            category: "document",
                            allowedBuckets: ["pdfs", "cms-documents"],
                            modalTitle: "Select Course Syllabus PDF",
                        },
                    },
                    {
                        name: "eligibility",
                        label: "Admission Eligibility",
                        type: "textarea",
                        placeholder: "KEAM / Plus Two Physics, Chemistry & Mathematics...",
                    },
                    {
                        name: "overview",
                        label: "Programme Overview",
                        type: "textarea",
                        placeholder: "Detailed overview of the programme...",
                    },
                ]}
                saveAction={saveCourseItem}
                deleteAction={deleteCourseItem}
            />
        </div>
    );
}
