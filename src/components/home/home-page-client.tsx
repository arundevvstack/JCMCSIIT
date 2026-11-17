"use client";

import { motion } from "framer-motion";
import { AICourseExplorer } from "@/components/home/ai-course-explorer";
import { FeaturedBanner } from "@/components/home/featured-banner";
import { CampusLifeGrid } from "@/components/home/campus-life-grid";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { FeaturedResearch } from "@/components/home/featured-research";
import { CampusNews } from "@/components/home/campus-news";
import { PlacementDashboard } from "@/components/home/placement-dashboard";
import { FeaturedLegacy } from "@/components/home/featured-legacy";
import { Scholarships } from "@/components/home/scholarships";
import { JitCampusGallery } from "@/components/home/jit-campus-gallery";
import { FloatingActionButtons } from "@/components/layout/floating-action-buttons";
import { DiplomaProgrammes } from "@/components/home/diploma-programmes";
import { PrincipalMessagePreview } from "@/components/home/principal-message-preview";
import { HomeHero } from "@/components/home/home-hero";
import type { HomepageHeroSetting } from "@/lib/cms/site-settings";

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

export function HomePageClient({ hero }: { hero?: HomepageHeroSetting | null }) {
  return (
    <div className="-mt-20 relative bg-white selection:bg-primary/20">
      <FloatingActionButtons />
      
      {/* Dynamic / CMS-Managed Hero */}
      <HomeHero hero={hero} />

      {/* B.Tech Programmes Showcase */}
      <SectionAnimate><AICourseExplorer /></SectionAnimate>
      {/* Diploma Programmes Showcase */}
      <SectionAnimate><DiplomaProgrammes /></SectionAnimate>

      {/* Flagship Notice & Highlights */}
      <SectionAnimate><FeaturedBanner /></SectionAnimate>

      {/* Institutional Leadership & Vision Section */}
      <SectionAnimate><PrincipalMessagePreview /></SectionAnimate>

      {/* Placement Statistics & Top Recruiters */}
      <SectionAnimate><PlacementDashboard /></SectionAnimate>

      {/* Campus Life & Student Facilities */}
      <SectionAnimate><CampusLifeGrid /></SectionAnimate>

      {/* News & Institutional Updates */}
      <SectionAnimate><CampusNews /></SectionAnimate>

      {/* Upcoming Campus Events */}
      <SectionAnimate><UpcomingEvents /></SectionAnimate>

      {/* Research & Innovation Highlights */}
      <SectionAnimate><FeaturedResearch /></SectionAnimate>

      {/* Institutional Legacy & Heritage */}
      <SectionAnimate><FeaturedLegacy /></SectionAnimate>

      {/* Scholarships & Financial Assistance */}
      <SectionAnimate><Scholarships /></SectionAnimate>

      {/* Campus Life Visual Gallery */}
      <SectionAnimate><JitCampusGallery /></SectionAnimate>
    </div>
  );
}
