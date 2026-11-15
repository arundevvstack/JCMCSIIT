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

export default async function AdminContactMessagesPage() {
    await requireAdminRole(["SUPER_ADMIN", "ADMIN"], {
        redirectTo: "/admin/login",
        forbiddenRedirectTo: "/admin",
    });

    const supabase = await createClient();
    const { data: generalInquiries } = await supabase
        .from("inquiries")
        .select(
            "id, name, email, phone, course_interest, message, status, notes, created_at"
        )
        .is("course_interest", null)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Communications"
                title="Contact Messages"
                description="Review general visitor messages without a specific course selection stored in public.inquiries."
            />

            <AdminHonestNotice
                title="Public /contact Form Backend Wiring — Coming Soon"
                variant="pending"
            >
                Per schema rules, no duplicate contact table was invented;
                general inquiries without a{" "}
                <code className="text-[#E5C158]">course_interest</code> are
                queried live from{" "}
                <code className="text-[#E5C158]">public.inquiries</code>. The
                existing public <code className="text-zinc-200">/contact</code>{" "}
                page remains untouched and is not yet wired to submit into
                Supabase.
            </AdminHonestNotice>

            <InquiriesManager
                inquiries={(generalInquiries ?? []) as InquiryRecord[]}
                emptyMessage="No general contact messages are currently recorded in public.inquiries."
            />
        </div>
    );
}
