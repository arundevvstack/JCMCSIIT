import { Metadata } from "next";
import { CheckCircle, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Internal Quality Assurance Cell (IQAC) | JCMCSIIT",
  description: "Maintaining and enhancing the quality of academic and administrative performance at JCMCSIIT.",
};

export default function IQACPage() {
  const members = [
    { role: "Chairperson", name: "Prof. Dr. Anshad A S, Ph. D", title: "(Principal)" },
    { role: "Coordinator", name: "Mrs. Sreelatha", title: "(HoD CE)" },
    { role: "Teacher Representative", name: "Mr. Vishnukumar S", title: "(HoD CSE)" },
    { role: "Teacher Representative", name: "Dr. Sheeba Jeba Malar", title: "(HoD EEE)" },
    { role: "Teacher Representative", name: "Mr. Sanjith", title: "(HoD ME)" },
    { role: "Teacher Representative", name: "Dr. Liji R F", title: "(HoD ECE)" },
    { role: "Member, Management", name: "Rev. Akhil R L", title: "" },
    { role: "Nominee from Local Society", name: "Ms. Sherly Mathew", title: "" },
    { role: "Nominee from Students", name: "Bibin ML", title: "S7 CE" },
    { role: "Nominee from Alumni", name: "Ms. Vinitha Raj poika", title: "" },
    { role: "Nominee from Industry", name: "Deepu K. Krishnan", title: "Scientist C-DAC" },
    { role: "Nominee from Professional Body", name: "Er. SaratKumar K, MIE", title: "" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="max-w-4xl mx-auto mb-16">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 mb-8 shadow-sm">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 tracking-wide">Quality Assurance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Internal Quality Assurance <span className="text-emerald-600">Cell (IQAC)</span>.
          </h1>
          <p className="text-slate-600 text-xl leading-relaxed">
            Committed to continuous improvement in the entire operations of the institution, ensuring that quality becomes the defining element of our education system.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm mb-16">
          <div className="flex items-center mb-8 pb-6 border-b border-slate-100">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">IQAC Committee Members</h2>
              <p className="text-slate-500">The core team driving quality initiatives.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {members.map((member, i) => (
              <div key={i} className="flex flex-col p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">{member.role}</span>
                <span className="text-lg font-bold text-slate-900">{member.name}</span>
                {member.title && <span className="text-slate-500 text-sm">{member.title}</span>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
