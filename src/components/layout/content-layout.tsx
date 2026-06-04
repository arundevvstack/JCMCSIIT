import { ArrowLeft, ChevronRight, Phone, Mail, Building2, BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container px-4 md:px-8 mx-auto relative z-10 max-w-7xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">JCMCSIIT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            {title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-emerald-500" />
              <div className="prose prose-lg prose-slate max-w-none text-justify prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-2xl prose-img:shadow-md">
                {children}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Links */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Academic Programs", href: "/academics" },
                  { name: "Facilities Overview", href: "/facilities/campus" },
                  { name: "Student Support Cells", href: "/cells" },
                  { name: "Contact Administration", href: "/contact" },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Admission Helpdesk */}
            <div className="bg-[#0B1F3A] rounded-3xl p-8 border border-blue-900 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <Phone className="w-5 h-5 text-emerald-400" /> Need Assistance?
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6 relative z-10">
                Our helpdesk is available for any admission or administrative inquiries.
              </p>
              
              <div className="space-y-4 relative z-10">
                <a href="tel:04712550474" className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 border border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Office Line</p>
                    <p className="font-bold text-white">0471 2550474</p>
                  </div>
                </a>
                
                <a href="mailto:info@jcmcsiit.ac.in" className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 border border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Email Support</p>
                    <p className="font-bold text-white text-sm">info@jcmcsiit.ac.in</p>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
