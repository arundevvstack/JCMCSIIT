"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, ArrowRight, Microchip, Cpu, Code2, HeartPulse, Building2, Wrench, Zap } from "lucide-react";
import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";

const courses = [
  { id: "aiml", name: "Artificial Intelligence & ML", icon: Microchip, tags: ["AI", "Data", "Algorithms"], image: "/courses/aiml_course_1779729860073.png" },
  { id: "biomedical-robotic", name: "Biomedical & Robotic Engg", icon: HeartPulse, tags: ["Healthcare", "Robotics", "Biology"], image: "/courses/bmre_course_1779729888838.png" },
  { id: "civil", name: "Civil Engineering", icon: Building2, tags: ["Infrastructure", "Construction", "Smart Cities"], image: "/courses/ce_course_1779729938816.png" },
  { id: "cse", name: "Computer Science & Engg", icon: Code2, tags: ["Software", "Web", "Cloud"], image: "/courses/cse_course_1779729874773.png" },
  { id: "ece", name: "Electronics & Communication", icon: Cpu, tags: ["Circuits", "IoT", "Signals"], image: "/courses/ece_course_1779729905116.png" },
  { id: "eee", name: "Electrical & Electronics Engg", icon: Zap, tags: ["Power Systems", "Energy", "Smart Grid"], image: "/courses/eee_course_1779729928372.png" },
  { id: "mechanical", name: "Mechanical Engineering", icon: Wrench, tags: ["Design", "Machines", "Automotive"], image: "/courses/me_course_1779729919795.png" }
];

export function AICourseExplorer() {
  const [query, setQuery] = useState("");

  const filteredCourses = query.length > 0
    ? courses.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : courses;

  return (
    <section className="py-32 relative w-full overflow-hidden bg-slate-50/30 border-y border-slate-100">
      <div className="layout-grid relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/60 shadow-sm mb-6 text-slate-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-600">Intelligence Engine</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Programs Offered.
          </h2>
          <p className="text-slate-500 max-w-2xl text-lg md:text-xl font-editorial leading-relaxed">
            Explore our B.Tech engineering disciplines or use our intelligence engine to find your perfect match.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-20">
          <div className="relative group shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="relative flex items-center bg-white rounded-2xl p-2 pl-6 border border-slate-200/60 transition-colors focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5">
              <Search className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="e.g. I want to build medical robots or design AI systems..."
                className="w-full bg-transparent border-none outline-none text-base md:text-lg p-3 text-slate-900 placeholder:text-slate-400 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold transition-all ml-2 flex items-center gap-2 shrink-0 shadow-md">
                Search <ArrowRight className="h-4 w-4 hidden sm:block" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <AnimatePresence>
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/courses/${course.id}`} className="block h-full outline-none">
                  <div className="bg-white h-full rounded-[2rem] border border-slate-200/60 hover:border-slate-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col relative overflow-hidden">
                    
                    {/* Fixed Top Image */}
                    <div className="relative w-full h-56 overflow-hidden bg-slate-100">
                      <ParallaxImage 
                        src={course.image}
                        alt={course.name}
                        fill
                        imageClassName="group-hover:scale-110 transition-transform duration-1000"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        offset={8}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                      
                      {/* Icon overlay on image */}
                      <div className="absolute bottom-4 left-6 h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                        <course.icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10 flex flex-col flex-1 p-6">
                      <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors duration-500">{course.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {course.tags.map(tag => (
                          <span key={tag} className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-slate-50 text-slate-500 border border-slate-100 transition-colors duration-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
