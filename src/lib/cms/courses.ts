import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { coursesData, type CourseDetails } from "@/data/courses";

export interface PublicCourseProfile extends CourseDetails {
    duration?: string;
    intake?: number;
    eligibility?: string;
    category?: string;
    curriculumHighlights?: string[];
    careerProspects?: string[];
}

/**
 * Resolves a course by slug from `public.courses`, falling back cleanly to `coursesData[slug]`.
 */
export const getPublicCourseBySlug = cache(
    async (slug: string): Promise<PublicCourseProfile | null> => {
        const cleanSlug = slug.trim().toLowerCase();
        const baseline = coursesData[cleanSlug];

        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("courses")
                    .select("*")
                    .eq("slug", cleanSlug)
                    .eq("status", "published")
                    .maybeSingle();

                if (!error && data) {
                    return {
                        id: data.slug || cleanSlug,
                        name: data.name || baseline?.name || cleanSlug.toUpperCase(),
                        degree: data.degree || baseline?.degree || "B.Tech",
                        overview: data.overview || baseline?.overview || "",
                        vision: data.vision || baseline?.vision || "",
                        mission: Array.isArray(data.mission) && data.mission.length > 0
                            ? data.mission
                            : baseline?.mission || [],
                        peos: Array.isArray(data.peos) && data.peos.length > 0
                            ? data.peos
                            : baseline?.peos || [],
                        psos: Array.isArray(data.psos) && data.psos.length > 0
                            ? data.psos
                            : baseline?.psos || [],
                        facilities: Array.isArray(data.facilities) && data.facilities.length > 0
                            ? data.facilities
                            : baseline?.facilities || [],
                        duration: data.duration || "4 Years",
                        intake: typeof data.intake === "number" ? data.intake : 60,
                        eligibility: data.eligibility || "Pass in Higher Secondary Examination of the Board of Higher Secondary Education of Kerala or an examination recognized equivalent thereto with at least 45% marks in Mathematics, Physics and Chemistry put together.",
                        category: data.category || "UG",
                        curriculumHighlights: Array.isArray(data.curriculum_highlights) && data.curriculum_highlights.length > 0
                            ? data.curriculum_highlights
                            : [],
                        careerProspects: Array.isArray(data.career_prospects) && data.career_prospects.length > 0
                            ? data.career_prospects
                            : [],
                    };
                }
            } catch {
                // Fail closed to baseline
            }
        }

        if (baseline) {
            return {
                ...baseline,
                duration: baseline.degree.includes("Diploma") ? "3 Years" : "4 Years",
                intake: 60,
                eligibility: "Pass in Higher Secondary Examination of the Board of Higher Secondary Education of Kerala or an examination recognized equivalent thereto with at least 45% marks in Mathematics, Physics and Chemistry put together.",
                category: baseline.degree.includes("Diploma") ? "DIPLOMA" : "UG",
                curriculumHighlights: [],
                careerProspects: [],
            };
        }

        return null;
    }
);
