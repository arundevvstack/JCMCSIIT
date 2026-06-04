import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, CheckCircle2, Crown, Shield, BookOpen, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Governing Body | JCMCSIIT',
  description: 'Governing Body members and functions of John Cox Memorial C.S.I Institute of Technology.',
};

const members = [
  { sl: 1,  name: 'Bishop, South Kerala Diocese',    designation: 'Chairman',        role: 'Society of Technical Training (STT)',          badge: 'Chairman',   badgeColor: 'amber'   },
  { sl: 2,  name: 'Er. T. B Sanal Kumar',            designation: 'Secretary',       role: 'Member nominated by STT',                      badge: 'STT Member', badgeColor: 'blue'    },
  { sl: 3,  name: 'Mr. Mohan Kumar',                 designation: 'Manager of STT',  role: 'Member nominated by STT',                      badge: 'STT Member', badgeColor: 'blue'    },
  { sl: 4,  name: 'Rev. AKHIL RL',                   designation: 'Bursar',          role: 'JCMCSIIT · Member nominated by STT',           badge: 'STT Member', badgeColor: 'blue'    },
  { sl: 5,  name: 'Dr. Sheeba Jeba Malar J',         designation: 'Dean Academics',  role: 'JCMCSIIT · Faculty Member nominated by STT',   badge: 'Faculty',    badgeColor: 'emerald' },
  { sl: 6,  name: 'Dr. Sanjit J',                    designation: 'Assoc. Prof & HOD ME', role: 'Faculty Member nominated by STT',          badge: 'Faculty',    badgeColor: 'emerald' },
  { sl: 7,  name: 'Dr. Ramesh Unnikrishnan',         designation: 'Nominee of AICTE', role: 'AICTE Representative',                        badge: 'AICTE',      badgeColor: 'violet'  },
  { sl: 8,  name: 'Prof. T. Gnanalal',               designation: 'Educationalist',  role: 'Member nominated by RO',                       badge: 'RO Member',  badgeColor: 'cyan'    },
  { sl: 9,  name: 'Dr. Sabeena M',                   designation: 'KTU Nominee',     role: 'Member Nominee of KTU',                        badge: 'KTU',        badgeColor: 'indigo'  },
  { sl: 10, name: 'Prof. Dr. Shalij P.R',            designation: 'DTE',             role: 'Govt. of Kerala · Member nominated by State',  badge: 'Govt.',      badgeColor: 'orange'  },
  { sl: 11, name: 'Prof. Dr. Dorairangaswamy',       designation: 'Member',          role: 'Member nominated by STT',                      badge: 'STT Member', badgeColor: 'blue'    },
  { sl: 12, name: 'Prof. Dr. SasiKumaran Nair',      designation: 'Member',          role: 'Member nominated by STT',                      badge: 'STT Member', badgeColor: 'blue'    },
  { sl: 13, name: 'Dr. Anshad A.S',                  designation: 'Principal',       role: 'JCMCSIIT · Member Secretary',                  badge: 'Secretary',  badgeColor: 'rose'    },
];

const functions = [
  'To monitor the academic and other related activities of the college.',
  'To consider the recommendations of the Staff Selection Committee.',
  'To consider the important communications, policy decisions received from the University, Government, AICTE etc.',
  'To monitor the students and faculty development programs.',
  'To implement the recommendations of the Management Committee.',
  'To vet the annual budget of the college.',
];

const badgeStyles: Record<string, string> = {
  amber:   'bg-amber-100 text-amber-700 border border-amber-200',
  blue:    'bg-blue-100 text-blue-700 border border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  violet:  'bg-violet-100 text-violet-700 border border-violet-200',
  cyan:    'bg-cyan-100 text-cyan-700 border border-cyan-200',
  indigo:  'bg-indigo-100 text-indigo-700 border border-indigo-200',
  orange:  'bg-orange-100 text-orange-700 border border-orange-200',
  rose:    'bg-rose-100 text-rose-700 border border-rose-200',
};

const avatarColors = [
  'bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-orange-600',
  'bg-cyan-600', 'bg-rose-600', 'bg-indigo-600', 'bg-amber-600',
  'bg-teal-600', 'bg-pink-600', 'bg-blue-700', 'bg-emerald-700', 'bg-violet-700',
];

export default function GoverningBodyPage() {
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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">Administration</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-5">
            Governing <span className="text-blue-600">Body</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            The Governing Body ensures effective management of the institution and plans its future development, overseeing academic excellence and institutional growth.
          </p>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Crown,    title: 'Supreme Authority',  desc: 'The Board of Governors is the supreme administrative authority of the college.'         },
            { icon: BookOpen, title: 'Academic Oversight', desc: 'The Council meets annually to review academic performance, activities and achievements.'  },
            { icon: Shield,   title: 'Policy & Governance', desc: 'Reviews policy decisions from the University, Government, AICTE and affiliated bodies.'  },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Functions */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm mb-14">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full shrink-0"></div>
            <h2 className="text-2xl font-bold text-slate-900">Functions of the Board</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {functions.map((fn, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-slate-700 text-sm font-medium leading-relaxed">{fn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full shrink-0"></div>
            <h2 className="text-2xl font-bold text-slate-900">Governing Body Members</h2>
            <span className="ml-auto text-sm font-semibold text-slate-400">{members.length} Members</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((m, i) => (
              <div key={m.sl} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-2xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center shrink-0 text-white font-black text-lg`}>
                  {m.name.split(' ').find(w => /[A-Z]/.test(w[0]))?.charAt(0) ?? m.sl}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{m.name}</p>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles[m.badgeColor]}`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-blue-600 font-semibold text-xs mb-1">{m.designation}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Banner */}
        <div className="relative bg-[#0B1F3A] rounded-3xl p-10 md:p-12 overflow-hidden mt-14">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Governing Council Meetings</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                The Governing Council convenes once a year. During this meeting, the Principal presents detailed information on academic performance, institutional activities, and the achievements of faculty and students from the previous semester.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
