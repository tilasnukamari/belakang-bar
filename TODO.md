# TODO

Kumpulan pekerjaan yang belum kelar per akhir **langkah 2**. Bukan backlog fitur langkah 3–6 —
itu ada di `PROMPT-*.md`. Ini hal-hal yang menggantung, belum terverifikasi, atau butuh keputusan
OWNER.

Urut dari yang paling menentukan.

---

## Butuh keputusan OWNER

### 1. `tutup_buku` belum punya jalur pengisian yang sah — memblokir langkah 3

Barista boleh `insert` ke `tutup_buku`, tapi tidak punya policy apa pun ke `penjualan`. Artinya
dia tidak bisa memperoleh `sales_tunai_sistem` dan `sales_total_sistem` — padahal aturan mati #6
melarang angka turunan diketik manual.

Tiga jalan keluar, semuanya butuh restu:

- fungsi `security definer` yang mengembalikan dua angka itu untuk tanggal tertentu, tanpa
  membuka tabel `penjualan` ke barista;
- server action yang menghitungnya di server memakai service role;
- atau tutup buku memang dikerjakan OWNER, bukan barista — yang berarti mengubah pembagian peran.

Sampai ini diputuskan, form tutup buku di langkah 3 tidak bisa dibangun dengan benar.

### 2. Aturan mati #2 (tahan sinyal jelek) bertabrakan dengan arsitektur sekarang

Aturan mati #2 minta form barista simpan lokal dulu, sinkron belakangan. Yang terbangun di
langkah 2 adalah kebalikannya: middleware memanggil `getUser()` ke server Auth di **setiap**
request, dan semua halaman `force-dynamic`. WiFi mati = tidak bisa pindah halaman, apalagi
menyimpan.

Ini bukan bug langkah 2 — spec langkah 2 memang meminta middleware seperti ini. Tapi kalau
aturan #2 mau ditegakkan sungguhan, langkah 3 butuh keputusan arsitektur di depan: service
worker + antrean IndexedDB + halaman barista yang bisa dibuka offline. Menambal ini di langkah 5
akan jauh lebih mahal daripada memutuskannya sekarang. Spec langkah 2 sendiri yang meminta hal
seperti ini diangkat lebih awal.

### 3. Nomor langkah di badge "Belum dibangun" masih dugaan

`src/lib/navigasi.ts` menandai tiap stub dengan nomor langkah. Yang pasti dari `PROMPT-02` cuma
dua: form waste/opname/tutup buku = langkah 3, import POS = langkah 4. Sisanya (Bahan, Menu &
Resep, Pembelian, Laporan, Dasbor, Pengaturan, Checklist) saya tebak dari urutan ketergantungan
data. Angka itu kelihatan oleh pengguna. Semua nomor ada di satu berkas, jadi mengubahnya murah.

### 4. Checklist belum punya tabel di database

Nav barista punya item **Checklist**, dan `CLAUDE.md` menyebutnya sebagai fungsi barista. Tapi
skema langkah 1 tidak punya tabel untuk itu — tidak ada `checklist` maupun `checklist_item`.
Perlu migration baru sebelum halaman itu bisa dibangun. Langkah 1 tidak salah; item ini memang
tidak ada di daftar tabel yang diminta.

### 5. Logo — tiga hal belum beres

Logonya sudah dipakai (`/masuk`, sidebar OWNER, header BARISTA). Sisa yang butuh keputusan:

- **`logo-banner.png` tertulis "COOFEE"**, bukan "COFFEE". Typo itu ada di berkas aslinya.
  Karena itu yang dipakai cuma `logo.png`. Perlu aset banner yang diperbaiki.
- Repo website (`C:\private\risma\smugkopi`) punya `src/components/LogoSmug.tsx`, SVG garis
  32×32 pakai `currentColor` — **mark yang berbeda** dari logo ini (tidak berwajah, tanpa uap
  oranye). Dua repo sekarang memakai logo berlainan. Perlu ditentukan mana yang resmi.
- Teal (±`#1c5f63`) dan oranye (±`#d2691e`) di logo **tidak ada di palet** `CLAUDE.md`, dan
  teal-nya kontras rendah di atas `espresso` — makanya logo hanya dipasang di permukaan terang.
  Kalau logo ini yang resmi, palet perlu diperbarui di dua repo.

Catatan teknis: `smug-lockup.png` dan `smug-mark.png` adalah turunan dari `logo.png` — dipangkas,
latar kremnya dibuat transparan lewat un-matting, dikecilkan dari 1314 KB jadi 48 KB dan 16 KB.
Kalau `logo.png` diganti, dua berkas itu harus dibuat ulang.

### 6. Token `bata` belum disamakan ke repo website

`#a3402f` ditambahkan di langkah 2 karena palet asli tidak punya warna bahaya sementara tombol
hapus dan pesan gagal butuh pembeda. `CLAUDE.md` bilang palet ini sama dengan repo website —
sekarang tidak lagi.

### 7. `penyesuaian` dipaksa positif

`gerakan_stok.qty` punya `check (qty > 0)` untuk semua tipe, termasuk `penyesuaian`. Sesuai spec
langkah 1 ("selalu positif, arah ditentukan tipe"), tapi penyesuaian stok biasanya dua arah.
Kalau perlu bisa minus, `penyesuaian` harus dipecah jadi dua nilai enum.

