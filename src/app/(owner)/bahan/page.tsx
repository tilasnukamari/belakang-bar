import KeadaanKosong from "@/components/KeadaanKosong";
import { NAV_OWNER, itemNav } from "@/lib/navigasi";

const item = itemNav(NAV_OWNER, "/bahan");

export const metadata = { title: `${item.label} — Belakang Bar` };

export default function Halaman() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-espresso lg:text-3xl">{item.label}</h1>
      <div className="mt-6">
        <KeadaanKosong judul="Halaman ini belum dibangun" langkah={item.langkah}>
          {item.keterangan}
        </KeadaanKosong>
      </div>
    </>
  );
}
