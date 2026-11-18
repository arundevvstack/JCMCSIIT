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

export interface PublicCourseSummary {
    id: string;
    slug: string;
    name: string;
    degree: string;
    category: string;
    overview: string;
    duration?: string;
    intake?: number;
}

const BASELINE_UG_COURSES: PublicCourseSummary[] = [
    { id: "aiml", slug: "aiml", name: "Artificial Intelligence & ML", degree: "B.Tech", category: "UG", overview: "Artificial Intelligence and Machine Learning focuses on intelligent systems and algorithms." },
    { id: "biomedical-robotic", slug: "biomedical-robotic", name: "Biomedical & Robotic Engg", degree: "B.Tech", category: "UG", overview: "Biomedical and Robotic Engineering combines healthcare tech and robotics." },
    { id: "civil", slug: "civil", name: "Civil Engineering", degree: "B.Tech", category: "UG", overview: "Civil Engineering deals with infrastructure, construction and environmental design." },
    { id: "cse", slug: "cse", name: "Computer Science & Engg", degree: "B.Tech", category: "UG", overview: "Theoretical foundations and practical engineering of computer software and systems." },
    { id: "ece", slug: "ece", name: "Electronics & Communication", degree: "B.Tech", category: "UG", overview: "Circuits, communication systems, IoT, and embedded devices." },
    { id: "eee", slug: "eee", name: "Electrical & Electronics Engg", degree: "B.Tech", category: "UG", overview: "Electrical machines, power systems, renewable energy and smart grids." },
    { id: "mechanical", slug: "mechanical", name: "Mechanical Engineering", degree: "B.Tech", category: "UG", overview: "Design, thermal systems, manufacturing and machine mechanisms." },
];

const BASELINE_DIPLOMA_COURSES: PublicCourseSummary[] = [
    { id: "diploma-civil-engineering", slug: "diploma-civil-engineering", name: "Civil", degree: "Diploma", category: "DIPLOMA", overview: "Design, planning and construction of buildings, roads, bridges and infrastructure with strong practical exposure." },
    { id: "diploma-computer-engineering", slug: "diploma-computer-engineering", name: "Computer", degree: "Diploma", category: "DIPLOMA", overview: "Programming, software development, networking, cloud computing and AI fundamentals with modern computer laboratories." },
    { id: "diploma-electronics-communication", slug: "diploma-electronics-communication", name: "Electronics & Communication", degree: "Diploma", category: "DIPLOMA", overview: "Embedded systems, communication technologies, IoT, microcontrollers and digital electronics." },
    { id: "diploma-electrical-engineering", slug: "diploma-electrical-engineering", name: "Electrical", degree: "Diploma", category: "DIPLOMA", overview: "Electrical machines, power systems, renewable energy, industrial automation and electrical installations." },
    { id: "diploma-mechanical-engineering", slug: "diploma-mechanical-engineering", name: "Mechanical", degree: "Diploma", category: "DIPLOMA", overview: "Manufacturing, CAD/CAM, machine design, thermal engineering and industrial production technologies." },
];

export const getPublicCoursesByCategory = cache(
    async (category: "UG" | "DIPLOMA"): Promise<PublicCourseSummary[]> => {
        const baseline = category === "UG" ? BASELINE_UG_COURSES : BASELINE_DIPLOMA_COURSES;

        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("courses")
                    .select("id, slug, name, degree, category, overview, duration, intake, display_order")
                    .eq("category", category)
                    .eq("status", "published")
                    .order("display_order", { ascending: true });

                if (!error && Array.isArray(data) && data.length > 0) {
                    return data.map((d) => ({
                        id: d.slug || d.id,
                        slug: d.slug || d.id,
                        name: d.name || "",
                        degree: d.degree || (category === "UG" ? "B.Tech" : "Diploma"),
                        category: d.category || category,
                        overview: d.overview || "",
                        duration: d.duration || (category === "UG" ? "4 Years" : "3 Years"),
                        intake: typeof d.intake === "number" ? d.intake : 60,
                    }));
                }
            } catch {
                // Fail closed to baseline
            }
        }

        return baseline;
    }
);
