"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2, Save, X } from "lucide-react";
import type { CmsActionResult } from "@/actions/cms";
import type { AdminRole } from "@/lib/auth/rbac";
import { AdminStatusBadge } from "./admin-primitives";

export interface CmsFieldConfig {
    name: string;
    label: string;
    type:
        | "text"
        | "textarea"
        | "select"
        | "number"
        | "date"
        | "checkbox"
        | "url";
    required?: boolean;
    placeholder?: string;
    options?: readonly { label: string; value: string }[];
    defaultValue?: string | boolean;
    colSpan?: 1 | 2;
}

export interface CmsColumnConfig {
    key: string;
    label: string;
    isStatus?: boolean;
    isMono?: boolean;
}

interface CmsCollectionManagerProps {
    entityLabel: string;
    role: AdminRole;
    items: Record<string, unknown>[];
    columns: readonly CmsColumnConfig[];
    fields: readonly CmsFieldConfig[];
    searchKeys: readonly string[];
    saveAction: (formData: FormData) => Promise<CmsActionResult>;
    deleteAction: (id: string) => Promise<CmsActionResult>;
}

const WORKFLOW_OPTIONS_ADMIN = [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
] as const;

const WORKFLOW_OPTIONS_EDITOR = [
    { label: "Draft (Editor Restricted)", value: "draft" },
] as const;

