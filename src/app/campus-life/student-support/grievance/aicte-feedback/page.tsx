import { Metadata } from 'next';
import { ContentLayout } from '@/components/layout/content-layout';

export const metadata: Metadata = {
  title: 'Aicte Feedback | JCMCSIIT',
  description: 'Aicte Feedback at John Cox Memorial C.S.I Institute Of Technology',
};

export default function Page() {
  return (
    <ContentLayout
      title="AICTE Online Feedback System"
      routePath="/campus-life/student-support/grievance/aicte-feedback"
    >
      <p className="text-slate-500 italic">Content under update.</p>
    </ContentLayout>
  );
}
