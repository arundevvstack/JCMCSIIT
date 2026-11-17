import { DepartmentData } from '@/types/department';
import { Lightbulb, Trophy, CalendarDays, Download, MapPin, Mail, Phone, ExternalLink, Sparkles, Flag } from 'lucide-react';
import Image from 'next/image';

export function DepartmentStudentLife({ data }: { data: DepartmentData }) {
  const hasClubs = Boolean(data.association || (data.studentClubs && data.studentClubs.length > 0));
  const hasAchievements = Boolean(data.achievements && data.achievements.length > 0);

  return (
    <section id="student-life" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-12">Student Life & Department Activities</h2>

        {/* Association & Tech Fest (e.g. EEETA & URJA in EEE, Civil Association in CE) */}
        {data.associationDetails && data.associationDetails.length > 0 && (
          <div className="mb-16">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Flag className="w-3.5 h-3.5" />
                Department Association
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Student Technical Association</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.associationDetails.map((assoc, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
                  <div>
                    {assoc.logo && (
                      <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden mb-6 bg-slate-50 border border-slate-100 p-2">
                        <Image
                          src={assoc.logo}
                          alt={assoc.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{assoc.name}</h4>
                    {assoc.title && <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-3">{assoc.title}</p>}
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{assoc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Annual Tech Fest (e.g. URJA in EEE) */}
        {data.festivals && data.festivals.length > 0 && (
          <div className="mb-16">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Annual Tech Fest
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Flagship Technical Events</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.festivals.map((fest, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
                  <div>
                    {fest.logo && (
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-slate-800">
                        <Image
                          src={fest.logo}
                          alt={fest.name}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{fest.name}</h4>
                    {fest.title && <p className="text-xs uppercase tracking-wider font-semibold text-violet-700 mb-3">{fest.title}</p>}
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{fest.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Events & Workshops Cards (with posters & photos) */}
        {data.eventDetails && data.eventDetails.length > 0 && (
          <div className="mb-16">
            <div className="max-w-3xl mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Events & Workshops</h3>
              <p className="text-slate-600 text-sm">Key academic seminars, awareness drives, and skill development workshops conducted by the department.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.eventDetails.map((event, idx) => (
                <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    {event.images && event.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {event.images.map((img, imgi) => (
                          <div key={imgi} className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                            <Image
                              src={img}
                              alt={`${event.title} - ${imgi + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {event.date && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {event.date}
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{event.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{event.description}</p>
                    {event.organizedBy && (
                      <div className="border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
                        <span className="font-bold text-slate-700">Organized by:</span> {event.organizedBy}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard 3-column Grid if clubs or achievements exist */}
        {(hasClubs || hasAchievements || (!data.eventDetails && data.events && data.events.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Clubs */}
            {hasClubs && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <Lightbulb className="w-8 h-8 text-yellow-500 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">Clubs & Association</h3>
                {data.association && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-semibold text-sm rounded-lg mb-2">
                      {data.association}
                    </span>
                  </div>
                )}
                {data.studentClubs && data.studentClubs.length > 0 && (
                  <ul className="space-y-2">
                    {data.studentClubs.map((club, idx) => (
                      <li key={idx} className="text-slate-600 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-slate-300 before:rounded-full before:mr-2">
                        {club}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Achievements */}
            {hasAchievements && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <Trophy className="w-8 h-8 text-orange-500 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">Achievements</h3>
                <ul className="space-y-3">
                  {data.achievements?.map((achievement, idx) => (
                    <li key={idx} className="text-slate-600 flex items-start">
                      <span className="text-orange-500 mr-2">★</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Basic Events List if no detailed events */}
            {!data.eventDetails && data.events && data.events.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <CalendarDays className="w-8 h-8 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">Events & Workshops</h3>
                <ul className="space-y-3">
                  {data.events.map((event, idx) => (
                    <li key={idx} className="text-slate-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Contact and Downloads & Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-bold mb-6">Contact Department</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-primary mr-4 shrink-0" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Email</p>
                  <a href={`mailto:${data.contactDetails.email}`} className="text-lg hover:text-primary transition-colors">{data.contactDetails.email}</a>
                </div>
              </div>
              {data.contactDetails.phone && (
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary mr-4 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Phone</p>
                    <a href={`tel:${data.contactDetails.phone}`} className="text-lg hover:text-primary transition-colors">{data.contactDetails.phone}</a>
                  </div>
                </div>
              )}
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary mr-4 shrink-0" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Location</p>
                  <p className="text-lg">{data.contactDetails.location}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Downloads & Resources</h3>
            {data.downloadLinks && data.downloadLinks.length > 0 ? (
              <div className="space-y-4">
                {data.downloadLinks.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary hover:bg-primary/5 text-left transition-colors group"
                  >
                    <span className="font-semibold text-slate-700 group-hover:text-primary">{item.label}</span>
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                  </a>
                ))}
              </div>
            ) : data.downloads && data.downloads.length > 0 ? (
              <div className="space-y-4">
                {data.downloads.map((download, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary hover:bg-primary/5 text-left transition-colors group">
                    <span className="font-semibold text-slate-700 group-hover:text-primary">{download}</span>
                    <Download className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No downloads available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
