"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Check,
    Copy,
    Download,
    ExternalLink,
    Eye,
    FileSpreadsheet,
    FileText,
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

export const DOCUMENT_BUCKETS = ["cms-documents", "pdfs"] as const;
export type DocumentBucketId = (typeof DOCUMENT_BUCKETS)[number];

export interface DocumentAssetRecord {
    id: string;
    bucket_id: string;
    storage_path: string;
    original_filename: string;
    public_url: string;
    mime_type: string;
    size_bytes: number;
    alt_text: string | null;
    caption: string | null;
    uploaded_by: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at?: string;
}

const MAX_DOCUMENT_BYTES = 15_728_640; // 15 MB limit per Supabase bucket policy

const BUCKET_LABELS: Record<DocumentBucketId, string> = {
    "cms-documents":
        "cms-documents (Mandatory Disclosures, AICTE/KTU Approvals, Governance)",
    pdfs: "pdfs (Syllabi, Academic Calendars, Brochures, Notices)",
};

const BUCKET_DESCRIPTIONS: Record<DocumentBucketId, string> = {
    "cms-documents":
        "Official institutional approvals, compliance reports, and statutory governance filings.",
    pdfs: "Curriculum documents, semester syllabi, admission prospectuses, and public circulars.",
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

export function formatDocumentBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Deterministic UTC date formatter to ensure SSR and client hydration match.
 */
export function formatDocumentDate(isoString: string): string {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    const month = SHORT_MONTHS[d.getUTCMonth()];
    const day = String(d.getUTCDate()).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}

export function canRoleUploadDocument(role: AdminRole): boolean {
    return role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR";
}

export function canRoleEditDocMetadata(
    role: AdminRole,
    currentAdminId: string,
    doc: DocumentAssetRecord
): boolean {
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
        return true;
    }
    if (role === "EDITOR") {
        return (
            Boolean(doc.uploaded_by) &&
            doc.uploaded_by === currentAdminId &&
            !doc.is_archived
        );
    }
    return false;
}

interface UploadApiResponse {
    ok?: boolean;
    deduplicated?: boolean;
    message?: string;
    error?: string;
    media?: DocumentAssetRecord;
}

