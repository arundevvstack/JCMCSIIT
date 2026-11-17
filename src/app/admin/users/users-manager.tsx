"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, ShieldCheck } from "lucide-react";
import { updateAdminMemberAction } from "@/actions/cms";
import type { AdminRole } from "@/lib/auth/rbac";
import {
    AdminStatusBadge,
    formatAdminDateTime,
} from "@/components/admin/admin-primitives";

export interface AdminUserRow {
    id: string;
    email: string;
    full_name: string;
    role: AdminRole;
    is_active: boolean;
    last_login_at: string | null;
    created_at: string;
}

export function UsersManager({
    members,
    currentAdminId,
}: {
    members: AdminUserRow[];
    currentAdminId: string;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const handleRowSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setFeedback(null);

        startTransition(async () => {
            const res = await updateAdminMemberAction(formData);
            if (res.ok) {
                setFeedback({
                    type: "success",
                    text: res.message || "Administrator permissions updated.",
                });
                router.refresh();
            } else {
                setFeedback({
                    type: "error",
                    text:
                        res.error ||
                        "Failed to update administrator permissions.",
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

            <div className="space-y-4">
                {members.map((m) => {
                    const isSelf = m.id === currentAdminId;
                    return (
                        <form
                            key={m.id}
                            onSubmit={handleRowSave}
                            className="rounded-2xl border border-white/[0.08] bg-[#12141C] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                            <input type="hidden" name="id" value={m.id} />

                            <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2.5">
                                    <ShieldCheck className="h-4 w-4 text-[#D4AF37] shrink-0" />
                                    <input
                                        type="text"
                                        name="full_name"
                                        defaultValue={m.full_name}
                                        required
                                        className="bg-[#0B0D12] border border-white/[0.08] focus:border-[#D4AF37] rounded-lg px-3 py-1 text-xs font-bold text-zinc-100 outline-none"
                                    />
                                    {isSelf ? (
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/30">
                                            Current Session
                                        </span>
                                    ) : null}
                                </div>
                                <div className="text-xs text-zinc-400 font-mono pl-6">
                                    {m.email}
                                </div>
                                <div className="text-[11px] text-zinc-500 pl-6">
                                    Last login:{" "}
                                    {m.last_login_at
                                        ? formatAdminDateTime(
                                              m.last_login_at
                                          )
                                        : "Recorded in audit_logs"}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <AdminStatusBadge
                                    status={m.is_active ? "active" : "inactive"}
                                />

                                <select
                                    name="role"
                                    defaultValue={m.role}
                                    disabled={isSelf}
                                    className="h-9 px-3 rounded-xl bg-[#0B0D12] border border-white/[0.1] text-xs font-semibold text-zinc-200 focus:border-[#D4AF37] outline-none disabled:opacity-60"
                                >
                                    <option value="SUPER_ADMIN">
                                        SUPER_ADMIN
                                    </option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="PUBLISHER">PUBLISHER</option>
                                    <option value="EDITOR">EDITOR</option>
                                </select>
                                {isSelf ? (
                                    <input
                                        type="hidden"
                                        name="role"
                                        value={m.role}
                                    />
                                ) : null}

                                <label className="flex items-center gap-2 px-3 h-9 rounded-xl bg-[#0B0D12] border border-white/[0.1] text-xs text-zinc-200">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        value="true"
                                        defaultChecked={m.is_active}
                                        disabled={isSelf}
                                        className="h-3.5 w-3.5 accent-[#D4AF37]"
                                    />
                                    Active
                                </label>
                                {isSelf ? (
                                    <input
                                        type="hidden"
                                        name="is_active"
                                        value="true"
                                    />
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors disabled:opacity-60 cursor-pointer"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    Save
                                </button>
                            </div>
                        </form>
                    );
                })}
            </div>
        </div>
    );
}
