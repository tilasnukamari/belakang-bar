# Prompt 02 — Auth & Shell Dua Persona

Copy-paste seluruh isi di bawah garis ini ke Claude Code, di root repo `belakang-bar`.

Prasyarat: langkah 1 selesai (13 tabel, RLS, view `hpp_produk`), dan perubahan yang belum di-commit sudah dibereskan dulu supaya diff langkah ini bersih.

---

Baca `CLAUDE.md` di root repo ini dulu — konteks wajib, termasuk enam aturan mati dan larangan mengarang angka bisnis.

Ini **Langkah 2 dari 6: Auth & Shell Dua Persona**. Skema database dan RLS sudah ada dari langkah 1 — jangan diubah kecuali memang ada bug. Tugas kali ini: bikin orang bisa masuk, dan bikin dua kerangka UI yang beda karakter. Belum ada fitur isi apa pun.

## Prinsip yang menentukan semua keputusan di bawah

**Middleware bukan pengaman.** RLS di database itu pengaman sebenarnya. Middleware dan pengecekan peran di UI cuma supaya orang tidak melihat menu yang tidak bisa dia pakai. Jangan pernah menulis kode yang mengandalkan pengecekan di sisi client untuk melindungi data.

**Dua persona itu beda alat, bukan beda tema warna.** OWNER duduk, membaca angka, pakai layar lebar. BARISTA berdiri, satu tangan, layar HP, sering buru-buru. Kalau kedua shell-nya keluar mirip, berarti salah.

## 1. Auth

- Login email + password lewat Supabase Auth. Belum perlu magic link, OAuth, atau daftar mandiri — akun dibuat OWNER lewat dashboard Supabase.
- **Tidak ada halaman registrasi publik.** Ini app internal untuk dua orang, bukan SaaS.
- `src/middleware.ts` pakai pola resmi `@supabase/ssr` untuk refresh session di setiap request. Semua route diproteksi kecuali `/masuk` dan aset statis.
- Halaman `/masuk`: satu form, mobile-first, tombol besar. Pesan error harus menjelaskan apa yang salah dan apa yang harus dilakukan — jangan cuma "terjadi kesalahan".
- Aksi keluar (server action), tersedia di kedua shell.
- Setelah login, arahkan berdasarkan `profil.peran`: `owner` → `/dasbor`, `barista` → `/bar`.
- Kalau user berhasil login tapi barisnya tidak ada di `profil` atau `aktif = false`: tampilkan halaman jelas "akun belum aktif, hubungi OWNER", lalu keluarkan sesinya. Jangan biarkan dia masuk ke shell mana pun.

## 2. Struktur route

Pakai route group: `src/app/(owner)/...` dan `src/app/(barista)/...`, masing-masing punya `layout.tsx` sendiri yang mengecek peran di server dan `redirect()` kalau salah tempat.

**Shell OWNER** (`/dasbor`, desktop-first, sidebar):

- Dasbor
- Menu & Resep
- Bahan
- Pembelian
- Penjualan
- Laporan
- Pengaturan

**Shell BARISTA** (`/bar`, mobile-first, bottom nav, maksimal 4 item):

- Waste
- Opname
- Tutup Buku
- Checklist

Semua halaman itu **stub**. Isinya cuma judul halaman dan satu badge jelas bertuliskan "Belum dibangun" plus nomor langkah kapan dia akan dibangun. Nav item yang belum ada halamannya jangan dibuat jadi link mati.

## 3. Yang TIDAK boleh dilakukan di dasbor

Dasbor OWNER itu stub, jadi isinya **satu kalimat yang menyatakan belum ada data**.

**Jangan bikin kartu KPI berisi angka contoh. Jangan bikin grafik dengan data dummy. Jangan tulis "Rp 4.250.000" atau "127 cup" sebagai placeholder.** Angka bohong di layar itu lebih berbahaya daripada layar kosong — sekali ada yang screenshot, angka karangan itu jadi kelihatan seperti kenyataan.

Kalau sebuah komponen butuh data yang belum ada, tampilkan keadaan kosong yang jujur: apa yang belum ada, dan apa yang harus diisi supaya terisi.

## 4. Komponen dasar

Bikin seperlunya saja, di `src/components/`, nama Indonesia PascalCase:

- `Tombol.tsx` — varian utama/sekunder/bahaya, ada keadaan memuat dan nonaktif
- `Kolom.tsx` — input berlabel, pesan error terhubung `aria-describedby`
- `Peringatan.tsx` — pesan sukses/gagal/info
- `KeadaanKosong.tsx` — dipakai semua stub di atas

Aturan tampilan:

- Palet dan font dari `CLAUDE.md`. Ini alat kerja, bukan halaman marketing: kontras lebih tegas dari website.
- **Target sentuh minimal 44×44px di seluruh shell barista.** Ini aturan mati #1 dalam bentuk fisik — tombol kecil membuat input 10 detik jadi 30 detik.
- Fokus keyboard harus kelihatan di semua elemen interaktif.
- Hormati `prefers-reduced-motion`.

## 5. Batasan

- Jangan bangun form waste, opname, atau tutup buku. Itu langkah 3.
- Jangan bikin modul import POS. Itu langkah 4.
- Jangan pasang library UI (shadcn, MUI, dsb) tanpa tanya dulu — empat komponen di atas tidak butuh dependency baru.
- Jangan ubah migration langkah 1 kecuali menemukan bug; kalau ada, laporkan dulu sebelum mengubah.
- Kalau ada keputusan yang belum jelas, **berhenti dan tanya.** Jangan asumsi lalu lanjut.

## 6. Verifikasi

1. `npx next build` lolos
2. `npx tsc --noEmit` bersih
3. Uji peran dengan dua akun beneran (owner & barista):
   - barista membuka `/dasbor` → dialihkan, bukan diberi halaman kosong
   - owner membuka `/bar` → dialihkan
   - belum login membuka route mana pun → dialihkan ke `/masuk`
   - user yang tidak punya baris `profil` → halaman "akun belum aktif", sesi dikeluarkan
4. Buka shell barista di lebar 375px, pastikan tidak ada scroll horizontal dan semua target sentuh ≥ 44px

## 7. Laporan akhir

Tutup dengan: daftar route yang dibuat, hasil keempat verifikasi di atas, daftar halaman yang masih stub, dan apa yang belum bisa diverifikasi. Sebutkan juga kalau ada aturan mati yang menurut lu mulai bertabrakan dengan implementasi — lebih baik dibahas sekarang daripada ditambal di langkah 5.
