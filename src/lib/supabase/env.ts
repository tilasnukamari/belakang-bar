/**
 * Pembacaan env Supabase yang tidak melempar saat build.
 * Nilai asli hanya ada di .env.local (tidak pernah masuk repo).
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function konfigurasiSupabaseLengkap(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

export function wajibKonfigurasi(): void {
  if (!konfigurasiSupabaseLengkap()) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum diisi. Lihat .env.example.",
    );
  }
}
