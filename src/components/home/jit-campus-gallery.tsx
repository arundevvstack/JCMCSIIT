"use client";

import { ParallaxImage } from "@/components/ui/parallax-image";
import { motion } from "framer-motion";

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Main Building" },
  { id: 2, src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Academic Block" },
  { id: 3, src: "https://images.unsplash.com/photo-1590402494682-bf3468869186?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Corridors" },
  { id: 4, src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Laboratories" },
  { id: 5, src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Classroom" },
  { id: 6, src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Students" },
  { id: 7, src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Seminar Hall" },
  { id: 8, src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", alt: "JIT Campus Auditorium" },
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
