import React from 'react';
import Image from 'next/image';
import { Faculty } from '@/types/faculty';
import { 
  Mail, Phone, MapPin, BookOpen, GraduationCap, 
  Briefcase, Award, Library, Users, Target, FileText, Globe
} from 'lucide-react';

interface FacultyProfileProps {
  faculty: Faculty;
}

export function FacultyProfile({ faculty }: FacultyProfileProps) {
  const profile = faculty.profile_data || {};
  const hasProjects = profile.academicProjects?.ugProjects?.length || profile.academicProjects?.pgProjects?.length || profile.academicProjects?.researchProjects?.length || profile.academicProjects?.btechProjects?.length || profile.academicProjects?.mtechThesis?.length || profile.academicProjects?.phdResearch?.length || profile.academicProjects?.phdTopic?.length;
  const hasPublications = (profile.publications?.journalPapers?.length || 0) > 0 || (profile.publications?.conferencePapers?.length || 0) > 0 || (profile.publications?.books?.length || 0) > 0 || (profile.publications?.bookChapters?.length || 0) > 0 || (profile.publications?.patents?.length || 0) > 0 || Array.isArray(profile.publications);
  
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="flex-shrink-0 relative w-56 h-72 md:w-80 md:h-[400px] rounded-[5px] overflow-hidden shadow-xl border-4 border-white dark:border-zinc-800">
          <Image
            src={faculty.image_url || '/Faculty/default_avatar.png'}
            alt={faculty.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow space-y-4 pt-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{faculty.name}</h1>
            <p className="text-xl text-primary font-medium mt-1">{faculty.designation}</p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">{faculty.departments?.name}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {profile.highestQualification && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-sm font-medium">
                <GraduationCap className="w-4 h-4" /> {profile.highestQualification}
              </span>
            )}
            {profile.totalExperience && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-sm font-medium">
                <Briefcase className="w-4 h-4" /> {profile.totalExperience}
              </span>
            )}
          </div>
          
          <div className="space-y-2 pt-4">
            {faculty.email && (
              <a href={`mailto:${faculty.email}`} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">
                <Mail className="w-5 h-5 text-primary" /> {faculty.email}
              </a>
            )}
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">
                <Phone className="w-5 h-5 text-primary" /> {profile.phone}
              </a>
            )}
            {profile.officeLocation && (
              <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-5 h-5 text-primary" /> {profile.officeLocation}
              </span>
            )}
          </div>

          {/* Socials */}
          <div className="flex gap-4 pt-4">
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-sm font-semibold text-zinc-400 hover:text-[#0A66C2] transition-colors">
                LinkedIn
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-primary transition-colors">
                <Globe className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Summary */}
          {(profile.biography || profile.careerObjective) && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 border-b pb-2"><Target className="w-6 h-6 text-primary" /> Professional Summary</h2>
              {profile.careerObjective && <p className="text-zinc-700 dark:text-zinc-300 italic mb-4">"{profile.careerObjective}"</p>}
              {profile.biography && <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">{profile.biography}</div>}
            </section>
          )}

          {/* Academic Qualifications */}
          {profile.academicQualifications && profile.academicQualifications.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2"><GraduationCap className="w-6 h-6 text-primary" /> Academic Qualifications</h2>
              <div className="space-y-4">
                {profile.academicQualifications.map((qual, idx) => (
                  <div key={idx} className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{qual.degree}</h3>
                        <p className="text-primary font-medium">{qual.institution}</p>
                        {qual.university && <p className="text-sm text-zinc-500">{qual.university}</p>}
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">{qual.year}</span>
                        {qual.grade && <p className="text-sm text-zinc-500 mt-1">{qual.grade}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {(profile.teachingExperience?.length > 0 || profile.industryExperience?.length > 0) && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2"><Briefcase className="w-6 h-6 text-primary" /> Experience</h2>
              
              {Array.isArray(profile.teachingExperience) && profile.teachingExperience.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Teaching Experience</h3>
                  <div className="space-y-4 border-l-2 border-primary/20 ml-3 pl-5">
                    {profile.teachingExperience.map((exp: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[27px] top-1.5 ring-4 ring-white dark:ring-zinc-950" />
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{exp.designation}</h4>
                        <p className="text-primary">{exp.institution}</p>
                        <p className="text-sm text-zinc-500">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {Array.isArray(profile.industryExperience) && profile.industryExperience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-zinc-700 dark:text-zinc-300">Industry Experience</h3>
                  <div className="space-y-4 border-l-2 border-primary/20 ml-3 pl-5">
                    {profile.industryExperience.map((exp: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[27px] top-1.5 ring-4 ring-white dark:ring-zinc-950" />
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{exp.role || exp.designation}</h4>
                        <p className="text-primary">{exp.company}</p>
                        <p className="text-sm text-zinc-500">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Publications */}
          {hasPublications && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2"><FileText className="w-6 h-6 text-primary" /> Publications</h2>
              
              {profile.publications?.journalPapers && profile.publications.journalPapers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Journal Papers</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.publications.journalPapers.map((pub: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-medium text-zinc-900 dark:text-zinc-200">{pub.title}</span>. <i className="text-primary">{pub.journal}</i>, {pub.year}.
                        {pub.link && <a href={pub.link} target="_blank" rel="noreferrer" className="ml-2 text-blue-500 hover:underline text-sm">[Link]</a>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.publications?.conferencePapers && profile.publications.conferencePapers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Conference Papers</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.publications.conferencePapers.map((pub: any, idx: number) => (
                      <li key={idx}>
                        <span className="font-medium text-zinc-900 dark:text-zinc-200">{pub.title}</span>. In <i className="text-primary">{pub.conference}</i>, {pub.year}.
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.publications?.books && profile.publications.books.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Books</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.publications.books.map((pub: string, idx: number) => (
                      <li key={idx}>{pub}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.publications?.bookChapters && profile.publications.bookChapters.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Book Chapters</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.publications.bookChapters.map((pub: string, idx: number) => (
                      <li key={idx}>{pub}</li>
                    ))}
                  </ul>
                </div>
              )}

              {profile.publications?.patents && profile.publications.patents.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Patents</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.publications.patents.map((pub: string, idx: number) => (
                      <li key={idx}>{pub}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.publications) && profile.publications.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                  {profile.publications.map((pub: any, idx: number) => (
                    <li key={idx}>{typeof pub === 'string' ? pub : pub.title}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Academic Projects */}
          {hasProjects && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2"><Library className="w-6 h-6 text-primary" /> Academic Projects</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {profile.academicProjects?.ugProjects && profile.academicProjects.ugProjects.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold mb-2">UG Projects</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {profile.academicProjects.ugProjects.map((p: any, idx: number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {profile.academicProjects?.btechProjects && profile.academicProjects.btechProjects.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold mb-2">B.Tech Projects</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {profile.academicProjects.btechProjects.map((p: any, idx: number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {profile.academicProjects?.pgProjects && profile.academicProjects.pgProjects.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold mb-2">PG Projects</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {profile.academicProjects.pgProjects.map((p: any, idx: number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {profile.academicProjects?.mtechThesis && profile.academicProjects.mtechThesis.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold mb-2">M.Tech Thesis</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {profile.academicProjects.mtechThesis.map((p: any, idx: number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {profile.academicProjects?.phdResearch && profile.academicProjects.phdResearch.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold mb-2">PhD Research</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {profile.academicProjects.phdResearch.map((p: any, idx: number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {profile.academicProjects?.phdTopic && profile.academicProjects.phdTopic.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold mb-2">PhD Topic</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {profile.academicProjects.phdTopic.map((p: any, idx: number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {profile.academicProjects?.researchProjects && profile.academicProjects.researchProjects.length > 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold mb-2">Research Projects</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {profile.academicProjects.researchProjects.map((p: any, idx: number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* FDPs, Workshops, Seminars, Certifications */}
          {((profile.fdps?.length || 0) > 0 || (profile.workshops?.length || 0) > 0 || (profile.seminars?.length || 0) > 0 || (profile.trainingProgrammes?.length || 0) > 0 || (profile.certifications?.length || 0) > 0 || (profile.conferences?.length || 0) > 0 || (profile.moocs?.length || 0) > 0 || (profile.nptel?.length || 0) > 0) && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b pb-2"><Users className="w-6 h-6 text-primary" /> Professional Development</h2>
              
              {Array.isArray(profile.fdps) && profile.fdps.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Faculty Development Programmes (FDPs)</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.fdps.map((fdp: any, idx: number) => (
                      <li key={idx}>{typeof fdp === 'string' ? fdp : `${fdp.title} (${fdp.year})`}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.trainingProgrammes) && profile.trainingProgrammes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Training Programmes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.trainingProgrammes.map((tp: any, idx: number) => <li key={idx}>{tp}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.workshops) && profile.workshops.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Workshops</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.workshops.map((ws: any, idx: number) => <li key={idx}>{ws}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.seminars) && profile.seminars.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Seminars</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.seminars.map((sm: any, idx: number) => <li key={idx}>{sm}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.conferences) && profile.conferences.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Conferences</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.conferences.map((c: any, idx: number) => <li key={idx}>{c}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.certifications) && profile.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Certifications</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.certifications.map((cert: any, idx: number) => <li key={idx}>{cert}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.moocs) && profile.moocs.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">MOOCs</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.moocs.map((mooc: any, idx: number) => <li key={idx}>{mooc}</li>)}
                  </ul>
                </div>
              )}

              {Array.isArray(profile.nptel) && profile.nptel.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">NPTEL Courses</h3>
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {profile.nptel.map((course: any, idx: number) => <li key={idx}>{course}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column (Sidebar Info) */}
        <div className="space-y-8">
          
          {/* Areas of Expertise */}
          {profile.areasOfExpertise && profile.areasOfExpertise.length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.areasOfExpertise.map((area, idx) => (
                  <span key={idx} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Areas of Interest */}
          {profile.areasOfInterest && profile.areasOfInterest.length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Areas of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {profile.areasOfInterest.map((area, idx) => (
                  <span key={idx} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Research Interests */}
          {profile.researchInterests && profile.researchInterests.length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.researchInterests.map((area, idx) => (
                  <span key={idx} className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subjects Handled */}
          {profile.subjectsHandled && profile.subjectsHandled.length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Subjects Handled</h3>
              <div className="flex flex-wrap gap-2">
                {profile.subjectsHandled.map((sub, idx) => (
                  <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {profile.technicalSkills && Object.keys(profile.technicalSkills).length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4">Technical Skills</h3>
              <div className="space-y-4 text-sm">
                {profile.technicalSkills.languages && (
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Languages: </span>
                    <span className="text-zinc-600 dark:text-zinc-400">{profile.technicalSkills.languages.join(', ')}</span>
                  </div>
                )}
                {profile.technicalSkills.software && (
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Software: </span>
                    <span className="text-zinc-600 dark:text-zinc-400">{profile.technicalSkills.software.join(', ')}</span>
                  </div>
                )}
                {profile.technicalSkills.tools && (
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">Tools: </span>
                    <span className="text-zinc-600 dark:text-zinc-400">{profile.technicalSkills.tools.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Memberships */}
          {profile.professionalMemberships && profile.professionalMemberships.length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Memberships</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                {profile.professionalMemberships.map((mem, idx) => (
                  <li key={idx}>{mem}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Admin Responsibilities */}
          {profile.administrativeResponsibilities && Object.keys(profile.administrativeResponsibilities).length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4">Administrative Roles</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                {profile.administrativeResponsibilities.college?.map((role, idx) => <li key={`col-${idx}`}>{role}</li>)}
                {profile.administrativeResponsibilities.department?.map((role, idx) => <li key={`dep-${idx}`}>{role}</li>)}
                {profile.administrativeResponsibilities.committees?.map((role, idx) => <li key={`com-${idx}`}>{role}</li>)}
                {profile.administrativeResponsibilities.roles?.map((role, idx) => <li key={`role-${idx}`}>{role}</li>)}
                {profile.administrativeResponsibilities.coordinatorRoles?.map((role, idx) => <li key={`coord-${idx}`}>{role} (Coordinator)</li>)}
                {profile.administrativeResponsibilities.staffAdvisorRoles?.map((role, idx) => <li key={`adv-${idx}`}>{role} (Staff Advisor)</li>)}
                {profile.administrativeResponsibilities.labInchargeResponsibilities?.map((role, idx) => <li key={`lab-${idx}`}>{role} (Lab In-charge)</li>)}
                {profile.administrativeResponsibilities.placementResponsibilities?.map((role, idx) => <li key={`place-${idx}`}>{role} (Placement)</li>)}
                {profile.administrativeResponsibilities.examCell?.map((role, idx) => <li key={`exam-${idx}`}>{role} (Exam Cell)</li>)}
                {profile.administrativeResponsibilities.nba?.map((role, idx) => <li key={`nba-${idx}`}>{role} (NBA)</li>)}
                {profile.administrativeResponsibilities.naac?.map((role, idx) => <li key={`naac-${idx}`}>{role} (NAAC)</li>)}
                {profile.administrativeResponsibilities.iqac?.map((role, idx) => <li key={`iqac-${idx}`}>{role} (IQAC)</li>)}
                {profile.administrativeResponsibilities.iedc?.map((role, idx) => <li key={`iedc-${idx}`}>{role} (IEDC)</li>)}
                {profile.administrativeResponsibilities.innovationCell?.map((role, idx) => <li key={`innov-${idx}`}>{role} (Innovation Cell)</li>)}
                {profile.administrativeResponsibilities.kdisc?.map((role, idx) => <li key={`kdisc-${idx}`}>{role} (KDISC)</li>)}
                {profile.administrativeResponsibilities.nss?.map((role, idx) => <li key={`nss-${idx}`}>{role} (NSS)</li>)}
              </ul>
            </div>
          )}

          {/* Additional Achievements / Misc */}
          {((profile.rankHolders?.length || 0) > 0 || (profile.paperPresentations?.length || 0) > 0 || (profile.consultancy?.length || 0) > 0 || (profile.extensionActivities?.length || 0) > 0 || (profile.awards?.length || 0) > 0 || (profile.achievements?.length || 0) > 0 || (profile.studentGuidance?.ugProjects?.length || 0) > 0) && (
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4">Other Activities & Achievements</h3>
              
              {profile.rankHolders && profile.rankHolders.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Rank Holders / Mentorship</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.rankHolders.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              
              {profile.paperPresentations && profile.paperPresentations.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Paper Presentations</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.paperPresentations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              
              {profile.consultancy && profile.consultancy.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Consultancy</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.consultancy.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              
              {profile.extensionActivities && profile.extensionActivities.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Extension Activities</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.extensionActivities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {profile.awards && profile.awards.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Awards</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.awards.map((r: any, i: number) => <li key={i}>{typeof r === 'string' ? r : r.title}</li>)}
                  </ul>
                </div>
              )}

              {profile.achievements && profile.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Achievements</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.achievements.map((r: any, i: number) => <li key={i}>{typeof r === 'string' ? r : r.title}</li>)}
                  </ul>
                </div>
              )}

              {profile.studentGuidance && (
                <div className="mb-2">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">Student Mentoring & Guidance</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    {profile.studentGuidance.ugProjects?.map((r, i) => <li key={`ug-${i}`}>UG Project: {r}</li>)}
                    {profile.studentGuidance.pgProjects?.map((r, i) => <li key={`pg-${i}`}>PG Project: {r}</li>)}
                    {profile.studentGuidance.researchGuidance?.map((r, i) => <li key={`res-${i}`}>Research: {r}</li>)}
                    {profile.studentGuidance.mentoring?.map((r, i) => <li key={`ment-${i}`}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
