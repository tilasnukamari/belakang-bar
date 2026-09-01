import { keluar } from "@/lib/aksi-auth";

import Tombol from "./Tombol";

/** Keluar lewat server action (POST) — bukan link, supaya prefetch tidak
 *  diam-diam mengakhiri sesi orang. */
export default function TombolKeluar({ lebarPenuh = false }: { lebarPenuh?: boolean }) {
  return (
    <form action={keluar}>
      <Tombol type="submit" varian="sekunder" lebarPenuh={lebarPenuh}>
        Keluar
      </Tombol>
    </form>
  );
}
