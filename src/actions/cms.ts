"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PRINCIPAL_MESSAGE_CMS_BLOCK_KEY } from "@/data/principal-message";
import {
    ADMIN_ROLES,
    AdminAuthError,
    requireAdminRole,
    type AdminProfile,
} from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";

export interface CmsActionResult {
    ok: boolean;
    message?: string;
    error?: string;
}

const WorkflowStatusSchema = z.enum([
    "draft",
    "published",
    "scheduled",
    "archived",
]);

function normalizeSlug(raw: string): string {
    return raw
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function getStr(formData: FormData, key: string): string {
    const val = formData.get(key);
    return typeof val === "string" ? val.trim() : "";
}

function getBool(formData: FormData, key: string): boolean {
    const val = formData.get(key);
    return val === "true" || val === "on" || val === "1";
}

export async function verifyWorkflowWriteRule(
    admin: AdminProfile,
    isInsert: boolean,
    targetStatus: z.infer<typeof WorkflowStatusSchema>
): Promise<string | null> {
    if (admin.role === "PUBLISHER" && isInsert) {
        return "Publisher accounts can review and update publication status on existing records, but cannot create new records.";
    }
    if (admin.role === "EDITOR" && targetStatus !== "draft") {
        return "Editor accounts may only save records in Draft status. Ask a Publisher or Admin to publish.";
    }
    return null;
}

function verifyAffectedRows(
    rows: readonly unknown[] | null | undefined,
    admin: AdminProfile,
    operation: "update" | "delete",
    entityLabel: string
): string | null {
    if (Array.isArray(rows) && rows.length > 0) {
        return null;
    }
    if (operation === "update" && admin.role === "EDITOR") {
        return `Permission denied: Editor accounts can only modify ${entityLabel} records that are currently in Draft status.`;
    }
    return `Unable to ${operation} ${entityLabel}: record was not found or database row-level security blocked this action.`;
}

function formatDatabaseError(
    error: { code?: string; message?: string },
    entityLabel: string
): string {
    if (error.code === "23505") {
        return `A ${entityLabel} record with this slug or unique key already exists.`;
    }
    if (error.code === "23503") {
        return `Cannot delete or modify this ${entityLabel} because other records still reference it.`;
    }
    if (error.code === "42501") {
        return `Permission denied: your role is not authorized to perform this ${entityLabel} operation.`;
    }
    if (error.code === "23514") {
        return `Validation rejected by database constraint for ${entityLabel}.`;
    }
    if (error.message && /Forbidden:|Unauthorized:|Cannot demote|Cannot delete/i.test(error.message)) {
        return error.message;
    }
    return `Database operation failed for ${entityLabel}. Please check your inputs and permissions.`;
}

function mapActionError(err: unknown): string {
    if (err instanceof AdminAuthError) {
        return err.message;
    }
    if (err instanceof z.ZodError) {
        return err.issues[0]?.message || "Invalid identifier or input payload.";
    }
    return "An unexpected error occurred while processing the request.";
}

// ----------------------------------------------------------------------------
// TARGETED PUBLIC ROUTE REVALIDATION HELPERS
// ----------------------------------------------------------------------------

function revalidatePagePublicPaths(slug?: string | null, routePath?: string | null) {
    if (routePath && routePath.startsWith("/")) {
        revalidatePath(routePath);
    }
    const cleanSlug = (slug || "").trim().replace(/^\/+|\/+$/g, "");
    if (!cleanSlug || cleanSlug === "home") {
        revalidatePath("/");
    } else {
        revalidatePath(`/${cleanSlug}`);
    }
}

function revalidateContentBlockPublicPaths(key: string) {
    const normalized = key.trim().toLowerCase();
    if (normalized === PRINCIPAL_MESSAGE_CMS_BLOCK_KEY) {
        revalidatePath("/about/college/principal");
        revalidatePath("/");
        return;
    }
    if (normalized === "chairman_profile" || normalized.startsWith("chairman")) {
        revalidatePath("/about/our-chairman");
        revalidatePath("/about/college/chairman");
        revalidatePath("/");
        return;
    }
    if (
        normalized.startsWith("home") ||
        normalized.startsWith("hero") ||
        normalized.startsWith("banner") ||
        normalized.startsWith("footer") ||
        normalized.startsWith("ticker")
    ) {
        revalidatePath("/");
    }
    if (normalized.startsWith("contact")) {
        revalidatePath("/contact");
    }
}

function revalidateNewsPublicPaths(slug?: string | null) {
    revalidatePath("/");
    revalidatePath("/news-events/news");
    if (slug) {
        revalidatePath(`/news-events/news/${slug}`);
    }
    revalidatePath("/sitemap.xml");
}

function revalidateCoursePublicPaths(slug?: string | null) {
    revalidatePath("/");
    revalidatePath("/academics");
    revalidatePath("/academics/ug");
    revalidatePath("/academics/pg");
    if (slug) {
        revalidatePath(`/academics/courses/${slug}`);
    }
}

function revalidateDepartmentPublicPaths(slug?: string | null) {
    revalidatePath("/academics/departments");
    if (slug) {
        revalidatePath(`/academics/departments/${slug}`);
        if (slug === "civil" || slug === "ce") {
            revalidatePath("/academics/departments/civil");
            revalidatePath("/academics/departments/ce");
        } else if (slug === "mechanical" || slug === "me") {
            revalidatePath("/academics/departments/mechanical");
            revalidatePath("/academics/departments/me");
        }
    }
    revalidatePath("/sitemap.xml");
}

function revalidateFacultyPublicPaths(slug?: string | null) {
    revalidatePath("/academics/faculty");
    revalidatePath("/academics/departments");
    if (slug) {
        revalidatePath(`/academics/faculty/${slug}`);
        revalidatePath(`/faculty/${slug}`);
    }
}

function revalidateEventPublicPaths(slug?: string | null) {
    revalidatePath("/");
    revalidatePath("/news-events/events");
    if (slug) {
        revalidatePath(`/news-events/events/${slug}`);
    }
    revalidatePath("/sitemap.xml");
}

function revalidateNoticePublicPaths() {
    revalidatePath("/");
    revalidatePath("/news-events/news");
    revalidatePath("/sitemap.xml");
}

function revalidatePopupPublicPaths() {
    revalidatePath("/");
}

function revalidateGalleryPublicPaths() {
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/news-events/gallery");
    revalidatePath("/admin/media");
    revalidatePath("/admin/gallery");
}

function revalidateSiteSettingPublicPaths(isPublic: boolean) {
    if (isPublic) {
        revalidatePath("/");
        revalidatePath("/contact");
    }
}

// ----------------------------------------------------------------------------
// 1. WEBSITE PAGES (`public.pages`)
// ----------------------------------------------------------------------------

const PageSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(2, "Title must be at least 2 characters.").max(255),
    slug: z
        .string()
        .min(1, "Slug is required.")
        .max(255)
        .regex(
            /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/,
            "Slug must use lowercase letters, numbers, hyphens, or path slashes."
        ),
    subtitle: z.string().max(500).optional(),
    summary: z.string().max(2000).optional(),
    content: z.string().max(100000),
    status: WorkflowStatusSchema,
    integration_status: z
        .enum(["pending", "connected", "code_managed"])
        .default("pending"),
});

