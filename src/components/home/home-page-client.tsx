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
import type { PublicNewsItem } from "@/lib/cms/news";
import type { PublicEventItem } from "@/lib/cms/events";
import type { PublicGalleryItem } from "@/lib/cms/gallery";
import type { PublicRecruiterItem } from "@/lib/cms/placements";
import type { PublicCourseSummary } from "@/lib/cms/courses";
import type { PublicContentBlock } from "@/lib/cms/content-blocks";

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

interface HomePageClientProps {
  hero?: HomepageHeroSetting | null;
  news?: PublicNewsItem[] | null;
  events?: PublicEventItem[] | null;
  gallery?: PublicGalleryItem[] | null;
  recruiters?: PublicRecruiterItem[] | null;
  ugCourses?: PublicCourseSummary[] | null;
  diplomaCourses?: PublicCourseSummary[] | null;
  featuredBanner?: PublicContentBlock | null;
  principalMessage?: PublicContentBlock | null;
  featuredLegacy?: PublicContentBlock | null;
  scholarshipsBlock?: PublicContentBlock | null;
}

export function HomePageClient({
  hero,
  news,
  events,
  gallery,
  recruiters,
  ugCourses,
  diplomaCourses,
  featuredBanner,
  principalMessage,
  featuredLegacy,
  scholarshipsBlock,
}: HomePageClientProps) {
  return (
    <div className="-mt-20 relative bg-white selection:bg-primary/20">
      <FloatingActionButtons />
      
      {/* Dynamic / CMS-Managed Hero */}
      <HomeHero hero={hero} />

      {/* B.Tech Programmes Showcase */}
      <SectionAnimate><AICourseExplorer courses={ugCourses} /></SectionAnimate>
      {/* Diploma Programmes Showcase */}
      <SectionAnimate><DiplomaProgrammes courses={diplomaCourses} /></SectionAnimate>

      {/* Flagship Notice & Highlights */}
      <SectionAnimate><FeaturedBanner block={featuredBanner} /></SectionAnimate>

      {/* Institutional Leadership & Vision Section */}
      <SectionAnimate><PrincipalMessagePreview block={principalMessage} /></SectionAnimate>

      {/* Placement Statistics & Top Recruiters */}
      <SectionAnimate><PlacementDashboard recruiters={recruiters ?? undefined} /></SectionAnimate>

      {/* Campus Life & Student Facilities */}
      <SectionAnimate><CampusLifeGrid /></SectionAnimate>

      {/* News & Institutional Updates */}
      <SectionAnimate><CampusNews news={news} /></SectionAnimate>

      {/* Upcoming Campus Events */}
      <SectionAnimate><UpcomingEvents events={events} /></SectionAnimate>

      {/* Research & Innovation Highlights */}
      <SectionAnimate><FeaturedResearch /></SectionAnimate>

      {/* Institutional Legacy & Heritage */}
      <SectionAnimate><FeaturedLegacy block={featuredLegacy} /></SectionAnimate>

      {/* Scholarships & Financial Assistance */}
      <SectionAnimate><Scholarships block={scholarshipsBlock} /></SectionAnimate>

      {/* Campus Life Visual Gallery */}
      <SectionAnimate><JitCampusGallery gallery={gallery} /></SectionAnimate>
    </div>
  );
}
