import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { facultyData } from '@/data/faculty';
import { getPublicFacultyBySlug } from '@/lib/cms/faculty';
import { FacultyProfile } from '@/components/faculty/FacultyProfile';
import { FacultyNavigation } from '@/components/faculty/FacultyNavigation';

export const dynamic = 'force-dynamic';

interface FacultyPageProps {
  params: Promise<{ slug: string }>;
}

// Generate Static Params for all baseline faculty routes
export async function generateStaticParams() {
  return facultyData.map((faculty) => ({
    slug: faculty.slug,
  }));
}

// Generate dynamic SEO Metadata
export async function generateMetadata({ params }: FacultyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const faculty = await getPublicFacultyBySlug(resolvedParams.slug);
  
  if (!faculty) {
    return { title: 'Faculty Not Found | JCMCSIIT' };
  }

  const title = `${faculty.name} - ${faculty.designation} | JCMCSIIT`;
  const description = faculty.profile_data?.biography?.substring(0, 160) || 
                      `Profile of ${faculty.name}, ${faculty.designation} in ${faculty.departments?.name || 'the department'} at JCMC SIIT.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: faculty.image_url || '/Faculty/default_avatar.png',
          width: 800,
          height: 600,
          alt: faculty.name,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [faculty.image_url || '/Faculty/default_avatar.png'],
    },
  };
}

export default async function FacultyDetailPage({ params }: FacultyPageProps) {
  const resolvedParams = await params;
  const faculty = await getPublicFacultyBySlug(resolvedParams.slug);

  if (!faculty) {
    notFound();
  }

  const currentIndex = facultyData.findIndex((f) => f.slug === faculty.slug);
  const prevFaculty = currentIndex > 0 ? facultyData[currentIndex - 1] : undefined;
  const nextFaculty = currentIndex !== -1 && currentIndex < facultyData.length - 1 ? facultyData[currentIndex + 1] : undefined;

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FacultyProfile faculty={faculty} />
        <FacultyNavigation
          previousFaculty={prevFaculty ? { name: prevFaculty.name, slug: prevFaculty.slug } : undefined}
          nextFaculty={nextFaculty ? { name: nextFaculty.name, slug: nextFaculty.slug } : undefined}
          departmentSlug={faculty.departments?.slug || 'academics'}
        />
      </div>
    </div>
  );
}
