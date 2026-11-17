import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { facultyData } from "@/data/faculty";
import type { Faculty } from "@/types/faculty";

interface FacultyDbRow {
    id: string;
    department_id?: string | null;
    name: string;
    slug?: string | null;
    designation?: string | null;
    qualifications?: string | null;
    email?: string | null;
    phone?: string | null;
    image_url?: string | null;
    bio?: string | null;
    departments?: {
        name: string;
        slug: string;
    } | null;
}

/**
 * Resolves all published faculty members from `public.faculty`, joining with `public.departments`.
 * Falls back cleanly to `facultyData` if the database table is empty or pending.
 */
export const getPublicFacultyList = cache(
    async (): Promise<Faculty[]> => {
        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("faculty")
                    .select(
                        "id, department_id, name, slug, designation, qualifications, email, phone, image_url, bio, display_order, departments (name, slug)"
                    )
                    .eq("status", "published")
                    .eq("is_visible", true)
                    .order("display_order", { ascending: true })
                    .order("name", { ascending: true });

                if (!error && Array.isArray(data) && data.length > 0) {
                    const rows = data as unknown as FacultyDbRow[];
                    return rows.map((f) => ({
                        id: f.id,
                        department_id: f.department_id || "",
                        name: f.name,
                        slug: f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        designation: f.designation || undefined,
                        email: f.email || undefined,
                        image_url: f.image_url || "/images/faculty/default.jpg",
                        bio: f.bio || undefined,
                        profile_data: {
                            highestQualification: f.qualifications || "",
                            phone: f.phone || undefined,
                        },
                        departments: f.departments
                            ? {
                                  name: f.departments.name,
                                  slug: f.departments.slug,
                              }
                            : undefined,
                    }));
                }
            } catch {
                // Fail closed to baseline
            }
        }

        return facultyData;
    }
);

/**
 * Resolves a single faculty member profile by slug.
 */
export const getPublicFacultyBySlug = cache(
    async (slug: string): Promise<Faculty | null> => {
        const cleanSlug = slug.trim().toLowerCase();

        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("faculty")
                    .select(
                        "id, department_id, name, slug, designation, qualifications, email, phone, image_url, bio, departments (name, slug)"
                    )
                    .eq("slug", cleanSlug)
                    .eq("status", "published")
                    .eq("is_visible", true)
                    .maybeSingle();

                if (!error && data) {
                    const f = data as unknown as FacultyDbRow;
                    return {
                        id: f.id,
                        department_id: f.department_id || "",
                        name: f.name,
                        slug: f.slug || cleanSlug,
                        designation: f.designation || undefined,
                        email: f.email || undefined,
                        image_url: f.image_url || "/images/faculty/default.jpg",
                        bio: f.bio || undefined,
                        profile_data: {
                            highestQualification: f.qualifications || "",
                            phone: f.phone || undefined,
                        },
                        departments: f.departments
                            ? {
                                  name: f.departments.name,
                                  slug: f.departments.slug,
                              }
                            : undefined,
                    };
                }
            } catch {
                // Fail closed to baseline
            }
        }

        const baseline = facultyData.find(
            (f) => f.slug?.toLowerCase() === cleanSlug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanSlug
        );
        return baseline || null;
    }
);
