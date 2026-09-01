-- CONTOH, BUKAN DATA ASLI
--
-- Berkas ini hanya untuk `supabase db reset` di mesin lokal. Jangan pernah dijalankan
-- ke database produksi, dan jangan pernah dipindahkan ke supabase/migrations/.
--
-- Isinya sengaja cuma nama produk. Tidak ada harga jual, tidak ada harga bahan,
-- tidak ada HPP, tidak ada nama supplier -- angka bisnis itu milik OWNER dan belum
-- diberikan. Kalau sebuah fitur butuh angka yang belum ada, laporkan sebagai UNKNOWN,
-- jangan diisi tebakan.

insert into produk (nama, kategori) values
  ('espresso',                'kopi'),
  ('latte',                   'kopi'),
  ('es kopi susu gula aren',  'kopi')
on conflict (nama) do nothing;
