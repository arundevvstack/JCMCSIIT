import { Metadata } from "next";
import { Users, Link2, ArrowUpRight, GraduationCap, Briefcase, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Alumni Network | JCMCSIIT",
  description: "Connect with the JCMCSIIT alumni community. Discover success stories and networking opportunities.",
};

const alumniSpotlight = [
  { name: "Ananya S. Nair", batch: "2018", role: "SDE II at Amazon", location: "Bangalore" },
  { name: "Rahul Krishnan", batch: "2016", role: "Data Scientist at Google", location: "Hyderabad" },
  { name: "Meera Thomas", batch: "2019", role: "Product Manager at Microsoft", location: "Seattle, USA" },
  { name: "Arun Kumar", batch: "2017", role: "Co-founder, TechStartup.io", location: "Kochi" },
];

export default function AlumniPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">

        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Alumni Network.
          </h1>
          <p className="text-slate-500 text-xl leading-relaxed max-w-2xl mx-auto">
            Our alumni are our greatest ambassadors — building careers at global tech giants, founding startups, and contributing to society worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {[
            { label: "Total Alumni", value: "15,000+", icon: Users },
            { label: "Countries", value: "20+", icon: Globe },
            { label: "Entrepreneurs", value: "150+", icon: Briefcase },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Alumni Spotlight */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-8 text-foreground text-center">Alumni Spotlight</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alumniSpotlight.map((alum) => (
              <div key={alum.name} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex items-start gap-6 hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-7 w-7 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{alum.name}</h3>
                  <p className="text-primary font-medium text-sm mb-1">{alum.role}</p>
                  <p className="text-slate-500 text-sm">{alum.location} · Batch of {alum.batch}</p>
                </div>
                <button className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0">
                  <Link2 className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Join the Alumni Association</h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Stay connected with your alma mater. Register on our alumni portal to access networking events, mentorship programs, and campus updates.
          </p>
          <button className="px-8 py-3 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-all shadow-lg flex items-center gap-2 mx-auto">
            Register as Alumni <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>

      </div>
    </main>
  );
}
