import { Metadata } from 'next';
import { Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bursar | JCMCSIIT',
  description: 'About the Bursar of John Cox Memorial C.S.I Institute of Technology.',
};

export default function BursarPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container px-4 mx-auto max-w-5xl">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Bursar</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <div className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100 sticky top-32">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mx-auto mb-5 overflow-hidden border-4 border-white shadow-lg">
                <span className="text-4xl font-black text-primary">B</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Bursar</h2>
              <p className="text-primary font-semibold text-sm mt-1">Finance &amp; Administration</p>
              <p className="text-slate-500 text-sm mt-1">John Cox Memorial CSI Institute of Technology</p>
              <div className="mt-4 space-y-2 text-left">
                <a href="tel:9496981777" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>9496 981 777</span>
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 text-emerald-400">Role of the Bursar</h3>
              <p className="text-white/85 leading-relaxed text-justify">
                The Bursar is the chief financial and administrative officer of the institution. The Bursar oversees all financial management, fee collection, scholarship disbursement, and administrative operations of the college. Working in close coordination with the Principal and the Governing Body, the Bursar ensures that all resources are managed efficiently and transparently in accordance with regulatory norms and institutional policies.
              </p>
              <p className="text-white/85 leading-relaxed text-justify mt-4">
                For all fee-related queries, scholarship applications, financial clearances, and administrative matters, students and parents are encouraged to contact the Bursar&apos;s office during working hours.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4">Contact for Admissions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Director', phone: '9496 981 555' },
                  { label: 'Principal', phone: '9496 981 666' },
                  { label: 'Bursar', phone: '9496 981 777' },
                ].map((c, i) => (
                  <a key={i} href={`tel:${c.phone.replace(/\s/g, '')}`}
                    className="flex flex-col items-center bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group">
                    <Phone className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.label}</p>
                    <p className="text-slate-900 font-bold text-sm mt-1">{c.phone}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
