import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Phone, MapPin, GraduationCap, Briefcase, BookOpen, Download, Award, ChevronRight, CheckCircle2, User } from "lucide-react";
import { facultyData } from "@/data/faculty";

export function generateStaticParams() {
  return facultyData.map((faculty) => ({
    slug: faculty.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function FacultyProfilePage({ params }: PageProps) {
  const { slug } = params;

  // Fetch faculty member from static data
  const faculty = facultyData.find(f => f.slug === slug);

  if (!faculty) {
    notFound();
  }

  const profile = faculty.profile_data || {};

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-24">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/academics/faculty" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Faculty Directory
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-12">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            {/* Photo */}
            <div className="shrink-0 relative">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl overflow-hidden border-4 border-white shadow-xl relative bg-slate-100">
                {faculty.image_url ? (
                  <Image
                    src={faculty.image_url}
                    alt={faculty.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 160px, 224px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <User className="h-20 w-20 text-slate-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Header Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{faculty.name}</h1>
                <p className="text-xl font-medium text-emerald-600 mb-4">{faculty.designation}</p>
                {faculty.departments?.name && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
                    Department of {faculty.departments.name}
                  </div>
                )}
              </div>

              {/* Bio */}
              {faculty.bio && (
                <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                  {faculty.bio}
                </p>
              )}

              {/* Contact Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {faculty.email && (
                  <a href={`mailto:${faculty.email}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-sm">
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                )}
                {faculty.cv_url && (
                  <a href={faculty.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors shadow-sm">
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                )}
                {profile.googleScholar && (
                  <a href={profile.googleScholar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    Google Scholar
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                    <svg className="h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Experience */}
            {(profile.teachingExperience || profile.industryExperience || profile.professionalExperience) && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-emerald-500" />
                  Experience
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.teachingExperience && (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Teaching Experience</p>
                      <p className="text-xl font-bold text-slate-900">{profile.teachingExperience}</p>
                    </div>
                  )}
                  {profile.industryExperience && (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <p className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Industry Experience</p>
                      <p className="text-xl font-bold text-slate-900">{profile.industryExperience}</p>
                    </div>
                  )}
                  {profile.professionalExperience && (
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sm:col-span-2">
                      <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Professional Journey</p>
                      <p className="text-slate-700">{profile.professionalExperience}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Qualifications Timeline */}
            {(profile.qualificationTimeline?.length ?? 0) > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-emerald-500" />
                  Educational Qualifications
                </h3>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-slate-200 before:to-transparent">
                  {profile.qualificationTimeline!.map((item: any, i: number) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      </div>
                      
                      {/* Card */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">{item.year}</span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-900 mb-1">{item.degree}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications & Research */}
            {((profile.publications?.length ?? 0) > 0 || (profile.researchInterests?.length ?? 0) > 0) && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-emerald-500" />
                  Research & Publications
                </h3>
                
                {(profile.researchInterests?.length ?? 0) > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Research Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.researchInterests!.map((interest: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(profile.publications?.length ?? 0) > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Key Publications</h4>
                    <div className="space-y-4">
                      {profile.publications!.map((pub: any, i: number) => (
                        <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                          <h5 className="font-bold text-slate-900 mb-2">{pub.title}</h5>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              {pub.journal}
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-900">
                              {pub.year}
                            </span>
                            {pub.link && (
                              <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline inline-flex items-center">
                                Read Paper <ArrowRight className="ml-1 w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            
            {/* Contact Details */}
            <div className="bg-[#0B1F3A] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
              
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <ul className="space-y-5">
                {faculty.email && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Email Address</p>
                      <a href={`mailto:${faculty.email}`} className="font-medium hover:text-emerald-400 transition-colors break-all">
                        {faculty.email}
                      </a>
                    </div>
                  </li>
                )}
                {profile.phone && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Phone Number</p>
                      <a href={`tel:${profile.phone}`} className="font-medium hover:text-emerald-400 transition-colors">
                        {profile.phone}
                      </a>
                    </div>
                  </li>
                )}
                {profile.officeLocation && (
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Office Location</p>
                      <p className="font-medium">{profile.officeLocation}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Specialization */}
            {profile.specialization && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Specialization</h3>
                <p className="text-slate-600">{profile.specialization}</p>
              </div>
            )}

            {/* Academic Responsibilities */}
            {(profile.academicResponsibilities?.length ?? 0) > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Responsibilities</h3>
                <ul className="space-y-3">
                  {profile.academicResponsibilities!.map((resp: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-slate-600 text-sm leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements & Awards */}
            {((profile.achievements?.length ?? 0) > 0 || (profile.awards?.length ?? 0) > 0) && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Achievements
                </h3>
                <ul className="space-y-3">
                  {[...(profile.achievements || []), ...(profile.awards || [])].map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight className="h-5 w-5 text-amber-500 shrink-0" />
                      <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}
