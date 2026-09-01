-- 0002_rls.sql -- Belakang Bar (s'mugKopi)
-- Penegakan peran di level database, bukan di UI.
--
-- Aturan mati #5: barista TIDAK PUNYA policy sama sekali di harga_bahan, pembelian,
-- pembelian_item, penjualan, penjualan_item. Bukan disembunyikan -- memang tidak bisa
-- diakses. Jangan tambahkan policy barista di kelima tabel itu tanpa izin OWNER.
--
-- Aturan mati #3: tidak ada policy `delete` untuk barista, di tabel mana pun.

-- ---------------------------------------------------------------- helper

-- security definer supaya pembacaan profil di dalamnya tidak ikut kena RLS profil
-- (kalau tidak, policy profil yang memanggil fungsi ini akan rekursif).
create or replace function peran_saya()
returns peran
language sql
security definer
set search_path = public
stable
as $$
  select p.peran from profil p where p.id = auth.uid();
$$;

comment on function peran_saya() is
  'Peran pengguna yang sedang login. Null kalau belum ada baris profil.';

revoke all on function peran_saya() from public;
grant execute on function peran_saya() to authenticated;

-- ---------------------------------------------------------------- grant dasar
-- RLS baru berlaku setelah role punya grant. Baris tetap difilter policy di bawah.

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on all tables in schema public from anon;

-- ---------------------------------------------------------------- aktifkan RLS
-- Semua tabel. Tidak ada yang dikecualikan.

alter table profil         enable row level security;
alter table produk         enable row level security;
alter table bahan          enable row level security;
alter table resep          enable row level security;
alter table harga_bahan    enable row level security;
alter table pembelian      enable row level security;
alter table pembelian_item enable row level security;
alter table penjualan      enable row level security;
alter table penjualan_item enable row level security;
alter table gerakan_stok   enable row level security;
alter table opname         enable row level security;
alter table opname_item    enable row level security;
alter table tutup_buku     enable row level security;

-- ---------------------------------------------------------------- policy OWNER
-- Akses penuh (select/insert/update/delete) ke seluruh tabel.

create policy owner_penuh on profil         for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on produk         for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on bahan          for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on resep          for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on harga_bahan    for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on pembelian      for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on pembelian_item for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on penjualan      for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on penjualan_item for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on gerakan_stok   for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on opname         for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on opname_item    for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');
create policy owner_penuh on tutup_buku     for all to authenticated
  using (peran_saya() = 'owner') with check (peran_saya() = 'owner');

-- ---------------------------------------------------------------- policy BARISTA

-- Baca master. Tidak ada insert/update/delete: master milik OWNER.
create policy barista_baca on produk for select to authenticated
  using (peran_saya() = 'barista');
create policy barista_baca on bahan for select to authenticated
  using (peran_saya() = 'barista');
create policy barista_baca on resep for select to authenticated
  using (peran_saya() = 'barista');

-- Profil: baris sendiri saja. Sengaja tanpa cek peran supaya tetap terbaca walau
-- peran_saya() belum sempat terisi.
create policy barista_baca_sendiri on profil for select to authenticated
  using (id = auth.uid());

-- Waste, dan hanya waste. `tipe = 'pakai' | 'masuk' | 'penyesuaian'` ditolak di sini,
-- bukan disembunyikan di form. `dibuat_oleh` dipaksa ke dirinya sendiri supaya waste
-- tidak bisa dicatat atas nama orang lain -- dan supaya baris yang baru dibuat pasti
-- lolos policy select di bawahnya.
create policy barista_catat_waste on gerakan_stok for insert to authenticated
  with check (
    peran_saya() = 'barista'
    and tipe = 'waste'
    and dibuat_oleh = auth.uid()
  );

create policy barista_baca_waste_sendiri on gerakan_stok for select to authenticated
  using (peran_saya() = 'barista' and dibuat_oleh = auth.uid());

-- Opname: boleh dibuat dan diisi, boleh dikoreksi selama belum ditandai selesai.
-- Setelah `selesai = true` baris jadi read-only bagi barista (aturan mati #3).
create policy barista_baca on opname for select to authenticated
  using (peran_saya() = 'barista');

create policy barista_buat on opname for insert to authenticated
  with check (peran_saya() = 'barista');

create policy barista_ubah_belum_selesai on opname for update to authenticated
  using (peran_saya() = 'barista' and selesai = false)
  with check (peran_saya() = 'barista');

create policy barista_baca on opname_item for select to authenticated
  using (peran_saya() = 'barista');

-- Item hanya bisa masuk/berubah selama opname induknya belum selesai; kalau tidak,
-- opname yang sudah dikunci masih bisa diubah lewat pintu belakang.
create policy barista_buat on opname_item for insert to authenticated
  with check (
    peran_saya() = 'barista'
    and exists (
      select 1 from opname o where o.id = opname_item.opname_id and o.selesai = false
    )
  );

create policy barista_ubah_belum_selesai on opname_item for update to authenticated
  using (
    peran_saya() = 'barista'
    and exists (
      select 1 from opname o where o.id = opname_item.opname_id and o.selesai = false
    )
  )
  with check (
    peran_saya() = 'barista'
    and exists (
      select 1 from opname o where o.id = opname_item.opname_id and o.selesai = false
    )
  );

-- Tutup buku: barista yang mengerjakan, jadi boleh baca semua dan buat baris baru.
-- Koreksi hanya untuk tanggal hari ini; riwayat lama read-only bagi barista.
create policy barista_baca on tutup_buku for select to authenticated
  using (peran_saya() = 'barista');

create policy barista_buat on tutup_buku for insert to authenticated
  with check (peran_saya() = 'barista');

create policy barista_ubah_hari_ini on tutup_buku for update to authenticated
  using (peran_saya() = 'barista' and tanggal = current_date)
  with check (peran_saya() = 'barista' and tanggal = current_date);

-- harga_bahan, pembelian, pembelian_item, penjualan, penjualan_item:
-- sengaja kosong untuk barista. Lihat catatan di kepala berkas.

-- ---------------------------------------------------------------- profil otomatis

create or replace function tangani_user_baru()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profil (id, nama, peran)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nama'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Tanpa Nama'
    ),
    'barista'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

comment on function tangani_user_baru() is
  'Membuat baris profil untuk setiap user baru, selalu dengan peran barista. '
  'Menaikkan seseorang jadi owner adalah tindakan manual OWNER.';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function tangani_user_baru();

-- ---------------------------------------------------------------- jaring pengaman
-- Gagalkan migration kalau ada tabel public yang lolos tanpa RLS.

do $$
declare
  tanpa_rls text;
begin
  select string_agg(c.relname, ', ' order by c.relname)
    into tanpa_rls
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and not c.relrowsecurity;

  if tanpa_rls is not null then
    raise exception 'RLS belum aktif di tabel: %', tanpa_rls;
  end if;
end $$;
