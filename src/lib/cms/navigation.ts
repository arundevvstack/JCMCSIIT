import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface NavItem {
    id: string;
    label: string;
    href: string;
    parent_id?: string | null;
    menu_location: "navbar" | "footer" | "quick_links" | "floating_actions" | "ticker";
    sort_order: number;
    open_in_new_tab?: boolean;
    badge_text?: string | null;
    is_visible?: boolean;
    status?: string;
    children?: NavItem[];
}

export const DEFAULT_TICKER_ITEMS: { title: string; href: string }[] = [
    { title: "ADMISSION COMMENCED FOR 2026 - B.Tech & Diploma in Engineering", href: "/news/admission-2026" },
    { title: "CONGRATULATIONS, PLACED STUDENTS", href: "/news/placed-students" },
    { title: "JOB FAIR'26 on 24th Jan 2026", href: "/news/job-fair-26" },
    { title: "We're NBA accredited. Thank you, students, staff, parents, management, and well-wishers for your support", href: "/news/nba-accredited" },
    { title: "Congratulations! POWER QUIZ WINNERS!", href: "/news/power-quiz-winners" },
    { title: "Proceedings of NCRIESR'25 has been published", href: "/news/ncriesr-25" },
    { title: "College Profile Video", href: "/about/college/profile" },
];

/**
 * Fetches published navigation items for a given menu_location (e.g. 'ticker', 'navbar').
 * Falls back cleanly to empty or default arrays if database records are empty or pending.
 */
export const getNavigationItems = cache(
    async (
        location: "navbar" | "footer" | "quick_links" | "floating_actions" | "ticker"
    ): Promise<NavItem[]> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return [];
        }

        try {
            const supabase = await createClient();
            const fetchPromise = supabase
                .from("navigation_items")
                .select(
                    "id, label, href, parent_id, menu_location, sort_order, open_in_new_tab, badge_text"
                )
                .eq("menu_location", location)
                .eq("status", "published")
                .eq("is_visible", true)
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: true });

            const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
                setTimeout(() => resolve({ data: null, error: new Error("Navigation query timeout") }), 2000)
            );

            const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

            if (error || !Array.isArray(data)) {
                return [];
            }

            return data as NavItem[];
        } catch {
            return [];
        }
    }
);

/**
 * Fetches live ticker items from `public.navigation_items` (menu_location='ticker')
 * or falls back to `DEFAULT_TICKER_ITEMS` with zero disruption.
 */
export const getTickerItems = cache(
    async (): Promise<{ title: string; href: string }[]> => {
        const items = await getNavigationItems("ticker");
        if (items.length === 0) {
            return DEFAULT_TICKER_ITEMS;
        }
        return items.map((item) => ({
            title: item.label,
            href: item.href,
        }));
    }
);
