"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GraduationCap, Banknote, ShieldCheck, HeartHandshake } from "lucide-react";

const defaultScholarships = [
  {
    icon: <Banknote className="h-8 w-8 text-emerald-500" />,
    title: "Government Scholarships",
    description: "Various state and central government scholarship schemes for eligible students.",
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-emerald-500" />,
    title: "Merit Scholarships",
    description: "Financial rewards for outstanding academic excellence and performance.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
    title: "Reservation Scholarships",
    description: "Dedicated scholarships for SC/ST, OBC, and minority category students.",
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-emerald-500" />,
    title: "Financial Assistance",
    description: "Need-based financial aid for economically weaker sections.",
  },
];

export interface ScholarshipsProps {
  block?: {
    title?: string;
    content?: string;
    structured_data?: Record<string, unknown>;
  } | null;
}

export function Scholarships({ block }: ScholarshipsProps = {}) {
  const badge = (block?.structured_data?.badge as string) || "Financial Aid";
  const title = block?.title || null;
  const description = block?.content || "At JCMC SIIT, we believe that financial constraints should never be a barrier to quality education. We offer comprehensive scholarship programs and financial aid to support our students in achieving their academic goals.";
  const ctaText = (block?.structured_data?.cta_text as string) || "View All Scholarships";
  const ctaLink = (block?.structured_data?.cta_link as string) || "/admissions/fees-scholarships";

  const rawSchemes = Array.isArray(block?.structured_data?.schemes) ? block?.structured_data?.schemes : null;
  const activeScholarships = rawSchemes && rawSchemes.length > 0
    ? rawSchemes.map((s, idx: number) => {
        const item = s as Record<string, unknown>;
        return {
          icon: defaultScholarships[idx % defaultScholarships.length].icon,
          title: (item.title as string) || (item.name as string) || `Scheme ${idx + 1}`,
          description: (item.description as string) || (item.summary as string) || "",
        };
      })
    : defaultScholarships;

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">{badge}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
              {title ? (
                <span>{title}</span>
              ) : (
                <>
                  Scholarships & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Assistance.</span>
                </>
              )}
            </h2>
            
            <p className="text-slate-500 text-lg leading-relaxed mb-8 font-editorial">
              {description}
            </p>

            <Link 
              href={ctaLink}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/20 group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/30 to-cyan-100/30 blur-3xl -z-10 rounded-full scale-150"></div>
            
            {activeScholarships.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1"
              >
                <div className="mb-4 bg-emerald-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
