import { DepartmentData } from '@/types/department';
import { Briefcase, Building2, TrendingUp } from 'lucide-react';

export function DepartmentCareer({ data }: { data: DepartmentData }) {
  return (
    <section id="careers" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Career & Placements</h2>
            <p className="text-lg text-slate-600">Explore the wide range of career opportunities and our strong industry connections.</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.industryPartners.map((partner, idx) => (
                  <div key={idx} className="h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4 text-center text-slate-600 font-semibold text-sm hover:shadow-sm transition-shadow">
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
      </div>
    </section>
  );
}
