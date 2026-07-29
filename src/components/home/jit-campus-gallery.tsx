"use client";

import { ParallaxImage } from "@/components/ui/parallax-image";
import { motion } from "framer-motion";

const galleryImages = [
  { id: 1, src: "/images/about/campus-1.jpg", alt: "JIT Campus Main Building" },
  { id: 2, src: "/images/about/campus-2.jpg", alt: "JIT Campus Academic Block" },
  { id: 3, src: "/images/about/campus-3.jpg", alt: "JIT Campus Corridors" },
  { id: 4, src: "/images/about/campus-4.jpg", alt: "JIT Campus Laboratories" },
  { id: 5, src: "/images/about/campus-5.jpg", alt: "JIT Campus Classroom" },
  { id: 6, src: "/campus/cl_clubs_1779730917017.png", alt: "JIT Campus Student Clubs" },
  { id: 7, src: "/campus/cl_sports_1779730932385.png", alt: "JIT Campus Sports" },
  { id: 8, src: "/campus/cl_student_life_1779730901783.png", alt: "JIT Campus Student Life" },
];

export function JitCampusGallery() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1c4762]" style={{ fontFamily: "var(--font-heading)" }}>
            JIT Campus
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[15px] bg-slate-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <ParallaxImage
                src={img.src}
                alt={img.alt}
                fill
                imageClassName="transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
                offset={10}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
