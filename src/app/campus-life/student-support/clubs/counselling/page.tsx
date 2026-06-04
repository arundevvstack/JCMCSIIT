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
<p className="mb-4">Counseling centre</p>
<p className="mb-4">-----------------</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  CC</li>
</ul>
<p className="mb-4"></p>
<p className="mb-4">The counseling centre in the college helps students to overcome their fears and find guidance in sensitive issues that affect them. Students can seek the support of counsellors for social and economic problems.</p>
<p className="mb-4"></p>
<p className="mb-4">Rev. AKHIL RL (Bursar)</p>
<p className="mb-4">Councellor</p>
<p className="mb-4">Mrs. K. Dina Willci</p>
<p className="mb-4">Councellor</p>
<p className="mb-4"></p>
<p className="mb-4"></p>
<p className="mb-4"></p>
    </ContentLayout>
  );
}
