"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Check,
    Copy,
    ExternalLink,
    Eye,
    Images,
    Lock,
    Save,
    Search,
    Upload,
    X,
} from "lucide-react";
import { updateMediaMetadataAction } from "@/actions/cms";
import type { AdminRole } from "@/lib/auth/rbac";
import {
    AdminEmptyState,
    AdminHonestNotice,
    AdminStatusBadge,
} from "@/components/admin/admin-primitives";

export const IMAGE_BUCKETS = [
    "cms-media",
    "galleries",
    "faculty-profiles",
] as const;

export type ImageBucketId = (typeof IMAGE_BUCKETS)[number];

export interface MediaAssetRecord {
    id: string;
    bucket_id: string;
    storage_path: string;
    original_filename: string;
    public_url: string;
    mime_type: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    alt_text: string | null;
    caption: string | null;
    uploaded_by: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at?: string;
}

const MAX_IMAGE_BYTES = 5_242_880; // 5 MB
const ALLOWED_IMAGE_MIMES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
]);

const BUCKET_LABELS: Record<ImageBucketId, string> = {
    "cms-media": "cms-media (Pages, News & Events)",
    galleries: "galleries (Campus Albums)",
    "faculty-profiles": "faculty-profiles (Faculty Portraits)",
};

const SHORT_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
] as const;

export function formatMediaBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Deterministic UTC date formatter so SSR and client hydration always match.
 */
export function formatMediaDate(isoString: string): string {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    const month = SHORT_MONTHS[d.getUTCMonth()];
    const day = String(d.getUTCDate()).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}

export function canRoleUploadImage(role: AdminRole): boolean {
    return role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR";
}

export function canRoleEditAssetMetadata(
    role: AdminRole,
    currentAdminId: string,
    asset: MediaAssetRecord
): boolean {
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
        return true;
    }
    if (role === "EDITOR") {
        return (
            Boolean(asset.uploaded_by) &&
            asset.uploaded_by === currentAdminId &&
            !asset.is_archived
        );
    }
    return false;
}

interface UploadApiResponse {
    ok?: boolean;
    deduplicated?: boolean;
    message?: string;
    error?: string;
    media?: MediaAssetRecord;
}

