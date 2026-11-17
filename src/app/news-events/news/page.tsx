import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { getPublicNewsList } from "@/lib/cms/news";

export const metadata: Metadata = {
  title: "News & Announcements | JCMCSIIT",
  description: "Latest news, achievements, and announcements from JCMCSIIT.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const newsItems = await getPublicNewsList();

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            News & Updates.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl leading-relaxed">
            Stay informed with the latest campus announcements, institutional achievements, and research breakthroughs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {newsItems.map((news) => (
            <Link key={news.id} href={`/news-events/news/${news.slug}`} className="group h-full">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-primary">
                      {news.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{news.published_at}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {news.title}
                  </h2>
                  {news.excerpt ? (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>
                  ) : null}
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-primary font-semibold text-sm">
                  <span>Read Story</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Media Contact Banner */}
        <div className="mt-20 max-w-4xl mx-auto bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-2">
              <Newspaper className="h-4 w-4" />
              <span>Media Relations</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Are you a journalist or researcher?</h3>
            <p className="text-slate-500">Contact our communications team for official press releases, interviews, and brand assets.</p>
          </div>
          <Link href="/contact" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
            Contact Press Office
          </Link>
        </div>

      </div>
    </main>
  );
}
