import { DepartmentData } from '@/types/department';
import { FlaskConical, Beaker, Network } from 'lucide-react';

export function DepartmentInfrastructure({ data }: { data: DepartmentData }) {
  return (
    <section id="infrastructure" className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Infrastructure & Laboratories</h2>
          <p className="text-lg text-slate-600">State-of-the-art facilities designed to provide hands-on experience and foster research capabilities.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.labDetails && data.labDetails.length > 0 ? (
            data.labDetails.map((lab, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  {idx % 3 === 0 ? <FlaskConical /> : idx % 3 === 1 ? <Beaker /> : <Network />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{lab}</h3>
                <p className="text-slate-500 text-sm">Equipped with modern instruments and software for practical training and research projects.</p>
              </div>
            ))
          ) : data.campusFacilities && data.campusFacilities.length > 0 ? (
            data.campusFacilities.map((facility, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Network />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{facility}</h3>
                <p className="text-slate-500 text-sm">Common institutional facility available to all students.</p>
              </div>
            ))
          ) : (
             <div className="col-span-full p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center">
                <p className="text-slate-500 italic">Facilities information will be updated by the department.</p>
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
