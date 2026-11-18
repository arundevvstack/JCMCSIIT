"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    Search,
    Filter,
    Edit3,
    ExternalLink,
    CheckCircle2,
    Clock,
    Layers,
    Save,
    X,
    FileText,
    Settings,
} from "lucide-react";
import type { AdminRole } from "@/lib/auth/rbac";
import type { FacilityItemRecord } from "./page";
import { savePage, saveContentBlock } from "@/actions/cms";
import { UniversalStructuredEditor } from "@/components/admin/structured-block-editors";

interface FacilitiesManagerClientProps {
    initialFacilities: FacilityItemRecord[];
    role: AdminRole;
}

export function FacilitiesManagerClient({
    initialFacilities,
    role,
}: FacilitiesManagerClientProps) {
    const router = useRouter();
    const [facilities] = useState<FacilityItemRecord[]>(initialFacilities);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    // Editor Modal state
    const [activeFacility, setActiveFacility] = useState<FacilityItemRecord | null>(null);
    const [activeTab, setActiveTab] = useState<"content" | "structured">("content");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form fields for active editing
    const [formTitle, setFormTitle] = useState("");
    const [formSubtitle, setFormSubtitle] = useState("");
    const [formSummary, setFormSummary] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
    const [structuredData, setStructuredData] = useState<Record<string, unknown>>({});

    const filtered = facilities.filter((fac) => {
        if (categoryFilter !== "All" && fac.category !== categoryFilter) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchName = fac.name.toLowerCase().includes(q);
            const matchRoute = fac.route_path.toLowerCase().includes(q);
            const matchDesc = fac.description.toLowerCase().includes(q);
            if (!matchName && !matchRoute && !matchDesc) return false;
        }
        return true;
    });

    const openEditor = (fac: FacilityItemRecord) => {
        setActiveFacility(fac);
        setFormTitle(fac.pageData.title);
        setFormSubtitle(fac.pageData.subtitle || "");
        setFormSummary(fac.pageData.summary || "");
        setFormContent(fac.pageData.content);
        setFormStatus((fac.pageData.status as "published" | "draft") || "published");
        setStructuredData(fac.structuredBlock?.structured_data || {});
        setActiveTab("content");
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeFacility) return;

        setIsSaving(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            // 1. Save Page Data
            const pageFd = new FormData();
            if (activeFacility.pageData.id) {
                pageFd.append("id", activeFacility.pageData.id);
            }
            pageFd.append("title", formTitle);
            pageFd.append("slug", activeFacility.key);
            pageFd.append("route_path", activeFacility.route_path);
            pageFd.append("subtitle", formSubtitle);
            pageFd.append("summary", formSummary);
            pageFd.append("content", formContent);
            pageFd.append("status", formStatus);
            pageFd.append("integration_status", "connected");

            const pageRes = await savePage(pageFd);
            if (!pageRes.ok) {
                throw new Error(pageRes.error || "Failed to save facility page content.");
            }

            // 2. Save Structured Block if facility has one
            if (activeFacility.structuredBlock) {
                const blockFd = new FormData();
                if (activeFacility.structuredBlock.id) {
                    blockFd.append("id", activeFacility.structuredBlock.id);
                }
                blockFd.append("key", activeFacility.structuredBlock.key);
                blockFd.append("title", activeFacility.structuredBlock.title);
                blockFd.append("block_type", "json");
                blockFd.append("content", formContent.slice(0, 200));
                blockFd.append("structured_data", JSON.stringify(structuredData));
                blockFd.append("status", formStatus);

                const blockRes = await saveContentBlock(blockFd);
                if (!blockRes.ok) {
                    throw new Error(blockRes.error || "Failed to update structured data block.");
                }
            }

            setSuccessMessage("Facility updated and public routes revalidated successfully!");
            router.refresh();
            setTimeout(() => {
                setActiveFacility(null);
            }, 900);
        } catch (err: unknown) {
            setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12141A] p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 text-zinc-400 ml-2" />
                    <input
                        type="text"
                        placeholder="Search facilities by name, route, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-zinc-200 outline-none w-full placeholder:text-zinc-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-zinc-400" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-[#0B0D12] text-xs text-zinc-200 border border-white/10 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                    >
                        <option value="All">All Categories ({facilities.length})</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Academic">Academic &amp; Research</option>
                        <option value="Amenities">Student Amenities</option>
                        <option value="Logistics">Fleet &amp; Logistics</option>
                    </select>
                </div>
            </div>

            {/* Facilities Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filtered.map((fac) => {
                    const isPublished = fac.pageData.status === "published";
                    const hasStructured = !!fac.structuredBlock;

                    return (
                        <div
                            key={fac.key}
                            className="bg-[#12141A] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-lg shadow-black/20"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 text-[#E5C158] border border-white/10">
                                        {fac.category}
                                    </span>
                                    <span
                                        className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                            isPublished
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}
                                    >
                                        {isPublished ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3" /> Live
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3" /> Draft
                                            </>
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-bold text-white text-base group-hover:text-[#E5C158] transition-colors">
                                        {fac.name}
                                    </h3>
                                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                                        {fac.pageData.subtitle || fac.description}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-white/5 space-y-1">
                                    <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-between">
                                        <span>Route:</span>
                                        <span className="text-zinc-300">{fac.route_path}</span>
                                    </div>
                                    {hasStructured && (
                                        <div className="text-[11px] text-[#D4AF37] font-semibold flex items-center gap-1">
                                            <Layers className="w-3 h-3" />
                                            <span>Includes Structured Dataset</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                                <a
                                    href={fac.route_path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-xs flex items-center gap-1 font-semibold"
                                    title="View live public page"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Preview</span>
                                </a>

                                <button
                                    onClick={() => openEditor(fac)}
                                    className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#D4AF37] hover:bg-[#E5C158] text-black transition-colors flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/10"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Content</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit Facility Drawer / Modal */}
            {activeFacility && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#12141A] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#171A23]">
                            <div>
                                <h3 className="font-bold text-white text-base flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                                    <span>Edit Facility: {activeFacility.name}</span>
                                </h3>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    Syncing to <code className="text-[#E5C158]">{activeFacility.route_path}</code>
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveFacility(null)}
                                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Tabs (if structured data is available) */}
                        {activeFacility.structuredBlock && (
                            <div className="flex items-center gap-2 px-5 pt-3 border-b border-white/10 bg-[#0E1017]">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("content")}
                                    className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
                                        activeTab === "content"
                                            ? "bg-[#12141A] text-[#D4AF37] border-t-2 border-[#D4AF37]"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    <FileText className="w-3.5 h-3.5" /> Page Content &amp; Hero
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("structured")}
                                    className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
                                        activeTab === "structured"
                                            ? "bg-[#12141A] text-[#D4AF37] border-t-2 border-[#D4AF37]"
                                            : "text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    <Settings className="w-3.5 h-3.5" /> Specialized Structured Data
                                </button>
                            </div>
                        )}

                        {/* Form Body */}
                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
                            {errorMessage && (
                                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs">
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs">
                                    {successMessage}
                                </div>
                            )}

                            {activeTab === "content" ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                            Public Hero Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            className="w-full h-10 px-3 rounded-xl bg-[#0B0D12] border border-white/10 text-zinc-100 text-sm outline-none focus:border-[#D4AF37]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                            Subtitle / Tagline
                                        </label>
                                        <input
                                            type="text"
                                            value={formSubtitle}
                                            onChange={(e) => setFormSubtitle(e.target.value)}
                                            className="w-full h-10 px-3 rounded-xl bg-[#0B0D12] border border-white/10 text-zinc-100 text-sm outline-none focus:border-[#D4AF37]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                            Brief Summary (For Meta &amp; Cards)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={formSummary}
                                            onChange={(e) => setFormSummary(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-[#0B0D12] border border-white/10 text-zinc-100 text-xs outline-none focus:border-[#D4AF37] resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                                            Page Content (Markdown)
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={formContent}
                                            onChange={(e) => setFormContent(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-[#0B0D12] border border-white/10 text-zinc-100 text-xs font-mono outline-none focus:border-[#D4AF37]"
                                            placeholder="Write facility specifications, timings, rules in markdown..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-zinc-300">
                                        Editing structured database fields for:{" "}
                                        <strong className="text-[#E5C158]">{activeFacility.structuredBlock?.key}</strong>.
                                    </div>
                                    <UniversalStructuredEditor
                                        blockKey={activeFacility.structuredBlock?.key || ""}
                                        value={structuredData}
                                        disabled={isSaving}
                                        onChange={setStructuredData}
                                    />
                                </div>
                            )}

                            {/* Workflow Status */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-semibold text-zinc-300">
                                        Workflow Status:
                                    </label>
                                    <select
                                        value={formStatus}
                                        onChange={(e) =>
                                            setFormStatus(e.target.value as "published" | "draft")
                                        }
                                        disabled={role === "EDITOR" && formStatus === "published"}
                                        className="h-8 px-2.5 rounded-lg bg-[#0B0D12] border border-white/10 text-xs text-zinc-200 outline-none focus:border-[#D4AF37]"
                                    >
                                        <option value="published">Published (Live)</option>
                                        <option value="draft">Draft (Private)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveFacility(null)}
                                        className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] hover:bg-[#E5C158] text-black transition-colors flex items-center gap-1.5 shadow-lg shadow-[#D4AF37]/20"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        <span>{isSaving ? "Saving..." : "Save & Revalidate"}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
