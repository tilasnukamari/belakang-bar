import { LockupSmug } from "@/components/LogoSmug";

import FormMasuk from "./FormMasuk";

export const metadata = { title: "Masuk — Belakang Bar" };

// Sesi diperiksa per request oleh middleware; halaman ini jangan dibekukan.
export const dynamic = "force-dynamic";

export default function Masuk() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-8 px-5 py-12">
      <header>
        <LockupSmug lebar={132} className="mb-6" />
        <h1 className="text-3xl font-extrabold text-espresso">Belakang Bar</h1>
        <p className="mt-2 text-base leading-relaxed text-mocha">
          Alat internal. Masuk dengan akun yang dibuatkan OWNER.
        </p>
      </header>

      <FormMasuk />

      {/* Tidak ada tautan "daftar". App dua orang, bukan SaaS. */}
      <p className="text-sm leading-relaxed text-mocha">
        Belum punya akun? Akun dibuat OWNER lewat dashboard Supabase — tidak ada pendaftaran
        mandiri di sini.
      </p>
    </main>
  );
}
