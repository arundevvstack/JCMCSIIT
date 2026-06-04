import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bus, MapPin, Navigation, Phone, ShieldCheck, Map } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transportation | JCMCSIIT',
  description: 'College bus routes, transport facilities, and GPS tracking at JCMCSIIT.',
};

const busRoutes = [
  {
    id: 1,
    name: 'Route 1: Kattakkada',
    color: 'emerald',
    stops: [
      'Kattakkada', 'Anthiyurkonam', 'Meppukkada', 'Malayinkeezhu', 'Peyad', 
      'Valiyavila', 'Thirumala', 'Vettamukku', 'Maruthamkuzhy', 'Sasthamangalam', 
      'Peroorkkada', 'Civil Station', 'Mannanthala', 'Nalanchira', 'Kesavadasapuram', 
      'Pattom', 'Kumarapuram'
    ]
  },
  {
    id: 2,
    name: 'Route 2: Amaravila / Vizhinjam',
    color: 'blue',
    stops: [
      'Amaravila', 'Neyyattinkara', 'Vlangamuri', 'Olathanni', 'Pattiyakkala', 
      'Arumanoor', 'Paraniyam', 'Kanjiramkulam', 'Nellimood', 'Uchakkada', 
      'Chavadinada', 'Peringammala', 'Mukkola', 'Venganoor', 'Vizhinjam', 
      'Kovalam', 'Vazhamuttom', 'Pachalloor', 'Thiruvallam', 'Chakka', 
      'Pettah', 'Pallimukku'
    ]
  },
  {
    id: 3,
    name: 'Route 3: Karakonam',
    color: 'violet',
    stops: [
      'Karakonam', 'Kunnathukal', 'Manivila', 'Parasuvakkal', 'Udiyankulangara', 
      'Amaravila', 'Neyyattinkara', 'Vazhimukku', 'Balaramapuram', 'Vedivachankovil', 
      'Pravachambalam', 'Nemom', 'Pappanamcode', 'Karamana', 'Killippalam', 
      'Vazhuthakkad', 'Chittazha'
    ]
  }
];

export default function TransportationPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-slate-50 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="container max-w-screen-xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/facilities" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Facilities
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 mb-6 shadow-sm">
            <Bus className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Campus Transport</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
            Safe & Reliable <span className="text-emerald-600">Commute</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            The college operates a dedicated fleet of buses ensuring safe, comfortable, and timely transportation for students and staff from across the city and neighboring towns.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              <Map className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Extensive Network</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Covering major routes across Thiruvananthapuram and outskirts, ensuring accessibility for day scholars.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Safety First</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Experienced drivers, regular vehicle maintenance, and strict adherence to road safety protocols.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-6">
              <Navigation className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">GPS Tracking</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Real-time bus tracking system allowing parents and students to monitor bus locations for convenience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Routes Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Bus Routes & Stops</h2>
            </div>

            <div className="space-y-4">
              {busRoutes.map((route) => (
                <div key={route.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group">
                  <div className={`flex items-center justify-between p-6 bg-${route.color}-50/50 border-b border-${route.color}-100`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-${route.color}-100 flex items-center justify-center`}>
                        <Bus className={`w-5 h-5 text-${route.color}-600`} />
                      </div>
                      <h3 className={`font-bold text-${route.color}-900 text-lg`}>{route.name}</h3>
                    </div>
                    <span className={`px-3 py-1 bg-${route.color}-100 text-${route.color}-700 text-xs font-bold rounded-lg`}>
                      {route.stops.length} Stops
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {route.stops.map((stop, i) => (
                        <div key={i} className="flex items-center">
                          <span className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            {stop}
                          </span>
                          {i < route.stops.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-slate-300 mx-1.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* GPS Tracking Card */}
            <div className="bg-[#0B1F3A] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Navigation className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Live Tracking</h3>
                  <p className="text-white/60 text-sm">Monitor via GPS System</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <a href="/general/KL01AW7764" target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <Bus className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                    <span className="font-bold text-white tracking-wider">KL 01 AW 7764</span>
                  </div>
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </a>
                
                <a href="/general/5717 ashok leyland pricol.pdf" target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <Bus className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                    <span className="font-bold text-white tracking-wider">KL 01 BU 5717</span>
                  </div>
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </a>
              </div>
            </div>

            {/* Coordinator Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" /> Transport Coordinator
              </h3>
              
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center">
                  <span className="text-xl font-black text-slate-400">SJ</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Mr. Sanjit J</p>
                  <p className="text-sm font-medium text-emerald-600 mb-1">Transport In-Charge</p>
                  <p className="text-xs text-slate-500">Assistant Professor, ME</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed">
                  For queries related to bus routes, timings, boarding passes, or any transport-related assistance, please contact the coordinator during office hours.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
