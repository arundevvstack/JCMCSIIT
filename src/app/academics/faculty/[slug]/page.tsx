import { redirect } from 'next/navigation';
import { facultyData } from '@/data/faculty';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return facultyData.map((faculty) => ({
    slug: faculty.slug,
  }));
}

export default async function OldFacultyProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  redirect(`/faculty/${resolvedParams.slug}`);
}
