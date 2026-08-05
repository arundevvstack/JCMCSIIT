"use client";

import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";

const eventsData = [
  {
    id: 1,
    title: "Poster Design Competition: Future Powered by Signal Processing",
    category: "COMPETITION",
    image: "/events/The IEEE SPS SBC JCMCSIIT.jpeg",
    month: "AUG",
    day: "07",
    time: "Deadline: 11:59 PM",
    links: [
      { text: "Register", url: "https://forms.gle/5HC4uC6KjMNHRrXq5" },
      { text: "Rules & Regulations", url: "https://drive.google.com/file/d/1kukx4zKKA3bGCxca4L-YifMhsbAWdAA4/view?usp=sharing" }
    ]
  },
  {
    id: 2,
    title: "Green Energy Solutions: Building a Sustainable World",
    category: "SEMINAR",
    image: "/events/Green Energy.jpeg",
    month: "TBA",
    day: "TBA",
    time: "Upcoming",
  },
  {
    id: 3,
    title: "B.Tech Admissions Open 2026",
    category: "ADMISSION",
    image: "/events/betech.jpeg",
    month: "AUG",
    day: "01",
    time: "Apply Now",
  }
];

export function UpcomingEvents() {
  return (
    <section className="py-24 bg-slate-50 relative z-20 border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Upcoming Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {eventsData.map((event) => (
            <div key={event.id} className="group flex flex-col bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-full border border-slate-100 relative">
              <Link href={event.links ? event.links[0].url : "/news-events/events"} className="relative w-full aspect-[4/5] overflow-hidden bg-slate-200 block">
                <ParallaxImage
                  src={event.image}
                  alt={event.title}
                  fill
                  imageClassName="group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  offset={10}
                />
                
                {/* Date Badge overlay */}
                <div className="absolute bottom-0 left-0 bg-[#1c1c1c] text-white flex flex-col items-center justify-center w-16 h-16 pointer-events-none">
                  <span className="text-[10px] font-bold tracking-widest uppercase">{event.month}</span>
                  <span className="text-2xl font-bold leading-none">{event.day}</span>
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c4762] mb-3 block">
                  {event.category}
                </span>
                <Link href={event.links ? event.links[0].url : "/news-events/events"}>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1c4762] transition-colors leading-snug line-clamp-3 mb-4 flex-grow" style={{ fontFamily: "var(--font-sans)" }}>
                    {event.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 font-medium mb-4">
                  {event.time}
                </p>
                
                {/* Event Links */}
                {event.links && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {event.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-[#1c4762] hover:text-white transition-colors rounded text-slate-700"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
