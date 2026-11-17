"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Pencil,
    Plus,
    Save,
    Search,
    Trash2,
    X,
    Images,
    FileText,
    Building2,
    GraduationCap,
    LayoutGrid,
    List,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import type { CmsActionResult } from "@/actions/cms";
import type { AdminRole } from "@/lib/auth/rbac";
import { AdminStatusBadge } from "./admin-primitives";
import { MediaPickerModal } from "./media-picker-modal";
import {
    AdminThumbnail,
    AdminImagePreviewModal,
    AdminFormImagePreview,
    type AdminPreviewImageData,
    type AdminThumbnailProps,
    type AdminImagePreviewModalProps,
    type AdminFormImagePreviewProps,
} from "./admin-image-preview";

export {
    AdminThumbnail,
    AdminImagePreviewModal,
    AdminFormImagePreview,
    type AdminPreviewImageData,
    type AdminThumbnailProps,
    type AdminImagePreviewModalProps,
    type AdminFormImagePreviewProps,
};

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
    mediaPicker?: {
        category: "image" | "document";
        allowedBuckets?: readonly string[];
        modalTitle?: string;
    };
}

export interface CmsColumnConfig {
    key: string;
    label: string;
    isStatus?: boolean;
    isMono?: boolean;
    isImage?: boolean;
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
    layoutMode?: "table" | "grid";
    defaultPageSize?: number;
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
    layoutMode = "table",
    defaultPageSize,
}: CmsCollectionManagerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState("");
    const [viewMode, setViewMode] = useState<"table" | "grid">(layoutMode);
    const [statusFilter, setStatusFilter] = useState("all");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [pageSize, setPageSize] = useState<number>(
        defaultPageSize ?? (layoutMode === "grid" ? 12 : 25)
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [editingItem, setEditingItem] = useState<Record<
        string,
        unknown
    > | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [activePickerField, setActivePickerField] = useState<{
        fieldName: string;
        category: "image" | "document";
        allowedBuckets?: readonly string[];
        modalTitle?: string;
    } | null>(null);
    const [previewImage, setPreviewImage] =
        useState<AdminPreviewImageData | null>(null);

    const canCreate =
        role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR";
    const canDelete = role === "SUPER_ADMIN" || role === "ADMIN";

    const availableDepartments = useMemo(() => {
        const set = new Set<string>();
        for (const item of items) {
            const dept = item.department_name || item.department;
            if (typeof dept === "string" && dept.trim()) {
                set.add(dept.trim());
            }
        }
        return Array.from(set).sort();
    }, [items]);

    const availableStatuses = useMemo(() => {
        const set = new Set<string>();
        for (const item of items) {
            const st = item.status;
            if (typeof st === "string" && st.trim()) {
                set.add(st.trim());
            }
        }
        return Array.from(set).sort();
    }, [items]);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (
                statusFilter !== "all" &&
                String(item.status ?? "").toLowerCase() !==
                    statusFilter.toLowerCase()
            ) {
                return false;
            }
            if (departmentFilter !== "all") {
                const dept = String(
                    item.department_name ?? item.department ?? ""
                );
                if (
                    dept.toLowerCase() !== departmentFilter.toLowerCase()
                ) {
                    return false;
                }
            }
            if (!query.trim()) return true;
            const q = query.toLowerCase().trim();
            return searchKeys.some((k) =>
                String(item[k] ?? "")
                    .toLowerCase()
                    .includes(q)
            );
        });
    }, [items, query, searchKeys, statusFilter, departmentFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredItems.length / (pageSize || 1))
    );
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedItems = useMemo(() => {
        if (pageSize === 0) return filteredItems;
        const start = (safeCurrentPage - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, safeCurrentPage, pageSize]);

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
            <div className="flex flex-col gap-3 bg-[#12141C] p-4 rounded-2xl border border-white/[0.07]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={`Search ${entityLabel.toLowerCase()} records...`}
                            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Status Filter */}
                        {availableStatuses.length > 0 ? (
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-10 px-3 rounded-xl bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] text-xs text-zinc-300 outline-none cursor-pointer"
                                aria-label="Filter by status"
                            >
                                <option value="all">All Statuses</option>
                                {availableStatuses.map((st) => (
                                    <option key={st} value={st}>
                                        {st.charAt(0).toUpperCase() + st.slice(1)}
                                    </option>
                                ))}
                            </select>
                        ) : null}

                        {/* Department Filter (if applicable) */}
                        {availableDepartments.length > 0 ? (
                            <select
                                value={departmentFilter}
                                onChange={(e) => {
                                    setDepartmentFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-10 px-3 rounded-xl bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] text-xs text-zinc-300 outline-none cursor-pointer max-w-[200px] truncate"
                                aria-label="Filter by department"
                            >
                                <option value="all">All Departments</option>
                                {availableDepartments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        ) : null}

                        {/* View Switcher (Grid vs Table) */}
                        <div className="flex items-center p-1 bg-[#0B0D12] rounded-xl border border-white/[0.08]">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                title="Switch to Card Grid View"
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === "grid"
                                        ? "bg-[#D4AF37]/20 text-[#E5C158]"
                                        : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                title="Switch to Table View"
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    viewMode === "table"
                                        ? "bg-[#D4AF37]/20 text-[#E5C158]"
                                        : "text-zinc-400 hover:text-zinc-200"
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Count & Create */}
                        <span className="text-xs text-zinc-400 px-1 hidden sm:inline">
                            {filteredItems.length} {filteredItems.length === 1 ? "record" : "records"}
                        </span>

                        {canCreate ? (
                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors cursor-pointer shrink-0"
                            >
                                <Plus className="h-4 w-4" />
                                New {entityLabel}
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            {feedback ? (
                <div
                    className={`rounded-xl px-4 py-3 text-xs font-medium border flex items-center justify-between ${feedback.type === "success"
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

            {/* Records Display: Card Grid or Data Table */}
            {filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-[#12141C] px-6 py-12 text-center">
                    <p className="text-sm font-medium text-zinc-300">
                        No {entityLabel.toLowerCase()} records found.
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                        {canCreate
                            ? `Click "New ${entityLabel}" above to create a record.`
                            : "No records match the current filter or search criteria."}
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                /* Card-Based Grid Layout */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                    {paginatedItems.map((item) => {
                        const id = String(item.id ?? "");
                        const labelText = String(item.title ?? item.name ?? id);
                        const designation = item.designation
                            ? String(item.designation)
                            : undefined;
                        const department_name = item.department_name
                            ? String(item.department_name)
                            : item.department
                            ? String(item.department)
                            : undefined;
                        const qualifications = item.qualifications
                            ? String(item.qualifications)
                            : undefined;
                        const email = item.email ? String(item.email) : undefined;
                        const status = item.status ? String(item.status) : "draft";
                        const isVisible =
                            item.is_visible !== undefined
                                ? Boolean(item.is_visible)
                                : undefined;

                        const imgUrl = String(
                            item.image_url ??
                                item.poster_url ??
                                item.featured_image_url ??
                                item.image_path ??
                                ""
                        ).trim();

                        const editorLocked =
                            role === "EDITOR" &&
                            String(item.status ?? "draft") !== "draft";

                        return (
                            <div
                                key={id}
                                className="rounded-2xl border border-white/[0.08] bg-[#12141C] hover:border-[#D4AF37]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all p-4 flex flex-col justify-between gap-3 group relative h-full"
                            >
                                {/* Top section: Photo on left, info on right */}
                                <div className="flex items-start gap-3.5 min-w-0">
                                    {/* Profile Photo */}
                                    <div className="shrink-0">
                                        <AdminThumbnail
                                            src={imgUrl}
                                            alt={labelText}
                                            title={labelText}
                                            category={department_name}
                                            album={designation}
                                            caption={qualifications}
                                            status={status}
                                            className="w-[74px] h-[92px] sm:w-[80px] sm:h-[100px] rounded-xl object-cover"
                                            onPreview={(data) =>
                                                setPreviewImage(data)
                                            }
                                        />
                                    </div>

                                    {/* Faculty Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <AdminStatusBadge status={status} />
                                            {isVisible !== undefined ? (
                                                <span
                                                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                                                        isVisible
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                            : "bg-zinc-800 text-zinc-400 border-white/5"
                                                    }`}
                                                    title={
                                                        isVisible
                                                            ? "Visible on public directory"
                                                            : "Hidden from public directory"
                                                    }
                                                >
                                                    {isVisible ? "Visible" : "Hidden"}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="pt-0.5">
                                            <h3
                                                className="text-sm font-bold text-zinc-100 group-hover:text-[#E5C158] transition-colors truncate"
                                                title={labelText}
                                            >
                                                {labelText}
                                            </h3>
                                            {designation ? (
                                                <p
                                                    className="text-xs font-semibold text-[#D4AF37] truncate mt-0.5"
                                                    title={designation}
                                                >
                                                    {designation}
                                                </p>
                                            ) : null}
                                        </div>

                                        {department_name ? (
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 truncate mt-0.5">
                                                <Building2 className="h-3 w-3 shrink-0 text-zinc-500" />
                                                <span
                                                    className="truncate"
                                                    title={department_name}
                                                >
                                                    {department_name}
                                                </span>
                                            </div>
                                        ) : null}

                                        {qualifications ? (
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 truncate">
                                                <GraduationCap className="h-3 w-3 shrink-0 text-zinc-600" />
                                                <span
                                                    className="truncate"
                                                    title={qualifications}
                                                >
                                                    {qualifications}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Bottom section: Email & Action Buttons */}
                                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 mt-auto">
                                    <div className="min-w-0 text-[11px] text-zinc-500 truncate font-mono">
                                        {email ? (
                                            <span className="truncate block" title={email}>
                                                {email}
                                            </span>
                                        ) : (
                                            <span className="text-zinc-600">—</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                                        <button
                                            type="button"
                                            disabled={editorLocked}
                                            title={
                                                editorLocked
                                                    ? "Editors cannot modify published records"
                                                    : `Edit ${labelText}`
                                            }
                                            onClick={() => openEdit(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37]/15 text-zinc-200 hover:text-[#E5C158] border border-white/[0.08] hover:border-[#D4AF37]/30 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit
                                        </button>
                                        {canDelete ? (
                                            <button
                                                type="button"
                                                disabled={isPending}
                                                onClick={() =>
                                                    handleDelete(id, labelText)
                                                }
                                                className="inline-flex items-center p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors disabled:opacity-40 cursor-pointer"
                                                title={`Delete ${labelText}`}
                                                aria-label={`Delete ${labelText}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Data Table View */
                <div className="rounded-2xl border border-white/[0.07] bg-[#12141C] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.07] bg-[#0E1017]">
                                    {columns.map((col) => (
                                        <th
                                            key={col.key}
                                            className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 ${
                                                col.isImage ? "w-[96px]" : ""
                                            }`}
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
                                {paginatedItems.map((item) => {
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

                                                if (col.isImage) {
                                                    const imgUrl = String(
                                                        rawVal ??
                                                        item.image_url ??
                                                        item.poster_url ??
                                                        item.featured_image_url ??
                                                        item.image_path ??
                                                        ""
                                                    ).trim();
                                                    const itemCategory =
                                                        item.category
                                                            ? String(
                                                                item.category
                                                            )
                                                            : item.department_name
                                                                ? String(
                                                                    item.department_name
                                                                )
                                                                : undefined;
                                                    const itemDetail =
                                                        item.album_name
                                                            ? `Album: ${String(item.album_name)}`
                                                            : item.designation
                                                                ? String(
                                                                    item.designation
                                                                )
                                                                : item.display_date_text
                                                                    ? String(
                                                                        item.display_date_text
                                                                    )
                                                                    : item.frequency
                                                                        ? `Frequency: ${String(item.frequency)}`
                                                                        : undefined;
                                                    const itemCaption =
                                                        item.caption
                                                            ? String(
                                                                item.caption
                                                            )
                                                            : item.description
                                                                ? String(
                                                                    item.description
                                                                )
                                                                : item.excerpt
                                                                    ? String(
                                                                        item.excerpt
                                                                    )
                                                                    : item.bio
                                                                        ? String(
                                                                            item.bio
                                                                        )
                                                                        : item.qualifications
                                                                            ? String(
                                                                                item.qualifications
                                                                            )
                                                                            : undefined;
                                                    const itemStatus =
                                                        item.status
                                                            ? String(
                                                                item.status
                                                            )
                                                            : undefined;

                                                    return (
                                                        <td
                                                            key={col.key}
                                                            className="px-5 py-2.5 whitespace-nowrap"
                                                        >
                                                            <AdminThumbnail
                                                                src={imgUrl}
                                                                alt={labelText}
                                                                title={labelText}
                                                                category={itemCategory}
                                                                album={itemDetail}
                                                                caption={itemCaption}
                                                                status={itemStatus}
                                                                onPreview={(
                                                                    data
                                                                ) =>
                                                                    setPreviewImage(
                                                                        data
                                                                    )
                                                                }
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
                                                        className={`px-5 py-3.5 max-w-xs truncate ${col.isMono
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
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-4">
                        <div>
                            Showing{" "}
                            <span className="font-semibold text-zinc-200">
                                {(safeCurrentPage - 1) * pageSize + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-zinc-200">
                                {Math.min(
                                    safeCurrentPage * pageSize,
                                    filteredItems.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-zinc-200">
                                {filteredItems.length}
                            </span>{" "}
                            items
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <span>Per page:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="h-7 px-2 rounded-lg bg-[#0B0D12] border border-white/[0.08] text-xs text-zinc-200 outline-none cursor-pointer"
                            >
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={safeCurrentPage <= 1}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-[#12141C] hover:bg-white/[0.05] text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => {
                                const pageNum = i + 1;
                                const isActive = pageNum === safeCurrentPage;
                                return (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                            isActive
                                                ? "bg-[#D4AF37] text-[#0B0D12]"
                                                : "border border-white/[0.08] bg-[#12141C] text-zinc-300 hover:bg-white/[0.05]"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={safeCurrentPage >= totalPages}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-[#12141C] hover:bg-white/[0.05] text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            ) : null}

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
                                                    value={String(
                                                        editingItem[field.name] ??
                                                        field.defaultValue ??
                                                        ""
                                                    )}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setEditingItem((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    [field.name]:
                                                                        v,
                                                                }
                                                                : null
                                                        );
                                                    }}
                                                    placeholder={
                                                        field.placeholder
                                                    }
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
                                                />
                                            ) : field.type === "select" ? (
                                                <select
                                                    name={field.name}
                                                    value={String(
                                                        editingItem[field.name] ??
                                                        field.defaultValue ??
                                                        ""
                                                    )}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setEditingItem((prev) =>
                                                            prev
                                                                ? {
                                                                    ...prev,
                                                                    [field.name]:
                                                                        v,
                                                                }
                                                                : null
                                                        );
                                                    }}
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
                                            ) : field.mediaPicker ? (
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type={
                                                                field.type === "url"
                                                                    ? "text"
                                                                    : field.type
                                                            }
                                                            name={field.name}
                                                            required={field.required}
                                                            value={String(
                                                                editingItem[field.name] ??
                                                                ""
                                                            )}
                                                            onChange={(e) => {
                                                                const v = e.target.value;
                                                                setEditingItem((prev) =>
                                                                    prev
                                                                        ? {
                                                                            ...prev,
                                                                            [field.name]:
                                                                                v,
                                                                        }
                                                                        : null
                                                                );
                                                            }}
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                            className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setActivePickerField({
                                                                    fieldName: field.name,
                                                                    category: field.mediaPicker!.category,
                                                                    allowedBuckets: field.mediaPicker!.allowedBuckets,
                                                                    modalTitle: field.mediaPicker!.modalTitle,
                                                                })
                                                            }
                                                            className="inline-flex items-center gap-1.5 px-3 rounded-xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#E5C158] text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                                                            title={
                                                                field.mediaPicker.category === "image"
                                                                    ? "Choose Image from Media Library"
                                                                    : "Choose PDF from Document Repository"
                                                            }
                                                        >
                                                            {field.mediaPicker.category === "image" ? (
                                                                <Images className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <FileText className="h-3.5 w-3.5" />
                                                            )}
                                                            <span>Browse</span>
                                                        </button>
                                                    </div>

                                                    {editingItem[field.name] ? (
                                                        <AdminFormImagePreview
                                                            url={String(
                                                                editingItem[
                                                                    field.name
                                                                ]
                                                            )}
                                                            title={String(
                                                                editingItem.title ??
                                                                    editingItem.name ??
                                                                    field.label
                                                            )}
                                                            category={
                                                                field
                                                                    .mediaPicker
                                                                    .category
                                                            }
                                                            onClear={() => {
                                                                setEditingItem(
                                                                    (prev) =>
                                                                        prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  [field.name]:
                                                                                      "",
                                                                              }
                                                                            : null
                                                                );
                                                            }}
                                                            onPreview={(data) =>
                                                                setPreviewImage(
                                                                    data
                                                                )
                                                            }
                                                        />
                                                    ) : null}
                                                </div>
                                            ) : field.type === "url" ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        name={field.name}
                                                        required={
                                                            field.required
                                                        }
                                                        value={String(
                                                            editingItem[
                                                                field.name
                                                            ] ??
                                                                field.defaultValue ??
                                                                ""
                                                        )}
                                                        onChange={(e) => {
                                                            const v =
                                                                e.target.value;
                                                            setEditingItem(
                                                                (prev) =>
                                                                    prev
                                                                        ? {
                                                                              ...prev,
                                                                              [field.name]:
                                                                                  v,
                                                                          }
                                                                        : null
                                                            );
                                                        }}
                                                        placeholder={
                                                            field.placeholder
                                                        }
                                                        className="w-full h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-600 outline-none"
                                                    />
                                                    {editingItem[field.name] ? (
                                                        <AdminFormImagePreview
                                                            url={String(
                                                                editingItem[
                                                                    field.name
                                                                ]
                                                            )}
                                                            title={String(
                                                                editingItem.title ??
                                                                    editingItem.name ??
                                                                    field.label
                                                            )}
                                                            onClear={() => {
                                                                setEditingItem(
                                                                    (prev) =>
                                                                        prev
                                                                            ? {
                                                                                  ...prev,
                                                                                  [field.name]:
                                                                                      "",
                                                                              }
                                                                            : null
                                                                );
                                                            }}
                                                            onPreview={(data) =>
                                                                setPreviewImage(
                                                                    data
                                                                )
                                                            }
                                                        />
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    required={field.required}
                                                    value={String(
                                                        editingItem[field.name] ??
                                                            field.defaultValue ??
                                                            ""
                                                    )}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setEditingItem((prev) =>
                                                            prev
                                                                ? {
                                                                      ...prev,
                                                                      [field.name]:
                                                                          v,
                                                                  }
                                                                : null
                                                        );
                                                    }}
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

            {activePickerField ? (
                <MediaPickerModal
                    key={activePickerField.fieldName}
                    isOpen={Boolean(activePickerField)}
                    onClose={() => setActivePickerField(null)}
                    category={activePickerField.category}
                    allowedBuckets={activePickerField.allowedBuckets}
                    title={activePickerField.modalTitle}
                    currentValue={String(
                        editingItem?.[activePickerField.fieldName] ?? ""
                    )}
                    onSelect={(chosenUrl) => {
                        if (activePickerField) {
                            setEditingItem((prev) =>
                                prev
                                    ? {
                                        ...prev,
                                        [activePickerField.fieldName]:
                                            chosenUrl,
                                    }
                                    : null
                            );
                        }
                    }}
                />
            ) : null}

            <AdminImagePreviewModal
                previewImage={previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </div>
    );
}
