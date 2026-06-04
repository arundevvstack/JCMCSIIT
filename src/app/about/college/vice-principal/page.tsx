import { Metadata } from 'next';
import { GraduationCap, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vice Principal | JCMCSIIT',
  description: 'About the Vice Principal and Dean Academic of John Cox Memorial C.S.I Institute of Technology.',
};

export default function VicePrincipalPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container px-4 mx-auto max-w-5xl">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Vice Principal</h1>
          <p className="text-slate-500 text-lg">Dean Academic · John Cox Memorial C.S.I Institute of Technology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <div className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100 sticky top-32">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mx-auto mb-5 overflow-hidden border-4 border-white shadow-lg">
                <span className="text-4xl font-black text-primary">VP</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Vice Principal</h2>
              <p className="text-primary font-semibold text-sm mt-1">Dean Academic</p>
              <p className="text-slate-500 text-sm mt-1">John Cox Memorial CSI Institute of Technology</p>
              <div className="mt-4 space-y-2 text-left">
                <a href="tel:04712550474" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>0471 2550474</span>
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 text-emerald-400">About the Role</h3>
              <p className="text-white/85 leading-relaxed text-justify">
                The Vice Principal, who also serves as Dean Academic, plays a pivotal role in the academic governance of the institution. This role encompasses the planning, coordination, and implementation of the academic curriculum in alignment with the guidelines of the APJ Abdul Kalam Technological University (KTU) and AICTE norms.
              </p>
              <p className="text-white/85 leading-relaxed text-justify mt-4">
                The Dean Academic oversees academic scheduling, examination coordination, faculty development programs, and student academic performance monitoring. The office also coordinates with all department heads to ensure quality delivery of academic programs and continuous improvement of academic standards.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4">Key Responsibilities</h4>
              <ul className="space-y-3">
                {[
                  'Academic Planning and Curriculum Oversight',
                  'Faculty Development and Performance Monitoring',
                  'Coordination with KTU for Academic Compliance',
                  'Examination and Evaluation Management',
                  'Student Academic Advisory and Mentoring System',
                  'Research and Innovation Promotion',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
