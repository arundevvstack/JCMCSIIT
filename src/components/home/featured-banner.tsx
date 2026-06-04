"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { ParallaxImage } from "@/components/ui/parallax-image";

export function FeaturedBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-white overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2 flex flex-col z-10"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Global Excellence
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Engineer the <br />
              <span className="italic font-editorial text-[#1c4762]">extraordinary.</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-600 font-editorial leading-relaxed mb-12 max-w-lg"
            >
              Join a community of visionaries, builders, and leaders. Admissions for the 2026 academic year are now open.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/admissions"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-[#1c4762] px-8 font-bold text-white transition-all hover:bg-[#102e41] shadow-[0_8px_20px_rgb(28,71,98,0.2)]"
              >
                <span className="mr-3 tracking-wide">Start Your Application</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about/campus-overview/tour"
                className="group inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white px-8 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              >
                <Play className="h-4 w-4 mr-2 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="tracking-wide">Watch Profile Video</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image Grid / Collage */}
          <div className="w-full lg:w-1/2 relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
            
            {/* Abstract Background Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-slate-100 to-emerald-50 rounded-full blur-3xl opacity-50 z-0"></div>

            {/* Image 1 (Top Left) */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="absolute top-[5%] left-[5%] w-[45%] h-[40%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10"
            >
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" 
                alt="Students collaborating" 
                fill 
                offset={15}
              />
            </motion.div>

            {/* Image 2 (Top Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 4 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="absolute top-[15%] right-[5%] w-[40%] h-[35%] rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20"
            >
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" 
                alt="Tech laboratory" 
                fill 
                offset={10}
              />
            </motion.div>

            {/* Image 3 (Bottom Center - Main) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0, rotate: -1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="absolute bottom-[5%] left-[15%] w-[65%] h-[50%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-30"
            >
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200" 
                alt="Campus Architecture" 
                fill 
                offset={20}
              />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
