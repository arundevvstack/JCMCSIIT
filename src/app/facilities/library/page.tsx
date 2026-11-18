import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, Clock, Wifi, BookMarked, MonitorPlay, Library, Users, ExternalLink, Database, BookOpenCheck } from "lucide-react";
import { getPublicPageByRoute } from "@/lib/cms/pages";
import { getPublicContentBlock } from "@/lib/cms/content-blocks";

export const metadata: Metadata = {
  title: "Central Library | JCMCSIIT",
  description: "Explore the digital and physical library resources at JCMCSIIT.",
};

const stats = [
  { label: "Physical Volumes", value: "25,000+", icon: BookOpen,   color: "blue" },
  { label: "E-Journals",       value: "500+",    icon: Search,     color: "emerald" },
  { label: "Digital Access",   value: "24/7",    icon: Wifi,       color: "violet" },
  { label: "Reading Capacity", value: "200+",    icon: Users,      color: "amber" },
];

const physicalFeatures = [
  "Separate reference and reading sections",
  "Dedicated periodical section with national and international journals",
  "Book bank facility for economically weaker students",
  "Air-conditioned digital library with 50+ terminals",
  "Comfortable seating arrangements and silent study zones",
];

const digitalFeatures = [
  "Knimbus Digital Library Platform – mLibrary remote e-access to thousands of e-books, e-journals, and multimedia resources",
  "DELNET (Developing Library Network) membership for inter-library borrowing and union catalogue discovery",
  "National Digital Library of India (NDLI) institutional access",
  "IEEE Xplore, Springer, and NPTEL online course and lecture access",
  "Question paper archives and previous year solutions for all engineering branches",
  "E-books repository with remote 24/7 institutional login facilities",
  "Automated barcode issue and return tracking system",
];

const defaultOnlineAccessPortals = [
  {
    name: "Knimbus Digital Library Platform",
    tag: "Remote e-Library Portal",
    description: "Access college-subscribed e-books, international journals, curated course materials, and multimedia learning modules from anywhere via the Knimbus mLibrary web and mobile portal.",
    features: ["Single sign-on access to all subscribed digital collections", "Dedicated mobile app support for iOS and Android", "Off-campus 24/7 research access for faculty and students", "AI-driven search across peer-reviewed publications"],
    url: "https://www.knimbus.com",
    badge: "Active Subscription",
    color: "violet"
  },
  {
    name: "DELNET (Developing Library Network)",
    tag: "Inter-Library Network",
    description: "Inter-library loans, union catalogues, document delivery services, and bibliographic databases connecting more than 7,500 member libraries across India and abroad.",
    features: ["Union Catalogue of Books & Periodicals (over 3.5 crore records)", "Inter-Library Loan & Document Delivery Services", "Union List of Current Serials and CD-ROM Databases", "Direct article requests and full-text delivery"],
    url: "https://www.delnet.in",
    badge: "Institutional Member",
    color: "emerald"
  },
  {
    name: "National Digital Library of India (NDLI)",
    tag: "National Repository",
    description: "Virtual repository of learning resources with single-window search facility developed by IIT Kharagpur under MHRD / Ministry of Education, Government of India.",
    features: ["Over 10+ crore educational assets in multiple languages", "School, undergraduate, postgraduate, and research levels", "Free access to thesis, video lectures, and simulation tools", "Institutional club activities and knowledge webinars"],
    url: "https://ndl.iitkgp.ac.in",
    badge: "Govt. of India",
    color: "blue"
  }
];

