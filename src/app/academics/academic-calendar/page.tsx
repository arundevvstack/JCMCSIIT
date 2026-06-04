import { Metadata } from 'next';
import { ArrowLeft, CalendarDays, Download, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Academic Calendar | JCMCSIIT',
  description: 'Academic Calendar for 2026-2027 at John Cox Memorial C.S.I Institute of Technology.',
};

export default function AcademicCalendarPage() {
  const calendars = [
    { semester: 'Semester 2', id: 's2', url: '' },
    { semester: 'Semester 3', id: 's3', url: '' },
    { semester: 'Semester 5', id: 's5', url: '' },
    { semester: 'Semester 7', id: 's7', url: '' },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-6">
          <Link href="/academics" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Academics
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Academic <span className="text-blue-600">Calendar</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Stay up to date with the schedule of classes, examinations, and holidays for the <strong>2026-2027</strong> academic year.
          </p>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
            
            <div className="flex items-center mb-8 pb-4 border-b border-slate-100">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-slate-900">2026-2027 Calendars</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calendars.map((cal) => (
                <div key={cal.id} className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col">
                  
                  <div className="p-6 flex items-start justify-between">
                    <div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg mb-3 inline-block">
                        2026-2027
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        Academic Calendar
                      </h3>
                      <p className="text-slate-500 font-medium mt-1">{cal.semester}</p>
                    </div>
                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-300 group-hover:text-primary transition-colors">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-auto bg-white px-6 py-4 flex gap-3 border-t border-slate-100">
                    {cal.url ? (
                      <>
                        <a 
                          href={cal.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
                        >
                          <Eye className="w-4 h-4 shrink-0" /> Preview
                        </a>
                        <a 
                          href={cal.url}
                          download
                          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
                        >
                          <Download className="w-4 h-4 shrink-0" /> Download
                        </a>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-400 py-2.5 px-4 rounded-xl text-sm font-semibold cursor-not-allowed border border-slate-100">
                        <FileText className="w-4 h-4 shrink-0" /> Document Pending
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* Admission Contact Footer */}
            <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 shrink-0"></span>
                Admission & Enquiries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-blue-800">
                  <span className="font-semibold block mb-1">Direct Contacts:</span>
                  <ul className="space-y-1 text-slate-600">
                    <li>Director: <strong>9496981555</strong></li>
                    <li>Principal: <strong>9496981666</strong></li>
                    <li>Bursar: <strong>9496981777</strong></li>
                  </ul>
                </div>
                <div className="text-blue-800">
                  <span className="font-semibold block mb-1">Office Numbers:</span>
                  <p className="text-slate-600 font-medium">
                    +91 0471 2550474<br />
                    +91 0471 2446949
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
