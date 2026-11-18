"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Home,
    Newspaper,
    GraduationCap,
    Building2,
    Users,
    CalendarDays,
    Bell,
    UserCheck,
    Images,
    FileSpreadsheet,
    Briefcase,
    MessageSquare,
    Blocks,
    ShieldCheck,
    Settings,
    ScrollText,
    LogOut,
    ExternalLink,
    Menu,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminProfile, AdminRole } from "@/lib/auth/rbac";

interface AdminShellProps {
    admin: AdminProfile | null;
    signOutAction: () => Promise<void>;
    children: React.ReactNode;
}

interface AdminNavItem {
    href: string;
    label: string;
    icon: LucideIcon;
    allowedRoles: readonly AdminRole[];
    exact?: boolean;
}

const ALL_CMS_ROLES: readonly AdminRole[] = [
    "SUPER_ADMIN",
    "ADMIN",
    "EDITOR",
    "PUBLISHER",
];
const ADMIN_AND_SUPER: readonly AdminRole[] = ["SUPER_ADMIN", "ADMIN"];
const SUPER_ONLY: readonly AdminRole[] = ["SUPER_ADMIN"];

/**
 * Canonical 17-item JCMCSIIT CMS navigation in exact required order,
 * with strict role-based visibility aligned with PostgreSQL RLS policies.
 */
const NAV_ITEMS: readonly AdminNavItem[] = [
    {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        allowedRoles: ALL_CMS_ROLES,
        exact: true,
    },
    {
        href: "/admin/content/pages",
        label: "Website Pages",
        icon: FileText,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/homepage",
        label: "Homepage Management",
        icon: Home,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/news",
        label: "News & Announcements",
        icon: Newspaper,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/courses",
        label: "Courses",
        icon: GraduationCap,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/departments",
        label: "Departments",
        icon: Building2,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/faculty",
        label: "Faculty & Staff",
        icon: Users,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/events",
        label: "Events",
        icon: CalendarDays,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/notices",
        label: "Notices",
        icon: Bell,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/admissions",
        label: "Admissions",
        icon: UserCheck,
        allowedRoles: ADMIN_AND_SUPER,
    },
    {
        href: "/admin/recruiters",
        label: "Recruiters & Partners",
        icon: Briefcase,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/media",
        label: "Gallery & Media Library",
        icon: Images,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/documents",
        label: "Documents & PDFs",
        icon: FileSpreadsheet,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/messages",
        label: "Contact Messages",
        icon: MessageSquare,
        allowedRoles: ADMIN_AND_SUPER,
    },
    {
        href: "/admin/content/blocks",
        label: "Content Blocks",
        icon: Blocks,
        allowedRoles: ALL_CMS_ROLES,
    },
    {
        href: "/admin/users",
        label: "Staff & Administrators",
        icon: ShieldCheck,
        allowedRoles: SUPER_ONLY,
    },
    {
        href: "/admin/settings",
        label: "Settings",
        icon: Settings,
        allowedRoles: ADMIN_AND_SUPER,
    },
    {
        href: "/admin/audit-logs",
        label: "Audit Logs",
        icon: ScrollText,
        allowedRoles: ADMIN_AND_SUPER,
    },
];

function computeInitials(fullName: string, email: string): string {
    const parts = fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0].length >= 2) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase() || "AD";
}

function formatRoleBadge(role: AdminProfile["role"]): string {
    return role.replace("_", " ");
}

function isRouteActive(pathname: string, item: AdminNavItem): boolean {
    if (item.exact) {
        return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminShell({
    admin,
    signOutAction,
    children,
}: AdminShellProps) {
    const segment = useSelectedLayoutSegment();
    const pathname = usePathname() || "/admin";
    const [mobileOpen, setMobileOpen] = useState(false);

    // Isolate `/admin/login` (and any unauthenticated render) so the protected
    // sidebar and header never render outside an active admin session.
    if (segment === "login" || !admin) {
        return <>{children}</>;
    }

    const initials = computeInitials(admin.full_name, admin.email);
    const visibleItems = NAV_ITEMS.filter((item) =>
        item.allowedRoles.includes(admin.role)
    );
    const activeItem = visibleItems.find((item) =>
        isRouteActive(pathname, item)
    );

    const sidebarContent = (
        <>
            <div className="h-16 px-5 border-b border-white/[0.07] flex items-center justify-between shrink-0">
                <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 group"
                >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#9A7B1C] text-[#090A0D] font-black text-sm flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                        JC
                    </div>
                    <div>
                        <div className="text-sm font-bold tracking-tight text-zinc-50 leading-none">
                            JCMCSIIT CMS
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37] mt-1">
                            Administration
                        </div>
                    </div>
                </Link>
                <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
                    aria-label="Close navigation menu"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav
                aria-label="CMS Administration Navigation"
                className="flex-1 overflow-y-auto py-4 px-3 space-y-1"
            >
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = isRouteActive(pathname, item);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={
                                active
                                    ? "flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#D4AF37]/14 text-[#E5C158] border border-[#D4AF37]/30 text-xs font-semibold shadow-[inset_0_1px_0_rgba(212,175,55,0.15)] transition-all"
                                    : "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent text-xs font-medium transition-all"
                            }
                        >
                            <Icon
                                className={
                                    active
                                        ? "h-4 w-4 shrink-0 text-[#E5C158]"
                                        : "h-4 w-4 shrink-0 text-zinc-500"
                                }
                            />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-white/[0.07] space-y-2 shrink-0 bg-[#0B0D12]">
                <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-[#E5C158] hover:bg-white/[0.04] transition-colors"
                >
                    <span>View Live Website</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <form action={signOutAction}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </form>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex bg-[#090A0D] text-zinc-100">
            {/* Desktop Fixed Left Sidebar */}
            <aside className="hidden lg:flex w-72 bg-[#0D0F15] border-r border-white/[0.07] flex-col fixed inset-y-0 left-0 z-30">
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Sidebar */}
            {mobileOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="relative w-72 max-w-[85vw] bg-[#0D0F15] border-r border-[#D4AF37]/25 flex flex-col h-full z-10">
                        {sidebarContent}
                    </aside>
                </div>
            ) : null}

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen min-w-0">
                <header className="h-16 bg-[#0E1017]/90 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-200 hover:border-[#D4AF37]/40"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="truncate">
                            <span className="text-sm font-semibold text-zinc-100">
                                {activeItem?.label ?? "CMS Workspace"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#E5C158] border border-[#D4AF37]/35">
                            {formatRoleBadge(admin.role)}
                        </span>
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-semibold text-zinc-100 leading-tight">
                                {admin.full_name}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                                {admin.email}
                            </div>
                        </div>
                        <div
                            title={`${admin.full_name} (${admin.role})`}
                            className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#E5C158] flex items-center justify-center text-xs font-bold"
                        >
                            {initials}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-[1440px] w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
