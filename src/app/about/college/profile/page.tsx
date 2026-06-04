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
              <strong>John Cox Memorial C.S.I Institute Of Technology</strong>, Kannammola, Thiruvananthapuram with G.O. (MS) No. 124/09/H.Edn dt.3.8.09 Govt. of Kerala and affiliated with AICTE F. No. 06/06/KER/ENGG/2009-10/020 dt. 30.6.2009, Govt. of India, is functioning under the administrative control of the Society for Technical Training (STT) of South Kerala Diocese (SKD) of Church of South India (CSI), which is an educational agency fully owned and controlled by South Kerala Diocese (SKD). The management of the institution is vested with the Governing Body and the Executive Committee headed by the Rt. Rev. A. DHARMA RAJ RASALAM, as Chairman &amp; Manager. The constitution of the Executive Committee and Governing body is under charitable societies Registration Act XII of 1955. The institution is approved by AICTE and affiliated to the APJ Abdul Kalam Technological University Thiruvananthapuram for its academic programs.
            </p>
            <p>
              <strong>John Cox Memorial C.S.I Institute Of Technology (JIT)</strong> started in 2009 is an institution of the Society for Technical Training, a Charitable Society under the South Kerala Diocese of the South India United Church (SIUC) of the Church of South India (CSI) Trust Association. The Registered Office of the Society for Technical Training is at LMS Compound, Thiruvananthapuram.
            </p>
            <p>
              <strong>The John Cox Memorial CSI Institute of Technology</strong> is located at Kannammoola (Kannammoola - Medical College Road), 3 Km away from Pettah Railway Station, 5 Km away from the Thiruvananthapuram Bus Station and Railway Station, 4 Km away from the Kerala Legislative Assembly and 2 Km away from the Thiruvanathapuram Medical College and is well connected by roads.
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
