import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "News & Announcements | JCMCSIIT",
  description: "Latest news, achievements, and announcements from JCMCSIIT.",
};

const newsItems = [
  {
    id: "nba-accreditation",
    title: "JCMCSIIT Receives NBA Accreditation for ECE Program",
    date: "Feb 20, 2026",
    category: "Achievement",
    summary: "The National Board of Accreditation has officially accredited our Electronics & Communication Engineering program, recognizing our commitment to quality education."
  },
  {
    id: "ai-research-grant",
    title: "AI Department Secures ₹50L Research Grant from DST",
    date: "Feb 10, 2026",
    category: "Research",
    summary: "The Department of Science and Technology has awarded a major grant to our AI lab for developing predictive healthcare models."
  },
  {
    id: "microsoft-coe",
    title: "Microsoft Center of Excellence Inaugurated on Campus",
    date: "Jan 25, 2026",
    category: "Campus News",
    summary: "A state-of-the-art innovation lab in partnership with Microsoft has been opened to provide hands-on cloud computing experience."
  }
];

export default function NewsPage() {
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
            <Link key={news.id} href={`/news/${news.id}`} className="group h-full">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-primary">
                      {news.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{news.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {news.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {news.summary}
                  </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center text-sm font-semibold text-primary">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
