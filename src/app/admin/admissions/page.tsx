import { requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import {
    InquiriesManager,
    type InquiryRecord,
} from "@/components/admin/inquiries-manager";

export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage() {
    await requireAdminRole(["SUPER_ADMIN", "ADMIN"], {
        redirectTo: "/admin/login",
        forbiddenRedirectTo: "/admin",
    });

    const supabase = await createClient();
    const { data: inquiries } = await supabase
        .from("inquiries")
        .select(
            "id, name, email, phone, course_interest, message, status, notes, created_at"
        )
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Admissions Desk"
                title="Admissions Inquiries & Lead Funnel"
                description="Review prospective student inquiries stored in public.inquiries, update counseling status, and record internal follow-up notes."
            />

            <AdminHonestNotice
                title="Connected to public.inquiries (PII Restricted to SUPER_ADMIN & ADMIN)"
                variant="info"
            >
                Applicant leads below are protected by PostgreSQL Row Level
                Security (<code className="text-[#E5C158]">inquiries_admin_all</code>
                ). Static informational pages under{" "}
                <code className="text-zinc-200">/admissions/*</code> can be
                managed separately once Website Pages route binding is enabled.
            </AdminHonestNotice>

            <InquiriesManager
                inquiries={(inquiries ?? []) as InquiryRecord[]}
                emptyMessage="No admission inquiries have been submitted to public.inquiries yet."
            />
        </div>
    );
}
