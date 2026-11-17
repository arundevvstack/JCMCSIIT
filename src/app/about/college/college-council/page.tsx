import { Metadata } from 'next';
import { ContentLayout } from '@/components/layout/content-layout';

export const metadata: Metadata = {
  title: 'College Council | JCMCSIIT',
  description: 'College Council members at John Cox Memorial C.S.I Institute Of Technology.',
};

export default function Page() {
  return (
    <ContentLayout title="College Council" routePath="/about/college/college-council">
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Admission Enquiry</strong></li>
        <li>Director: 9496981555, Principal: 9496981666, Bursar: 9496981777</li>
        <li>Call us: +91 0471 2550474, 2446949</li>
      </ul>
      <p className="mb-4">
        The College Council is constituted with the following members. All members work and contribute towards the smooth functioning and academic progress of the college.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-left border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="py-3 px-4 border border-slate-200 font-bold w-16">Sl No</th>
              <th className="py-3 px-4 border border-slate-200 font-bold">Name</th>
              <th className="py-3 px-4 border border-slate-200 font-bold">Position</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-2.5 px-4 border border-slate-200">1</td>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Prof. Dr. Anshad A.S</td>
              <td className="py-2.5 px-4 border border-slate-200">Chairman (Principal)</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200">2</td>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Rev. AKHIL RL</td>
              <td className="py-2.5 px-4 border border-slate-200">Bursar (Special Invitee)</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200">3</td>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. J Sheeba Jeba Malar</td>
              <td className="py-2.5 px-4 border border-slate-200">Vice Principal &amp; HoD EEE</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200">4</td>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Mrs. L Sreelatha</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD CE</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200">5</td>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. Sanjith J</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD ME</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200">6</td>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Dr. Liji R.F</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD ECE</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 border border-slate-200">7</td>
              <td className="py-2.5 px-4 border border-slate-200 font-medium">Mr. Vishnu Kumar S</td>
              <td className="py-2.5 px-4 border border-slate-200">HoD CSE</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ContentLayout>
  );
}
