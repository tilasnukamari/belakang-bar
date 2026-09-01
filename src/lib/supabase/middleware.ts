import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/lib/database.types";

import { SUPABASE_ANON_KEY, SUPABASE_URL, konfigurasiSupabaseLengkap } from "./env";

/** Route yang boleh dibuka tanpa sesi. */
const TERBUKA = ["/masuk", "/akun-belum-aktif", "/keluar"];

function terbuka(path: string): boolean {
  return TERBUKA.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * Menyegarkan sesi Supabase di setiap request dan menendang tamu ke /masuk.
 *
 * INI BUKAN PENGAMAN. Pengaman sebenarnya adalah RLS di database (migration
 * 0002). Fungsi ini cuma supaya orang tidak mendarat di layar yang tidak bisa
 * dia pakai. Jangan pernah menaruh data sensitif di balik pengecekan ini saja.
 */
export async function segarkanSesi(request: NextRequest) {
  let jawaban = NextResponse.next({ request });

  if (!konfigurasiSupabaseLengkap()) {
    return jawaban;
  }

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(daftarCookie) {
        for (const { name, value } of daftarCookie) {
          request.cookies.set(name, value);
        }
        jawaban = NextResponse.next({ request });
        for (const { name, value, options } of daftarCookie) {
          jawaban.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser(), bukan getSession(): yang ini memverifikasi token ke server Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && !terbuka(path)) {
    const ke = request.nextUrl.clone();
    ke.pathname = "/masuk";
    ke.search = "";
    return NextResponse.redirect(ke);
  }

  if (user && path === "/masuk") {
    const ke = request.nextUrl.clone();
    // "/" yang menentukan tujuan berdasarkan peran, supaya logikanya satu tempat.
    ke.pathname = "/";
    ke.search = "";
    return NextResponse.redirect(ke);
  }

  return jawaban;
}
