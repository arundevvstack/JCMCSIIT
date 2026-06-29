import { Metadata } from 'next';
import { DepartmentView } from '@/components/departments/department-view';
import { departmentsData } from '@/data/departments';
import { notFound } from 'next/navigation';

const departmentSlug = 'aiml';

export const metadata: Metadata = {
  title: departmentsData[departmentSlug]?.seo.metaTitle || 'Department | JCMCSIIT',
  description: departmentsData[departmentSlug]?.seo.metaDescription || '',
};

export default function Page() {
  const data = departmentsData[departmentSlug];
  if (!data) return notFound();

  return <DepartmentView data={data} />;
}
