import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface ContactInfoSetting {
    address?: string;
    phones?: string[];
    emails?: string[];
    office_hours?: string;
}

export interface SocialLinksSetting {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
}

export interface FooterTextSetting {
    copyright_line?: string;
    location_line?: string;
}

export interface HomepageHeroSetting {
    heading?: string;
    subheading?: string;
    cta_primary_label?: string;
    cta_primary_href?: string;
    cta_secondary_label?: string;
    cta_secondary_href?: string;
    background_image_url?: string;
}

export interface PublicSiteSettings {
    logo_id: string | null;
    favicon_id: string | null;
    homepage_hero: HomepageHeroSetting | null;
    contact_info: ContactInfoSetting | null;
    social_links: SocialLinksSetting | null;
    footer_text: FooterTextSetting | null;
    default_og_image_id: string | null;
}

export const DEFAULT_PUBLIC_SITE_SETTINGS: PublicSiteSettings = {
    logo_id: "/logo.png",
    favicon_id: "/favicon.ico",
    homepage_hero: {
        heading: "Engineering the Intelligence of Tomorrow",
        subheading:
            "A legacy of technical excellence, pioneering research, and transformative engineering education under the prestigious CSI South Kerala Diocese.",
        cta_primary_label: "Explore Programmes",
        cta_primary_href: "/academics",
        cta_secondary_label: "Virtual Campus Tour",
        cta_secondary_href: "/about/campus-overview/location",
        background_image_url: "/images/aaa.png",
    },
    contact_info: {
        address:
            "Kannammoola, Medical College P.O, Thiruvananthapuram — 695011, Kerala, India",
        phones: ["+91 94969 81555", "+91 0471 2550474 / 2446949"],
        emails: ["principal@jcmcsiit.ac.in", "jcmcsiit@gmail.com"],
        office_hours: "Mon — Sat: 9:00 AM — 5:00 PM",
    },
    social_links: {
        facebook: "https://facebook.com/jcmcsiit",
        instagram: "https://instagram.com/jcmcsiit",
        linkedin: "https://linkedin.com/school/jcmcsiit",
        youtube: "https://youtube.com/@jcmcsiit",
    },
    footer_text: {
        copyright_line:
            "John Cox Memorial CSI Institute of Technology. All rights reserved.",
        location_line: "Kannammoola, Trivandrum, Kerala 695011.",
    },
    default_og_image_id: "/images/aaa.png",
};

/**
 * Server-side helper to fetch all public site settings from `public.site_settings`
 * (where `is_public = true`), falling back safely and cleanly to official defaults
 * without breaking if the table or records are absent.
 */
export const getPublicSiteSettings = cache(
    async (): Promise<PublicSiteSettings> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return DEFAULT_PUBLIC_SITE_SETTINGS;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("site_settings")
                .select("key, value_json")
                .eq("is_public", true);

            if (error || !Array.isArray(data)) {
                return DEFAULT_PUBLIC_SITE_SETTINGS;
            }

            const settingsMap = new Map<string, unknown>();
            for (const row of data) {
                settingsMap.set(row.key, row.value_json);
            }

            const parseSetting = <T>(key: string, fallback: T): T => {
                const val = settingsMap.get(key);
                if (val === undefined || val === null) {
                    return fallback;
                }
                if (typeof fallback === "object" && fallback !== null && typeof val === "object") {
                    return { ...fallback, ...(val as Record<string, unknown>) };
                }
                return val as T;
            };

            return {
                logo_id: parseSetting("logo_id", DEFAULT_PUBLIC_SITE_SETTINGS.logo_id),
                favicon_id: parseSetting("favicon_id", DEFAULT_PUBLIC_SITE_SETTINGS.favicon_id),
                homepage_hero: parseSetting(
                    "homepage_hero",
                    DEFAULT_PUBLIC_SITE_SETTINGS.homepage_hero
                ),
                contact_info: parseSetting(
                    "contact_info",
                    DEFAULT_PUBLIC_SITE_SETTINGS.contact_info
                ),
                social_links: parseSetting(
                    "social_links",
                    DEFAULT_PUBLIC_SITE_SETTINGS.social_links
                ),
                footer_text: parseSetting(
                    "footer_text",
                    DEFAULT_PUBLIC_SITE_SETTINGS.footer_text
                ),
                default_og_image_id: parseSetting(
                    "default_og_image_id",
                    DEFAULT_PUBLIC_SITE_SETTINGS.default_og_image_id
                ),
            };
        } catch {
            return DEFAULT_PUBLIC_SITE_SETTINGS;
        }
    }
);
