"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Save, Search } from "lucide-react";
import { updateInquiryAction } from "@/actions/cms";
import { AdminStatusBadge } from "./admin-primitives";

export interface InquiryRecord {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    course_interest: string | null;
    message: string | null;
    status: "new" | "contacted" | "converted" | "closed";
    notes: string | null;
    created_at: string;
}

export function InquiriesManager({
    inquiries,
    emptyMessage,
}: {
    inquiries: InquiryRecord[];
    emptyMessage: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(
        inquiries[0]?.id ?? null
    );
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const filtered = inquiries.filter((row) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
            row.name.toLowerCase().includes(q) ||
            row.email.toLowerCase().includes(q) ||
            (row.course_interest ?? "").toLowerCase().includes(q) ||
            (row.phone ?? "").toLowerCase().includes(q)
        );
    });

    const selected =
        filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setFeedback(null);

        startTransition(async () => {
            const res = await updateInquiryAction(formData);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || "Inquiry updated.",
                });
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || "Unable to update inquiry.",
                });
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="bg-[#12141C] p-4 rounded-2xl border border-white/[0.07] flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by applicant name, email, phone, or programme..."
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
                    />
                </div>
                <span className="text-xs text-zinc-400">
                    {filtered.length} record{filtered.length === 1 ? "" : "s"}
                </span>
            </div>

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

            {filtered.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-[#12141C] p-12 text-center text-xs text-zinc-400">
                    {emptyMessage}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 bg-[#12141C] rounded-2xl border border-white/[0.07] divide-y divide-white/[0.05] max-h-[560px] overflow-y-auto">
                        {filtered.map((item) => {
                            const active = selected?.id === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelectedId(item.id)}
                                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                                        active
                                            ? "bg-[#D4AF37]/12"
                                            : "hover:bg-white/[0.02]"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-zinc-100 truncate">
                                            {item.name}
                                        </span>
                                        <AdminStatusBadge
                                            status={item.status}
                                        />
                                    </div>
                                    <div className="text-[11px] text-zinc-400 mt-1 truncate">
                                        {item.course_interest ||
                                            "General Inquiry"}{" "}
                                        · {item.email}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 mt-1">
                                        {new Date(
                                            item.created_at
                                        ).toLocaleString()}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-7 bg-[#12141C] rounded-2xl border border-white/[0.07] p-6">
                        {selected ? (
                            <form
                                key={selected.id}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={selected.id}
                                />
                                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/[0.07]">
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-50">
                                            {selected.name}
                                        </h2>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 text-[#D4AF37]" />
                                                {selected.email}
                                            </span>
                                            {selected.phone ? (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Phone className="h-3.5 w-3.5 text-[#D4AF37]" />
                                                    {selected.phone}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <AdminStatusBadge
                                        status={selected.status}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.06]">
                                        <span className="text-zinc-500 block mb-1">
                                            Programme Interest
                                        </span>
                                        <span className="font-semibold text-zinc-100">
                                            {selected.course_interest ||
                                                "Not specified"}
                                        </span>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.06]">
                                        <span className="text-zinc-500 block mb-1">
                                            Submitted On
                                        </span>
                                        <span className="font-semibold text-zinc-100">
                                            {new Date(
                                                selected.created_at
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-[#0B0D12] border border-white/[0.06] text-xs">
                                    <span className="text-zinc-500 block mb-1.5">
                                        Submitted Message
                                    </span>
                                    <p className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
                                        {selected.message ||
                                            "No additional message submitted."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                            Workflow Status
                                        </label>
                                        <select
                                            name="status"
                                            defaultValue={selected.status}
                                            className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 outline-none"
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">
                                                Contacted
                                            </option>
                                            <option value="converted">
                                                Converted / Admitted
                                            </option>
                                            <option value="closed">
                                                Closed
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                        Internal Counselor Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        defaultValue={selected.notes ?? ""}
                                        placeholder="Record follow-up notes (protected by admin-only RLS)..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors disabled:opacity-60 cursor-pointer"
                                    >
                                        <Save className="h-3.5 w-3.5" />
                                        {isPending
                                            ? "Saving..."
                                            : "Update Inquiry"}
                                    </button>
                                </div>
                            </form>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
