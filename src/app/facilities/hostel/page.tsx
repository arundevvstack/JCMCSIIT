import { Metadata } from "next";
import { Home, MapPin, Shield, Users } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Hostel Facilities | JCMCSIIT",
  description: "Learn about the comfortable and secure hostel accommodations available for JCMCSIIT students.",
};

export default function HostelPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="max-w-4xl mx-auto mb-12">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Hostel <span className="text-primary">Facilities</span>.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed">
            Comfortable, secure, and well-connected accommodation for our students.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 text-slate-900">A Home Away From Home</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
                  Hostel accommodation for both boys & girls are available in the <strong className="text-primary">LMS compound, Palayam</strong>.
                </p>
                <div className="flex items-center gap-3 text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm inline-flex">
                  <MapPin className="h-6 w-6 text-emerald-500" />
                  <span className="font-semibold">Located just 2.5 km away from the college campus.</span>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Boys & Girls</div>
                    <div className="text-sm text-slate-500">Separate facilities</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Secure</div>
                    <div className="text-sm text-slate-500">24/7 Security</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                    <Home className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">LMS Compound</div>
                    <div className="text-sm text-slate-500">Palayam</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">How to Apply</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Students seeking hostel accommodation should apply at the time of admission. Allocation is done based on availability and distance from the student's hometown.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                Contact Administration
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
