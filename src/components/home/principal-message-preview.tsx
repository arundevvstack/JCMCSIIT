"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { OFFICIAL_PRINCIPAL_MESSAGE } from "@/data/principal-message";

export function PrincipalMessagePreview() {
    const content = OFFICIAL_PRINCIPAL_MESSAGE;

    return (
        <section className="relative w-full py-20 md:py-28 bg-slate-50/70 border-t border-slate-200/70 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_24px_60px_-25px_rgba(15,23,42,0.1)] p-6 sm:p-10 lg:p-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Principal Photograph */}
                        <div className="lg:col-span-4">
                            <div className="max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
                                <Image
                                    src={content.imagePath}
                                    alt={content.imageAlt}
                                    width={800}
                                    height={1000}
                                    unoptimized
                                    className="w-full h-auto block"
                                />
                            </div>
                        </div>

                        {/* Message Preview & CTA */}
                        <div className="lg:col-span-8 space-y-6">
                            <div>
                                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
                                    Leadership Message
                                </span>
                                <h2
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    {content.heading}
                                </h2>
                            </div>

                            <div className="relative pl-5 border-l-4 border-[#1c4762]">
                                <Quote className="w-6 h-6 text-emerald-600 mb-2" />
                                <blockquote className="text-lg sm:text-xl font-editorial text-slate-800 leading-relaxed">
                                    {content.openingQuote}
                                </blockquote>
                            </div>

                            <p className="text-slate-600 text-base leading-relaxed line-clamp-3">
                                {content.paragraphs[0]}
                            </p>

                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-100">
                                <div>
                                    <p className="text-lg font-bold text-slate-900">
                                        {content.principalName}
                                    </p>
                                    <p className="text-sm font-semibold text-[#1c4762]">
                                        {content.designation},{" "}
                                        {content.institutionName}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {content.additionalRole}
                                    </p>
                                </div>

                                <Link
                                    href="/about/college/principal"
                                    className="group inline-flex h-12 items-center justify-center rounded-full bg-[#1c4762] px-7 text-sm font-bold text-white transition-all hover:bg-[#102e41] shadow-sm shrink-0"
                                >
                                    <span className="mr-2">
                                        Read Full Message
                                    </span>
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
