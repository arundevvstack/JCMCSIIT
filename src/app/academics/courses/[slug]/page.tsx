import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { coursesData } from '@/data/courses';
import { ArrowRight, CheckCircle2, Target, BookOpen, Building2 } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const course = coursesData[resolvedParams.slug];
  if (!course) return { title: 'Course Not Found' };
  
  return {
    title: `${course.name} | JCMC SIIT`,
    description: `Information about the ${course.name} program at JCMC SIIT`,
  };
}

// Generate static params for all the courses we have data for
export function generateStaticParams() {
  return Object.keys(coursesData).map((slug) => ({
    slug: slug,
  }));
}

export default async function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const course = coursesData[resolvedParams.slug];
  
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
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900 m-0">Vision</h2>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">{course.vision}</p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900 m-0">Mission</h2>
              </div>
              <ul className="space-y-4">
                {course.mission.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed text-lg">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900 m-0">Program Educational Objectives</h2>
              </div>
              <ul className="space-y-4">
                {course.peos.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed text-lg">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="mt-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {course.psos && course.psos.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Program Specific Outcomes</h2>
                <ul className="space-y-4">
                  {course.psos.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed text-lg">
                      <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Explore More</h3>
              <div className="space-y-4">
                <Link href={`/departments/${course.id}`} className="group flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="font-medium">Department Details</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/admissions/application" className="group flex items-center justify-between p-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors">
                  <span className="font-medium">Apply Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Facilities Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900 m-0">Key Facilities</h3>
              </div>
              <ul className="space-y-3">
                {course.facilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
