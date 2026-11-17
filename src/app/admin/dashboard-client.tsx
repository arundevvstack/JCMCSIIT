"use client";

import Link from "next/link";
import {
    FileText,
    Newspaper,
    GraduationCap,
    Building2,
    Users,
    CalendarDays,
    Bell,
    Images,
    Blocks,
    UserCheck,
    ShieldCheck,
    ScrollText,
    ArrowUpRight,
} from "lucide-react";
import type { AdminProfile } from "@/lib/auth/rbac";
import {
    AdminHonestNotice,
    AdminPageHeader,
    AdminStatCard,
    AdminStatusBadge,
    formatAdminDateTime,
} from "@/components/admin/admin-primitives";

export interface DashboardSnapshot {
    pagesCount: number;
    newsCount: number;
    coursesCount: number;
    departmentsCount: number;
    facultyCount: number;
    eventsCount: number;
    noticesCount: number;
    blocksCount: number;
    mediaCount: number;
    inquiriesCount: number | null;
    activeAdminsCount: number | null;
    recentLogs: {
        id: string;
        actor_email: string | null;
        actor_role: string | null;
        action: string;
        entity_type: string;
        created_at: string;
    }[];
}

export function AdminDashboardClient({
    admin,
    snapshot,
}: {
    admin: AdminProfile;
    snapshot: DashboardSnapshot;
}) {
    const isAdminOrSuper =
        admin.role === "SUPER_ADMIN" || admin.role === "ADMIN";
    const isSuperAdmin = admin.role === "SUPER_ADMIN";

    return (
        <div className="space-y-8">
            <AdminPageHeader
                eyebrow="Executive Control Center"
                title={`Welcome back, ${admin.full_name}`}
                description="Real-time overview of live Supabase CMS tables, institutional collections, and role-governed publishing workflows."
                actions={
                    <Link
                        href="/admin/news"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090A0D] font-bold text-xs transition-colors"
                    >
                        Publish Announcement
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                }
            />

            <AdminHonestNotice
                title="Live Database Connected — Public Website Preserved"
                variant="info"
            >
                All counts below are queried live from your Supabase PostgreSQL
                database using your SSR cookie session and Row Level Security.
                Existing public website pages continue serving their preserved
                code-managed content until individual routes are explicitly
                switched to CMS rendering in a future migration step.
            </AdminHonestNotice>

            {/* Primary Institutional KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <AdminStatCard
                    label="Website Pages"
                    value={snapshot.pagesCount}
                    sublabel="CMS page records in Supabase"
                    icon={FileText}
                    href="/admin/content/pages"
                    goldAccent
                />
                <AdminStatCard
                    label="News & Announcements"
                    value={snapshot.newsCount}
                    sublabel="Articles & ticker bulletins"
                    icon={Newspaper}
                    href="/admin/news"
                />
                <AdminStatCard
                    label="Courses"
                    value={snapshot.coursesCount}
                    sublabel="UG, PG & Diploma programmes"
                    icon={GraduationCap}
                    href="/admin/courses"
                />
                <AdminStatCard
                    label="Departments"
                    value={snapshot.departmentsCount}
                    sublabel="Academic departments"
                    icon={Building2}
                    href="/admin/departments"
                />
                <AdminStatCard
                    label="Faculty & Staff"
                    value={snapshot.facultyCount}
                    sublabel="Directory profiles"
                    icon={Users}
                    href="/admin/faculty"
                />
                <AdminStatCard
                    label="Events"
                    value={snapshot.eventsCount}
                    sublabel="Campus & technical events"
                    icon={CalendarDays}
                    href="/admin/events"
                />
                <AdminStatCard
                    label="Notices"
                    value={snapshot.noticesCount}
                    sublabel="Circulars & exam notices"
                    icon={Bell}
                    href="/admin/notices"
                />
                <AdminStatCard
                    label="Content Blocks"
                    value={snapshot.blocksCount}
                    sublabel={`${snapshot.mediaCount} registered media assets`}
                    icon={Blocks}
                    href="/admin/content/blocks"
                />
            </div>

            {/* Governance Row for Admin / Super Admin */}
            {isAdminOrSuper ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <AdminStatCard
                            label="Admissions & Inquiries"
                            value={snapshot.inquiriesCount ?? 0}
                            sublabel="Student leads in public.inquiries"
                            icon={UserCheck}
                            href="/admin/admissions"
                            goldAccent
                        />
                        {isSuperAdmin ? (
                            <AdminStatCard
                                label="Active Administrators"
                                value={snapshot.activeAdminsCount ?? 0}
                                sublabel="SUPER_ADMIN allowlist control"
                                icon={ShieldCheck}
                                href="/admin/users"
                            />
                        ) : (
                            <AdminStatCard
                                label="Media Assets"
                                value={snapshot.mediaCount}
                                sublabel="Centralized media registry"
                                icon={Images}
                                href="/admin/media"
                            />
                        )}
                    </div>

                    <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-[#12141C] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-white/[0.07] bg-[#0E1017] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <ScrollText className="h-4 w-4 text-[#D4AF37]" />
                                <h2 className="text-sm font-bold text-zinc-100">
                                    Recent Immutable Audit Activity
                                </h2>
                            </div>
                            <Link
                                href="/admin/audit-logs"
                                className="text-xs font-semibold text-[#E5C158] hover:underline"
                            >
                                View All Logs
                            </Link>
                        </div>

                        {snapshot.recentLogs.length === 0 ? (
                            <div className="p-8 text-center text-xs text-zinc-500">
                                No audit entries recorded yet.
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.05] text-xs">
                                {snapshot.recentLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="px-6 py-3 flex items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-semibold text-zinc-200 truncate">
                                                {log.action}{" "}
                                                <span className="text-zinc-500 font-normal">
                                                    on
                                                </span>{" "}
                                                <span className="font-mono text-[#E5C158]">
                                                    {log.entity_type}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-zinc-500 truncate">
                                                {log.actor_email || "System"} ·{" "}
                                                {log.actor_role || "—"}
                                            </div>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-3">
                                            <AdminStatusBadge
                                                status={log.action}
                                            />
                                            <span className="text-[11px] text-zinc-500 hidden sm:inline font-mono">
                                                {formatAdminDateTime(
                                                    log.created_at
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
