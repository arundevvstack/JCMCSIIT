import { Metadata } from 'next';
import { ContentLayout } from '@/components/layout/content-layout';

export const metadata: Metadata = {
  title: 'Administrative Council | JCMCSIIT',
  description: 'Administrative Council members and administration at John Cox Memorial C.S.I Institute Of Technology.',
};

export default function Page() {
  return (
    <ContentLayout title="Administrative Council" routePath="/about/college/administrative-council">
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Admission Enquiry</strong></li>
        <li>Director: 9496981555, Principal: 9496981666, Bursar: 9496981777</li>
        <li>Call us: +91 0471 2550474, 2446949</li>
      </ul>
      <p className="mb-4 font-semibold text-lg">Administrative Council</p>
      <p className="mb-4">
        Administrative Council is the apex body of the college, which comprises College Authorities, Deans, Heads of Departments and Invitees from various departments. This council is responsible for the overall development of the college and for laying down academic policies.
      </p>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-left border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="py-3 px-4 border border-slate-200 font-bold">Name</th>
              <th className="py-3 px-4 border border-slate-200 font-bold">Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Prof. Dr. Anshad A.S</td>
              <td className="py-2.5 px-4 border border-slate-200">Principal</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Rev. AKHIL RL</td>
              <td className="py-2.5 px-4 border border-slate-200">Bursar</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. Sheeba Jeba Malar J</td>
              <td className="py-2.5 px-4 border border-slate-200">Vice Principal &amp; HoD EEE</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. P Balachandran</td>
              <td className="py-2.5 px-4 border border-slate-200">Dean (Research)</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Mr. Vishnukumar S</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD CSE</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Mrs. L. Sreeletha</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD CE</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. Liji R F</td>
              <td className="py-2.5 px-4 border border-slate-200">Dean Students Affairs, HoD ECE</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. Sanjit J</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD ME</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Ms. Helen Shibija C</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD SH</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. Lim J Seelan</td>
              <td className="py-2.5 px-4 border border-slate-200">Exam Superintendent</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Mrs. Anu R John</td>
              <td className="py-2.5 px-4 border border-slate-200">Placement Officer</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ContentLayout>
  );
}
