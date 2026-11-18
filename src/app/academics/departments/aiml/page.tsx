import { Metadata } from 'next';
import { DepartmentView } from '@/components/departments/department-view';
import { getPublicDepartmentBySlug } from '@/lib/cms/departments';
import { departmentsData } from '@/data/departments';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

const departmentSlug = 'aiml';

export async function generateMetadata(): Promise<Metadata> {
  const dept = await getPublicDepartmentBySlug(departmentSlug);
  return {
    title: dept?.seo?.metaTitle || departmentsData[departmentSlug]?.seo.metaTitle || 'Department | JCMCSIIT',
    description: dept?.seo?.metaDescription || departmentsData[departmentSlug]?.seo.metaDescription || '',
  };
}

export default async function Page() {
  const data = (await getPublicDepartmentBySlug(departmentSlug)) || departmentsData[departmentSlug];
  if (!data) return notFound();

  return <DepartmentView data={data} />;
}
