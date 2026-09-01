/**
 * Satu-satunya sumber daftar nav untuk kedua shell.
 *
 * `langkah` = nomor langkah kapan halaman itu akan dibangun, dipakai badge
 * "Belum dibangun" di tiap stub.
 *
 * BELUM DIKONFIRMASI OWNER. Yang pasti dari PROMPT-02 cuma dua: form waste /
 * opname / tutup buku = langkah 3, dan import POS = langkah 4. Sisanya dugaan
 * berdasarkan urutan ketergantungan data (master bahan & resep harus ada
 * sebelum form apa pun bisa dipakai). Kalau OWNER punya urutan lain, ubah di
 * berkas ini saja — tidak ada nomor langkah yang ditulis di tempat lain.
 */
export type ItemNav = {
  label: string;
  href: string;
  langkah: number;
  /** Kalimat pendek di stub: apa yang belum ada dan apa yang mengisinya. */
  keterangan: string;
};

export const NAV_OWNER: ItemNav[] = [
  {
    label: "Dasbor",
    href: "/dasbor",
    langkah: 6,
    keterangan:
      "Ringkasan harian belum ada karena belum ada satu pun penjualan yang diimpor dan belum ada harga bahan yang dimasukkan.",
  },
  {
    label: "Menu & Resep",
    href: "/menu",
    langkah: 3,
    keterangan:
      "Daftar menu dan takaran per porsi. Tanpa resep, HPP tidak bisa dihitung sama sekali.",
  },
  {
    label: "Bahan",
    href: "/bahan",
    langkah: 3,
    keterangan:
      "Master bahan beserta satuan terkecil dan stok minimum. Ini yang dirujuk waste dan opname.",
  },
  {
    label: "Pembelian",
    href: "/pembelian",
    langkah: 4,
    keterangan:
      "Catatan belanja bahan. Dari sinilah harga satuan terbaru masuk, dan dari harga itulah HPP terbentuk.",
  },
  {
    label: "Penjualan",
    href: "/penjualan",
    langkah: 4,
    keterangan:
      "Import berkas export dari POS pihak ketiga, sekali sehari saat tutup. Aplikasi ini tidak menerima order sendiri.",
  },
  {
    label: "Laporan",
    href: "/laporan",
    langkah: 5,
    keterangan:
      "Laporan HPP, margin, waste, dan selisih kas. Butuh data penjualan dan harga bahan yang belum ada.",
  },
  {
    label: "Pengaturan",
    href: "/pengaturan",
    langkah: 6,
    keterangan: "Pengelolaan akun dan preferensi outlet.",
  },
];

/** Ambil satu item nav berdasarkan href. Melempar kalau salah ketik, supaya
 *  ketidakcocokan nav dan route ketahuan saat build, bukan saat dibuka. */
export function itemNav(daftar: ItemNav[], href: string): ItemNav {
  const item = daftar.find((i) => i.href === href);
  if (!item) throw new Error(`Item nav tidak ada untuk href: ${href}`);
  return item;
}

export const NAV_BARISTA: ItemNav[] = [
  {
    label: "Waste",
    href: "/bar/waste",
    langkah: 3,
    keterangan: "Catat bahan yang terbuang: tumpah, shot gagal, kedaluwarsa, salah order.",
  },
  {
    label: "Opname",
    href: "/bar/opname",
    langkah: 3,
    keterangan: "Hitung stok fisik dan bandingkan dengan angka sistem.",
  },
  {
    label: "Tutup Buku",
    href: "/bar/tutup-buku",
    langkah: 3,
    keterangan: "Hitung kas di laci saat tutup, lalu cocokkan dengan penjualan tunai.",
  },
  {
    label: "Checklist",
    href: "/bar/checklist",
    langkah: 5,
    keterangan:
      "Daftar tugas buka dan tutup bar. Belum ada tabelnya di database — perlu migration baru.",
  },
];
