import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, Eye, Shield, Calendar, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mandatory Disclosure | JCMCSIIT',
  description: 'AICTE Mandatory Disclosure for John Cox Memorial C.S.I Institute of Technology, Thiruvananthapuram.',
};

const disclosureSections = [
  {
    title: 'Institution Details',
    items: [
      { label: 'Name of Institution',          value: 'John Cox Memorial C.S.I Institute of Technology' },
      { label: 'Institution Code',             value: 'JIT' },
      { label: 'Address',                      value: 'Kannammoola, Thiruvananthapuram, Kerala – 695011' },
      { label: 'Year of Establishment',        value: '2009' },
      { label: 'Type of Institution',          value: 'Private – Minority (Christian)' },
    ],
  },
  {
    title: 'Approvals & Affiliations',
    items: [
      { label: 'AICTE Approval',               value: 'F. No. 06/06/KER/ENGG/2009-10/020 dt. 30.6.2009' },
      { label: 'University Affiliation',       value: 'APJ Abdul Kalam Technological University (KTU)' },
      { label: 'Govt. of Kerala G.O.',         value: '(MS) No. 124/09/H.Edn dt. 3.8.09' },
      { label: 'NBA Accreditation',            value: 'Accredited (ECE Department)' },
      { label: 'NAAC Status',                  value: 'Accredited' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Society / Trust',              value: 'Society for Technical Training (STT)' },
      { label: 'Diocese',                      value: 'South Kerala Diocese (SKD), Church of South India (CSI)' },
      { label: 'Chairman & Manager',           value: 'Bishop, South Kerala Diocese' },
      { label: 'Registered Under',             value: 'Charitable Societies Registration Act XII of 1955' },
      { label: 'Registered Office',            value: 'LMS Compound, Thiruvananthapuram' },
    ],
  },
  {
    title: 'Contact & Communication',
    items: [
      { label: 'Director',                     value: '9496981555' },
      { label: 'Principal',                    value: '9496981666' },
      { label: 'Bursar',                       value: '9496981777' },
      { label: 'Office Phone',                 value: '+91 0471 2550474 / 2446949' },
    ],
  },
];

const programs = [
  { name: 'Artificial Intelligence & Machine Learning', code: 'AI&ML', intake: 60  },
  { name: 'Biomedical & Robotic Engineering',           code: 'BME',   intake: 30  },
  { name: 'Computer Science & Engineering',             code: 'CSE',   intake: 120 },
  { name: 'Electronics & Communication Engineering',    code: 'ECE',   intake: 60  },
  { name: 'Electrical & Electronics Engineering',       code: 'EEE',   intake: 60  },
  { name: 'Mechanical Engineering',                     code: 'ME',    intake: 60  },
  { name: 'Civil Engineering',                          code: 'CE',    intake: 60  },
];

export default function MandatoryDisclosurePage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8">

        {/* Back */}
        <div className="mb-8">
          <Link href="/about" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to About
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">AICTE Compliance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-5">
            Mandatory <span className="text-blue-600">Disclosure</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Statutory information mandated by the All India Council for Technical Education (AICTE) for public transparency and institutional accountability.
          </p>
        </div>

        {/* Update Notice */}
        <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-blue-900 text-sm">Last Updated: 29 March 2024</p>
            <p className="text-blue-700 text-sm mt-0.5">This disclosure is updated periodically as per AICTE guidelines. For the official document, download the PDF below.</p>
          </div>
          <div className="ml-auto flex gap-2 shrink-0">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </a>
            <a
              href="#"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>
          </div>
        </div>

        {/* Info Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {disclosureSections.map((section, si) => (
            <div key={si} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full shrink-0" />
                <h2 className="font-bold text-slate-900">{section.title}</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {section.items.map((item, ii) => (
                  <div key={ii} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-800 leading-relaxed">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Approved Programs Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full shrink-0" />
            <h2 className="font-bold text-slate-900">AICTE Approved Programmes</h2>
            <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{programs.length} Programmes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">S.No</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Programme</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Code</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Sanctioned Intake</th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Degree</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {programs.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-semibold">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">{p.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">{p.intake} seats</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">B.Tech (4 Years)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AICTE Links Footer */}
        <div className="relative bg-[#0B1F3A] rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-black text-lg">Official Regulatory Links</h3>
                <p className="text-white/50 text-xs">Verify accreditations and disclosures via official portals</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'AICTE Portal',         url: 'https://www.aicte-india.org/',      desc: 'All India Council for Technical Education' },
                { name: 'KTU University',        url: 'https://ktu.edu.in/',              desc: 'APJ Abdul Kalam Technological University' },
                { name: 'NBA Accreditation',     url: 'https://www.nbaind.org/',           desc: 'National Board of Accreditation' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 hover:bg-white/15 hover:border-white/20 transition-all group"
                >
                  <div>
                    <p className="text-white font-bold text-sm">{link.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
