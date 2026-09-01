-- 0003_view_hpp.sql -- Belakang Bar (s'mugKopi)
-- HPP per produk = jumlah (resep.jumlah x harga bahan terbaru).
--
-- Aturan mati #6: HPP tidak pernah diketik, selalu dihitung dari resep + harga_bahan.
-- Aturan mati #5: view ini dibuat `security_invoker = true` supaya RLS pemanggilnya
--   tetap berlaku. Tanpa itu barista bisa membaca HPP lewat pintu belakang.
--   Ditambah filter peran_saya() = 'owner' sebagai lapis kedua.
--
-- Kalau ada satu saja bahan di resep yang belum punya harga, `hpp` produk itu NULL,
-- bukan 0. Nol itu bohong; null itu jujur.

create or replace view hpp_produk
with (security_invoker = true) as
with harga_terbaru as (
  -- Riwayat harga: yang berlaku adalah berlaku_sejak terbesar.
  -- dibuat_pada jadi pemecah seri kalau ada dua baris di tanggal yang sama.
  select distinct on (h.bahan_id)
    h.bahan_id,
    h.harga_satuan
  from harga_bahan h
  order by h.bahan_id, h.berlaku_sejak desc, h.dibuat_pada desc
),
biaya as (
  select
    r.produk_id,
    case
      when count(*) filter (where ht.harga_satuan is null) > 0 then null
      else sum(r.jumlah * ht.harga_satuan)
    end as hpp
  from resep r
  left join harga_terbaru ht on ht.bahan_id = r.bahan_id
  group by r.produk_id
)
select
  p.id            as produk_id,
  p.nama          as nama,
  b.hpp           as hpp,
  p.harga_jual    as harga_jual,
  case
    when b.hpp is null or p.harga_jual is null then null
    else p.harga_jual - b.hpp
  end             as margin_rp,
  -- Margin terhadap harga jual: (jual - hpp) / jual x 100. Bukan markup.
  case
    when b.hpp is null or p.harga_jual is null or p.harga_jual = 0 then null
    else round((p.harga_jual - b.hpp) / p.harga_jual * 100, 2)
  end             as margin_persen
from produk p
left join biaya b on b.produk_id = p.id
where peran_saya() = 'owner';

comment on view hpp_produk is
  'HPP, margin rupiah, dan margin persen per produk. Hanya terbaca oleh owner. '
  'hpp null = ada bahan di resep yang belum punya harga, atau produk belum punya resep.';

grant select on hpp_produk to authenticated;
revoke all on hpp_produk from anon;

-- ---------------------------------------------------------------- jaring pengaman
-- Gagalkan migration kalau security_invoker sampai lepas.

do $$
begin
  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'hpp_produk'
      and c.reloptions @> array['security_invoker=true']
  ) then
    raise exception 'View hpp_produk harus dibuat dengan security_invoker = true';
  end if;
end $$;
