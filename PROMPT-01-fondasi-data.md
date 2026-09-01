# Prompt 01 — Fondasi Data

Copy-paste seluruh isi di bawah garis ini ke Claude Code, di folder repo yang sudah berisi `CLAUDE.md`.

---

Baca `CLAUDE.md` di root repo ini dulu — itu konteks wajib, termasuk konvensi penamaan bahasa Indonesia dan enam aturan mati.

Ini **Langkah 1 dari 6: Fondasi Data**. Tugasnya bikin skema database dan proteksinya, belum ada UI sama sekali. Kerjakan persis daftar di bawah, jangan tambah fitur di luar itu.

## 1. Scaffold project

- Next.js 15, App Router, TypeScript, Tailwind, ESLint. Package manager npm.
- `lang="id"` di `<html>`.
- Daftarkan palet brand dari `CLAUDE.md` sebagai token Tailwind (`krem`, `cream`, `latte`, `caramel`, `mocha`, `espresso`, `daun`) dan font Poppins lewat `next/font/google`.
- `.gitignore` wajib menutup `.env.local` dan `.env*.local`.

## 2. Klien Supabase

- Pasang `@supabase/supabase-js` dan `@supabase/ssr`. **Jangan** pakai `@supabase/auth-helpers-nextjs` — sudah deprecated.
- `src/lib/supabase/client.ts` (browser) dan `src/lib/supabase/server.ts` (server component / route handler), pola resmi `@supabase/ssr`.
- `.env.example` berisi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Jangan pernah menulis nilai asli ke file mana pun.

## 3. Migration `supabase/migrations/0001_skema_awal.sql`

Jalankan `supabase init` dulu. Semua nama tabel dan kolom pakai bahasa Indonesia, `snake_case`.

Setiap tabel punya `id uuid primary key default gen_random_uuid()` dan `dibuat_pada timestamptz not null default now()`, kecuali disebut lain.

**Enum:**

- `peran`: `owner`, `barista`
- `satuan`: `gr`, `ml`, `pcs`
- `tipe_gerakan`: `masuk`, `pakai`, `waste`, `penyesuaian`
- `metode_bayar`: `tunai`, `qris`, `lainnya`
- `alasan_waste`: `tumpah`, `kadaluarsa`, `shot_gagal`, `salah_order`, `rusak`, `lainnya`

**Tabel:**

1. `profil` — `id uuid pk references auth.users(id) on delete cascade`, `nama text not null`, `peran peran not null default 'barista'`, `aktif boolean not null default true`. (Tanpa kolom id generated — id-nya dari auth.)
2. `produk` — `nama text not null unique`, `kategori text`, `harga_jual numeric(12,2)` (boleh null, diisi OWNER nanti), `aktif boolean not null default true`.
3. `bahan` — `nama text not null unique`, `satuan satuan not null`, `stok_minimum numeric(12,3) not null default 0`, `aktif boolean not null default true`.
4. `resep` — `produk_id`, `bahan_id`, `jumlah numeric(12,3) not null check (jumlah > 0)`, `unique (produk_id, bahan_id)`.
5. `harga_bahan` — `bahan_id`, `harga_satuan numeric(12,4) not null check (harga_satuan >= 0)`, `berlaku_sejak date not null default current_date`, `sumber text`. Riwayat, bukan overwrite: harga terbaru = baris dengan `berlaku_sejak` terbesar.
6. `pembelian` — `tanggal date not null`, `supplier text`, `catatan text`, `dibuat_oleh uuid references profil(id)`.
7. `pembelian_item` — `pembelian_id`, `bahan_id`, `qty numeric(12,3) not null check (qty > 0)`, `harga_satuan numeric(12,4) not null`.
8. `penjualan` — `tanggal date not null`, `waktu timestamptz`, `metode_bayar metode_bayar not null default 'lainnya'`, `total numeric(12,2) not null`, `ref_pos text not null unique`, `berkas_hash text not null`. `ref_pos` unique itu yang bikin import idempoten.
9. `penjualan_item` — `penjualan_id`, `produk_id`, `qty numeric(12,3) not null`, `harga numeric(12,2) not null`.
10. `gerakan_stok` — `bahan_id`, `tipe tipe_gerakan not null`, `qty numeric(12,3) not null` (selalu positif; arah ditentukan `tipe`), `alasan alasan_waste` (hanya diisi kalau `tipe = 'waste'`), `catatan text`, `ref_tabel text`, `ref_id uuid`, `waktu timestamptz not null default now()`, `dibuat_oleh uuid references profil(id)`. Tambahkan check: `tipe = 'waste'` wajib punya `alasan`, selain itu `alasan` harus null.
11. `opname` — `tanggal date not null`, `selesai boolean not null default false`, `dibuat_oleh uuid references profil(id)`.
12. `opname_item` — `opname_id`, `bahan_id`, `qty_fisik numeric(12,3) not null`, `qty_sistem numeric(12,3) not null`, `selisih numeric(12,3) generated always as (qty_fisik - qty_sistem) stored`, `unique (opname_id, bahan_id)`.
13. `tutup_buku` — `tanggal date not null unique`, `kas_awal numeric(12,2) not null`, `kas_fisik numeric(12,2) not null`, `sales_tunai_sistem numeric(12,2) not null`, `sales_total_sistem numeric(12,2) not null`, `selisih numeric(12,2) generated always as (kas_fisik - kas_awal - sales_tunai_sistem) stored`, `catatan text`, `dibuat_oleh uuid references profil(id)`.

