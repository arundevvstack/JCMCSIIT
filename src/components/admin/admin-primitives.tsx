import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, ArrowUpRight, Clock, ShieldAlert } from "lucide-react";

export type CmsWorkflowStatus = "draft" | "published" | "scheduled" | "archived";

export function AdminPageHeader({
    eyebrow,
    title,
    description,
    actions,
}: {
    eyebrow: string;
    title: string;
    description: string;
    actions?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b border-white/[0.08]">
            <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                    {eyebrow}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-50">
                    {title}
                </h1>
                <p className="mt-1.5 text-sm text-zinc-400 max-w-3xl">
                    {description}
                </p>
            </div>
            {actions ? (
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {actions}
                </div>
            ) : null}
        </div>
    );
}

export function AdminStatCard({
    label,
    value,
    sublabel,
    icon: Icon,
    href,
    goldAccent = false,
}: {
    label: string;
    value: string | number;
    sublabel?: string;
    icon: LucideIcon;
    href?: string;
    goldAccent?: boolean;
}) {
    const inner = (
        <div
            className={`rounded-2xl p-5 border transition-all h-full flex flex-col justify-between ${
                goldAccent
                    ? "bg-gradient-to-br from-[#1A160B] via-[#12141C] to-[#0E1016] border-[#D4AF37]/35 hover:border-[#D4AF37]/60"
                    : "bg-[#12141C] border-white/[0.07] hover:border-[#D4AF37]/30"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {label}
                </span>
                <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        goldAccent
                            ? "bg-[#D4AF37]/20 text-[#E5C158] border border-[#D4AF37]/30"
                            : "bg-white/[0.04] text-[#D4AF37] border border-white/[0.06]"
                    }`}
                >
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="mt-4">
                <div className="text-3xl font-bold tracking-tight text-zinc-50">
                    {value}
                </div>
                {sublabel ? (
                    <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
                        <span>{sublabel}</span>
                        {href ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block group">
                {inner}
            </Link>
        );
    }

    return inner;
}

export function AdminStatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();

    if (
        normalized === "published" ||
        normalized === "active" ||
        normalized === "connected" ||
        normalized === "converted"
    ) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {status}
            </span>
        );
    }

    if (
        normalized === "draft" ||
        normalized === "pending" ||
        normalized === "new" ||
        normalized === "upcoming"
    ) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D4AF37]/12 text-[#E5C158] border border-[#D4AF37]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                {status}
            </span>
        );
    }

    if (
        normalized === "scheduled" ||
        normalized === "contacted" ||
        normalized === "ongoing" ||
        normalized === "code_managed"
    ) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                {status}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-500/15 text-zinc-300 border border-zinc-500/25">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            {status}
        </span>
    );
}

export function AdminHonestNotice({
    title,
    children,
    variant = "info",
}: {
    title: string;
    children: React.ReactNode;
    variant?: "info" | "pending" | "restricted";
}) {
    const styles =
        variant === "restricted"
            ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
            : variant === "pending"
              ? "bg-[#19150A] border-[#D4AF37]/30 text-zinc-200"
              : "bg-[#121520] border-white/[0.09] text-zinc-300";

    const Icon =
        variant === "restricted"
            ? ShieldAlert
            : variant === "pending"
              ? Clock
              : AlertCircle;

    return (
        <div
            className={`rounded-2xl border p-4 flex items-start gap-3.5 text-sm ${styles}`}
        >
            <Icon className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-1">
                <div className="font-semibold text-zinc-100">{title}</div>
                <div className="text-xs leading-relaxed text-zinc-300">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function AdminEmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#0F1118] px-6 py-12 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] mb-4">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
            <p className="mt-1.5 text-xs text-zinc-400 max-w-md leading-relaxed">
                {description}
            </p>
        </div>
    );
}

/**
 * Deterministic date formatter with explicit 'en-IN' locale and 'Asia/Kolkata' timezone
 * to eliminate SSR/client React hydration mismatches on admin dashboards and log tables.
 */
export function formatAdminDateTime(
    isoString: string | null | undefined
): string {
    if (!isoString) return "—";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).format(d);
}
