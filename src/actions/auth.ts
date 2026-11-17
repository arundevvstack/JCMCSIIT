"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentAdmin, isValidAdminRole } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";

const LoginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email address is required.")
        .email("Please enter a valid email address.")
        .max(255, "Email address is too long."),
    password: z
        .string()
        .min(1, "Password is required.")
        .max(256, "Password exceeds maximum length."),
});

export interface AuthActionState {
    error?: string;
    email?: string;
}

function extractClientAuditContext(reqHeaders: Headers): {
    ipAddress: string | null;
    userAgent: string | null;
} {
    const forwardedFor = reqHeaders.get("x-forwarded-for");
    const rawIp =
        forwardedFor?.split(",")[0]?.trim() ||
        reqHeaders.get("x-real-ip")?.trim() ||
        null;

    return {
        ipAddress: rawIp ? rawIp.slice(0, 64) : null,
        userAgent: reqHeaders.get("user-agent")?.slice(0, 512) ?? null,
    };
}

export async function signInAdmin(
    _prevState: AuthActionState,
    formData: FormData
): Promise<AuthActionState> {
    const rawEmailEntry = formData.get("email");
    const rawPasswordEntry = formData.get("password");

    const rawEmail = typeof rawEmailEntry === "string" ? rawEmailEntry : "";
    const rawPassword =
        typeof rawPasswordEntry === "string" ? rawPasswordEntry : "";

    const parsed = LoginSchema.safeParse({
        email: rawEmail,
        password: rawPassword,
    });

    if (!parsed.success) {
        const message =
            parsed.error.issues[0]?.message ||
            "Please enter a valid email address and password.";
        return {
            error: message,
            email: rawEmail.trim(),
        };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return {
            error: "Authentication service is not configured. Please contact the system administrator.",
            email: parsed.data.email,
        };
    }

    try {
        const supabase = await createClient();

        const { data: authData, error: signInError } =
            await supabase.auth.signInWithPassword({
                email: parsed.data.email,
                password: parsed.data.password,
            });

        if (signInError || !authData.user?.id) {
            return {
                error: "Invalid email address or password.",
                email: parsed.data.email,
            };
        }

        const { data: adminRow, error: adminError } = await supabase
            .from("admin_users")
            .select("id, email, full_name, role, is_active")
            .eq("id", authData.user.id)
            .eq("is_active", true)
            .maybeSingle();

        const isAuthorizedAdmin =
            !adminError &&
            adminRow !== null &&
            adminRow.id === authData.user.id &&
            adminRow.is_active === true &&
            isValidAdminRole(adminRow.role);

        if (!isAuthorizedAdmin) {
            await supabase.auth.signOut();
            return {
                error: "Access denied. Your account does not have active administrator permissions.",
                email: parsed.data.email,
            };
        }

        // Record `last_login_at` on `public.admin_users` using the authenticated SSR session.
        // Handled non-fatally so sign-in succeeds cleanly even when non-SUPER_ADMIN roles
        // have SELECT-only RLS access on `public.admin_users`.
        try {
            const loginTimestamp = new Date().toISOString();
            const { error: lastLoginError } = await supabase
                .from("admin_users")
                .update({ last_login_at: loginTimestamp })
                .eq("id", authData.user.id);

            if (lastLoginError) {
                console.error(
                    "Admin last_login_at update failed:",
                    lastLoginError.code
                );
            }
        } catch {
            // Non-fatal: preserve sign-in flow if timestamp update encounters a transient or RLS error.
        }

        // Verified against `public.audit_logs` schema (00005) and
        // `audit_logs_cms_insert` RLS policy (`is_cms_member() AND actor_id = auth.uid()`).
        // Do NOT chain `.select()` because EDITOR/PUBLISHER have INSERT-only access on audit_logs.
        try {
            const reqHeaders = await headers();
            const { ipAddress, userAgent } =
                extractClientAuditContext(reqHeaders);

            const { error: auditError } = await supabase
                .from("audit_logs")
                .insert({
                    actor_id: authData.user.id,
                    actor_email: adminRow.email,
                    actor_role: adminRow.role,
                    action: "ADMIN_LOGIN",
                    entity_type: "auth_session",
                    entity_id: authData.user.id,
                    metadata: {
                        login_surface: "/admin/login",
                    },
                    ip_address: ipAddress,
                    user_agent: userAgent,
                });

            if (auditError) {
                console.error(
                    "Admin login audit insert failed:",
                    auditError.code
                );
            }
        } catch {
            // Non-fatal if request headers or audit insert encounter a transient failure.
        }
    } catch {
        return {
            error: "Unable to complete sign-in right now. Please try again.",
            email: parsed.data.email,
        };
    }

    redirect("/admin");
}

export async function signOutAdmin(): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
        try {
            const supabase = await createClient();
            const currentAdmin = await getCurrentAdmin();

            if (currentAdmin) {
                try {
                    const reqHeaders = await headers();
                    const { ipAddress, userAgent } =
                        extractClientAuditContext(reqHeaders);

                    await supabase.from("audit_logs").insert({
                        actor_id: currentAdmin.id,
                        actor_email: currentAdmin.email,
                        actor_role: currentAdmin.role,
                        action: "ADMIN_LOGOUT",
                        entity_type: "auth_session",
                        entity_id: currentAdmin.id,
                        metadata: {
                            logout_surface: "/admin",
                        },
                        ip_address: ipAddress,
                        user_agent: userAgent,
                    });
                } catch {
                    // Best-effort logout audit logging before clearing session cookies.
                }
            }

            await supabase.auth.signOut();
        } catch {
            // Proceed to login redirect even if cookie cleanup encountered a transient error.
        }
    }

    redirect("/admin/login");
}
