"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicGalleryItem } from "@/lib/cms/gallery";

interface GalleryClientProps {
    items: PublicGalleryItem[];
}

export default function GalleryClient({ items }: GalleryClientProps) {
    const [selectedImage, setSelectedImage] = useState<{
        title: string;
        image: string;
    } | null>(null);

    // Group items by album/year
    const grouped = items.reduce<Record<string, PublicGalleryItem[]>>(
        (acc, item) => {
            const groupKey = item.album_name || "Recent";
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(item);
            return acc;
        },
        {}
    );

    const yearGroups = Object.entries(grouped).map(([year, events]) => ({
        year,
        events: events.map((e) => ({
            title: e.title,
            image: e.image_url,
        })),
    }));

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
                            aria-label="Close image preview"
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
                        Campus{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                            Gallery
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto relative z-10">
                        A glimpse into the vibrant academic life, cultural events, and celebrations at John Cox Memorial CSI Institute of Technology.
                    </p>
                </div>

                {/* Gallery Content */}
                <div className="space-y-20">
                    {yearGroups.map((yearGroup) => (
                        <div key={yearGroup.year} className="relative">
                            {/* Year Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-xl flex items-center gap-2 shadow-lg">
                                    <Calendar className="w-5 h-5 text-emerald-400" />
                                    {yearGroup.year}
                                </div>
                                <div className="h-0.5 bg-slate-200 flex-grow rounded-full" />
                            </div>

                            {/* Grid of Images */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {yearGroup.events.map((event, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImage(event)}
                                        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer"
                                    >
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm shadow-md">
                                                    View Image
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-grow flex items-center justify-between">
                                            <h2 className="font-semibold text-slate-800 text-sm line-clamp-2">
                                                {event.title}
                                            </h2>
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
