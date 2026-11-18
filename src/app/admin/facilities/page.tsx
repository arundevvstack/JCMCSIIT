import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { FacilitiesManagerClient } from "./facilities-manager-client";
import { BASELINE_CONTENT_BLOCKS } from "@/lib/cms/content-blocks";

export const dynamic = "force-dynamic";

export interface FacilityItemRecord {
    id: string;
    key: string;
    route_path: string;
    name: string;
    category: "Infrastructure" | "Amenities" | "Academic" | "Logistics";
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

const CANONICAL_FACILITIES: Array<{
    key: string;
    route_path: string;
    name: string;
    category: FacilityItemRecord["category"];
    defaultTitle: string;
    defaultSubtitle: string;
    defaultSummary: string;
    defaultContent: string;
    blockKey?: string;
}> = [
    {
        key: "campus",
        route_path: "/facilities/campus",
        name: "Campus Infrastructure",
        category: "Infrastructure",
        defaultTitle: "Campus Infrastructure & Environment",
        defaultSubtitle: "A vibrant 25-acre green academic environment fostering technological innovation and holistic student growth.",
        defaultSummary: "Overview of JCMC SIIT campus infrastructure, academic blocks, Wi-Fi connectivity, and lush green environment.",
        defaultContent: "## Campus Infrastructure Overview\n\nJohn Cox Memorial CSI Institute of Technology (JCMC SIIT) is nestled in a lush, eco-friendly green campus at Kannammoola, Thiruvananthapuram.",
    },
    {
        key: "canteen",
        route_path: "/facilities/canteen",
        name: "Canteen & Cafeteria",
        category: "Amenities",
        defaultTitle: "Campus Canteen & Cafeteria",
        defaultSubtitle: "Hygienic, nutritious, and affordable multi-cuisine dining facilities for students, faculty, and campus visitors.",
        defaultSummary: "Information regarding campus dining, hygiene standards, operating hours, and nutritional meal options.",
        defaultContent: "## Dining at JCMC SIIT\n\nThe college operates a spacious, clean, and well-maintained cafeteria catering to the culinary preferences of our diverse student body and faculty members.",
    },
    {
        key: "conference-hall",
        route_path: "/facilities/conference-hall",
        name: "Auditorium & Conference Halls",
        category: "Academic",
        defaultTitle: "Auditorium & Conference Halls",
        defaultSubtitle: "Acoustically treated venues equipped with state-of-the-art audiovisual systems for national seminars and cultural events.",
        defaultSummary: "Details of institutional seminar halls, auditorium capacity, AV capabilities, and corporate presentation spaces.",
        defaultContent: "## Seminar Halls & Conference Facilities\n\nJCMC SIIT houses an air-conditioned central auditorium and multiple departmental seminar halls designed for hosting international symposiums.",
    },
    {
        key: "hostel",
        route_path: "/facilities/hostel",
        name: "Hostel Accommodation",
        category: "Amenities",
        defaultTitle: "Hostel Facilities",
        defaultSubtitle: "Comfortable, secure, and well-connected accommodation for our students at the historic LMS Compound, Palayam.",
        defaultSummary: "Safe residential hostels for boys and girls with study rooms, Wi-Fi, and dedicated warden care.",
        defaultContent: "## A Home Away From Home\n\nHostel accommodation for both boys and girls is provided in a safe and supportive residential environment situated in the LMS Compound, Palayam.",
        blockKey: "hostel_specs",
    },
    {
        key: "internet-lab",
        route_path: "/facilities/internet-lab",
        name: "Central Computing & Internet Lab",
        category: "Academic",
        defaultTitle: "Central Computing & Internet Lab",
        defaultSubtitle: "Advanced computing infrastructure with dedicated gigabit leased lines, high-performance workstations, and AI tools.",
        defaultSummary: "High-speed computing laboratory accessible for research, programming contests, and digital coursework.",
        defaultContent: "## Advanced Computing Infrastructure\n\nThe Central Computing Centre at JCMC SIIT serves as the primary digital backbone for computational research and software development.",
    },
    {
        key: "library",
        route_path: "/facilities/library",
        name: "Central Library & Digital Hub",
        category: "Academic",
        defaultTitle: "Central Library & Information Centre",
        defaultSubtitle: "A modern gateway to knowledge offering over 25,000+ volumes, 500+ e-journals, and 24/7 digital resource access.",
        defaultSummary: "Central repository of academic textbooks, research papers, digital portals, and quiet reading zones.",
        defaultContent: "## Central Library & Digital Information Hub\n\nThe Central Library of JCMC SIIT is an automated knowledge resource center catering to instructional and research needs.",
        blockKey: "library_portal_links",
    },
    {
        key: "transportation",
        route_path: "/facilities/transportation",
        name: "Campus Fleet & Transportation",
        category: "Logistics",
        defaultTitle: "Campus Transportation & Fleet",
        defaultSubtitle: "A dedicated fleet of college buses providing safe, comfortable, and punctual transit across Thiruvananthapuram and suburbs.",
        defaultSummary: "Institutional bus routes, pickup points, safety guidelines, and transport officer contact information.",
        defaultContent: "## Safe & Reliable Commute\n\nThe institution operates a fleet of modern, GPS-enabled buses connecting prime residential sectors of Thiruvananthapuram directly to campus.",
        blockKey: "transportation_routes_json",
    },
    {
        key: "workshop",
        route_path: "/facilities/workshop",
        name: "Central Engineering Workshops",
        category: "Academic",
        defaultTitle: "Central Engineering Workshops",
        defaultSubtitle: "Comprehensive hands-on training facilities equipped with industrial lathes, foundry, welding, and carpentry units.",
        defaultSummary: "Basic engineering workshop introducing students to manufacturing, fabrication, and machine tool operations.",
        defaultContent: "## Practical Engineering Foundations\n\nThe Central Workshop introduces first-year engineering students to the fundamentals of manufacturing technology and industrial production processes.",
    },
];

export default async function AdminFacilitiesPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();

