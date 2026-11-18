import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
    Building2,
    Briefcase,
    TrendingUp,
    Award,
    ExternalLink,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    Mail,
    Phone,
} from "lucide-react";
import { getPublicRecruiters, getPublicPlacementStats } from "@/lib/cms/placements";

export const metadata: Metadata = {
    title: "Recruiting Partners & Corporate Network | JCMC SIIT",
    description:
        "Discover the leading multinational technology corporations and engineering firms recruiting students at JCMC SIIT.",
};

export default async function RecruitersPage() {
    const [recruiters, stats] = await Promise.all([
        getPublicRecruiters(),
        getPublicPlacementStats(),
    ]);

    const statHighlights = [
        { label: "Placement Rate", value: stats.placementRate, icon: TrendingUp },
        { label: "Highest Package", value: stats.highestPackage, icon: Award },
        { label: "Recruiting Partners", value: stats.recruitingPartners, icon: Building2 },
        { label: "Total Offers", value: stats.totalOffers, icon: Briefcase },
    ];

    return (
        <main className="min-h-screen pt-32 pb-24 bg-white relative">
            <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-7xl">
                {/* Breadcrumbs & Navigation */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <Link href="/placements" className="hover:text-primary transition-colors">
                        Placements
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-900 font-semibold">Recruiting Partners</span>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 mb-6 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                            CGPU Corporate Network
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
                        Our Recruiting Partners.
                    </h1>
                    <p className="text-slate-600 max-w-2xl text-lg md:text-xl leading-relaxed">
                        Collaborating with global tech giants, multinational IT leaders, and premier core engineering companies to launch rewarding careers for our students.
                    </p>
                </div>

                {/* Placement Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
                    {statHighlights.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center hover:bg-white hover:shadow-md transition-all"
                        >
                            <stat.icon className="h-6 w-6 text-primary mb-3" />
                            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Corporate Partners Grid */}
                <div className="mb-24">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Participating Companies &amp; Recruiters
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {recruiters.length} leading employers actively recruiting from JCMC SIIT
                            </p>
                        </div>
                        <Link
                            href="/placements"
                            className="inline-flex items-center text-xs font-bold text-primary hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Placement Overview
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recruiters.map((recruiter) => (
                            <div
                                key={recruiter.id || recruiter.company_name}
                                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Company Logo or Initial Monogram */}
                                    <div className="h-20 w-full rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-5 group-hover:bg-blue-50/40 transition-colors overflow-hidden">
                                        {recruiter.logo_url ? (
                                            <div className="relative h-12 w-full">
                                                <Image
                                                    src={recruiter.logo_url}
                                                    alt={recruiter.company_name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Building2 className="w-5 h-5 text-primary/70" />
                                                <span className="font-bold text-base tracking-tight truncate">
                                                    {recruiter.company_name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Company Title */}
                                    <h3 className="font-bold text-slate-900 text-base mb-1.5 group-hover:text-primary transition-colors">
                                        {recruiter.company_name}
                                    </h3>

                                    {/* Tier Tag */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {recruiter.tier || "Corporate Partner"}
                                        </span>
                                    </div>
                                </div>

                                {/* External Career Link if available */}
                                {recruiter.website_url ? (
                                    <a
                                        href={recruiter.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-xs font-semibold text-primary hover:text-slate-900 transition-colors pt-3 border-t border-slate-100"
                                    >
                                        Career Portal <ExternalLink className="w-3 h-3 ml-1" />
                                    </a>
                                ) : (
                                    <span className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active Campus Recruiter
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recruiter Partnership Invitation Banner */}
                <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-14 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="max-w-3xl relative z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E5C158] mb-3 block">
                            Campus Recruitment 2026
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
                            Partner With JCMC SIIT for Campus Recruitment.
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
                            Our Career Guidance &amp; Placement Unit invites corporate talent acquisition teams to discover industry-ready engineering graduates across B.Tech and Polytechnic Diploma disciplines.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/contact"
                                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4" /> Contact Placement Cell
                            </Link>
                            <a
                                href="tel:+914712555555"
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/20 transition-colors inline-flex items-center gap-2"
                            >
                                <Phone className="w-4 h-4" /> +91-471-2555555
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
