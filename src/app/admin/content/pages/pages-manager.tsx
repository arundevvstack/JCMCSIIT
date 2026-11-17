"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, Search, FileText, Lock } from "lucide-react";
import { savePage, deletePage } from "@/actions/cms";
import type { AdminRole } from "@/lib/auth/rbac";
import { AdminStatusBadge } from "@/components/admin/admin-primitives";

export type PageData = {
    id: string;
    slug: string;
    route_path?: string | null;
    title: string;
    subtitle?: string | null;
    summary?: string | null;
    content: string;
    status?: string;
    integration_status?: string;
    is_published: boolean;
    updated_at: string;
};

export default function PagesManager({
    initialPages,
    role = "ADMIN",
}: {
    initialPages: PageData[];
    role?: AdminRole;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [pages, setPages] = useState<PageData[]>(initialPages);
    const [activePageId, setActivePageId] = useState<string | null>(
        initialPages[0]?.id || null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const canCreate =
        role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR";
    const canDelete = role === "SUPER_ADMIN" || role === "ADMIN";
    const isEditor = role === "EDITOR";

    const activePage = pages.find((p) => p.id === activePageId) || null;
    const activeEffectiveStatus = activePage
        ? activePage.status ||
          (activePage.is_published ? "published" : "draft")
        : "draft";
    const isEditorLocked =
        Boolean(activePage) &&
        isEditor &&
        !activePage!.id.startsWith("new-") &&
        activeEffectiveStatus !== "draft";

    const handleAddNew = () => {
        const newPage: PageData = {
            id: `new-${Date.now()}`,
            slug: "new-page",
            route_path: "/new-page",
            title: "New Institutional Page",
            subtitle: "",
            summary: "",
            content: "# New Institutional Page\n\nEnter page content here...",
            status: "draft",
            integration_status: "pending",
            is_published: false,
            updated_at: new Date().toISOString(),
        };
        setFeedback(null);
        setPages([newPage, ...pages]);
        setActivePageId(newPage.id);
    };

    const handleChange = (field: keyof PageData, value: string | boolean) => {
        if (isEditorLocked) return;
        setPages((prev) =>
            prev.map((p) =>
                p.id === activePageId ? { ...p, [field]: value } : p
            )
        );
    };

    const handleSave = () => {
        if (!activePage || isEditorLocked) return;
        setFeedback(null);

        startTransition(async () => {
            const formData = new FormData();
            if (!activePage.id.startsWith("new-")) {
                formData.append("id", activePage.id);
            }
            formData.append("slug", activePage.slug);
            formData.append("title", activePage.title);
            formData.append("subtitle", activePage.subtitle ?? "");
            formData.append("summary", activePage.summary ?? "");
            formData.append("content", activePage.content);
            formData.append(
                "status",
                isEditor ? "draft" : activeEffectiveStatus
            );
            formData.append(
                "integration_status",
                activePage.integration_status || "pending"
            );

            const res = await savePage(formData);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || "Page saved to Supabase.",
                });
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || "Failed to save page.",
                });
            }
        });
    };

    const handleDelete = () => {
        if (!activePage) return;
        if (
            !window.confirm(
                `Permanently delete "${activePage.title}" from public.pages?`
            )
        ) {
            return;
        }

        if (activePage.id.startsWith("new-")) {
            const remaining = pages.filter((p) => p.id !== activePageId);
            setPages(remaining);
            setActivePageId(remaining[0]?.id || null);
            return;
        }

        startTransition(async () => {
            const res = await deletePage(activePage.id);
            if (res.ok) {
                const remaining = pages.filter((p) => p.id !== activePageId);
                setPages(remaining);
                setActivePageId(remaining[0]?.id || null);
                setFeedback({
                    type: "success",
                    text: res.message || "Page deleted.",
                });
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || "Failed to delete page.",
                });
            }
        });
    };

    const filteredPages = pages.filter(
        (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {feedback ? (
                <div
                    className={`rounded-xl px-4 py-3 text-xs font-medium border ${
                        feedback.type === "success"
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                            : "bg-red-950/40 border-red-500/30 text-red-200"
                    }`}
                >
                    {feedback.text}
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
                {/* Sidebar List */}
                <div className="lg:col-span-4 bg-[#12141C] rounded-2xl border border-white/[0.07] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/[0.07] bg-[#0E1017] space-y-3">
                        {canCreate ? (
                            <button
                                type="button"
                                onClick={handleAddNew}
                                className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Create New Page
                            </button>
                        ) : null}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#0B0D12] border border-white/[0.08] rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 max-h-[540px]">
                        {filteredPages.map((page) => {
                            const selected = activePageId === page.id;
                            return (
                                <button
                                    key={page.id}
                                    type="button"
                                    onClick={() => setActivePageId(page.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                        selected
                                            ? "bg-[#D4AF37]/12 border-[#D4AF37]/35"
                                            : "hover:bg-white/[0.03] border-transparent"
                                    }`}
                                >
                                    <div className="text-xs font-semibold text-zinc-100 truncate">
                                        {page.title}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-1.5">
                                        <span className="text-[11px] font-mono text-zinc-400 truncate">
                                            /{page.slug}
                                        </span>
                                        <AdminStatusBadge
                                            status={
                                                page.status ||
                                                (page.is_published
                                                    ? "published"
                                                    : "draft")
                                            }
                                        />
                                    </div>
                                </button>
                            );
                        })}
                        {filteredPages.length === 0 && (
                            <div className="p-6 text-center text-zinc-500 text-xs">
                                No page records in Supabase yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-8 bg-[#12141C] rounded-2xl border border-white/[0.07] flex flex-col overflow-hidden">
                    {activePage ? (
                        <>
                            <div className="px-6 py-4 border-b border-white/[0.07] bg-[#0E1017] flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-sm font-bold text-zinc-100">
                                        Page Editor
                                    </h2>
                                    <p className="text-[11px] text-zinc-400">
                                        Integration:{" "}
                                        <span className="font-mono text-[#E5C158]">
                                            {activePage.integration_status ||
                                                "pending"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={
                                            isEditor && !isEditorLocked
                                                ? "draft"
                                                : activeEffectiveStatus
                                        }
                                        disabled={isEditor}
                                        onChange={(e) =>
                                            handleChange(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                        className="h-9 px-3 rounded-xl bg-[#0B0D12] border border-white/[0.1] text-xs font-semibold text-zinc-200 focus:border-[#D4AF37] outline-none disabled:opacity-60"
                                    >
                                        <option value="draft">Draft</option>
                                        {!isEditor || isEditorLocked ? (
                                            <>
                                                <option value="published">
                                                    Published
                                                </option>
                                                <option value="archived">
                                                    Archived
                                                </option>
                                            </>
                                        ) : null}
                                    </select>

                                    {canDelete ? (
                                        <button
                                            type="button"
                                            disabled={isPending}
                                            onClick={handleDelete}
                                            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 text-red-300 border border-red-500/25 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />{" "}
                                            Delete
                                        </button>
                                    ) : null}

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isPending || isEditorLocked}
                                        title={
                                            isEditorLocked
                                                ? "Editors cannot modify published or archived pages"
                                                : "Save page"
                                        }
                                        className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] rounded-xl text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <Save className="w-3.5 h-3.5" />{" "}
                                        {isPending
                                            ? "Saving..."
                                            : isEditorLocked
                                              ? "Locked"
                                              : "Save Page"}
                                    </button>
                                </div>
                            </div>

                            {isEditorLocked ? (
                                <div className="mx-6 mt-5 rounded-xl bg-amber-950/35 border border-[#D4AF37]/30 px-4 py-3 flex items-center gap-2.5 text-xs text-[#E5C158]">
                                    <Lock className="h-4 w-4 shrink-0" />
                                    <span>
                                        Read-only: Editor accounts may only edit
                                        records in <strong>Draft</strong>{" "}
                                        status. Contact a Publisher or Admin to
                                        modify published or archived pages.
                                    </span>
                                </div>
                            ) : null}

                            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Page Title
                                        </label>
                                        <input
                                            type="text"
                                            value={activePage.title}
                                            readOnly={isEditorLocked}
                                            onChange={(e) =>
                                                handleChange(
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-10 px-3.5 bg-[#0B0D12] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#D4AF37] text-xs text-zinc-100 read-only:opacity-60"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            URL Slug (e.g. about/college/profile)
                                        </label>
                                        <input
                                            type="text"
                                            value={activePage.slug}
                                            readOnly={isEditorLocked}
                                            onChange={(e) =>
                                                handleChange(
                                                    "slug",
                                                    e.target.value
                                                        .toLowerCase()
                                                        .replace(
                                                            /[^a-z0-9-/]/g,
                                                            "-"
                                                        )
                                                )
                                            }
                                            className="w-full h-10 px-3.5 bg-[#0B0D12] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono text-xs text-zinc-100 read-only:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Subtitle (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={activePage.subtitle ?? ""}
                                            readOnly={isEditorLocked}
                                            onChange={(e) =>
                                                handleChange(
                                                    "subtitle",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-10 px-3.5 bg-[#0B0D12] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#D4AF37] text-xs text-zinc-100 read-only:opacity-60"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Frontend Integration Status
                                        </label>
                                        <select
                                            value={
                                                activePage.integration_status ||
                                                "pending"
                                            }
                                            disabled={isEditorLocked}
                                            onChange={(e) =>
                                                handleChange(
                                                    "integration_status",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-10 px-3.5 bg-[#0B0D12] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#D4AF37] text-xs text-zinc-100 disabled:opacity-60"
                                        >
                                            <option value="pending">
                                                pending (Awaiting Route Binding)
                                            </option>
                                            <option value="code_managed">
                                                code_managed (Static TSX Active)
                                            </option>
                                            <option value="connected">
                                                connected (Live CMS Bound)
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Markdown Body Content
                                    </label>
                                    <textarea
                                        rows={14}
                                        value={activePage.content}
                                        readOnly={isEditorLocked}
                                        onChange={(e) =>
                                            handleChange(
                                                "content",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-[#0B0D12] border border-white/[0.1] rounded-xl p-4 font-mono text-xs focus:outline-none focus:border-[#D4AF37] text-zinc-100 read-only:opacity-60"
                                        placeholder="# Enter structured markdown here..."
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <FileText className="w-12 h-12 mb-3 text-[#D4AF37]/40" />
                            <h3 className="text-sm font-semibold text-zinc-200">
                                Select or Create a Page
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1">
                                Choose an existing page from the left list or
                                create a new draft record.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