    const [pagesRes, blocksRes] = await Promise.all([
        supabase
            .from("pages")
            .select("id, slug, route_path, title, subtitle, summary, content, status, updated_at")
            .like("route_path", "/facilities/%"),
        supabase
            .from("content_blocks")
            .select("id, key, title, block_type, content, structured_data, status, updated_at")
            .in("key", ["hostel_specs", "library_portal_links", "transportation_routes_json"]),
    ]);

    const pagesMap = new Map((pagesRes.data ?? []).map((p) => [p.route_path, p]));
    const blocksMap = new Map((blocksRes.data ?? []).map((b) => [b.key, b]));

    const facilities: FacilityItemRecord[] = CANONICAL_FACILITIES.map((fac) => {
        const dbPage = pagesMap.get(fac.route_path);
        const dbBlock = fac.blockKey ? blocksMap.get(fac.blockKey) : null;

        return {
            id: dbPage?.id ?? `facility-${fac.key}`,
            key: fac.key,
            route_path: fac.route_path,
            name: fac.name,
            category: fac.category,
            description: fac.defaultSummary,
            pageData: {
                id: dbPage?.id,
                title: dbPage?.title || fac.defaultTitle,
                subtitle: dbPage?.subtitle || fac.defaultSubtitle,
                summary: dbPage?.summary || fac.defaultSummary,
                content: dbPage?.content || fac.defaultContent,
                status: dbPage?.status || "published",
                updated_at: dbPage?.updated_at,
            },
            structuredBlock: fac.blockKey
                ? {
                      id: dbBlock?.id,
                      key: fac.blockKey,
                      title: dbBlock?.title || `${fac.name} Structured Specs`,
                      structured_data:
                          (dbBlock?.structured_data as Record<string, unknown>) ||
                          (BASELINE_CONTENT_BLOCKS[fac.blockKey]?.structured_data as Record<string, unknown>) ||
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
                eyebrow="Campus Infrastructure"
                title="Facilities Management CMS"
                description="Manage all 8 institutional facilities, public page content, and specialized structured records (bus routes, library portals, hostel specs) in real time."
            />

            <AdminHonestNotice
                title="Integrated Dual-Tier Persistence (public.pages + public.content_blocks)"
                variant="info"
            >
                Edits made here update the canonical{" "}
                <code className="text-[#E5C158]">public.pages</code> record for page headers and markdown body,
                while specialized features (e.g. Bus Routes &amp; Stops) sync directly with{" "}
                <code className="text-[#E5C158]">public.content_blocks</code> with instant public route revalidation.
            </AdminHonestNotice>

            <FacilitiesManagerClient
                initialFacilities={facilities}
                role={admin.role}
            />
        </div>
    );
}
