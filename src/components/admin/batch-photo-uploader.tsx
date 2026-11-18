"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Images,
    FileImage,
    Check,
} from "lucide-react";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/types/gallery";
import { saveBatchGalleryItems, type BatchGalleryItemInput } from "@/actions/cms";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_MIMES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
];

export interface BatchFileItem {
    id: string;
    file: File;
    previewUrl: string;
    status: "idle" | "uploading" | "success" | "error";
    progress: number;
    error?: string;
    uploadedUrl?: string;
}

interface BatchPhotoUploaderProps {
    isOpen: boolean;
    onClose: () => void;
    availableAlbums: string[];
    onBatchComplete: () => void;
}

export function BatchPhotoUploader({
    isOpen,
    onClose,
    availableAlbums,
    onBatchComplete,
}: BatchPhotoUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<BatchFileItem[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<string>("");
    const [customAlbum, setCustomAlbum] = useState<string>("");
    const [selectedCategory, setSelectedCategory] =
        useState<GalleryCategory>("College Events");
    const [targetStatus, setTargetStatus] = useState<"published" | "draft">(
        "published"
    );
    const [isUploading, setIsUploading] = useState(false);
    const [batchSummary, setBatchSummary] = useState<{
        total: number;
        success: number;
        failed: number;
    } | null>(null);

    if (!isOpen) return null;

    const handleFilesAdded = (incomingFiles: FileList | File[]) => {
        const fileArr = Array.from(incomingFiles);
        const newItems: BatchFileItem[] = [];

        for (const file of fileArr) {
            const extValid = ALLOWED_IMAGE_MIMES.includes(file.type.toLowerCase());
            if (!extValid) {
                continue;
            }
            if (file.size > MAX_IMAGE_BYTES) {
                newItems.push({
                    id: `${file.name}-${Date.now()}-${Math.random()}`,
                    file,
                    previewUrl: "",
                    status: "error",
                    progress: 0,
                    error: `Exceeds 5 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
                });
                continue;
            }

            const previewUrl = URL.createObjectURL(file);
            newItems.push({
                id: `${file.name}-${Date.now()}-${Math.random()}`,
                file,
                previewUrl,
                status: "idle",
                progress: 0,
            });
        }

        setFiles((prev) => [...prev, ...newItems]);
        setBatchSummary(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (isUploading) return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesAdded(e.dataTransfer.files);
        }
    };

    const handleRemoveFile = (id: string) => {
        if (isUploading) return;
        setFiles((prev) => {
            const found = prev.find((f) => f.id === id);
            if (found && found.previewUrl) {
                URL.revokeObjectURL(found.previewUrl);
            }
            return prev.filter((f) => f.id === id);
        });
    };

    const effectiveAlbum = (
        selectedAlbum === "__custom__" ? customAlbum : selectedAlbum
    ).trim();

    const startUploadBatch = async () => {
        if (files.length === 0 || isUploading) return;

        setIsUploading(true);
        setBatchSummary(null);

        let successCount = 0;
        let failCount = 0;
        const uploadedItemsToRegister: BatchGalleryItemInput[] = [];

        // Upload each file sequentially to /api/admin/media/upload
        for (let i = 0; i < files.length; i++) {
            const item = files[i];
            if (item.status === "error" && item.error?.includes("Exceeds")) {
                failCount++;
                continue;
            }

            // Update item to uploading
            setFiles((prev) =>
                prev.map((f, idx) =>
                    idx === i ? { ...f, status: "uploading", progress: 20 } : f
                )
            );

            try {
                const fd = new FormData();
                fd.append("file", item.file);
                fd.append("bucket_id", "galleries");
                fd.append("caption", `${item.file.name.replace(/\.[^/.]+$/, "")}`);

                const response = await fetch("/api/admin/media/upload", {
                    method: "POST",
                    body: fd,
                });

                const data = await response.json();

                if (!response.ok || !data.ok || !data.media?.public_url) {
                    throw new Error(data.error || "Upload failed");
                }

                // Update item to success
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? {
                                  ...f,
                                  status: "success",
                                  progress: 100,
                                  uploadedUrl: data.media.public_url,
                              }
                            : f
                    )
                );

                successCount++;

                // Format title from filename
                const cleanTitle = item.file.name
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[-_]+/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());

                uploadedItemsToRegister.push({
                    title: cleanTitle,
                    category: selectedCategory,
                    album_name: effectiveAlbum || undefined,
                    image_url: data.media.public_url,
                    caption: `Photo from ${effectiveAlbum || selectedCategory}`,
                    sort_order: i + 1,
                    status: targetStatus,
                });
            } catch (err: unknown) {
                failCount++;
                const message =
                    err instanceof Error ? err.message : "Upload error";
                setFiles((prev) =>
                    prev.map((f, idx) =>
                        idx === i
                            ? { ...f, status: "error", progress: 0, error: message }
                            : f
                    )
                );
            }
        }

        // Register successfully uploaded photos into public.gallery_items
        if (uploadedItemsToRegister.length > 0) {
            await saveBatchGalleryItems(uploadedItemsToRegister);
        }

        setIsUploading(false);
        setBatchSummary({
            total: files.length,
            success: successCount,
            failed: failCount,
        });

        if (successCount > 0) {
            onBatchComplete();
        }
    };

    const overallProgress =
        files.length > 0
            ? Math.round(
                  (files.filter(
                      (f) => f.status === "success" || f.status === "error"
                  ).length /
                      files.length) *
                      100
              )
            : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#12141A] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#171A23]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158]">
                            <Images className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">
                                Batch Upload Campus Photographs
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Select multiple images to upload directly to Supabase Storage and register into the Gallery.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                    {/* Destination Album & Category Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                                Target Album
                            </label>
                            <select
                                value={selectedAlbum}
                                onChange={(e) => setSelectedAlbum(e.target.value)}
                                disabled={isUploading}
                                className="w-full h-9 px-3 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 text-xs focus:border-[#D4AF37] outline-none"
                            >
                                <option value="">— Unassigned (Stand-alone) —</option>
                                {availableAlbums.map((alb) => (
                                    <option key={alb} value={alb}>
                                        {alb}
                                    </option>
                                ))}
                                <option value="__custom__">+ Create New Album...</option>
                            </select>
                            {selectedAlbum === "__custom__" && (
                                <input
                                    type="text"
                                    placeholder="Enter new album title"
                                    value={customAlbum}
                                    onChange={(e) => setCustomAlbum(e.target.value)}
                                    disabled={isUploading}
                                    className="mt-2 w-full h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-[#D4AF37]/40 text-zinc-200 text-xs outline-none"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value as GalleryCategory)
                                }
                                disabled={isUploading}
                                className="w-full h-9 px-3 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 text-xs focus:border-[#D4AF37] outline-none"
                            >
                                {GALLERY_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                                Initial Status
                            </label>
                            <select
                                value={targetStatus}
                                onChange={(e) =>
                                    setTargetStatus(e.target.value as "published" | "draft")
                                }
                                disabled={isUploading}
                                className="w-full h-9 px-3 rounded-lg bg-[#0B0D12] border border-white/10 text-zinc-200 text-xs focus:border-[#D4AF37] outline-none"
                            >
                                <option value="published">Published Immediately</option>
                                <option value="draft">Save as Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-[#D4AF37]/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04]"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={ALLOWED_IMAGE_MIMES.join(",")}
                            onChange={(e) => {
                                if (e.target.files) handleFilesAdded(e.target.files);
                            }}
                            className="hidden"
                        />
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#E5C158] flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-6 h-6" />
                        </div>
                        <p className="font-semibold text-zinc-200 text-sm">
                            Click to select multiple photographs or drag & drop here
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                            Supported: JPEG, PNG, WebP, AVIF up to 5 MB each.
                        </p>
                    </div>

                    {/* Progress Bar (Overall Batch) */}
                    {isUploading && (
                        <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/10">
                            <div className="flex justify-between text-xs font-semibold text-zinc-300">
                                <span>Uploading Batch...</span>
                                <span>{overallProgress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-300"
                                    style={{ width: `${overallProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Summary feedback banner */}
                    {batchSummary && (
                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>
                                    Batch complete: <strong>{batchSummary.success}</strong> photos uploaded & added to gallery.
                                    {batchSummary.failed > 0 && (
                                        <span className="text-rose-400 ml-2">
                                            ({batchSummary.failed} failed)
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
                                <span>Selected Images ({files.length})</span>
                                {!isUploading && (
                                    <button
                                        onClick={() => setFiles([])}
                                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                                {files.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5 gap-3"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {item.previewUrl ? (
                                                <div className="w-10 h-8 rounded bg-black relative overflow-hidden shrink-0">
                                                    <Image
                                                        src={item.previewUrl}
                                                        alt={item.file.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <FileImage className="w-6 h-6 text-zinc-500 shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-medium text-zinc-200 truncate">
                                                    {item.file.name}
                                                </p>
                                                <p className="text-[10px] text-zinc-500">
                                                    {(item.file.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {item.status === "uploading" && (
                                                <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                                            )}
                                            {item.status === "success" && (
                                                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                                    <Check className="w-3.5 h-3.5" /> Uploaded
                                                </span>
                                            )}
                                            {item.status === "error" && (
                                                <span className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {item.error || "Failed"}
                                                </span>
                                            )}
                                            {!isUploading && item.status !== "success" && (
                                                <button
                                                    onClick={() => handleRemoveFile(item.id)}
                                                    className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#171A23] flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                        {files.filter((f) => f.status === "idle").length} photos ready to upload
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={isUploading}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/5 transition-colors disabled:opacity-50"
                        >
                            {batchSummary ? "Close" : "Cancel"}
                        </button>
                        <button
                            onClick={startUploadBatch}
                            disabled={
                                isUploading ||
                                files.filter((f) => f.status === "idle").length === 0
                            }
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#E5C158] text-black transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#D4AF37]/10"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload {files.filter((f) => f.status === "idle").length} Photos
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
