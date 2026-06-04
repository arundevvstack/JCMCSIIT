import { Metadata } from 'next';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import SyllabusClient from '@/components/academics/SyllabusClient';

export const metadata: Metadata = {
  title: 'Curriculum & Academic Resources Center | JCMCSIIT',
  description: 'World-class academic resources, syllabus documents, and curriculum details for all departments and schemes at John Cox Memorial C.S.I Institute of Technology.',
};

async function getSyllabusData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'syllabus.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function SyllabusPage() {
  const data = await getSyllabusData();

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-6">
          <Link href="/academics" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Academics
          </Link>
        </div>
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Academic <span className="text-blue-600">Resources Center</span>.
          </h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Explore our comprehensive curriculum, download syllabus documents, and access historical academic schemes across all engineering disciplines.
          </p>
        </div>

        {/* Client Component for Search, Filter, and Grid */}
        <div className="w-full">
          <SyllabusClient data={data} />
        </div>
      </div>
    </main>
  );
}
