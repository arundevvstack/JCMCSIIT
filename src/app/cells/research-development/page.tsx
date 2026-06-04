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
<p className="mb-4">Research and Development Cell</p>
<p className="mb-4">-----------------------------</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  RADC</li>
</ul>
<p className="mb-4"></p>
<p className="mb-4">Functions</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  Innovation and Idea Generation</li>
<li>  Promote a culture of continuous learning and innovation within the organization.</li>
<li>  Foster creativity and generate innovative ideas for new products.</li>
<li>  Share R&D outcomes with other departments for practical implementation.</li>
</ul>
<p className="mb-4">Sl.No</p>
<p className="mb-4">:</p>
<p className="mb-4">Name & Designation</p>
<p className="mb-4">1</p>
<p className="mb-4">:</p>
<p className="mb-4">Dr. Anshad A.S , Principal - Chairperson</p>
<p className="mb-4">2</p>
<p className="mb-4">:</p>
<p className="mb-4">Dr. Lim J.Seelan Prof ECE - Coordinator</p>
<p className="mb-4">3</p>
<p className="mb-4">:</p>
<p className="mb-4">Dr. J Sheeba Jeba Malar , Dean Academics - Member</p>
<p className="mb-4">4</p>
<p className="mb-4">:</p>
<p className="mb-4">Dr. Liji R F HOD , ECE - Member</p>
<p className="mb-4">5</p>
<p className="mb-4">:</p>
<p className="mb-4">Dr. Sanjt J, HOD, ME - Member</p>
<p className="mb-4">6</p>
<p className="mb-4">:</p>
<p className="mb-4">Ms. Renjini Rani K.S, Assoc .Prof., CSE - Member</p>
<p className="mb-4"></p>
<p className="mb-4"></p>
    </ContentLayout>
  );
}
