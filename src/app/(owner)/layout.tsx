import type { ReactNode } from "react";

import SidebarOwner from "@/components/SidebarOwner";
import TombolKeluar from "@/components/TombolKeluar";
import { wajibPeran } from "@/lib/auth";

export default async function LayoutOwner({ children }: { children: ReactNode }) {
  // Kenyamanan navigasi, bukan pengaman. RLS yang menahan datanya.
  const profil = await wajibPeran("owner");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <SidebarOwner nama={profil.nama} />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-5 py-8 lg:px-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>

        <footer className="border-t-2 border-latte px-5 py-4 lg:px-10">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
            <p className="text-xs text-mocha">Belakang Bar &middot; alat internal s&rsquo;mugKopi</p>
            <TombolKeluar />
          </div>
        </footer>
      </div>
    </div>
  );
}
