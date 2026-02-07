import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let _supabase: SupabaseClient | null = null;

/** Lazily create the Supabase client so the build doesn't crash when env vars
 *  are still set to placeholder values. */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.startsWith("your-")) {
      // Return a "no-op" client during build / when not configured
      console.warn(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
      );
      // Still create a client with dummy values — queries will simply fail gracefully
      _supabase = createClient(
        "https://placeholder.supabase.co",
        "placeholder-key"
      );
    } else {
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return _supabase;
}

/** Convenience re-export — same lazy singleton */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

/* ── Type definitions matching the Supabase schema ── */

export type Artist = {
  id: string;
  name: string;
  bio: string | null;
  slug: string;
  avatar_url: string | null;
};

export type Artwork = {
  id: string;
  title: string;
  artist_id: string;
  price: number | null;
  image_url: string;
  description: string | null;
  dimensions: string | null;
  is_sold: boolean;
  /* Joined from artists table */
  artists?: Artist;
};
