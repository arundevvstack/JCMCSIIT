import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicRecruiterItem {
    id: string;
    company_name: string;
    logo_url?: string | null;
    tier?: string | null;
    is_active: boolean;
}

export interface PublicPlacementStats {
    placementRate: string;
    highestPackage: string;
    recruitingPartners: string;
    totalOffers: string;
}

export interface PublicPlacementItem {
    id: string;
    student_name: string;
    department_name?: string | null;
    company_name: string;
    company_logo?: string | null;
    package_lpa?: number | null;
    year: number;
}

export const BASELINE_RECRUITERS: string[] = [
    "Microsoft", "Amazon", "Google", "TCS", "Infosys", "Wipro",
    "Cognizant", "IBM", "Tech Mahindra", "Oracle", "Cisco", "Intel"
];

export const BASELINE_PLACEMENT_STATS: PublicPlacementStats = {
    placementRate: "98.5%",
    highestPackage: "45 LPA",
    recruitingPartners: "250+",
    totalOffers: "450+",
};

/**
 * Fetches active recruiters from `public.recruiters`.
 * Falls back to `BASELINE_RECRUITERS` company names.
 */
export const getPublicRecruiterNames = cache(
    async (): Promise<string[]> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return BASELINE_RECRUITERS;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("recruiters")
                .select("company_name, is_active, status")
                .eq("is_active", true)
                .order("display_order", { ascending: true })
                .order("company_name", { ascending: true });

            if (error || !Array.isArray(data) || data.length === 0) {
                return BASELINE_RECRUITERS;
            }

            const active = data
                .filter((r) => r.status === undefined || r.status === "published")
                .map((r) => r.company_name);

            return active.length > 0 ? active : BASELINE_RECRUITERS;
        } catch {
            return BASELINE_RECRUITERS;
        }
    }
);

/**
 * Fetches placement statistics, reading dynamic content blocks if configured.
 */
export const getPublicPlacementStats = cache(
    async (): Promise<PublicPlacementStats> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return BASELINE_PLACEMENT_STATS;
        }

        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from("content_blocks")
                .select("key, content, structured_data")
                .eq("key", "placement_stats")
                .eq("status", "published")
                .maybeSingle();

            if (data && data.structured_data && typeof data.structured_data === "object") {
                const s = data.structured_data as Record<string, string>;
                return {
                    placementRate: s.placementRate || BASELINE_PLACEMENT_STATS.placementRate,
                    highestPackage: s.highestPackage || BASELINE_PLACEMENT_STATS.highestPackage,
                    recruitingPartners: s.recruitingPartners || BASELINE_PLACEMENT_STATS.recruitingPartners,
                    totalOffers: s.totalOffers || BASELINE_PLACEMENT_STATS.totalOffers,
                };
            }

            return BASELINE_PLACEMENT_STATS;
        } catch {
            return BASELINE_PLACEMENT_STATS;
        }
    }
);

/**
 * Fetches placement student records from `public.placements`.
 */
export const getPublicPlacements = cache(
    async (year?: number): Promise<PublicPlacementItem[]> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return [];
        }

        try {
            const supabase = await createClient();
            let query = supabase
                .from("placements")
                .select("id, student_name, company_name, company_logo, package_lpa, year, departments(name)")
                .order("year", { ascending: false });

            if (year) {
                query = query.eq("year", year);
            }

            const { data, error } = await query;

            if (error || !Array.isArray(data)) {
                return [];
            }

            return data.map((item) => {
                const dept = Array.isArray(item.departments)
                    ? item.departments[0]
                    : item.departments;
                return {
                    id: item.id,
                    student_name: item.student_name,
                    department_name: dept?.name || null,
                    company_name: item.company_name,
                    company_logo: item.company_logo,
                    package_lpa: item.package_lpa,
                    year: item.year,
                };
            });
        } catch {
            return [];
        }
    }
);
