import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicRecruiterItem {
    id: string;
    company_name: string;
    logo_url?: string | null;
    tier?: string | null;
    website_url?: string | null;
    display_order?: number;
    is_active: boolean;
    status?: string;
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

export const BASELINE_RECRUITERS_LIST: PublicRecruiterItem[] = [
    { id: "recruiter-1", company_name: "Microsoft", tier: "Tier 1", website_url: "https://careers.microsoft.com", is_active: true, status: "published", display_order: 1 },
    { id: "recruiter-2", company_name: "Amazon", tier: "Tier 1", website_url: "https://www.amazon.jobs", is_active: true, status: "published", display_order: 2 },
    { id: "recruiter-3", company_name: "Google", tier: "Tier 1", website_url: "https://careers.google.com", is_active: true, status: "published", display_order: 3 },
    { id: "recruiter-4", company_name: "TCS", tier: "Tier 1", website_url: "https://www.tcs.com/careers", is_active: true, status: "published", display_order: 4 },
    { id: "recruiter-5", company_name: "Infosys", tier: "Tier 1", website_url: "https://www.infosys.com/careers.html", is_active: true, status: "published", display_order: 5 },
    { id: "recruiter-6", company_name: "Wipro", tier: "Tier 1", website_url: "https://careers.wipro.com", is_active: true, status: "published", display_order: 6 },
    { id: "recruiter-7", company_name: "Cognizant", tier: "Tier 1", website_url: "https://careers.cognizant.com", is_active: true, status: "published", display_order: 7 },
    { id: "recruiter-8", company_name: "IBM", tier: "Tier 1", website_url: "https://www.ibm.com/careers", is_active: true, status: "published", display_order: 8 },
    { id: "recruiter-9", company_name: "Tech Mahindra", tier: "Tier 1", website_url: "https://careers.techmahindra.com", is_active: true, status: "published", display_order: 9 },
    { id: "recruiter-10", company_name: "Oracle", tier: "Tier 1", website_url: "https://careers.oracle.com", is_active: true, status: "published", display_order: 10 },
    { id: "recruiter-11", company_name: "Cisco", tier: "Tier 1", website_url: "https://www.cisco.com/c/en/us/about/careers.html", is_active: true, status: "published", display_order: 11 },
    { id: "recruiter-12", company_name: "Intel", tier: "Tier 1", website_url: "https://www.intel.com/content/www/us/en/jobs/jobs-at-intel.html", is_active: true, status: "published", display_order: 12 },
];

export const BASELINE_PLACEMENT_STATS: PublicPlacementStats = {
    placementRate: "98.5%",
    highestPackage: "45 LPA",
    recruitingPartners: "250+",
    totalOffers: "450+",
};

/**
 * Fetches all published recruiters from `public.recruiters`.
 * Falls back to `BASELINE_RECRUITERS_LIST` if the database is empty or unavailable.
 */
export const getPublicRecruiters = cache(
    async (): Promise<PublicRecruiterItem[]> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return BASELINE_RECRUITERS_LIST;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("recruiters")
                .select("id, company_name, logo_url, tier, website_url, display_order, is_active, status")
                .eq("status", "published")
                .eq("is_active", true)
                .order("display_order", { ascending: true })
                .order("company_name", { ascending: true });

            if (error || !Array.isArray(data) || data.length === 0) {
                return BASELINE_RECRUITERS_LIST;
            }

            return data as PublicRecruiterItem[];
        } catch {
            return BASELINE_RECRUITERS_LIST;
        }
    }
);

/**
 * Fetches active recruiter company names from `public.recruiters`.
 * Falls back to `BASELINE_RECRUITERS` company names.
 */
export const getPublicRecruiterNames = cache(
    async (): Promise<string[]> => {
        const recruiters = await getPublicRecruiters();
        const names = recruiters.map((r) => r.company_name);
        return names.length > 0 ? names : BASELINE_RECRUITERS;
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
