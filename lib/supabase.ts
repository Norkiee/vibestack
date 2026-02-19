import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create clients lazily to avoid build errors when env vars aren't set
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables not configured");
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    if (!supabaseUrl) {
      throw new Error("Supabase URL not configured");
    }
    const key = supabaseServiceKey || supabaseAnonKey;
    if (!key) {
      throw new Error("Supabase key not configured");
    }
    _supabaseAdmin = createClient(supabaseUrl, key);
  }
  return _supabaseAdmin;
}

// For backwards compatibility - these will throw if env vars not set
export const supabase = {
  get from() {
    return getSupabase().from.bind(getSupabase());
  },
};

export const supabaseAdmin = {
  get from() {
    return getSupabaseAdmin().from.bind(getSupabaseAdmin());
  },
};
