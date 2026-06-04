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

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
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
    <div ref={containerRef} className="relative bg-white selection:bg-primary/20">
      <FloatingActionButtons />
      
      {/* Cinematic Hero */}
      <main className="-mt-20 relative h-[100dvh] min-h-[600px] w-full overflow-hidden flex flex-col items-center justify-center pt-20 pb-10 bg-[#0B1F3A]">
        
        {/* Fullscreen Parallax Background */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0 w-full h-full scale-110"
        >
          <Image 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000"
            alt="JCMCSIIT Campus"
            fill
            priority
            className="object-cover opacity-60 mix-blend-overlay"
            sizes="100vw"
            quality={90}
          />
          {/* Atmospheric Gradients for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/90 via-[#0B1F3A]/70 to-[#0B1F3A] z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-transparent z-10 mix-blend-multiply"></div>
        </motion.div>
        
        <motion.div style={{ y: yText }} className="layout-grid relative z-20 flex flex-col items-center text-center w-full mt-10">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mb-12"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[13px] font-bold text-white tracking-widest uppercase">
              Admissions 2026 Now Open
            </span>
          </motion.div>

          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.04em] mb-4 max-w-6xl text-white leading-[0.85]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="inline-block overflow-hidden pb-6">
              <motion.span variants={wordVariants} className="inline-block mr-4 md:mr-6">Forging</motion.span>
              <motion.span variants={wordVariants} className="inline-block">the</motion.span>
            </span>
            <br className="hidden md:block"/>
            <span className="inline-block overflow-hidden pb-4 -mt-8 md:-mt-16">
              <motion.span variants={wordVariants} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Future.</motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-3xl text-slate-300 max-w-4xl mb-12 leading-snug font-editorial"
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
              className="group inline-flex h-16 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 w-full sm:w-auto shadow-sm"
            >
              <span className="text-lg tracking-wide">Explore Programs</span>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Premium Stats Strip */}
      <section className="relative z-20 bg-white border-b border-slate-100 overflow-hidden">
        {/* Subtle top gradient bleed from hero */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />

        <div className="layout-grid py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 w-full">
            {[
              {
                icon: Brain,
                accent: 'from-violet-500 to-blue-500',
                iconBg: 'bg-violet-50',
                iconColor: 'text-violet-600',
                number: 'AI-First',
                label: 'Curriculum',
                desc: 'Courses enhanced with Machine Learning, AI & Data Science modules across all departments.',
              },
              {
                icon: ShieldCheck,
                accent: 'from-emerald-400 to-cyan-500',
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                number: '95%+',
                label: 'Placements',
                desc: 'Consistently high placement rates with top-tier global and national recruiters.',
              },
              {
                icon: Globe,
                accent: 'from-blue-500 to-cyan-400',
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                number: '7+',
                label: 'B.Tech Programs',
                desc: 'AICTE-approved programmes across Engineering, Technology & Applied Sciences.',
              },
              {
                icon: GraduationCap,
                accent: 'from-amber-400 to-orange-500',
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-600',
                number: '130+',
                label: 'Expert Faculty',
                desc: 'PhD holders, industry veterans, and research leaders driving academic excellence.',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col gap-4 px-8 py-10 hover:bg-slate-50/60 transition-colors duration-500 cursor-default"
              >
                {/* Top row: icon chip + number */}
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`}>
                    {stat.number}
                  </span>
                </div>

                {/* Label */}
                <div>
                  <p className="text-base font-extrabold text-slate-900 tracking-tight">{stat.label}</p>
                  <div className={`mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r ${stat.accent} group-hover:w-16 transition-all duration-500`} />
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <AICourseExplorer />
      
      <FeaturedBanner />

      <CampusLifeGrid />
      <UpcomingEvents />
      <FeaturedResearch />

      <CampusNews />

      <PlacementDashboard />
      <JitCampusGallery />
      <FeaturedLegacy />
      <FeaturedGlobal />
    </div>
  );
}
