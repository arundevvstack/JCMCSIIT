"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
    ExternalLink,
    Eye,
    FileText,
    ImageOff,
    Images,
    Loader2,
    X,
} from "lucide-react";
import { AdminStatusBadge } from "./admin-primitives";

export interface AdminPreviewImageData {
    url: string;
    title: string;
    category?: string;
    album?: string;
    caption?: string;
    status?: string;
    altText?: string;
    dimensions?: string;
    fileSize?: string;
}

export interface AdminThumbnailProps {
    src: string;
    alt?: string;
    title?: string;
    category?: string;
    album?: string;
    caption?: string;
    status?: string;
    className?: string;
    onPreview?: (data: AdminPreviewImageData) => void;
}

/**
 * Reusable admin thumbnail component.
 * Displays a 70x55 px image with cover aspect ratio, loading state,
 * and broken-link fallback.
 */
export function AdminThumbnail({
    src,
    alt,
    title,
    category,
    album,
    caption,
    status,
    className = "",
    onPreview,
}: AdminThumbnailProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const displayTitle = title || alt || "Image Preview";

    if (!src || hasError) {
        return (
            <div
                className={`w-[70px] h-[55px] rounded-lg bg-[#0B0D12] border border-white/10 flex flex-col items-center justify-center text-zinc-500 gap-1 p-1 shrink-0 select-none ${className}`}
                title={hasError ? "Image failed to load" : "No image path specified"}
            >
                <ImageOff className="h-3.5 w-3.5 text-zinc-600" />
                <span className="text-[9px] font-mono leading-none text-zinc-500">
                    {hasError ? "Failed" : "No image"}
                </span>
            </div>
        );
    }

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onPreview) {
            onPreview({
                url: src,
                title: displayTitle,
                category,
                album,
                caption,
                status,
            });
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            title={`Click to preview: ${displayTitle}`}
            aria-label={`Preview ${displayTitle}`}
            className={`relative w-[70px] h-[55px] rounded-lg bg-[#0B0D12] border border-white/10 hover:border-[#D4AF37]/70 transition-all overflow-hidden shrink-0 group cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${className}`}
        >
            {isLoading ? (
                <div className="absolute inset-0 bg-zinc-800/80 animate-pulse flex items-center justify-center">
                    <Loader2 className="h-3.5 w-3.5 text-zinc-500 animate-spin" />
                </div>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt || displayTitle}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-108 ${
                    isLoading ? "opacity-0" : "opacity-100"
                }`}
            />
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Eye className="h-4 w-4 text-[#E5C158] drop-shadow" />
            </div>
        </button>
    );
}

export interface AdminImagePreviewModalProps {
    previewImage: AdminPreviewImageData | null;
    onClose: () => void;
}

const emptySubscribe = () => () => {};

/**
 * Reusable full-size uncropped image preview modal.
 * Supports Escape key, outside click dismissal, Open Original, and metadata.
 */
export function AdminImagePreviewModal({
    previewImage,
    onClose,
}: AdminImagePreviewModalProps) {
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    useEffect(() => {
        if (!previewImage) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [previewImage, onClose]);

    if (!previewImage) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`Preview of ${previewImage.title}`}
        >
            <div
                className="relative w-full max-w-4xl max-h-[92vh] bg-[#12141C] border border-[#D4AF37]/35 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1017] gap-4">
                    <div className="min-w-0 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/25 shrink-0">
                            <Images className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-zinc-100 truncate">
                                {previewImage.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                {previewImage.category ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/25">
                                        {previewImage.category}
                                    </span>
                                ) : null}
                                {previewImage.album ? (
                                    <span className="text-[11px] text-zinc-400 font-mono">
                                        {previewImage.album}
                                    </span>
                                ) : null}
                                {previewImage.status ? (
                                    <AdminStatusBadge
                                        status={previewImage.status}
                                    />
                                ) : null}
                                {previewImage.dimensions ? (
                                    <span className="text-[10px] text-zinc-500 font-mono">
                                        {previewImage.dimensions}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
                        aria-label="Close image preview"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body - Uncropped Image */}
                <div className="relative flex-1 min-h-[260px] max-h-[68vh] bg-[#090A0D] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewImage.url}
                        alt={previewImage.altText || previewImage.title}
                        className="max-h-[64vh] max-w-full w-auto object-contain rounded-lg shadow-xl"
                    />
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0E1017] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
                    <div className="min-w-0 flex-1">
                        {previewImage.caption ? (
                            <p className="italic text-zinc-300 max-w-xl truncate">
                                {previewImage.caption}
                            </p>
                        ) : (
                            <span className="text-zinc-500 font-mono text-[11px] truncate block max-w-xl">
                                {previewImage.url}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                        <a
                            href={previewImage.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#D4AF37]/15 text-[#E5C158] text-xs font-semibold border border-white/[0.08] hover:border-[#D4AF37]/30 transition-colors"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open Original
                        </a>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isClient && typeof document !== "undefined") {
        return createPortal(modalContent, document.body);
    }
    return modalContent;
}

export interface AdminFormImagePreviewProps {
    url: string;
    title?: string;
    category?: "image" | "document";
    onClear?: () => void;
    onPreview?: (data: AdminPreviewImageData) => void;
}

/**
 * Reusable image/document preview card for create and edit forms.
 * Displays the current value, loading state, error fallback, open original button, and clear button.
 */
export function AdminFormImagePreview({
    url,
    title = "Asset Preview",
    category,
    onClear,
    onPreview,
}: AdminFormImagePreviewProps) {
    if (!url) return null;

    const isPdf =
        category === "document" ||
        url.toLowerCase().endsWith(".pdf") ||
        url.toLowerCase().includes("/pdfs/");

    if (isPdf) {
        return (
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <span className="font-semibold text-zinc-200 block truncate">
                            Document / Circular PDF
                        </span>
                        <span className="font-mono text-[11px] text-zinc-400 block truncate">
                            {url}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-[#E5C158] text-xs font-medium transition-colors"
                        title="Open PDF document in new tab"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View</span>
                    </a>
                    {onClear ? (
                        <button
                            type="button"
                            onClick={onClear}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                            title="Clear value"
                            aria-label="Clear document"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs">
            <div className="flex items-center gap-3 min-w-0">
                <AdminThumbnail
                    src={url}
                    alt={title}
                    title={title}
                    onPreview={onPreview}
                />
                <div className="min-w-0 space-y-0.5">
                    <span className="font-semibold text-zinc-200 block text-xs">
                        Current Image Preview
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400 block truncate max-w-xs sm:max-w-md">
                        {url}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                        Click thumbnail to inspect full resolution
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                {onPreview ? (
                    <button
                        type="button"
                        onClick={() =>
                            onPreview({
                                url,
                                title,
                            })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37]/15 text-zinc-300 hover:text-[#E5C158] text-xs font-medium border border-white/[0.08] transition-colors cursor-pointer"
                        title="Preview full image"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                    </button>
                ) : null}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E5C158] hover:bg-white/[0.05] transition-colors"
                    title="Open original image in new tab"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {onClear ? (
                    <button
                        type="button"
                        onClick={onClear}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                        title="Clear image"
                        aria-label="Clear image"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}
            </div>
        </div>
    );
}
