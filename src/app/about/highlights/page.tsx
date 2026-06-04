import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft, Star, MapPin, Users, FlaskConical, Wifi, Briefcase,
  MessageSquare, Home, ShieldCheck, Award, GraduationCap, Bus,
  Mic, Lightbulb, Heart, PartyPopper, UtensilsCrossed, Building2, CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'College Highlights | JCMCSIIT',
  description: 'Key highlights and features of John Cox Memorial C.S.I Institute of Technology, Thiruvananthapuram.',
};

const highlights = [
  { icon: MapPin,         text: 'Situated at the heart of Thiruvananthapuram city',                             color: 'blue' },
  { icon: Users,          text: 'Dedicated team of faculty including well-experienced senior Professors',        color: 'violet' },
  { icon: GraduationCap,  text: '3-tier Student Advisory System and Counseling',                                color: 'emerald' },
  { icon: FlaskConical,   text: 'Well equipped state-of-the-art laboratories',                                  color: 'orange' },
  { icon: Wifi,           text: 'High-speed internet browsing facility across campus',                          color: 'cyan' },
  { icon: Briefcase,      text: 'Active Career Guidance & Placement Unit',                                      color: 'blue' },
  { icon: MessageSquare,  text: 'Spoken English and soft-skill development classes',                            color: 'violet' },
  { icon: Home,           text: 'Separate hostel facility for boys and girls',                                  color: 'emerald' },
  { icon: ShieldCheck,    text: 'Ragging-free campus — safe and secure environment',                            color: 'red' },
  { icon: CheckCircle2,   text: 'An institution deeply caring for student discipline',                          color: 'blue' },
  { icon: Award,          text: 'NBA Accredited departments',                                                   color: 'amber' },
  { icon: Award,          text: 'AICTE approved & KTU affiliated institution',                                  color: 'orange' },
  { icon: Briefcase,      text: 'Regular industry visits and internship opportunities',                         color: 'violet' },
  { icon: Lightbulb,      text: 'Active IEEE Student Chapter',                                                  color: 'cyan' },
  { icon: Lightbulb,      text: 'IEDC — Innovation and Entrepreneurship Development Cell',                      color: 'emerald' },
  { icon: Heart,          text: 'NSS unit for meaningful community service',                                    color: 'red' },
  { icon: PartyPopper,    text: 'Annual technical and cultural festivals',                                      color: 'amber' },
  { icon: UtensilsCrossed,text: 'Canteen with hygienic and affordable food facilities',                         color: 'orange' },
  { icon: Bus,            text: 'Transportation facility available for students',                               color: 'blue' },
  { icon: Building2,      text: 'Conference hall for seminars, workshops and events',                           color: 'violet' },
];

const colorMap: Record<string, { ring: string; iconBg: string; iconColor: string; hover: string }> = {
  blue:    { ring: 'ring-blue-100',    iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',    hover: 'hover:ring-blue-300' },
  violet:  { ring: 'ring-violet-100',  iconBg: 'bg-violet-50',  iconColor: 'text-violet-600',  hover: 'hover:ring-violet-300' },
  emerald: { ring: 'ring-emerald-100', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', hover: 'hover:ring-emerald-300' },
  orange:  { ring: 'ring-orange-100',  iconBg: 'bg-orange-50',  iconColor: 'text-orange-600',  hover: 'hover:ring-orange-300' },
  cyan:    { ring: 'ring-cyan-100',    iconBg: 'bg-cyan-50',    iconColor: 'text-cyan-600',    hover: 'hover:ring-cyan-300' },
  red:     { ring: 'ring-red-100',     iconBg: 'bg-red-50',     iconColor: 'text-red-600',     hover: 'hover:ring-red-300' },
  amber:   { ring: 'ring-amber-100',   iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   hover: 'hover:ring-amber-300' },
};

const stats = [
  { number: '2009', label: 'Year Established' },
  { number: '7+',   label: 'B.Tech Programs'  },
  { number: '130+', label: 'Faculty Members'  },
  { number: 'NBA',  label: 'Accredited'       },
];

export default function HighlightsPage() {
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">Why Choose JIT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-5 tracking-tight">
            College <span className="text-blue-600">Highlights</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover what makes John Cox Memorial C.S.I Institute of Technology the preferred choice for engineering education in Thiruvananthapuram.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
              <p className="text-3xl md:text-4xl font-black text-blue-600 mb-1">{s.number}</p>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {highlights.map((item, i) => {
            const c = colorMap[item.color] ?? colorMap.blue;
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl p-5 ring-1 ${c.ring} ${c.hover} hover:shadow-lg transition-all duration-300 flex flex-col gap-4 group`}
              >
                <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${c.iconColor}`} />
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="relative bg-[#0B1F3A] rounded-3xl p-10 md:p-14 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-600/10 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
              By the Numbers
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-2">Institution at a Glance</h2>
            <p className="text-white/50 text-sm">AICTE Approved · KTU Affiliated · NBA Accredited</p>
          </div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {stats.map((s, i) => (
              <div key={i} className="text-center px-6 py-4">
                <p className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">{s.number}</p>
                <p className="text-white/60 text-sm font-semibold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
