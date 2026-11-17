"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
    AdminStatusBadge,
    formatAdminDateTime,
} from "@/components/admin/admin-primitives";

export interface AuditLogRow {
    id: string;
    actor_email: string | null;
    actor_role: string | null;
    action: string;
    entity_type: string;
    entity_id: string | null;
    ip_address: string | null;
    created_at: string;
}

export function AuditLogsViewer({ logs }: { logs: AuditLogRow[] }) {
    const [query, setQuery] = useState("");
    const [actionFilter, setActionFilter] = useState("ALL");

    const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

    const filtered = logs.filter((log) => {
        if (actionFilter !== "ALL" && log.action !== actionFilter) {
            return false;
        }
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
            (log.actor_email ?? "").toLowerCase().includes(q) ||
            log.entity_type.toLowerCase().includes(q) ||
            log.action.toLowerCase().includes(q) ||
            (log.entity_id ?? "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="space-y-4">
            <div className="bg-[#12141C] p-4 rounded-2xl border border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filter by actor email, entity, action, or record ID..."
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] text-xs text-zinc-100 placeholder:text-zinc-500 outline-none"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="h-10 px-3.5 rounded-xl bg-[#0B0D12] border border-white/[0.1] text-xs text-zinc-200 focus:border-[#D4AF37] outline-none"
                    >
                        <option value="ALL">All Actions</option>
                        {uniqueActions.map((act) => (
                            <option key={act} value={act}>
                                {act}
                            </option>
                        ))}
                    </select>
                    <span className="text-xs text-zinc-400">
                        {filtered.length} event
                        {filtered.length === 1 ? "" : "s"}
                    </span>
                </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#12141C] overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="p-12 text-center text-xs text-zinc-500">
                        No audit log entries match your current filter.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.07] bg-[#0E1017]">
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Timestamp
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Actor
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Role
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Action
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Entity
                                    </th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                        Record ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05] text-xs">
                                {filtered.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-white/[0.02]"
                                    >
                                        <td className="px-5 py-3.5 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                                            {formatAdminDateTime(
                                                log.created_at
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 font-medium text-zinc-200">
                                            {log.actor_email || "System"}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-[11px] text-[#E5C158]">
                                            {log.actor_role || "—"}
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <AdminStatusBadge
                                                status={log.action}
                                            />
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-zinc-300">
                                            {log.entity_type}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-[11px] text-zinc-500 max-w-[180px] truncate">
                                            {log.entity_id || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
