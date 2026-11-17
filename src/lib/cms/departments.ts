import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { departmentsData } from "@/data/departments";
import type { DepartmentData } from "@/types/department";

export interface PublicDepartmentSummary {
    id: string;
    slug: string;
    code?: string | null;
    name: string;
    programme_type: string;
    short_description?: string | null;
    hod_name?: string | null;
    contact_email?: string | null;
}

/**
 * Fetches all published departments from `public.departments`, sorted by display_order.
 * Falls back to static `departmentsData` dictionary if database records are empty or pending.
 */
export const getPublicDepartmentsList = cache(
    async (): Promise<PublicDepartmentSummary[]> => {
        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("departments")
                    .select(
                        "id, slug, code, name, programme_type, short_description, hod_name, contact_email"
                    )
                    .eq("status", "published")
                    .order("display_order", { ascending: true })
                    .order("name", { ascending: true });

                if (!error && Array.isArray(data) && data.length > 0) {
                    return data as PublicDepartmentSummary[];
                }
            } catch {
                // Fail closed to baseline
            }
        }

        return Object.values(departmentsData).map((d) => ({
            id: d.id,
            slug: d.slug,
            code: d.id.toUpperCase(),
            name: d.name,
            programme_type: d.programme.includes("Diploma") ? "DIPLOMA" : "UG",
            short_description: d.shortDescription,
            hod_name: d.hod?.name ?? "Head of Department",
            contact_email: d.contactDetails?.email ?? "info@jcmcsiit.ac.in",
        }));
    }
);

/**
 * Resolves full department profile for `[slug]`, checking `public.departments`
 * first and falling back cleanly to `departmentsData[slug]`.
 */
export const getPublicDepartmentBySlug = cache(
    async (slug: string): Promise<DepartmentData | null> => {
        const cleanSlug = slug.trim().toLowerCase();
        const baseline = departmentsData[cleanSlug];

        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("departments")
                    .select("*")
                    .or(`slug.eq.${cleanSlug},slug_aliases.cs.{${cleanSlug}}`)
                    .eq("status", "published")
                    .maybeSingle();

                if (!error && data) {
                    return {
                        id: data.slug || cleanSlug,
                        slug: data.slug || cleanSlug,
                        name: data.name || baseline?.name || cleanSlug.toUpperCase(),
                        shortDescription:
                            data.short_description ||
                            baseline?.shortDescription ||
                            "",
                        fullDescription:
                            data.full_description ||
                            baseline?.fullDescription ||
                            data.short_description ||
                            "",
                        vision: data.vision || baseline?.vision || "",
                        mission:
                            Array.isArray(data.mission) && data.mission.length > 0
                                ? data.mission.join(" ")
                                : baseline?.mission || "",
                        programme:
                            baseline?.programme ||
                            (data.programme_type === "DIPLOMA"
                                ? `Diploma in ${data.name}`
                                : `B.Tech in ${data.name}`),
                        hod: {
                            name: data.hod_name || baseline?.hod?.name || "Head of Department",
                            message: data.hod_message || baseline?.hod?.message || "",
                            image: data.hod_image_url || baseline?.hod?.image,
                        },
                        faculty: baseline?.faculty || [],
                        labDetails: Array.isArray(data.facilities) && data.facilities.length > 0
                            ? data.facilities
                            : baseline?.labDetails || [],
                        research: baseline?.research || [],
                        coreAreas: Array.isArray(data.core_areas) && data.core_areas.length > 0
                            ? data.core_areas
                            : baseline?.coreAreas || [],
                        careerOpportunities: Array.isArray(data.career_opportunities) && data.career_opportunities.length > 0
                            ? data.career_opportunities
                            : baseline?.careerOpportunities || [],
                        studentClubs: baseline?.studentClubs || [],
                        association: baseline?.association || `${data.name} Association`,
                        industryPartners: baseline?.industryPartners || [],
                        achievements: baseline?.achievements || [],
                        events: baseline?.events || [],
                        galleryImages: baseline?.galleryImages || [],
                        downloads: baseline?.downloads || [],
                        contactDetails: {
                            email: data.contact_email || baseline?.contactDetails?.email || "info@jcmcsiit.ac.in",
                            phone: data.contact_phone || baseline?.contactDetails?.phone || "+91-471-2555555",
                            location: data.location || baseline?.contactDetails?.location || "Main Academic Block",
                        },
                        seo: {
                            metaTitle: `${data.name} | JCMCSIIT`,
                            metaDescription: data.short_description || baseline?.seo?.metaDescription || data.name,
                            keywords: baseline?.seo?.keywords || ["Engineering", "JCMCSIIT", data.name],
                            ogImage: baseline?.seo?.ogImage || "/images/aaa.png",
                        },
                    };
                }
            } catch {
                // Fail closed to baseline
            }
        }

        return baseline || null;
    }
);
