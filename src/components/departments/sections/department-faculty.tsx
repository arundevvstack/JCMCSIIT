import { DepartmentData } from '@/types/department';
import { Users, Mail, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { facultyData } from '@/data/faculty';

export function DepartmentFaculty({ data }: { data: DepartmentData }) {
  // Dynamically map faculty from the central faculty database by matching department_id to data.id
  // This automatically connects all faculty in the repository to the corresponding department!
  const mappedFaculty = facultyData.filter((f) => f.department_id === data.id);

  return (
    <section id="faculty" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
            <Users className="w-8 h-8 text-primary mr-3" />
            Faculty Members
          </h2>
          <p className="text-lg text-slate-600">
            Learn from experienced academicians, researchers, and industry experts dedicated to student success.
          </p>
        </div>
        
        {mappedFaculty.length === 0 && !data.hod ? (
           <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm text-center">
             <p className="text-slate-500 italic">Faculty information will be updated by the department.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* HoD Card (if explicitly defined, we can highlight them here) */}
            {data.hod && (
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center hover:shadow-md transition-shadow flex flex-col h-full border-primary/20">
                <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-sm bg-slate-200">
                  {data.hod.image ? (
                    <Image 
                      src={data.hod.image} 
                      alt={data.hod.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-3xl">
                      {data.hod.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{data.hod.name}</h3>
                  <p className="text-sm text-primary font-bold mb-4">Head of Department</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200/60 flex justify-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Mapped Faculty Cards */}
            {mappedFaculty.map((faculty) => {
              // Skip mapping the HoD again if they are already in the array to prevent duplicates.
              // Note: This relies on the name being an exact match. If they don't match exactly, both will show.
              if (data.hod && data.hod.name === faculty.name) return null;

              return (
                <div key={faculty.id} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-sm bg-slate-200">
                    {faculty.image_url ? (
                      <Image 
                        src={faculty.image_url} 
                        alt={faculty.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-3xl">
                        {faculty.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{faculty.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-2">{faculty.designation}</p>
                    {faculty.profile_data?.highestQualification && (
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                        {faculty.profile_data.highestQualification}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200/60">
                    <Link 
                      href={`/academics/faculty/${faculty.slug}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
