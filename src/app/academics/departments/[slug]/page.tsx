import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DepartmentView } from "@/components/departments/department-view";
import { getPublicDepartmentBySlug } from "@/lib/cms/departments";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const dept = await getPublicDepartmentBySlug(resolvedParams.slug);
  
  if (!dept) {
    return { title: 'Department Not Found | JCMCSIIT' };
  }
  
  return {
    title: dept.seo?.metaTitle || `${dept.name} | JCMCSIIT`,
    description: dept.seo?.metaDescription || dept.shortDescription,
  };
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getPublicDepartmentBySlug(resolvedParams.slug);
  
  if (!data) return notFound();

  return <DepartmentView data={data} />;
}
