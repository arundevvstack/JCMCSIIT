import { DepartmentData } from '@/types/department';
import { motion } from 'framer-motion';

export function DepartmentHero({ data }: { data: DepartmentData }) {
  return (
    <section id="overview" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50 -z-10"></div>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
              {data.programme}
            </div>
            {data.duration && (
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200">
                Duration: {data.duration}
              </div>
            )}
            {data.eligibility && (
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200">
                Eligibility: {data.eligibility}
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            {data.name}
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
            {data.shortDescription}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
