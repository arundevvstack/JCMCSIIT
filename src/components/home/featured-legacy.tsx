"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

export function FeaturedLegacy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative w-full py-32 bg-slate-900 overflow-hidden">
      
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 scale-125 origin-center">
        <Image
          src="/campus/featured_legacy.png"
          alt="JCMCSIIT Library and Legacy"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-[#1c4762]/30 mix-blend-multiply"></div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as any }}
          className="max-w-4xl flex flex-col items-center"
        >
          <div className="w-16 h-1 bg-primary mb-8 rounded-full"></div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            A legacy of excellence, a network that spans the globe.
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-300 font-editorial leading-relaxed mb-12 max-w-3xl">
            JCMCSIIT alumni are leading Fortune 500 companies, pioneering groundbreaking research, and shaping the future of technology worldwide.
          </p>
          
          <Link
            href="/campus-life/alumni"
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-transparent border border-white/40 px-10 font-bold text-white transition-all hover:bg-white hover:text-[#1c4762] hover:border-white shadow-sm hover:shadow-lg"
          >
            <span className="text-lg tracking-wide mr-2">Join the Alumni Network</span>
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
