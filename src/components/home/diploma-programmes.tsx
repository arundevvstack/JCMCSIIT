"use client";

import { motion } from "framer-motion";
import { Building2, Laptop, Cpu, Zap, Cog, ArrowRight, Clock, Award } from "lucide-react";
import Link from "next/link";

const diplomaCourses = [
  {
    title: "Civil",
    description: "Design, planning and construction of buildings, roads, bridges and infrastructure with strong practical exposure.",
    icon: Building2,
    gradient: "from-emerald-400 to-teal-500",
    bgLight: "bg-emerald-50",
    iconColor: "text-emerald-600",
    link: "/academics/departments/diploma-civil-engineering",
  },
  {
    title: "Computer",
    description: "Programming, software development, networking, cloud computing and AI fundamentals with modern computer laboratories.",
    icon: Laptop,
    gradient: "from-blue-500 to-cyan-400",
    bgLight: "bg-blue-50",
    iconColor: "text-blue-600",
    link: "/academics/departments/diploma-computer-engineering",
  },
  {
    title: "Electronics & Communication",
    description: "Embedded systems, communication technologies, IoT, microcontrollers and digital electronics.",
    icon: Cpu,
    gradient: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
    iconColor: "text-violet-600",
    link: "/academics/departments/diploma-electronics-communication",
  },
  {
    title: "Electrical",
    description: "Electrical machines, power systems, renewable energy, industrial automation and electrical installations.",
    icon: Zap,
    gradient: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-50",
    iconColor: "text-amber-600",
    link: "/academics/departments/diploma-electrical-engineering",
  },
  {
    title: "Mechanical",
    description: "Manufacturing, CAD/CAM, machine design, thermal engineering and industrial production technologies.",
    icon: Cog,
    gradient: "from-rose-400 to-red-500",
    bgLight: "bg-rose-50",
    iconColor: "text-rose-600",
    link: "/academics/departments/diploma-mechanical-engineering",
  },
];

export function DiplomaProgrammes() {
  return (
    <section className="relative z-20 bg-white py-24 overflow-hidden border-b border-slate-100">
      {/* Subtle top gradient bleed from hero */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            Diploma Programs
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-600"
          >
            AICTE-approved diploma courses designed to build practical engineering skills, innovation, and career readiness.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {diplomaCourses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col h-full bg-white border border-slate-200 rounded-[20px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 flex-grow flex flex-col">
                <div className={`w-14 h-14 rounded-full ${course.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <course.icon className={`w-7 h-7 ${course.iconColor}`} aria-hidden="true" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3">
                  {course.title}
                </h3>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                  {course.description}
                </p>

                <div className="w-full h-px bg-slate-100 mb-5" />

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-xs font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    Duration: 3 Years
                  </div>
                  <div className="flex items-center text-xs font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Award className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    Eligibility: SSLC / 10th Pass
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 mt-auto">
                <Link
                  href={course.link}
                  className="group/btn relative flex w-full h-12 items-center justify-center overflow-hidden rounded-xl bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:outline-none"
                  aria-label={`Learn more about ${course.title}`}
                >
                  <span className="relative z-10 flex items-center">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
