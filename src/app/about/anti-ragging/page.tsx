import { Metadata } from "next";
import { ShieldAlert, Phone, FileText, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Anti-Ragging Cell | JCMCSIIT",
  description: "JCMCSIIT maintains a zero-tolerance policy against ragging. Report incidents and access resources.",
};

export default function AntiRaggingPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">

        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 mb-6">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700 uppercase tracking-wider">Zero Tolerance</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Anti-Ragging Cell.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto">
            JCMCSIIT enforces a strict zero-tolerance policy against ragging of any kind. The safety and dignity of every student is our highest priority.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">

          <div className="bg-red-50 rounded-3xl p-10 border border-red-200">
            <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-3">
              <Scale className="h-6 w-6 text-red-600" /> What Constitutes Ragging
            </h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              As per the UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions (2009), ragging constitutes any disorderly conduct, whether by words spoken or written, or by an act which causes annoyance, hardship, or psychological harm to a student.
            </p>
            <p className="text-slate-700 leading-relaxed font-semibold">
              Any form of ragging — verbal, physical, or cyber — is a criminal offence and is punishable by law, including expulsion and imprisonment.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Phone className="h-6 w-6 text-primary" /> Helpline & Reporting
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-foreground mb-2">National Anti-Ragging Helpline</h3>
                <p className="text-2xl font-bold text-red-600">1800-180-5522</p>
                <p className="text-sm text-slate-500 mt-1">Toll-free, 24/7</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="font-bold text-foreground mb-2">JCMCSIIT Internal Helpline</h3>
                <p className="text-2xl font-bold text-primary">+91 94969 81555</p>
                <p className="text-sm text-slate-500 mt-1">Office hours or email: principal@jcmcsiit.ac.in</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" /> Anti-Ragging Committee
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The Anti-Ragging Committee comprises senior faculty members, administrative officers, and student representatives who are responsible for monitoring, preventing, and addressing any incidents of ragging on campus.
            </p>
            <button className="px-6 py-3 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-all shadow-sm">
              View Committee Members (PDF)
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
