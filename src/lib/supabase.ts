import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-placeholder";

/**
 * Legacy public anonymous Supabase client preserved strictly for backwards
 * compatibility with non-SSR public read callers.
 *
 * Privileged `supabaseAdmin` and service-role keys have been intentionally
 * removed from this shared module; server-only privileged tasks must explicitly
 * import `createAdminClient` from `@/lib/supabase/admin`.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
