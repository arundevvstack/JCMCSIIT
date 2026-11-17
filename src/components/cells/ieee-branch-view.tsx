import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, Bot, Users, Sparkles, Award, Globe, BookOpen, CheckCircle2 } from 'lucide-react';

interface Society {
  code: string;
  name: string;
  description: string;
  focus: string[];
  icon: React.ElementType;
  color: string;
}

const societies: Society[] = [
  {
    code: 'IEEE SAS SBC',
    name: 'IEEE Sensors and Applications Society Student Branch Chapter',
    description: 'Focuses on the theory, design, fabrication, and applications of sensors, transducers, and sensing systems in modern industrial, medical, and robotics applications.',
    focus: ['Sensor design & interfacing', 'Industrial IoT & smart transducers', 'Biosensing & instrumentation', 'Technical symposiums & hands-on workshops'],
    icon: Cpu,
    color: 'emerald',
  },
  {
    code: 'IEEE RAS SBC',
    name: 'IEEE Robotics and Automation Society Student Branch Chapter',
    description: 'Promotes both applied and theoretical robotics and automation engineering, spanning autonomous robotic platforms, robotic process automation, vision systems, and intelligent control.',
    focus: ['Autonomous mobile robotics', 'Robotic process automation & machine vision', 'Intelligent mechatronic systems', 'Robot design hackathons & project expos'],
    icon: Bot,
    color: 'blue',
  },
  {
    code: 'IEEE WIE',
    name: 'IEEE Women in Engineering Affinity Group',
    description: 'Global network dedicated to promoting women engineers and scientists, inspiring girls around the world to follow their academic interests in STEM fields.',
    focus: ['Women leadership in engineering', 'STEM mentorship & outreach programs', 'Skill development and tech bootcamps', 'Networking sessions with industry leaders'],
    icon: Users,
    color: 'violet',
  },
];

export function IeeeBranchView() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="container px-4 md:px-8 mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/campus-life"
            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campus Life
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Globe className="w-4 h-4" /> IEEE Student Branch – JCMCSIIT
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Advancing Technology for <span className="text-blue-600">Humanity</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            The IEEE Student Branch at John Cox Memorial CSI Institute of Technology (JCMCSIIT) serves as a vibrant platform for budding engineers to nurture innovation, technical proficiency, professional ethics, and leadership skills.
          </p>
        </div>

        {/* Societies under Student Branch */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Societies under Student Branch</h2>
            <p className="text-slate-600 text-sm md:text-base">
              Our active student branch chapters and affinity groups provide specialized forums for students to delve deep into niche engineering disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {societies.map((soc, idx) => {
              const Icon = soc.icon;
              const colorClasses: Record<string, { badge: string; iconBg: string; border: string }> = {
                emerald: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-100 text-emerald-700', border: 'hover:border-emerald-300' },
                blue: { badge: 'bg-blue-50 text-blue-700 border-blue-200', iconBg: 'bg-blue-100 text-blue-700', border: 'hover:border-blue-300' },
                violet: { badge: 'bg-violet-50 text-violet-700 border-violet-200', iconBg: 'bg-violet-100 text-violet-700', border: 'hover:border-violet-300' },
                amber: { badge: 'bg-amber-50 text-amber-700 border-amber-200', iconBg: 'bg-amber-100 text-amber-700', border: 'hover:border-amber-300' },
              };
              const style = colorClasses[soc.color] || colorClasses.blue;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-200 ${style.border}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${style.iconBg}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${style.badge}`}>
                        {soc.code}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{soc.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{soc.description}</p>

                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Focus & Activities</p>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {soc.focus.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits & Impact Grid */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Student Branch Highlights & Opportunities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <Award className="w-6 h-6 text-blue-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Global Competitions</h4>
              <p className="text-xs text-slate-600">Access to IEEE Xtreme 24-Hour Programming Competition, regional hackathons, and project expos.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <BookOpen className="w-6 h-6 text-emerald-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">IEEE Xplore Access</h4>
              <p className="text-xs text-slate-600">Subsidized digital access to world-renowned research publications, conference proceedings, and standards.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <Sparkles className="w-6 h-6 text-violet-600 mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">Leadership & Travel Grants</h4>
              <p className="text-xs text-slate-600">Funding opportunities to attend national and international IEEE student conferences and workshops.</p>
            </div>
          </div>
        </div>

        {/* Footer Contact banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h4 className="text-xl font-bold mb-2">Connect with IEEE Student Branch</h4>
            <p className="text-slate-400 text-sm">Interested in joining IEEE or any of the society chapters? Get in touch with our branch counselor and student executive committee.</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors"
          >
            Contact Chapter Counselor
          </Link>
        </div>
      </div>
    </main>
  );
}
