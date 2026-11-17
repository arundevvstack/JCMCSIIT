import { Metadata } from "next";
import Link from "next/link";
import {
    BookOpen,
    Building2,
    Utensils,
    Bus,
    Laptop,
    Users,
    Wrench,
    TreePine,
    ArrowRight,
} from "lucide-react";
import { getPublicPageByRoute } from "@/lib/cms/pages";
import { getPublicContentBlock } from "@/lib/cms/content-blocks";

export const metadata: Metadata = {
    title: "Campus Facilities | JCMC SIIT",
    description:
        "Explore world-class academic, residential, sports, and technical facilities at John Cox Memorial CSI Institute of Technology.",
};

const facilityCards = [
    {
        title: "Central Library",
        description: "25,000+ volumes, digital e-journals, DELNET access, and 200+ reading capacity.",
        href: "/facilities/library",
        icon: BookOpen,
        color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
        title: "Student Hostels",
        description: "Safe, secure, and comfortable accommodation for boys and girls with modern amenities.",
        href: "/facilities/hostel",
        icon: Building2,
        color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
        title: "Transportation",
        description: "Extensive fleet of college buses connecting major parts of Trivandrum and suburbs.",
        href: "/facilities/transportation",
        icon: Bus,
        color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
        title: "Campus Canteen",
        description: "Hygienic, multi-cuisine cafeteria providing nutritious and affordable meals and snacks.",
        href: "/facilities/canteen",
        icon: Utensils,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
        title: "Central Internet Lab",
        description: "High-speed campus-wide fiber-optic connectivity with 50+ dedicated workstations.",
        href: "/facilities/internet-lab",
        icon: Laptop,
        color: "text-cyan-600 bg-cyan-50 border-cyan-100",
    },
    {
        title: "Conference & Seminar Halls",
        description: "Air-conditioned seminar halls equipped with advanced audio-visual presentation systems.",
        href: "/facilities/conference-hall",
        icon: Users,
        color: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
        title: "Central Workshop",
        description: "Hands-on engineering workshops covering fitting, carpentry, foundry, and welding.",
        href: "/facilities/workshop",
        icon: Wrench,
        color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
        title: "Campus Environment",
        description: "Lush green, eco-friendly campus nestled in the heart of Trivandrum city.",
        href: "/facilities/campus",
        icon: TreePine,
        color: "text-teal-600 bg-teal-50 border-teal-100",
    },
];

export default async function FacilitiesPage() {
    const [cmsPage, block] = await Promise.all([
        getPublicPageByRoute("/facilities"),
        getPublicContentBlock("facilities_overview"),
    ]);

    const title = cmsPage?.title || "Campus Facilities";
    const subtitle =
        cmsPage?.subtitle ||
        "State-of-the-art infrastructure designed to foster academic excellence, technical innovation, and holistic student development.";
    const extraContent = cmsPage?.content || block?.content;

    return (
        <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative">
            <div className="container px-4 md:px-8 mx-auto max-w-7xl relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
                        <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">
                            Infrastructure &amp; Amenities
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Optional Dynamic CMS Content Block */}
                {extraContent && (
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200/60 max-w-4xl mx-auto mb-16">
                        <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                            {extraContent}
                        </div>
                    </div>
                )}

                {/* Facility Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {facilityCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={card.title}
                                href={card.href}
                                className="group bg-white rounded-3xl p-6 border border-slate-200/70 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${card.color} group-hover:scale-110 transition-transform`}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                        {card.title}
                                    </h2>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                        {card.description}
                                    </p>
                                </div>
                                <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                                    Explore details <ArrowRight className="w-4 h-4 ml-1.5" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
