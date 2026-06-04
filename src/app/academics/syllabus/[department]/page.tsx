import { Metadata } from 'next';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import SyllabusClient from '@/components/academics/SyllabusClient';

type Props = {
  params: { department: string };
};

function formatDepartmentSlug(slug: string) {
  // Convert slug back to title case for display
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Generate static params for SEO
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'syllabus.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  
  const departments = Array.from(new Set(data.map((item: any) => item.department.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'))));
  
  return departments.map((dept) => ({
    department: dept,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const deptName = formatDepartmentSlug(resolvedParams.department);
  return {
    title: `${deptName} Syllabus & Resources | JCMCSIIT`,
    description: `Academic resources and syllabus documents for ${deptName} at John Cox Memorial C.S.I Institute of Technology.`,
  };
}

export default async function DepartmentSyllabusPage({ params }: Props) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'src', 'data', 'syllabus.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  // Map slug back to actual department name
  const departmentMap: Record<string, string> = {};
  data.forEach((item: any) => {
    const slug = item.department.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    departmentMap[slug] = item.department;
  });

  const actualDepartment = departmentMap[resolvedParams.department];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 relative z-10">
        
        <div className="mb-6">
          <Link href="/academics/syllabus" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Resources
          </Link>
        </div>
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            <span className="text-blue-600">{actualDepartment}</span> Resources
          </h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Explore the curriculum, download syllabus documents, and access academic schemes for {actualDepartment}.
          </p>
        </div>

        <div className="w-full">
          <SyllabusClient data={data} initialDepartment={actualDepartment} />
        </div>
      </div>
    </main>
  );
}
