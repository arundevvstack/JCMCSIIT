"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, ShieldCheck, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { AICourseExplorer } from "@/components/home/ai-course-explorer";
import { FeaturedBanner } from "@/components/home/featured-banner";
import { CampusLifeGrid } from "@/components/home/campus-life-grid";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { FeaturedResearch } from "@/components/home/featured-research";
import { CampusNews } from "@/components/home/campus-news";
import { PlacementDashboard } from "@/components/home/placement-dashboard";
import { FeaturedLegacy } from "@/components/home/featured-legacy";
import { FeaturedGlobal } from "@/components/home/featured-global";
import { JitCampusGallery } from "@/components/home/jit-campus-gallery";
import { FloatingActionButtons } from "@/components/layout/floating-action-buttons";
import { VideoModal } from "@/components/home/video-modal";
import { DiplomaProgrammes } from "@/components/home/diploma-programmes";

const SectionAnimate = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const heroRef = useRef(null);
  // Removed parallax hooks

  // Staggered word/character animation for the hero title
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="-mt-20 relative bg-white selection:bg-primary/20">
      <FloatingActionButtons />
      
      {/* Cinematic Hero */}
      <main ref={heroRef} className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden flex flex-col items-center justify-center pt-20 pb-10 bg-slate-50">
        
        {/* Fullscreen Background */}
        <motion.div 
          className="absolute inset-0 z-0 w-full h-full scale-105"
        >
          <Image 
            src="/images/aaa.png"
            alt="JCMCSIIT Campus"
            fill
            priority
            unoptimized
            className="object-cover object-top opacity-80"
            sizes="100vw"
            quality={90}
          />
          {/* Atmospheric Gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/40 to-white/95 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-transparent z-10 mix-blend-multiply pointer-events-none"></div>
        </motion.div>
        
        {/* Seamless transition gradient at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
        
        <motion.div className="layout-grid relative z-20 flex flex-col items-center text-center w-full mt-48 lg:mt-32">


          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[8rem] font-black tracking-tight mb-4 max-w-5xl text-slate-900 leading-[1] md:leading-[0.9]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="inline-block overflow-hidden pb-4 md:pb-6">
              <motion.span variants={wordVariants} className="inline-block mr-3 sm:mr-4 md:mr-6">Forging</motion.span>
              <motion.span variants={wordVariants} className="inline-block">the</motion.span>
            </span>
            <br />
            <span className="inline-block overflow-hidden pb-4">
              <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Future.</motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-2xl text-slate-800 max-w-3xl mb-8 sm:mb-12 leading-snug font-editorial bg-white/40 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            John Cox Memorial CSI Institute of Technology. A premium academic ecosystem engineered for global innovators, researchers, and technical leaders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center"
          >
            <Link
              href="https://forms.gle/NjqqxdBqvoa9Q7WU9" target="_blank" rel="noopener noreferrer"
              className="group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-full bg-emerald-500 px-8 font-bold text-slate-900 shadow-[0_8px_40px_rgb(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_8px_40px_rgb(16,185,129,0.5)] hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="mr-2 text-sm md:text-base tracking-wide">Apply Now</span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <VideoModal />
            <Link
              href="/academics/departments"
              className="group inline-flex h-12 md:h-14 items-center justify-center rounded-full border border-slate-300 bg-white px-8 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 w-full sm:w-auto shadow-sm"
            >
              <span className="text-sm md:text-base tracking-wide">Explore Programs</span>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Diploma Programmes Showcase */}
      <SectionAnimate><DiplomaProgrammes /></SectionAnimate>
      <SectionAnimate><AICourseExplorer /></SectionAnimate>
      
      <SectionAnimate><FeaturedBanner /></SectionAnimate>

      <SectionAnimate><CampusLifeGrid /></SectionAnimate>
      <SectionAnimate><UpcomingEvents /></SectionAnimate>
      <SectionAnimate><FeaturedResearch /></SectionAnimate>

      <SectionAnimate><CampusNews /></SectionAnimate>

      <SectionAnimate><PlacementDashboard /></SectionAnimate>
      <SectionAnimate><JitCampusGallery /></SectionAnimate>
      <SectionAnimate><FeaturedLegacy /></SectionAnimate>
      <SectionAnimate><FeaturedGlobal /></SectionAnimate>
    </div>
  );
}