export async function savePage(formData: FormData): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const explicitStatus = getStr(formData, "status");
        const resolvedStatus =
            explicitStatus ||
            (formData.has("is_published")
                ? getBool(formData, "is_published")
                    ? "published"
                    : "draft"
                : "draft");

        const parsed = PageSchema.safeParse({
            id: rawId || undefined,
            title: getStr(formData, "title"),
            slug: getStr(formData, "slug")
                .toLowerCase()
                .replace(/^\/+|\/+$/g, ""),
            subtitle: getStr(formData, "subtitle") || undefined,
            summary: getStr(formData, "summary") || undefined,
            content:
                typeof formData.get("content") === "string"
                    ? (formData.get("content") as string)
                    : "",
            status: resolvedStatus,
            integration_status:
                (getStr(formData, "integration_status") as
                    | "pending"
                    | "connected"
                    | "code_managed") || "pending",
        });

        if (!parsed.success) {
            return {
                ok: false,
                error: parsed.error.issues[0]?.message || "Invalid page data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) {
            return { ok: false, error: roleErr };
        }

        const supabase = await createClient();
        const payload = {
            title: parsed.data.title,
            slug: parsed.data.slug,
            subtitle: parsed.data.subtitle ?? null,
            summary: parsed.data.summary ?? null,
            content: parsed.data.content,
            status: parsed.data.status,
            integration_status: parsed.data.integration_status,
        };

        let savedRoutePath: string | null = null;

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("pages")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id, slug, route_path");
            if (error) {
                return { ok: false, error: formatDatabaseError(error, "page") };
            }
            const affectedErr = verifyAffectedRows(data, admin, "update", "page");
            if (affectedErr) {
                return { ok: false, error: affectedErr };
            }
            savedRoutePath = data?.[0]?.route_path ?? null;
        } else {
            const { data, error } = await supabase
                .from("pages")
                .insert(payload)
                .select("id, slug, route_path");
            if (error) {
                return { ok: false, error: formatDatabaseError(error, "page") };
            }
            savedRoutePath = data?.[0]?.route_path ?? null;
        }

        revalidatePath("/admin");
        revalidatePath("/admin/content/pages");
        revalidatePagePublicPaths(parsed.data.slug, savedRoutePath);
        return { ok: true, message: "Page saved successfully." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deletePage(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("pages")
            .delete()
            .eq("id", validId)
            .select("id, slug, route_path");
        if (error) {
            return { ok: false, error: formatDatabaseError(error, "page") };
        }
        const affectedErr = verifyAffectedRows(data, admin, "delete", "page");
        if (affectedErr) {
            return { ok: false, error: affectedErr };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/content/pages");
        revalidatePagePublicPaths(data?.[0]?.slug, data?.[0]?.route_path);
        return { ok: true, message: "Page deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 2. CONTENT BLOCKS (`public.content_blocks`)
// ----------------------------------------------------------------------------

const BlockSchema = z.object({
    id: z.string().uuid().optional(),
    key: z
        .string()
        .min(2, "Block key is required.")
        .max(255)
        .regex(
            /^[a-z0-9_.-]+$/,
            "Key may only contain lowercase letters, numbers, underscores, dots, or hyphens."
        ),
    title: z.string().min(2, "Title is required.").max(255),
    block_type: z
        .enum([
            "markdown",
            "rich_text",
            "hero",
            "cta",
            "stats",
            "links",
            "contact",
            "json",
        ])
        .default("markdown"),
    content: z.string().min(1, "Content is required.").max(100000),
    structured_data: z.record(z.string(), z.unknown()).optional(),
    status: WorkflowStatusSchema,
});

export async function saveContentBlock(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const rawStatus = getStr(formData, "status") || "draft";
        const rawStructured = getStr(formData, "structured_data");

        let parsedStructured: Record<string, unknown> | undefined = undefined;
        if (rawStructured) {
            try {
                parsedStructured = JSON.parse(rawStructured);
            } catch {
                return {
                    ok: false,
                    error: "Invalid JSON format in structured data.",
                };
            }
        }

        const parsed = BlockSchema.safeParse({
            id: rawId || undefined,
            key: getStr(formData, "key").toLowerCase(),
            title: getStr(formData, "title"),
            block_type: getStr(formData, "block_type") || "markdown",
            content:
                typeof formData.get("content") === "string"
                    ? (formData.get("content") as string)
                    : "",
            structured_data: parsedStructured,
            status: rawStatus,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid content block data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload: Record<string, unknown> = {
            key: parsed.data.key,
            title: parsed.data.title,
            block_type: parsed.data.block_type,
            content: parsed.data.content,
            status: parsed.data.status,
        };

        if (parsed.data.structured_data !== undefined) {
            payload.structured_data = parsed.data.structured_data;
        }

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("content_blocks")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id, key");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "content block"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "content block"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { data: existing } = await supabase
                .from("content_blocks")
                .select("id")
                .eq("key", parsed.data.key)
                .maybeSingle();

            let opError = null;
            if (existing?.id) {
                const { error } = await supabase
                    .from("content_blocks")
                    .update(payload)
                    .eq("id", existing.id);
                opError = error;
            } else {
                const { error } = await supabase
                    .from("content_blocks")
                    .insert(payload);
                opError = error;
            }

            if (opError) {
                return {
                    ok: false,
                    error: formatDatabaseError(opError, "content block"),
                };
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/content/blocks");
        revalidateContentBlockPublicPaths(parsed.data.key);
        return { ok: true, message: "Content block saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteContentBlock(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("content_blocks")
            .delete()
            .eq("id", validId)
            .select("id, key");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "content block"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "content block"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/content/blocks");
        if (data?.[0]?.key) {
            revalidateContentBlockPublicPaths(data[0].key);
        }
        return { ok: true, message: "Content block deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 3. NEWS & ANNOUNCEMENTS (`public.news`)
// ----------------------------------------------------------------------------

const NewsSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(3, "Title is required.").max(255),
    slug: z
        .string()
        .min(2, "Valid slug is required.")
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().min(1).max(64),
    excerpt: z.string().max(1000).optional(),
    content: z.string().min(5, "Article content is required.").max(100000),
    featured_image_url: z.string().max(2048).optional(),
    is_featured: z.boolean(),
    show_in_ticker: z.boolean(),
    status: WorkflowStatusSchema,
});

export async function saveNewsItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const title = getStr(formData, "title");
        const slugInput = getStr(formData, "slug") || normalizeSlug(title);
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = NewsSchema.safeParse({
            id: rawId || undefined,
            title,
            slug: normalizeSlug(slugInput),
            category: getStr(formData, "category") || "General",
            excerpt: getStr(formData, "excerpt") || undefined,
            content: getStr(formData, "content"),
            featured_image_url:
                getStr(formData, "featured_image_url") || undefined,
            is_featured: getBool(formData, "is_featured"),
            show_in_ticker: getBool(formData, "show_in_ticker"),
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error: parsed.error.issues[0]?.message || "Invalid news input.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            title: parsed.data.title,
            slug: parsed.data.slug,
            category: parsed.data.category,
            excerpt: parsed.data.excerpt ?? null,
            content: parsed.data.content,
            featured_image_url: parsed.data.featured_image_url ?? null,
            is_featured: parsed.data.is_featured,
            show_in_ticker: parsed.data.show_in_ticker,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("news")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "news article"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "news article"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("news")
                .insert({ ...payload, author_id: admin.id })
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "news article"),
                };
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/news");
        revalidateNewsPublicPaths(parsed.data.slug);
        return { ok: true, message: "News article saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteNewsItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("news")
            .delete()
            .eq("id", validId)
            .select("id, slug");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "news article"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "news article"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/news");
        revalidateNewsPublicPaths(data?.[0]?.slug);
        return { ok: true, message: "News article deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 4. COURSES (`public.courses`)
// ----------------------------------------------------------------------------

const CourseSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Course name is required.").max(255),
    slug: z
        .string()
        .min(2)
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    code: z.string().max(64).optional(),
    degree: z.string().max(128).optional(),
    category: z.enum(["UG", "PG", "DIPLOMA", "CERTIFICATE"]),
    duration: z.string().max(64).optional(),
    intake: z.number().int().min(0).max(5000).nullable(),
    eligibility: z.string().max(2000).optional(),
    overview: z.string().max(10000).optional(),
    syllabus_pdf_url: z.string().max(2048).optional(),
    status: WorkflowStatusSchema,
});

export async function saveCourseItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const name = getStr(formData, "name");
        const rawIntake = getStr(formData, "intake");
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = CourseSchema.safeParse({
            id: rawId || undefined,
            name,
            slug: normalizeSlug(getStr(formData, "slug") || name),
            code: getStr(formData, "code") || undefined,
            degree: getStr(formData, "degree") || undefined,
            category: getStr(formData, "category") || "UG",
            duration: getStr(formData, "duration") || undefined,
            intake: rawIntake ? Number.parseInt(rawIntake, 10) : null,
            eligibility: getStr(formData, "eligibility") || undefined,
            overview: getStr(formData, "overview") || undefined,
            syllabus_pdf_url: getStr(formData, "syllabus_pdf_url") || undefined,
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message || "Invalid course input.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            name: parsed.data.name,
            slug: parsed.data.slug,
            code: parsed.data.code ?? null,
            degree: parsed.data.degree ?? null,
            category: parsed.data.category,
            duration: parsed.data.duration ?? null,
            intake: parsed.data.intake,
            eligibility: parsed.data.eligibility ?? null,
            overview: parsed.data.overview ?? null,
            syllabus_pdf_url: parsed.data.syllabus_pdf_url ?? null,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("courses")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "course"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "course"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("courses")
                .insert(payload)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "course"),
                };
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/courses");
        revalidateCoursePublicPaths(parsed.data.slug);
        return { ok: true, message: "Course saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteCourseItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("courses")
            .delete()
            .eq("id", validId)
            .select("id, slug");
        if (error) {
            return { ok: false, error: formatDatabaseError(error, "course") };
        }
        const affectedErr = verifyAffectedRows(data, admin, "delete", "course");
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/courses");
        revalidateCoursePublicPaths(data?.[0]?.slug);
        return { ok: true, message: "Course deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 5. DEPARTMENTS (`public.departments`)
// ----------------------------------------------------------------------------

const DepartmentSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Department name is required.").max(255),
    slug: z.string().min(2).max(255),
    code: z.string().max(32).optional(),
    programme_type: z.enum([
        "UG",
        "PG",
        "DIPLOMA",
        "SCIENCE_HUMANITIES",
        "ADMINISTRATION",
    ]),
    hod_name: z.string().max(255).optional(),
    contact_email: z.string().max(255).optional(),
    short_description: z.string().max(3000).optional(),
    status: WorkflowStatusSchema,
});

export async function saveDepartmentItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const name = getStr(formData, "name");
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = DepartmentSchema.safeParse({
            id: rawId || undefined,
            name,
            slug: normalizeSlug(getStr(formData, "slug") || name),
            code: getStr(formData, "code") || undefined,
            programme_type: getStr(formData, "programme_type") || "UG",
            hod_name: getStr(formData, "hod_name") || undefined,
            contact_email: getStr(formData, "contact_email") || undefined,
            short_description:
                getStr(formData, "short_description") || undefined,
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid department data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            name: parsed.data.name,
            slug: parsed.data.slug,
            code: parsed.data.code ?? null,
            programme_type: parsed.data.programme_type,
            hod_name: parsed.data.hod_name ?? null,
            contact_email: parsed.data.contact_email ?? null,
            short_description: parsed.data.short_description ?? null,
            description: parsed.data.short_description ?? null,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("departments")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "department"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "department"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("departments")
                .insert(payload)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "department"),
                };
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/departments");
        revalidateDepartmentPublicPaths(parsed.data.slug);
        return { ok: true, message: "Department saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteDepartmentItem(
    id: string
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("departments")
            .delete()
            .eq("id", validId)
            .select("id, slug");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "department"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "department"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/departments");
        revalidateDepartmentPublicPaths(data?.[0]?.slug);
        return { ok: true, message: "Department deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 6. FACULTY & STAFF (`public.faculty`)
// ----------------------------------------------------------------------------

const FacultySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, "Faculty name is required.").max(255),
    slug: z.string().min(2).max(255),
    designation: z.string().max(255).optional(),
    department_id: z.string().uuid().nullable(),
    qualifications: z.string().max(500).optional(),
    email: z.string().max(255).optional(),
    image_url: z.string().max(2048).optional(),
    bio: z.string().max(5000).optional(),
    is_visible: z.boolean(),
    status: WorkflowStatusSchema,
});

export async function saveFacultyItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const name = getStr(formData, "name");
        const deptId = getStr(formData, "department_id");
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = FacultySchema.safeParse({
            id: rawId || undefined,
            name,
            slug: normalizeSlug(getStr(formData, "slug") || name),
            designation: getStr(formData, "designation") || undefined,
            department_id: deptId || null,
            qualifications: getStr(formData, "qualifications") || undefined,
            email: getStr(formData, "email") || undefined,
            image_url: getStr(formData, "image_url") || undefined,
            bio: getStr(formData, "bio") || undefined,
            is_visible: getBool(formData, "is_visible"),
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid faculty profile data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            name: parsed.data.name,
            slug: parsed.data.slug,
            designation: parsed.data.designation ?? null,
            department_id: parsed.data.department_id,
            qualifications: parsed.data.qualifications ?? null,
            email: parsed.data.email ?? null,
            image_url: parsed.data.image_url ?? null,
            bio: parsed.data.bio ?? null,
            is_visible: parsed.data.is_visible,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("faculty")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "faculty profile"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "faculty profile"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("faculty")
                .insert(payload)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "faculty profile"),
                };
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/faculty");
        revalidateFacultyPublicPaths(parsed.data.slug);
        return { ok: true, message: "Faculty profile saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteFacultyItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("faculty")
            .delete()
            .eq("id", validId)
            .select("id, slug");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "faculty profile"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "faculty profile"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/faculty");
        revalidateFacultyPublicPaths(data?.[0]?.slug);
        return { ok: true, message: "Faculty profile deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 7. EVENTS (`public.events`)
// ----------------------------------------------------------------------------

const EventSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(2, "Event title is required.").max(255),
    slug: z
        .string()
        .min(2)
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().min(1).max(64),
    display_date_text: z.string().max(128).optional(),
    location: z.string().max(255).optional(),
    description: z.string().max(5000).optional(),
    poster_url: z.string().max(2048).optional(),
    registration_url: z.string().max(2048).optional(),
    event_state: z.enum(["upcoming", "ongoing", "completed", "cancelled"]),
    is_featured: z.boolean(),
    status: WorkflowStatusSchema,
});

export async function saveEventItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const title = getStr(formData, "title");
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = EventSchema.safeParse({
            id: rawId || undefined,
            title,
            slug: normalizeSlug(getStr(formData, "slug") || title),
            category: getStr(formData, "category") || "Campus Event",
            display_date_text:
                getStr(formData, "display_date_text") || undefined,
            location: getStr(formData, "location") || undefined,
            description: getStr(formData, "description") || undefined,
            poster_url: getStr(formData, "poster_url") || undefined,
            registration_url: getStr(formData, "registration_url") || undefined,
            event_state: getStr(formData, "event_state") || "upcoming",
            is_featured: getBool(formData, "is_featured"),
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error: parsed.error.issues[0]?.message || "Invalid event data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            title: parsed.data.title,
            slug: parsed.data.slug,
            category: parsed.data.category,
            display_date_text: parsed.data.display_date_text ?? null,
            location: parsed.data.location ?? null,
            description: parsed.data.description ?? null,
            poster_url: parsed.data.poster_url ?? null,
            registration_url: parsed.data.registration_url ?? null,
            event_state: parsed.data.event_state,
            is_featured: parsed.data.is_featured,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("events")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "event"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "event"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("events")
                .insert(payload)
                .select("id, slug");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "event"),
                };
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/events");
        revalidateEventPublicPaths(parsed.data.slug);
        return { ok: true, message: "Event saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteEventItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("events")
            .delete()
            .eq("id", validId)
            .select("id, slug");
        if (error) {
            return { ok: false, error: formatDatabaseError(error, "event") };
        }
        const affectedErr = verifyAffectedRows(data, admin, "delete", "event");
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/events");
        revalidateEventPublicPaths(data?.[0]?.slug);
        return { ok: true, message: "Event deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 8. NOTICES (`public.notices`)
// ----------------------------------------------------------------------------

const NoticeSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(2, "Notice title is required.").max(255),
    slug: z
        .string()
        .min(2)
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.string().min(1).max(64),
    summary: z.string().max(4000).optional(),
    file_url: z.string().max(2048).optional(),
    notice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    expiry_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    is_pinned: z.boolean(),
    show_in_ticker: z.boolean(),
    status: WorkflowStatusSchema,
});

export async function saveNoticeItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const title = getStr(formData, "title");
        const today = new Date().toISOString().slice(0, 10);
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = NoticeSchema.safeParse({
            id: rawId || undefined,
            title,
            slug: normalizeSlug(getStr(formData, "slug") || title),
            category: getStr(formData, "category") || "Circular",
            summary: getStr(formData, "summary") || undefined,
            file_url: getStr(formData, "file_url") || undefined,
            notice_date: getStr(formData, "notice_date") || today,
            expiry_date: getStr(formData, "expiry_date") || undefined,
            is_pinned: getBool(formData, "is_pinned"),
            show_in_ticker: getBool(formData, "show_in_ticker"),
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message || "Invalid notice data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            title: parsed.data.title,
            slug: parsed.data.slug,
            category: parsed.data.category,
            summary: parsed.data.summary ?? null,
            file_url: parsed.data.file_url ?? null,
            notice_date: parsed.data.notice_date,
            expiry_date: parsed.data.expiry_date ?? null,
            is_pinned: parsed.data.is_pinned,
            show_in_ticker: parsed.data.show_in_ticker,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("notices")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "notice"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "notice"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("notices")
                .insert(payload)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "notice"),
                };
            }
        }

        revalidatePath("/admin");
        revalidatePath("/admin/notices");
        revalidateNoticePublicPaths();
        return { ok: true, message: "Notice saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteNoticeItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("notices")
            .delete()
            .eq("id", validId)
            .select("id");
        if (error) {
            return { ok: false, error: formatDatabaseError(error, "notice") };
        }
        const affectedErr = verifyAffectedRows(data, admin, "delete", "notice");
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/notices");
        revalidateNoticePublicPaths();
        return { ok: true, message: "Notice deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 9. HOMEPAGE POPUPS (`public.popups`) & GALLERY ITEMS (`public.gallery_items`)
// ----------------------------------------------------------------------------

const PopupSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(2, "Popup title is required.").max(255),
    description: z.string().max(2000).optional(),
    image_url: z.string().max(2048).optional(),
    cta_label: z.string().max(120).optional(),
    cta_url: z.string().max(2048).optional(),
    frequency: z.enum([
        "every_session",
        "once_per_day",
        "once_ever",
        "every_visit",
    ]),
    is_enabled: z.boolean(),
    status: WorkflowStatusSchema,
});

export async function savePopupItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        // Ensure only valid UUIDs are passed as existing record IDs; synthetic/invalid IDs are treated as new insertions
        const cleanId = rawId && z.string().uuid().safeParse(rawId).success ? rawId : undefined;
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = PopupSchema.safeParse({
            id: cleanId,
            title: getStr(formData, "title"),
            description: getStr(formData, "description") || undefined,
            image_url: getStr(formData, "image_url") || undefined,
            cta_label: getStr(formData, "cta_label") || undefined,
            cta_url: getStr(formData, "cta_url") || undefined,
            frequency: getStr(formData, "frequency") || "every_session",
            is_enabled: getBool(formData, "is_enabled"),
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error: parsed.error.issues[0]?.message || "Invalid popup data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            title: parsed.data.title,
            description: parsed.data.description ?? null,
            image_url: parsed.data.image_url ?? null,
            cta_label: parsed.data.cta_label ?? null,
            cta_url: parsed.data.cta_url ?? null,
            frequency: parsed.data.frequency,
            is_enabled: parsed.data.is_enabled,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("popups")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "popup campaign"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "popup campaign"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("popups")
                .insert(payload)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "popup campaign"),
                };
            }
        }

        revalidatePath("/admin/homepage");
        revalidatePopupPublicPaths();
        return { ok: true, message: "Popup campaign saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deletePopupItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const parsed = z
            .string()
            .uuid({ message: "Invalid popup ID. A valid UUID primary key is required." })
            .safeParse(id);

        if (!parsed.success) {
            // Graceful handling if a legacy synthetic baseline identifier is passed from stale client state
            if (id === "popup-graduation-2026" || id.startsWith("popup-baseline-")) {
                revalidatePath("/admin/homepage");
                revalidatePopupPublicPaths();
                return {
                    ok: true,
                    message: "Baseline popup dismissed successfully.",
                };
            }
            return {
                ok: false,
                error: parsed.error.issues[0]?.message || "Invalid popup identifier.",
            };
        }

        const validId = parsed.data;
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("popups")
            .delete()
            .eq("id", validId)
            .select("id");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "popup campaign"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "popup campaign"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin/homepage");
        revalidatePopupPublicPaths();
        return { ok: true, message: "Popup campaign deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 9B. NAVIGATION & TICKER ITEMS (`public.navigation_items`)
// ----------------------------------------------------------------------------

const NavigationItemSchema = z.object({
    id: z.string().uuid().optional(),
    menu_location: z.enum([
        "navbar",
        "footer",
        "quick_links",
        "floating_actions",
        "ticker",
    ]),
    label: z.string().min(1, "Label is required.").max(255),
    href: z.string().min(1, "Link URL is required."),
    parent_id: z.string().uuid().nullable().optional(),
    open_in_new_tab: z.boolean().default(false),
    badge_text: z.string().max(64).nullable().optional(),
    icon_name: z.string().max(64).nullable().optional(),
    column_group: z.string().max(64).nullable().optional(),
    sort_order: z.number().int().default(0),
    is_visible: z.boolean().default(true),
    status: WorkflowStatusSchema,
});

export async function saveNavigationItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const statusInput = getStr(formData, "status") || "draft";
        const rawParentId = getStr(formData, "parent_id");
        const rawSort = getStr(formData, "sort_order");

        const parsed = NavigationItemSchema.safeParse({
            id: rawId || undefined,
            menu_location: getStr(formData, "menu_location") || "navbar",
            label: getStr(formData, "label"),
            href: getStr(formData, "href"),
            parent_id: rawParentId || null,
            open_in_new_tab: getBool(formData, "open_in_new_tab"),
            badge_text: getStr(formData, "badge_text") || null,
            icon_name: getStr(formData, "icon_name") || null,
            column_group: getStr(formData, "column_group") || null,
            sort_order: rawSort ? parseInt(rawSort, 10) : 0,
            is_visible: getBool(formData, "is_visible"),
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error: parsed.error.issues[0]?.message || "Invalid navigation item data.",
            };
        }

        const ruleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (ruleErr) return { ok: false, error: ruleErr };

        const supabase = await createClient();
        const payload = {
            menu_location: parsed.data.menu_location,
            label: parsed.data.label,
            href: parsed.data.href,
            parent_id: parsed.data.parent_id ?? null,
            open_in_new_tab: parsed.data.open_in_new_tab,
            badge_text: parsed.data.badge_text ?? null,
            icon_name: parsed.data.icon_name ?? null,
            column_group: parsed.data.column_group ?? null,
            sort_order: isNaN(parsed.data.sort_order) ? 0 : parsed.data.sort_order,
            is_visible: parsed.data.is_visible,
            status: parsed.data.status,
            updated_by: admin.id,
            ...(parsed.data.status === "published"
                ? { published_at: new Date().toISOString() }
                : {}),
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("navigation_items")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "navigation item"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "navigation item"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("navigation_items")
                .insert(payload)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "navigation item"),
                };
            }
        }

        revalidatePath("/admin/homepage");
        revalidatePath("/");
        return { ok: true, message: "Navigation item saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteNavigationItem(
    id: string
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("navigation_items")
            .delete()
            .eq("id", validId)
            .select("id");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "navigation item"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "navigation item"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin/homepage");
        revalidatePath("/");
        return { ok: true, message: "Navigation item deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

const GalleryItemSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(2, "Title is required.").max(255),
    category: z.string().min(1).max(64),
    album_name: z.string().max(128).optional(),
    image_url: z.string().min(1, "Image URL or path is required.").max(2048),
    caption: z.string().max(1000).optional(),
    sort_order: z.coerce.number().int().default(0),
    status: WorkflowStatusSchema,
});

export async function saveGalleryItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const statusInput = getStr(formData, "status") || "draft";

        const parsed = GalleryItemSchema.safeParse({
            id: rawId || undefined,
            title: getStr(formData, "title"),
            category: getStr(formData, "category") || "Campus",
            album_name: getStr(formData, "album_name") || undefined,
            image_url: getStr(formData, "image_url"),
            caption: getStr(formData, "caption") || undefined,
            sort_order: getStr(formData, "sort_order") || "0",
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid gallery item data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            title: parsed.data.title,
            category: parsed.data.category,
            album_name: parsed.data.album_name ?? null,
            image_url: parsed.data.image_url,
            caption: parsed.data.caption ?? null,
            sort_order: parsed.data.sort_order,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("gallery_items")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "gallery item"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "gallery item"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("gallery_items")
                .insert(payload)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "gallery item"),
                };
            }
        }

        revalidatePath("/admin/media");
        revalidatePath("/admin/gallery");
        revalidateGalleryPublicPaths();
        return { ok: true, message: "Gallery item saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteGalleryItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("gallery_items")
            .delete()
            .eq("id", validId)
            .select("id");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "gallery item"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "gallery item"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin/media");
        revalidatePath("/admin/gallery");
        revalidateGalleryPublicPaths();
        return { ok: true, message: "Gallery item deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

const GalleryAlbumSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "Album title is required.").max(255),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters.")
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens."),
    description: z.string().max(2000).optional(),
    category: z.string().min(1).max(64),
    event_date: z.string().max(32).optional(),
    cover_image_url: z.string().max(2048).optional(),
    sort_order: z.coerce.number().int().default(0),
    status: WorkflowStatusSchema,
    scheduled_for: z.string().optional(),
});

