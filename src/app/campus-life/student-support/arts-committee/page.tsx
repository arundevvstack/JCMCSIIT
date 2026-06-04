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
<p className="mb-4">Extra curricular Activities (Arts) Committee</p>
<p className="mb-4">--------------------------------------------</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  ECAC</li>
</ul>
<p className="mb-4"></p>
<p className="mb-4">The Arts Committee is responsible for nurturing the creative spirit on campus. We plan and host a wide array of artistic events throughout the academic year, including cultural festivals, performances, competitions, and workshops. Our goal is to provide every student with opportunities to engage with the arts, whether as a participant or an enthusiast, thereby enhancing the overall cultural fabric of our college community. We welcome all students to get involved and contribute to our vibrant artistic landscape.</p>
<p className="mb-4">Convener</p>
<p className="mb-4">:</p>
<p className="mb-4">Mrs. Smruthy Mohan, AP, Physics</p>
<p className="mb-4">Member</p>
<p className="mb-4">:</p>
<p className="mb-4">Mrs. Arathy Raj B.S, AP, ECE</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Vidhu Krishnan S, Phy. Education</p>
<p className="mb-4">:</p>
<p className="mb-4">Mrs. Dili D.L, AP, H&S</p>
<p className="mb-4">:</p>
<p className="mb-4">Anoop S S, S7 CSE Student</p>
<p className="mb-4">:</p>
<p className="mb-4">Aiswarya, S7 CSE Student</p>
<p className="mb-4"></p>
<p className="mb-4"></p>
    </ContentLayout>
  );
}
