import { Metadata } from 'next';
import { Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chairman | JCMCSIIT',
  description: 'Message from the Chairman of John Cox Memorial C.S.I Institute of Technology.',
};

export default function ChairmanPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container px-4 mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Chairman</h1>
        </div>

        {/* Chairman Card */}
        <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

            {/* Photo Side */}
            <div className="md:col-span-1 flex items-center justify-center p-10 bg-white/5">
              <div className="text-center">
                <div className="w-48 h-48 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  <img
                    src="https://jcmcsiit.ac.in/img/bishop_1.png"
                    alt="Most Rev. A. Dharma Raj Rasalam"
                    className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-white text-xl font-bold leading-tight">Most. Rev. A. DHARMA RAJ RASALAM</h2>
                <p className="text-emerald-400 text-sm mt-1">Moderator, Church of South India</p>
                <p className="text-white/60 text-sm mt-1">Chairman &amp; Manager</p>
              </div>
            </div>

            {/* Quote Side */}
            <div className="md:col-span-2 p-10 flex flex-col justify-center">
              <Quote className="w-10 h-10 text-emerald-400 mb-6 opacity-80" />
              <blockquote className="text-white text-xl md:text-2xl font-light leading-relaxed italic">
                "I wish all success and urge to pray daily for all the good works planned for the college&apos;s fulfillment"
              </blockquote>
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-white/70 text-sm leading-relaxed">
                  The institution is under the administrative control of the Society for Technical Training (STT) of South Kerala Diocese (SKD) of Church of South India (CSI). The management of the institution is vested with the Governing Body and the Executive Committee headed by the Most Reverend Chairman &amp; Manager.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
