import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Eye, Target, Lightbulb, Globe, FlaskConical } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vision & Mission | JCMCSIIT',
  description: 'Vision and Mission of John Cox Memorial C.S.I Institute of Technology, Thiruvananthapuram.',
};

const missions = [
  {
    id: 'M1',
    icon: Globe,
    color: 'blue',
    text: 'To foster young and potential generation of engineers to face the ensuing scientific, technological, managerial, ecological and societal challenges of the globe.',
  },
  {
    id: 'M2',
    icon: FlaskConical,
    color: 'violet',
    text: 'To develop cutting edge research and environment for innovation for addressing the national and global needs.',
  },
  {
    id: 'M3',
    icon: Lightbulb,
    color: 'emerald',
    text: 'To facilitate an innovative and active learning environment.',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; icon: string; badge: string }> = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-100',
    icon: 'text-blue-600',
    badge: 'bg-blue-600',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-900',
    border: 'border-violet-100',
    icon: 'text-violet-600',
    badge: 'bg-violet-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-100',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-600',
  },
};

export default function VisionMissionPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8">

        {/* Back link */}
        <div className="mb-8">
          <Link href="/about" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to About
          </Link>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">About the Institution</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-5">
            Vision &amp; <span className="text-blue-600">Mission</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            The guiding principles that shape every decision, programme, and pursuit of excellence at JCMCSIIT.
          </p>
        </div>

        {/* Vision Card */}
        <div className="relative bg-[#0B1F3A] rounded-3xl p-10 md:p-14 mb-8 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex items-start gap-6">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Eye className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Vision</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                To be a Knowledge hub and Centre of Excellence in the field of Technical Education that contributes to socio-economic development of the nation and the globe through excellent teaching-learning, research and living ambience.
              </h2>
            </div>
          </div>
        </div>

        {/* Mission Cards */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missions.map((m) => {
              const c = colorMap[m.color];
              const Icon = m.icon;
              return (
                <div key={m.id} className={`${c.bg} rounded-3xl p-8 border ${c.border} flex flex-col gap-5 hover:shadow-lg transition-shadow duration-300`}>
                  <div className="flex items-center justify-between">
                    <span className={`w-10 h-10 rounded-xl ${c.badge} flex items-center justify-center text-white font-black text-sm`}>
                      {m.id}
                    </span>
                    <Icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <p className={`${c.text} font-medium leading-relaxed text-base`}>{m.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
            Admission Enquiries
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              { label: 'Director', value: '9496981555' },
              { label: 'Principal', value: '9496981666' },
              { label: 'Bursar', value: '9496981777' },
              { label: 'Office', value: '+91 0471 2550474 / 2446949' },
            ].map((c) => (
              <div key={c.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{c.label}</p>
                <p className="text-slate-800 font-bold">{c.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
