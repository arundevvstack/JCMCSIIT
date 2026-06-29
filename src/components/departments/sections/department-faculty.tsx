import { DepartmentData } from '@/types/department';
import { Users, Mail, Globe } from 'lucide-react';

export function DepartmentFaculty({ data }: { data: DepartmentData }) {
  // If we had faculty data, we would map over it. For now, we show a placeholder or the HoD again.
  return (
    <section id="faculty" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
            <Users className="w-8 h-8 text-primary mr-3" />
            Faculty Members
          </h2>
          <p className="text-lg text-slate-600">Learn from experienced academicians, researchers, and industry experts dedicated to student success.</p>
        </div>
        
        {!data.faculty || data.faculty.length === 0 ? (
           <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm text-center">
             <p className="text-slate-500 italic">Faculty information will be updated by the department.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder Faculty Card */}
            {data.hod && (
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-slate-400 font-bold text-2xl">
                  {data.hod.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{data.hod.name}</h3>
                <p className="text-sm text-primary font-medium mb-4">Head of Department</p>
                <div className="flex justify-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors">
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* We would map over data.faculty here */}
            {data.faculty.map((_, i) => (
               <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center hover:shadow-md transition-shadow">
               <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4 flex items-center justify-center text-slate-400 font-bold text-2xl">
                 F
               </div>
               <h3 className="text-lg font-bold text-slate-900">Faculty Member</h3>
               <p className="text-sm text-slate-500 font-medium mb-4">Assistant Professor</p>
               <div className="flex justify-center gap-3">
                 <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors">
                   <Mail className="w-4 h-4" />
                 </button>
                 <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors">
                   <Globe className="w-4 h-4" />
                 </button>
               </div>
             </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
