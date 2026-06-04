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
<p className="mb-4">DAC(Disciplinary Action Committee)</p>
<p className="mb-4">----------------------------------</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  DAC</li>
</ul>
<p className="mb-4"></p>
<p className="mb-4">The Disciplinary action committee looks into the indiscipline, misbehavior and unfair practices in examinations reported by faculty member or an invigilator</p>
<p className="mb-4">Chairman</p>
<p className="mb-4">:</p>
<p className="mb-4">Dr. J Sheeba Jeba Malar</p>
<p className="mb-4">Exam Chief Superintendent</p>
<p className="mb-4">:</p>
<p className="mb-4">Dr. Lim J Sleean</p>
<p className="mb-4">Member</p>
<p className="mb-4">:</p>
<p className="mb-4">Mrs. Seena M.K</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Harikrishnanan Nair S</p>
<p className="mb-4">:</p>
<p className="mb-4">Mrs. Saaji S J</p>
<p className="mb-4">:</p>
<p className="mb-4">Mrs. Nitya V Arnold</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Akhil Das Y P</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Beno Ben B P</p>
<p className="mb-4"></p>
<p className="mb-4"></p>
    </ContentLayout>
  );
}