export default async function LibraryPage() {
  const [cmsPage, portalBlock] = await Promise.all([
    getPublicPageByRoute("/facilities/library").catch(() => null),
    getPublicContentBlock("library_portal_links").catch(() => null),
  ]);

  const rawPortals = Array.isArray(portalBlock?.structured_data?.portals)
    ? (portalBlock.structured_data.portals as Array<{ name?: string; tag?: string; description?: string; features?: string[]; url?: string; badge?: string; color?: string }>)
    : null;

  const onlineAccessPortals = rawPortals && rawPortals.length > 0
    ? rawPortals.map((p, i) => {
        const colors = ["violet", "emerald", "blue"];
        return {
          name: p.name || `Portal ${i + 1}`,
          tag: p.tag || "e-Resource Portal",
          description: p.description || "",
          features: Array.isArray(p.features) ? p.features : [],
          url: p.url || "#",
          badge: p.badge || "Online Resource",
          color: p.color || colors[i % colors.length],
        };
      })
    : defaultOnlineAccessPortals;

  const heroTitle = cmsPage?.title || "Central Library & Information Centre";
  const heroSubtitle = cmsPage?.subtitle || cmsPage?.summary || "A modern gateway to knowledge offering over 25,000+ volumes, 500+ e-journals, and 24/7 digital access through premier research networks including Knimbus, DELNET, and NDLI.";
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-violet-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="container px-4 md:px-8 mx-auto relative z-10 max-w-7xl">

        {/* Back */}
        <div className="mb-8">
          <Link href="/facilities" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Facilities
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-200 bg-violet-50 mb-6 shadow-sm">
            <Library className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-bold text-violet-700 uppercase tracking-widest">Central Library</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            {cmsPage?.title ? heroTitle : (
              <>The Hub of <span className="text-violet-600">Knowledge</span></>
            )}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            {heroSubtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => {
            const colors: Record<string, string> = {
              blue: "bg-blue-50 text-blue-600 border-blue-100",
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
              violet: "bg-violet-50 text-violet-600 border-violet-100",
              amber: "bg-amber-50 text-amber-600 border-amber-100",
            };
            return (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 ${colors[stat.color]}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Physical Library */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-violet-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
                <BookMarked className="w-7 h-7 text-violet-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Physical Collections</h2>
                <p className="text-sm text-slate-500 mt-1">Extensive curated volumes</p>
              </div>
            </div>

            <ul className="space-y-4 relative z-10">
              {physicalFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                  </span>
                  <span className="text-slate-700 font-medium leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Digital Resources */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <MonitorPlay className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Digital Library</h2>
                <p className="text-sm text-slate-500 mt-1">24/7 E-Learning portals</p>
              </div>
            </div>

            <ul className="space-y-4 relative z-10">
              {digitalFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  </span>
                  <span className="text-slate-700 font-medium leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Online Library Access Section - Knimbus, DELNET, NDLI */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Database className="w-3.5 h-3.5" />
              Online Library Access & e-Resources
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Digital Portals & Research Networks</h2>
            <p className="text-slate-600 text-sm md:text-base">
              Students and faculty members can seamlessly access e-journals, e-books, bibliographic databases, and national resource networks anytime, anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {onlineAccessPortals.map((portal, idx) => {
              const borderStyles = portal.color === "violet" ? "hover:border-violet-300" : portal.color === "emerald" ? "hover:border-emerald-300" : "hover:border-blue-300";
              const badgeStyles = portal.color === "violet" ? "bg-violet-50 text-violet-700 border-violet-200" : portal.color === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200";
              const btnStyles = portal.color === "violet" ? "bg-violet-600 hover:bg-violet-700 text-white" : portal.color === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white";

              return (
                <div key={idx} className={`bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-200 ${borderStyles}`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${badgeStyles}`}>
                        {portal.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{portal.tag}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{portal.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{portal.description}</p>
                    <ul className="space-y-2.5 mb-6 text-xs text-slate-700">
                      {portal.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2">
                          <BookOpenCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${btnStyles}`}
                  >
                    Open Portal Access <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timings Dark Banner */}
        <div className="relative bg-[#0B1F3A] rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-violet-600/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                <Clock className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Library Hours</h3>
                <p className="text-white/70 text-sm">Our doors are open to support your academic journey.</p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-8 bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Weekdays</p>
                <p className="text-xl font-bold text-white">8:00 AM <span className="text-emerald-400 mx-1">—</span> 8:00 PM</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Saturdays</p>
                <p className="text-xl font-bold text-white">9:00 AM <span className="text-emerald-400 mx-1">—</span> 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
