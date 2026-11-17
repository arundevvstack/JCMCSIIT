import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, Quote } from "lucide-react";
import {
    resolvePrincipalImageSrc,
    type PrincipalMessageData,
} from "@/data/principal-message";

export function PrincipalMessageSection({
    content,
}: {
    content: PrincipalMessageData;
}) {
    return (
        <section className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 min-h-screen">
            <div className="container px-4 md:px-8 mx-auto max-w-6xl">
                {/* Breadcrumb / Back navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/about/college/profile"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1c4762] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        About the College
                    </Link>
                    <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold uppercase tracking-wider text-[#1c4762]">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Institutional Leadership
                    </span>
                </div>

                {/* Section Heading */}
                <div className="max-w-3xl mb-12 md:mb-16">
                    <div className="inline-flex sm:hidden items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold uppercase tracking-wider text-[#1c4762] mb-4">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Institutional Leadership
                    </div>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {content.heading}
                    </h1>
                    <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#1c4762] to-emerald-500" />
                </div>

                {/* Two-Column Responsive Layout: Photograph on one side, Complete Message on the other */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    {/* Left Column: Principal's Photograph & Official Details */}
                    <aside className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] overflow-hidden">
                            <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100">
                                <div className="overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/70 shadow-sm">
                                    <Image
                                        src={resolvePrincipalImageSrc(
                                            content.imagePath
                                        )}
                                        alt={content.imageAlt}
                                        width={910}
                                        height={1058}
                                        unoptimized
                                        priority
                                        className="w-full h-auto block"
                                    />
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 bg-white">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                    {content.principalName}
                                </h2>
                                <p className="text-emerald-700 font-bold text-sm uppercase tracking-wider mt-1.5">
                                    {content.designation}
                                </p>
                                <p className="text-slate-700 font-medium text-sm mt-1">
                                    {content.institutionName}
                                </p>

                                {content.additionalRole ? (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-slate-600 text-sm font-medium leading-snug">
                                            {content.additionalRole}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Official Principal's Message */}
                    <article className="lg:col-span-7 space-y-8">
                        {/* Featured Opening Quote */}
                        <div className="relative rounded-3xl bg-gradient-to-br from-[#0B1F3A] via-[#132d52] to-[#1c4762] p-7 sm:p-9 text-white shadow-xl overflow-hidden">
                            <Quote className="w-10 h-10 text-emerald-400/85 mb-4" />
                            <blockquote className="text-lg sm:text-xl md:text-2xl font-editorial leading-relaxed text-white">
                                {content.openingQuote}
                            </blockquote>
                        </div>

                        {/* Complete Message Card */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-10 md:p-12 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.08)]">
                            <p className="text-lg font-bold text-slate-900 mb-6">
                                {content.greeting}
                            </p>

                            <div className="space-y-5 text-slate-700 text-base sm:text-[17px] leading-[1.85]">
                                {content.paragraphs.map((paragraph, idx) => (
                                    <p key={idx}>{paragraph}</p>
                                ))}
                            </div>

                            <p className="mt-7 text-base sm:text-[17px] font-semibold text-[#1c4762] leading-relaxed">
                                {content.closingWish}
                            </p>

                            {/* Formal Sign-Off */}
                            <div className="mt-10 pt-8 border-t border-slate-200/80">
                                <p className="text-xl font-bold text-slate-900">
                                    {content.principalName}
                                </p>
                                <p className="text-slate-700 font-semibold text-sm mt-1">
                                    {content.designation}
                                </p>
                                <p className="text-slate-600 text-sm">
                                    {content.institutionName}
                                </p>
                                {content.additionalRole ? (
                                    <p className="text-slate-600 text-sm mt-1 font-medium">
                                        {content.additionalRole}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
