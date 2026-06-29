import { Metadata } from "next";
import { ArrowLeft, Wallet, GraduationCap, Percent, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fees & Scholarships | JCMCSIIT",
  description: "Detailed information about B.Tech fee structure and available scholarships.",
};

export default function FeesScholarshipsPage() {
  const admissionFees = [
    { item: "Application & Administration Fee", amount: "2,000", desc: "One-time payment at the time of admission" },
    { item: "PTA Subscription", amount: "1,200", desc: "Payable annually" },
    { item: "Smart Classroom Fee", amount: "250", desc: "Payable every semester" },
    { item: "Registration Fee for Add-on LBS Course", amount: "2,000", desc: "One-time payment" },
    { item: "Placement & Training Classes", amount: "2,000", desc: "Payable annually" },
    { item: "College Development Fund", amount: "3,000", desc: "One-time payment" },
    { item: "Caution Deposit", amount: "10,000", desc: "Refundable deposit" },
    { item: "Learning Management Software", amount: "250", desc: "Payable every semester" },
  ];

  const tuitionBiomedicalAIML = [
    { category: "Government Quota", fee: "42,000/-" },
    { category: "Management", fee: "48,000/-" },
    { category: "NRI", fee: "60,000/-" },
  ];

  const tuitionCSE = [
    { category: "Government Quota", fee: "40,000/-" },
    { category: "Management", fee: "45,000/-" },
    { category: "NRI", fee: "55,000/-" },
  ];

  const tuitionECE = [
    { category: "Government Quota", fee: "37,500/-" },
    { category: "Management", fee: "40,000/-" },
    { category: "NRI", fee: "55,000/-" },
  ];

  const tuitionCore = [
    { category: "Government Quota", fee: "33,000/-" },
    { category: "Management", fee: "35,000/-" },
    { category: "NRI", fee: "43,000/-" },
  ];

  const lateralFees = [
    { branch: "CSE", fee: "22,000/-" },
    { branch: "ECE", fee: "22,000/-" },
    { branch: "Civil Engineering", fee: "13,000/-" },
    { branch: "Mechanical Engineering", fee: "13,000/-" },
    { branch: "Electrical & Electronics Engineering", fee: "13,000/-" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 uppercase">
            Fee Structure <span className="text-blue-600">2026–2027</span>
          </h1>
          <p className="text-slate-600 text-xl leading-relaxed max-w-2xl mx-auto">
            Transparent fee structures and financial assistance programs to support your engineering journey.
          </p>
        </div>

        {/* Admission Fees */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 uppercase">Other Fees Payable at the Time of Admission</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 font-semibold text-slate-700">Item</th>
                    <th className="py-4 px-4 font-semibold text-slate-700">Description</th>
                    <th className="py-4 px-4 font-semibold text-slate-700 text-right whitespace-nowrap">Amount (Rs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admissionFees.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-100/50 transition-colors">
                      <td className="py-4 px-4 text-slate-800 font-medium">{item.item}</td>
                      <td className="py-4 px-4 text-slate-500 text-sm">{item.desc}</td>
                      <td className="py-4 px-4 text-slate-800 font-semibold text-right">₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-blue-600 rounded-2xl flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-2 md:mb-0">Total Admission Fees</h3>
              <span className="text-3xl font-bold">₹20,700/-</span>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 flex items-start">
            <Info className="w-6 h-6 text-amber-600 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 mb-2 uppercase tracking-wide">Important Note</h3>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                <li>University Fee will be collected additionally as per the norms of the University.</li>
                <li>Additional fund will be collected from students who score less than <strong>75% in Plus Two</strong>.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tuition Fees Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center uppercase">Tuition Fee (Per Semester)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Biomedical & AIML */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase">B.Tech Biomedical & AIML</h3>
              <div className="space-y-3">
                {tuitionBiomedicalAIML.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span className="font-bold text-blue-600">{item.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CSE */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase">B.Tech Computer Science & Engineering</h3>
              <div className="space-y-3">
                {tuitionCSE.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span className="font-bold text-blue-600">{item.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ECE */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase">B.Tech Electronics & Communication Engineering</h3>
              <div className="space-y-3">
                {tuitionECE.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span className="font-bold text-blue-600">{item.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Branches */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase">B.Tech Civil, Mechanical & EEE</h3>
              <div className="space-y-3">
                {tuitionCore.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="font-medium text-slate-700">{item.category}</span>
                    <span className="font-bold text-blue-600">{item.fee}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Lateral Entry */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 uppercase">Lateral Entry B.Tech (Per Semester)</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-4 px-4 font-semibold text-slate-700">Programme</th>
                    <th className="py-4 px-4 font-semibold text-slate-700 text-right whitespace-nowrap">Management Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lateralFees.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-100/50 transition-colors bg-white">
                      <td className="py-4 px-4 text-slate-800 font-medium">{item.branch}</td>
                      <td className="py-4 px-4 text-emerald-600 font-bold text-right">{item.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <div className="max-w-4xl mx-auto mb-24 text-center">
          <div className="inline-block bg-slate-100 rounded-full px-6 py-3 border border-slate-200">
            <p className="text-slate-700 font-medium">
              Only limited seats are available for <strong>Non-KEAM</strong> students. Seat availability can be confirmed by visiting the <strong>College Admission Cell</strong>.
            </p>
          </div>
        </div>

        {/* Scholarships Section (Preserved) */}
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
