import { Metadata } from "next";
import { TrendingUp, Users, Award, Building, Briefcase, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Placements | JCMCSIIT",
  description: "Track our outstanding placement records and recruiter partnerships.",
};

const topRecruiters = [
  "Microsoft", "Amazon", "Google", "TCS", "Infosys", "Wipro", "Cognizant", 
  "IBM", "Tech Mahindra", "Oracle", "Cisco", "Intel"
];

export default function PlacementsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 mb-6 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Placement Season 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Career Excellence.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl leading-relaxed">
            Our Career Guidance and Placement Unit (CGPU) ensures every student is industry-ready, securing top-tier offers globally.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
          {[
            { label: "Placement Rate", value: "98.5%", icon: TrendingUp },
            { label: "Highest Package", value: "45 LPA", icon: Award },
            { label: "Recruiting Partners", value: "250+", icon: Building },
            { label: "Total Offers", value: "450+", icon: Briefcase },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <stat.icon className="h-8 w-8 text-primary mb-4" />
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Top Recruiters */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-8 text-foreground text-center">Top Recruiting Partners</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {topRecruiters.map((company) => (
              <div 
                key={company} 
                className="px-6 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-lg font-semibold text-slate-700 hover:border-slate-300 hover:shadow-md transition-all cursor-default"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* CGPU Message */}
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-10 rounded-3xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Message from CGPU Director</h2>
          <p className="text-slate-600 leading-relaxed text-lg mb-6">
            "At JCMCSIIT, we don't just prepare students for jobs; we prepare them for careers that shape the future. Our rigorous training programs, mock interviews, and direct industry collaborations bridge the gap between academia and the corporate world."
          </p>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Users className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-foreground">Prof. Name Surname</p>
              <p className="text-sm text-slate-500">Director, Placement Cell</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
