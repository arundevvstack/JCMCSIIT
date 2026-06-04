import { Metadata } from "next";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Events & Workshops | JCMCSIIT",
  description: "Discover upcoming tech symposiums, hackathons, and cultural events at JCMCSIIT.",
};

const events = [
  {
    id: "hackathon-2026",
    title: "AI & Web3 Hackathon 2026",
    date: "March 15, 2026",
    time: "09:00 AM - 48 Hours",
    location: "Main Auditorium",
    category: "Technical",
    description: "Join the largest student-led hackathon in Kerala. Build the future of AI and decentralized web applications."
  },
  {
    id: "tech-symposium",
    title: "National Tech Symposium: INNOVA",
    date: "April 02, 2026",
    time: "10:00 AM - 05:00 PM",
    location: "Conference Hall B",
    category: "Symposium",
    description: "A gathering of industry leaders, researchers, and students to discuss the impact of quantum computing."
  },
  {
    id: "cultural-fest",
    title: "SANSKRITI '26 - Annual Cultural Fest",
    date: "April 20, 2026",
    time: "05:00 PM onwards",
    location: "Open Air Theatre",
    category: "Cultural",
    description: "Experience the vibrant culture of JCMCSIIT with music, dance, art, and theatrical performances."
  }
];

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Campus Events.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl leading-relaxed">
            From intense 48-hour hackathons to vibrant cultural festivals, explore what's happening at JCMCSIIT.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8 items-start md:items-center">
              
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-primary mb-4 uppercase tracking-wider">
                  {event.category}
                </span>
                <h2 className="text-2xl font-bold text-foreground mb-3">{event.title}</h2>
                <p className="text-slate-600 mb-6">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-slate-400" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" /> {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" /> {event.location}
                  </div>
                </div>
              </div>
              
              <div className="md:w-48 shrink-0 flex flex-col gap-3 w-full">
                <button className="w-full py-3 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-colors shadow-sm">
                  Register Now
                </button>
                <button className="w-full py-3 rounded-xl bg-white border border-slate-200 text-foreground font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                  Details <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