export function MediaLibraryManager({
    initialAssets,
    role,
    currentAdminId,
    loadError = null,
}: {
    initialAssets: MediaAssetRecord[];
    role: AdminRole;
    currentAdminId: string;
    loadError?: string | null;
}) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const uploadingRef = useRef(false);

    const [assets, setAssets] = useState<MediaAssetRecord[]>(initialAssets);
    const [searchQuery, setSearchQuery] = useState("");
    const [bucketFilter, setBucketFilter] = useState<"ALL" | ImageBucketId>(
        "ALL"
    );

    // Upload form state
    const [targetBucket, setTargetBucket] =
        useState<ImageBucketId>("cms-media");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadAltText, setUploadAltText] = useState("");
    const [uploadCaption, setUploadCaption] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadFeedback, setUploadFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Preview & metadata modal state
    const [selectedAsset, setSelectedAsset] = useState<MediaAssetRecord | null>(
        null
    );
    const [metaAltText, setMetaAltText] = useState("");
    const [metaCaption, setMetaCaption] = useState("");
    const [metaFeedback, setMetaFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [isSavingMeta, startMetaTransition] = useTransition();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [brokenImageIds, setBrokenImageIds] = useState<
        Record<string, boolean>
    >({});

    const canUpload = canRoleUploadImage(role);

    const filteredAssets = assets.filter((asset) => {
        if (bucketFilter !== "ALL" && asset.bucket_id !== bucketFilter) {
            return false;
        }
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            asset.original_filename.toLowerCase().includes(q) ||
            (asset.alt_text ?? "").toLowerCase().includes(q) ||
            (asset.caption ?? "").toLowerCase().includes(q) ||
            asset.storage_path.toLowerCase().includes(q)
        );
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadFeedback(null);
        const file = e.target.files?.[0] ?? null;
        if (!file) {
            setSelectedFile(null);
            return;
        }

        const normalizedType = (file.type || "").toLowerCase();
        if (normalizedType && !ALLOWED_IMAGE_MIMES.has(normalizedType)) {
            setSelectedFile(null);
            e.target.value = "";
            setUploadFeedback({
                type: "error",
                text: "Unsupported image format. Allowed formats: JPEG, PNG, WebP, or AVIF.",
            });
            return;
        }

        if (file.size === 0) {
            setSelectedFile(null);
            e.target.value = "";
            setUploadFeedback({
                type: "error",
                text: "Selected image file is empty.",
            });
            return;
        }

        if (file.size > MAX_IMAGE_BYTES) {
            setSelectedFile(null);
            e.target.value = "";
            setUploadFeedback({
                type: "error",
                text: `File size (${formatMediaBytes(file.size)}) exceeds the 5 MB limit for image buckets.`,
            });
            return;
        }

        setSelectedFile(file);
    };

    const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canUpload || uploadingRef.current || isUploading) {
            return;
        }

        if (!selectedFile) {
            setUploadFeedback({
                type: "error",
                text: "Please choose a JPEG, PNG, WebP, or AVIF image to upload.",
            });
            return;
        }

        const payload = new FormData();
        payload.set("bucket_id", targetBucket);
        payload.set("file", selectedFile);
        if (uploadAltText.trim()) {
            payload.set("alt_text", uploadAltText.trim());
        }
        if (uploadCaption.trim()) {
            payload.set("caption", uploadCaption.trim());
        }

        uploadingRef.current = true;
        setIsUploading(true);
        setUploadProgress(5);
        setUploadFeedback(null);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/media/upload", true);

        xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable && evt.total > 0) {
                const pct = Math.min(
                    95,
                    Math.max(5, Math.round((evt.loaded / evt.total) * 95))
                );
                setUploadProgress(pct);
            }
        };

        xhr.onload = () => {
            uploadingRef.current = false;
            setIsUploading(false);

            let parsed: UploadApiResponse = {};
            try {
                parsed = JSON.parse(xhr.responseText) as UploadApiResponse;
            } catch {
                parsed = {};
            }

            if (xhr.status >= 200 && xhr.status < 300 && parsed.ok && parsed.media) {
                setUploadProgress(100);
                const newMedia = parsed.media;

                setAssets((prev) => {
                    const exists = prev.some((item) => item.id === newMedia.id);
                    return exists
                        ? prev.map((item) =>
                              item.id === newMedia.id ? newMedia : item
                          )
                        : [newMedia, ...prev];
                });

                setSelectedFile(null);
                setUploadAltText("");
                setUploadCaption("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                setUploadFeedback({
                    type: "success",
                    text:
                        parsed.message ||
                        (parsed.deduplicated
                            ? "Identical image already registered; existing asset selected."
                            : "Image uploaded to Supabase Storage and registered in public.media."),
                });

                router.refresh();
            } else {
                setUploadProgress(0);
                setUploadFeedback({
                    type: "error",
                    text:
                        parsed.error ||
                        `Upload failed with HTTP ${xhr.status}. Please verify file format and permissions.`,
                });
            }
        };

        xhr.onerror = () => {
            uploadingRef.current = false;
            setIsUploading(false);
            setUploadProgress(0);
            setUploadFeedback({
                type: "error",
                text: "Network error while uploading image. Please check your connection and try again.",
            });
        };

        xhr.send(payload);
    };

    const openInspector = (asset: MediaAssetRecord) => {
        setSelectedAsset(asset);
        setMetaAltText(asset.alt_text ?? "");
        setMetaCaption(asset.caption ?? "");
        setMetaFeedback(null);
    };

    const closeInspector = () => {
        setSelectedAsset(null);
        setMetaFeedback(null);
    };

    const handleCopyUrl = async (id: string, url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => {
                setCopiedId((prev) => (prev === id ? null : prev));
            }, 2000);
        } catch {
            // Clipboard API may be restricted in non-HTTPS contexts; ignore safely.
        }
    };

    const handleMetadataSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedAsset) return;
        if (!canRoleEditAssetMetadata(role, currentAdminId, selectedAsset)) {
            return;
        }

        const fd = new FormData();
        fd.set("id", selectedAsset.id);
        fd.set("alt_text", metaAltText);
        fd.set("caption", metaCaption);
        setMetaFeedback(null);

        startMetaTransition(async () => {
            const res = await updateMediaMetadataAction(fd);
            if (res.ok) {
                const updatedAsset: MediaAssetRecord = {
                    ...selectedAsset,
                    alt_text: metaAltText.trim() || null,
                    caption: metaCaption.trim() || null,
                };
                setSelectedAsset(updatedAsset);
                setAssets((prev) =>
                    prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
                );
                setMetaFeedback({
                    type: "success",
                    text: res.message || "Alt text and caption updated.",
                });
                router.refresh();
            } else {
                setMetaFeedback({
                    type: "error",
                    text: res.error || "Unable to update image metadata.",
                });
            }
        });
    };

    const canEditSelected = selectedAsset
        ? canRoleEditAssetMetadata(role, currentAdminId, selectedAsset)
        : false;

    return (
        <div className="space-y-6">
            {loadError ? (
                <AdminHonestNotice
                    title="Unable to load media records from Supabase"
                    variant="restricted"
                >
                    {loadError}
                </AdminHonestNotice>
            ) : null}

            {/* Role-Governed Upload Panel */}
            {canUpload ? (
                <form
                    onSubmit={handleUploadSubmit}
                    className="rounded-2xl border border-[#D4AF37]/25 bg-[#12141C] p-6 space-y-5"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.07]">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                <Upload className="h-4 w-4 text-[#D4AF37]" />
                                Upload New Image to Supabase Storage
                            </h3>
                            <p className="text-xs text-zinc-400 mt-1">
                                Accepts verified JPEG, PNG, WebP, or AVIF up to{" "}
                                <strong className="text-zinc-200">5 MB</strong>{" "}
                                with automatic SHA-256 deduplication and{" "}
                                <code className="text-[#E5C158]">
                                    public.media
                                </code>{" "}
                                registration.
                            </p>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                            Max 5 MB · No Overwrites
                        </span>
                    </div>

                    {uploadFeedback ? (
                        <div
                            role="alert"
                            className={`rounded-xl px-4 py-3 text-xs font-medium border flex items-center justify-between gap-3 ${
                                uploadFeedback.type === "success"
                                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                                    : "bg-red-950/40 border-red-500/30 text-red-200"
                            }`}
                        >
                            <span>{uploadFeedback.text}</span>
                            <button
                                type="button"
                                onClick={() => setUploadFeedback(null)}
                                className="text-zinc-400 hover:text-zinc-100"
                                aria-label="Dismiss notification"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                Target Image Bucket *
                            </label>
                            <select
                                value={targetBucket}
                                disabled={isUploading}
                                onChange={(e) =>
                                    setTargetBucket(
                                        e.target.value as ImageBucketId
                                    )
                                }
                                className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 outline-none disabled:opacity-60"
                            >
                                {IMAGE_BUCKETS.map((b) => (
                                    <option key={b} value={b}>
                                        {BUCKET_LABELS[b]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-8">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                Image File (JPEG, PNG, WebP, AVIF) *
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                disabled={isUploading}
                                onChange={handleFileSelect}
                                className="w-full h-10 px-3 py-1.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-200 file:mr-3 file:rounded-lg file:border-0 file:bg-[#D4AF37]/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#E5C158] hover:file:bg-[#D4AF37]/30 outline-none disabled:opacity-60 cursor-pointer"
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                Accessibility Alt Text (Optional)
                            </label>
                            <input
                                type="text"
                                maxLength={500}
                                value={uploadAltText}
                                disabled={isUploading}
                                onChange={(e) =>
                                    setUploadAltText(e.target.value)
                                }
                                placeholder="Describe the image for screen readers..."
                                className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none disabled:opacity-60"
                            />
                        </div>

                        <div className="md:col-span-6">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                Caption (Optional)
                            </label>
                            <input
                                type="text"
                                maxLength={1000}
                                value={uploadCaption}
                                disabled={isUploading}
                                onChange={(e) =>
                                    setUploadCaption(e.target.value)
                                }
                                placeholder="Optional credit or display caption..."
                                className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none disabled:opacity-60"
                            />
                        </div>
                    </div>

                    {isUploading ? (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs text-zinc-300">
                                <span>
                                    Uploading &amp; verifying binary signature...
                                </span>
                                <span className="font-mono text-[#E5C158]">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-[#0B0D12] overflow-hidden border border-white/[0.08]">
                                <div
                                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <span className="text-xs text-zinc-400">
                            {selectedFile
                                ? `Selected: ${selectedFile.name} (${formatMediaBytes(selectedFile.size)})`
                                : "No file selected yet."}
                        </span>
                        <button
                            type="submit"
                            disabled={isUploading || !selectedFile}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <Upload className="h-4 w-4" />
                            {isUploading ? "Uploading..." : "Upload Image"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="rounded-2xl border border-[#D4AF37]/25 bg-amber-950/20 px-5 py-3.5 flex items-center gap-3 text-xs text-[#E5C158]">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>
                        <strong>Read-Only Media View:</strong> Publisher
                        accounts can browse, preview, and copy image URLs for
                        review, while new uploads and metadata edits are
                        restricted to Editor, Admin, and Super Admin accounts.
                    </span>
                </div>
            )}

            {/* Search & Bucket Filter Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#12141C] p-4 rounded-2xl border border-white/[0.07]">
                <div className="relative flex-1 max-w-md">
                    <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by filename, alt text, caption, or path..."
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setBucketFilter("ALL")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            bucketFilter === "ALL"
                                ? "bg-[#D4AF37]/15 text-[#E5C158] border-[#D4AF37]/35"
                                : "bg-[#0B0D12] text-zinc-400 border-white/[0.08] hover:text-zinc-200"
                        }`}
                    >
                        All Buckets ({assets.length})
                    </button>
                    {IMAGE_BUCKETS.map((b) => {
                        const count = assets.filter(
                            (a) => a.bucket_id === b
                        ).length;
                        const active = bucketFilter === b;
                        return (
                            <button
                                key={b}
                                type="button"
                                onClick={() => setBucketFilter(b)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-colors cursor-pointer ${
                                    active
                                        ? "bg-[#D4AF37]/15 text-[#E5C158] border-[#D4AF37]/35"
                                        : "bg-[#0B0D12] text-zinc-400 border-white/[0.08] hover:text-zinc-200"
                                }`}
                            >
                                {b} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Responsive Thumbnail Grid */}
            {assets.length === 0 ? (
                <AdminEmptyState
                    icon={Images}
                    title="No Uploaded Storage Images Registered Yet"
                    description="Upload a JPEG, PNG, WebP, or AVIF image above to register it in public.media. Existing static images in /public remain untouched."
                />
            ) : filteredAssets.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-[#12141C] p-10 text-center space-y-3">
                    <p className="text-sm font-semibold text-zinc-200">
                        No image assets match your current search or bucket
                        filter.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery("");
                            setBucketFilter("ALL");
                        }}
                        className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-[#E5C158] cursor-pointer"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => {
                        const isBroken = Boolean(brokenImageIds[asset.id]);
                        const dimensionsLabel =
                            asset.width && asset.height
                                ? `${asset.width} × ${asset.height} px`
                                : "Dimensions N/A";

                        return (
                            <div
                                key={asset.id}
                                className="rounded-2xl border border-white/[0.08] bg-[#12141C] hover:border-[#D4AF37]/35 transition-all overflow-hidden flex flex-col"
                            >
                                <button
                                    type="button"
                                    onClick={() => openInspector(asset)}
                                    className="relative aspect-[4/3] w-full bg-[#090A0D] overflow-hidden border-b border-white/[0.06] group cursor-pointer"
                                >
                                    {isBroken ? (
                                        <div className="h-full w-full flex flex-col items-center justify-center text-zinc-500 text-xs gap-1.5 p-4">
                                            <Images className="h-6 w-6 text-zinc-600" />
                                            <span>Preview unavailable</span>
                                        </div>
                                    ) : (
                                        <Image
                                            src={asset.public_url}
                                            alt={
                                                asset.alt_text ||
                                                asset.original_filename
                                            }
                                            width={asset.width || 640}
                                            height={asset.height || 480}
                                            unoptimized
                                            onError={() =>
                                                setBrokenImageIds((prev) => ({
                                                    ...prev,
                                                    [asset.id]: true,
                                                }))
                                            }
                                            className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300"
                                        />
                                    )}
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs border border-white/10 font-mono text-[10px] text-[#E5C158]">
                                            {asset.bucket_id}
                                        </span>
                                    </div>
                                    <div className="absolute top-2.5 right-2.5">
                                        <AdminStatusBadge
                                            status={
                                                asset.is_archived
                                                    ? "archived"
                                                    : "active"
                                            }
                                        />
                                    </div>
                                </button>

                                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                                    <div className="space-y-1 min-w-0">
                                        <div
                                            title={asset.original_filename}
                                            className="text-xs font-bold text-zinc-100 truncate"
                                        >
                                            {asset.original_filename}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-400">
                                            <span>
                                                {formatMediaBytes(
                                                    Number(asset.size_bytes)
                                                )}
                                            </span>
                                            <span>·</span>
                                            <span>{dimensionsLabel}</span>
                                        </div>
                                        <div className="text-[11px] text-zinc-500">
                                            Uploaded{" "}
                                            {formatMediaDate(asset.created_at)}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openInspector(asset)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37]/15 text-xs font-semibold text-zinc-200 hover:text-[#E5C158] transition-colors cursor-pointer"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            Inspect
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopyUrl(
                                                    asset.id,
                                                    asset.public_url
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0B0D12] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
                                        >
                                            {copiedId === asset.id ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                    <span className="text-emerald-300">
                                                        Copied
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5 text-zinc-400" />
                                                    <span>Copy URL</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Image Preview & Metadata Editor Modal */}
            {selectedAsset ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                    <div className="w-full max-w-3xl max-h-[90vh] bg-[#12141C] border border-[#D4AF37]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0E1017] flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-zinc-50 truncate">
                                    {selectedAsset.original_filename}
                                </h3>
                                <p className="text-[11px] font-mono text-zinc-400 truncate">
                                    {selectedAsset.bucket_id}/
                                    {selectedAsset.storage_path}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeInspector}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
                                aria-label="Close preview modal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Full Preview */}
                            <div className="rounded-2xl bg-[#090A0D] border border-white/[0.07] p-4 flex items-center justify-center max-h-[340px] overflow-hidden">
                                <Image
                                    src={selectedAsset.public_url}
                                    alt={
                                        selectedAsset.alt_text ||
                                        selectedAsset.original_filename
                                    }
                                    width={selectedAsset.width || 960}
                                    height={selectedAsset.height || 720}
                                    unoptimized
                                    className="max-h-[300px] w-auto h-auto object-contain rounded-lg"
                                />
                            </div>

                            {/* Technical Metadata Summary */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-[#0B0D12] border border-white/[0.06]">
                                    <span className="text-zinc-500 block mb-0.5">
                                        File Size
                                    </span>
                                    <span className="font-semibold text-zinc-100">
                                        {formatMediaBytes(
                                            Number(selectedAsset.size_bytes)
                                        )}
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#0B0D12] border border-white/[0.06]">
                                    <span className="text-zinc-500 block mb-0.5">
                                        Dimensions
                                    </span>
                                    <span className="font-semibold text-zinc-100">
                                        {selectedAsset.width &&
                                        selectedAsset.height
                                            ? `${selectedAsset.width} × ${selectedAsset.height} px`
                                            : "N/A"}
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#0B0D12] border border-white/[0.06]">
                                    <span className="text-zinc-500 block mb-0.5">
                                        MIME Type
                                    </span>
                                    <span className="font-mono text-zinc-100">
                                        {selectedAsset.mime_type}
                                    </span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#0B0D12] border border-white/[0.06]">
                                    <span className="text-zinc-500 block mb-0.5">
                                        Uploaded
                                    </span>
                                    <span className="font-semibold text-zinc-100">
                                        {formatMediaDate(
                                            selectedAsset.created_at
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Public URL Copy Bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-[#0B0D12] border border-white/[0.08]">
                                <input
                                    type="text"
                                    readOnly
                                    value={selectedAsset.public_url}
                                    className="flex-1 bg-transparent font-mono text-xs text-zinc-300 outline-none truncate"
                                />
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopyUrl(
                                                selectedAsset.id,
                                                selectedAsset.public_url
                                            )
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-zinc-100 cursor-pointer"
                                    >
                                        <Copy className="h-3.5 w-3.5 text-[#D4AF37]" />
                                        {copiedId === selectedAsset.id
                                            ? "Copied!"
                                            : "Copy URL"}
                                    </button>
                                    <a
                                        href={selectedAsset.public_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-[#E5C158]"
                                    >
                                        Open
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>

                            {/* Role-Governed Alt Text & Caption Form */}
                            <form
                                onSubmit={handleMetadataSave}
                                className="space-y-4 pt-2 border-t border-white/[0.07]"
                            >
                                {!canEditSelected ? (
                                    <div className="rounded-xl bg-amber-950/30 border border-[#D4AF37]/30 px-4 py-2.5 flex items-center gap-2.5 text-xs text-[#E5C158]">
                                        <Lock className="h-4 w-4 shrink-0" />
                                        <span>
                                            {role === "PUBLISHER"
                                                ? "Read-only: Publisher accounts cannot modify media metadata."
                                                : "Read-only: Editor accounts may only edit alt text and captions on their own active uploads."}
                                        </span>
                                    </div>
                                ) : null}

                                {metaFeedback ? (
                                    <div
                                        role="alert"
                                        className={`rounded-xl px-4 py-2.5 text-xs font-medium border ${
                                            metaFeedback.type === "success"
                                                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                                                : "bg-red-950/40 border-red-500/30 text-red-200"
                                        }`}
                                    >
                                        {metaFeedback.text}
                                    </div>
                                ) : null}

                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Accessibility Alt Text
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={500}
                                        readOnly={!canEditSelected}
                                        value={metaAltText}
                                        onChange={(e) =>
                                            setMetaAltText(e.target.value)
                                        }
                                        placeholder="Descriptive alt text for accessibility..."
                                        className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none read-only:opacity-60"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Caption
                                    </label>
                                    <textarea
                                        rows={3}
                                        maxLength={1000}
                                        readOnly={!canEditSelected}
                                        value={metaCaption}
                                        onChange={(e) =>
                                            setMetaCaption(e.target.value)
                                        }
                                        placeholder="Optional display caption..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none read-only:opacity-60"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeInspector}
                                        className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/[0.05] cursor-pointer"
                                    >
                                        Close
                                    </button>
                                    {canEditSelected ? (
                                        <button
                                            type="submit"
                                            disabled={isSavingMeta}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors disabled:opacity-60 cursor-pointer"
                                        >
                                            <Save className="h-3.5 w-3.5" />
                                            {isSavingMeta
                                                ? "Saving..."
                                                : "Save Metadata"}
                                        </button>
                                    ) : null}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