export function CmsCollectionManager({
    entityLabel,
    role,
    items,
    columns,
    fields,
    searchKeys,
    saveAction,
    deleteAction,
}: CmsCollectionManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState("");
    const [editingItem, setEditingItem] = useState<Record<
        string,
        unknown
    > | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const canCreate =
        role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR";
    const canDelete = role === "SUPER_ADMIN" || role === "ADMIN";

    const filteredItems = items.filter((item) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return searchKeys.some((k) =>
            String(item[k] ?? "")
                .toLowerCase()
                .includes(q)
        );
    });

    const openCreate = () => {
        const defaults: Record<string, unknown> = { status: "draft" };
        for (const f of fields) {
            if (f.defaultValue !== undefined) {
                defaults[f.name] = f.defaultValue;
            }
        }
        setFeedback(null);
        setIsCreating(true);
        setEditingItem(defaults);
    };

    const openEdit = (item: Record<string, unknown>) => {
        setFeedback(null);
        setIsCreating(false);
        setEditingItem({ ...item });
    };

    const closeModal = () => {
        setEditingItem(null);
        setIsCreating(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const res = await saveAction(formData);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || `${entityLabel} saved to Supabase.`,
                });
                closeModal();
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || `Failed to save ${entityLabel}.`,
                });
            }
        });
    };

    const handleDelete = (id: string, displayTitle: string) => {
        if (
            !window.confirm(
                `Permanently delete "${displayTitle}" from the database?`
            )
        ) {
            return;
        }

        startTransition(async () => {
            const res = await deleteAction(id);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || `${entityLabel} deleted.`,
                });
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text: res.error || `Failed to delete ${entityLabel}.`,
                });
            }
        });
    };

    return (
        <div className="space-y-5">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12141C] p-4 rounded-2xl border border-white/[0.07]">
                <div className="relative flex-1 max-w-md">
                    <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Search ${entityLabel.toLowerCase()} records...`}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">
                        {filteredItems.length} record
                        {filteredItems.length === 1 ? "" : "s"}
                    </span>
                    {canCreate ? (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            New {entityLabel}
                        </button>
                    ) : null}
                </div>
            </div>

            {feedback ? (
                <div
                    className={`rounded-xl px-4 py-3 text-xs font-medium border flex items-center justify-between ${
                        feedback.type === "success"
                            ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                            : "bg-red-950/40 border-red-500/30 text-red-200"
                    }`}
                >
                    <span>{feedback.text}</span>
                    <button
                        type="button"
                        onClick={() => setFeedback(null)}
                        className="text-zinc-400 hover:text-zinc-100"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ) : null}

            {/* Data Table */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#12141C] overflow-hidden">
                {filteredItems.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-zinc-300">
                            No {entityLabel.toLowerCase()} records found in
                            Supabase.
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            {canCreate
                                ? `Click "New ${entityLabel}" above to create the first database record.`
                                : "No records match the current filter."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.07] bg-[#0E1017]">
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
                                        >
                                            {col.label}
                                        </th>
                                    ))}
                                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05] text-xs">
                                {filteredItems.map((item) => {
                                    const id = String(item.id ?? "");
                                    const labelText = String(
                                        item.title ?? item.name ?? id
                                    );
                                    const editorLocked =
                                        role === "EDITOR" &&
                                        String(item.status ?? "draft") !==
                                            "draft";

                                    return (
                                        <tr
                                            key={id}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            {columns.map((col) => {
                                                const rawVal = item[col.key];
                                                if (col.isStatus) {
                                                    return (
                                                        <td
                                                            key={col.key}
                                                            className="px-5 py-3.5 whitespace-nowrap"
                                                        >
                                                            <AdminStatusBadge
                                                                status={String(
                                                                    rawVal ??
                                                                        "draft"
                                                                )}
                                                            />
                                                        </td>
                                                    );
                                                }
                                                const formatted =
                                                    typeof rawVal === "boolean"
                                                        ? rawVal
                                                            ? "Yes"
                                                            : "No"
                                                        : rawVal === null ||
                                                            rawVal ===
                                                                undefined ||
                                                            rawVal === ""
                                                          ? "—"
                                                          : String(rawVal);

                                                return (
                                                    <td
                                                        key={col.key}
                                                        className={`px-5 py-3.5 max-w-xs truncate ${
                                                            col.isMono
                                                                ? "font-mono text-zinc-400"
                                                                : "text-zinc-200 font-medium"
                                                        }`}
                                                    >
                                                        {formatted}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={editorLocked}
                                                        title={
                                                            editorLocked
                                                                ? "Editors cannot modify published or archived records"
                                                                : "Edit record"
                                                        }
                                                        onClick={() =>
                                                            openEdit(item)
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37]/15 text-zinc-200 hover:text-[#E5C158] border border-white/[0.08] disabled:opacity-40 transition-colors cursor-pointer"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                        Edit
                                                    </button>
                                                    {canDelete ? (
                                                        <button
                                                            type="button"
                                                            disabled={isPending}
                                                            onClick={() =>
                                                                handleDelete(
                                                                    id,
                                                                    labelText
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            {editingItem ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
                    <div className="w-full max-w-2xl max-h-[90vh] bg-[#12141C] border border-[#D4AF37]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1017]">
                            <h2 className="text-base font-bold text-zinc-50">
                                {isCreating
                                    ? `Create ${entityLabel}`
                                    : `Edit ${entityLabel}`}
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex-1 overflow-y-auto p-6 space-y-5"
                        >
                            {!isCreating && editingItem.id ? (
                                <input
                                    type="hidden"
                                    name="id"
                                    value={String(editingItem.id)}
                                />
                            ) : null}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {fields.map((field) => {
                                    const currentVal = editingItem[field.name];
                                    const spanClass =
                                        field.colSpan === 2 ||
                                        field.type === "textarea"
                                            ? "sm:col-span-2"
                                            : "";

                                    if (field.type === "checkbox") {
                                        const checked =
                                            currentVal !== undefined
                                                ? Boolean(currentVal)
                                                : Boolean(field.defaultValue);
                                        return (
                                            <label
                                                key={field.name}
                                                className={`flex items-center gap-2.5 p-3 rounded-xl bg-[#0B0D12] border border-white/[0.08] text-xs font-medium text-zinc-200 cursor-pointer ${spanClass}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name={field.name}
                                                    defaultChecked={checked}
                                                    value="true"
                                                    className="h-4 w-4 rounded accent-[#D4AF37]"
                                                />
                                                {field.label}
                                            </label>
                                        );
                                    }

                                    const selectOptions =
                                        field.name === "status"
                                            ? role === "EDITOR"
                                                ? WORKFLOW_OPTIONS_EDITOR
                                                : WORKFLOW_OPTIONS_ADMIN
                                            : (field.options ?? []);

                                    return (
                                        <div
                                            key={field.name}
                                            className={spanClass}
                                        >
                                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                                                {field.label}
                                                {field.required ? (
                                                    <span className="text-[#D4AF37] ml-1">
                                                        *
                                                    </span>
                                                ) : null}
                                            </label>

                                            {field.type === "textarea" ? (
                                                <textarea
                                                    name={field.name}
                                                    required={field.required}
                                                    rows={4}
                                                    defaultValue={String(
                                                        currentVal ??
                                                            field.defaultValue ??
                                                            ""
                                                    )}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
                                                />
                                            ) : field.type === "select" ? (
                                                <select
                                                    name={field.name}
                                                    defaultValue={String(
                                                        currentVal ??
                                                            field.defaultValue ??
                                                            ""
                                                    )}
                                                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 outline-none"
                                                >
                                                    {selectOptions.map(
                                                        (opt) => (
                                                            <option
                                                                key={opt.value}
                                                                value={
                                                                    opt.value
                                                                }
                                                            >
                                                                {opt.label}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            ) : (
                                                <input
                                                    type={
                                                        field.type === "url"
                                                            ? "text"
                                                            : field.type
                                                    }
                                                    name={field.name}
                                                    required={field.required}
                                                    defaultValue={String(
                                                        currentVal ??
                                                            field.defaultValue ??
                                                            ""
                                                    )}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-white/[0.05]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors disabled:opacity-60 cursor-pointer"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {isPending ? "Saving..." : "Save Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