export async function saveGalleryAlbum(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const statusInput = getStr(formData, "status") || "draft";
        const rawScheduledFor = getStr(formData, "scheduled_for") || undefined;
        if (statusInput === "scheduled" && !rawScheduledFor) {
            return {
                ok: false,
                error: "Validation error: A scheduled date and time is required when status is scheduled.",
            };
        }

        const rawTitle = getStr(formData, "title");
        let rawSlug = getStr(formData, "slug");
        if (!rawSlug && rawTitle) {
            rawSlug = rawTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
        }

        const parsed = GalleryAlbumSchema.safeParse({
            id: rawId || undefined,
            title: rawTitle,
            slug: rawSlug,
            description: getStr(formData, "description") || undefined,
            category: getStr(formData, "category") || "College Events",
            event_date: getStr(formData, "event_date") || undefined,
            cover_image_url: getStr(formData, "cover_image_url") || undefined,
            sort_order: getStr(formData, "sort_order") || "0",
            status: statusInput,
            scheduled_for: rawScheduledFor,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid gallery album data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();

        // Enforce Publisher restriction at application tier: Publishers may only change publication status
        if (admin.role === "PUBLISHER" && parsed.data.id) {
            const { data: existingAlbum } = await supabase
                .from("gallery_albums")
                .select("status, title, slug, description, category, event_date, cover_image_url, sort_order")
                .eq("id", parsed.data.id)
                .maybeSingle();

            if (existingAlbum) {
                const contentChanged =
                    existingAlbum.title !== parsed.data.title ||
                    existingAlbum.slug !== parsed.data.slug ||
                    existingAlbum.category !== parsed.data.category ||
                    (existingAlbum.description || "") !== (parsed.data.description || "") ||
                    (existingAlbum.cover_image_url || "") !== (parsed.data.cover_image_url || "") ||
                    (existingAlbum.event_date || "") !== (parsed.data.event_date || "") ||
                    Number(existingAlbum.sort_order ?? 0) !== parsed.data.sort_order;

                if (contentChanged) {
                    return {
                        ok: false,
                        error: "Publisher accounts may only change publication status, not album content.",
                    };
                }

                // Explicit Publisher transition matrix enforcement at application tier
                if (existingAlbum.status && existingAlbum.status !== parsed.data.status) {
                    const oldStatus = existingAlbum.status;
                    const newStatus = parsed.data.status;
                    const isPermitted =
                        (oldStatus === "draft" && ["published", "scheduled", "archived"].includes(newStatus)) ||
                        (oldStatus === "published" && ["archived", "draft"].includes(newStatus)) ||
                        (oldStatus === "scheduled" && ["published", "draft", "archived"].includes(newStatus)) ||
                        (oldStatus === "archived" && ["draft", "published"].includes(newStatus));

                    if (!isPermitted) {
                        return {
                            ok: false,
                            error: `Publisher cannot transition album from ${oldStatus} to ${newStatus}.`,
                        };
                    }
                }
            }
        }

        let savedSuccessfully = false;

        // Try to save directly to `gallery_albums` if table exists
        try {
            const albumPayload = {
                title: parsed.data.title,
                slug: parsed.data.slug,
                description: parsed.data.description ?? null,
                category: parsed.data.category,
                event_date: parsed.data.event_date ? parsed.data.event_date : null,
                cover_image_url: parsed.data.cover_image_url ?? null,
                sort_order: parsed.data.sort_order,
                status: parsed.data.status,
                scheduled_for: parsed.data.status === "scheduled" && parsed.data.scheduled_for ? parsed.data.scheduled_for : null,
            };

            if (parsed.data.id && !parsed.data.id.startsWith("gallery_album_")) {
                const { error: albumErr } = await supabase
                    .from("gallery_albums")
                    .update(albumPayload)
                    .eq("id", parsed.data.id);
                if (!albumErr) {
                    savedSuccessfully = true;
                }
            } else {
                const { error: albumErr } = await supabase
                    .from("gallery_albums")
                    .insert(albumPayload);
                if (!albumErr) {
                    savedSuccessfully = true;
                }
            }
        } catch {
            savedSuccessfully = false;
        }

        // Fallback or mirror to content_blocks for instant reliability before migration
        const blockKey = `gallery_album_${parsed.data.slug}`;
        const blockPayload = {
            key: blockKey,
            title: parsed.data.title,
            block_type: "json",
            content: parsed.data.description || "",
            structured_data: {
                title: parsed.data.title,
                slug: parsed.data.slug,
                description: parsed.data.description || "",
                category: parsed.data.category,
                event_date: parsed.data.event_date || "",
                cover_image_url: parsed.data.cover_image_url || "",
                sort_order: parsed.data.sort_order,
                status: parsed.data.status,
            },
            status: parsed.data.status,
        };

        const { error: blockErr } = await supabase
            .from("content_blocks")
            .upsert(blockPayload, { onConflict: "key" });

        if (blockErr && !savedSuccessfully) {
            return {
                ok: false,
                error: formatDatabaseError(blockErr, "gallery album"),
            };
        }

        revalidatePath("/admin/media");
        revalidatePath("/admin/gallery");
        revalidateGalleryPublicPaths();
        return { ok: true, message: "Album saved successfully." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteGalleryAlbum(
    idOrSlug: string,
    albumTitle?: string
): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const supabase = await createClient();
        const slug = idOrSlug.replace(/^gallery_album_/, "");

        // 1. Delete from formal table if exists
        try {
            await supabase
                .from("gallery_albums")
                .delete()
                .or(`id.eq.${idOrSlug},slug.eq.${slug}`);
        } catch {
            // Ignore if table does not exist
        }

        // 2. Delete from content_blocks
        await supabase
            .from("content_blocks")
            .delete()
            .or(`key.eq.${idOrSlug},key.eq.gallery_album_${slug}`);

        // 3. Clear album_name association in photos if requested
        if (albumTitle) {
            await supabase
                .from("gallery_items")
                .update({ album_name: null })
                .eq("album_name", albumTitle);
        }

        revalidatePath("/admin/media");
        revalidatePath("/admin/gallery");
        revalidateGalleryPublicPaths();
        return { ok: true, message: "Album deleted successfully." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export interface BatchGalleryItemInput {
    title: string;
    category: string;
    album_name?: string;
    image_url: string;
    caption?: string;
    sort_order?: number;
    status?: "draft" | "published" | "scheduled" | "archived";
}

export async function saveBatchGalleryItems(
    items: BatchGalleryItemInput[]
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        if (!Array.isArray(items) || items.length === 0) {
            return { ok: false, error: "No photo items provided for batch import." };
        }

        const validItems = items.map((item, idx) => ({
            title: item.title?.trim() || `Campus Photo ${idx + 1}`,
            category: item.category || "Campus",
            album_name: item.album_name?.trim() || null,
            image_url: item.image_url,
            caption: item.caption?.trim() || null,
            sort_order: typeof item.sort_order === "number" ? item.sort_order : idx + 1,
            status: item.status || ("published" as const),
        }));

        for (const item of validItems) {
            const roleErr = await verifyWorkflowWriteRule(
                admin,
                true,
                item.status
            );
            if (roleErr) return { ok: false, error: roleErr };
        }

        const supabase = await createClient();
        const { error } = await supabase.from("gallery_items").insert(validItems);

        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "batch gallery items"),
            };
        }

        revalidatePath("/admin/media");
        revalidatePath("/admin/gallery");
        revalidateGalleryPublicPaths();
        return {
            ok: true,
            message: `Successfully imported ${validItems.length} photos into gallery.`,
        };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 9b. RECRUITERS & PLACEMENT PARTNERS (`public.recruiters`)
// ----------------------------------------------------------------------------

const RecruiterSchema = z.object({
    id: z.string().uuid().optional(),
    company_name: z.string().min(2, "Company name is required.").max(255),
    tier: z.string().max(50).optional(),
    logo_url: z.string().max(2048).optional(),
    website_url: z.string().max(2048).optional(),
    display_order: z.coerce.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
    status: WorkflowStatusSchema,
});

function revalidateRecruiterPublicPaths() {
    revalidatePath("/admin/recruiters");
    revalidatePath("/placements");
    revalidatePath("/placements/recruiters");
    revalidatePath("/");
}

export async function saveRecruiterItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const companyName = getStr(formData, "company_name");
        const statusInput = getStr(formData, "status") || "published";

        const parsed = RecruiterSchema.safeParse({
            id: rawId || undefined,
            company_name: companyName,
            tier: getStr(formData, "tier") || "Tier 1",
            logo_url: getStr(formData, "logo_url") || undefined,
            website_url: getStr(formData, "website_url") || undefined,
            display_order: formData.has("display_order")
                ? Number(formData.get("display_order"))
                : 0,
            is_active: formData.has("is_active")
                ? getBool(formData, "is_active")
                : true,
            status: statusInput,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid recruiter data.",
            };
        }

        const roleErr = await verifyWorkflowWriteRule(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            company_name: parsed.data.company_name,
            tier: parsed.data.tier ?? null,
            logo_url: parsed.data.logo_url ?? null,
            website_url: parsed.data.website_url ?? null,
            display_order: parsed.data.display_order,
            is_active: parsed.data.is_active,
            status: parsed.data.status,
            updated_at: new Date().toISOString(),
        };

        if (parsed.data.id) {
            const { data, error } = await supabase
                .from("recruiters")
                .update(payload)
                .eq("id", parsed.data.id)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "recruiter"),
                };
            }
            const affectedErr = verifyAffectedRows(
                data,
                admin,
                "update",
                "recruiter"
            );
            if (affectedErr) return { ok: false, error: affectedErr };
        } else {
            const { error } = await supabase
                .from("recruiters")
                .insert(payload)
                .select("id");
            if (error) {
                return {
                    ok: false,
                    error: formatDatabaseError(error, "recruiter"),
                };
            }
        }

        revalidateRecruiterPublicPaths();
        return { ok: true, message: "Recruiter saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteRecruiterItem(id: string): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("recruiters")
            .delete()
            .eq("id", validId)
            .select("id");
        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "recruiter"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "recruiter"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidateRecruiterPublicPaths();
        return { ok: true, message: "Recruiter deleted." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 10. ADMISSIONS & INQUIRIES (`public.inquiries` — SUPER_ADMIN & ADMIN ONLY)
// ----------------------------------------------------------------------------

const InquiryUpdateSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(["new", "contacted", "converted", "closed"]),
    notes: z.string().max(4000).optional(),
});

