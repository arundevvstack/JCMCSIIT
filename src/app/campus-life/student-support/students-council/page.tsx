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
<p className="mb-4">Students Council</p>
<p className="mb-4">----------------</p>
<ul className="list-disc pl-6 mb-4 space-y-2">
<li>  </li>
<li>  SC</li>
</ul>
<div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About Students Council</h2>
              <p className="text-slate-700 leading-relaxed">
                The Students Council acts as a platform to bridge the gap between the staff and student community. It is a representative body of the students. Members are elected from the class representatives. The main objective of the Council is to encourage students to participate in arts, sports, cultural and other recreational activities.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h3 className="text-xl font-bold text-slate-900">Students Council 2022-23</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { role: "Patron", name: "Prof. Dr. D.P.Balachandran" },
                    { role: "Staff Advisor", name: "Dr. Liji RF (Asso. Prof)" },
                    { role: "Staff Treasurer", name: "Mr. Akhil W V (Asst. Prof, ME)" },
                    { role: "Chairman", name: "Bibin ML, S8 CE" },
                    { role: "Vice Chairperson", name: "Vaishnavi S, S8 CSE" },
                    { role: "General Secretary", name: "Abin V, S8 ME" },
                    { role: "Magazine Editor", name: "Ullas G Revi, S6 EEE" },
                    { role: "Arts Club Secretary", name: "Ajin C Abraham, S8 EEE" },
                    { role: "University Union Councilor", name: "Abimel S B, S6 CSE" },
                    { role: "Women Representative", name: "Lekshmi S B, S6 ME" },
                    { role: "Women Representative", name: "Manjari S K, S8 CE" },
                    { role: "Sports Secretary", name: "Arjun M S, S6 ME" },
                    { role: "CE Representative", name: "Aiswarya L, S4 CE" },
                    { role: "ME Representative", name: "Anandhu U, S4 ME" },
                    { role: "EEE Representative", name: "Vaishnavi S K, S4 EEE" },
                    { role: "CSE Representative", name: "Aimee Gale Benziar, S6 CSE" },
                    { role: "ECE Representative", name: "Abhishek R S, S8 ECE" }
                  ].map((member, i) => (
                    <div key={i} className="flex flex-col py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{member.role}</span>
                      <span className="font-medium text-slate-900">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
    </ContentLayout>
  );
}
