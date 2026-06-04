"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, FileText, Download, User, Building, ExternalLink, CreditCard, Globe, Layers, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const internalLinks = [
  { label: "Admissions Home",           desc: "Overview of all admission programmes",        href: "/admissions",                    icon: GraduationCap, color: "blue",    download: false },
  { label: "UG Admissions (B.Tech)",    desc: "Eligibility, process & B.Tech seat matrix",   href: "/admissions/ug",                 icon: BookOpen,      color: "blue",    download: false },
  { label: "PG Admissions (M.Tech)",    desc: "Postgraduate programme information",           href: "/admissions/pg",                 icon: BookOpen,      color: "violet",  download: false },
  { label: "E-Brochure",               desc: "Digital college brochure 2025-26",             href: "/admissions/e-brochure",         icon: FileText,      color: "emerald", download: true  },
  { label: "KEAM Prospectus",           desc: "KEAM information & seat allotment guide",      href: "/admissions/keam-prospectus",    icon: FileText,      color: "orange",  download: true  },
  { label: "Fees & Scholarships",       desc: "Fee structure and scholarship details",         href: "/admissions/fees-scholarships",  icon: CreditCard,    color: "emerald", download: false },
  { label: "Financial Aid",             desc: "Loan schemes and financial assistance",         href: "/admissions/financial-aid",      icon: CreditCard,    color: "violet",  download: false },
  { label: "Online Payment",            desc: "Pay admission or tuition fees online",          href: "/admissions/payment",            icon: CreditCard,    color: "blue",    download: false },
  { label: "Preparation & Tests",       desc: "KEAM, JEE & entrance exam resources",          href: "/admissions/preparation-tests",  icon: Layers,        color: "amber",   download: false },
  { label: "Departments",               desc: "Explore all B.Tech departments",               href: "/academics/departments",         icon: Building,      color: "blue",    download: false },
  { label: "Academic Syllabus",         desc: "KTU syllabus and schemes of study",            href: "/academics/syllabus",            icon: BookOpen,      color: "emerald", download: false },
  { label: "Facilities",                desc: "Labs, hostel, canteen & more",                 href: "/facilities",                    icon: Layers,        color: "violet",  download: false },
];

const externalLinks = [
  { label: "KEAM Official Portal",   desc: "Kerala Engineering Architecture Medical",           href: "https://cee.kerala.gov.in/"           },
  { label: "KTU University",         desc: "APJ Abdul Kalam Technological University",          href: "https://ktu.edu.in/"                  },
  { label: "AICTE Portal",           desc: "All India Council for Technical Education",         href: "https://www.aicte-india.org/"         },
  { label: "CAP Allotment Portal",   desc: "Centralised Allotment Process — CEE Kerala",       href: "https://hrd.kerala.gov.in/"           },
];

const colorMap: Record<string, string> = {
  blue:    "bg-blue-50 text-blue-600",
  violet:  "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  orange:  "bg-orange-50 text-orange-600",
  amber:   "bg-amber-50 text-amber-600",
};

export default function ApplicationFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="container px-4 mx-auto relative z-10 max-w-7xl">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">B.Tech Admission 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Start Your Journey With Us
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Join John Cox Memorial C.S.I Institute of Technology. Fill out the enquiry form below, or reach out to our admission helpdesk directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" /> Admission Enquiry Form
            </h2>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center mt-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Enquiry Submitted!</h3>
                <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
                  Thank you for your interest in JCMCSIIT. Our admissions team has received your details and will contact you shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-primary transition-colors shadow-sm"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <input required type="tel" placeholder="+91 98765 43210" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Program</label>
                  <select required className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-700">
                    <option value="">Select Program</option>
                    <option value="btech">B.Tech Engineering</option>
                    <option value="mtech">M.Tech (PG)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Preferred Department</label>
                <select required className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-700">
                  <option value="">Select Department</option>
                  <option value="aiml">Artificial Intelligence &amp; Machine Learning</option>
                  <option value="bme">Biomedical &amp; Robotic Engineering</option>
                  <option value="cse">Computer Science &amp; Engineering</option>
                  <option value="ece">Electronics &amp; Communication Engineering</option>
                  <option value="eee">Electrical &amp; Electronics Engineering</option>
                  <option value="me">Mechanical Engineering</option>
                  <option value="ce">Civil Engineering</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Any Questions?</label>
                <textarea rows={4} placeholder="Type your message here..." className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-primary text-white font-bold tracking-wide hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Submit Enquiry <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-5 space-y-6">

            {/* Dark Contact Card */}
            <div className="bg-[#0B1F3A] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Phone className="w-32 h-32" />
              </div>
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                <Building className="w-5 h-5 text-emerald-400" /> Admission Enquiry
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <p className="text-xs text-emerald-400 font-bold tracking-widest uppercase mb-3">Direct Contacts</p>
                  <div className="space-y-2.5 text-sm">
                    {[
                      { l: "Director",  n: "9496981555" },
                      { l: "Principal", n: "9496981666" },
                      { l: "Bursar",    n: "9496981777" },
                    ].map((c) => (
                      <div key={c.l} className="flex justify-between items-center">
                        <span className="text-white/60">{c.l}</span>
                        <a href={`tel:${c.n}`} className="font-bold hover:text-emerald-300 transition-colors">{c.n}</a>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <p className="text-xs text-emerald-400 font-bold tracking-widest uppercase mb-3">Office Lines</p>
                  <div className="flex flex-col gap-2">
                    <a href="tel:+9104712550474" className="font-semibold flex items-center gap-2 hover:text-emerald-300 transition-colors text-sm">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> +91 0471 2550474
                    </a>
                    <a href="tel:04712446949" className="font-semibold flex items-center gap-2 hover:text-emerald-300 transition-colors text-sm">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> 0471 2446949
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Resource Links */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Admission Resources
              </h3>
              <div className="flex flex-col gap-1.5">
                {internalLinks.map((link) => {
                  const Icon = link.icon;
                  const iconCls = colorMap[link.color] ?? colorMap.blue;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-primary hover:border-primary transition-all"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconCls} group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 group-hover:text-white transition-colors text-sm leading-tight">{link.label}</p>
                        <p className="text-slate-400 group-hover:text-white/60 transition-colors text-xs mt-0.5 truncate">{link.desc}</p>
                      </div>
                      {link.download
                        ? <Download className="w-3.5 h-3.5 text-slate-300 group-hover:text-white/70 shrink-0" />
                        : <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-white/70 shrink-0 group-hover:translate-x-1 transition-transform" />
                      }
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* External Portal Links */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Official Portals
              </h3>
              <div className="flex flex-col gap-1.5">
                {externalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-500 hover:border-emerald-500 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 group-hover:text-white transition-colors text-sm leading-tight">{link.label}</p>
                      <p className="text-slate-400 group-hover:text-white/60 transition-colors text-xs mt-0.5">{link.desc}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-white/70 shrink-0" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
