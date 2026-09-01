import Link from "next/link";

import { ambilProfil } from "@/lib/auth";
import { NAV_BARISTA } from "@/lib/navigasi";

export const metadata = { title: "Bar — Belakang Bar" };

/**
 * Beranda bar: empat tombol besar, satu tangan, tanpa mencari-cari.
 * Bottom nav tetap ada di bawah untuk pindah cepat setelah masuk salah satunya.
 */
export default async function Bar() {
  const profil = await ambilProfil();

  return (
    <>
      <h1 className="text-2xl font-extrabold text-espresso">
        Halo{profil ? `, ${profil.nama.split(" ")[0]}` : ""}.
      </h1>
      <p className="mt-1 text-base text-mocha">Mau catat apa?</p>

      <ul className="mt-6 flex flex-col gap-3">
        {NAV_BARISTA.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="flex min-h-20 flex-col justify-center rounded-2xl border-2 border-latte bg-cream px-5 py-4 transition-colors hover:border-caramel"
            >
              <span className="text-xl font-extrabold text-espresso">{i.label}</span>
              <span className="mt-0.5 text-sm leading-snug text-mocha">{i.keterangan}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
