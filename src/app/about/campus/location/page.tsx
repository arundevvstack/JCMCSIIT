import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Navigation, Train, Bus, Car, Phone, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Campus Location | JCMCSIIT',
  description: 'Campus location, address and how to reach John Cox Memorial C.S.I Institute of Technology, Kannammoola, Thiruvananthapuram.',
};

const landmarks = [
  { icon: Train, label: 'Pettah Railway Station',          distance: '3 km',  dir: 'South-West' },
  { icon: Train, label: 'Thiruvananthapuram Central Stn',  distance: '5 km',  dir: 'South'      },
  { icon: Bus,   label: 'KSRTC Central Bus Station',       distance: '5 km',  dir: 'South'      },
  { icon: Car,   label: 'Kerala Legislative Assembly',     distance: '4 km',  dir: 'South'      },
  { icon: Car,   label: 'Thiruvananthapuram Medical College', distance: '2 km', dir: 'Adjacent'  },
  { icon: Car,   label: 'Technopark Phase I',              distance: '8 km',  dir: 'West'       },
];

export default function CampusLocationPage() {
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
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 mb-6">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">Campus & Location</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-5">
            Find <span className="text-blue-600">Our Campus</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Strategically located in the heart of Thiruvananthapuram, our campus is easily accessible from all major transport hubs.
          </p>
        </div>

        {/* Address + CTA Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-4">
            {/* Address */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-bold text-slate-900">Campus Address</h2>
              </div>
              <div className="space-y-1 text-slate-600 text-sm leading-relaxed">
                <p className="font-bold text-slate-900">John Cox Memorial C.S.I</p>
                <p className="font-bold text-slate-900">Institute of Technology</p>
                <p>Kannammoola – Medical College Road,</p>
                <p>Thiruvananthapuram,</p>
                <p>Kerala – 695 011</p>
              </div>
              <a
                href="https://maps.google.com/?q=John+Cox+Memorial+CSI+Institute+of+Technology+Kannammoola+Thiruvananthapuram"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-sm py-3 px-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="font-bold text-slate-900">Contact</h2>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Director',  val: '9496981555' },
                  { label: 'Principal', val: '9496981666' },
                  { label: 'Bursar',    val: '9496981777' },
                  { label: 'Office',    val: '+91 0471 2550474' },
                  { label: '',          val: '+91 0471 2446949' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    {c.label && <span className="text-slate-400 font-semibold">{c.label}</span>}
                    <a href={`tel:${c.val.replace(/\s/g,'')}`} className="font-bold text-slate-800 hover:text-blue-600 transition-colors ml-auto">
                      {c.val}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="font-bold text-slate-900">Office Hours</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Mon – Fri</span>
                  <span className="font-bold text-slate-800">9:00 AM – 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Saturday</span>
                  <span className="font-bold text-slate-800">9:00 AM – 1:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Sunday</span>
                  <span className="font-bold text-red-500">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-slate-700">Live Map — JCMCSIIT Campus</span>
              </div>
              <a
                href="https://maps.google.com/?q=8.5068,76.9539"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Open in Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <iframe
              title="JCMCSIIT Campus Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.9484!2d76.9513!3d8.5068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05be9d6a3d1d4b%3A0x5f2c27a2d29c6a4e!2sJohn%20Cox%20Memorial%20CSI%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>

        {/* Nearby Landmarks */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full shrink-0" />
            <h2 className="font-bold text-slate-900">Nearby Landmarks & Distances</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-50">
            {landmarks.map((lm, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/60 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  <lm.icon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{lm.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{lm.dir}</p>
                </div>
                <span className="shrink-0 text-sm font-black text-blue-600">{lm.distance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Banner */}
        <div className="relative bg-[#0B1F3A] rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-white mb-2">Getting Here</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                The campus is located on the Kannammoola – Medical College Road, just 3 km from Pettah Railway Station and 5 km from Thiruvananthapuram Central. Well served by KSRTC buses, auto-rickshaws, and app-based cabs.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/about/campus/route-map"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <Navigation className="w-4 h-4" /> View Route Map
              </Link>
              <a
                href="https://maps.google.com/?q=John+Cox+Memorial+CSI+Institute+of+Technology+Kannammoola+Thiruvananthapuram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-bold px-5 py-3 rounded-2xl hover:bg-emerald-400 transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" /> Google Maps
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
