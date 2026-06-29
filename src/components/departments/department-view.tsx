'use client';

import { DepartmentData } from '@/types/department';
import { DepartmentHero } from './sections/department-hero';
import { DepartmentAbout } from './sections/department-about';
import { DepartmentInfrastructure } from './sections/department-infrastructure';
import { DepartmentCareer } from './sections/department-career';
import { DepartmentFaculty } from './sections/department-faculty';
import { DepartmentStudentLife } from './sections/department-student-life';
import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'about', label: 'About & Vision' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'careers', label: 'Careers' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'student-life', label: 'Student Life' },
];

export function DepartmentView({ data }: { data: DepartmentData }) {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const offsetTop = top + window.scrollY;
          const offsetBottom = bottom + window.scrollY;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-white min-h-screen pt-20">
      {/* Sticky Navigation */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <ul className="flex overflow-x-auto hide-scrollbar py-4 gap-6 items-center text-sm font-medium">
            {SECTIONS.map((section) => (
              <li key={section.id} className="whitespace-nowrap">
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`transition-colors hover:text-primary ${
                    activeSection === section.id 
                      ? 'text-primary font-bold' 
                      : 'text-slate-500'
                  }`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sections */}
      <DepartmentHero data={data} />
      <DepartmentAbout data={data} />
      <DepartmentInfrastructure data={data} />
      <DepartmentCareer data={data} />
      <DepartmentFaculty data={data} />
      <DepartmentStudentLife data={data} />
    </div>
  );
}
