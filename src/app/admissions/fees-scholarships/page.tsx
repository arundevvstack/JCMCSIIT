import { Metadata } from "next";
import { ArrowLeft, Wallet, GraduationCap, Percent } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fees & Scholarships | JCMCSIIT",
  description: "Detailed information about B.Tech fee structure and available scholarships.",
};

export default function FeesScholarshipsPage() {
  const regularFees = [
    { branch: "Computer Science & Engg. (CSE)", fee: "55,000" },
    { branch: "Artificial Intelligence & ML (AIML)", fee: "55,000" },
    { branch: "Civil Engineering (CE)", fee: "55,000" },
    { branch: "Mechanical Engineering (ME)", fee: "55,000" },
    { branch: "Electronics & Communication Engg. (ECE)", fee: "55,000" },
    { branch: "Electrical & Electronics Engg. (EEE)", fee: "43,000" },
  ];

  const lateralFees = [
    { branch: "Computer Science & Engg. (CSE)", fee: "22,000" },
    { branch: "Civil Engineering (CE)", fee: "13,000" },
    { branch: "Mechanical Engineering (ME)", fee: "13,000" },
    { branch: "Electronics & Communication Engg. (ECE)", fee: "13,000" },
    { branch: "Electrical & Electronics Engg. (EEE)", fee: "13,000" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
            Fees & <span className="text-blue-600">Scholarships</span>.
          </h1>
          <p className="text-slate-600 text-xl leading-relaxed max-w-2xl mx-auto">
            Transparent fee structures and financial assistance programs to support your engineering journey.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Regular B.Tech Fees</h2>
            </div>
            <div className="space-y-3">
              {regularFees.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="font-semibold text-slate-700">{item.branch}</span>
                  <span className="font-bold text-blue-600">₹{item.fee}<span className="text-sm text-slate-400 font-normal"> /sem</span></span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-6">* Note: Fees mentioned are Tuition Fees per semester.</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Lateral Entry Fees</h2>
            </div>
            <div className="space-y-3">
              {lateralFees.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="font-semibold text-slate-700">{item.branch}</span>
                  <span className="font-bold text-emerald-600">₹{item.fee}<span className="text-sm text-slate-400 font-normal"> /sem</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-[#0B1F3A] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <Percent className="h-8 w-8 text-amber-400 mr-4" />
              <h2 className="text-3xl font-bold">Scholarship Schemes</h2>
            </div>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl">
              Scholarship Schemes are available for Meritorious Students and those belonging to CSI/SIUC/BPL categories to encourage academic excellence and provide financial aid.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-xl mb-2 text-amber-300">Merit Scholarship</h3>
                <p className="text-blue-50">90% or above in +2 Physics, Chemistry and Mathematics individually and Entrance Exam Qualified: No tuition Fees</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-xl mb-2 text-amber-300">KEAM Rank Scholarship</h3>
                <p className="text-blue-50">Kerala Govt. Entrance Exam rank up to 10,000: No tuition Fees</p>
                <p className="text-blue-50 mt-2">Rank between 10001 and 25000: <strong>Fee as in Govt. Engg. colleges</strong></p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-xl mb-2 text-amber-300">Category Discount</h3>
                <p className="text-blue-50">CSI students / students from LMS Schools / BPL students: <strong>10% reduction from prescribed fees</strong></p>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-xl mb-2 text-amber-300">Academic Excellence</h3>
                <p className="text-blue-50">All &apos;A&apos; in PCM & has qualified KEAM Entrance Exam: <strong>₹15,000/- reduction from prescribed fees</strong></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
