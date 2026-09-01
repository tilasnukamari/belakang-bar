import { redirect } from "next/navigation";

import { ambilProfil, berandaPeran } from "@/lib/auth";

// Sesi diperiksa per request; jangan dibekukan saat build.
export const dynamic = "force-dynamic";

/**
 * "/" tidak punya tampilan sendiri. Tugasnya cuma satu: menentukan shell mana
 * yang jadi rumah pengguna ini. Satu tempat, supaya aturan peran tidak tercecer.
 *
 * Tamu tanpa sesi sudah dicegat middleware sebelum sampai sini.
 */
export default async function Akar() {
  const profil = await ambilProfil();

  if (!profil || !profil.aktif) redirect("/keluar?alasan=nonaktif");

  redirect(berandaPeran(profil.peran));
}
