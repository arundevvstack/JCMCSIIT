import { ArrowLeft, HardHat, Sparkles, Calendar } from "lucide-react";
import Link from "next/link";
import { getPublicPageByRoute } from "@/lib/cms/pages";

interface ComingSoonProps {
    title: string;
    routePath?: string;
}

export async function ComingSoon({ title, routePath }: ComingSoonProps) {
    const cmsPage = routePath ? await getPublicPageByRoute(routePath) : null;

    if (cmsPage && cmsPage.is_published) {
        return (
            <main className="pt-32 pb-24 layout-grid min-h-[70vh] bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto w-full relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="bg-white rounded-[2rem] p-8 md:p-14 shadow-xl border border-slate-100 relative overflow-hidden">
                        {cmsPage.subtitle && (
                            <p className="text-primary font-semibold text-sm tracking-wide uppercase mb-3">
                                {cmsPage.subtitle}
                            </p>
                        )}
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            {cmsPage.title}
                        </h1>

                        {cmsPage.summary && (
                            <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium">
                                {cmsPage.summary}
                            </p>
                        )}

                        <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-8">
                            {cmsPage.content}
                        </div>

                        <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Last updated:{" "}
                                {new Date(cmsPage.updated_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                            <span>JCMC SIIT Institutional Information</span>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <div className="pt-32 pb-24 layout-grid min-h-[70vh] bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto w-full relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-12"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="bg-white rounded-[2rem] p-8 md:p-14 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <HardHat className="w-48 h-48" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 mb-8 shadow-sm relative z-10">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-indigo-700 tracking-wide uppercase">
                            Under Construction
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight relative z-10">
                        {title}
                    </h1>

                    <div className="prose prose-lg prose-slate max-w-none relative z-10">
                        <p className="text-xl text-slate-600 leading-relaxed mb-6 font-medium flex items-start gap-2">
                            <Sparkles className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                            We are currently crafting a premium experience for the {title} section.
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-12">
                            John Cox Memorial CSI Institute of Technology is dedicated to providing comprehensive and up-to-date resources. We are migrating our data to this new platform. Please check back soon!
                        </p>

                        <div className="pt-8 border-t border-slate-100 bg-slate-50/50 rounded-2xl p-6 border">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                Have an urgent query?
                            </h3>
                            <p className="text-slate-600 text-sm">
                                You can reach out to our admission or administration desks directly via the{" "}
                                <Link
                                    href="/contact"
                                    className="text-indigo-600 font-bold hover:underline"
                                >
                                    Contact Us
                                </Link>{" "}
                                page.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
