"use client";

import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";

const eventsData = [
  {
    id: 1,
    title: "Can Law and Ethics Limit Harm to Civilians in War?",
    category: "LECTURE/PRESENTATION/TALK",
    image: "/events/ev_speaker_1779730988115.png",
    month: "MAY",
    day: "26",
    time: "12:00 PM IST",
  },
  {
    id: 2,
    title: "Energy Transition Leadership Seminar: Robert Hanson",
    category: "LECTURE/PRESENTATION/TALK",
    image: "/events/ev_seminar_1779731001332.png",
    month: "MAY",
    day: "26",
    time: "02:00 PM IST",
  },
  {
    id: 3,
    title: "The Tech World in an Era of AI: A Conversation",
    category: "CLASS/SEMINAR",
    image: "/events/ev_poster_1779731016884.png",
    month: "MAY",
    day: "26",
    time: "04:00 PM IST",
  },
  {
    id: 4,
    title: "Second Annual Distinguished AI Lecture by Prof. Michael",
    category: "LECTURE/PRESENTATION/TALK",
    image: "/events/ev_lecture_1779731033145.png",
    month: "MAY",
    day: "26",
    time: "04:30 PM IST",
  },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {eventsData.map((event) => (
            <Link key={event.id} href="/news-events/events" className="group flex flex-col bg-white shadow-sm hover:shadow-lg transition-all duration-300 h-full border border-slate-100 relative">
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-200">
                <ParallaxImage
                  src={event.image}
                  alt={event.title}
                  fill
                  imageClassName="group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  offset={10}
                />
                
                {/* Date Badge overlay */}
                <div className="absolute bottom-0 left-0 bg-[#1c1c1c] text-white flex flex-col items-center justify-center w-16 h-16">
                  <span className="text-[10px] font-bold tracking-widest uppercase">{event.month}</span>
                  <span className="text-2xl font-bold leading-none">{event.day}</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c4762] mb-3 block">
                  {event.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1c4762] transition-colors leading-snug line-clamp-3 mb-4 flex-grow" style={{ fontFamily: "var(--font-sans)" }}>
                  {event.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {event.time}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/news-events/events"
            className="inline-flex items-center justify-center px-10 py-3 bg-[#1c4762] text-white font-bold rounded-md hover:bg-[#102e41] transition-colors duration-300"
          >
            More events
          </Link>
        </div>
      </div>
    </section>
  );
}
