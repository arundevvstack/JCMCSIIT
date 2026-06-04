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
<p className="mb-4">IIIC</p>
<p className="mb-4">----</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  IIIC</li>
</ul>
<p className="mb-4"></p>
<p className="mb-4">The aim of the Industry Institute Interaction Cell is to promote interactions between the Academia and the Industry. The Cell organizes industrial visits, internships and training programmes for the students.</p>
<p className="mb-4">Convener</p>
<p className="mb-4">:</p>
<p className="mb-4">Mrs.Seena MK (Asst. Prof. ECE)</p>
<p className="mb-4">Members</p>
<p className="mb-4">:</p>
<p className="mb-4">Ms. Bindhya P S(AP/CSE)</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Alvin Moses(AP/ECE)</p>
<p className="mb-4">:</p>
<p className="mb-4">Mr. Jyothish Kiran (AP/CE)</p>
<p className="mb-4">:</p>
<p className="mb-4">Ms. Anju Rajendran(AP/CE)</p>
<p className="mb-4"></p>
<h4 className="text-xl font-bold mb-4 text-slate-800"><strong>MoU</strong></h4>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  Oka Basu's Metal Technologies Pvt Ltd</li>
<li>  Placement Support, Internship & Skill Development</li>
<li>  Inforich Technology Solutions Pvt Ltd</li>
<li>  Embright Infotech Private Ltd</li>
<li>  Sniqsys Technoshere Pvt Ltd</li>
<li>  Inmakes Infotech Pvt Ltd</li>
<li>  Neo Edge Digital Solutions</li>
<li>  Estrrado Technologies</li>
</ul>
<p className="mb-4"></p>
    </ContentLayout>
  );
}
