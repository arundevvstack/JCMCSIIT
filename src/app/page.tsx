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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
        
        {/* Fullscreen Parallax Background */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0 w-full h-full scale-125"
        >
          <Image 
            src="/images/aaa.png"
            alt="JCMCSIIT Campus"
            fill
            priority
            className="object-cover object-top opacity-80"
            sizes="100vw"
            quality={90}
          />
          {/* Atmospheric Gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/90 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/10 to-transparent z-10 mix-blend-multiply pointer-events-none"></div>
        </motion.div>
        
        {/* Seamless transition gradient at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
        
        <motion.div style={{ y: yText }} className="layout-grid relative z-20 flex flex-col items-center text-center w-full mt-10">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/5 backdrop-blur-md border border-slate-200 shadow-sm mb-12"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[13px] font-bold text-slate-800 tracking-widest uppercase">
              Admissions 2026 Now Open
            </span>
          </motion.div>

          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.04em] mb-4 max-w-6xl text-slate-900 leading-[0.85]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="inline-block overflow-hidden pb-6">
              <motion.span variants={wordVariants} className="inline-block mr-4 md:mr-6">Forging</motion.span>
              <motion.span variants={wordVariants} className="inline-block">the</motion.span>
            </span>
            <br className="hidden md:block"/>
            <span className="inline-block overflow-hidden pb-4 -mt-8 md:-mt-16">
              <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Future.</motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-3xl text-slate-800 max-w-4xl mb-12 leading-snug font-editorial bg-white/40 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            John Cox Memorial CSI Institute of Technology. A premium academic ecosystem engineered for global innovators, researchers, and technical leaders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center"
          >
            <Link
              href="/admissions"
              className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-emerald-500 px-10 font-bold text-slate-900 shadow-[0_8px_40px_rgb(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_8px_40px_rgb(16,185,129,0.5)] hover:-translate-y-1 w-full sm:w-auto"
            >
              <span className="mr-2 text-lg tracking-wide">Apply Now</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <VideoModal />
            <Link
              href="/academics/departments"
              className="group inline-flex h-16 items-center justify-center rounded-full border border-slate-300 bg-white px-10 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 w-full sm:w-auto shadow-sm"
            >
              <span className="text-lg tracking-wide">Explore Programs</span>
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
