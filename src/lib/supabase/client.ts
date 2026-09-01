import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

import { SUPABASE_ANON_KEY, SUPABASE_URL, wajibKonfigurasi } from "./env";

/** Klien Supabase untuk Client Component (browser). */
export function buatKlienBrowser() {
  wajibKonfigurasi();
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
