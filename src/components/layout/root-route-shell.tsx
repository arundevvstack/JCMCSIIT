"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { NewsTicker } from "@/components/layout/news-ticker";
import { GraduationPopup } from "@/components/layout/graduation-popup";

interface RootRouteShellProps {
    children: React.ReactNode;
    footer: React.ReactNode;
    tickerItems?: { title: string; href: string }[];
}

/**
 * Isolates `/admin` and `/admin/*` routes from the public website chrome
 * (`NewsTicker`, `Navbar`, `SmartFooter`, `GraduationPopup`, and `pt-20`)
 * without moving or renaming any existing public route files.
 */
export function RootRouteShell({ children, footer, tickerItems }: RootRouteShellProps) {
    const segment = useSelectedLayoutSegment();

    if (segment === "admin") {
        return (
            <div className="flex-1 flex flex-col min-h-screen bg-[#090A0D] text-zinc-100">
                {children}
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col pt-20">
            <NewsTicker items={tickerItems} />
            <Navbar />
            <div className="flex-1">{children}</div>
            {footer}
            <GraduationPopup />
        </div>
    );
}
