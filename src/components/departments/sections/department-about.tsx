import { DepartmentData } from '@/types/department';
import { BookOpen, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function DepartmentAbout({ data }: { data: DepartmentData }) {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Department</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {data.fullDescription}
              </p>
            </div>
            
            {/* Vision and Mission */}
            {data.vision && data.mission ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Vision</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{data.vision}</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Mission</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{data.mission}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm mt-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Vision & Mission</h3>
                <p className="text-slate-500 italic">Content will be updated by the department.</p>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            {/* Core Areas */}
            {data.coreAreas && data.coreAreas.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-primary" />
                    Core Areas
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.coreAreas.map((area, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* HoD Message */}
            {data.hod ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-400 font-bold text-xl">
                  {data.hod.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Message from HoD</h4>
                  <p className="text-slate-700 italic mb-3">"{data.hod.message}"</p>
                  <p className="text-slate-900 font-bold">{data.hod.name}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">Message from HoD</h4>
                <p className="text-slate-500 italic">Content will be updated by the department.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
