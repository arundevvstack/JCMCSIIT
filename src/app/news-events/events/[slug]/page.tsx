import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { getPublicEventBySlug } from "@/lib/cms/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const event = await getPublicEventBySlug(resolvedParams.slug);
  return {
    title: event ? `${event.title} | Events | JCMCSIIT` : "Event Details | JCMCSIIT",
    description: event?.description.substring(0, 160) || "Campus event details and schedule.",
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const event = await getPublicEventBySlug(resolvedParams.slug);

  if (!event) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-white relative">
        <div className="container px-4 md:px-6 relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Event Not Found</h1>
          <p className="text-slate-500 mb-8">The requested campus event does not exist or has expired.</p>
          <Link href="/news-events/events" className="inline-flex items-center text-primary font-semibold">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white relative">
      <div className="container px-4 md:px-6 relative z-10 max-w-4xl mx-auto">
        <Link href="/news-events/events" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Events
        </Link>

        {event.poster_url ? (
          <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden mb-10 shadow-lg border border-slate-200 bg-slate-100">
            <Image
              src={event.poster_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold uppercase tracking-wider">
            {event.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Calendar className="h-4 w-4 text-primary" />
            {event.display_date_text}
          </span>
          {event.display_time_text ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Clock className="h-4 w-4 text-primary" />
              {event.display_time_text}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <MapPin className="h-4 w-4 text-primary" />
            {event.location}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground leading-tight">
          {event.title}
        </h1>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg whitespace-pre-line mb-12">
          {event.description}
        </div>

        {event.registration_url ? (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Interested in Attending?</h3>
              <p className="text-sm text-slate-500">Registrations are currently open for students and faculty.</p>
            </div>
            <Link
              href={event.registration_url}
              target={event.registration_url.startsWith("http") ? "_blank" : undefined}
              rel={event.registration_url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap"
            >
              Register for Event
            </Link>
          </div>
        ) : null}

        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
          <Link href="/news-events/events" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Events
          </Link>
        </div>
      </div>
    </main>
  );
}
