"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import {
    Check,
    FileText,
    Images,
    Loader2,
    Search,
    X,
} from "lucide-react";
import {
    fetchMediaPickerAssetsAction,
    type MediaPickerAsset,
} from "@/actions/cms";

export interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (publicUrl: string, asset: MediaPickerAsset) => void;
    category: "image" | "document";
    allowedBuckets?: readonly string[];
    title?: string;
    currentValue?: string;
}

function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaPickerModal({
    isOpen,
    onClose,
    onSelect,
    category,
    allowedBuckets,
    title,
    currentValue,
}: MediaPickerModalProps) {
    const [assets, setAssets] = useState<MediaPickerAsset[]>([]);
    const [isPending, startTransition] = useTransition();
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [bucketFilter, setBucketFilter] = useState<string>("ALL");
    const [selectedUrl, setSelectedUrl] = useState<string>(currentValue ?? "");
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>(
        {}
    );

    const defaultBuckets =
        category === "image"
            ? ["cms-media", "galleries", "faculty-profiles"]
            : ["cms-documents", "pdfs"];

    const supportedBuckets = allowedBuckets && allowedBuckets.length > 0
        ? allowedBuckets
        : defaultBuckets;

    const allowedBucketsKey = allowedBuckets ? allowedBuckets.join("|") : "";

    useEffect(() => {
        if (isOpen && !hasLoaded) {
            startTransition(async () => {
                setError(null);
                const res = await fetchMediaPickerAssetsAction(
                    category,
                    allowedBuckets
                );
                if (res.ok && res.assets) {
                    setAssets(res.assets);
                    setHasLoaded(true);
                } else {
                    setError(res.error || "Failed to load media assets.");
                }
            });
        }
    }, [isOpen, hasLoaded, category, allowedBuckets, allowedBucketsKey]);

    if (!isOpen) return null;

    // Filter by allowed buckets, active bucket filter, and search query
    const filteredAssets = assets.filter((asset) => {
        // Enforce allowed buckets constraint
        if (!supportedBuckets.includes(asset.bucket_id)) {
            return false;
        }

        if (bucketFilter !== "ALL" && asset.bucket_id !== bucketFilter) {
            return false;
        }

        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase().trim();
        const filenameMatch = asset.original_filename.toLowerCase().includes(q);
        const altMatch = (asset.alt_text ?? "").toLowerCase().includes(q);
        const captionMatch = (asset.caption ?? "").toLowerCase().includes(q);
        const pathMatch = asset.storage_path.toLowerCase().includes(q);

        return filenameMatch || altMatch || captionMatch || pathMatch;
    });

    const handleSelectAsset = (asset: MediaPickerAsset) => {
        setSelectedUrl(asset.public_url);
        onSelect(asset.public_url, asset);
        onClose();
    };

    const modalTitle =
        title ||
        (category === "image"
            ? "Select Image from Media Library"
            : "Select Document from Repository");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl rounded-2xl border border-white/[0.12] bg-[#12141C] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E1017]">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37]">
                            {category === "image" ? (
                                <Images className="h-4 w-4" />
                            ) : (
                                <FileText className="h-4 w-4" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-100">
                                {modalTitle}
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                                Choose an existing registered asset from{" "}
                                <code className="text-[#E5C158]">
                                    public.media
                                </code>
                                .
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Toolbar: Search and Bucket Filters */}
                <div className="px-6 py-3.5 border-b border-white/[0.06] bg-[#0F1118] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search ${category === "image" ? "images" : "documents"}...`}
                                className="w-full rounded-xl border border-white/[0.1] bg-[#0A0B10] pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                            />
                            {searchQuery ? (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            ) : null}
                        </div>

                        {/* Bucket Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setBucketFilter("ALL")}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                                    bucketFilter === "ALL"
                                        ? "bg-[#D4AF37] text-black font-semibold"
                                        : "bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]"
                                }`}
                            >
                                All ({filteredAssets.length})
                            </button>
                            {supportedBuckets.map((bucket) => {
                                const count = assets.filter(
                                    (a) => a.bucket_id === bucket
                                ).length;
                                return (
                                    <button
                                        key={bucket}
                                        type="button"
                                        onClick={() => setBucketFilter(bucket)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                                            bucketFilter === bucket
                                                ? "bg-[#D4AF37] text-black font-semibold"
                                                : "bg-white/[0.04] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]"
                                        }`}
                                    >
                                        {bucket} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {isPending ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin mb-3" />
                            <p className="text-xs text-zinc-400">
                                Fetching repository assets from public.media...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-5 text-center">
                            <p className="text-xs text-rose-300 font-medium">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setHasLoaded(false);
                                }}
                                className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.15] text-zinc-200 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center px-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] mb-3">
                                {category === "image" ? (
                                    <Images className="h-6 w-6" />
                                ) : (
                                    <FileText className="h-6 w-6" />
                                )}
                            </div>
                            <h4 className="text-sm font-semibold text-zinc-200">
                                No {category === "image" ? "Images" : "Documents"} Uploaded Yet
                            </h4>
                            <p className="text-xs text-zinc-400 max-w-sm mt-1">
                                Upload assets first via the{" "}
                                {category === "image"
                                    ? "Media Library (/admin/media)"
                                    : "Document Manager (/admin/documents)"}
                                . They will appear here for selection automatically.
                            </p>
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <p className="text-xs text-zinc-400">
                                No assets match &quot;{searchQuery}&quot; in the selected bucket.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setBucketFilter("ALL");
                                }}
                                className="mt-3 px-3 py-1 rounded-lg text-xs text-[#E5C158] hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : category === "image" ? (
                        /* Image Grid Layout */
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredAssets.map((asset) => {
                                const isSelected =
                                    selectedUrl === asset.public_url;
                                const isBroken = brokenImages[asset.id];

                                return (
                                    <div
                                        key={asset.id}
                                        onClick={() => handleSelectAsset(asset)}
                                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                                            isSelected
                                                ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/40 bg-[#D4AF37]/5"
                                                : "border-white/[0.08] bg-[#0E1017] hover:border-[#D4AF37]/60 hover:bg-white/[0.02]"
                                        }`}
                                    >
                                        {/* Thumbnail Container */}
                                        <div className="relative aspect-video w-full bg-[#08090C] overflow-hidden flex items-center justify-center">
                                            {isBroken ? (
                                                <div className="text-[10px] text-zinc-500 flex flex-col items-center gap-1">
                                                    <Images className="h-5 w-5 text-zinc-600" />
                                                    <span>Preview unavailable</span>
                                                </div>
                                            ) : (
                                                <Image
                                                    src={asset.public_url}
                                                    alt={
                                                        asset.alt_text ||
                                                        asset.original_filename
                                                    }
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                                                    onError={() =>
                                                        setBrokenImages(
                                                            (prev) => ({
                                                                ...prev,
                                                                [asset.id]: true,
                                                            })
                                                        )
                                                    }
                                                />
                                            )}

                                            {/* Selected Check Badge */}
                                            {isSelected ? (
                                                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-lg">
                                                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                                                </div>
                                            ) : null}

                                            {/* Bucket Pill */}
                                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/75 text-[#E5C158] border border-white/10 backdrop-blur-xs">
                                                {asset.bucket_id}
                                            </span>
                                        </div>

                                        {/* Metadata Footer */}
                                        <div className="p-2.5 space-y-1">
                                            <div
                                                className="text-xs font-medium text-zinc-200 truncate group-hover:text-[#E5C158] transition-colors"
                                                title={
                                                    asset.alt_text ||
                                                    asset.original_filename
                                                }
                                            >
                                                {asset.alt_text ||
                                                    asset.original_filename}
                                            </div>
                                            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                                                <span>
                                                    {asset.width && asset.height
                                                        ? `${asset.width}×${asset.height}`
                                                        : "Image"}
                                                </span>
                                                <span>
                                                    {formatBytes(
                                                        asset.size_bytes
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Document List Layout */
                        <div className="space-y-2">
                            {filteredAssets.map((asset) => {
                                const isSelected =
                                    selectedUrl === asset.public_url;

                                return (
                                    <div
                                        key={asset.id}
                                        onClick={() => handleSelectAsset(asset)}
                                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                                            isSelected
                                                ? "border-[#D4AF37] bg-[#D4AF37]/5 ring-1 ring-[#D4AF37]/40"
                                                : "border-white/[0.08] bg-[#0E1017] hover:border-[#D4AF37]/50 hover:bg-white/[0.02]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0 pr-4">
                                            <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-semibold text-zinc-200 truncate">
                                                    {asset.alt_text ||
                                                        asset.original_filename}
                                                </div>
                                                <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                                                    {asset.original_filename}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[#E5C158]">
                                                {asset.bucket_id}
                                            </span>
                                            <span className="text-xs font-mono text-zinc-400">
                                                {formatBytes(asset.size_bytes)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectAsset(asset);
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? "bg-[#D4AF37] text-black"
                                                        : "bg-white/[0.08] hover:bg-[#D4AF37] hover:text-black text-zinc-200"
                                                }`}
                                            >
                                                {isSelected
                                                    ? "Selected"
                                                    : "Select"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 border-t border-white/[0.08] bg-[#0E1017] flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                        {filteredAssets.length} asset{filteredAssets.length === 1 ? "" : "s"} available
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl text-xs font-medium bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
