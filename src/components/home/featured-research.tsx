"use client";

import { motion } from "framer-motion";
import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedResearch() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row overflow-hidden rounded-[2.5rem] bg-[#1c4762] shadow-2xl">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 p-12 md:p-16 flex flex-col justify-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Innovation Labs
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Pioneering the next era of <span className="italic font-editorial text-white/90">computation.</span>
              </h2>
              <p className="text-white/80 text-lg md:text-xl font-editorial leading-relaxed mb-10 max-w-lg">
                Our newly established Quantum Computing and AI research centers are pushing the boundaries of what is possible, collaborating directly with global tech giants.
              </p>
              
              <Link
                href="/research"
                className="group inline-flex items-center text-white font-bold text-lg hover:text-white/80 transition-colors"
              >
                Discover our research initiatives
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full">
            <ParallaxImage
              src="/campus/featured_research.png"
              alt="Quantum Computing Research Lab"
              fill
              imageClassName=""
              sizes="(max-width: 1024px) 100vw, 50vw"
              offset={15}
            />
            {/* Soft gradient overlay to blend edge if needed */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1c4762] to-transparent hidden lg:block"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
