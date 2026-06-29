import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartmentView } from "@/components/departments/department-view";
import { departmentsData } from "@/data/departments";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dept = departmentsData[resolvedParams.slug];
  
  if (!dept) {
    return { title: 'Department Not Found | JCMCSIIT' };
  }
  
  return {
    title: dept.seo.metaTitle,
    description: dept.seo.metaDescription,
  };
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = departmentsData[resolvedParams.slug];
  
  if (!data) return notFound();

  return <DepartmentView data={data} />;
}
