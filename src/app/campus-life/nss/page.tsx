import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, HeartHandshake, Tent, Droplet, UserSquare2, Image as ImageIcon, PlayCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'National Service Scheme (NSS) | JCMCSIIT',
  description: 'National Service Scheme (NSS) at John Cox Memorial C.S.I Institute Of Technology',
};

export default function NSSPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container px-4 md:px-8 mx-auto relative z-10 max-w-7xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/campus-life" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campus Life
          </Link>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
            <HeartHandshake className="w-10 h-10" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6 shadow-sm">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">NSS Cell</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            National Service Scheme
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
            Not Me But You. Fostering a feeling of sacrifice, a spirit of service, and a sense of togetherness among students.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-emerald-500" />
              <h2 className="text-2xl font-bold text-slate-900 mb-6">About the NSS Cell</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The aim of the NSS Cell is to bring among students a feeling of sacrifice, a spirit of service, and a sense of togetherness. It provides a vital platform for community service, allowing students to actively engage with and uplift society while developing their own personality through social service.
              </p>
            </div>

            {/* Key Activities */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Tent className="w-6 h-6 text-emerald-600" /> Key Programmes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: HeartHandshake, title: "Medical Camps", desc: "Organizing free health checkups and awareness drives for rural communities." },
                  { icon: Tent, title: "Flood Relief", desc: "Active participation in disaster management and relief material collection." },
                  { icon: Droplet, title: "Blood Donation", desc: "Regular life-saving blood donation camps conducted inside the campus." },
                  { icon: Users, title: "Community Service", desc: "Various local outreach programs designed to help underprivileged groups." }
                ].map((activity, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <activity.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{activity.title}</h3>
                      <p className="text-sm text-slate-600">{activity.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Placeholder */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-blue-600" /> Gallery & Media
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-300 relative group overflow-hidden cursor-pointer">
                    <ImageIcon className="w-8 h-8 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Area - Leadership */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Leadership & Officers</h3>
            <p className="text-slate-500 text-sm mb-6">Contact the NSS coordinators for volunteering opportunities.</p>
            
            <div className="space-y-4">
              {/* Officer 1 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <UserSquare2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Mrs. Beena Thamby</h4>
                    <p className="text-sm font-semibold text-emerald-600">Programme Officer</p>
                  </div>
                </div>
                <div className="text-sm text-slate-500 px-2 py-1 bg-slate-50 rounded-lg inline-flex w-fit">
                  Asst. Prof. S&H
                </div>
              </div>

              {/* Officer 2 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <UserSquare2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Mr. Harikrishnan Nair S</h4>
                    <p className="text-sm font-semibold text-emerald-600">Assistant Programme Officer</p>
                  </div>
                </div>
              </div>

              {/* Officer 3 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Mr. Midhun</h4>
                    <p className="text-sm font-semibold text-blue-600">Voluntary Secretary</p>
                  </div>
                </div>
                <div className="text-sm text-slate-500 px-2 py-1 bg-slate-50 rounded-lg inline-flex w-fit">
                  Student (S5 ME)
                </div>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="mt-8 bg-slate-900 rounded-3xl p-6 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply" />
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                <h4 className="text-white font-bold">Watch NSS Journey</h4>
                <p className="text-slate-300 text-sm">Highlights from the previous academic year</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
