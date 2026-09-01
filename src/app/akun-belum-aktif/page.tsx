import Link from "next/link";

import Peringatan from "@/components/Peringatan";

export const metadata = { title: "Akun belum aktif — Belakang Bar" };

/**
 * Hanya dicapai lewat /keluar?alasan=nonaktif, jadi sesi pengunjung halaman ini
 * sudah dihapus sebelum dia sampai di sini.
 */
export default function AkunBelumAktif() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-5 py-12">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-mocha">
          s&rsquo;mugKopi
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-espresso">Akun belum aktif</h1>
      </header>

      <Peringatan nada="gagal" judul="Sesi sudah dikeluarkan">
        Email dan kata sandinya benar, tapi akun ini belum terdaftar sebagai pengguna Belakang Bar
        — atau sudah dinonaktifkan.
      </Peringatan>

      <div className="text-sm leading-relaxed text-mocha">
        <p className="font-semibold text-espresso">Yang harus dilakukan OWNER:</p>
        <ol className="mt-2 ml-4 list-decimal space-y-1">
          <li>
            Buka tabel <code className="rounded bg-cream px-1">profil</code> di dashboard Supabase.
          </li>
          <li>
            Pastikan ada baris dengan <code className="rounded bg-cream px-1">id</code> yang sama
            dengan id user di Authentication.
          </li>
          <li>
            Pastikan <code className="rounded bg-cream px-1">aktif</code> bernilai true, dan{" "}
            <code className="rounded bg-cream px-1">peran</code> sudah benar.
          </li>
        </ol>
      </div>

      <Link
        href="/masuk"
        className="flex min-h-sentuh items-center justify-center rounded-xl border-2 border-latte bg-cream px-5 text-base font-semibold text-espresso hover:bg-latte"
      >
        Kembali ke halaman masuk
      </Link>
    </main>
  );
}