export async function updateInquiryAction(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const parsed = InquiryUpdateSchema.safeParse({
            id: getStr(formData, "id"),
            status: getStr(formData, "status"),
            notes: getStr(formData, "notes") || undefined,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid inquiry update.",
            };
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("inquiries")
            .update({
                status: parsed.data.status,
                notes: parsed.data.notes ?? null,
                handled_by: admin.id,
            })
            .eq("id", parsed.data.id)
            .select("id");

        if (error) {
            return { ok: false, error: formatDatabaseError(error, "inquiry") };
        }
        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "update",
            "inquiry"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin");
        revalidatePath("/admin/admissions");
        revalidatePath("/admin/messages");
        return { ok: true, message: "Inquiry status updated." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 11. SITE SETTINGS (`public.site_settings` — SUPER_ADMIN & ADMIN ONLY)
// ----------------------------------------------------------------------------

/**
 * Approved public-setting keys permitted to have is_public = true.
 * Matches institutional security specification.
 */
const APPROVED_PUBLIC_SETTINGS_KEYS = [
    "logo_id",
    "favicon_id",
    "homepage_hero",
    "contact_info",
    "social_links",
    "footer_text",
    "default_og_image_id",
] as const;

const SiteSettingSchema = z.object({
    key: z
        .string()
        .min(2, "Setting key must be at least 2 characters.")
        .max(128, "Setting key must not exceed 128 characters.")
        .regex(
            /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
            "Setting key must use lowercase letters, numbers, dots, underscores, or hyphens."
        ),
    category: z
        .string()
        .min(1, "Category is required.")
        .max(64, "Category must not exceed 64 characters.")
        .regex(/^[a-z0-9_-]+$/i, "Category must be alphanumeric."),
    value_raw: z
        .string()
        .min(1, "Setting value is required.")
        .max(65536, "Setting value payload exceeds 64KB limit."),
    description: z
        .string()
        .max(1000, "Description must not exceed 1000 characters.")
        .optional(),
    is_public: z.boolean(),
});

export async function saveSiteSettingAction(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const parsed = SiteSettingSchema.safeParse({
            key: getStr(formData, "key").toLowerCase(),
            category: getStr(formData, "category") || "general",
            value_raw: getStr(formData, "value_raw"),
            description: getStr(formData, "description") || undefined,
            is_public: getBool(formData, "is_public"),
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid site setting input.",
            };
        }

        const { key, category, value_raw, description, is_public } = parsed.data;

        // Security boundary: enforce 7-key allowlist for public settings
        if (
            is_public &&
            !(APPROVED_PUBLIC_SETTINGS_KEYS as readonly string[]).includes(key)
        ) {
            return {
                ok: false,
                error: `Security violation: Setting key "${key}" is not permitted to be made public. Only approved keys (${APPROVED_PUBLIC_SETTINGS_KEYS.join(
                    ", "
                )}) may have is_public enabled.`,
            };
        }

        // Validate JSON payload
        let valueJson: unknown;
        try {
            valueJson = JSON.parse(value_raw);
        } catch {
            return {
                ok: false,
                error: 'Invalid JSON format. Value must be valid JSON (e.g., {"phone": "+91-471-2555555"} or "string_value").',
            };
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("site_settings")
            .upsert(
                {
                    key,
                    category,
                    value_json: valueJson,
                    description: description ?? null,
                    is_public,
                    updated_by: admin.id,
                },
                { onConflict: "key" }
            )
            .select("key, is_public");

        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "site setting"),
            };
        }

        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "update",
            "site setting"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin/settings");
        revalidateSiteSettingPublicPaths(is_public);

        return { ok: true, message: `Site setting "${key}" saved successfully.` };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteSiteSettingAction(
    key: string
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validKey = z
            .string()
            .min(1, "Setting key is required.")
            .max(128, "Setting key must not exceed 128 characters.")
            .regex(
                /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
                "Invalid setting key format."
            )
            .parse(key.trim().toLowerCase());

        const supabase = await createClient();

        // Perform delete and return affected row
        const { data, error } = await supabase
            .from("site_settings")
            .delete()
            .eq("key", validKey)
            .select("key, is_public");

        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "site setting"),
            };
        }

        const affectedErr = verifyAffectedRows(
            data,
            admin,
            "delete",
            "site setting"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        const wasPublic = Boolean(data?.[0]?.is_public);

        revalidatePath("/admin/settings");
        revalidateSiteSettingPublicPaths(wasPublic);

        return {
            ok: true,
            message: `Site setting "${validKey}" deleted successfully.`,
        };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 12. STAFF & ADMINISTRATORS (`public.admin_users` — SUPER_ADMIN ONLY)
// ----------------------------------------------------------------------------

const AdminMemberUpdateSchema = z.object({
    id: z.string().uuid(),
    full_name: z.string().min(2).max(255),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "PUBLISHER"]),
    is_active: z.boolean(),
});

