"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
    Camera,
    Calendar,
    X,
    Folder,
    Images,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GALLERY_CATEGORIES,
    type PublicGalleryAlbum,
    type PublicGalleryItem,
} from "@/types/gallery";

interface GalleryClientProps {
    items: PublicGalleryItem[];
    albums?: PublicGalleryAlbum[];
}

export default function GalleryClient({
    items,
    albums = [],
}: GalleryClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedAlbumSlug, setSelectedAlbumSlug] = useState<string | null>(
        null
    );
    const [viewMode, setViewMode] = useState<"albums" | "photos">("albums");

    // Lightbox modal index
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Filtered albums
    const filteredAlbums = useMemo(() => {
        return albums.filter((alb) => {
            if (
                selectedCategory !== "All" &&
                alb.category.toLowerCase() !== selectedCategory.toLowerCase()
            ) {
                return false;
            }
            return true;
        });
    }, [albums, selectedCategory]);

    // Currently selected album object
    const activeAlbum = useMemo(() => {
        if (!selectedAlbumSlug) return null;
        return (
            albums.find(
                (a) =>
                    a.slug === selectedAlbumSlug ||
                    a.title.toLowerCase() === selectedAlbumSlug.toLowerCase()
            ) || null
        );
    }, [albums, selectedAlbumSlug]);

    // Filtered photos
    const filteredPhotos = useMemo(() => {
        let list = items;

        if (selectedAlbumSlug && activeAlbum) {
            list = list.filter(
                (i) =>
                    i.album_name &&
                    (i.album_name.toLowerCase() === activeAlbum.title.toLowerCase() ||
                        i.album_name.toLowerCase() === activeAlbum.slug.toLowerCase())
            );
        } else if (selectedCategory !== "All") {
            list = list.filter(
                (i) => i.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        return [...list].sort((a, b) => a.sort_order - b.sort_order);
    }, [items, selectedCategory, selectedAlbumSlug, activeAlbum]);

    // Active image in lightbox
    const currentLightboxPhoto =
        lightboxIndex !== null && filteredPhotos[lightboxIndex]
            ? filteredPhotos[lightboxIndex]
            : null;

    const handlePrevLightbox = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1
        );
    };

    const handleNextLightbox = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex === null) return;
        setLightboxIndex((prev) =>
            prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            {/* Lightbox Overlay */}
            <AnimatePresence>
                {currentLightboxPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-5 right-5 text-white hover:text-[#E5C158] transition-colors z-50 bg-white/10 hover:bg-white/20 p-2.5 rounded-full"
                            onClick={() => setLightboxIndex(null)}
                            aria-label="Close image preview"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation Previous */}
                        {filteredPhotos.length > 1 && (
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#E5C158] transition-colors z-50 bg-black/60 hover:bg-black/90 p-3 rounded-full border border-white/10 hidden sm:block"
                                onClick={handlePrevLightbox}
                                aria-label="Previous photo"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Navigation Next */}
                        {filteredPhotos.length > 1 && (
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#E5C158] transition-colors z-50 bg-black/60 hover:bg-black/90 p-3 rounded-full border border-white/10 hidden sm:block"
                                onClick={handleNextLightbox}
                                aria-label="Next photo"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-5xl w-full max-h-[85vh] h-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[65vh] sm:h-[72vh]">
                                <Image
                                    src={currentLightboxPhoto.image_url}
                                    alt={currentLightboxPhoto.title}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                    unoptimized
                                />
                            </div>

                            <div className="w-full mt-4 text-center px-4">
                                <div className="inline-flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#D4AF37]/20 text-[#E5C158] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                                        {currentLightboxPhoto.category}
                                    </span>
                                    {currentLightboxPhoto.album_name && (
                                        <span className="text-[11px] text-zinc-400 bg-white/10 px-2.5 py-0.5 rounded-full">
                                            {currentLightboxPhoto.album_name}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-white text-lg sm:text-xl font-bold">
                                    {currentLightboxPhoto.title}
                                </h3>
                                {currentLightboxPhoto.caption && (
                                    <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mx-auto mt-1 line-clamp-2">
                                        {currentLightboxPhoto.caption}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl text-emerald-600 mb-4 relative z-10 border border-slate-100">
                        <Camera className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight relative z-10">
                        Campus{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">
                            Gallery & Albums
                        </span>
                    </h1>
                    <p className="text-base text-slate-600 max-w-2xl mx-auto relative z-10">
                        Moments of academic achievement, vibrant student celebrations, campus life, and sports championships at JCMC SIIT.
                    </p>
                </div>

                {/* Category Pills & View Mode Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                        <button
                            onClick={() => {
                                setSelectedCategory("All");
                                setSelectedAlbumSlug(null);
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                selectedCategory === "All"
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                            }`}
                        >
                            All Categories
                        </button>
                        {GALLERY_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setSelectedAlbumSlug(null);
                                }}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* View Switcher: Albums vs All Photos */}
                    {!selectedAlbumSlug && (
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
                            <button
                                onClick={() => setViewMode("albums")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    viewMode === "albums"
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <Folder className="w-3.5 h-3.5" />
                                Albums ({filteredAlbums.length})
                            </button>
                            <button
                                onClick={() => setViewMode("photos")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    viewMode === "photos"
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <Images className="w-3.5 h-3.5" />
                                Photos ({filteredPhotos.length})
                            </button>
                        </div>
                    )}
                </div>

                {/* VIEW 1: SELECTED ALBUM DETAIL VIEW */}
                {selectedAlbumSlug && activeAlbum ? (
                    <div className="space-y-8">
                        {/* Album Breadcrumb & Header Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="space-y-3">
                                <button
                                    onClick={() => setSelectedAlbumSlug(null)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to All Albums
                                </button>
                                <div>
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                                        {activeAlbum.category}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                                        {activeAlbum.title}
                                    </h2>
                                    {activeAlbum.description && (
                                        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                                            {activeAlbum.description}
                                        </p>
                                    )}
                                </div>
                                {activeAlbum.event_date && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                        <Calendar className="w-4 h-4 text-emerald-600" />
                                        <span>Event Date: {activeAlbum.event_date}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5">
                                    <Images className="w-4 h-4 text-emerald-600" />
                                    {filteredPhotos.length} Photographs
                                </span>
                            </div>
                        </div>

                        {/* Grid of Photos in Selected Album */}
                        {filteredPhotos.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
                                <Images className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p>No published photos found in this album.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredPhotos.map((photo, idx) => (
                                    <div
                                        key={photo.id}
                                        onClick={() => setLightboxIndex(idx)}
                                        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer"
                                    >
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                            <Image
                                                src={photo.image_url}
                                                alt={photo.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white/95 text-slate-900 px-4 py-2 rounded-full text-xs font-bold tracking-wide backdrop-blur-sm shadow-md">
                                                    View Photo
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-grow flex flex-col justify-between">
                                            <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">
                                                {photo.title}
                                            </h3>
                                            {photo.caption && (
                                                <p className="text-slate-500 text-xs line-clamp-2 mt-1">
                                                    {photo.caption}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

                {/* VIEW 2: ALBUMS LIST */}
                {!selectedAlbumSlug && viewMode === "albums" && (
                    <div className="space-y-6">
                        {filteredAlbums.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
                                <Folder className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p>No published albums matching category &quot;{selectedCategory}&quot;.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredAlbums.map((album) => (
                                    <div
                                        key={album.id || album.slug}
                                        onClick={() => setSelectedAlbumSlug(album.slug)}
                                        className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer"
                                    >
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                            {album.cover_image_url ? (
                                                <Image
                                                    src={album.cover_image_url}
                                                    alt={album.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                    <Images className="w-8 h-8 mb-1" />
                                                    <span className="text-xs">Album</span>
                                                </div>
                                            )}

                                            <div className="absolute top-3 right-3">
                                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white shadow-sm flex items-center gap-1">
                                                    <Images className="w-3 h-3 text-emerald-400" />
                                                    {album.photo_count} Photos
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5 flex-grow flex flex-col justify-between space-y-2">
                                            <div>
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                                                    {album.category}
                                                </span>
                                                <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                                    {album.title}
                                                </h3>
                                                {album.description && (
                                                    <p className="text-slate-500 text-xs line-clamp-2 mt-1">
                                                        {album.description}
                                                    </p>
                                                )}
                                            </div>

                                            {album.event_date && (
                                                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
                                                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>{album.event_date}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* VIEW 3: ALL PHOTOGRAPHS GRID */}
                {!selectedAlbumSlug && viewMode === "photos" && (
                    <div className="space-y-6">
                        {filteredPhotos.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm">
                                <Images className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p>No published photographs found in category &quot;{selectedCategory}&quot;.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredPhotos.map((photo, idx) => (
                                    <div
                                        key={photo.id}
                                        onClick={() => setLightboxIndex(idx)}
                                        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer"
                                    >
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                            <Image
                                                src={photo.image_url}
                                                alt={photo.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white/95 text-slate-900 px-4 py-2 rounded-full text-xs font-bold tracking-wide backdrop-blur-sm shadow-md">
                                                    View Photo
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-grow flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                                                    {photo.category}
                                                </span>
                                                <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">
                                                    {photo.title}
                                                </h3>
                                            </div>
                                            {photo.album_name && (
                                                <p className="text-slate-400 text-[11px] mt-2 truncate">
                                                    Album: {photo.album_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
