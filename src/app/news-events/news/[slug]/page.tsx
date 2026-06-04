import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Tag } from "lucide-react";

const getNewsData = (slug: string) => {
  const articles: Record<string, any> = {
    "nba-accreditation": {
      title: "JCMCSIIT Receives NBA Accreditation for ECE Program",
      date: "February 20, 2026",
      category: "Achievement",
      content: `The National Board of Accreditation (NBA) has officially granted accreditation to the Electronics & Communication Engineering (ECE) program at JCMCSIIT. This prestigious recognition validates the institution's commitment to maintaining the highest standards of engineering education.\n\nThe accreditation process involved a rigorous assessment of the department's infrastructure, faculty qualifications, curriculum design, research output, and student outcomes. The evaluation committee praised the department for its industry-aligned curriculum and the exceptional placement record of its graduates.\n\n"This accreditation is a testament to the hard work of our faculty, students, and the entire JCMCSIIT community," said the Principal. "We remain committed to continuous improvement and excellence in all our academic programs."\n\nWith this addition, JCMCSIIT now has multiple NBA-accredited programs, reinforcing its position as one of the leading engineering institutions in Kerala.`,
    },
    "ai-research-grant": {
      title: "AI Department Secures ₹50L Research Grant from DST",
      date: "February 10, 2026",
      category: "Research",
      content: `The Department of Science and Technology (DST) has awarded a significant research grant of ₹50 Lakhs to the AI & Machine Learning department at JCMCSIIT. The funding will support a three-year project focused on developing predictive healthcare models using federated learning.\n\nThe project, led by the department faculty, aims to create AI systems that can predict disease outbreaks and patient outcomes while maintaining strict data privacy through decentralized machine learning techniques.\n\n"This grant validates the quality of research we are pursuing at JCMCSIIT," said the project lead. "Our goal is to create AI tools that can be deployed in rural healthcare centers across Kerala, making advanced diagnostics accessible to underserved communities."`,
    },
  };

  return articles[slug] || {
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    date: "2026",
    category: "News",
    content: "Full article content will be updated shortly. Please check back soon for the complete story.",
  };
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getNewsData(resolvedParams.slug);
  return {
    title: `${article.title} | News | JCMCSIIT`,
    description: article.content.substring(0, 160),
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = getNewsData(resolvedParams.slug);

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 max-w-3xl mx-auto">
        <Link href="/news-events/news" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All News
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-primary">
            <Tag className="h-3 w-3" /> {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-500">
            <Calendar className="h-3.5 w-3.5" /> {article.date}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 text-foreground leading-tight">
          {article.title}
        </h1>

        <article className="prose prose-slate prose-lg max-w-none">
          {article.content.split("\n\n").map((para: string, i: number) => (
            <p key={i} className="text-slate-600 leading-relaxed text-lg mb-6">{para}</p>
          ))}
        </article>

        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
          <Link href="/news-events/news" className="text-sm font-semibold text-primary hover:underline">
            ← Back to News
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </div>
    </main>
  );
}
