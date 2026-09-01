# Belakang Bar

Aplikasi management internal **s'mugKopi** — coffee shop satu outlet, berbasis mesin espresso.
HPP per menu, stok & opname, log waste, tutup buku harian, dashboard OWNER.

Penggunanya dua orang saja: **OWNER** (laptop & HP) dan **BARISTA** (HP, sambil berdiri di bar).

> **Ini bukan kasir/POS.** Tidak menerima order, tidak cetak struk, tidak memproses pembayaran.
> Data penjualan masuk lewat import berkas export dari POS pihak ketiga, sekali sehari saat tutup.
> Permintaan fitur yang mengarah ke kasir, pembayaran, printer struk, atau integrasi delivery
> ada di luar scope yang sudah dikunci — tanya OWNER dulu.

Konteks lengkap dan enam aturan mati ada di [`CLAUDE.md`](CLAUDE.md). Baca itu sebelum menyentuh kode.
Daftar pekerjaan yang belum kelar ada di [`TODO.md`](TODO.md).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Supabase (Postgres + Auth + RLS) · deploy ke Vercel.

## Jalanin di lokal

Butuh **Node ≥ 20.9** (lihat `.nvmrc`) dan npm.

```bash
nvm use            # mesin ini default-nya Node 14, Next 15 tidak jalan di situ
npm install
cp .env.example .env.local   # lalu isi dari dashboard Supabase
npm run dev
```

`.env.local` ditutup `.gitignore` dan tidak boleh masuk repo dengan cara apa pun.

| Variabel | Isi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key dari Project Settings → API |

Keduanya berawalan `NEXT_PUBLIC_` dan memang ikut terkirim ke browser. Itu bukan kebocoran:
yang menahan data adalah RLS di database, dan role `anon` sengaja dicabut seluruh grant-nya
di migration `0002`, jadi kunci itu sendiri tidak membuka apa pun tanpa sesi yang sah.

## Database

Project Supabase: **`belakang-bar`**, region `ap-southeast-1`, Postgres 17.

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npm run db:push        # kirim migration ke project yang ter-link
npm run types:gen      # regenerate src/lib/database.types.ts
```

`supabase db reset` (jalan dari nol di lokal, termasuk `seed.sql`) butuh Docker Desktop.

### Migration

| Berkas | Isi |
|---|---|
| `0001_skema_awal.sql` | 5 enum, 13 tabel, 14 index |
| `0002_rls.sql` | `peran_saya()`, RLS di 13/13 tabel, 28 policy, trigger profil otomatis |
| `0003_view_hpp.sql` | View `hpp_produk` dengan `security_invoker = true` |

`0002` dan `0003` masing-masing punya guard yang **menggagalkan migration** kalau ada tabel
`public` tanpa RLS, atau kalau `security_invoker` lepas dari view HPP. Jangan dilucuti.

`supabase/seed.sql` hanya untuk lokal, isinya tiga nama produk tanpa satu pun angka.
Jangan pernah dijalankan ke produksi dan jangan dipindahkan ke `migrations/`.

## Peran & akses

Ditegakkan di RLS, bukan disembunyikan di UI.

| Tabel | owner | barista |
|---|---|---|
| `produk`, `bahan`, `resep` | penuh | `select` |
| `profil` | penuh | `select` baris sendiri |
| `gerakan_stok` | penuh | `insert` hanya `tipe='waste'` dan `dibuat_oleh = auth.uid()`; `select` baris sendiri |
| `opname`, `opname_item` | penuh | `select` · `insert` · `update` selama `selesai = false` |
| `tutup_buku` | penuh | `select` · `insert` · `update` hanya tanggal hari ini |
| `harga_bahan`, `pembelian`, `pembelian_item`, `penjualan`, `penjualan_item` | penuh | **tidak ada policy sama sekali** |

Barista tidak punya policy `delete` di tabel mana pun — koreksi lewat entri pembalik, bukan hapus.

**Akun dibuat OWNER lewat dashboard Supabase.** Tidak ada pendaftaran mandiri. User baru otomatis
dapat baris `profil` dengan peran `barista`; menaikkannya jadi `owner` adalah tindakan manual.
User yang tidak punya baris `profil` atau `aktif = false` akan dikeluarkan sesinya dan diarahkan
ke `/akun-belum-aktif`.

## Route

Middleware menyegarkan sesi di tiap request dan menendang tamu ke `/masuk`. **Middleware bukan
pengaman** — RLS yang pengaman. Middleware cuma supaya orang tidak mendarat di layar yang tidak
bisa dia pakai.

| Publik | |
|---|---|
| `/masuk` | login email + password |
| `/akun-belum-aktif` | akun tanpa profil atau nonaktif |
| `/keluar` | route handler yang mengakhiri sesi |

| Shell OWNER (`(owner)`, sidebar) | Shell BARISTA (`(barista)`, bottom nav) |
|---|---|
| `/dasbor` `/menu` `/bahan` `/pembelian` `/penjualan` `/laporan` `/pengaturan` | `/bar` `/bar/waste` `/bar/opname` `/bar/tutup-buku` `/bar/checklist` |

`/` tidak punya tampilan; tugasnya menentukan shell berdasarkan `profil.peran`.

Semua halaman di kedua shell masih **stub**. Nomor langkah di badge "Belum dibangun" diambil dari
`src/lib/navigasi.ts` — satu-satunya tempat nomor itu ditulis.

## Struktur

```
src/
  app/
    (owner)/       shell desktop, sidebar, layout mengecek peran di server
    (barista)/     shell mobile, bottom nav, target sentuh >= 44px
    masuk/         login
    keluar/        route handler sign-out
  components/      Tombol, Kolom, Peringatan, KeadaanKosong, nav, logo
  lib/
    auth.ts        ambilProfil(), wajibPeran()
    aksi-auth.ts   server action masuk & keluar
    navigasi.ts    sumber tunggal daftar nav + nomor langkah
    supabase/      klien browser, server, middleware