export function DocumentsLibraryManager({
    initialDocuments,
    role,
    currentAdminId,
    loadError = null,
}: {
    initialDocuments: DocumentAssetRecord[];
    role: AdminRole;
    currentAdminId: string;
    loadError?: string | null;
}) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const uploadingRef = useRef(false);

    const [documents, setDocuments] =
        useState<DocumentAssetRecord[]>(initialDocuments);
    const [searchQuery, setSearchQuery] = useState("");
    const [bucketFilter, setBucketFilter] = useState<"ALL" | DocumentBucketId>(
        "ALL"
    );

    // Upload state
    const [targetBucket, setTargetBucket] =
        useState<DocumentBucketId>("cms-documents");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadCaption, setUploadCaption] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadFeedback, setUploadFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Inspect & metadata edit modal state
    const [selectedDoc, setSelectedDoc] = useState<DocumentAssetRecord | null>(
        null
    );
    const [metaTitle, setMetaTitle] = useState("");
    const [metaCaption, setMetaCaption] = useState("");
    const [metaFeedback, setMetaFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [isSavingMeta, startMetaTransition] = useTransition();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const canUpload = canRoleUploadDocument(role);

    // Filter documents by search and bucket
    const filteredDocuments = documents.filter((doc) => {
        if (bucketFilter !== "ALL" && doc.bucket_id !== bucketFilter) {
            return false;
        }
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase().trim();
        const filenameMatch = doc.original_filename.toLowerCase().includes(q);
        const titleMatch = (doc.alt_text ?? "").toLowerCase().includes(q);
        const captionMatch = (doc.caption ?? "").toLowerCase().includes(q);
        const pathMatch = doc.storage_path.toLowerCase().includes(q);

        return filenameMatch || titleMatch || captionMatch || pathMatch;
    });

    const handleFileSelection = (file: File | null) => {
        setUploadFeedback(null);
        if (!file) {
            setSelectedFile(null);
            return;
        }

        const isPdfMime =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdfMime) {
            setUploadFeedback({
                type: "error",
                text: "Invalid file type. Only PDF documents (.pdf) are accepted in document buckets.",
            });
            setSelectedFile(null);
            return;
        }

        if (file.size > MAX_DOCUMENT_BYTES) {
            setUploadFeedback({
                type: "error",
                text: `File exceeds maximum document size (15 MB). Selected file: ${formatDocumentBytes(
                    file.size
                )}.`,
            });
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        if (!uploadTitle.trim()) {
            const cleanBase = file.name
                .replace(/\.pdf$/i, "")
                .replace(/[-_]+/g, " ")
                .trim();
            setUploadTitle(cleanBase);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadFeedback(null);

        if (!canUpload) {
            setUploadFeedback({
                type: "error",
                text: "Permission denied. Publisher accounts have read-only access.",
            });
            return;
        }

        if (!selectedFile) {
            setUploadFeedback({
                type: "error",
                text: "Please select a PDF document to upload.",
            });
            return;
        }

        if (uploadingRef.current) return;
        uploadingRef.current = true;
        setIsUploading(true);
        setUploadProgress(5);

        const formData = new FormData();
        formData.append("bucket_id", targetBucket);
        formData.append("file", selectedFile);
        if (uploadTitle.trim()) {
            formData.append("alt_text", uploadTitle.trim());
        }
        if (uploadCaption.trim()) {
            formData.append("caption", uploadCaption.trim());
        }

        try {
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/api/admin/media/upload");

                xhr.upload.onprogress = (evt) => {
                    if (evt.lengthComputable) {
                        const pct = Math.round((evt.loaded / evt.total) * 90);
                        setUploadProgress(Math.max(10, Math.min(90, pct)));
                    }
                };

                xhr.onload = () => {
                    setUploadProgress(100);
                    try {
                        const json: UploadApiResponse = JSON.parse(
                            xhr.responseText
                        );
                        if (xhr.status >= 200 && xhr.status < 300 && json.ok) {
                            if (json.media) {
                                const newDoc = json.media;
                                setDocuments((prev) => {
                                    const existsIndex = prev.findIndex(
                                        (d) => d.id === newDoc.id
                                    );
                                    if (existsIndex >= 0) {
                                        const clone = [...prev];
                                        clone[existsIndex] = newDoc;
                                        return clone;
                                    }
                                    return [newDoc, ...prev];
                                });
                            }

                            const messageText = json.deduplicated
                                ? "Document already registered in the repository (SHA-256 duplicate match). Existing record retained."
                                : json.message ||
                                  "PDF document uploaded and registered successfully.";

                            setUploadFeedback({
                                type: "success",
                                text: messageText,
                            });

                            setSelectedFile(null);
                            setUploadTitle("");
                            setUploadCaption("");
                            if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                            }
                            router.refresh();
                            resolve();
                        } else {
                            reject(
                                new Error(
                                    json.error ||
                                        `Upload failed with status ${xhr.status}. Could not complete upload.`
                                )
                            );
                        }
                    } catch {
                        reject(
                            new Error(
                                `Upload server returned an unexpected response (${xhr.status}).`
                            )
                        );
                    }
                };

                xhr.onerror = () => {
                    reject(
                        new Error(
                            "Network error occurred while uploading the document."
                        )
                    );
                };

                xhr.send(formData);
            });
        } catch (err: unknown) {
            setUploadFeedback({
                type: "error",
                text:
                    err instanceof Error
                        ? err.message
                        : "Upload failed. Please try again.",
            });
        } finally {
            setIsUploading(false);
            uploadingRef.current = false;
        }
    };

    const openDocModal = (doc: DocumentAssetRecord) => {
        setSelectedDoc(doc);
        setMetaTitle(doc.alt_text ?? "");
        setMetaCaption(doc.caption ?? "");
        setMetaFeedback(null);
    };

    const closeDocModal = () => {
        setSelectedDoc(null);
        setMetaTitle("");
        setMetaCaption("");
        setMetaFeedback(null);
    };

    const handleCopyUrl = async (id: string, url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => {
                setCopiedId((curr) => (curr === id ? null : curr));
            }, 2500);
        } catch {
            // Fallback copy if clipboard API blocked
            const textarea = document.createElement("textarea");
            textarea.value = url;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopiedId(id);
            setTimeout(() => {
                setCopiedId((curr) => (curr === id ? null : curr));
            }, 2500);
        }
    };

    const handleSaveMetadata = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoc) return;

        setMetaFeedback(null);

        const canEdit = canRoleEditDocMetadata(
            role,
            currentAdminId,
            selectedDoc
        );
        if (!canEdit) {
            setMetaFeedback({
                type: "error",
                text:
                    role === "PUBLISHER"
                        ? "Permission denied. Publisher accounts have read-only access."
                        : "Permission denied. Editor accounts may only edit documents they uploaded.",
            });
            return;
        }

        startMetaTransition(async () => {
            const formData = new FormData();
            formData.append("id", selectedDoc.id);
            if (metaTitle.trim()) {
                formData.append("alt_text", metaTitle.trim());
            }
            if (metaCaption.trim()) {
                formData.append("caption", metaCaption.trim());
            }

            const res = await updateMediaMetadataAction(formData);

            if (res.ok) {
                const updated: DocumentAssetRecord = {
                    ...selectedDoc,
                    alt_text: metaTitle.trim() || null,
                    caption: metaCaption.trim() || null,
                    updated_at: new Date().toISOString(),
                };
                setSelectedDoc(updated);
                setDocuments((prev) =>
                    prev.map((d) => (d.id === updated.id ? updated : d))
                );
                setMetaFeedback({
                    type: "success",
                    text: res.message || "Document metadata saved successfully.",
                });
                router.refresh();
            } else {
                setMetaFeedback({
                    type: "error",
                    text: res.error || "Failed to save document metadata.",
                });
            }
        });
    };

    const docCanBeEdited = selectedDoc
        ? canRoleEditDocMetadata(role, currentAdminId, selectedDoc)
        : false;

    return (
        <div className="space-y-8">
            {loadError ? (
                <AdminHonestNotice title="Database Query Notice" variant="restricted">
                    Failed to query document library: {loadError}
                </AdminHonestNotice>
            ) : null}

            {/* Document Uploader Section */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-6 shadow-xl">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-white/[0.06]">
                    <div>
                        <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                            Official PDF Uploader
                        </div>
                        <h2 className="text-lg font-bold text-zinc-100 mt-1">
                            Upload Official PDF Documents
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Target Supabase Storage buckets{" "}
                            <code className="text-[#E5C158]">cms-documents</code>{" "}
                            and <code className="text-[#E5C158]">pdfs</code>. Binary
                            magic-byte validation, SHA-256 deduplication, and
                            metadata registration in{" "}
                            <code className="text-[#E5C158]">public.media</code>.
                        </p>
                    </div>
                    {!canUpload ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 text-xs font-medium text-amber-200">
                            <Lock className="h-3.5 w-3.5" />
                            Publisher Read-Only Mode
                        </div>
                    ) : null}
                </div>

                <form onSubmit={handleUploadSubmit} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Target Bucket Selector */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-2">
                                Target Storage Bucket{" "}
                                <span className="text-[#E5C158]">*</span>
                            </label>
                            <select
                                value={targetBucket}
                                onChange={(e) =>
                                    setTargetBucket(
                                        e.target.value as DocumentBucketId
                                    )
                                }
                                disabled={!canUpload || isUploading}
                                className="w-full rounded-xl border border-white/[0.1] bg-[#0E1017] px-3.5 py-2.5 text-xs text-zinc-100 focus:border-[#D4AF37] focus:outline-none transition-colors disabled:opacity-50"
                            >
                                {DOCUMENT_BUCKETS.map((b) => (
                                    <option key={b} value={b}>
                                        {BUCKET_LABELS[b]}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[11px] text-zinc-400 mt-1.5">
                                {BUCKET_DESCRIPTIONS[targetBucket]}
                            </p>
                        </div>

                        {/* Title / Document Label */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-300 mb-2">
                                Document Title / Label{" "}
                                <span className="text-zinc-500 font-normal">
                                    (optional, max 500 chars)
                                </span>
                            </label>
                            <input
                                type="text"
                                maxLength={500}
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                                placeholder="e.g. AICTE Approval 2025-26 or MCA Regulation Syllabus"
                                disabled={!canUpload || isUploading}
                                className="w-full rounded-xl border border-white/[0.1] bg-[#0E1017] px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none transition-colors disabled:opacity-50"
                            />
                            <p className="text-[11px] text-zinc-400 mt-1.5">
                                Stored in <code className="text-zinc-300">alt_text</code>; displayed as document heading.
                            </p>
                        </div>
                    </div>

                    {/* Notes / Description */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-2">
                            Administrative Notes / Description{" "}
                            <span className="text-zinc-500 font-normal">
                                (optional, max 1,000 chars)
                            </span>
                        </label>
                        <textarea
                            rows={2}
                            maxLength={1000}
                            value={uploadCaption}
                            onChange={(e) => setUploadCaption(e.target.value)}
                            placeholder="e.g. Approved in Governing Body Meeting on Nov 2025. Mandatory for NBA & NAAC compliance."
                            disabled={!canUpload || isUploading}
                            className="w-full rounded-xl border border-white/[0.1] bg-[#0E1017] px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none transition-colors disabled:opacity-50"
                        />
                    </div>

                    {/* File Drop / Select Area */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-2">
                            Select PDF File{" "}
                            <span className="text-[#E5C158]">*</span>
                            <span className="text-zinc-500 font-normal ml-2">
                                (Strictly .pdf format, max 15 MB)
                            </span>
                        </label>
                        <div
                            onClick={() => {
                                if (canUpload && !isUploading) {
                                    fileInputRef.current?.click();
                                }
                            }}
                            className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                                !canUpload
                                    ? "border-white/[0.05] bg-white/[0.01] opacity-50 cursor-not-allowed"
                                    : isUploading
                                      ? "border-[#D4AF37]/40 bg-[#D4AF37]/5 cursor-wait"
                                      : selectedFile
                                        ? "border-emerald-500/40 bg-emerald-500/5 cursor-pointer hover:border-emerald-500/60"
                                        : "border-white/[0.12] bg-[#0E1017] cursor-pointer hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(e) =>
                                    handleFileSelection(
                                        e.target.files?.[0] ?? null
                                    )
                                }
                                disabled={!canUpload || isUploading}
                                className="hidden"
                            />

                            <div className="flex flex-col items-center justify-center">
                                <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] mb-3">
                                    <FileText className="h-6 w-6" />
                                </div>
                                {selectedFile ? (
                                    <div className="space-y-1">
                                        <div className="text-sm font-semibold text-emerald-300 flex items-center justify-center gap-2">
                                            <span>{selectedFile.name}</span>
                                            <span className="text-xs text-emerald-400/80 font-mono">
                                                ({formatDocumentBytes(selectedFile.size)})
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-400">
                                            Click to replace with a different PDF document.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-zinc-200">
                                            Click to browse or drag and drop a PDF file here
                                        </div>
                                        <p className="text-xs text-zinc-400">
                                            PDF only • Max 15 MB • Authenticated SSR upload with SHA-256 deduplication
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Upload Progress Bar */}
                    {isUploading ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
                                <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                                    Verifying magic bytes & uploading PDF...
                                </span>
                                <span className="font-mono text-[#E5C158]">
                                    {uploadProgress}%
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : null}

                    {/* Feedback Alert */}
                    {uploadFeedback ? (
                        <div
                            className={`rounded-xl border p-4 text-xs leading-relaxed ${
                                uploadFeedback.type === "success"
                                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                                    : "bg-rose-500/10 border-rose-500/25 text-rose-200"
                            }`}
                        >
                            {uploadFeedback.text}
                        </div>
                    ) : null}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={
                                !canUpload ||
                                !selectedFile ||
                                isUploading
                            }
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                        >
                            <Upload className="h-4 w-4" />
                            {isUploading ? "Uploading Document..." : "Upload Document"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Document Library Repository */}
            <div className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">
                            Registered Institutional Documents
                            <span className="text-xs font-normal text-zinc-400 font-mono px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
                                {filteredDocuments.length} of {documents.length}
                            </span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1">
                            Filtered from <code className="text-[#E5C158]">public.media</code> ({DOCUMENT_BUCKETS.join(", ")}).
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by filename, title, notes..."
                            className="w-full rounded-xl border border-white/[0.1] bg-[#0E1017] pl-9 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Bucket Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                    <button
                        type="button"
                        onClick={() => setBucketFilter("ALL")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                            bucketFilter === "ALL"
                                ? "bg-[#D4AF37] text-black font-semibold shadow-sm"
                                : "bg-[#12141C] border border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15]"
                        }`}
                    >
                        All Buckets ({documents.length})
                    </button>
                    {DOCUMENT_BUCKETS.map((b) => {
                        const count = documents.filter(
                            (d) => d.bucket_id === b
                        ).length;
                        return (
                            <button
                                key={b}
                                type="button"
                                onClick={() => setBucketFilter(b)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                                    bucketFilter === b
                                        ? "bg-[#D4AF37] text-black font-semibold shadow-sm"
                                        : "bg-[#12141C] border border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15]"
                                }`}
                            >
                                {b} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Documents Table or Empty State */}
                {documents.length === 0 ? (
                    <AdminEmptyState
                        icon={FileSpreadsheet}
                        title="No Institutional PDF Documents Registered Yet"
                        description="Upload official approvals, syllabi, brochures, and statutory records using the uploader above. Their file sizes, SHA-256 fingerprints, and public download URLs will appear here."
                    />
                ) : filteredDocuments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#0E1017] p-8 text-center">
                        <FileText className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-zinc-200">
                            No documents matched your filter
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                            Try adjusting your search query or selecting a different bucket.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setBucketFilter("ALL");
                            }}
                            className="mt-4 px-4 py-1.5 rounded-xl text-xs font-medium bg-white/[0.06] text-zinc-200 hover:bg-white/[0.1] border border-white/[0.1]"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/[0.08] bg-[#12141C] overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/[0.08] bg-[#0E1017]">
                                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                            Document & Details
                                        </th>
                                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                            Bucket
                                        </th>
                                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                            Size
                                        </th>
                                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                            Uploaded
                                        </th>
                                        <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                            Status
                                        </th>
                                        <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.05] text-xs">
                                    {filteredDocuments.map((doc) => {
                                        const isCopied = copiedId === doc.id;
                                        return (
                                            <tr
                                                key={doc.id}
                                                className="hover:bg-white/[0.02] transition-colors group"
                                            >
                                                {/* Filename & Title */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3 max-w-md">
                                                        <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                                                            <FileText className="h-4 w-4" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-zinc-100 truncate group-hover:text-[#E5C158] transition-colors">
                                                                {doc.alt_text ||
                                                                    doc.original_filename}
                                                            </div>
                                                            <div className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                                                                {doc.original_filename}
                                                            </div>
                                                            {doc.caption ? (
                                                                <div className="text-[11px] text-zinc-400 line-clamp-1 mt-1">
                                                                    {doc.caption}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Bucket */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#E5C158]">
                                                        {doc.bucket_id}
                                                    </span>
                                                </td>

                                                {/* Size */}
                                                <td className="px-5 py-4 whitespace-nowrap text-zinc-300 font-mono">
                                                    {formatDocumentBytes(
                                                        doc.size_bytes
                                                    )}
                                                </td>

                                                {/* Date */}
                                                <td className="px-5 py-4 whitespace-nowrap text-zinc-400">
                                                    {formatDocumentDate(
                                                        doc.created_at
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    <AdminStatusBadge
                                                        status={
                                                            doc.is_archived
                                                                ? "archived"
                                                                : "active"
                                                        }
                                                    />
                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4 whitespace-nowrap text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        {/* Open/Preview in new tab */}
                                                        <a
                                                            href={doc.public_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Open PDF in new tab"
                                                            className="p-1.5 rounded-lg border border-white/[0.08] bg-[#0E1017] text-zinc-300 hover:text-[#E5C158] hover:border-[#D4AF37]/40 transition-colors"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>

                                                        {/* Download button */}
                                                        <a
                                                            href={doc.public_url}
                                                            download={
                                                                doc.original_filename
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Download PDF"
                                                            className="p-1.5 rounded-lg border border-white/[0.08] bg-[#0E1017] text-zinc-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                        </a>

                                                        {/* Copy public link */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCopyUrl(
                                                                    doc.id,
                                                                    doc.public_url
                                                                )
                                                            }
                                                            title="Copy Public URL"
                                                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                                                isCopied
                                                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                                                    : "border-white/[0.08] bg-[#0E1017] text-zinc-300 hover:text-[#E5C158] hover:border-[#D4AF37]/40"
                                                            }`}
                                                        >
                                                            {isCopied ? (
                                                                <Check className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <Copy className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>

                                                        {/* Inspect & Edit Metadata */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDocModal(doc)
                                                            }
                                                            title="Inspect & Edit Metadata"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-[#0E1017] text-[11px] font-medium text-zinc-200 hover:text-[#E5C158] hover:border-[#D4AF37]/40 transition-colors cursor-pointer ml-1"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span>Details</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Inspect & Edit Document Modal */}
            {selectedDoc ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-3xl rounded-2xl border border-white/[0.12] bg-[#12141C] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E1017]">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-100">
                                        Document Details & Metadata
                                    </h3>
                                    <p className="text-[11px] font-mono text-zinc-400">
                                        {selectedDoc.original_filename}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeDocModal}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* PDF Preview Frame / Card */}
                            <div className="rounded-xl border border-white/[0.08] bg-[#0A0B10] p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                    <span className="text-xs font-semibold text-zinc-300">
                                        Embedded PDF Reader
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={selectedDoc.public_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/25 transition-colors"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Open in New Tab
                                        </a>
                                        <a
                                            href={selectedDoc.public_url}
                                            download={
                                                selectedDoc.original_filename
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors"
                                        >
                                            <Download className="h-3 w-3" />
                                            Download
                                        </a>
                                    </div>
                                </div>

                                <div className="rounded-lg overflow-hidden border border-white/[0.06] bg-[#08090C] h-64 sm:h-72">
                                    <iframe
                                        src={`${selectedDoc.public_url}#toolbar=0`}
                                        title={selectedDoc.original_filename}
                                        className="w-full h-full border-0"
                                    />
                                </div>
                            </div>

                            {/* Technical Properties Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="rounded-xl border border-white/[0.06] bg-[#0E1017] p-3">
                                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                                        Storage Bucket
                                    </span>
                                    <span className="font-mono text-[#E5C158]">
                                        {selectedDoc.bucket_id}
                                    </span>
                                </div>
                                <div className="rounded-xl border border-white/[0.06] bg-[#0E1017] p-3">
                                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                                        File Size
                                    </span>
                                    <span className="font-mono text-zinc-200">
                                        {formatDocumentBytes(
                                            selectedDoc.size_bytes
                                        )}
                                    </span>
                                </div>
                                <div className="rounded-xl border border-white/[0.06] bg-[#0E1017] p-3">
                                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                                        Uploaded On
                                    </span>
                                    <span className="text-zinc-200">
                                        {formatDocumentDate(
                                            selectedDoc.created_at
                                        )}
                                    </span>
                                </div>
                                <div className="rounded-xl border border-white/[0.06] bg-[#0E1017] p-3">
                                    <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                                        Database State
                                    </span>
                                    <AdminStatusBadge
                                        status={
                                            selectedDoc.is_archived
                                                ? "archived"
                                                : "active"
                                        }
                                    />
                                </div>
                            </div>

                            {/* Public URL Box */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                    Permanent Public URL
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedDoc.public_url}
                                        className="w-full rounded-xl border border-white/[0.1] bg-[#0E1017] px-3.5 py-2 text-xs font-mono text-zinc-300 select-all focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopyUrl(
                                                selectedDoc.id,
                                                selectedDoc.public_url
                                            )
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white/[0.06] text-zinc-200 hover:bg-white/[0.1] border border-white/[0.1] transition-colors shrink-0 cursor-pointer"
                                    >
                                        {copiedId === selectedDoc.id ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                <span className="text-emerald-400">
                                                    Copied
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Metadata Editor Form */}
                            <form
                                onSubmit={handleSaveMetadata}
                                className="space-y-4 pt-2 border-t border-white/[0.08]"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                                            Institutional Metadata
                                        </h4>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                            Updates Document Title and Administrative Notes in{" "}
                                            <code className="text-[#E5C158]">public.media</code>.
                                        </p>
                                    </div>
                                    {!docCanBeEdited ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/25 bg-amber-500/10 text-[11px] font-medium text-amber-200">
                                            <Lock className="h-3 w-3" />
                                            {role === "PUBLISHER"
                                                ? "Publisher: Read-Only"
                                                : "Editor: Not Your Upload"}
                                        </span>
                                    ) : null}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                        Document Title / Label
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={500}
                                        value={metaTitle}
                                        onChange={(e) =>
                                            setMetaTitle(e.target.value)
                                        }
                                        placeholder="e.g. AICTE Approval Certificate 2025-2026"
                                        disabled={!docCanBeEdited || isSavingMeta}
                                        className="w-full rounded-xl border border-white/[0.1] bg-[#0E1017] px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none transition-colors disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                                        Administrative Notes / Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        maxLength={1000}
                                        value={metaCaption}
                                        onChange={(e) =>
                                            setMetaCaption(e.target.value)
                                        }
                                        placeholder="e.g. Approved by AICTE Southern Regional Office. File Ref: F.No. South-West/1-931892181/2025/EOA."
                                        disabled={!docCanBeEdited || isSavingMeta}
                                        className="w-full rounded-xl border border-white/[0.1] bg-[#0E1017] px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none transition-colors disabled:opacity-50"
                                    />
                                </div>

                                {metaFeedback ? (
                                    <div
                                        className={`rounded-xl border p-3 text-xs ${
                                            metaFeedback.type === "success"
                                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                                                : "bg-rose-500/10 border-rose-500/25 text-rose-200"
                                        }`}
                                    >
                                        {metaFeedback.text}
                                    </div>
                                ) : null}

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeDocModal}
                                        className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
                                    >
                                        Close
                                    </button>
                                    {docCanBeEdited ? (
                                        <button
                                            type="submit"
                                            disabled={isSavingMeta}
                                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black hover:opacity-95 transition-opacity disabled:opacity-40 cursor-pointer"
                                        >
                                            <Save className="h-3.5 w-3.5" />
                                            {isSavingMeta
                                                ? "Saving..."
                                                : "Save Changes"}
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
