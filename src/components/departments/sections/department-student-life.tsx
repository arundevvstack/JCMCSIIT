import { DepartmentData } from '@/types/department';
import { Lightbulb, Trophy, CalendarDays, Download, MapPin, Mail, Phone } from 'lucide-react';

export function DepartmentStudentLife({ data }: { data: DepartmentData }) {
  return (
    <section id="student-life" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-12">Student Life & Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Clubs */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <Lightbulb className="w-8 h-8 text-yellow-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-4">Clubs & Association</h3>
            {data.association || (data.studentClubs && data.studentClubs.length > 0) ? (
              <>
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
              </>
            ) : (
              <p className="text-slate-500 italic text-sm">Clubs & Association information will be updated by the department.</p>
            )}
          </div>
          
          {/* Achievements */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <Trophy className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-4">Achievements</h3>
            {data.achievements && data.achievements.length > 0 ? (
              <ul className="space-y-3">
                {data.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-slate-600 flex items-start">
                    <span className="text-orange-500 mr-2">★</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic text-sm">Achievements will be updated by the department.</p>
            )}
          </div>
          
          {/* Events */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <CalendarDays className="w-8 h-8 text-blue-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-4">Events & Workshops</h3>
            {data.events && data.events.length > 0 ? (
              <ul className="space-y-3">
                {data.events.map((event, idx) => (
                  <li key={idx} className="text-slate-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {event}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic text-sm">Events & Workshops will be updated by the department.</p>
            )}
          </div>
        </div>

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
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-primary mr-4 shrink-0" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Phone</p>
                  <a href={`tel:${data.contactDetails.phone}`} className="text-lg hover:text-primary transition-colors">{data.contactDetails.phone}</a>
                </div>
              </div>
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
            {data.downloads && data.downloads.length > 0 ? (
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
