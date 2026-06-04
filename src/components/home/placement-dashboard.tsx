"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Building, Award, ArrowUpRight } from "lucide-react";

const stats = [
  { label: "Placement Rate", value: "98.5%", icon: TrendingUp },
  { label: "Highest Package", value: "45 LPA", icon: Award },
  { label: "Recruiting Partners", value: "250+", icon: Building },
  { label: "Alumni Network", value: "15k+", icon: Users },
];

const companies = [
  "Microsoft", "Amazon", "Google", "TCS", "Infosys", "Wipro", "Cognizant", "IBM", "Tech Mahindra", "Oracle"
];

export function PlacementDashboard() {
  return (
    <section className="py-32 relative w-full bg-white">
      <div className="layout-grid">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-center">
          
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
                Launch Your Career at <br/>
                <span className="text-slate-400 font-medium">Global Tech Giants.</span>
              </h2>
              <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                Our dedicated Career Guidance and Placement Unit (CGPU) ensures you are industry-ready, providing exclusive access to top-tier recruiters and cutting-edge startups.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/80 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200/60 transition-all duration-300"
                >
                  <stat.icon className="h-6 w-6 text-primary/60 mb-5" />
                  <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-[13px] font-semibold tracking-wider uppercase text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full"
          >
            <div className="bg-white rounded-[2.5rem] p-10 lg:p-12 border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-shadow duration-500">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  Top Recruiters 2026
                </h3>
                <button className="text-sm font-semibold text-primary flex items-center hover:text-slate-900 transition-colors group/btn">
                  View Full Report <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {companies.map((company, i) => (
                  <motion.div
                    key={company}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-100/80 text-[14px] font-semibold text-slate-600 hover:bg-white hover:border-slate-200 hover:text-slate-900 hover:shadow-sm transition-all cursor-default"
                  >
                    {company}
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-8 rounded-3xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Average Package</p>
                  <p className="text-4xl font-bold text-slate-900">8.5 <span className="text-2xl text-slate-400">LPA</span></p>
                </div>
                <div className="hidden sm:block h-16 w-px bg-slate-200"></div>
                <div className="w-full sm:w-auto h-px sm:hidden bg-slate-200"></div>
                <div className="sm:text-right">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Offers Made</p>
                  <p className="text-4xl font-bold text-primary">450+</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
