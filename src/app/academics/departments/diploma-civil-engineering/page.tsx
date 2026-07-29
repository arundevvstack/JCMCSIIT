import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Target, ShieldCheck, Briefcase, Building2, Users, Mail, Globe, CheckCircle2, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';
import { facultyData } from '@/data/faculty';
import { departmentsData } from '@/data/departments';

export const metadata: Metadata = {
  title: 'Diploma in Civil Engineering | JCMCSIIT',
  description: 'AICTE-approved Diploma in Civil Engineering at JCMCSIIT. Focus on practical skills and career readiness.',
};



export default function DiplomaCivilPage() {
  const data = departmentsData["diploma-civil-engineering"];
  const ceFaculty = facultyData.filter((f) => f.department_id === 'ce');

  return (
    <div className="relative bg-white min-h-screen pt-20">
      {/* Department Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 -z-10"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
                {data.programme}
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200">
                Duration: {data.duration}
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200">
                Eligibility: {data.eligibility}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              {data.name}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
              {data.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Vision</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    To create Civil Engineers of professional competence and global perspectives and to make them ethically strong and capable of finding sustainable solutions to the needs of the society and nation.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Mission</h3>
                  <ul className="text-slate-600 text-sm leading-relaxed space-y-3 list-disc pl-4">
                    <li>To impart quality education and technical skills to students to transform them as Civil Engineers capable of serving the society globally.</li>
                    <li>To create competent professionals capable of meeting professional challenges upholding ethical values.</li>
                    <li>To prepare civil engineering students to meet societal needs and global standards in infrastructure development with commitment towards sustainable environment.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Message from HOD */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Message from the HOD</h3>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Head of Department</h4>
                    <p className="text-slate-500 italic mt-2">Official HOD message will be inserted later.</p>
                  </div>
                </div>
              </div>
              
              {/* Department Images */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
                 <h3 className="text-2xl font-bold text-slate-900 mb-6">Department Gallery</h3>
                 <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium italic">Awaiting Official Department Photograph.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers & Partnerships Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Placement Record */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <TrendingUp className="w-8 h-8 text-primary mr-3" />
                Placement Record
              </h2>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-lg text-slate-500 italic">
                    Official placement statistics and recruiter details will be updated by the Department.
                  </p>
                </div>
              </div>
            </div>

            {/* Industry Partners & MoUs */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <Building2 className="w-8 h-8 text-primary mr-3" />
                Industry Partners & MoUs
              </h2>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <Globe className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-lg text-slate-500 italic">
                    Official Industry Partners and MoUs will be updated by the Department.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-16 md:py-24 bg-white">
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

          {ceFaculty.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm text-center">
              <p className="text-slate-500 italic">Faculty information will be updated by the department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ceFaculty.map((faculty) => (
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
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
