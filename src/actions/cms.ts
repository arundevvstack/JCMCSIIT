"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
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

function enforceWorkflowWritePermission(
    admin: AdminProfile,
    isInsert: boolean,
    targetStatus: z.infer<typeof WorkflowStatusSchema>
): string | null {
    if (admin.role === "PUBLISHER" && isInsert) {
        return "Publisher accounts can review and update publication status on existing records, but cannot create new records.";
    }
    if (admin.role === "EDITOR" && targetStatus !== "draft") {
        return "Editor accounts may only save records in Draft status. Ask a Publisher or Admin to publish.";
    }
    return null;
}

function mapActionError(err: unknown): string {
    if (err instanceof AdminAuthError) {
        return err.message;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return "An unexpected error occurred while processing the request.";
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
        const rawStatus =
            getStr(formData, "status") ||
            (getBool(formData, "is_published") ? "published" : "draft");
        const effectiveStatus =
            admin.role === "EDITOR" ? "draft" : rawStatus;

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
            status: effectiveStatus,
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

        const roleErr = enforceWorkflowWritePermission(
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

        if (parsed.data.id) {
            const { error } = await supabase
                .from("pages")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase.from("pages").insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/content/pages");
        return { ok: true, message: "Page saved successfully." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deletePage(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();

        const { error } = await supabase
            .from("pages")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };

        revalidatePath("/admin");
        revalidatePath("/admin/content/pages");
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
    status: WorkflowStatusSchema,
});

export async function saveContentBlock(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const rawStatus = getStr(formData, "status") || "draft";
        const effectiveStatus =
            admin.role === "EDITOR" ? "draft" : rawStatus;

        const parsed = BlockSchema.safeParse({
            id: rawId || undefined,
            key: getStr(formData, "key").toLowerCase(),
            title: getStr(formData, "title"),
            block_type: getStr(formData, "block_type") || "markdown",
            content:
                typeof formData.get("content") === "string"
                    ? (formData.get("content") as string)
                    : "",
            status: effectiveStatus,
        });

        if (!parsed.success) {
            return {
                ok: false,
                error:
                    parsed.error.issues[0]?.message ||
                    "Invalid content block data.",
            };
        }

        const roleErr = enforceWorkflowWritePermission(
            admin,
            !parsed.data.id,
            parsed.data.status
        );
        if (roleErr) return { ok: false, error: roleErr };

        const supabase = await createClient();
        const payload = {
            key: parsed.data.key,
            title: parsed.data.title,
            block_type: parsed.data.block_type,
            content: parsed.data.content,
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { error } = await supabase
                .from("content_blocks")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase
                .from("content_blocks")
                .insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/content/blocks");
        return { ok: true, message: "Content block saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteContentBlock(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();

        const { error } = await supabase
            .from("content_blocks")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };

        revalidatePath("/admin");
        revalidatePath("/admin/content/blocks");
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
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

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

        const roleErr = enforceWorkflowWritePermission(
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
            const { error } = await supabase
                .from("news")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase
                .from("news")
                .insert({ ...payload, author_id: admin.id });
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/news");
        return { ok: true, message: "News article saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteNewsItem(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("news")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin");
        revalidatePath("/admin/news");
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
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

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

        const roleErr = enforceWorkflowWritePermission(
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
            const { error } = await supabase
                .from("courses")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase.from("courses").insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/courses");
        return { ok: true, message: "Course saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteCourseItem(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("courses")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin");
        revalidatePath("/admin/courses");
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
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

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

        const roleErr = enforceWorkflowWritePermission(
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
            const { error } = await supabase
                .from("departments")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase
                .from("departments")
                .insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/departments");
        return { ok: true, message: "Department saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteDepartmentItem(
    id: string
): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("departments")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin");
        revalidatePath("/admin/departments");
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
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

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

        const roleErr = enforceWorkflowWritePermission(
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
            const { error } = await supabase
                .from("faculty")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase.from("faculty").insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/faculty");
        return { ok: true, message: "Faculty profile saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteFacultyItem(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("faculty")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin");
        revalidatePath("/admin/faculty");
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
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

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

        const roleErr = enforceWorkflowWritePermission(
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
            const { error } = await supabase
                .from("events")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase.from("events").insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/events");
        return { ok: true, message: "Event saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteEventItem(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin");
        revalidatePath("/admin/events");
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
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

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

        const roleErr = enforceWorkflowWritePermission(
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
            const { error } = await supabase
                .from("notices")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase.from("notices").insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin");
        revalidatePath("/admin/notices");
        return { ok: true, message: "Notice saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteNoticeItem(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("notices")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin");
        revalidatePath("/admin/notices");
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
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

        const parsed = PopupSchema.safeParse({
            id: rawId || undefined,
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

        const roleErr = enforceWorkflowWritePermission(
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
            const { error } = await supabase
                .from("popups")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase.from("popups").insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin/homepage");
        return { ok: true, message: "Popup campaign saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deletePopupItem(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("popups")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin/homepage");
        return { ok: true, message: "Popup campaign deleted." };
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
    status: WorkflowStatusSchema,
});

export async function saveGalleryItem(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        const admin = await requireAdminRole(ADMIN_ROLES);
        const rawId = getStr(formData, "id");
        const statusInput =
            admin.role === "EDITOR"
                ? "draft"
                : getStr(formData, "status") || "draft";

        const parsed = GalleryItemSchema.safeParse({
            id: rawId || undefined,
            title: getStr(formData, "title"),
            category: getStr(formData, "category") || "Campus",
            album_name: getStr(formData, "album_name") || undefined,
            image_url: getStr(formData, "image_url"),
            caption: getStr(formData, "caption") || undefined,
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

        const roleErr = enforceWorkflowWritePermission(
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
            status: parsed.data.status,
        };

        if (parsed.data.id) {
            const { error } = await supabase
                .from("gallery_items")
                .update(payload)
                .eq("id", parsed.data.id);
            if (error) return { ok: false, error: error.message };
        } else {
            const { error } = await supabase
                .from("gallery_items")
                .insert(payload);
            if (error) return { ok: false, error: error.message };
        }

        revalidatePath("/admin/media");
        return { ok: true, message: "Gallery item saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteGalleryItem(id: string): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validId = z.string().uuid().parse(id);
        const supabase = await createClient();
        const { error } = await supabase
            .from("gallery_items")
            .delete()
            .eq("id", validId);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin/media");
        return { ok: true, message: "Gallery item deleted." };
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
        const { error } = await supabase
            .from("inquiries")
            .update({
                status: parsed.data.status,
                notes: parsed.data.notes ?? null,
                handled_by: admin.id,
            })
            .eq("id", parsed.data.id);

        if (error) return { ok: false, error: error.message };

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

const SiteSettingSchema = z.object({
    key: z
        .string()
        .min(2)
        .max(128)
        .regex(
            /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/,
            "Setting key must use lowercase letters, numbers, dots, underscores, or hyphens."
        ),
    category: z.string().min(1).max(64),
    value_raw: z.string().min(1, "JSON value is required."),
    description: z.string().max(1000).optional(),
    is_public: z.boolean(),
});

export async function saveSiteSettingAction(
    formData: FormData
): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
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

        let valueJson: unknown;
        try {
            valueJson = JSON.parse(parsed.data.value_raw);
        } catch {
            return {
                ok: false,
                error: 'Value must be valid JSON (for example: {"phone":"+91-471-2555555"} or "Enabled").',
            };
        }

        if (
            valueJson === null ||
            typeof valueJson !== "object" ||
            Array.isArray(valueJson)
        ) {
            valueJson = { value: valueJson };
        }

        const supabase = await createClient();
        const { error } = await supabase.from("site_settings").upsert(
            {
                key: parsed.data.key,
                category: parsed.data.category,
                value_json: valueJson,
                description: parsed.data.description ?? null,
                is_public: parsed.data.is_public,
            },
            { onConflict: "key" }
        );

        if (error) return { ok: false, error: error.message };

        revalidatePath("/admin/settings");
        return { ok: true, message: "Site setting saved." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}

export async function deleteSiteSettingAction(
    key: string
): Promise<CmsActionResult> {
    try {
        await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);
        const validKey = z
            .string()
            .min(1)
            .max(128)
            .parse(key);
        const supabase = await createClient();
        const { error } = await supabase
            .from("site_settings")
            .delete()
            .eq("key", validKey);
        if (error) return { ok: false, error: error.message };
        revalidatePath("/admin/settings");
        return { ok: true, message: "Site setting deleted." };
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
        const { error } = await supabase
            .from("admin_users")
            .update({
                full_name: parsed.data.full_name,
                role: parsed.data.role,
                is_active: parsed.data.is_active,
            })
            .eq("id", parsed.data.id);

        if (error) return { ok: false, error: error.message };

        revalidatePath("/admin/users");
        return { ok: true, message: "Administrator permissions updated." };
    } catch (err) {
        return { ok: false, error: mapActionError(err) };
    }
}
