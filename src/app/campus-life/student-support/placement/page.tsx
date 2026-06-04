import { Metadata } from 'next';
import { Briefcase, Users, Trophy, Phone, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Placement / CGPU | JCMCSIIT',
  description: 'Career Guidance and Placement Unit (CGPU) of John Cox Memorial C.S.I Institute of Technology.',
};

const cgpuTeam = [
  { role: 'Chair Person', name: 'Dr. Anshad A.S', extra: 'Principal' },
  { role: 'Placement Officer', name: 'Mr. Vishnu Kumar S', extra: '9447144512' },
  { role: 'Assistant Placement Officer', name: 'Mrs. Anu R John', extra: 'AP, EEE · 9207661376' },
  { role: 'Training Officer', name: 'Mrs. Tintu S S', extra: 'AP, ECE · 9562556431' },
  { role: 'ME Coordinator', name: 'Mr. Shehin N', extra: 'AP, ME' },
  { role: 'CSE Coordinator', name: 'Mrs. Padma priya S Babu', extra: '' },
  { role: 'CE Coordinator', name: 'Mrs. Sanheetha John', extra: '' },
  { role: 'EEE Coordinator', name: 'Mrs. Anjana S P', extra: '' },
  { role: 'ECE Coordinator', name: 'Mrs. Seena M K', extra: '' },
];

const companies = [
  'Apps Team', 'Cool Minds', 'Gio Macs', 'Infoblox',
  'Innovation Incubator', 'Numenor', 'One Team', 'Radel',
  'TCS', 'Infosys', 'UST Global', 'Sutherland',
  'ALLIANZ Services', 'Speridian Technologies', 'NeST Digital', 'TESTHOUSE',
];

const placements = [
  { year: '2022-2023', pdf: 'https://jcmcsiit.ac.in/img/placement/PLACEMENT 2022-23.pdf' },
  { year: '2023-2024', pdf: 'https://jcmcsiit.ac.in/img/placement/PLACEMENT 2023-24.pdf' },
  { year: '2024-2025', pdf: 'https://jcmcsiit.ac.in/img/placement/PLACEMENT 2024-25.pdf' },
];

export default function CGPUPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container px-4 mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">Student Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Placement / CGPU
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Career Guidance and Placement Unit
          </p>
        </div>

        {/* About CGPU */}
        <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] rounded-3xl p-10 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">About CGPU</h2>
          <p className="text-white/85 leading-relaxed text-justify">
            The Career Guidance and Placement Unit, headed by a team of experienced faculty members in the field of recruitment, plays an active role on campus, and acts as a bridge between the students of the college and the Corporates. The unit constantly works to develop the student&apos;s technical knowledge and soft skills to meet the corporate recruitment process. The unit aims to place maximum number of students through various on campus and off campus recruitments organized by Multinational Companies (MNCs).
          </p>
        </div>

        {/* CGPU Team */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">CGPU Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cgpuTeam.map((member, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-primary/30 transition-all">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{member.role}</p>
                <p className="text-slate-900 font-bold">{member.name}</p>
                {member.extra && <p className="text-slate-500 text-sm mt-0.5">{member.extra}</p>}
                {member.extra && member.extra.includes('94') && (
                  <a href={`tel:${member.extra.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                    <Phone className="w-3 h-3" />
                    {member.extra.match(/9\d{9}/)?.[0]}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Placement Records */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">Placement Records</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {placements.map((p, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center hover:border-primary/30 transition-all group">
                <p className="text-lg font-bold text-slate-900 mb-4">Academic Year {p.year}</p>
                <a
                  href={p.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all group-hover:scale-105"
                >
                  <FileText className="w-4 h-4" />
                  View Report
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900">Companies Visited</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {companies.map((company, i) => (
              <div key={i}
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center font-semibold text-slate-700 text-sm hover:border-primary/30 hover:bg-blue-50/50 transition-all">
                {company}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
