import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2 } from "lucide-react";

const getEventData = (slug: string) => {
  const events: Record<string, any> = {
    "hackathon-2026": {
      title: "AI & Web3 Hackathon 2026",
      date: "March 15, 2026",
      time: "09:00 AM — 48 Hours",
      location: "Main Auditorium, JCMCSIIT Campus",
      category: "Technical",
      registrations: "320+",
      description: `The flagship hackathon of JCMCSIIT brings together the brightest minds from across Kerala. Over 48 intense hours, teams of 2–4 will conceptualize, prototype, and present AI-powered and Web3 solutions to real-world problems.\n\nThis year's themes include Healthcare AI, Decentralized Finance, Smart Infrastructure, and Sustainable Tech.\n\nAll participants receive certificates, meals, and swag kits. Top 3 teams win cash prizes totaling ₹1,50,000.`,
    },
    "tech-symposium": {
      title: "National Tech Symposium: INNOVA",
      date: "April 02, 2026",
      time: "10:00 AM — 05:00 PM",
      location: "Conference Hall B",
      category: "Symposium",
      registrations: "500+",
      description: `INNOVA is the annual national-level technical symposium hosted by JCMCSIIT. Industry leaders, researchers, and students converge to discuss the latest in quantum computing, generative AI, and edge intelligence.\n\nKeynote speakers include technologists from Google DeepMind, ISRO, and IIT Madras. Paper presentations, poster sessions, and live demos run throughout the day.`,
    },
  };

  return events[slug] || {
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    date: "TBA",
    time: "TBA",
    location: "JCMCSIIT Campus",
    category: "Event",
    registrations: "Open",
    description: "Details for this event will be updated soon. Please check back or contact the event coordinators for more information.",
  };
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const event = getEventData(resolvedParams.slug);
  return {
    title: `${event.title} | Events | JCMCSIIT`,
    description: event.description.substring(0, 160),
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const event = getEventData(resolvedParams.slug);

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 max-w-4xl mx-auto">
        <Link href="/news-events/events" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Events
        </Link>

        <span className="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-primary mb-6 uppercase tracking-wider">
          {event.category}
        </span>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-foreground">
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500 mb-12 border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {event.date}</div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /> {event.time}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {event.location}</div>
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /> {event.registrations} Registrations</div>
        </div>

        <div className="prose prose-slate prose-lg max-w-none mb-16">
          {event.description.split("\n\n").map((para: string, i: number) => (
            <p key={i} className="text-slate-600 leading-relaxed text-lg mb-6">{para}</p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="h-14 px-8 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-all shadow-lg text-lg">
            Register Now
          </button>
          <button className="h-14 px-8 rounded-xl bg-white border border-slate-200 text-foreground font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2 text-lg">
            <Share2 className="h-5 w-5 text-slate-400" /> Share Event
          </button>
        </div>
      </div>
    </main>
  );
}
