"use client";

import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import Link from "next/link";

interface NewsTickerProps {
  items?: { title: string; href: string }[];
}

const fallbackItems = [
  { title: "ADMISSION COMMENCED FOR 2026 - B.Tech & Diploma in Engineering", href: "/news/admission-2026" },
  { title: "CONGRATULATIONS, PLACED STUDENTS", href: "/news/placed-students" },
  { title: "JOB FAIR'26 on 24th Jan 2026", href: "/news/job-fair-26" },
  { title: "We're NBA accredited. Thank you, students, staff, parents, management, and well-wishers for your support", href: "/news/nba-accredited" },
  { title: "Congratulations! POWER QUIZ WINNERS!", href: "/news/power-quiz-winners" },
  { title: "Proceedings of NCRIESR'25 has been published", href: "/news/ncriesr-25" },
  { title: "College Profile Video", href: "/about/college/profile" }
];

export function NewsTicker({ items }: NewsTickerProps) {
  const newsItems = items && items.length > 0 ? items : fallbackItems;

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-[#0B1F3A] text-white flex items-center overflow-hidden h-10 z-[60]">
      
      {/* Fixed Header/Label */}
      <div className="absolute left-0 top-0 h-full bg-[#1c4762] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest px-2.5 sm:px-4 flex items-center z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)] shrink-0">
        <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
        <span className="whitespace-nowrap">News & Events</span>
      </div>

      {/* Scrolling Content */}
      <div className="flex-1 min-w-0 flex items-center overflow-hidden w-full whitespace-nowrap pl-28 sm:pl-[160px]">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
          className="flex items-center space-x-12"
        >
          {/* Double the array for seamless infinite scroll */}
          {[...newsItems, ...newsItems].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <Link href={item.href} className="text-[13px] font-medium tracking-wide hover:text-emerald-400 transition-colors">
                {item.title}
              </Link>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
