"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Image as ImageIcon, CreditCard, UserPlus, Users, Sparkles } from "lucide-react";

export function FloatingActionButtons() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const buttons = [
    {
      id: "gallery",
      label: "Photo Gallery",
      icon: ImageIcon,
      href: "/gallery",
      isNew: false,
    },
    {
      id: "payment",
      label: "Online Payment",
      icon: CreditCard,
      href: "/onlinepayment",
      isNew: false,
    },
    {
      id: "admission",
      label: "Admission 2026",
      icon: UserPlus,
      href: "https://forms.gle/NjqqxdBqvoa9Q7WU9",
      isNew: true,
    },
    {
      id: "alumni",
      label: "Alumni Meet 2K26",
      icon: Users,
      href: "https://docs.google.com/forms/d/1bttuO4P62IULd_Rlg7MDceSyQnxWBZcub9Rx6N9Zd8c/viewform",
      isNew: true,
      subtext: "May 1st, 9:30 AM"
    }
  ];

  return (
    <motion.div 
      className="fixed top-1/2 right-0 -translate-y-1/2 z-40 flex flex-col gap-2 md:gap-3 items-end pointer-events-none px-2 md:px-4"
      variants={{
        visible: { x: 0, opacity: 1 },
        hidden: { x: 400, opacity: 0 }
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {buttons.map((btn, index) => {
        const Icon = btn.icon;
        
        return (
          <motion.div
            key={btn.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
            className="pointer-events-auto flex justify-end"
          >
            <Link 
              href={btn.href}
              target={btn.href.startsWith('http') ? '_blank' : undefined}
              rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center justify-end h-10 md:h-12 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(28,71,98,0.2)] transition-all duration-300 overflow-hidden"
            >
              {/* Always Visible Text Content */}
              <div className="px-3 md:px-5 flex flex-col justify-center whitespace-nowrap overflow-hidden hidden sm:flex">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="font-bold text-[#1c4762] text-[10px] md:text-xs tracking-wide">{btn.label}</span>
                  {btn.isNew && (
                     <span className="flex items-center text-[8px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-emerald-500 px-1 py-[1px] rounded-sm animate-pulse">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      New
                    </span>
                  )}
                </div>
                {btn.subtext && (
                  <span className="text-[9px] text-slate-500 font-medium">{btn.subtext}</span>
                )}
              </div>

              {/* Fixed Icon Container */}
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 bg-[#1c4762] text-white rounded-full group-hover:scale-105 transition-transform duration-300">
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
