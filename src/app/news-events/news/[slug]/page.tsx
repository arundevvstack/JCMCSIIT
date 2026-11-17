import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getPublicNewsBySlug } from "@/lib/cms/news";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getPublicNewsBySlug(resolvedParams.slug);
  return {
    title: article ? `${article.title} | News | JCMCSIIT` : "News Article | JCMCSIIT",
    description: article?.excerpt || article?.content.substring(0, 160) || "Campus news and announcements.",
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getPublicNewsBySlug(resolvedParams.slug);

  if (!article) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-white relative">
        <div className="container px-4 md:px-6 relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-slate-500 mb-8">The requested news article does not exist or has been archived.</p>
          <Link href="/news-events/news" className="inline-flex items-center text-primary font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All News
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 max-w-3xl mx-auto">
        <Link href="/news-events/news" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All News
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <Tag className="h-3 w-3" />
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {article.published_at}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground leading-tight">
          {article.title}
        </h1>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg whitespace-pre-line">
          {article.content}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
          <Link href="/news-events/news" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All News
          </Link>
        </div>
      </div>
    </main>
  );
}
