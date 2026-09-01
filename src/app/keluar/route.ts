import { NextResponse, type NextRequest } from "next/server";

import { buatKlienServer } from "@/lib/supabase/server";

/**
 * Mengakhiri sesi lalu mengalihkan. Dipakai untuk kasus paksa — user yang
 * berhasil login tapi tidak punya baris `profil` atau `aktif = false`.
 *
 * Route Handler, bukan Server Component, karena cuma di sini (dan di server
 * action) cookie sesi boleh dihapus.
 *
 * Tombol Keluar yang kelihatan TIDAK memakai route ini: dia pakai server action
 * lewat POST, supaya prefetch Next tidak diam-diam mengakhiri sesi orang.
 */
export async function GET(request: NextRequest) {
  const supabase = await buatKlienServer();
  await supabase.auth.signOut();

  const alasan = request.nextUrl.searchParams.get("alasan");
  const ke = request.nextUrl.clone();
  ke.search = "";
  ke.pathname = alasan === "nonaktif" ? "/akun-belum-aktif" : "/masuk";

  return NextResponse.redirect(ke);
}
