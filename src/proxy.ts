import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_ADMIN_ROLES = [
    "SUPER_ADMIN",
    "ADMIN",
    "EDITOR",
    "PUBLISHER",
] as const;

type AllowedAdminRole = (typeof ALLOWED_ADMIN_ROLES)[number];

function isAllowedAdminRole(value: unknown): value is AllowedAdminRole {
    return (
        typeof value === "string" &&
        (ALLOWED_ADMIN_ROLES as readonly string[]).includes(value)
    );
}

function isAdminPath(pathname: string): boolean {
    return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminLoginPath(pathname: string): boolean {
    return (
        pathname === "/admin/login" || pathname.startsWith("/admin/login/")
    );
}

function redirectWithCookies(
    destination: URL,
    baseResponse: NextResponse
): NextResponse {
    const redirectResponse = NextResponse.redirect(destination);

    baseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const adminRoute = isAdminPath(pathname);
    const adminLoginRoute = isAdminLoginPath(pathname);

    let supabaseResponse = NextResponse.next({
        request,
    });

    // Public routes do not require admin session validation in middleware.
    // Early return eliminates unnecessary Supabase Auth network latency for public visitors.
    if (!adminRoute) {
        return supabaseResponse;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        if (adminRoute && !adminLoginRoute) {
            return NextResponse.redirect(
                new URL("/admin/login?error=configuration", request.url)
            );
        }
        return supabaseResponse;
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value);
                });
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) => {
                    supabaseResponse.cookies.set(name, value, options);
                });
            },
        },
    });

    try {
        // Refreshes expired Supabase auth tokens on matched requests when a
        // session cookie exists, and verifies the user token with Supabase Auth.
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        // Unauthenticated visitor on /admin/*
        if (authError || !user?.id) {
            if (!adminLoginRoute) {
                return redirectWithCookies(
                    new URL("/admin/login", request.url),
                    supabaseResponse
                );
            }
            return supabaseResponse;
        }

        // Authenticated user on /admin/* -> verify active allowlist row & role
        const { data: adminRow, error: adminError } = await supabase
            .from("admin_users")
            .select("id, role, is_active")
            .eq("id", user.id)
            .eq("is_active", true)
            .maybeSingle();

        const isActiveAdmin =
            !adminError &&
            adminRow !== null &&
            adminRow.id === user.id &&
            adminRow.is_active === true &&
            isAllowedAdminRole(adminRow.role);

        if (!isActiveAdmin) {
            // Authenticated non-admin or deactivated account: block protected
            // admin routes and redirect to a safe unauthorized destination.
            if (!adminLoginRoute) {
                return redirectWithCookies(
                    new URL("/admin/login?error=unauthorized", request.url),
                    supabaseResponse
                );
            }
            return supabaseResponse;
        }

        // Active, authorized admin visiting /admin/login -> redirect to /admin
        if (adminLoginRoute) {
            return redirectWithCookies(
                new URL("/admin", request.url),
                supabaseResponse
            );
        }

        return supabaseResponse;
    } catch {
        // Fail closed on any unexpected runtime or network failure for protected /admin routes.
        if (adminRoute && !adminLoginRoute) {
            return redirectWithCookies(
                new URL("/admin/login", request.url),
                supabaseResponse
            );
        }
        return supabaseResponse;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static chunks)
         * - _next/image (image optimization)
         * - favicon.ico, robots.txt, sitemap.xml
         * - static public image, document, and font files
         */
        "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|pdf|doc|docx|woff|woff2|ttf)$).*)",
    ],
};
