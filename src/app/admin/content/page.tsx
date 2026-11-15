import Link from "next/link";
import { ArrowRight, FileText, Blocks } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-primitives";

export default function ContentDashboard() {
    return (
        <div className="space-y-8">
            <AdminPageHeader
                eyebrow="Content Architecture"
                title="Pages & Content Blocks"
                description="Manage dynamic CMS page records and reusable structured content blocks stored in Supabase."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#12141C] rounded-3xl p-8 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all group">
                    <div className="w-12 h-12 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E5C158] rounded-2xl flex items-center justify-center mb-5">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-50 mb-2">
                        Website Pages
                    </h2>
                    <p className="text-sm text-zinc-400 mb-6">
                        Create and edit page records in{" "}
                        <code className="text-[#E5C158]">public.pages</code>{" "}
                        with route paths, workflow statuses, and markdown body
                        content.
                    </p>
                    <Link
                        href="/admin/content/pages"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#E5C158] hover:underline"
                    >
                        Open Website Pages <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-[#12141C] rounded-3xl p-8 border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all group">
                    <div className="w-12 h-12 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E5C158] rounded-2xl flex items-center justify-center mb-5">
                        <Blocks className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-50 mb-2">
                        Content Blocks
                    </h2>
                    <p className="text-sm text-zinc-400 mb-6">
                        Manage reusable keyed blocks in{" "}
                        <code className="text-[#E5C158]">
                            public.content_blocks
                        </code>{" "}
                        for shared institutional sections, CTAs, and snippets.
                    </p>
                    <Link
                        href="/admin/content/blocks"
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#E5C158] hover:underline"
                    >
                        Open Content Blocks <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
