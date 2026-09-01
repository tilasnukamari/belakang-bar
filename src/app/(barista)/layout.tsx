import type { ReactNode } from "react";

import { MarkSmug } from "@/components/LogoSmug";
import NavBarista from "@/components/NavBarista";
import TombolKeluar from "@/components/TombolKeluar";
import { wajibPeran } from "@/lib/auth";

export default async function LayoutBarista({ children }: { children: ReactNode }) {
  const profil = await wajibPeran("barista");

  return (
    // pb-28: ruang untuk bottom nav yang fixed, supaya isi terakhir tidak tertutup.
    <div className="min-h-screen pb-28">
      <header className="border-b-2 border-latte bg-cream px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <MarkSmug ukuran={32} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-mocha">
                s&rsquo;mugKopi
              </p>
              <p className="truncate text-lg font-extrabold leading-tight text-espresso">
                {profil.nama}
              </p>
            </div>
          </div>
          <TombolKeluar />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>

      <NavBarista />
    </div>
  );
}
