import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveRecruiterItem, deleteRecruiterItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminRecruitersPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: recruiters } = await supabase
        .from("recruiters")
        .select(
            "id, company_name, logo_url, tier, website_url, display_order, is_active, status, updated_at"
        )
        .order("display_order", { ascending: true })
        .order("company_name", { ascending: true });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Placement Network"
                title="Recruiters & Corporate Partners"
                description="Manage corporate partners, logos, tier classification, career links, and recruitment showcase in public.recruiters."
            />

            <AdminHonestNotice
                title="Connected to public.recruiters"
                variant="info"
            >
                Recruiters configured here persist directly to{" "}
                <code className="text-[#E5C158]">public.recruiters</code>.
                Published records (
                <code className="text-zinc-200">status = &apos;published&apos; AND is_active = true</code>)
                are rendered immediately on the public Placement and Recruiting Partners pages.
            </AdminHonestNotice>

            <CmsCollectionManager
                entityLabel="Recruiter"
                role={admin.role}
                items={(recruiters ?? []) as Record<string, unknown>[]}
                searchKeys={["company_name", "tier"]}
                columns={[
                    { key: "logo_url", label: "Logo", isImage: true },
                    { key: "company_name", label: "Company Name" },
                    { key: "tier", label: "Tier / Category" },
                    { key: "display_order", label: "Order", isMono: true },
                    { key: "status", label: "Status", isStatus: true },
                    { key: "is_active", label: "Active" },
                ]}
                fields={[
                    {
                        name: "company_name",
                        label: "Company Name",
                        type: "text",
                        required: true,
                        placeholder: "e.g. Google, Microsoft, Infosys",
                    },
                    {
                        name: "tier",
                        label: "Recruitment Tier",
                        type: "select",
                        defaultValue: "Tier 1",
                        options: [
                            { label: "Tier 1 (Tech Giant / Top Tier)", value: "Tier 1" },
                            { label: "Global Tech / MNC", value: "Global Tech" },
                            { label: "Core Engineering", value: "Core Engineering" },
                            { label: "IT & Software Services", value: "IT Services" },
                            { label: "Emerging Innovator / Startup", value: "Startup" },
                        ],
                    },
                    {
                        name: "logo_url",
                        label: "Company Logo",
                        type: "text",
                        mediaPicker: {
                            category: "image",
                            modalTitle: "Select Company Logo from Media Library",
                        },
                        placeholder: "/images/recruiters/company-logo.png",
                    },
                    {
                        name: "website_url",
                        label: "Careers / Corporate Website (Optional)",
                        type: "url",
                        placeholder: "https://careers.company.com",
                    },
                    {
                        name: "display_order",
                        label: "Display Order",
                        type: "number",
                        defaultValue: "0",
                        placeholder: "0",
                    },
                    {
                        name: "status",
                        label: "Workflow Status",
                        type: "select",
                        defaultValue: "published",
                    },
                    {
                        name: "is_active",
                        label: "Active (Visible on public site)",
                        type: "checkbox",
                        defaultValue: true,
                    },
                ]}
                saveAction={saveRecruiterItem}
                deleteAction={deleteRecruiterItem}
                layoutMode="table"
            />
        </div>
    );
}
