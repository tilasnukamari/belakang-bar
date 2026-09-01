import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

import { SUPABASE_ANON_KEY, SUPABASE_URL, wajibKonfigurasi } from "./env";

/** Klien Supabase untuk Server Component dan Route Handler. */
export async function buatKlienServer() {
  wajibKonfigurasi();
  const gudangCookie = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return gudangCookie.getAll();
      },
      setAll(daftarCookie) {
        try {
          for (const { name, value, options } of daftarCookie) {
            gudangCookie.set(name, value, options);
          }
        } catch {
          // Dipanggil dari Server Component: cookie read-only di sini.
          // Penyegaran sesi ditangani middleware (langkah berikutnya).
        }
      },
    },
  });
}
