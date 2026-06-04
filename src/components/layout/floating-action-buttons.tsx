"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Image as ImageIcon, CreditCard, UserPlus, Users, Sparkles } from "lucide-react";

export function FloatingActionButtons() {
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
      href: "/payment",
      isNew: false,
    },
    {
      id: "admission",
      label: "Admission 2026",
      icon: UserPlus,
      href: "/admissions",
      isNew: true,
    },
    {
      id: "alumni",
      label: "Alumni Meet 2K26",
      icon: Users,
      href: "/alumni-meet",
      isNew: true,
      subtext: "May 1st, 9:30 AM"
    }
  ];

  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-40 flex flex-col gap-3 items-end pointer-events-none px-4">
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
              className="group flex items-center justify-end h-14 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(28,71,98,0.2)] transition-all duration-300 overflow-hidden"
            >
              {/* Always Visible Text Content */}
              <div className="px-6 flex flex-col justify-center whitespace-nowrap overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1c4762] text-sm tracking-wide">{btn.label}</span>
                  {btn.isNew && (
                    <span className="flex items-center text-[9px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-emerald-500 px-1.5 py-0.5 rounded-sm animate-pulse">
                      <Sparkles className="w-3 h-3 mr-0.5" />
                      New
                    </span>
                  )}
                </div>
                {btn.subtext && (
                  <span className="text-[10px] text-slate-500 font-medium">{btn.subtext}</span>
                )}
              </div>

              {/* Fixed Icon Container */}
              <div className="w-14 h-14 flex items-center justify-center shrink-0 bg-[#1c4762] text-white rounded-full group-hover:scale-105 transition-transform duration-300">
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
