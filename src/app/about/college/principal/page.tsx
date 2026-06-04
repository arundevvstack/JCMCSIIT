import { Metadata } from 'next';
import { Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Principal | JCMCSIIT',
  description: 'About the Principal of John Cox Memorial C.S.I Institute of Technology.',
};

export default function PrincipalPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container px-4 mx-auto max-w-5xl">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Principal</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Photo */}
          <div className="md:col-span-1">
            <div className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100 sticky top-32">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center mx-auto mb-5 overflow-hidden border-4 border-white shadow-lg">
                <img
                  src="https://jcmcsiit.ac.in/img/Principal.jpg"
                  alt="Dr. Anshad A.S"
                  className="w-full h-full object-cover"
                  />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Dr. Anshad A.S</h2>
              <p className="text-primary font-semibold text-sm mt-1">Principal</p>
              <p className="text-slate-500 text-sm mt-1">John Cox Memorial CSI Institute of Technology</p>
              <div className="mt-4 space-y-2 text-left">
                <a href="tel:9496981666" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>9496 981 666</span>
                </a>
                <a href="mailto:principal@jcmcsiit.ac.in" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors break-all">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>principal@jcmcsiit.ac.in</span>
                </a>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 text-emerald-400">Principal&apos;s Message</h3>
              <p className="text-white/85 leading-relaxed text-justify">
                Welcome to John Cox Memorial C.S.I Institute of Technology. Our institution is committed to providing quality technical education that nurtures creative thinking, professional excellence, and ethical values. We strive to produce graduates who are not only technically competent but also socially responsible citizens who contribute meaningfully to the society and nation.
              </p>
              <p className="text-white/85 leading-relaxed text-justify mt-4">
                At JIT, we believe in the holistic development of our students. Our dedicated faculty, state-of-the-art laboratories, and industry partnerships ensure that our students are well-prepared to meet the challenges of the modern technological world. I invite you to explore the opportunities that await you at our institution.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Designation', value: 'Principal' },
                { label: 'Contact', value: '9496 981 666' },
                { label: 'Email', value: 'principal@jcmcsiit.ac.in' },
                { label: 'Institution', value: 'JIT, Kannammoola' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-slate-800 font-medium text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
