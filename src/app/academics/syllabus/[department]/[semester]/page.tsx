import { Metadata } from 'next';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import SyllabusClient from '@/components/academics/SyllabusClient';

type Props = {
  params: { department: string; semester: string };
};

function formatDepartmentSlug(slug: string) {
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
  
  const paths: any[] = [];
  data.forEach((item: any) => {
    const deptSlug = item.department.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    const semSlug = item.semester.toLowerCase(); // usually 's1-s2' or 's3-s4'
    
    // We can just use the literal string or extract the number
    paths.push({
      department: deptSlug,
      semester: `semester-${semSlug}`, // "semester-s1-s2"
    });
  });
  
  // Deduplicate
  const uniquePaths = Array.from(new Set(paths.map(p => JSON.stringify(p)))).map(p => JSON.parse(p));
  return uniquePaths;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const deptName = formatDepartmentSlug(resolvedParams.department);
  return {
    title: `${deptName} Semester ${resolvedParams.semester.toUpperCase()} Syllabus | JCMCSIIT`,
    description: `Academic resources and syllabus documents for ${deptName} Semester ${resolvedParams.semester.toUpperCase()} at JCMCSIIT.`,
  };
}

export default async function SemesterSyllabusPage({ params }: Props) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'src', 'data', 'syllabus.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  const departmentMap: Record<string, string> = {};
  data.forEach((item: any) => {
    const slug = item.department.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    departmentMap[slug] = item.department;
  });

  const actualDepartment = departmentMap[resolvedParams.department];

  // Inverse parsing of the semantic path 'semester-s1-s2' to 's1-s2'
  const actualSemester = resolvedParams.semester.replace('semester-', '');

  // Filter the data down to only this semester/department to force the UI
  const filteredData = data.filter((item: any) => 
    item.department === actualDepartment && 
    item.semester.toLowerCase() === actualSemester.toLowerCase()
  );

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 relative z-10">
        
        <div className="mb-6">
          <Link href={`/academics/syllabus/${resolvedParams.department}`} className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to {actualDepartment}
          </Link>
        </div>
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Semester <span className="text-blue-600">{resolvedParams.semester.toUpperCase()}</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Syllabus and academic resources for {actualDepartment} ({resolvedParams.semester.toUpperCase()}).
          </p>
        </div>

        <div className="w-full">
          {/* We reuse SyllabusClient but pass the filtered data so it acts as a standalone page */}
          <SyllabusClient data={filteredData} initialDepartment={actualDepartment} />
        </div>
      </div>
    </main>
  );
}
