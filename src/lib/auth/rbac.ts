import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const ADMIN_ROLES = [
    "SUPER_ADMIN",
    "ADMIN",
    "EDITOR",
    "PUBLISHER",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminProfile {
    id: string;
    email: string;
    full_name: string;
    role: AdminRole;
    is_active: true;
    last_login_at: string | null;
}

export type AdminAuthErrorCode = "UNAUTHENTICATED" | "FORBIDDEN";

export class AdminAuthError extends Error {
    public readonly status: 401 | 403;
    public readonly code: AdminAuthErrorCode;

    constructor(
        message: string,
        status: 401 | 403,
        code: AdminAuthErrorCode
    ) {
        super(message);
        this.name = "AdminAuthError";
        this.status = status;
        this.code = code;
    }
}

export interface RequireAdminOptions {
    /**
     * Optional path to redirect to (e.g. "/admin/login") when the user is
     * unauthenticated or not an active CMS member. Omit in API Route Handlers
     * and Server Actions so a 401 AdminAuthError is thrown instead.
     */
    redirectTo?: string;
    /**
     * Optional path to redirect to (e.g. "/admin") when an active CMS member
     * lacks the required role for a page. Omit in API Route Handlers and
     * Server Actions so a 403 AdminAuthError is thrown instead.
     */
    forbiddenRedirectTo?: string;
}

export function isValidAdminRole(value: unknown): value is AdminRole {
    return (
        typeof value === "string" &&
        (ADMIN_ROLES as readonly string[]).includes(value)
    );
}

/**
 * Verifies the current request's authenticated user via Supabase Auth server
 * validation (`supabase.auth.getUser()`) and fetches their active allowlist
 * record from `public.admin_users` using the ordinary user-scoped SSR client.
 *
 * Fails closed (`null`) on missing configuration, missing/invalid JWT, DB
 * errors, missing allowlist row, `is_active !== true`, or unrecognized role.
 */
export const getCurrentAdmin = cache(
    async (): Promise<AdminProfile | null> => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return null;
        }

        try {
            const supabase = await createClient();

            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user?.id) {
                return null;
            }

            const { data: adminRow, error: dbError } = await supabase
                .from("admin_users")
                .select("id, email, full_name, role, is_active, last_login_at")
                .eq("id", user.id)
                .eq("is_active", true)
                .maybeSingle();

            if (
                dbError ||
                !adminRow ||
                adminRow.id !== user.id ||
                adminRow.is_active !== true ||
                !isValidAdminRole(adminRow.role)
            ) {
                return null;
            }

            return {
                id: adminRow.id,
                email: adminRow.email,
                full_name: adminRow.full_name,
                role: adminRow.role,
                is_active: true,
                last_login_at: adminRow.last_login_at ?? null,
            };
        } catch {
            // Fail closed on any unexpected cookie, network, or runtime error.
            return null;
        }
    }
);

/**
 * Enforces that the caller is an authenticated, active CMS administrator whose
 * role is explicitly included in `allowedRoles`.
 *
 * Fails closed by throwing `AdminAuthError` (401/403) — or calling Next.js
 * `redirect()` when `options.redirectTo` / `options.forbiddenRedirectTo` is
 * supplied by a Server Component or Layout.
 */
export async function requireAdminRole(
    allowedRoles: readonly AdminRole[],
    options?: RequireAdminOptions
): Promise<AdminProfile> {
    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        throw new AdminAuthError(
            "Forbidden: empty role allowlist",
            403,
            "FORBIDDEN"
        );
    }

    const admin = await getCurrentAdmin();

    if (!admin) {
        if (options?.redirectTo) {
            redirect(options.redirectTo);
        }
        throw new AdminAuthError(
            "Unauthorized: active administrator session required",
            401,
            "UNAUTHENTICATED"
        );
    }

    if (!allowedRoles.includes(admin.role)) {
        if (options?.forbiddenRedirectTo) {
            redirect(options.forbiddenRedirectTo);
        }
        throw new AdminAuthError(
            "Forbidden: insufficient administrator role permissions",
            403,
            "FORBIDDEN"
        );
    }

    return admin;
}
