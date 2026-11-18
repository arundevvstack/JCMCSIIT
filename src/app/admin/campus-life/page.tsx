import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CampusLifeManagerClient } from "./campus-life-manager-client";
import { BASELINE_CONTENT_BLOCKS } from "@/lib/cms/content-blocks";

export const dynamic = "force-dynamic";

export interface CommitteeItemRecord {
    id: string;
    key: string;
    route_path: string;
    name: string;
    category: "Cells" | "Committees" | "Councils" | "Clubs";
    description: string;
    pageData: {
        id?: string;
        title: string;
        subtitle?: string;
        summary?: string;
        content: string;
        status: string;
        updated_at?: string;
    };
    structuredBlock?: {
        id?: string;
        key: string;
        title: string;
        structured_data: Record<string, unknown>;
        status: string;
        updated_at?: string;
    } | null;
}

const CANONICAL_CAMPUS_LIFE_ENTITIES: Array<{
    key: string;
    route_path: string;
    name: string;
    category: CommitteeItemRecord["category"];
    defaultTitle: string;
    defaultSubtitle: string;
    defaultSummary: string;
    defaultContent: string;
    blockKey?: string;
}> = [
    {
        key: "campus-life-overview",
        route_path: "/campus-life",
        name: "Campus Life Overview",
        category: "Councils",
        defaultTitle: "Campus Life & Student Experience",
        defaultSubtitle: "Empowering student communities through vibrant cultural forums, technical clubs, leadership councils, and athletic teams.",
        defaultSummary: "Portal to collegiate life, co-curricular societies, athletic meets, and creative student associations.",
        defaultContent: "## Life at John Cox Memorial CSI Institute of Technology\n\nCampus life at JCMC SIIT extends beyond lecture rooms into dynamic cultural clubs, technical project societies, and community outreach missions.",
    },
    {
        key: "alumni",
        route_path: "/campus-life/alumni",
        name: "Alumni Network & Spotlight",
        category: "Clubs",
        defaultTitle: "Alumni Network",
        defaultSubtitle: "A global brotherhood of 2000+ engineering graduates driving tech innovation, executive leadership, and entrepreneurship.",
        defaultSummary: "Connecting alumni across 20+ nations with campus mentorship, placement referrals, and annual reunions.",
        defaultContent: "## Our Global Alumni Community\n\nOur alumni represent JCMC SIIT at prominent tech enterprises such as Amazon, Google, Microsoft, Infosys, and TCS.",
        blockKey: "alumni_spotlight_profiles",
    },
    {
        key: "nss",
        route_path: "/campus-life/nss",
        name: "National Service Scheme (NSS)",
        category: "Cells",
        defaultTitle: "National Service Scheme (NSS)",
        defaultSubtitle: "Fostering social responsibility, community development, and leadership through selfless community service.",
        defaultSummary: "NSS Unit 245 conducting health camps, blood donation drives, environmental cleanups, and literacy programs.",
        defaultContent: "## Not Me, But You — NSS Unit 245\n\nThe National Service Scheme unit at JCMC SIIT actively involves youth in nation-building activities and community welfare.",
        blockKey: "nss_unit_details",
    },
    {
        key: "sports",
        route_path: "/campus-life/student-support/sports",
        name: "Physical Education & Sports",
        category: "Clubs",
        defaultTitle: "Physical Education & Athletics",
        defaultSubtitle: "Cultivating physical fitness, sporting excellence, team camaraderie, and collegiate athletic leadership.",
        defaultSummary: "Outdoor playgrounds, indoor badminton courts, cricket nets, and inter-collegiate tournament training.",
        defaultContent: "## Department of Physical Education\n\nJCMC SIIT emphasizes balanced student development through active physical education, athletics, and collegiate sports leagues.",
    },
    {
        key: "arts-committee",
        route_path: "/campus-life/student-support/arts-committee",
        name: "Arts & Cultural Committee",
        category: "Committees",
        defaultTitle: "Arts & Cultural Committee",
        defaultSubtitle: "Celebrating creative expression, artistic talent, stage arts, music, dance, and collegiate festivals.",
        defaultSummary: "Orchestrating the annual arts festival, literary competitions, theater plays, and musical band performances.",
        defaultContent: "## Celebrating Artistic Creativity\n\nThe Arts Committee coordinates cultural celebrations, youth festivals, and talent discovery events across engineering batches.",
    },
    {
        key: "students-council",
        route_path: "/campus-life/student-support/students-council",
        name: "College Students Council",
        category: "Councils",
        defaultTitle: "College Students Council",
        defaultSubtitle: "The official elected student body voicing student perspectives and championing campus welfare initiatives.",
        defaultSummary: "Student council leadership structure, democratic representation, and academic collaboration.",
        defaultContent: "## Democratic Student Representation\n\nThe Students Council serves as the recognized conduit between the student community and college administration.",
    },
    {
        key: "clubs-alumni",
        route_path: "/campus-life/student-support/clubs/alumni",
        name: "Alumni Association Chapter",
        category: "Clubs",
        defaultTitle: "Alumni Association Chapter",
        defaultSubtitle: "Nurturing lifelong relationships between graduating engineers and their alma mater through alumni chapters.",
        defaultSummary: "Alumni engagement portal, mentorship programs, guest lectures, and institutional support initiatives.",
        defaultContent: "## JCMC SIIT Alumni Chapter\n\nThe Alumni Association Chapter facilitates career guidance for current students, sponsored scholarships, and technical workshops.",
    },
    {
        key: "grievance-icc",
        route_path: "/campus-life/student-support/grievance/icc",
        name: "Internal Complaints Committee (ICC)",
        category: "Committees",
        defaultTitle: "Internal Complaints Committee (ICC)",
        defaultSubtitle: "Upholding gender equity, dignity, and a zero-tolerance framework against sexual harassment on campus.",
        defaultSummary: "Statutory committee constituted in compliance with the PoSH Act 2013 and AICTE regulations.",
        defaultContent: "## Internal Complaints Committee (ICC)\n\nConstituted in strict compliance with the Sexual Harassment of Women at Workplace Act, 2013, and AICTE regulations.",
    },
    {
        key: "grievance-sgrc",
        route_path: "/campus-life/student-support/grievance/sgrc",
        name: "Student Grievance Redressal (SGRC)",
        category: "Committees",
        defaultTitle: "Student Grievance Redressal Committee (SGRC)",
        defaultSubtitle: "A transparent, impartial, and confidential mechanism for resolving academic and campus life grievances.",
        defaultSummary: "Statutory body addressing student concerns, academic fairness, and institutional support.",
        defaultContent: "## Student Grievance Redressal Committee\n\nThe SGRC provides an accessible, fair, and confidential grievance adjudication mechanism for all students.",
    },
    {
        key: "grievance-online",
        route_path: "/campus-life/student-support/grievance/online",
        name: "Online Grievance Submission Portal",
        category: "Committees",
        defaultTitle: "Online Grievance Submission Portal",
        defaultSubtitle: "Confidential digital grievance filing system with secure tracking and prompt administrative escalation.",
        defaultSummary: "Direct online channel for registering complaints, suggestions, and academic inquiries securely.",
        defaultContent: "## Digital Grievance Portal\n\nStudents and parents can submit confidential grievances, requests, or constructive suggestions directly to institutional monitoring authorities.",
    },
    {
        key: "cells-ieee",
        route_path: "/cells/ieee",
        name: "IEEE Student Branch & Societies",
        category: "Cells",
        defaultTitle: "IEEE Student Branch & Societies",
        defaultSubtitle: "World-class professional technical societies fostering research, automation, robotics, and women in engineering.",
        defaultSummary: "IEEE SB JCMCSIIT featuring Robotics & Automation (RAS), Systems & Systems (SAS), and WIE Affinity Groups.",
        defaultContent: "## IEEE Student Branch (STB64571)\n\nIEEE Student Branch JCMC SIIT empowers engineering students to access global technical conferences, international competitions, and robotics workshops.",
        blockKey: "ieee_societies_data",
    },
    {
        key: "cells-iedc",
        route_path: "/cells/iedc",
        name: "Innovation & Entrepreneurship (IEDC)",
        category: "Cells",
        defaultTitle: "Innovation & Entrepreneurship Development Centre (IEDC)",
        defaultSubtitle: "Igniting entrepreneurial thinking, startup incubation, patent drafting, and student business ideas.",
        defaultSummary: "Kerala Startup Mission supported cell fostering student innovators, hackathons, and seed grants.",
        defaultContent: "## Innovation & Entrepreneurship Development Centre\n\nOperating under Kerala Startup Mission (KSUM), the IEDC at JCMC SIIT serves as an incubator for turning creative ideas into products.",
    },
    {
        key: "cells-iiic",
        route_path: "/cells/iiic",
        name: "Industry-Institute Interaction (IIIC)",
        category: "Cells",
        defaultTitle: "Industry-Institute Interaction Cell (IIIC)",
        defaultSubtitle: "Bridging academic curricula with enterprise requirements through industrial visits, MoUs, and internships.",
        defaultSummary: "Facilitating corporate internships, sponsored industrial projects, and corporate guest lectures.",
        defaultContent: "## Industry-Institute Interaction Cell\n\nThe IIIC forges enduring partnerships between the college and prominent technology corporations.",
    },
    {
        key: "cells-women-empowerment",
        route_path: "/cells/women-empowerment",
        name: "Women Empowerment Cell",
        category: "Cells",
        defaultTitle: "Women Empowerment Cell",
        defaultSubtitle: "Championing female leadership, gender awareness, wellness seminars, and professional self-reliance.",
        defaultSummary: "Promoting women engineers through leadership workshops, health awareness, and career guidance.",
        defaultContent: "## Women Empowerment Cell\n\nDedicated to empowering female students and faculty members through career advancement seminars and leadership mentorship.",
    },
    {
        key: "cells-anti-ragging",
        route_path: "/cells/anti-ragging",
        name: "Anti-Ragging Cell & Squad",
        category: "Cells",
        defaultTitle: "Anti-Ragging Cell & Flying Squad",
        defaultSubtitle: "Ensuring a 100% ragging-free campus with proactive vigil, CCTV monitoring, and strict compliance measures.",
        defaultSummary: "Institutional anti-ragging squad, emergency helpline contacts, and undertaking affidavit procedures.",
        defaultContent: "## Zero-Tolerance Anti-Ragging Framework\n\nRagging in any form is completely banned inside and outside the campus in accordance with Supreme Court guidelines.",
        blockKey: "anti_ragging_helplines",
    },
    {
        key: "cells-anti-narcotic",
        route_path: "/cells/anti-narcotic",
        name: "Anti-Narcotic & Substance Vigilance",
        category: "Cells",
        defaultTitle: "Anti-Narcotic & Substance Vigilance Cell",
        defaultSubtitle: "Promoting healthy, substance-free campus living through vigilance, youth counseling, and awareness campaigns.",
        defaultSummary: "Dedicated cell collaborating with Kerala Excise Vimukthi Mission for substance abuse prevention.",
        defaultContent: "## Substance-Free Campus Mission\n\nThe Anti-Narcotic Cell conducts regular awareness seminars, student counseling sessions, and campus vigilance sweeps.",
    },
];

