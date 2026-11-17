import { DepartmentData } from '@/types/department';
import { Users, Mail, Wrench, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { facultyData } from '@/data/faculty';

export function DepartmentFaculty({ data }: { data: DepartmentData }) {
  // Dynamically map faculty from the central faculty database by matching department_id to data.id
  // Also account for common abbreviations like 'ce' and 'civil'
  const mappedFaculty = facultyData.filter((f) =>
    f.department_id === data.id ||
    (data.id === 'civil' && f.department_id === 'ce') ||
    (data.id === 'ce' && f.department_id === 'civil')
  );

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {/* HoD Card */}
            {data.hod && (
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center hover:shadow-md transition-shadow flex flex-col h-full border-primary/20">
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-sm bg-slate-200">
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
                  <a
                    href={`mailto:${data.contactDetails.email}`}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
            
            {/* Mapped Faculty Cards */}
            {mappedFaculty.map((faculty) => {
              if (data.hod && data.hod.name.toLowerCase() === faculty.name.toLowerCase()) return null;

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

        {/* Technical & Laboratory Staff */}
        {data.technicalStaff && data.technicalStaff.length > 0 && (
          <div className="mb-16">
            <div className="max-w-3xl mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Technical & Laboratory Staff
              </h3>
              <p className="text-slate-600 text-sm">Skilled technical and laboratory instructors supporting academic practicals and engineering research.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.technicalStaff.map((staff, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 text-center hover:shadow-md transition-shadow flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-white shadow-sm bg-slate-200">
                    {staff.image ? (
                      <Image
                        src={staff.image}
                        alt={staff.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                        {staff.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{staff.name}</h4>
                  <p className="text-xs font-semibold text-primary mb-2">{staff.designation}</p>
                  {staff.qualification && (
                    <p className="text-xs text-slate-500">{staff.qualification}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic Toppers */}
        {data.toppers && data.toppers.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Department Academic Toppers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.toppers.map((topper, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full mb-3 inline-block">
                    {topper.rank || 'Merit Rank'}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{topper.name}</h4>
                  {topper.semester && <p className="text-xs text-slate-600 mb-1">{topper.semester}</p>}
                  {topper.score && <p className="text-sm font-black text-primary">{topper.score}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
