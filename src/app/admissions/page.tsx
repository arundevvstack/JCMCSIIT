import { Metadata } from "next";
import { CheckCircle2, Calendar, FileText, PhoneCall, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admissions 2026 | JCMCSIIT",
  description: "Join the next generation of technological leaders. Apply for B.Tech programs at JCMCSIIT.",
};

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 relative w-full overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <div className="layout-grid relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/60 bg-white mb-8 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[13px] font-bold text-slate-700 tracking-widest uppercase">Intake 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 max-w-4xl text-slate-900 leading-[1.05]">
            Your Future Starts Here.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl leading-relaxed font-medium">
            Join a premium, AI-native institution that guarantees an industry-ready career and empowers you to build the intelligent systems of tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-12 rounded-[2.5rem] relative overflow-hidden">
              <h2 className="text-3xl font-bold mb-10 text-slate-900">Admission Process</h2>
              <div className="space-y-10">
                {[
                  { title: "Registration", desc: "Fill out the online application form with basic details." },
                  { title: "Document Verification", desc: "Upload necessary academic transcripts and identification securely." },
                  { title: "Entrance/Counseling", desc: "Based on KEAM scores or management quota interviews." },
                  { title: "Enrollment", desc: "Fee payment and securing your seat in the preferred branch." }
                ].map((step, i) => (
                  <div key={i} className="flex relative">
                    {i < 3 && <div className="absolute left-7 top-14 bottom-[-2.5rem] w-0.5 bg-slate-100"></div>}
                    <div className="flex flex-col items-center mr-8 relative z-10">
                      <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center font-bold text-xl shadow-sm transition-colors hover:text-primary hover:border-slate-200">
                        {i + 1}
                      </div>
                    </div>
                    <div className="pt-2 pb-6">
                      <h3 className="text-xl font-bold mb-2 text-slate-900">{step.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-slate-50/50 p-10 rounded-[2rem] border border-slate-100/80 flex flex-col justify-between group hover:bg-white hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                <div>
                  <Calendar className="h-8 w-8 text-slate-400 mb-8 group-hover:text-primary transition-colors duration-300" />
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Book a Counselor</h3>
                  <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    Schedule a 1-on-1 session with our admission experts.
                  </p>
                </div>
                <button className="w-full py-3.5 rounded-xl bg-white border border-slate-200/80 text-slate-900 font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                  Schedule Call
                </button>
              </div>
              
              <div className="bg-slate-50/50 p-10 rounded-[2rem] border border-slate-100/80 flex flex-col justify-between group hover:bg-white hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                <div>
                  <FileText className="h-8 w-8 text-slate-400 mb-8 group-hover:text-primary transition-colors duration-300" />
                  <h3 className="text-2xl font-bold mb-3 text-slate-900">Scholarships</h3>
                  <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    Up to 100% scholarships for meritorious students.
                  </p>
                </div>
                <button className="w-full py-3.5 rounded-xl bg-white border border-slate-200/80 text-slate-900 font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar / Sticky Actions */}
          <div className="space-y-8 lg:sticky lg:top-28 h-fit">
            <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col text-center">
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Ready to Apply?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                Start your journey with JCMCSIIT today.
              </p>
              <Link href="/admissions/application-form" className="w-full h-14 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center hover:bg-slate-800 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-4 text-lg">
                Apply Now 2026
              </Link>
              <button className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 shadow-sm text-lg">
                <FileText className="h-5 w-5 text-slate-400" /> E-Brochure
              </button>
            </div>

            {/* AI Assistant Placeholder */}
            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Bot className="h-6 w-6 text-slate-900" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-slate-900">AI Assistant</h3>
                  <p className="text-[11px] font-bold uppercase text-green-600 tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-sm text-slate-600 font-medium border border-slate-200 mb-6 relative z-10 shadow-sm leading-relaxed">
                "Hi! I can help you find the right course, explain fee structures, or check your eligibility. What would you like to know?"
              </div>
              <button className="w-full py-3.5 rounded-xl bg-white border border-slate-200/80 text-slate-900 font-semibold hover:bg-slate-50 transition-colors relative z-10 shadow-sm flex items-center justify-center gap-2">
                Start Chat <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-600 mt-4 bg-white py-4 rounded-xl border border-slate-200/80 shadow-sm">
              <PhoneCall className="h-4 w-4 text-slate-400" />
              <span>WhatsApp: +91 9496981555</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
