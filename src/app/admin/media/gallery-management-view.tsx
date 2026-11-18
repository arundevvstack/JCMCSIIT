"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
    Folder,
    FolderPlus,
    Upload,
    Plus,
    Search,
    Filter,
    Images,
    Calendar,
    Pencil,
    Trash2,
    Eye,
    X,
} from "lucide-react";
import type { AdminRole } from "@/lib/auth/rbac";
import {
    GALLERY_CATEGORIES,
    type PublicGalleryAlbum,
    type PublicGalleryItem,
} from "@/types/gallery";
import { saveGalleryItem, deleteGalleryItem } from "@/actions/cms";
import { BatchPhotoUploader } from "@/components/admin/batch-photo-uploader";
import { AlbumEditorModal } from "@/components/admin/album-editor-modal";
import { useRouter } from "next/navigation";

interface GalleryManagementViewProps {
    initialItems: PublicGalleryItem[];
    initialAlbums: PublicGalleryAlbum[];
    role: AdminRole;
}

export function GalleryManagementView({
    initialItems,
    initialAlbums,
    role,
}: GalleryManagementViewProps) {
    const router = useRouter();

    // Modals
    const [isBatchUploaderOpen, setIsBatchUploaderOpen] = useState(false);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<PublicGalleryAlbum | null>(
        null
    );

    // Single Photo Edit/Add Modal
    const [editingPhoto, setEditingPhoto] = useState<PublicGalleryItem | null>(
        null
    );
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [albumFilter, setAlbumFilter] = useState("All");
    const [activeTab, setActiveTab] = useState<"all" | "albums" | "photos">("all");

    // Single Photo Form State
    const [photoTitle, setPhotoTitle] = useState("");
    const [photoCategory, setPhotoCategory] = useState("Campus");
    const [photoAlbumName, setPhotoAlbumName] = useState("");
    const [photoImageUrl, setPhotoImageURL] = useState("");
    const [photoCaption, setPhotoCaption] = useState("");
    const [photoSortOrder, setPhotoSortOrder] = useState(0);
    const [photoStatus, setPhotoStatus] = useState<"published" | "draft" | "archived">(
        "published"
    );
    const [isSavingPhoto, setIsSavingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    // Available unique albums list for dropdowns
    const availableAlbumNames = useMemo(() => {
        const names = new Set<string>();
        initialAlbums.forEach((a) => {
            if (a.title) names.add(a.title);
        });
        initialItems.forEach((i) => {
            if (i.album_name) names.add(i.album_name);
        });
        return Array.from(names);
    }, [initialAlbums, initialItems]);

    // Filtered Items
    const filteredPhotos = useMemo(() => {
        return initialItems.filter((item) => {
            // Category filter
            if (categoryFilter !== "All" && item.category !== categoryFilter) {
                return false;
            }
            // Album filter
            if (albumFilter !== "All") {
                if (albumFilter === "__unassigned__") {
                    if (item.album_name) return false;
                } else if (item.album_name !== albumFilter) {
                    return false;
                }
            }
            // Search filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = item.title.toLowerCase().includes(q);
                const matchCaption = (item.caption || "").toLowerCase().includes(q);
                const matchAlbum = (item.album_name || "").toLowerCase().includes(q);
                if (!matchTitle && !matchCaption && !matchAlbum) return false;
            }
            return true;
        });
    }, [initialItems, categoryFilter, albumFilter, searchQuery]);

    // Filtered Albums
    const filteredAlbums = useMemo(() => {
        return initialAlbums.filter((album) => {
            if (categoryFilter !== "All" && album.category !== categoryFilter) {
                return false;
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = album.title.toLowerCase().includes(q);
                const matchDesc = (album.description || "").toLowerCase().includes(q);
                if (!matchTitle && !matchDesc) return false;
            }
            return true;
        });
    }, [initialAlbums, categoryFilter, searchQuery]);

    const openCreatePhotoModal = () => {
        setEditingPhoto(null);
        setPhotoTitle("");
        setPhotoCategory(categoryFilter !== "All" ? categoryFilter : "Campus");
        setPhotoAlbumName(
            albumFilter !== "All" && albumFilter !== "__unassigned__"
                ? albumFilter
                : ""
        );
        setPhotoImageURL("");
        setPhotoCaption("");
        setPhotoSortOrder(filteredPhotos.length + 1);
        setPhotoStatus("published");
        setPhotoError(null);
        setIsPhotoModalOpen(true);
    };

    const openEditPhotoModal = (item: PublicGalleryItem) => {
        setEditingPhoto(item);
        setPhotoTitle(item.title);
        setPhotoCategory(item.category || "Campus");
        setPhotoAlbumName(item.album_name || "");
        setPhotoImageURL(item.image_url);
        setPhotoCaption(item.caption || "");
        setPhotoSortOrder(item.sort_order ?? 0);
        setPhotoStatus(
            (item.status as "published" | "draft" | "archived") || "published"
        );
        setPhotoError(null);
        setIsPhotoModalOpen(true);
    };

    const handleSavePhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        setPhotoError(null);
        setIsSavingPhoto(true);

        const fd = new FormData();
        if (editingPhoto?.id) fd.append("id", editingPhoto.id);
        fd.append("title", photoTitle);
        fd.append("category", photoCategory);
        if (photoAlbumName) fd.append("album_name", photoAlbumName);
        fd.append("image_url", photoImageUrl);
        if (photoCaption) fd.append("caption", photoCaption);
        fd.append("sort_order", String(photoSortOrder));
        fd.append("status", photoStatus);

        const res = await saveGalleryItem(fd);
        setIsSavingPhoto(false);

        if (!res.ok) {
            setPhotoError(res.error || "Failed to save photo.");
        } else {
            setIsPhotoModalOpen(false);
            router.refresh();
        }
    };

    const handleDeletePhoto = async (item: PublicGalleryItem) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete photo "${item.title}"?`
        );
        if (!confirmed) return;

        const res = await deleteGalleryItem(item.id);
        if (!res.ok) {
            alert(res.error || "Failed to delete photo.");
        } else {
            router.refresh();
        }
    };

    return (
        <div className="space-y-8">
            {/* Top Toolbar: Search, Filters, and Primary Action Buttons */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search photos & albums by title or caption..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#0B0D12] border border-white/10 text-zinc-200 text-xs focus:border-[#D4AF37] outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter Selectors */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Category Filter */}
                    <div className="flex items-center gap-1.5 bg-[#0B0D12] border border-white/10 rounded-xl px-2.5 h-10">
                        <Filter className="w-3.5 h-3.5 text-zinc-400" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent text-zinc-200 text-xs outline-none cursor-pointer pr-2"
                        >
                            <option value="All">All Categories</option>
                            {GALLERY_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Album Filter */}
                    <div className="flex items-center gap-1.5 bg-[#0B0D12] border border-white/10 rounded-xl px-2.5 h-10">
                        <Folder className="w-3.5 h-3.5 text-zinc-400" />
                        <select
                            value={albumFilter}
                            onChange={(e) => setAlbumFilter(e.target.value)}
                            className="bg-transparent text-zinc-200 text-xs outline-none cursor-pointer pr-2 max-w-[160px] truncate"
                        >
                            <option value="All">All Albums</option>
                            {availableAlbumNames.map((alb) => (
                                <option key={alb} value={alb}>
                                    {alb}
                                </option>
                            ))}
                            <option value="__unassigned__">— Unassigned Photos —</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-auto">
                        <button
                            onClick={() => {
                                setEditingAlbum(null);
                                setIsAlbumModalOpen(true);
                            }}
                            className="h-10 px-3.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition-colors flex items-center gap-1.5"
                        >
                            <FolderPlus className="w-3.5 h-3.5 text-[#E5C158]" />
                            <span>New Album</span>
                        </button>

                        <button
                            onClick={() => setIsBatchUploaderOpen(true)}
                            className="h-10 px-4 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#E5C158] text-black transition-colors flex items-center gap-2 shadow-lg shadow-[#D4AF37]/10"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload Photos</span>
                        </button>

                        <button
                            onClick={openCreatePhotoModal}
                            className="h-10 px-3.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-600/10"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Photo</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* View Selector Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        activeTab === "all"
                            ? "bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/30"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                >
                    Overview (Albums & Photos)
                </button>
                <button
                    onClick={() => setActiveTab("albums")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeTab === "albums"
                            ? "bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/30"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                >
                    <Folder className="w-3.5 h-3.5" />
                    Albums ({filteredAlbums.length})
                </button>
                <button
                    onClick={() => setActiveTab("photos")}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeTab === "photos"
                            ? "bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/30"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                    }`}
                >
                    <Images className="w-3.5 h-3.5" />
                    Photo Library ({filteredPhotos.length})
                </button>

                {albumFilter !== "All" && (
                    <div className="ml-auto flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E5C158] text-xs px-3 py-1 rounded-full">
                        <span>Viewing: <strong>{albumFilter}</strong></span>
                        <button
                            onClick={() => setAlbumFilter("All")}
                            className="hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* SECTION 1: ALBUMS */}
            {(activeTab === "all" || activeTab === "albums") && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-[#E5C158]" />
                            <h2 className="text-base font-bold text-zinc-100">
                                Institutional Photo Albums
                            </h2>
                            <span className="text-xs text-zinc-500">
                                ({filteredAlbums.length} albums)
                            </span>
                        </div>
                    </div>

                    {filteredAlbums.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-black/20 border border-white/5 text-zinc-400 text-xs">
                            <Folder className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                            <p>No albums matching the active filters.</p>
                            <button
                                onClick={() => {
                                    setEditingAlbum(null);
                                    setIsAlbumModalOpen(true);
                                }}
                                className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-200 transition-colors"
                            >
                                Create First Album
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredAlbums.map((album) => (
                                <div
                                    key={album.id || album.slug}
                                    className="group relative rounded-2xl bg-[#0E1117] border border-white/10 hover:border-[#D4AF37]/40 transition-all overflow-hidden flex flex-col shadow-sm"
                                >
                                    {/* Cover image preview */}
                                    <div className="relative aspect-[16/10] w-full bg-black/60 overflow-hidden">
                                        {album.cover_image_url ? (
                                            <Image
                                                src={album.cover_image_url}
                                                alt={album.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600">
                                                <Images className="w-8 h-8 mb-1" />
                                                <span className="text-[10px]">No Cover</span>
                                            </div>
                                        )}

                                        {/* Status & Photo count badge */}
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                            <span
                                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md ${
                                                    album.status === "published"
                                                        ? "bg-emerald-500/80 text-white"
                                                        : "bg-amber-500/80 text-white"
                                                }`}
                                            >
                                                {album.status}
                                            </span>
                                        </div>

                                        <div className="absolute top-2.5 right-2.5">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                                                <Images className="w-3 h-3 text-[#E5C158]" />
                                                {album.photo_count} photos
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                        <div>
                                            <span className="text-[10px] font-semibold text-[#E5C158] uppercase tracking-wider block mb-1">
                                                {album.category}
                                            </span>
                                            <h3 className="font-bold text-zinc-100 text-sm line-clamp-1 group-hover:text-[#E5C158] transition-colors">
                                                {album.title}
                                            </h3>
                                            {album.description && (
                                                <p className="text-zinc-400 text-xs line-clamp-2 mt-1">
                                                    {album.description}
                                                </p>
                                            )}
                                        </div>

                                        {album.event_date && (
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                                <span>{album.event_date}</span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                            <button
                                                onClick={() => {
                                                    setAlbumFilter(album.title);
                                                    setActiveTab("photos");
                                                }}
                                                className="text-[#E5C158] hover:underline font-semibold flex items-center gap-1"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View Photos
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingAlbum(album);
                                                    setIsAlbumModalOpen(true);
                                                }}
                                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                                title="Edit Album"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* SECTION 2: PHOTO LIBRARY */}
            {(activeTab === "all" || activeTab === "photos") && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Images className="w-4 h-4 text-[#E5C158]" />
                            <h2 className="text-base font-bold text-zinc-100">
                                Campus Photo Library
                            </h2>
                            <span className="text-xs text-zinc-500">
                                ({filteredPhotos.length} photos)
                            </span>
                        </div>
                    </div>

                    {filteredPhotos.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-black/20 border border-white/5 text-zinc-400 text-xs">
                            <Images className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                            <p>No photographs found matching the active search/filters.</p>
                            <button
                                onClick={openCreatePhotoModal}
                                className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-200 transition-colors"
                            >
                                Add First Photo
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                            {filteredPhotos.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative rounded-xl bg-[#0E1117] border border-white/10 hover:border-[#D4AF37]/40 transition-all overflow-hidden flex flex-col shadow-sm"
                                >
                                    <div className="relative aspect-square w-full bg-black/60 overflow-hidden">
                                        <Image
                                            src={item.image_url}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            unoptimized
                                        />

                                        {/* Status badge */}
                                        <span
                                            className={`absolute top-2 left-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full backdrop-blur-md ${
                                                item.status === "published"
                                                    ? "bg-emerald-500/80 text-white"
                                                    : "bg-amber-500/80 text-white"
                                            }`}
                                        >
                                            {item.status}
                                        </span>

                                        {/* Sort order badge */}
                                        <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 text-zinc-300">
                                            #{item.sort_order}
                                        </span>
                                    </div>

                                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold text-zinc-200 text-xs line-clamp-1">
                                                {item.title}
                                            </h4>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="text-[10px] text-[#E5C158] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded font-medium">
                                                    {item.category}
                                                </span>
                                                {item.album_name && (
                                                    <span className="text-[10px] text-zinc-400 truncate">
                                                        • {item.album_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between">
                                            <button
                                                onClick={() => openEditPhotoModal(item)}
                                                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/5"
                                                title="Edit photo"
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePhoto(item)}
                                                className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/20"
                                                title="Delete photo"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Batch Photo Uploader Modal */}
            <BatchPhotoUploader
                isOpen={isBatchUploaderOpen}
                onClose={() => setIsBatchUploaderOpen(false)}
                availableAlbums={availableAlbumNames}
                onBatchComplete={() => {
                    router.refresh();
                }}
            />

            {/* Album Editor Modal */}
            <AlbumEditorModal
                isOpen={isAlbumModalOpen}
                onClose={() => setIsAlbumModalOpen(false)}
                album={editingAlbum}
                role={role}
                onSaved={() => router.refresh()}
            />

            {/* Single Photo Add/Edit Modal */}
            {isPhotoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#12141A] border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#171A23]">
                            <h3 className="font-bold text-white text-sm">
                                {editingPhoto ? "Edit Photograph Details" : "Add New Photograph"}
                            </h3>
                            <button
                                onClick={() => setIsPhotoModalOpen(false)}
                                className="text-zinc-400 hover:text-white p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSavePhoto} className="p-5 space-y-3.5 text-xs overflow-y-auto">
                            {photoError && (
                                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300">
                                    {photoError}
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                    Photo Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={photoTitle}
                                    onChange={(e) => setPhotoTitle(e.target.value)}
                                    placeholder="e.g. Mechanical Lab Students Demonstration"
                                    className="w-full h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 outline-none focus:border-[#D4AF37]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={photoCategory}
                                        onChange={(e) => setPhotoCategory(e.target.value)}
                                        className="w-full h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 outline-none focus:border-[#D4AF37]"
                                    >
                                        {GALLERY_CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                        Album
                                    </label>
                                    <input
                                        type="text"
                                        list="album-suggestions"
                                        value={photoAlbumName}
                                        onChange={(e) => setPhotoAlbumName(e.target.value)}
                                        placeholder="Type or select album..."
                                        className="w-full h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 outline-none focus:border-[#D4AF37]"
                                    />
                                    <datalist id="album-suggestions">
                                        {availableAlbumNames.map((name) => (
                                            <option key={name} value={name} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                    Image URL or Public Asset Path *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={photoImageUrl}
                                    onChange={(e) => setPhotoImageURL(e.target.value)}
                                    placeholder="https://... or /images/..."
                                    className="w-full h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 outline-none focus:border-[#D4AF37]"
                                />
                                {photoImageUrl && (
                                    <div className="mt-2 relative w-20 h-14 rounded-lg bg-black border border-white/10 overflow-hidden">
                                        <Image
                                            src={photoImageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                    Caption
                                </label>
                                <textarea
                                    rows={2}
                                    value={photoCaption}
                                    onChange={(e) => setPhotoCaption(e.target.value)}
                                    placeholder="Optional descriptive caption..."
                                    className="w-full p-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 outline-none focus:border-[#D4AF37] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        value={photoSortOrder}
                                        onChange={(e) =>
                                            setPhotoSortOrder(Number(e.target.value) || 0)
                                        }
                                        className="w-full h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 outline-none focus:border-[#D4AF37]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={photoStatus}
                                        onChange={(e) =>
                                            setPhotoStatus(
                                                e.target.value as "published" | "draft" | "archived"
                                            )
                                        }
                                        className="w-full h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 outline-none focus:border-[#D4AF37]"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsPhotoModalOpen(false)}
                                    className="px-3.5 py-1.5 rounded-lg text-zinc-300 hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingPhoto}
                                    className="px-4 py-1.5 rounded-lg font-bold bg-[#D4AF37] hover:bg-[#E5C158] text-black"
                                >
                                    {isSavingPhoto ? "Saving..." : "Save Photo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
