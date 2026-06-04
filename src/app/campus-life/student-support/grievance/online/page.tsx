import { Metadata } from 'next';
import { ContentLayout } from '@/components/layout/content-layout';

export const metadata: Metadata = {
  title: 'John Cox Memorial C.S.I Institute Of Technology | JCMCSIIT',
  description: 'John Cox Memorial C.S.I Institute Of Technology at John Cox Memorial C.S.I Institute Of Technology',
};

export default function Page() {
  return (
    <ContentLayout title="John Cox Memorial C.S.I Institute Of Technology">
      <ul className="list-disc pl-6 mb-4 space-y-2">
<li>  <strong>Admission Enquiry</strong></li>
<li>  Director : 9496981555, Principal : 9496981666 , Bursar : 9496981777</li>
<li>  Call us +91 0471 2550474, 2446949</li>
</ul>
<p className="mb-4">Grievance Redressal System</p>
<p className="mb-4">--------------------------</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  GRC</li>
</ul>
<p className="mb-4"></p>
<p className="mb-4">Loading…</p>
<p className="mb-4"></p>
<p className="mb-4"></p>
    </ContentLayout>
  );
}
