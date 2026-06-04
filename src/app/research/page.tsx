import { Metadata } from "next";
import { FlaskConical, Lightbulb, Microscope, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Research & Innovation | JCMCSIIT",
  description: "Discover the cutting-edge research and innovation happening at JCMCSIIT.",
};

export default function ResearchPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 mb-6 shadow-sm">
            <FlaskConical className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Innovation Ecosystem</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Pushing Boundaries.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl leading-relaxed">
            Our research centers focus on solving real-world challenges through artificial intelligence, sustainable engineering, and advanced robotics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20">
          {[
            {
              title: "Center for Cognitive AI",
              desc: "Focusing on Natural Language Processing, Computer Vision, and autonomous systems.",
              icon: Lightbulb
            },
            {
              title: "Advanced Materials Lab",
              desc: "Researching sustainable and smart materials for modern manufacturing.",
              icon: Microscope
            }
          ].map((center, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8">
                <center.icon className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-foreground">{center.title}</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-8 flex-1">{center.desc}</p>
              <button className="self-start px-6 py-2 rounded-xl bg-slate-50 border border-slate-200 text-foreground font-semibold hover:bg-slate-100 transition-colors shadow-sm text-sm">
                Explore Publications
              </button>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 p-10 rounded-3xl max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 justify-between">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Research Incentive Policy</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              JCMCSIIT provides substantial grants and incentives for faculty and students publishing in high-impact journals or filing patents.
            </p>
            <button className="px-6 py-3 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-colors shadow-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Download Policy PDF
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-3xl font-bold text-primary mb-1">50+</p>
              <p className="text-xs font-semibold uppercase text-slate-500">IEEE Papers</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
              <p className="text-3xl font-bold text-primary mb-1">12</p>
              <p className="text-xs font-semibold uppercase text-slate-500">Active Patents</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
