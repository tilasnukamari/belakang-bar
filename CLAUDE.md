# Belakang Bar — Aplikasi Management Internal s'mugKopi

Konteks wajib untuk semua sesi Claude Code di repo ini. Baca sebelum mulai kerja.

## Apa ini

Aplikasi internal s'mugKopi — coffee shop satu outlet, berbasis mesin espresso.
Fungsinya: HPP per menu, stok & opname, log waste, tutup buku harian, dashboard OWNER.

Pengguna cuma dua:

- **OWNER** — laptop & HP. Dashboard, HPP, laporan, purchasing.
- **BARISTA** — HP, sambil berdiri di bar. Waste, opname, checklist, tutup buku.

## Apa ini BUKAN

**Bukan kasir/POS.** Tidak menerima order, tidak cetak struk, tidak memproses pembayaran.
Data penjualan MASUK ke app ini lewat import file export dari POS pihak ketiga, sekali sehari saat tutup.

Kalau ada permintaan fitur yang mengarah ke kasir, pembayaran, printer struk, atau integrasi
delivery — **berhenti dan tanya OWNER dulu.** Itu di luar scope yang sudah dikunci.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- Supabase — Postgres + Auth + RLS
- Deploy: Vercel
- Repo tetangga (TERPISAH, jangan digabung): website marketing s'mugKopi, Next 15 juga

## Konvensi penamaan

Domain pakai **bahasa Indonesia** — nama tabel, kolom, route, dan komponen: `bahan`,
`gerakan_stok`, `tutup_buku`, `KartuBahan.tsx`. Istilah teknis framework tetap Inggris
(`page.tsx`, `layout.tsx`, `useEffect`). Ini konsisten dengan repo website s'mugKopi yang
sudah pakai `PerjalananKopi.tsx`, `lib/animasi.ts`.

- Tabel & kolom: `snake_case`
- Komponen React: `PascalCase`, bahasa Indonesia
- Jangan campur: satu konsep = satu nama, di DB dan di UI

## Brand

Palet resmi (sudah dikonfirmasi OWNER, sama dengan repo website):

| token | hex | pakai untuk |
|---|---|---|
| krem | `#fbf7f1` | latar utama |
| cream | `#f7f0e6` | latar sekunder |
| latte | `#e6d3b8` | aksen terang, garis |
| caramel | `#c68a4b` | aksen utama / CTA |
| mocha | `#7a5138` | aksen gelap sekunder |
| espresso | `#2a1c14` | teks utama |
| daun | `#4a6b4f` | TERBATAS — khusus cerita kopi lokal, jangan jadi warna utama |

Font: **Poppins** (400/500/600/700/800).

Tapi ingat ini app internal, bukan halaman marketing: kontras lebih tegas, tombol lebih besar,
target sentuh minimal 44px. Palet-nya sama, tapi perlakuannya alat kerja — bukan etalase.

## Enam aturan mati

Jangan dilanggar tanpa persetujuan OWNER.

1. **Sepuluh detik.** Setiap input barista harus selesai di bawah 10 detik dengan satu tangan.
   Batas desain, bukan aspirasi.
2. **Tahan sinyal jelek.** Form barista simpan lokal dulu, sinkron belakangan. Bar tidak berhenti
   karena WiFi ngadat.
3. **Tidak ada hard delete.** Koreksi lewat entri pembalik, bukan `DELETE`. Riwayat adalah barang bukti.
4. **Satuan terkecil.** Semua bahan disimpan dalam gram, mililiter, atau pcs. "1 liter" cuma urusan tampilan.
5. **Barista tidak melihat harga beli, HPP, atau margin.** Ditegakkan di RLS Supabase, bukan
   disembunyikan di UI.
6. **Angka turunan tidak pernah diketik.** HPP, pemakaian teoritis, margin — selalu dihitung.
   Kalau ada kolom yang bisa diketik manual, cepat atau lambat isinya akan salah.

## Aturan data

**JANGAN PERNAH mengarang angka bisnis.** Harga bahan, harga jual, HPP, omzet, jumlah cup,
nama supplier — semua itu milik OWNER dan belum diberikan.

Kalau butuh contoh untuk uji coba: tandai eksplisit `-- CONTOH, BUKAN DATA ASLI`, taruh di file
seed terpisah, dan jangan pernah masukkan ke migration. Preseden dari repo website: di sana ada
gerbang `siapPublik` yang mengunci semua data placeholder supaya tidak pernah ikut ter-deploy.

Kalau sebuah fitur butuh angka yang belum ada, **lapor sebagai UNKNOWN** — jangan isi tebakan.

## Verifikasi wajib sebelum bilang selesai

- `npx next build` lolos
- `npx tsc --noEmit` bersih
- Migration baru bisa jalan dari nol (`supabase db reset`)
- Sebutkan secara eksplisit apa yang **belum** diverifikasi

## Peran & akses

- `owner` — akses penuh. Satu-satunya yang boleh baca harga beli, HPP, dan margin.
- `barista` — insert waste, opname, tutup buku, checklist. Baca master bahan & menu.
  Tidak punya policy sama sekali ke tabel harga & pembelian, jadi bukan sekadar disembunyikan —
  memang tidak bisa diakses.

## Definition of done

Tiap task ditutup dengan: apa yang dibangun, file yang disentuh, hasil verifikasi, dan daftar
apa yang masih placeholder atau TODO. Jangan bilang selesai kalau ada yang belum diverifikasi —
sebut saja mana yang belum.
