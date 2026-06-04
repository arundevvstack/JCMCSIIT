import { Metadata } from "next";
import { Lightbulb, Rocket, Users, Award, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Institution's Innovation Council (IIC) | JCMCSIIT",
  description: "Fostering innovation, entrepreneurship, and start-up culture at JCMCSIIT.",
};

export default function IICPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 mb-8 shadow-sm">
            <Lightbulb className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700 tracking-wide">Innovation Hub</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900">
            Institution&apos;s Innovation <span className="text-orange-500">Council</span>.
          </h1>
          <p className="text-slate-600 text-xl leading-relaxed max-w-3xl mx-auto text-justify">
            Established on 17th January 2024 with the objective of fostering innovation, entrepreneurship, and start-up culture among students and faculty members. The council aims to create a vibrant ecosystem that nurtures creative ideas and transforms them into impactful solutions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
              <img src="https://jcmcsiit.ac.in/Faculty/ECE/Arathy%20Raj%20B%20S.jpg" alt="Mrs. Arathiraj B S" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Mrs. Arathiraj B S</h3>
            <p className="text-sm text-slate-500 mb-2">Asst. Prof. ECE</p>
            <div className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">IIC President</div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
              <img src="https://jcmcsiit.ac.in/Faculty/ME/Akhil%20W%20V.jpg" alt="Mr. Akhil W V" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Mr. Akhil W V</h3>
            <p className="text-sm text-slate-500 mb-2">Asst. Prof. ME</p>
            <div className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">Vice President</div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
              <img src="https://jcmcsiit.ac.in/Faculty/CSE/NISHA%20A.M.jpg" alt="Mrs. Nisha A M" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Mrs. Nisha A M</h3>
            <p className="text-sm text-slate-500 mb-2">Asst. Prof. CSE</p>
            <div className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">Convenor</div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center"><Award className="w-6 h-6 mr-3 text-orange-500" /> Certificates & Recognition</h2>
            <ul className="space-y-4">
              <li>
                <a href="https://jcmcsiit.ac.in/general/IICEstablismentCertificate.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 shrink-0">
                    <Download className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Establishment Certificate</div>
                    <div className="text-sm text-slate-500">Official IIC Establishment Details</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://jcmcsiit.ac.in/general/IICRatingCertificate_2022-23.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 shrink-0">
                    <Download className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Rating Certificate</div>
                    <div className="text-sm text-slate-500">IIC Star Rating 2022-23</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            <h2 className="text-2xl font-bold mb-6 relative z-10">Gallery</h2>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-slate-800">
                  <img 
                    src={`https://jcmcsiit.ac.in/img/IIC/23-10-2025/IIC%20Slider%20(${i}).jpg`}
                    alt={`IIC Event ${i}`}
                    className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity hover:scale-110 duration-500"
                    />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
