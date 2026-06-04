import { Metadata } from 'next';
import { ContentLayout } from '@/components/layout/content-layout';

export const metadata: Metadata = {
  title: 'College Uniform | JCMCSIIT',
  description: 'College Uniform at John Cox Memorial C.S.I Institute Of Technology',
};

export default function Page() {
  return (
    <ContentLayout title="College Uniform">
      <p className="text-slate-500 italic">Content under update.</p>
    </ContentLayout>
  );
}