supabase/
  migrations/      0001..0003
  seed.sql         CONTOH, bukan data asli
```

## Konvensi

Domain pakai bahasa Indonesia — tabel, kolom, route, komponen (`bahan`, `gerakan_stok`,
`KartuBahan.tsx`). Istilah teknis framework tetap Inggris (`page.tsx`, `useEffect`).
Tabel & kolom `snake_case`, komponen React `PascalCase`. Satu konsep = satu nama, di DB dan di UI.

Palet dan font ada di `CLAUDE.md` dan terdaftar sebagai token Tailwind di `src/app/globals.css`.
Satu token tambahan di luar palet asli: **`bata` `#a3402f`** untuk tombol bahaya dan pesan gagal —
disetujui OWNER di langkah 2, dan masih perlu disamakan ke repo website.

## Perintah

| | |
|---|---|
| `npm run dev` | server pengembangan |
| `npm run build` | build produksi |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:push` | kirim migration ke project ter-link |
| `npm run db:reset` | reset database lokal (butuh Docker) |
| `npm run types:gen` | regenerate tipe dari database |

## Sebelum bilang selesai

Aturan repo: `npx next build` lolos, `npx tsc --noEmit` bersih, migration baru bisa jalan dari nol,
dan **sebutkan eksplisit apa yang belum diverifikasi.** Jangan mengarang angka bisnis — harga bahan,
harga jual, HPP, omzet, jumlah cup, nama supplier semuanya milik OWNER. Kalau sebuah fitur butuh
angka yang belum ada, laporkan sebagai UNKNOWN.

## Status

| Langkah | | |
|---|---|---|
| 1 | Fondasi data — skema, RLS, view HPP | selesai |
| 2 | Auth & shell dua persona | selesai |
| 3 | Form waste, opname, tutup buku | belum |
| 4 | Import POS & pembelian | belum |
| 5 | Laporan | belum |
| 6 | Dasbor & pengaturan | belum |

Pembagian langkah 3–6 di tabel ini masih dugaan; lihat [`TODO.md`](TODO.md).