export default async function AdminCampusLifePage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();

    const targetRoutes = CANONICAL_CAMPUS_LIFE_ENTITIES.map((c) => c.route_path);
    const targetBlockKeys = CANONICAL_CAMPUS_LIFE_ENTITIES.filter((c) => c.blockKey).map(
        (c) => c.blockKey as string
    );

    const [pagesRes, blocksRes] = await Promise.all([
        supabase
            .from("pages")
            .select("id, slug, route_path, title, subtitle, summary, content, status, updated_at")
            .in("route_path", targetRoutes),
        supabase
            .from("content_blocks")
            .select("id, key, title, block_type, content, structured_data, status, updated_at")
            .in("key", targetBlockKeys),
    ]);

    const pagesMap = new Map((pagesRes.data ?? []).map((p) => [p.route_path, p]));
    const blocksMap = new Map((blocksRes.data ?? []).map((b) => [b.key, b]));

    const entities: CommitteeItemRecord[] = CANONICAL_CAMPUS_LIFE_ENTITIES.map((ent) => {
        const dbPage = pagesMap.get(ent.route_path);
        const dbBlock = ent.blockKey ? blocksMap.get(ent.blockKey) : null;

        return {
            id: dbPage?.id ?? `campus-life-${ent.key}`,
            key: ent.key,
            route_path: ent.route_path,
            name: ent.name,
            category: ent.category,
            description: ent.defaultSummary,
            pageData: {
                id: dbPage?.id,
                title: dbPage?.title || ent.defaultTitle,
                subtitle: dbPage?.subtitle || ent.defaultSubtitle,
                summary: dbPage?.summary || ent.defaultSummary,
                content: dbPage?.content || ent.defaultContent,
                status: dbPage?.status || "published",
                updated_at: dbPage?.updated_at,
            },
            structuredBlock: ent.blockKey
                ? {
                      id: dbBlock?.id,
                      key: ent.blockKey,
                      title: dbBlock?.title || `${ent.name} Structured Specs`,
                      structured_data:
                          (dbBlock?.structured_data as Record<string, unknown>) ||
                          (BASELINE_CONTENT_BLOCKS[ent.blockKey]?.structured_data as Record<string, unknown>) ||
                          {},
                      status: dbBlock?.status || "published",
                      updated_at: dbBlock?.updated_at,
                  }
                : null,
        };
    });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Student Experience & Governance"
                title="Campus Life & Committees CMS"
                description="Manage all 16 institutional committees, student cells, councils, grievance redressal bodies, and co-curricular societies with dual-tier CMS synchronization."
            />

            <AdminHonestNotice
                title="Synchronized to public.pages & public.content_blocks"
                variant="info"
            >
                Edits made here update the canonical{" "}
                <code className="text-[#E5C158]">public.pages</code> records for committee charters, rosters, and policies,
                while specialized features (IEEE societies, Alumni spotlight, NSS metrics) persist directly to{" "}
                <code className="text-[#E5C158]">public.content_blocks</code>.
            </AdminHonestNotice>

            <CampusLifeManagerClient
                initialEntities={entities}
                role={admin.role}
            />
        </div>
    );
}
