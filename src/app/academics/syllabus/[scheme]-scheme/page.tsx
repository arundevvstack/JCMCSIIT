import { Metadata } from 'next';
import { ArrowLeft, Archive } from 'lucide-react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import SyllabusClient from '@/components/academics/SyllabusClient';

type Props = {
  params: { scheme: string };
};

// Generate static params for SEO
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'syllabus.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  
  // schemes look like "2019 Scheme"
  const schemes = Array.from(new Set(data.map((item: any) => item.scheme.split(' ')[0])));
  
  return schemes.map((scheme) => ({
    scheme: scheme,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `${resolvedParams.scheme} Scheme Syllabus | JCMCSIIT`,
    description: `Archived academic resources and syllabus documents for the ${resolvedParams.scheme} scheme at John Cox Memorial C.S.I Institute of Technology.`,
  };
}

export default async function SchemeSyllabusPage({ params }: Props) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'src', 'data', 'syllabus.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);

  const targetScheme = `${resolvedParams.scheme} Scheme`;
  
  const filteredData = data.filter((item: any) => item.scheme === targetScheme);

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
              <Archive className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            <span className="text-blue-600">{resolvedParams.scheme}</span> Scheme Archive
          </h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Browse the historical syllabus documents and academic resources for the {resolvedParams.scheme} curriculum scheme.
          </p>
        </div>

        <div className="w-full">
          <SyllabusClient data={filteredData} />
        </div>
      </div>
    </main>
  );
}
