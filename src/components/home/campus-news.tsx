"use client";

import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";
import { motion } from "framer-motion";

const newsItems = [
  {
    id: 1,
    title: "JCMCSIIT Secures Major DST Grant for AI Healthcare Research",
    category: "RESEARCH & INNOVATION",
    image: "/courses/aiml_course_1779729860073.png",
    isLarge: true,
  },
  {
    id: 2,
    title: "NBA Accreditation Awarded to ECE Department",
    category: "ACADEMICS",
    image: "/courses/ece_course_1779729905116.png",
    isLarge: false,
  },
  {
    id: 3,
    title: "Microsoft Innovation Lab Inaugurated on Campus",
    category: "CAMPUS LIFE",
    image: "/courses/cse_course_1779729874773.png",
    isLarge: false,
  },
  {
    id: 4,
    title: "Global Tech Symposium 2026 Announced",
    category: "EVENTS",
    image: "https://www.jcmcsiit.ac.in/img/01.jpg",
    isLarge: false,
  },
  {
    id: 5,
    title: "95% Placement Record Achieved for 2026 Batch",
    category: "PLACEMENTS",
    image: "https://www.jcmcsiit.ac.in/img/02.jpg",
    isLarge: false,
  },
  {
    id: 6,
    title: "Robotics Lab Unveils New Automated Manufacturing System",
    category: "SCIENCE & ENGINEERING",
    image: "/courses/bmre_course_1779729888838.png",
    isLarge: true,
  },
];

export function CampusNews() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Campus News
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-editorial">
            Stories about people, research, and innovation across JCMCSIIT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Top Row */}
          <NewsCard item={newsItems[0]} className="md:col-span-2" />
          <NewsCard item={newsItems[1]} />
          <NewsCard item={newsItems[2]} />

          {/* Bottom Row */}
          <NewsCard item={newsItems[3]} />
          <NewsCard item={newsItems[4]} />
          <NewsCard item={newsItems[6] || newsItems[5]} className="md:col-span-2" />
        </div>

        <div className="flex justify-center">
          <Link
            href="/news-events/news"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#1c4762] text-white font-semibold rounded-md hover:bg-[#102e41] transition-colors duration-300"
          >
            More campus news
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsCard({ item, className = "" }: { item: any; className?: string }) {
  if (item.isLarge) {
    return (
      <Link href={`/news/${item.id}`} className={`group relative overflow-hidden bg-slate-900 min-h-[350px] shadow-sm hover:shadow-md transition-shadow ${className}`}>
        <ParallaxImage
          src={item.image}
          alt={item.title}
          fill
          imageClassName="opacity-80 group-hover:scale-110 transition-transform duration-700"
          offset={10}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
          <span className="text-xs font-bold uppercase tracking-wider text-white/90 mb-2 block">
            {item.category}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-white/90 transition-colors line-clamp-2">
            {item.title}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${item.id}`} className={`group flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow h-full ${className}`}>
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <ParallaxImage
          src={item.image}
          alt={item.title}
          fill
          imageClassName="group-hover:scale-110 transition-transform duration-700"
          offset={8}
        />
      </div>
      <div className="p-6 flex flex-col flex-1 border border-t-0 border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-[#1c4762] mb-3 block">
          {item.category}
        </span>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1c4762] transition-colors leading-snug line-clamp-3">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}
