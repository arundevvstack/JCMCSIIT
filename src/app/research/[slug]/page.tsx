import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users, Beaker, FileText } from "lucide-react";

const getResearchData = (slug: string) => {
  const projects: Record<string, any> = {
    "cognitive-ai-center": {
      title: "Center for Cognitive AI",
      lead: "Dr. Alan Turing",
      focus: ["Natural Language Processing", "Computer Vision", "Autonomous Systems"],
      description: `The Center for Cognitive AI at JCMCSIIT is at the forefront of intelligent systems research. Our multidisciplinary team of faculty and students works on building machines that can perceive, reason, and learn from the world around them.\n\nCurrent projects include developing domain-specific large language models for regional healthcare systems, autonomous drone navigation for agricultural monitoring, and AI-powered educational tools for personalized learning.\n\nThe center has published over 30 papers in top-tier venues including NeurIPS, CVPR, and ACL, and holds 5 active patents in the field of computer vision.`,
      publications: 30,
      patents: 5,
      students: 45,
    },
  };

  return projects[slug] || {
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    lead: "Prof. Faculty Name",
    focus: ["Advanced Research", "Innovation"],
    description: "Detailed research center information will be updated. Our centers are dedicated to pushing the boundaries of engineering and technology.",
    publications: 10,
    patents: 2,
    students: 20,
  };
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const project = getResearchData(resolvedParams.slug);
  return {
    title: `${project.title} | Research | JCMCSIIT`,
    description: project.description.substring(0, 160),
  };
}

export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = getResearchData(resolvedParams.slug);

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 max-w-5xl mx-auto">
        <Link href="/research" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Research Centers
        </Link>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          {project.title}
        </h1>
        <p className="text-xl text-slate-500 mb-12">Lead Researcher: <span className="text-foreground font-semibold">{project.lead}</span></p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Publications", value: project.publications, icon: BookOpen },
            { label: "Active Patents", value: project.patents, icon: FileText },
            { label: "Researchers", value: project.students, icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-slate-100 pb-4 flex items-center gap-3">
            <Beaker className="h-6 w-6 text-primary" /> Focus Areas
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.focus.map((area: string) => (
              <span key={area} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">
                {area}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-slate-100 pb-4">Overview</h2>
          {project.description.split("\n\n").map((para: string, i: number) => (
            <p key={i} className="text-slate-600 leading-relaxed text-lg mb-6">{para}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
