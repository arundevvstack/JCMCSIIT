import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from "lucide-react";
import { getPublicEventsList } from "@/lib/cms/events";

export const metadata: Metadata = {
  title: "Events & Workshops | JCMCSIIT",
  description: "Discover upcoming tech symposiums, hackathons, and cultural events at JCMCSIIT.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getPublicEventsList();

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Campus Events.
          </h1>
          <p className="text-slate-500 max-w-2xl text-xl leading-relaxed">
            Experience our vibrant academic culture through national conferences, hackathons, cultural festivals, and research workshops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              {event.poster_url ? (
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={event.poster_url}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                      {event.category}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 pb-0">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-primary uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                    {event.title}
                  </h2>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 mt-auto">
                  <div className="flex flex-col gap-2 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                      <span>{event.display_date_text}</span>
                    </div>
                    {event.display_time_text ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span>{event.display_time_text}</span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      href={`/news-events/events/${event.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Event Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    {event.registration_url ? (
                      <Link
                        href={event.registration_url}
                        target={event.registration_url.startsWith("http") ? "_blank" : undefined}
                        rel={event.registration_url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Register
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
