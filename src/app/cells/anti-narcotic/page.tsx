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
<p className="mb-4">Anti Narcotic Cell</p>
<p className="mb-4">------------------</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  ANC</li>
</ul>
<p className="mb-4"></p>
<p className="mb-4">Members</p>
<p className="mb-4">Convener</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Shehin N (AP, ME)</p>
<p className="mb-4">Member</p>
<p className="mb-4">:</p>
<p className="mb-4">Ms. Seena M.K (AP, ECE)</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Binu Robert (T/I, ME)</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Beno Ben B.P (AP, EEE)</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Shajikumar S V (AO)</p>
<p className="mb-4"></p>
<p className="mb-4"></p>
    </ContentLayout>
  );
}
