import { ADMIN_ROLES, requireAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { saveNewsItem, deleteNewsItem } from "@/actions/cms";
import {
    AdminHonestNotice,
    AdminPageHeader,
} from "@/components/admin/admin-primitives";
import { CmsCollectionManager } from "@/components/admin/cms-collection-manager";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
    const admin = await requireAdminRole(ADMIN_ROLES, {
        redirectTo: "/admin/login",
    });

    const supabase = await createClient();
    const { data: news } = await supabase
        .from("news")
        .select(
            "id, title, slug, category, excerpt, content, featured_image_url, is_featured, show_in_ticker, status, published_at, updated_at"
        )
        .order("updated_at", { ascending: false });

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="News & Announcements"
                title="Campus Newsroom"
                description="Author, review, and publish institutional news articles and ticker bulletins in public.news."
            />

            <AdminHonestNotice
                title="Connected to public.news (Supabase SSR)"
                variant="info"
            >
                Articles saved here persist directly to{" "}
                <code className="text-[#E5C158]">public.news</code> with
                role-enforced draft/publish workflow and automatic audit
                logging. Public <code className="text-zinc-200">/news</code>{" "}
                frontend binding remains preserved until enabled.
            </AdminHonestNotice>

            <CmsCollectionManager
                entityLabel="News Article"
                role={admin.role}
                items={(news ?? []) as Record<string, unknown>[]}
                searchKeys={["title", "slug", "category"]}
                columns={[
                    { key: "title", label: "Headline" },
                    { key: "category", label: "Category" },
                    { key: "slug", label: "Slug", isMono: true },
                    { key: "show_in_ticker", label: "Ticker" },
                    { key: "status", label: "Status", isStatus: true },
                ]}
                fields={[
                    {
                        name: "title",
                        label: "Article Headline",
                        type: "text",
                        required: true,
                        placeholder:
                            "JCMCSIIT Hosts IEEE Symposium on Applied AI",
                    },
                    {
                        name: "slug",
                        label: "URL Slug (Auto-normalized if blank)",
                        type: "text",
                        placeholder: "ieee-symposium-applied-ai",
                    },
                    {
                        name: "category",
                        label: "Category",
                        type: "text",
                        defaultValue: "General",
                        placeholder: "Academics / Achievements / Campus",
                    },
                    {
                        name: "status",
                        label: "Workflow Status",
                        type: "select",
                        defaultValue: "draft",
                    },
                    {
                        name: "featured_image_url",
                        label: "Featured Image URL",
                        type: "url",
                        placeholder: "/images/news-banner.jpg",
                        colSpan: 2,
                        mediaPicker: {
                            category: "image",
                            allowedBuckets: ["cms-media", "galleries"],
                            modalTitle: "Select Article Featured Image",
                        },
                    },
                    {
                        name: "is_featured",
                        label: "Feature on News Highlights",
                        type: "checkbox",
                        defaultValue: false,
                    },
                    {
                        name: "show_in_ticker",
                        label: "Include in Scrolling News Ticker",
                        type: "checkbox",
                        defaultValue: false,
                    },
                    {
                        name: "excerpt",
                        label: "Short Summary / Excerpt",
                        type: "textarea",
                        placeholder: "Brief teaser summary...",
                    },
                    {
                        name: "content",
                        label: "Full Article Body (Markdown)",
                        type: "textarea",
                        required: true,
                        placeholder: "Write full news article content...",
                    },
                ]}
                saveAction={saveNewsItem}
                deleteAction={deleteNewsItem}
            />
        </div>
    );
}
