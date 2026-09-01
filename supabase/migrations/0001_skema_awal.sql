-- 0001_skema_awal.sql -- Belakang Bar (s'mugKopi)
-- Skema inti: master bahan/produk/resep, harga, pembelian, penjualan (import POS),
-- gerakan stok, opname, tutup buku.
--
-- Aturan mati yang tercermin di sini:
--   #3 Tidak ada hard delete   -> FK ke master pakai `on delete restrict`.
--   #4 Satuan terkecil         -> semua qty dalam gr / ml / pcs (enum `satuan`).
--   #6 Angka turunan dihitung  -> `selisih` di opname_item & tutup_buku adalah
--                                 generated column, tidak bisa diketik manual.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------- enum

create type peran as enum ('owner', 'barista');
create type satuan as enum ('gr', 'ml', 'pcs');
create type tipe_gerakan as enum ('masuk', 'pakai', 'waste', 'penyesuaian');
create type metode_bayar as enum ('tunai', 'qris', 'lainnya');
create type alasan_waste as enum (
  'tumpah', 'kadaluarsa', 'shot_gagal', 'salah_order', 'rusak', 'lainnya'
);

-- ---------------------------------------------------------------- master

-- Id berasal dari auth.users, bukan generated.
create table profil (
  id          uuid primary key references auth.users (id) on delete cascade,
  nama        text not null,
  peran       peran not null default 'barista',
  aktif       boolean not null default true,
  dibuat_pada timestamptz not null default now()
);

create table produk (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null unique,
  kategori    text,
  -- Boleh null: harga jual diisi OWNER, tidak pernah ditebak.
  harga_jual  numeric(12, 2),
  aktif       boolean not null default true,
  dibuat_pada timestamptz not null default now()
);

create table bahan (
  id           uuid primary key default gen_random_uuid(),
  nama         text not null unique,
  satuan       satuan not null,
  stok_minimum numeric(12, 3) not null default 0,
  aktif        boolean not null default true,
  dibuat_pada  timestamptz not null default now()
);

create table resep (
  id          uuid primary key default gen_random_uuid(),
  produk_id   uuid not null references produk (id) on delete cascade,
  bahan_id    uuid not null references bahan (id) on delete restrict,
  jumlah      numeric(12, 3) not null check (jumlah > 0),
  dibuat_pada timestamptz not null default now(),
  unique (produk_id, bahan_id)
);

comment on column resep.jumlah is
  'Pemakaian per satu porsi produk, dalam satuan terkecil bahan (gr/ml/pcs).';

-- ---------------------------------------------------------------- harga & pembelian
-- Tabel di blok ini TIDAK diberi policy barista sama sekali (aturan mati #5).

-- Riwayat, bukan overwrite. Harga berlaku = baris dengan berlaku_sejak terbesar.
create table harga_bahan (
  id            uuid primary key default gen_random_uuid(),
  bahan_id      uuid not null references bahan (id) on delete restrict,
  harga_satuan  numeric(12, 4) not null check (harga_satuan >= 0),
  berlaku_sejak date not null default current_date,
  sumber        text,
  dibuat_pada   timestamptz not null default now()
);

create table pembelian (
  id          uuid primary key default gen_random_uuid(),
  tanggal     date not null,
  supplier    text,
  catatan     text,
  dibuat_oleh uuid references profil (id),
  dibuat_pada timestamptz not null default now()
);

create table pembelian_item (
  id           uuid primary key default gen_random_uuid(),
  pembelian_id uuid not null references pembelian (id) on delete cascade,
  bahan_id     uuid not null references bahan (id) on delete restrict,
  qty          numeric(12, 3) not null check (qty > 0),
  harga_satuan numeric(12, 4) not null check (harga_satuan >= 0),
  dibuat_pada  timestamptz not null default now()
);

-- ---------------------------------------------------------------- penjualan (import POS)

-- Bukan kasir: baris di sini hanya masuk lewat import file export POS pihak ketiga.
-- `ref_pos` unique = kunci idempotensi; import ulang file yang sama tidak menduplikasi.
create table penjualan (
  id           uuid primary key default gen_random_uuid(),
  tanggal      date not null,
  waktu        timestamptz,
  metode_bayar metode_bayar not null default 'lainnya',
  total        numeric(12, 2) not null,
  ref_pos      text not null unique,
  berkas_hash  text not null,
  dibuat_pada  timestamptz not null default now()
);

create table penjualan_item (
  id           uuid primary key default gen_random_uuid(),
  penjualan_id uuid not null references penjualan (id) on delete cascade,
  produk_id    uuid not null references produk (id) on delete restrict,
  qty          numeric(12, 3) not null,
  harga        numeric(12, 2) not null,
  dibuat_pada  timestamptz not null default now()
);

-- ---------------------------------------------------------------- stok

create table gerakan_stok (
  id          uuid primary key default gen_random_uuid(),
  bahan_id    uuid not null references bahan (id) on delete restrict,
  tipe        tipe_gerakan not null,
  qty         numeric(12, 3) not null check (qty > 0),
  alasan      alasan_waste,
  catatan     text,
  ref_tabel   text,
  ref_id      uuid,
  waktu       timestamptz not null default now(),
  dibuat_oleh uuid references profil (id),
  dibuat_pada timestamptz not null default now(),
  constraint gerakan_stok_alasan_khusus_waste check (
    (tipe = 'waste' and alasan is not null)
    or (tipe <> 'waste' and alasan is null)
  )
);

comment on column gerakan_stok.qty is
  'Selalu positif. Arah pergerakan ditentukan kolom `tipe`, bukan oleh tanda bilangan.';
comment on column gerakan_stok.alasan is
  'Wajib diisi saat tipe = waste, harus null untuk tipe lain.';

-- ---------------------------------------------------------------- opname

create table opname (
  id          uuid primary key default gen_random_uuid(),
  tanggal     date not null,
  selesai     boolean not null default false,
  dibuat_oleh uuid references profil (id),
  dibuat_pada timestamptz not null default now()
);

create table opname_item (
  id          uuid primary key default gen_random_uuid(),
  opname_id   uuid not null references opname (id) on delete cascade,
  bahan_id    uuid not null references bahan (id) on delete restrict,
  qty_fisik   numeric(12, 3) not null,
  qty_sistem  numeric(12, 3) not null,
  selisih     numeric(12, 3) generated always as (qty_fisik - qty_sistem) stored,
  dibuat_pada timestamptz not null default now(),
  unique (opname_id, bahan_id)
);

-- ---------------------------------------------------------------- tutup buku

create table tutup_buku (
  id                 uuid primary key default gen_random_uuid(),
  tanggal            date not null unique,
  kas_awal           numeric(12, 2) not null,
  kas_fisik          numeric(12, 2) not null,
  sales_tunai_sistem numeric(12, 2) not null,
  sales_total_sistem numeric(12, 2) not null,
  -- Dibandingkan dengan sales TUNAI saja: QRIS tidak pernah masuk laci.
  selisih            numeric(12, 2)
                       generated always as (kas_fisik - kas_awal - sales_tunai_sistem)
                       stored,
  catatan            text,
  dibuat_oleh        uuid references profil (id),
  dibuat_pada        timestamptz not null default now()
);

comment on column tutup_buku.selisih is
  'kas_fisik - kas_awal - sales_tunai_sistem. Sengaja TIDAK memakai sales_total_sistem: pembayaran QRIS tidak pernah masuk laci kas.';

-- ---------------------------------------------------------------- index
-- Semua FK diberi index, kecuali kolom yang sudah menjadi kolom pertama sebuah unique
-- constraint (resep.produk_id, opname_item.opname_id) -- index-nya sudah dibuat oleh
-- constraint itu; menambah index kedua hanya memperlambat write tanpa manfaat baca.

create index resep_bahan_id_idx              on resep (bahan_id);
create index harga_bahan_bahan_id_idx        on harga_bahan (bahan_id);
create index pembelian_dibuat_oleh_idx       on pembelian (dibuat_oleh);
create index pembelian_item_pembelian_id_idx on pembelian_item (pembelian_id);
create index pembelian_item_bahan_id_idx     on pembelian_item (bahan_id);
create index penjualan_item_penjualan_id_idx on penjualan_item (penjualan_id);
create index penjualan_item_produk_id_idx    on penjualan_item (produk_id);
create index gerakan_stok_dibuat_oleh_idx    on gerakan_stok (dibuat_oleh);
create index opname_dibuat_oleh_idx          on opname (dibuat_oleh);
create index opname_item_bahan_id_idx        on opname_item (bahan_id);
create index tutup_buku_dibuat_oleh_idx      on tutup_buku (dibuat_oleh);

create index penjualan_tanggal_idx           on penjualan (tanggal);
create index gerakan_stok_bahan_waktu_idx    on gerakan_stok (bahan_id, waktu);
create index harga_bahan_terbaru_idx         on harga_bahan (bahan_id, berlaku_sejak desc);
