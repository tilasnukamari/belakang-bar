"use server";

import { redirect } from "next/navigation";

import { berandaPeran } from "@/lib/auth";
import { buatKlienServer } from "@/lib/supabase/server";

export type HasilMasuk = { pesan: string } | null;

/**
 * Pesan error harus menyebut apa yang salah DAN apa yang harus dilakukan.
 * "Terjadi kesalahan" tidak menolong siapa pun yang sedang berdiri di bar.
 */
function terjemahkan(kode: string | undefined, pesanAsli: string): string {
  switch (kode) {
    case "invalid_credentials":
      return "Email atau kata sandi tidak cocok. Periksa lagi; kalau lupa, minta OWNER mengatur ulang dari dashboard Supabase.";
    case "email_not_confirmed":
      return "Email ini belum dikonfirmasi. Minta OWNER menandainya terkonfirmasi di dashboard Supabase.";
    case "over_request_rate_limit":
      return "Terlalu banyak percobaan. Tunggu satu menit, lalu coba lagi.";
    case "user_banned":
      return "Akun ini sedang diblokir. Hubungi OWNER.";
    default:
      return `Gagal masuk: ${pesanAsli}`;
  }
}

export async function masuk(_sebelumnya: HasilMasuk, data: FormData): Promise<HasilMasuk> {
  const email = String(data.get("email") ?? "").trim();
  const sandi = String(data.get("sandi") ?? "");

  if (!email || !sandi) {
    return { pesan: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await buatKlienServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password: sandi });

  if (error) {
    return { pesan: terjemahkan(error.code, error.message) };
  }

  // Peran dibaca setelah sesi ada, supaya tahu harus mendarat di shell mana.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profil } = user
    ? await supabase.from("profil").select("peran, aktif").eq("id", user.id).maybeSingle()
    : { data: null };

  if (!profil || !profil.aktif) {
    redirect("/keluar?alasan=nonaktif");
  }

  redirect(berandaPeran(profil.peran));
}

export async function keluar(): Promise<void> {
  const supabase = await buatKlienServer();
  await supabase.auth.signOut();
  redirect("/masuk");
}
