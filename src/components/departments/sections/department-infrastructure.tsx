import { DepartmentData } from '@/types/department';
import { FlaskConical, Beaker, Network, CheckCircle2, XCircle, ShieldAlert, Microscope } from 'lucide-react';
import Image from 'next/image';

export function DepartmentInfrastructure({ data }: { data: DepartmentData }) {
  return (
    <section id="infrastructure" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Infrastructure & Laboratories</h2>
          <p className="text-lg text-slate-600">State-of-the-art facilities designed to provide hands-on experience and foster research capabilities.</p>
        </div>
        
        {/* Basic Lab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data.labDetails && data.labDetails.length > 0 ? (
            data.labDetails.map((lab, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {idx % 3 === 0 ? <FlaskConical className="w-6 h-6" /> : idx % 3 === 1 ? <Beaker className="w-6 h-6" /> : <Network className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{lab}</h3>
                <p className="text-slate-500 text-sm">Equipped with modern instruments and software for practical training and research projects.</p>
              </div>
            ))
          ) : data.campusFacilities && data.campusFacilities.length > 0 ? (
            data.campusFacilities.map((facility, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Network className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{facility}</h3>
                <p className="text-slate-500 text-sm">Common institutional facility available to all students.</p>
              </div>
            ))
          ) : (
             <div className="col-span-full p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
                <p className="text-slate-500 italic">Facilities information will be updated by the department.</p>
             </div>
          )}
        </div>

        {/* Detailed Lab Facilities (e.g. EEE & Civil) */}
        {data.labFacilitiesDetailed && data.labFacilitiesDetailed.length > 0 && (
          <div className="space-y-8 mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Microscope className="w-6 h-6 text-primary" />
              Specialized Laboratory Facilities
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data.labFacilitiesDetailed.map((facility, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    {facility.image && (
                      <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-200">
                        <Image
                          src={facility.image}
                          alt={facility.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{facility.name}</h4>
                    {facility.description && (
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{facility.description}</p>
                    )}
                    {facility.equipment && facility.equipment.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Major Equipment</p>
                        <div className="flex flex-wrap gap-2">
                          {facility.equipment.map((eq, ei) => (
                            <span key={ei} className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {facility.experiments && facility.experiments.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Experiments</p>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {facility.experiments.map((exp, exi) => (
                            <li key={exi} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                              <span>{exp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Laboratory Guidelines: Do's and Don'ts */}
        {data.labRules && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Laboratory Guidelines</h3>
                <p className="text-sm text-slate-500">General code of conduct and safety regulations for students inside laboratories.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Do's */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Laboratory Do&apos;s
                </h4>
                <ul className="space-y-3">
                  {data.labRules.dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-emerald-950">
                      <span className="w-5 h-5 rounded-full bg-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Laboratory Don&apos;ts
                </h4>
                <ul className="space-y-3">
                  {data.labRules.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-rose-950">
                      <span className="w-5 h-5 rounded-full bg-rose-200/80 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
