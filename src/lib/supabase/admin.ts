import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Privileged server-only Supabase client.
 *
 * SECURITY RULES:
 * - Protected by `import "server-only"` so it can never be bundled for the browser.
 * - Never falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY` or mock credentials.
 * - Never use this client for ordinary user-authenticated CMS CRUD, admin login,
 *   or public inquiry/contact submissions (use `@/lib/supabase/server` instead).
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const secretKey = (
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        ""
    ).trim();

    if (!supabaseUrl || !secretKey) {
        throw new Error("Missing Supabase admin environment variables");
    }

    return createClient(supabaseUrl, secretKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