### 8. Barista bisa membaca angka omzet lewat `tutup_buku`

`sales_tunai_sistem` dan `sales_total_sistem` terbaca barista. Sesuai spec (select `tutup_buku`
memang diberikan) dan bukan harga beli/HPP/margin, jadi tidak melanggar aturan mati #5 — tapi
tetap angka omzet.

### 9. Tutup buku lewat tengah malam

Policy update `tutup_buku` dikunci ke `tanggal = current_date`. Kalau bar tutup jam 00:30 dan
mencatat untuk tanggal kemarin, barisnya bisa dibuat tapi tidak bisa dikoreksi lagi. Kalau ini
kejadian, ubah ke `tanggal >= current_date - 1`.

---

## Operasional

### 10. Ganti kata sandi ketiga akun

Tiga akun sudah dibuat dan terverifikasi bisa masuk: **dua `owner` dan satu `barista`.**
Daftar lengkapnya ada di dashboard Supabase → Authentication; sengaja tidak ditulis di sini
karena repo ini publik.

**Kata sandi ketiganya diketikkan di percakapan chat, jadi harus dianggap sudah bocor.** Ganti
dari dashboard → Authentication → user → Reset password. Sandi akun barista juga sama persis
dengan nama akunnya, yang sudah tidak layak sejak awal.

Supabase Auth wajib email, sementara yang diberikan adalah username — jadi dipetakan ke
`<username>@smugkopi.com` (domain diambil dari repo website: `halo@smugkopi.com`). Kotak surat
itu belum tentu ada; kalau tidak, alur reset password lewat email tidak akan pernah bisa dipakai
dan penggantian sandi harus selalu lewat dashboard.

Tabel `profil` tidak punya kolom `username`; untuk sekarang username hidup sebagai bagian depan
email dan di `user_metadata`. Kalau login pakai username sungguhan diinginkan, itu butuh
migration baru plus penyesuaian di halaman `/masuk`.

Akun berikutnya dibuat lewat dashboard Supabase → Authentication → Add user; semua user baru
otomatis berperan `barista`, naikkan manual di tabel `profil` kalau perlu.

### 11. Password database cuma ada di satu tempat

Hanya di `.env.local` di mesin ini, tidak pernah ditampilkan ke layar. Kalau hilang tidak bisa
dipulihkan — harus di-reset dari dashboard. **Simpan ke password manager.**

### 12. Vercel belum disiapkan

`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` belum diisi di project settings
Vercel, dan belum pernah ada deploy. Tanpa itu halaman akan gagal di build/runtime.

### 13. Kuota free tier tinggal pas

Organisasi punya tiga project: `family-rewards` (aktif), `belakang-bar` (aktif), `SisteminAja`
(paused). Free tier = 2 project aktif per organisasi, dan yang paused tidak dihitung.
Kalau `SisteminAja` di-unpause, org lewat batas.

### 14. Node 14 masih default di mesin ini

`.nvmrc` (20.19.6) dan `engines: >=20.9` sudah dipasang, tapi terminal baru tetap membuka Node 14
sampai `nvm use` dijalankan. Next 15 tidak jalan di Node 14.

---

## Belum terverifikasi

### 15. `supabase db reset` belum pernah dijalankan

Butuh Docker Desktop, belum terpasang. Yang sudah terbukti: ketiga migration jalan dari nol di
PostgreSQL bersih, dan sudah diterapkan ke project Supabase asli lewat `db push`. Yang belum
terbukti: alur reset lokal berikut `seed.sql`.

### 16. Skrip uji tidak tersimpan di repo

Uji RLS (37 assertion lewat PostgREST + JWT asli), uji proteksi route (27 assertion terhadap app
yang benar-benar jalan), dan pengukuran 375px lewat Chrome CDP semuanya ditulis di direktori
sementara dan akan hilang. Tidak ada satu pun test otomatis di repo, jadi tidak ada yang menahan
regresi di langkah 3–6. Skripnya masih bisa dipindahkan ke `scripts/` kalau diinginkan.

### 17. Belum diuji di HP beneran

Pengukuran 375px dilakukan lewat Chrome headless dengan emulasi perangkat, bukan HP fisik.
Yang belum teruji: keyboard virtual menutupi kolom input, perilaku `env(safe-area-inset-bottom)`
di iPhone berponi, dan ketepatan sentuh jempol sungguhan.

### 18. Kunci API legacy vs baru

Project ini punya keduanya: `anon`/`service_role` (JWT lama) dan pasangan
publishable/secret yang baru. Aplikasi memakai anon JWT sesuai spec langkah 1. Supabase sedang
memigrasikan ke kunci baru; suatu saat perlu diputuskan kapan pindah.

---

## Kecil

### 19. Belum ada halaman 404 dan error kustom

`not-found.tsx` dan `error.tsx` masih bawaan Next, jadi keluar dari nuansa kedua shell.

### 20. Belum ada alur lupa kata sandi

Disengaja: akun dikelola OWNER lewat dashboard. Pesan error di `/masuk` sudah mengarahkan ke sana.
Kalau nanti dianggap merepotkan, baru dipertimbangkan.
