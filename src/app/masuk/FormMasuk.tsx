"use client";

import { useActionState } from "react";

import Kolom from "@/components/Kolom";
import Peringatan from "@/components/Peringatan";
import Tombol from "@/components/Tombol";
import { masuk, type HasilMasuk } from "@/lib/aksi-auth";

export default function FormMasuk() {
  const [hasil, kirim, sedangKirim] = useActionState<HasilMasuk, FormData>(masuk, null);

  return (
    <form action={kirim} className="flex flex-col gap-5" noValidate>
      {hasil?.pesan && (
        <Peringatan nada="gagal" judul="Tidak bisa masuk">
          {hasil.pesan}
        </Peringatan>
      )}

      <Kolom
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="username"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        required
      />

      <Kolom
        id="sandi"
        name="sandi"
        type="password"
        label="Kata sandi"
        autoComplete="current-password"
        required
      />

      <Tombol type="submit" memuat={sedangKirim} lebarPenuh>
        {sedangKirim ? "Sedang masuk…" : "Masuk"}
      </Tombol>
    </form>
  );
}
