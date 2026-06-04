"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type NavLink = {
  label: string;
  href?: string;
  children?: NavLink[];
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About the College", href: "/about/college/profile" },
      { label: "Vision & Mission", href: "/about/college/vision-mission" },
      { label: "Why Choose JIT", href: "/about/highlights" },
      { label: "Management", href: "/about/college/governing-body" },
      { label: "Principal's Message", href: "/about/college/principal" },
      { label: "Approval & Affiliation", href: "/about/college/mandatory-disclosure" },
      { label: "Campus Overview", href: "/about/campus-overview/location" },
      { label: "IQAC", href: "/about/iqac" },
      { label: "Anti-Ragging", href: "/about/anti-ragging" },
    ],
  },
  {
    label: "Academics",
    children: [
      {
        label: "Departments",
        children: [
          { label: "AI & ML", href: "/academics/departments/aiml" },
          { label: "Biomedical & Robotic", href: "/academics/departments/biomedical-robotic" },
          { label: "Computer Science", href: "/academics/departments/cse" },
          { label: "Electronics & Comm", href: "/academics/departments/ece" },
          { label: "Electrical & Electronics", href: "/academics/departments/eee" },
          { label: "Mechanical Engineering", href: "/academics/departments/mechanical" },
          { label: "Civil Engineering", href: "/academics/departments/civil" },
        ]
      },
      { label: "Academic Calendar", href: "/academics/academic-calendar" },
      { label: "Syllabus", href: "/academics/syllabus" },
      { label: "Faculty Directory", href: "/academics/faculty" },
    ],
  },
  {
    label: "Admissions",
    children: [
      { label: "Admission Overview", href: "/admissions" },
      { label: "Apply Online", href: "/admissions/application-form" },
      { label: "Eligibility Criteria", href: "/admissions/keam-prospectus" },
      { label: "Fees & Scholarships", href: "/admissions/fees-scholarships" },
      { label: "Payment", href: "/admissions/payment" },
      { label: "Download Brochure", href: "/admissions/e-brochure" },
    ],
  },
  {
    label: "Placements",
    children: [
      { label: "Placement Cell", href: "/placements/placement" },
      { label: "Career Development", href: "/placements" },
      { label: "Recruiters", href: "/placements" },
      { label: "Placement Statistics", href: "/placements" },
    ],
  },
  {
    label: "Research",
    children: [
      { label: "Innovation Council (IIC)", href: "/research/iic" },
      { label: "IEDC", href: "/research/iedc" },
      { label: "Research Projects", href: "/research/research-development" },
    ],
  },
  {
    label: "Campus Life",
    children: [
      { label: "Student Activities", href: "/campus-life/student-support" },
      { label: "NSS", href: "/campus-life/nss" },
      { label: "Student Council", href: "/campus-life/student-support/students-council" },
      { label: "Sports & Recreation", href: "/campus-life/student-support/sports" },
      { label: "Alumni Network", href: "/campus-life/alumni" },
    ],
  },
  {
    label: "Facilities",
    children: [
      { label: "Smart Classrooms", href: "/facilities/campus" },
      { label: "Modern Laboratories", href: "/facilities/workshop" },
      { label: "Library", href: "/facilities/library" },
      { label: "Hostel", href: "/facilities/hostel" },
      { label: "Transportation", href: "/facilities/transportation" },
    ],
  },
  {
    label: "News & Events",
    children: [
      { label: "News", href: "/news-events/news" },
      { label: "Events", href: "/news-events/events" },
      { label: "Gallery", href: "/news-events/gallery" },
    ],
  },
  {
    label: "Downloads",
    children: [
      { label: "Resources", href: "/downloads/resources" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setOpenSubDropdown(null);
    }, 150);
  };

  const handleSubMouseEnter = (label: string) => {
    if (subTimeoutRef.current) clearTimeout(subTimeoutRef.current);
    setOpenSubDropdown(label);
  };

  const handleSubMouseLeave = () => {
    subTimeoutRef.current = setTimeout(() => setOpenSubDropdown(null), 150);
  };

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderMobileLinks = (links: NavLink[], level = 0) => {
    return links.map((item) => {
      const isExpanded = mobileExpanded[item.label];
      
      if (item.children) {
        return (
          <div key={item.label} className={`${level === 0 ? "border-b border-slate-50 pb-2 mb-1" : "mt-1"}`}>
            <button 
              onClick={() => toggleMobileExpanded(item.label)}
              className={`w-full text-left flex items-center justify-between py-2 ${level === 0 ? "mt-3" : ""} ${level > 0 ? "pl-3 text-base font-medium text-slate-700" : "text-xs font-bold uppercase text-slate-400 tracking-wider"}`}
            >
              {item.label}
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>
            {isExpanded && (
              <div className="pl-2 border-l border-slate-100 ml-2 mt-1 flex flex-col gap-1">
                {renderMobileLinks(item.children, level + 1)}
              </div>
            )}
          </div>
        );
      }

      return (
        <Link
          key={item.label}
          href={item.href!}
          onClick={() => setMobileMenuOpen(false)}
          className={`block ${level === 0 ? "py-3 text-lg font-semibold text-slate-800 border-b border-slate-50" : "py-2 pl-3 text-base font-medium text-slate-700 hover:text-primary transition-colors"}`}
        >
          {item.label}
        </Link>
      );
    });
  };

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSolid = !isHome || isScrolled;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-10 left-0 right-0 z-50 transition-all duration-500 ${
        isSolid ? "bg-white/70 backdrop-blur-2xl shadow-sm py-2 border-b border-slate-200/50" : "bg-white/0 py-6"
      }`}
    >
      <div className="layout-grid">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-[15rem] h-[3.5rem] md:w-[18rem] md:h-[4rem] lg:w-[18rem] lg:h-[4.5rem] shrink-0">
              <Image
                src="/logo.png"
                alt="JCMCSIIT Logo"
                fill
                sizes="(max-width: 768px) 15rem, (max-width: 1024px) 18rem, 18rem"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className={`whitespace-nowrap flex items-center gap-1 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${isSolid ? 'text-slate-700 hover:text-primary' : 'text-white/90 hover:text-white'}`}>
                    {item.label}
                    <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${openDropdown === item.label ? (isSolid ? "rotate-180 text-primary" : "rotate-180 text-white") : (isSolid ? "text-slate-400" : "text-white/60")}`} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-3 z-50">
                      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-2 min-w-[240px]">
                        {item.children.map((child) => (
                          <div 
                            key={child.label}
                            className="relative"
                            onMouseEnter={() => handleSubMouseEnter(child.label)}
                            onMouseLeave={handleSubMouseLeave}
                          >
                            {child.children ? (
                              <button className="w-full text-left flex items-center justify-between px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors">
                                {child.label}
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            ) : (
                              <Link
                                href={child.href!}
                                className="block px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                              >
                                {child.label}
                              </Link>
                            )}

                            {child.children && openSubDropdown === child.label && (
                              <div className="absolute top-0 left-full pl-2 z-50">
                                <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-2 min-w-[240px]">
                                  {child.children.map((subChild) => (
                                    <div key={subChild.label} className="relative group/sub">
                                      {subChild.children ? (
                                        <div className="w-full text-left flex flex-col px-5 py-2.5 text-sm font-medium text-slate-600">
                                          <span className="flex items-center justify-between text-slate-800 font-semibold mb-1 border-b border-slate-100 pb-1">{subChild.label}</span>
                                          <div className="flex flex-col gap-1 mt-1">
                                            {subChild.children.map(deep => (
                                              <Link key={deep.label} href={deep.href!} className="text-slate-500 hover:text-primary transition-colors py-1">{deep.label}</Link>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <Link
                                          href={subChild.href!}
                                          className="block px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
                                        >
                                          {subChild.label}
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`whitespace-nowrap px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-colors ${isSolid ? 'text-slate-700 hover:text-primary' : 'text-white/90 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className={`ml-1 pl-2 border-l shrink-0 ${isSolid ? 'border-slate-200' : 'border-white/20'}`}>
              <Link
                href="/admissions/application-form"
                className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] ${isSolid ? 'bg-foreground text-white hover:bg-primary' : 'bg-white text-slate-900 hover:bg-white/90'}`}
              >
                Apply Now
              </Link>
            </div>
          </nav>

          <button
            className={`xl:hidden p-2 rounded-xl transition-colors ${isSolid ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl py-4 px-6 flex flex-col gap-1 xl:hidden max-h-[80vh] overflow-y-auto">
          {renderMobileLinks(navLinks)}
          <Link
            href="/admissions/application-form"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 w-full h-12 rounded-xl bg-foreground text-white font-semibold flex items-center justify-center shadow-md"
          >
            Apply Now
          </Link>
        </div>
      )}
    </motion.header>
  );
}
