import { Metadata } from "next";
import Link from "next/link";
import { Users, Mail, GraduationCap, ChevronRight, User, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Alumni | JCMCSIIT",
  description: "Join the John Cox Memorial CSI Institute of Technology Alumni Association and connect with former students.",
};

const committeeMembers = [
  { role: "Patron", name: "Dr. Anshad A.S", desc: "Principal" },
  { role: "Vice President", name: "Dr. J Sheeba Jeba Malar", desc: "Vice Principal" },
  { role: "Convener", name: "Mrs. Nitya V Arnold", desc: "Secretary" },
  { role: "Member", name: "Mrs. L.Sreelatha", desc: "HOD, CE" },
  { role: "Member", name: "Mr. Sanjit.J", desc: "HOD, ME" },
  { role: "Member", name: "Mrs. Tini S Russel", desc: "HOD, ECE" },
  { role: "Member", name: "Mr. Vishnukumar S", desc: "HOD, CSE" },
  { role: "Member", name: "Mrs. Helen Shibija", desc: "HOD, Maths" },
];

const coordinators = [
  { dept: "CSE Coordinator", name: "Ms. Chelsy Sapna Josephus" },
  { dept: "EEE Coordinator", name: "Mrs. Anjana S.P" },
  { dept: "ECE Coordinator", name: "Mrs. Anoja C.M" },
  { dept: "ME Coordinator", name: "Mr. Akhil W V" },
  { dept: "CE Coordinator", name: "Ms. Sangeetha John" },
  { dept: "Staff Co-ordinator", name: "Mrs. Nitya V Arnold" },
];

export default function AlumniPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl text-blue-600 mb-6 relative z-10 border border-slate-100">
            <Users className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight relative z-10">
            Alumni <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Association</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto relative z-10 leading-relaxed">
            The Alumni of the college were formed to provide a forum to bring together the former students of the college for the overall development of the College.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link 
              href="https://docs.google.com/forms/d/1bttuO4P62IULd_Rlg7MDceSyQnxWBZcub9Rx6N9Zd8c/viewform" 
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/25"
            >
              Alumni Registration Form <ExternalLink className="w-4 h-4" />
            </Link>
            <a 
              href="mailto:jitalumni@jcmcsiit.ac.in"
              className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              jitalumni@jcmcsiit.ac.in
            </a>
          </div>
        </div>

        {/* Two Column Layout for Committee & Coordinators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mt-20">
          
          {/* Executive Committee */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Executive Committee</h2>
            </div>
            
            <div className="space-y-4">
              {committeeMembers.map((member, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                      <span className="text-sm font-semibold text-indigo-600">{member.role}</span>
                      <span className="hidden sm:inline text-slate-300">•</span>
                      <span className="text-sm text-slate-500">{member.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Coordinators */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Department Coordinators</h2>
            </div>
            
            <div className="space-y-4">
              {coordinators.map((coord, idx) => (
                <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 transition-colors border border-slate-100 hover:border-blue-100">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{coord.dept}</span>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{coord.name}</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>

            {/* Joining CTA */}
            <div className="mt-12 p-6 bg-slate-900 rounded-3xl text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
               <h3 className="text-xl font-bold text-white mb-2 relative z-10">Reconnect With JIT</h3>
               <p className="text-slate-400 text-sm mb-6 relative z-10">We are proud of our alumni and their achievements. Stay connected!</p>
               <Link 
                  href="https://forms.gle/rRajcv1vd8Y5pMsz8" 
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-500 transition-colors w-full justify-center relative z-10"
                >
                  Register Now <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
