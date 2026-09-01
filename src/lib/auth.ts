import { redirect } from "next/navigation";

import type { Database } from "@/lib/database.types";
import { buatKlienServer } from "@/lib/supabase/server";

export type Peran = Database["public"]["Enums"]["peran"];

export type ProfilSaya = {
  id: string;
  nama: string;
  peran: Peran;
  aktif: boolean;
};

/** Beranda masing-masing peran. Satu tempat, supaya tidak tersebar. */
export function berandaPeran(peran: Peran): string {
  return peran === "owner" ? "/dasbor" : "/bar";
}

/**
 * Profil pengguna yang sedang login, atau null kalau tidak ada sesi / tidak ada
 * barisnya di `profil`. Barisnya dibaca lewat RLS biasa: barista hanya bisa
 * melihat barisnya sendiri, jadi ini aman dipanggil dari mana saja.
 */
export async function ambilProfil(): Promise<ProfilSaya | null> {
  const supabase = await buatKlienServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profil")
    .select("id, nama, peran, aktif")
    .eq("id", user.id)
    .maybeSingle();

  return data ?? null;
}

/**
 * Dipakai layout tiap shell. Mengembalikan profil kalau perannya cocok,
 * kalau tidak melempar redirect.
 *
 * Ini kenyamanan navigasi, bukan pengaman — RLS yang menahan datanya.
 */
export async function wajibPeran(peran: Peran): Promise<ProfilSaya> {
  const profil = await ambilProfil();

  // Login berhasil tapi tidak punya baris profil, atau sudah dinonaktifkan:
  // sesinya dibuang, bukan sekadar dialihkan.
  if (!profil || !profil.aktif) redirect("/keluar?alasan=nonaktif");

  if (profil.peran !== peran) redirect(berandaPeran(profil.peran));

  return profil;
}
