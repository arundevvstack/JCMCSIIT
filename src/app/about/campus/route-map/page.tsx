import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Navigation, Train, Bus, Car, Plane, MapPin, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Route Map | JCMCSIIT',
  description: 'How to reach John Cox Memorial C.S.I Institute of Technology, Kannammoola, Thiruvananthapuram — by road, rail, and air.',
};

const routes = [
  {
    icon: Train,
    color: 'blue',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    mode: 'By Train',
    steps: [
      'Arrive at Thiruvananthapuram Central (TVC) or Pettah Railway Station.',
      'From Central Station — take an auto-rickshaw / app cab (~5 km, 15–20 min).',
      'From Pettah Station — take an auto-rickshaw (~3 km, 10 min).',
      'Ask the driver to go to "JIT College, Kannammoola Medical College Road".',
    ],
  },
  {
    icon: Bus,
    color: 'emerald',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    mode: 'By Bus',
    steps: [
      'Board any KSRTC bus toward Kannammoola or Medical College from Central Bus Station.',
      'Alight at the Kannammoola Bus Stop.',
      'The college is a 2-minute walk from the stop along Medical College Road.',
      'City buses 7E, 2C, and 28 pass near the campus.',
    ],
  },
  {
    icon: Car,
    color: 'violet',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    mode: 'By Car / Cab',
    steps: [
      'From Thiruvananthapuram City Centre — take MC Road toward Medical College.',
      'Continue on Kannammoola – Medical College Road.',
      'The main gate of JCMCSIIT will be visible on your right.',
      'Parking is available inside the campus premises.',
    ],
  },
  {
    icon: Plane,
    color: 'amber',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    mode: 'By Air',
    steps: [
      'Fly into Trivandrum International Airport (TRV).',
      'The airport is approximately 8 km from the campus.',
      'Take a prepaid taxi or app-based cab to the campus (~20–25 min).',
      'Tell the driver: "JIT Engineering College, Kannammoola".',
    ],
  },
];

export default function RouteMapPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50">
      <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8">

        {/* Back */}
        <div className="mb-8">
          <Link href="/about" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to About
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">Route Map</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-5">
            How to <span className="text-blue-600">Reach Us</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            JCMCSIIT is centrally located in Thiruvananthapuram, well-connected by road, rail, and air from across Kerala and beyond.
          </p>
        </div>

        {/* Quick Distance Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Pettah Railway Stn',    dist: '3 km'  },
            { label: 'TVC Central Station',   dist: '5 km'  },
            { label: 'Medical College',        dist: '2 km'  },
            { label: 'Airport (TRV)',          dist: '8 km'  },
          ].map((d, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
              <p className="text-3xl font-black text-blue-600 mb-1">{d.dist}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{d.label}</p>
            </div>
          ))}
        </div>

        {/* Map Embed */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-700">Interactive Route Map</span>
            </div>
            <a
              href="https://maps.google.com/?q=John+Cox+Memorial+CSI+Institute+of+Technology+Kannammoola+Thiruvananthapuram"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Open in Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <iframe
            title="JCMCSIIT Route Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.9484!2d76.9513!3d8.5068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05be9d6a3d1d4b%3A0x5f2c27a2d29c6a4e!2sJohn%20Cox%20Memorial%20CSI%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {routes.map((r, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className={`flex items-center gap-3 px-6 py-5 border-b border-slate-100`}>
                <div className={`w-10 h-10 rounded-2xl ${r.iconBg} flex items-center justify-center shrink-0`}>
                  <r.icon className={`w-5 h-5 ${r.iconColor}`} />
                </div>
                <h2 className="font-bold text-slate-900">{r.mode}</h2>
              </div>
              <ol className="px-6 py-5 space-y-3">
                {r.steps.map((step, si) => (
                  <li key={si} className="flex items-start gap-3">
                    <span className={`shrink-0 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center border ${r.badge} mt-0.5`}>
                      {si + 1}
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Footer Banner */}
        <div className="relative bg-[#0B1F3A] rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-black text-white">Our Campus Address</h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                John Cox Memorial C.S.I Institute of Technology<br />
                Kannammoola – Medical College Road,<br />
                Thiruvananthapuram, Kerala – 695 011
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/about/campus/location"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <MapPin className="w-4 h-4" /> Campus Overview
              </Link>
              <a
                href="https://maps.google.com/?q=John+Cox+Memorial+CSI+Institute+of+Technology+Kannammoola+Thiruvananthapuram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-emerald-400 transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
