import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Database, BookOpenCheck, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Library | JCMC SIIT',
  description: 'Online library access, e-journals, Knimbus mLibrary, and DELNET resources at JCMC SIIT.',
};

const onlineResources = [
  {
    title: 'Knimbus Digital Library Platform',
    category: 'e-Library & Remote Access',
    description: 'Knimbus mLibrary provides single-window remote search access to all subscribed e-books, e-journals, video lectures, and open-access research repositories. Available on web and mobile apps for continuous off-campus research.',
    accessUrl: 'https://www.knimbus.com',
    keyFeatures: [
      'Comprehensive search across subscribed journals and e-books',
      'Dedicated iOS & Android mobile application for seamless reading',
      'Personalized research bookshelves and citation tools',
      'Access to thousands of peer-reviewed engineering papers'
    ],
    status: 'Active Subscription'
  },
  {
    title: 'DELNET (Developing Library Network)',
    category: 'Inter-Library Resource Sharing',
    description: 'Institutional membership with DELNET connects JCMCSIIT with over 7,500 national and international member libraries, offering Union Catalogues of books, current serials, non-book materials, and document delivery services.',
    accessUrl: 'https://www.delnet.in',
    keyFeatures: [
      'Union Catalogue of Books with 3.5+ crore bibliographic entries',
      'Inter-Library Loan (ILL) and rapid Document Delivery Services (DDS)',
      'Union List of Current Serials & Periodicals database',
      'Database of Medical, Engineering, and Social Science e-journals'
    ],
    status: 'Institutional Member'
  },
  {
    title: 'National Digital Library of India (NDLI)',
    category: 'MHRD / National Repository',
    description: 'Developed by IIT Kharagpur, NDLI offers access to over 10 crore academic learning resources spanning multiple languages, formats, and engineering disciplines for students, faculty, and researchers.',
    accessUrl: 'https://ndl.iitkgp.ac.in',
    keyFeatures: [
      'Over 10+ crore educational contents available anytime',
      'Simulation modules, video lectures, and university question banks',
      'Single-window national repository sponsored by Ministry of Education',
      'Institutional NDLI Club activities and skill-building webinars'
    ],
    status: 'Open Institutional Access'
  }
];

export default function Page() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="container px-4 md:px-8 mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/facilities/library" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Central Library
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Database className="w-4 h-4" /> Online Library Access
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Digital Portals & <span className="text-blue-600">e-Resources</span>
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Welcome to the online library portal of John Cox Memorial CSI Institute of Technology. Access thousands of journals, books, and union catalogues through our institutional affiliations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {onlineResources.map((res, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {res.status}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{res.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{res.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{res.description}</p>
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Features</p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {res.keyFeatures.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <BookOpenCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={res.accessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                Access Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Need Off-Campus Credentials?</h4>
              <p className="text-sm text-slate-500">Contact the Central Library helpdesk to activate your remote login or inter-library loan request.</p>
            </div>
          </div>
          <Link
            href="/facilities/library"
            className="shrink-0 px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Visit Central Library Page
          </Link>
        </div>
      </div>
    </main>
  );
}
