import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Download, Phone, Building, CheckCircle2, GraduationCap, Users, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'E-Brochure | JCMCSIIT',
  description: 'Download the official E-Brochure for John Cox Memorial CSI Institute of Technology.',
};

export default function EBrochurePage() {
  const brochureHighlights = [
    { title: "Academic Excellence", desc: "Detailed breakdown of B.Tech and M.Tech programmes.", icon: GraduationCap },
    { title: "State-of-the-Art Facilities", desc: "Laboratories, central library, and smart classrooms.", icon: Building },
    { title: "Placements & Training", desc: "Placement statistics, top recruiters, and career guidance.", icon: Users },
    { title: "Campus Life", desc: "Hostel amenities, sports infrastructure, and transportation.", icon: MapPin },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="container px-4 md:px-8 mx-auto relative z-10 max-w-7xl">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/admissions" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admissions
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 mb-6 shadow-sm">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-700 uppercase tracking-widest">Digital Prospectus</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            College <span className="text-indigo-600">E-Brochure</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Discover everything JCMCSIIT has to offer. Download our official E-Brochure to explore our academic programs, campus facilities, placement records, and vibrant student life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Download Card */}
            <div className="bg-[#0B1F3A] rounded-3xl p-8 md:p-12 border border-blue-900 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 mb-6 shadow-inner backdrop-blur-sm">
                  <BookOpen className="w-10 h-10 text-indigo-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Academic Year 2025-26</h2>
                <p className="text-white/70 text-lg mb-8 max-w-md">
                  Get a comprehensive overview of the curriculum, campus amenities, and admission guidelines in high-quality PDF format.
                </p>
                
                <a
                  href="/admission/E_Brochure_2026.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-indigo-500 text-white font-bold text-lg py-4 px-10 rounded-xl hover:bg-indigo-600 transition-all shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.5)] hover:-translate-y-1"
                >
                  <Download className="w-6 h-6" /> Download E-Brochure
                </a>
              </div>
            </div>

            {/* Highlights Grid */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full shrink-0" />
                <h3 className="text-2xl font-bold text-slate-900">What&apos;s Inside?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brochureHighlights.map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <item.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Admission Helpdesk */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-indigo-600" /> Admission Enquiry
              </h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-bold tracking-widest uppercase mb-4">Direct Contacts</p>
                  <div className="space-y-3 text-sm">
                    {[
                      { role: "Director", number: "9496981555" },
                      { role: "Principal", number: "9496981666" },
                      { role: "Bursar", number: "9496981777" },
                    ].map((contact) => (
                      <div key={contact.role} className="flex justify-between items-center bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
                        <span className="font-medium text-slate-600">{contact.role}</span>
                        <a href={`tel:${contact.number}`} className="font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
                          {contact.number}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-3">Office Lines</p>
                  <div className="space-y-2">
                    <a href="tel:+9104712550474" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">+91 0471 2550474</span>
                    </a>
                    <a href="tel:04712446949" className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">0471 2446949</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="font-bold text-xl mb-6 relative z-10">Why Download?</h3>
              
              <ul className="space-y-4 relative z-10">
                {[
                  "Offline access to all course details",
                  "Share easily with family and friends",
                  "High-resolution campus photography",
                  "Complete fee structure breakdown"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300 leading-relaxed font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
