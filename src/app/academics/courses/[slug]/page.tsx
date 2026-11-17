import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicCourseBySlug } from '@/lib/cms/courses';
import { ArrowRight, CheckCircle2, Target, BookOpen, Building2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await getPublicCourseBySlug(resolvedParams.slug);
  if (!course) return { title: 'Course Not Found | JCMCSIIT' };
  
  return {
    title: `${course.name} | JCMC SIIT`,
    description: course.overview ? course.overview.substring(0, 160) : `Information about the ${course.name} program at JCMC SIIT`,
  };
}

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const course = await getPublicCourseBySlug(resolvedParams.slug);
  
  if (!course) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 layout-grid min-h-[60vh]">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm mb-4">
            {course.degree} Program
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{course.name}</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {course.overview}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Vision & Mission if available */}
            {(course.vision || (course.mission && course.mission.length > 0)) && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                {course.vision && (
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" /> Department Vision
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{course.vision}</p>
                  </div>
                )}
                {course.mission && course.mission.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Mission
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
                      {course.mission.map((m: string, i: number) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* PEOs / Objectives */}
            {course.peos && course.peos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Program Educational Objectives (PEOs)</h2>
                <div className="space-y-3">
                  {course.peos.map((peo: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-slate-200">
                      <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{peo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities / Labs */}
            {course.facilities && course.facilities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Major Laboratories & Infrastructure</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.facilities.map((fac: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-center bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium">
                      <Building2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Highlights */}
            {course.curriculumHighlights && course.curriculumHighlights.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Curriculum Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.curriculumHighlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-center bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium">
                      <BookOpen className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Prospects */}
            {course.careerProspects && course.careerProspects.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Career Prospects</h2>
                <div className="flex flex-wrap gap-2">
                  {course.careerProspects.map((cp: string, idx: number) => (
                    <span key={idx} className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-medium border border-emerald-100">
                      {cp}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6 sticky top-28">
              <h3 className="font-bold text-slate-900 text-lg border-b border-slate-200 pb-3">Program Quick Facts</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold">Duration</span>
                  <span className="font-bold text-slate-800 text-base">{course.duration}</span>
                </div>
                
                <div>
                  <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold">Annual Intake</span>
                  <span className="font-bold text-slate-800 text-base">{course.intake} Seats</span>
                </div>
                
                <div>
                  <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold">Eligibility</span>
                  <span className="text-slate-700 leading-relaxed block mt-1">{course.eligibility}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <Link 
                  href="/admissions/application-form" 
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm"
                >
                  Apply for Admission <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/contact" 
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-white transition"
                >
                  Contact Department
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