export async function updateAdminMemberAction(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const currentSuperAdmin = await requireAdminRole(["SUPER_ADMIN"]);
        const parsed = AdminMemberUpdateSchema.safeParse({
            id: getStr(formData, "id"),
            full_name: getStr(formData, "full_name"),
            role: getStr(formData, "role"),
            is_active: getBool(formData, "is_active"),
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid administrator profile input.",
            };
        }

        if (
            parsed.data.id === currentSuperAdmin.id &&
            (!parsed.data.is_active || parsed.data.role !== "SUPER_ADMIN")
        ) {
            return {
                ok: false,
                error: "Safety lock: You cannot deactivate or demote your own active SUPER_ADMIN session.",
            };
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("admin_users")
            .update({
                full_name: parsed.data.full_name,
                role: parsed.data.role,
                is_active: parsed.data.is_active,
            })
            .eq("id", parsed.data.id)
            .select("id");

        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "administrator profile"),
            };
        }
        const affectedErr = verifyAffectedRows(
            data,
            currentSuperAdmin,
            "update",
            "administrator profile"
        );
        if (affectedErr) return { ok: false, error: affectedErr };

        revalidatePath("/admin/users");
        return { ok: true, message: "Administrator permissions updated." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 13. MEDIA METADATA (`public.media` — SUPER_ADMIN, ADMIN, OR OWN ACTIVE EDITOR)
// ----------------------------------------------------------------------------

const MediaMetadataUpdateSchema = z.object({
    id: z.string().uuid("Invalid media asset ID."),
    alt_text: z
        .string()
        .max(500, "Alt text must not exceed 500 characters.")
        .optional(),
    caption: z
        .string()
        .max(1000, "Caption must not exceed 1,000 characters.")
        .optional(),
});

export async function updateMediaMetadataAction(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        // PUBLISHER is strictly read-only on `public.media`; EDITOR may update only
        // their own active uploads (enforced by `media_editor_update_own` RLS & `trg_media_security`).
        const admin = await requireAdminRole([
            "SUPER_ADMIN",
            "ADMIN",
            "EDITOR",
        ]);

        const cleanField = (key: string): string | undefined => {
            const raw = formData.get(key);
            if (typeof raw !== "string") return undefined;
            const trimmed = raw
                .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
                .trim();
            return trimmed.length > 0 ? trimmed : undefined;
        };

        const parsed = MediaMetadataUpdateSchema.safeParse({
            id: getStr(formData, "id"),
            alt_text: cleanField("alt_text"),
            caption: cleanField("caption"),
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid media metadata input.",
            };
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("media")
            .update({
                alt_text: parsed.data.alt_text ?? null,
                caption: parsed.data.caption ?? null,
            })
            .eq("id", parsed.data.id)
            .select("id");

        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "media asset"),
            };
        }

        if (!data || data.length === 0) {
            if (admin.role === "EDITOR") {
                return {
                    ok: false,
                    error: "Permission denied: Editor accounts may only edit alt text and captions on their own active uploads.",
                };
            }
            return {
                ok: false,
                error: "Unable to update media metadata: record was not found or access was denied.",
            };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/media");
        revalidatePath("/admin/documents");
        return { ok: true, message: "Metadata saved successfully." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

// ----------------------------------------------------------------------------
// 13. MEDIA & DOCUMENT PICKER ASSETS
// ----------------------------------------------------------------------------

export interface MediaPickerAsset {
    id: string;
    bucket_id: string;
    storage_path: string;
    original_filename: string;
    public_url: string;
    mime_type: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    alt_text: string | null;
    caption: string | null;
    created_at: string;
}

export interface MediaPickerActionResult {
    ok: boolean;
    assets?: MediaPickerAsset[];
    error?: string;
}

const SERVER_IMAGE_BUCKETS = [
    "cms-media",
    "galleries",
    "faculty-profiles",
] as const;

const SERVER_DOCUMENT_BUCKETS = [
    "cms-documents",
    "pdfs",
] as const;

export async function fetchMediaPickerAssetsAction(
    category: "image" | "document",
    allowedBuckets?: readonly string[]
): Promise<MediaPickerActionResult> {
    try {
        await requireAdminRole(ADMIN_ROLES);

        if (category !== "image" && category !== "document") {
            return {
                ok: false,
                error: "Invalid media category requested.",
            };
        }

        const standardBuckets =
            category === "image"
                ? SERVER_IMAGE_BUCKETS
                : SERVER_DOCUMENT_BUCKETS;

        let effectiveBuckets: readonly string[] = standardBuckets;

        if (allowedBuckets && Array.isArray(allowedBuckets) && allowedBuckets.length > 0) {
            const hasInvalid = allowedBuckets.some(
                (b) => !(standardBuckets as readonly string[]).includes(b)
            );
            if (hasInvalid) {
                return {
                    ok: false,
                    error: `Invalid bucket requested for ${category} assets.`,
                };
            }
            effectiveBuckets = Array.from(new Set(allowedBuckets));
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("media")
            .select(
                "id, bucket_id, storage_path, original_filename, public_url, mime_type, size_bytes, width, height, alt_text, caption, created_at"
            )
            .in("bucket_id", effectiveBuckets)
            .eq("is_archived", false)
            .order("created_at", { ascending: false })
            .limit(100);

        if (error) {
            return {
                ok: false,
                error: formatDatabaseError(error, "media library"),
            };
        }

        return {
            ok: true,
            assets: (data ?? []) as MediaPickerAsset[],
        };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}
