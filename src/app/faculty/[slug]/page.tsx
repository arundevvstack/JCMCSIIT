import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { facultyData } from '@/data/faculty';
import { FacultyProfile } from '@/components/faculty/FacultyProfile';
import { FacultyNavigation } from '@/components/faculty/FacultyNavigation';

interface FacultyPageProps {
  params: Promise<{ slug: string }>;
}

// Generate Static Params for all faculty routes
export async function generateStaticParams() {
  return facultyData.map((faculty) => ({
    slug: faculty.slug,
  }));
}

// Generate dynamic SEO Metadata
export async function generateMetadata({ params }: FacultyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const faculty = facultyData.find((f) => f.slug === resolvedParams.slug);
  
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

export default async function FacultyPage({ params }: FacultyPageProps) {
  const resolvedParams = await params;
  const currentIndex = facultyData.findIndex((f) => f.slug === resolvedParams.slug);
  
  if (currentIndex === -1) {
    notFound();
  }

  const faculty = facultyData[currentIndex];
  
  // Get prev/next faculty within the same department if possible, or global
  const deptFaculty = facultyData.filter(f => f.department_id === faculty.department_id);
  const deptIndex = deptFaculty.findIndex(f => f.slug === faculty.slug);
  
  const previousFaculty = deptIndex > 0 ? deptFaculty[deptIndex - 1] : undefined;
  const nextFaculty = deptIndex < deptFaculty.length - 1 ? deptFaculty[deptIndex + 1] : undefined;

  // JSON-LD Person Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: faculty.name,
    jobTitle: faculty.designation,
    worksFor: {
      '@type': 'Organization',
      name: 'John Cox Memorial CSI Institute of Technology (JCMCSIIT)',
    },
    image: faculty.image_url,
    url: `https://jcmcsiit.ac.in/faculty/${faculty.slug}`,
    email: faculty.email,
    telephone: faculty.profile_data?.phone,
    description: faculty.profile_data?.biography,
  };

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jcmcsiit.ac.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Academics',
        item: 'https://jcmcsiit.ac.in/academics',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: faculty.departments?.name || 'Departments',
        item: `https://jcmcsiit.ac.in/academics/departments/${faculty.department_id}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: faculty.name,
        item: `https://jcmcsiit.ac.in/faculty/${faculty.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24">
        {/* Breadcrumbs visually */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><span>/</span></li>
              <li><a href={`/academics/departments/${faculty.department_id}`} className="hover:text-primary transition-colors">{faculty.departments?.name || 'Department'}</a></li>
              <li><span>/</span></li>
              <li className="text-zinc-900 dark:text-zinc-100">{faculty.name}</li>
            </ol>
          </nav>
        </div>

        <FacultyProfile faculty={faculty} />
        
        <FacultyNavigation 
          previousFaculty={previousFaculty ? { name: previousFaculty.name, slug: previousFaculty.slug } : undefined}
          nextFaculty={nextFaculty ? { name: nextFaculty.name, slug: nextFaculty.slug } : undefined}
          departmentSlug={faculty.department_id}
        />
      </main>
    </>
  );
}