**Catatan penting soal `tutup_buku`:** selisih kas dibandingkan dengan **sales tunai saja**, bukan sales total — QRIS tidak pernah masuk laci. Jangan disederhanakan.

Tambahkan index untuk semua FK dan untuk `penjualan(tanggal)`, `gerakan_stok(bahan_id, waktu)`, `harga_bahan(bahan_id, berlaku_sejak desc)`.

## 4. Migration `supabase/migrations/0002_rls.sql`

- Fungsi helper `peran_saya()` — `security definer`, `set search_path = public`, `stable`, mengembalikan `peran` dari `profil` untuk `auth.uid()`.
- `alter table ... enable row level security` di **semua** tabel. Tidak ada yang dikecualikan.
- Policy `owner`: full akses (select/insert/update/delete) ke semua tabel.
- Policy `barista`:
  - `select` pada `produk`, `bahan`, `resep`, `profil` (baris sendiri saja)
  - `insert` pada `gerakan_stok` **hanya** dengan `tipe = 'waste'`, dan `select` hanya baris yang `dibuat_oleh = auth.uid()`
  - `insert` + `select` + `update` pada `opname`, `opname_item`, `tutup_buku`
  - **Tidak ada policy sama sekali** untuk `harga_bahan`, `pembelian`, `pembelian_item`, `penjualan`, `penjualan_item`. Ini penegakan aturan mati #5 — bukan disembunyikan di UI, memang tidak bisa diakses.
- Tidak ada policy `delete` untuk barista, di tabel mana pun (aturan mati #3).
- Trigger `on auth.users insert` yang bikin baris `profil` otomatis dengan peran default `barista`.

## 5. Migration `supabase/migrations/0003_view_hpp.sql`

View `hpp_produk`: per produk, jumlahkan `resep.jumlah × harga_satuan terbaru` dari `harga_bahan`, hasilkan kolom `produk_id`, `nama`, `hpp`, `harga_jual`, `margin_rp`, `margin_persen`.

**Wajib:** view dibuat dengan `security_invoker = true`, supaya RLS penggunanya tetap berlaku. Tanpa itu barista bisa baca HPP lewat view — bocor lewat pintu belakang.

Kalau ada bahan yang belum punya harga, `hpp` untuk produk itu harus `null`, **bukan 0**. Nol itu bohong; null itu jujur.

## 6. Types

Generate types Supabase ke `src/lib/database.types.ts` dan pakai di kedua klien.

## 7. Halaman placeholder

Satu halaman `/` yang menampilkan nama app dan status koneksi Supabase. Tidak lebih. UI beneran itu langkah berikutnya.

## Batasan

- Jangan bikin UI di luar placeholder itu.
- Jangan bikin modul kasir, pembayaran, atau apa pun di luar daftar ini.
- **Jangan seed angka bisnis apa pun** — tidak ada harga, tidak ada HPP, tidak ada nama supplier. Kalau perlu contoh untuk uji, taruh di `supabase/seed.sql` terpisah, tandai `-- CONTOH, BUKAN DATA ASLI`, dan isinya cuma nama produk (`espresso`, `latte`, `es kopi susu gula aren`) tanpa harga.
- Kalau ada keputusan yang belum jelas dari dokumen ini, **berhenti dan tanya**. Jangan asumsi lalu lanjut.

## Verifikasi

1. `npx next build` — harus lolos
2. `npx tsc --noEmit` — harus bersih
3. `supabase db reset` — ketiga migration harus jalan dari nol tanpa error
4. Uji RLS: bikin dua user (owner & barista), buktikan barista **gagal** membaca `harga_bahan` dan view `hpp_produk`, dan **gagal** insert `gerakan_stok` dengan `tipe = 'pakai'`

## Laporan akhir

Tutup dengan: daftar tabel yang dibuat, ringkasan policy per peran, hasil keempat verifikasi di atas, dan daftar apa yang masih TODO atau belum bisa diverifikasi.
