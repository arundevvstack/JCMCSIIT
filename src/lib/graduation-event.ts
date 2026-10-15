/**
 * Graduation and Course Completion Ceremony 2026 — PINNACLE 2K26.
 * Shared by the site-wide popup, News & Events listing, event detail page
 * and the homepage Upcoming Events section to avoid duplicate records.
 */
export const GRADUATION_EVENT = {
  slug: "pinnacle-2k26-graduation-ceremony",
  title: "Graduation and Course Completion Ceremony 2026 — PINNACLE 2K26",
  category: "CEREMONY",
  date: "November 07, 2026",
  month: "NOV",
  day: "07",
  time: "06:00 PM",
  location: "JIT Campus",
  registrationDeadline: "October 20, 2026",
  registerLink: "https://forms.gle/qGvnmm5juaKoggiv5",
  poster: "/pinnacle.jpeg",
  description:
    "John Cox Memorial CSI Institute of Technology (JCMCSIIT) invites graduating students to the Graduation and Course Completion Ceremony 2026 — PINNACLE 2K26, on 7 November 2026 at 6:00 PM, JIT Campus. Registration closes on 20 October 2026.",
} as const;

export const GRADUATION_EVENT_PATH = `/news-events/events/${GRADUATION_EVENT.slug}`;
