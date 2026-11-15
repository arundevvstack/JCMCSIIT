"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, Blocks, Search } from "lucide-react";
import { saveContentBlock, deleteContentBlock } from "@/actions/cms";
import type { AdminRole } from "@/lib/auth/rbac";
import { AdminStatusBadge } from "@/components/admin/admin-primitives";

export type BlockData = {
    id: string;
    key: string;
    title: string;
    block_type?: string;
    content: string;
    status?: string;
    updated_at: string;
};

export default function BlocksManager({
    initialBlocks,
    role = "ADMIN",
}: {
    initialBlocks: BlockData[];
    role?: AdminRole;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(
        initialBlocks[0]?.id || null
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

    const activeBlock = blocks.find((b) => b.id === activeBlockId) || null;

    const handleAddNew = () => {
        const newBlock: BlockData = {
            id: `new-${Date.now()}`,
            key: "new_block_key",
            title: "New Content Block",
            block_type: "markdown",
            content: "Enter reusable block content here...",
            status: "draft",
            updated_at: new Date().toISOString(),
        };
        setFeedback(null);
        setBlocks([newBlock, ...blocks]);
        setActiveBlockId(newBlock.id);
    };

    const handleChange = (field: keyof BlockData, value: string) => {
        setBlocks((prev) =>
            prev.map((b) =>
                b.id === activeBlockId ? { ...b, [field]: value } : b
            )
        );
    };

    const handleSave = () => {
        if (!activeBlock) return;
        setFeedback(null);

        startTransition(async () => {
            const formData = new FormData();
            if (!activeBlock.id.startsWith("new-")) {
                formData.append("id", activeBlock.id);
            }
            formData.append("key", activeBlock.key);
            formData.append("title", activeBlock.title);
            formData.append(
                "block_type",
                activeBlock.block_type || "markdown"
            );
            formData.append("content", activeBlock.content);
            formData.append(
                "status",
                isEditor ? "draft" : activeBlock.status || "draft"
            );

            const res = await saveContentBlock(formData);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || "Content block saved to Supabase.",
                });
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || "Failed to save content block.",
                });
            }
        });
    };

    const handleDelete = () => {
        if (!activeBlock) return;
        if (
            !window.confirm(
                `Permanently delete block "${activeBlock.key}" from public.content_blocks?`
            )
        ) {
            return;
        }

        if (activeBlock.id.startsWith("new-")) {
            const remaining = blocks.filter((b) => b.id !== activeBlockId);
            setBlocks(remaining);
            setActiveBlockId(remaining[0]?.id || null);
            return;
        }

        startTransition(async () => {
            const res = await deleteContentBlock(activeBlock.id);
            if (res.ok) {
                const remaining = blocks.filter((b) => b.id !== activeBlockId);
                setBlocks(remaining);
                setActiveBlockId(remaining[0]?.id || null);
                setFeedback({
                    type: "success",
                    text: res.message || "Content block deleted.",
                });
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || "Failed to delete block.",
                });
            }
        });
    };

    const filteredBlocks = blocks.filter(
        (b) =>
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.key.toLowerCase().includes(searchQuery.toLowerCase())
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
                {/* Sidebar List */}
                <div className="lg:col-span-4 bg-[#12141C] rounded-2xl border border-white/[0.07] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/[0.07] bg-[#0E1017] space-y-3">
                        {canCreate ? (
                            <button
                                type="button"
                                onClick={handleAddNew}
                                className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Create New Block
                            </button>
                        ) : null}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search blocks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#0B0D12] border border-white/[0.08] rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 max-h-[520px]">
                        {filteredBlocks.map((block) => {
                            const selected = activeBlockId === block.id;
                            return (
                                <button
                                    key={block.id}
                                    type="button"
                                    onClick={() => setActiveBlockId(block.id)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                                        selected
                                            ? "bg-[#D4AF37]/12 border-[#D4AF37]/35"
                                            : "hover:bg-white/[0.03] border-transparent"
                                    }`}
                                >
                                    <div className="text-xs font-semibold text-zinc-100 truncate">
                                        {block.title}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-1.5">
                                        <span className="text-[11px] font-mono text-zinc-400 truncate">
                                            {block.key}
                                        </span>
                                        <AdminStatusBadge
                                            status={block.status || "draft"}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                        {filteredBlocks.length === 0 && (
                            <div className="p-6 text-center text-zinc-500 text-xs">
                                No content blocks in Supabase yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-8 bg-[#12141C] rounded-2xl border border-white/[0.07] flex flex-col overflow-hidden">
                    {activeBlock ? (
                        <>
                            <div className="px-6 py-4 border-b border-white/[0.07] bg-[#0E1017] flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-sm font-bold text-zinc-100">
                                    Edit Content Block
                                </h2>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={
                                            isEditor
                                                ? "draft"
                                                : activeBlock.status || "draft"
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
                                        {!isEditor ? (
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
                                        disabled={isPending}
                                        className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] rounded-xl text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer"
                                    >
                                        <Save className="w-3.5 h-3.5" />{" "}
                                        {isPending
                                            ? "Saving..."
                                            : "Save Block"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Block Title
                                        </label>
                                        <input
                                            type="text"
                                            value={activeBlock.title}
                                            onChange={(e) =>
                                                handleChange(
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-10 px-3.5 bg-[#0B0D12] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#D4AF37] text-xs text-zinc-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Unique Key
                                        </label>
                                        <input
                                            type="text"
                                            value={activeBlock.key}
                                            onChange={(e) =>
                                                handleChange(
                                                    "key",
                                                    e.target.value
                                                        .toLowerCase()
                                                        .replace(
                                                            /[^a-z0-9_.-]/g,
                                                            "_"
                                                        )
                                                )
                                            }
                                            className="w-full h-10 px-3.5 bg-[#0B0D12] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#D4AF37] font-mono text-xs text-zinc-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Block Type
                                        </label>
                                        <select
                                            value={
                                                activeBlock.block_type ||
                                                "markdown"
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    "block_type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-10 px-3.5 bg-[#0B0D12] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#D4AF37] text-xs text-zinc-100"
                                        >
                                            <option value="markdown">
                                                markdown
                                            </option>
                                            <option value="rich_text">
                                                rich_text
                                            </option>
                                            <option value="hero">hero</option>
                                            <option value="cta">cta</option>
                                            <option value="stats">stats</option>
                                            <option value="links">links</option>
                                            <option value="contact">
                                                contact
                                            </option>
                                            <option value="json">json</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Block Content
                                    </label>
                                    <textarea
                                        rows={14}
                                        value={activeBlock.content}
                                        onChange={(e) =>
                                            handleChange(
                                                "content",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-[#0B0D12] border border-white/[0.1] rounded-xl p-4 font-mono text-xs focus:outline-none focus:border-[#D4AF37] text-zinc-100"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <Blocks className="w-12 h-12 mb-3 text-[#D4AF37]/40" />
                            <h3 className="text-sm font-semibold text-zinc-200">
                                Select or Create a Content Block
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1">
                                Choose an existing snippet on the left or create
                                a new keyed block.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
