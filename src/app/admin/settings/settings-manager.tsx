"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import {
    saveSiteSettingAction,
    deleteSiteSettingAction,
} from "@/actions/cms";
import { AdminStatusBadge } from "@/components/admin/admin-primitives";

export interface SiteSettingRow {
    key: string;
    category: string;
    value_json: Record<string, unknown>;
    description: string | null;
    is_public: boolean;
    updated_at: string;
}

export function SettingsManager({
    settings,
}: {
    settings: SiteSettingRow[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedKey, setSelectedKey] = useState<string | null>(
        settings[0]?.key ?? null
    );
    const [isNew, setIsNew] = useState(settings.length === 0);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const activeSetting = isNew
        ? null
        : settings.find((s) => s.key === selectedKey) ?? null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setFeedback(null);

        startTransition(async () => {
            const res = await saveSiteSettingAction(formData);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || "Site setting saved.",
                });
                setIsNew(false);
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || "Failed to save site setting.",
                });
            }
        });
    };

    const handleDelete = (key: string) => {
        if (!window.confirm(`Delete setting key "${key}"?`)) return;
        setFeedback(null);

        startTransition(async () => {
            const res = await deleteSiteSettingAction(key);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || "Setting deleted.",
                });
                setSelectedKey(null);
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || "Failed to delete setting.",
                });
            }
        });
    };

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 bg-[#12141C] rounded-2xl border border-white/[0.07] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/[0.07] bg-[#0E1017]">
                        <button
                            type="button"
                            onClick={() => {
                                setIsNew(true);
                                setSelectedKey(null);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            New Setting Key
                        </button>
                    </div>
                    <div className="divide-y divide-white/[0.05] max-h-[480px] overflow-y-auto">
                        {settings.length === 0 ? (
                            <div className="p-6 text-center text-xs text-zinc-500">
                                No keys stored in public.site_settings yet.
                            </div>
                        ) : (
                            settings.map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => {
                                        setIsNew(false);
                                        setSelectedKey(item.key);
                                    }}
                                    className={`w-full text-left p-4 transition-colors cursor-pointer ${
                                        !isNew && selectedKey === item.key
                                            ? "bg-[#D4AF37]/12"
                                            : "hover:bg-white/[0.02]"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-mono text-xs font-semibold text-zinc-100 truncate">
                                            {item.key}
                                        </span>
                                        <AdminStatusBadge
                                            status={
                                                item.is_public
                                                    ? "public"
                                                    : "internal"
                                            }
                                        />
                                    </div>
                                    <div className="text-[11px] text-zinc-500 mt-1">
                                        Category: {item.category}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-8 bg-[#12141C] rounded-2xl border border-white/[0.07] p-6">
                    <form
                        key={isNew ? "new-setting" : activeSetting?.key ?? "none"}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
                            <h2 className="text-sm font-bold text-zinc-100">
                                {isNew || !activeSetting
                                    ? "Create Global Site Setting"
                                    : `Edit Setting: ${activeSetting.key}`}
                            </h2>
                            {activeSetting ? (
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() =>
                                        handleDelete(activeSetting.key)
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-300 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 cursor-pointer"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            ) : null}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    Setting Key *
                                </label>
                                <input
                                    type="text"
                                    name="key"
                                    required
                                    readOnly={Boolean(activeSetting)}
                                    defaultValue={activeSetting?.key ?? ""}
                                    placeholder="contact.admissions_phone"
                                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] font-mono text-xs text-zinc-100 outline-none read-only:opacity-70"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    defaultValue={
                                        activeSetting?.category ?? "general"
                                    }
                                    placeholder="general / contact / social / seo"
                                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                Description
                            </label>
                            <input
                                type="text"
                                name="description"
                                defaultValue={activeSetting?.description ?? ""}
                                placeholder="Purpose of this configuration entry..."
                                className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                JSON Value (public.site_settings.value_json) *
                            </label>
                            <textarea
                                name="value_raw"
                                rows={6}
                                required
                                defaultValue={
                                    activeSetting
                                        ? JSON.stringify(
                                              activeSetting.value_json,
                                              null,
                                              2
                                          )
                                        : '{\n  "enabled": true\n}'
                                }
                                className="w-full p-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] font-mono text-xs text-zinc-100 outline-none"
                            />
                        </div>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B0D12] border border-white/[0.08] text-xs text-zinc-200 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_public"
                                value="true"
                                defaultChecked={
                                    activeSetting?.is_public ?? true
                                }
                                className="h-4 w-4 accent-[#D4AF37]"
                            />
                            Readable by Public Website (is_public = true)
                        </label>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                <Save className="h-3.5 w-3.5" />
                                {isPending ? "Saving..." : "Save Setting"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
