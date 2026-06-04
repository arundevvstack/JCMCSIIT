import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Download, ExternalLink, Globe, GraduationCap, FileText, Info, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KEAM Prospectus & Admission Guide | JCMCSIIT',
  description: 'Download the KEAM prospectus and learn about the centralised allotment process for B.Tech admission at JCMCSIIT.',
};

const chapters = [
  { no: '1', title: 'Introduction',                  desc: 'Overview of KEAM and the Commissioner for Entrance Examinations.' },
  { no: '2', title: 'Courses Offered',               desc: 'List of Engineering, Architecture, and Medical courses covered.' },
  { no: '3', title: 'Eligibility',                   desc: 'Academic, nativity, and age requirements for engineering candidates.' },
  { no: '4', title: 'Reservation of Seats',          desc: 'Mandatory reservation quotas, community categories, and special reservations.' },
  { no: '5', title: 'Application Process',           desc: 'Step-by-step guide to filling the online application form.' },
  { no: '6', title: 'Admit Card & Exam',             desc: 'Downloading admit cards, exam centres, and examination guidelines.' },
  { no: '7', title: 'Centralised Allotment (CAP)',   desc: 'How the single window allotment process works for seat allocation.' },
  { no: '8', title: 'Fee Structure',                 desc: 'Tuition fees, special fees, and payment procedures.' },
];

export default function KeamProspectusPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-orange-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 mb-6 shadow-sm">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-700 uppercase tracking-widest">Entrance Examination</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            KEAM <span className="text-orange-600">Prospectus</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            The official guide for admission to Professional Degree Courses in Kerala. Download the prospectus to understand the eligibility, reservation, and allotment processes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Download Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-colors">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                    <FileText className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Official KEAM Prospectus</h2>
                    <p className="text-sm font-medium text-slate-500">Issued by CEE Kerala • PDF Format</p>
                  </div>
                </div>
                <a
                  href="https://cee.kerala.gov.in/keamonline2024/public/pdf/Prospectus.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors shadow-lg hover:shadow-orange-600/20"
                >
                  <Download className="w-5 h-5" /> Download PDF
                </a>
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full shrink-0" />
                <h3 className="font-bold text-slate-900 text-lg">Key Chapters in Prospectus</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 border-t border-slate-100">
                {chapters.map((chapter, i) => (
                  <div key={i} className="p-6 border-b border-slate-100 md:border-r hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-sm">
                        {chapter.no}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 mb-1">{chapter.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{chapter.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Notice */}
            <div className="flex items-start gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <Info className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Important Note for Engineering Candidates</h4>
                <p className="text-sm text-blue-800/80 leading-relaxed">
                  Admission to Engineering courses is regulated on the basis of a 50:50 weightage. 50% marks are taken from the Entrance Examination (KEAM) and 50% from the marks obtained in Mathematics, Physics, and Chemistry in the final year of the qualifying examination (Plus Two).
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* CEE Kerala Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" /> CEE Kerala Portal
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                The Commissioner for Entrance Examinations (CEE) is the authority responsible for conducting KEAM and executing the Centralised Allotment Process (CAP).
              </p>
              <div className="space-y-3">
                <a
                  href="https://cee.kerala.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group"
                >
                  <span className="font-bold text-emerald-800 text-sm">Official CEE Website</span>
                  <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://cee.kerala.gov.in/keamonline2024/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 border border-slate-100 transition-colors group"
                >
                  <span className="font-bold text-slate-700 text-sm">KEAM Candidate Portal</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <h3 className="font-bold text-xl mb-6 flex items-center gap-3 relative z-10">
                <BookOpen className="w-5 h-5 text-blue-400" /> College Resources
              </h3>
              
              <div className="space-y-2 relative z-10">
                <Link href="/admissions/ug" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">UG Admission (B.Tech)</span>
                </Link>
                <Link href="/admissions/fees-scholarships" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm">Fees & Scholarships</span>
                </Link>
                <Link href="/admissions/application-form" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                    <ArrowLeft className="w-4 h-4 text-white rotate-135" />
                  </div>
                  <span className="font-bold text-blue-400 text-sm">Submit Enquiry Form</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
