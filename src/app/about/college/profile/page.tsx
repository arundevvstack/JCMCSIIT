import { Metadata } from 'next';
import Image from 'next/image';
import { BookOpen, MapPin, Award, Users } from 'lucide-react';
import CampusCarousel from '@/components/about/CampusCarousel';

export const metadata: Metadata = {
  title: 'College Profile | JCMCSIIT',
  description: 'Learn about John Cox Memorial C.S.I Institute of Technology - its history, accreditation, and institutional background.',
};

export default function CollegeProfilePage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container px-4 mx-auto max-w-7xl">

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-wide">College Profile</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            John Cox Memorial C.S.I Institute of Technology
          </h1>
          <p className="text-slate-500 text-lg">Institution Code: <strong className="text-slate-800">JIT</strong> · Kannammoola, Thiruvananthapuram</p>
        </div>

        {/* Campus Photo Banner */}
        <div className="mb-14">
          <CampusCarousel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2 space-y-6 text-slate-700 leading-relaxed text-justify">
            <p>
              <strong>John Cox Memorial CSI Institute of Technology (JIT)</strong>, Kannammoola, Thiruvananthapuram, was established in 2009 with the approval of the Government of Kerala vide G.O. (MS) No. 124/09/H.Edn dated 03.08.2009 and the All India Council for Technical Education (AICTE) vide F. No. 06/06/KER/ENGG/2009-10/020 dated 30.06.2009. The institution is affiliated with APJ Abdul Kalam Technological University (KTU), Kerala, and is approved by AICTE for conducting its academic programmes.
            </p>
            <p>
              The institution functions under the administrative control of the Society for Technical Training (STT), an educational and charitable society fully owned and managed by the South Kerala Diocese (SKD) of the Church of South India (CSI). The Society for Technical Training is registered under the Travancore-Cochin Literary, Scientific and Charitable Societies Registration Act, XII of 1955, with its registered office located at LMS Compound, Thiruvananthapuram.
            </p>
            <p>
              The management of the institution is vested in the Governing Body and the Executive Committee of the Society for Technical Training. The Executive Committee is presently headed by <strong>Rt. Rev. Dr. Prinstone Ben as Chairman, J. Mohana Kumar as Manager, T. B. Sanal Kumar as Secretary, and Rev. Akhil R. L. as Bursar</strong>. The institution is committed to providing quality technical education while upholding the values of academic excellence, integrity, service, and social responsibility.
            </p>
            <p>
              Situated at Kannammoola on the Kannammoola–Medical College Road in Thiruvananthapuram, the campus enjoys a strategic and easily accessible location. It is approximately 3 km from Pettah Railway Station, 5 km from Thiruvananthapuram Central Railway Station and KSRTC Bus Station, 4 km from the Kerala Legislative Assembly, and 2 km from Government Medical College, Thiruvananthapuram. The campus is well connected by road, making it convenient for students and faculty from different parts of the city and neighbouring districts.
            </p>
            <p>
              Since its inception in 2009, John Cox Memorial CSI Institute of Technology has been dedicated to nurturing competent engineers, technologists, and professionals through quality education, experienced faculty, modern infrastructure, industry interaction, research, innovation, and holistic personality development. The institution strives to prepare students for successful careers while instilling ethical values and a commitment to serving society.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, label: 'Location', value: 'Kannammoola, Thiruvananthapuram, Kerala' },
              { icon: Award, label: 'Affiliation', value: 'APJ Abdul Kalam Technological University (KTU)' },
              { icon: Award, label: 'Approval', value: 'AICTE Approved · NBA Accredited' },
              { icon: Users, label: 'Management', value: 'Society for Technical Training, South Kerala Diocese (SKD), CSI' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-slate-800 font-medium text-sm">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rev. John Cox Section */}
        <div className="bg-[#0B1F3A] rounded-3xl p-10 md:p-14 text-white overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-center relative z-10">
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <div className="relative w-48 h-64 md:w-full md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <Image 
                  src="/images/about/rev-john-cox.jpg" 
                  alt="Rev. John Cox" 
                  fill 
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Rev. John Cox</h2>
              <p className="text-emerald-400 font-bold tracking-widest text-sm mb-6 uppercase">(1811 – 1875)</p>
              <p className="text-white/80 leading-relaxed text-justify text-lg">
                The Rev. John Cox is a well-known social reformer who worked in the Travancore region of Kerala as a British missionary. He played a pivotal role in the social transformation of the people of Travancore, particularly in the areas of education and social reform. His legacy of service, compassion, and dedication to uplifting the underprivileged continues to inspire the ethos of this institution which proudly bears his name.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
