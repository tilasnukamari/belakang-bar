import type { NextRequest } from "next/server";

import { segarkanSesi } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return segarkanSesi(request);
}

export const config = {
  matcher: [
    /*
     * Semua route kecuali aset statis:
     * - _next/static, _next/image : berkas build
     * - favicon.ico               : ikon tab
     * - berkas dengan ekstensi    : gambar, font, dsb di /public
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf)$).*)",
  ],
};
