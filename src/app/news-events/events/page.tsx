import { Metadata } from "next";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Events & Workshops | JCMCSIIT",
  description: "Discover upcoming tech symposiums, hackathons, and cultural events at JCMCSIIT.",
};

const events = [
  {
    id: "poster-design-2026",
    title: "Poster Design Competition: Future Powered by Signal Processing",
    date: "August 07, 2026",
    time: "Deadline: 11:59 PM",
    location: "Online Submission",
    category: "COMPETITION",
    description: "The IEEE SPS SBC JCMCSIIT proudly presents a Poster Design Competition, inviting students to showcase their creativity by designing a poster based on the theme 'Future Powered by Signal Processing'.",
    registerLink: "https://forms.gle/5HC4uC6KjMNHRrXq5",
    detailsLink: "https://drive.google.com/file/d/1kukx4zKKA3bGCxca4L-YifMhsbAWdAA4/view?usp=sharing",
    detailsText: "Rules & Regulations"
  },
  {
    id: "green-energy-2026",
    title: "Green Energy Solutions: Building a Sustainable World",
    date: "TBA",
    time: "TBA",
    location: "Seminar Hall",
    category: "SEMINAR",
    description: "Join us for an insightful seminar on building a sustainable, carbon-neutral world.",
  },
  {
    id: "btech-admissions-2026",
    title: "B.Tech Admissions Open 2026",
    date: "August 01, 2026",
    time: "Apply Now",
    location: "Admission Office",
    category: "ADMISSION",
    description: "B.Tech Admissions for the 2026 academic year are now open. Secure your seat today."
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
            Explore what's happening at JCMCSIIT.
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
                {event.registerLink && (
                  <Link 
                    href={event.registerLink} 
                    target={event.registerLink.startsWith("http") ? "_blank" : undefined}
                    rel={event.registerLink.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="w-full py-3 rounded-xl bg-foreground text-white font-semibold hover:bg-foreground/90 transition-colors shadow-sm flex items-center justify-center text-center text-sm"
                  >
                    Register Now
                  </Link>
                )}
                {event.detailsLink && (
                  <Link 
                    href={event.detailsLink}
                    target={event.detailsLink.startsWith("http") ? "_blank" : undefined}
                    rel={event.detailsLink.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="w-full py-3 rounded-xl bg-white border border-slate-200 text-foreground font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm text-center"
                  >
                    {event.detailsText || "Details"} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
