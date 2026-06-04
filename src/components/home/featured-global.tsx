"use client";

import { motion } from "framer-motion";
import { Globe, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ParallaxImage } from "@/components/ui/parallax-image";

export function FeaturedGlobal() {
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
    <section className="relative w-full py-24 md:py-32 bg-[#0B1F3A] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
          
          {/* Right Text Content (Reversed) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="w-full lg:w-1/2 flex flex-col z-10"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-8">
                <Globe className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                International Relations
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Global Perspectives. <br />
              <span className="italic font-editorial text-emerald-400">Local Impact.</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-300 font-editorial leading-relaxed mb-12 max-w-lg"
            >
              Partnered with over 50+ international universities across 15 countries. Experience world-class education with our robust student exchange and dual-degree programs.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/academics/international"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-emerald-500 px-8 font-bold text-slate-900 transition-all hover:bg-emerald-400 shadow-[0_8px_20px_rgb(52,211,153,0.2)]"
              >
                <span className="mr-3 tracking-wide">Explore Global Programs</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-3xl font-black text-white mb-1">50+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Global Tie-ups</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white mb-1">15</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400 mb-1">100%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Funding Assistance</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Left Image Component */}
          <div className="w-full lg:w-1/2 relative h-[500px] md:h-[650px] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl z-10"
            >
              <ParallaxImage 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" 
                alt="Students studying abroad" 
                fill 
                offset={15}
              />
              <div className="absolute inset-0 bg-[#0B1F3A]/20 mix-blend-multiply pointer-events-none"></div>
            </motion.div>
            
            {/* Decorative abstract shape behind image */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl z-0"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
