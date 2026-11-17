import { DepartmentData } from '@/types/department';
import { Briefcase, Building2, TrendingUp, Handshake, Calendar, CheckCircle2, Award } from 'lucide-react';
import Image from 'next/image';

export function DepartmentCareer({ data }: { data: DepartmentData }) {
  return (
    <section id="careers" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Career & Placements</h2>
            <p className="text-lg text-slate-600">Explore the wide range of career opportunities, memorandums of understanding, and strong industry partnerships.</p>
          </div>
          {!data.programme.toLowerCase().includes('diploma') && (
            <div className="flex gap-4">
              <div className="bg-primary/5 text-primary px-6 py-4 rounded-2xl border border-primary/10">
                <TrendingUp className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">95%+</div>
                <div className="text-sm font-medium">Placement Rate</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Memorandums of Understanding (MoUs) */}
        {data.mous && data.mous.length > 0 && (
          <div className="mb-16">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Handshake className="w-3.5 h-3.5" />
                Industry Collaborations
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Memorandums of Understanding (MoUs)</h3>
              <p className="text-slate-600 text-sm mt-1">
                Collaborations that strengthen industry–academia interaction and support students through practical training, skill development, industry exposure, and placement assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.mous.map((mou, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    {mou.image && (
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 bg-slate-200 border border-slate-300/60 shadow-inner">
                        <Image
                          src={mou.image}
                          alt={mou.partner}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        MoU Partner
                      </span>
                      {mou.date && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {mou.date}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{mou.partner}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{mou.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Briefcase className="w-5 h-5 text-primary mr-3" />
              Career Prospects
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.careerOpportunities && data.careerOpportunities.length > 0 ? (
                data.careerOpportunities.map((career, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 text-sm font-medium hover:border-primary/30 transition-colors">
                    {career}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 italic">Career prospects will be updated by the department.</p>
              )}
            </div>
            
            {data.higherEducation && data.higherEducation.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 text-primary mr-3" />
                  Higher Education Opportunities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.higherEducation.map((edu, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 text-sm font-medium hover:border-primary/30 transition-colors">
                      {edu}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {data.industryPartners && data.industryPartners.length > 0 ? (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Building2 className="w-5 h-5 text-primary mr-3" />
                Industry Partners
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {data.industryPartners.map((partner, idx) => (
                  <div key={idx} className="h-24 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-center p-4 text-center text-slate-700 font-semibold text-sm hover:shadow-sm transition-shadow">
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Building2 className="w-5 h-5 text-primary mr-3" />
                  Industry Partners
                </h3>
                <div className="h-40 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-8 text-center">
                  <p className="text-slate-500 italic">Industry partnerships will be updated by the department.</p>
                </div>
             </div>
          )}
        </div>

        {/* Placement Record / Details */}
        {data.placementDetails && data.placementDetails.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Placement Highlights & Recruiters
            </h3>
            {data.placementDetails.some((pd) => pd.count || (pd.highlights && pd.highlights.length > 0)) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  {data.placementDetails
                    .filter((pd) => pd.count || (pd.highlights && pd.highlights.length > 0))
                    .map((pd, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{pd.title}</h4>
                        {pd.count && <p className="text-3xl font-black text-primary mb-4">{pd.count}</p>}
                        {pd.highlights && (
                          <ul className="space-y-2 mb-4 text-sm text-slate-700">
                            {pd.highlights.map((h, hi) => (
                              <li key={hi} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
                {data.placementDetails.some((pd) => pd.image) && (
                  <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 flex flex-col items-center">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 w-full text-left">
                      Placement Overview & Infographic
                    </h4>
                    {data.placementDetails
                      .filter((pd) => pd.image)
                      .map((pd, pidx) => (
                        <div
                          key={pidx}
                          className="relative w-full aspect-[963/1600] max-h-[520px] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner"
                        >
                          <Image
                            src={pd.image!}
                            alt={pd.title || "Placement Poster"}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center">
                {data.placementDetails
                  .filter((pd) => pd.image)
                  .map((pd, pidx) => (
                    <div key={pidx} className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col items-center">
                      <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">
                        {pd.title}
                      </h4>
                      <div className="relative w-full aspect-[963/1600] max-h-[560px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                        <Image
                          src={pd.image!}
                          alt={pd.title || "Placement Poster"}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
