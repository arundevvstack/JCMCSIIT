"use client";

import { ParallaxImage } from "@/components/ui/parallax-image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const campusLifeData = [
  {
    id: 1,
    title: "Student Life",
    description: "A residential campus with diverse housing, exceptional dining, and over 600 student organizations",
    linkText: "Student Affairs",
    linkHref: "/campus-life",
    image: "/campus/cl_student_life_1779730901783.png",
  },
  {
    id: 2,
    title: "Constructive Dialogue",
    description: "Uplifting academic freedom and free speech; curiosity and critical inquiry; open, inclusive exchange of ideas",
    linkText: "Campus Forums",
    linkHref: "/campus-life",
    image: "/campus/cl_clubs_1779730917017.png",
  },
  {
    id: 3,
    title: "Recreation & Wellness",
    description: "State-of-the-art facilities and fitness programs to encourage movement and play",
    linkText: "Recreation & Wellness",
    linkHref: "/campus-life",
    image: "/campus/cl_sports_1779730932385.png",
  },
];

export function CampusLifeGrid() {
  return (
    <section className="py-24 bg-white relative z-20">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Campus Life
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl font-editorial">
            Building a vibrant community of creative and accomplished people from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {campusLifeData.map((item) => (
            <div key={item.id} className="flex flex-col group">
              <div className="relative w-full aspect-[3/2] mb-6 overflow-hidden bg-slate-100">
                <ParallaxImage
                  src={item.image}
                  alt={item.title}
                  fill
                  imageClassName="transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  offset={15}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                {item.description}
              </p>
              <Link
                href={item.linkHref}
                className="inline-flex items-center text-[13px] font-bold text-[#1c4762] hover:underline"
              >
                {item.linkText} <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/campus-life"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#1c4762] text-white font-semibold rounded-md hover:bg-[#102e41] transition-colors duration-300"
          >
            More about campus life
          </Link>
        </div>
      </div>
    </section>
  );
}
