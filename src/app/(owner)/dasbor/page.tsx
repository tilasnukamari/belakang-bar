import KeadaanKosong from "@/components/KeadaanKosong";
import { NAV_OWNER, itemNav } from "@/lib/navigasi";

const item = itemNav(NAV_OWNER, "/dasbor");

export const metadata = { title: "Dasbor — Belakang Bar" };

/**
 * Sengaja tanpa kartu KPI, tanpa grafik, tanpa satu pun angka.
 * Angka bohong di layar lebih berbahaya daripada layar kosong: sekali ada yang
 * screenshot, angka karangan itu jadi kelihatan seperti kenyataan.
 */
export default function Dasbor() {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-espresso lg:text-3xl">Dasbor</h1>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-mocha">
        Belum ada data untuk ditampilkan.
      </p>

      <div className="mt-6">
        <KeadaanKosong judul="Apa yang harus diisi lebih dulu" langkah={item.langkah}>
          <ol className="ml-4 list-decimal space-y-1">
            <li>Bahan beserta satuan terkecilnya, di halaman Bahan.</li>
            <li>Resep tiap menu, di halaman Menu &amp; Resep.</li>
            <li>Harga bahan lewat pencatatan Pembelian — tanpa harga, HPP tetap kosong.</li>
            <li>Penjualan harian, lewat import berkas dari POS.</li>
          </ol>
        </KeadaanKosong>
      </div>
    </>
  );
}
