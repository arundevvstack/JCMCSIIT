import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// For client components / public access
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-only operations that need to bypass RLS (like ingestion, metadata fetching if protected)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
