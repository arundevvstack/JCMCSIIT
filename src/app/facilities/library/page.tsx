import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search, Clock, Wifi, BookMarked, MonitorPlay, Library, Users, ArrowRight } from "lucide-react";

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
  "DELNET membership for inter-library borrowing",
  "IEEE Xplore, Springer, and NPTEL course access",
  "Question paper archives and previous year solutions",
  "E-books repository with remote login facilities",
  "Automated issue and return tracking system",
];

export default function LibraryPage() {
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
            The Hub of <span className="text-violet-600">Knowledge</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            A state-of-the-art knowledge center fostering academic excellence, research, and continuous learning with an extensive collection of physical and digital resources.
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
