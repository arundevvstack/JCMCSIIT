import { Metadata } from 'next';
import { ContentLayout } from '@/components/layout/content-layout';

export const metadata: Metadata = {
  title: 'Preparation Tests | JCMCSIIT',
  description: 'Preparation Tests at John Cox Memorial C.S.I Institute Of Technology',
};

export default function Page() {
  return (
    <ContentLayout title="Preparation Tests">
      <p className="text-slate-500 italic">Content under update.</p>
    </ContentLayout>
  );
}
