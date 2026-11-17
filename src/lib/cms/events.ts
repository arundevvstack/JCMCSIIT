import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { GRADUATION_EVENT } from "@/lib/graduation-event";

export interface PublicEventItem {
    id: string;
    slug: string;
    title: string;
    category: string;
    description: string;
    content?: string | null;
    display_date_text: string;
    display_time_text?: string | null;
    location: string;
    poster_url?: string | null;
    registration_url?: string | null;
    event_state: "upcoming" | "ongoing" | "completed" | "cancelled";
    is_featured: boolean;
}

export const BASELINE_EVENTS_MAP: Record<string, PublicEventItem> = {
    [GRADUATION_EVENT.slug]: {
        id: GRADUATION_EVENT.slug,
        slug: GRADUATION_EVENT.slug,
        title: GRADUATION_EVENT.title,
        category: GRADUATION_EVENT.category,
        description: GRADUATION_EVENT.description,
        display_date_text: GRADUATION_EVENT.date,
        display_time_text: GRADUATION_EVENT.time,
        location: GRADUATION_EVENT.location,
        poster_url: GRADUATION_EVENT.poster,
        registration_url: GRADUATION_EVENT.registerLink,
        event_state: "upcoming",
        is_featured: true,
    },
    "hackathon-2026": {
        id: "hackathon-2026",
        slug: "hackathon-2026",
        title: "AI & Web3 Hackathon 2026",
        category: "Technical",
        description: `The flagship hackathon of JCMCSIIT brings together the brightest minds from across Kerala. Over 48 intense hours, teams of 2–4 will conceptualize, prototype, and present AI-powered and Web3 solutions to real-world problems.\n\nThis year's themes include Healthcare AI, Decentralized Finance, Smart Infrastructure, and Sustainable Tech.\n\nAll participants receive certificates, meals, and swag kits. Top 3 teams win cash prizes totaling ₹1,50,000.`,
        display_date_text: "March 15, 2026",
        display_time_text: "09:00 AM — 48 Hours",
        location: "Main Auditorium, JCMCSIIT Campus",
        registration_url: "https://forms.gle/NjqqxdBqvoa9Q7WU9",
        event_state: "upcoming",
        is_featured: true,
    },
    "tech-symposium": {
        id: "tech-symposium",
        slug: "tech-symposium",
        title: "National Tech Symposium: INNOVA",
        category: "Symposium",
        description: `INNOVA is the annual national-level technical symposium hosted by JCMCSIIT. Industry leaders, researchers, and students converge to discuss the latest in quantum computing, generative AI, and edge intelligence.\n\nKeynote speakers include technologists from Google DeepMind, ISRO, and IIT Madras. Paper presentations, poster sessions, and live demos run throughout the day.`,
        display_date_text: "April 02, 2026",
        display_time_text: "10:00 AM — 05:00 PM",
        location: "Conference Hall B",
        registration_url: "https://forms.gle/NjqqxdBqvoa9Q7WU9",
        event_state: "upcoming",
        is_featured: false,
    },
};

export const BASELINE_EVENTS_LIST: PublicEventItem[] = Object.values(
    BASELINE_EVENTS_MAP
);

/**
 * Fetches all published events from `public.events`.
 * Falls back to `BASELINE_EVENTS_LIST` if the database table is empty or pending.
 */
export const getPublicEventsList = cache(
    async (): Promise<PublicEventItem[]> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return BASELINE_EVENTS_LIST;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("events")
                .select(
                    "id, slug, title, category, description, content, display_date_text, display_time_text, location, poster_url, registration_url, event_state, is_featured"
                )
                .eq("status", "published")
                .order("display_date_text", { ascending: true });

            if (error || !Array.isArray(data) || data.length === 0) {
                return BASELINE_EVENTS_LIST;
            }

            return data as PublicEventItem[];
        } catch {
            return BASELINE_EVENTS_LIST;
        }
    }
);

/**
 * Resolves a single event by slug from `public.events` (status='published'),
 * falling back cleanly to the baseline event dictionary.
 */
export const getPublicEventBySlug = cache(
    async (slug: string): Promise<PublicEventItem | null> => {
        const cleanSlug = slug.trim().toLowerCase();

        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .from("events")
                    .select(
                        "id, slug, title, category, description, content, display_date_text, display_time_text, location, poster_url, registration_url, event_state, is_featured"
                    )
                    .eq("slug", cleanSlug)
                    .eq("status", "published")
                    .maybeSingle();

                if (!error && data) {
                    return data as PublicEventItem;
                }
            } catch {
                // Fail closed to baseline
            }
        }

        const baseline = BASELINE_EVENTS_MAP[cleanSlug];
        if (baseline) {
            return baseline;
        }

        return {
            id: cleanSlug,
            slug: cleanSlug,
            title: cleanSlug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" "),
            category: "Event",
            description:
                "Details for this event will be updated soon. Please check back or contact the event coordinators for more information.",
            display_date_text: "TBA",
            display_time_text: "TBA",
            location: "JCMCSIIT Campus",
            event_state: "upcoming",
            is_featured: false,
        };
    }
);
