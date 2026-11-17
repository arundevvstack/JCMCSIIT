import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicNoticeItem {
    id: string;
    slug: string;
    title: string;
    summary?: string | null;
    category: string;
    file_url?: string | null;
    notice_date: string;
    is_pinned: boolean;
    show_in_ticker: boolean;
    status: string;
}

export const BASELINE_NOTICES: PublicNoticeItem[] = [
    {
        id: "notice-keam-2026",
        slug: "keam-2026-admissions",
        title: "KEAM 2026 B.Tech Admissions Counselling Schedule",
        summary: "Candidates allotted to JCMCSIIT must report as per the schedule announced by CEE Kerala.",
        category: "Admission",
        file_url: null,
        notice_date: "2026-02-15",
        is_pinned: true,
        show_in_ticker: true,
        status: "published",
    },
    {
        id: "notice-ktu-exam",
        slug: "ktu-semester-exam-notification",
        title: "APJ KTU Even Semester Examination Timetable",
        summary: "Notification regarding the upcoming university regular and supplementary examinations.",
        category: "Exam",
        file_url: null,
        notice_date: "2026-02-10",
        is_pinned: false,
        show_in_ticker: false,
        status: "published",
    },
];

/**
 * Fetches all published notices from `public.notices`.
 */
export const getPublicNotices = cache(
    async (): Promise<PublicNoticeItem[]> => {
        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return BASELINE_NOTICES;
        }

        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from("notices")
                .select("id, slug, title, summary, category, file_url, notice_date, is_pinned, show_in_ticker, status")
                .eq("status", "published")
                .order("is_pinned", { ascending: false })
                .order("notice_date", { ascending: false });

            if (error || !Array.isArray(data) || data.length === 0) {
                return BASELINE_NOTICES;
            }

            return data.map((item) => ({
                id: item.id,
                slug: item.slug,
                title: item.title,
                summary: item.summary,
                category: item.category || "General",
                file_url: item.file_url,
                notice_date: item.notice_date,
                is_pinned: Boolean(item.is_pinned),
                show_in_ticker: Boolean(item.show_in_ticker),
                status: item.status,
            }));
        } catch {
            return BASELINE_NOTICES;
        }
    }
);
