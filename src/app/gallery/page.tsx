"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const galleryData = [
  {
    year: "2025",
    events: [
      {
        "title": "Amazon Placement Drive",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Amazon%20Placement%20Drive%20on%2001082025%20Friday/amazon%202025.jpeg"
      },
      {
        "title": "Annual Athletic Meet",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Annual%20Athletic%20Meet/IMG-20250320-WA0093.jpg"
      },
      {
        "title": "Bishops Visit our college",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Bishops%20Visit%20%20our%20college/WhatsApp%20Image%202025-06-04%20at%2016.20.50.jpeg"
      },
      {
        "title": "Congratulations POWER QUIZ WINNERS",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Congratulations%20POWER%20QUIZ%20WINNERS/WhatsApp%20Image%202025-11-10%20at%2018.41.59-imageonline.co-merged.jpeg"
      },
      {
        "title": "Interactive Session on Sustainable Lifestyle",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Interactive%20Session%20on%20Sustainable%20Lifestyle/WhatsApp%20Image%202025-02-14%20at%2012.09.19_00c566ec.jpg"
      },
      {
        "title": "JIT Campus Pool Recruitment 2026",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20Campus%20Pool%20Recruitment%202026/WhatsApp%20Image%202026-01-12%20at%2021.34.10.jpeg"
      },
      {
        "title": "JIT ROBOGREET 2026",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20ROBOGREET%202026/WhatsApp%20Image%202025-12-31%20at%2018.26.31.jpeg"
      },
      {
        "title": "JIT Super League 25",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/JIT%20Super%20League%2025/CRICKET%20RUNNER-UP%20RUBY%20HOUSE.jpg"
      },
      {
        "title": "KEAM 2025 BTech Joining Schedule",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/KEAM%202025%20%20BTech%20Joining%20Schedule/KEAM'25%20-%20Joining%20%20schedule.jpeg"
      },
      {
        "title": "Liver Foundation of Kerala",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Liver%20Foundation%20of%20Kerala/IMG-20250320-WA0098.jpg"
      },
      {
        "title": "Mega Placement Drive 2025",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Mega%20Placement%20Drive%202025/Campus%20Placement%20Drive'25.jpeg"
      },
      {
        "title": "Nabhas 2K25",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Nabhas%202K25/IMG-20250320-WA0074.jpg"
      },
      {
        "title": "Newly Approved Polytechnic Admission 2025",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Newly%20Approved%20%20Polytechnic%20%20Admission%202025/Poly-admission%202025-1.jpeg"
      },
      {
        "title": "NonTeaching Staff 2025",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/NonTeaching%20Staff%202025/WhatsApp%20Image%202025-04-04%20at%2018.42.59(1).jpeg"
      },
      {
        "title": "SAYONARA 2K25",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/SAYONARA%202K25/20250327_160913.jpg"
      },
      {
        "title": "Seminar on Latest Trends in Technology",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Seminar%20on%20Latest%20Trends%20in%20Technology/IMG-20250110-WA0002.jpg"
      },
      {
        "title": "TECHNO VISTA 2025 National Conference",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/TECHNO%20VISTA%202025%20%20National%20Conference/IMG-20250324-WA0037.jpg"
      },
      {
        "title": "Teaching Staff 2025",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Teaching%20Staff%202025/WhatsApp%20Image%202025-04-04%20at%2018.42.59.jpeg"
      },
      {
        "title": "Workshop for Mentors by Govt. of Kerala",
        "image": "https://jcmcsiit.ac.in/Photogallery/2025/Workshop%20for%20Mentors%20by%20Govt.%20of%20Kerala/IMG-20250113-WA0003.jpg"
      }
    ]
  },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<{title: string, image: string} | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-emerald-400 transition-colors z-50 bg-black/50 p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[85vh] h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image 
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  unoptimized
                />
              </div>
              <h3 className="text-white mt-4 text-xl font-medium bg-black/50 px-6 py-2 rounded-full absolute bottom-4 text-center">
                {selectedImage.title}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl text-emerald-600 mb-6 relative z-10 border border-slate-100">
            <Camera className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight relative z-10">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Gallery</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto relative z-10">
            A glimpse into the vibrant academic life, cultural events, and celebrations at John Cox Memorial CSI Institute of Technology.
          </p>
        </div>

        {/* Gallery Content */}
        <div className="space-y-20">
          {galleryData.map((yearGroup) => (
            <div key={yearGroup.year} className="relative">
              
              {/* Year Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2 shadow-lg">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  {yearGroup.year}
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {yearGroup.events.map((event, idx) => (
                  <div 
                    key={idx} 
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100/60 aspect-[4/3] cursor-pointer"
                    onClick={() => setSelectedImage(event)}
                  >
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-emerald-300 transition-colors">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
