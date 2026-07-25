-- ======================================================
-- SCRIPT SETUP DATABASE WEABOOCODING UNTUK SUPABASE
-- ======================================================
-- Buka Dashboard Supabase (https://supabase.com)
-- Pilih Proyek Anda -> Menu SQL Editor -> Paste & Run script ini
-- ======================================================

-- 1. Buat Tabel Rekap Bulanan (recap_months)
CREATE TABLE IF NOT EXISTS public.recap_months (
  month_key TEXT PRIMARY KEY,       -- Contoh: '2026-07'
  month_name TEXT NOT NULL,         -- Contoh: 'Juli 2026'
  catatan TEXT DEFAULT '',          -- Catatan rekap perbulan
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Buat Tabel Transaksi Harian (transactions)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_key TEXT REFERENCES public.recap_months(month_key) ON DELETE CASCADE,
  no INTEGER NOT NULL,
  tanggal TEXT DEFAULT '',
  jenis_jasa TEXT DEFAULT '',
  cara_bayar TEXT DEFAULT '',
  price NUMERIC(15, 2) DEFAULT 0,
  dp NUMERIC(15, 2) DEFAULT 0,
  sisa NUMERIC(15, 2) DEFAULT 0,
  ket TEXT DEFAULT 'Belum Lunas',
  tgl_pelunasan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Buat Tabel Pengguna / Users (app_users)
CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- 'admin' atau 'owner'
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Matikan / Aktifkan Row Level Security (RLS)
-- Untuk kemudahan awal tanpa auth kompleks Supabase RLS, izinkan akses public read/write:
ALTER TABLE public.recap_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for recap_months" ON public.recap_months FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for recap_months" ON public.recap_months FOR ALL USING (true);

CREATE POLICY "Allow public read for transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete for transactions" ON public.transactions FOR ALL USING (true);

CREATE POLICY "Allow public read for app_users" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for app_users" ON public.app_users FOR ALL USING (true);

-- 5. Inisialisasi Data User Awal (Opsional)
INSERT INTO public.app_users (username, password, name, role, email)
VALUES 
  ('admin', 'admin123', 'Administrator (Admin)', 'admin', 'admin@weaboocoding.com'),
  ('owner', 'owner123', 'Business Owner', 'owner', 'owner@weaboocoding.com')
ON CONFLICT (username) DO NOTHING;

-- 6. Inisialisasi Data Bulan Awal (Opsional)
INSERT INTO public.recap_months (month_key, month_name, catatan)
VALUES 
  ('2026-07', 'Juli 2026 (Bulan Ini)', 'Catatan: Pembayaran DP minimal 50% untuk proyek jasa skala besar.'),
  ('2026-06', 'Juni 2026 (Bulan Lalu)', 'Rekapitulasi bulan Juni selesai dan terverifikasi.')
ON CONFLICT (month_key) DO NOTHING;

INSERT INTO public.transactions (month_key, no, tanggal, jenis_jasa, cara_bayar, price, dp, sisa, ket, tgl_pelunasan)
VALUES 
  ('2026-07', 1, '2026-07-02', 'Pembuatan Website Landing Page', 'Transfer BCA', 2500000, 1500000, 1000000, 'Belum Lunas', '-'),
  ('2026-07', 2, '2026-07-05', 'Desain UI/UX Mobile App', 'Cash', 3500000, 3500000, 0, 'Lunas', '2026-07-05'),
  ('2026-07', 3, '2026-07-10', 'Jasa Maintenance Server & Cloud', 'Transfer Mandiri', 1200000, 600000, 600000, 'Belum Lunas', '-'),
  ('2026-07', 4, '2026-07-15', 'Optimasi SEO & Performa Web', 'Transfer Mandiri', 1800000, 1800000, 0, 'Lunas', '2026-07-15'),
  ('2026-06', 1, '2026-06-05', 'Setup Database & API Gateway', 'Transfer BCA', 4000000, 4000000, 0, 'Lunas', '2026-06-05'),
  ('2026-06', 2, '2026-06-18', 'Audit Keamanan Aplikasi', 'Transfer Mandiri', 3000000, 1500000, 1500000, 'Belum Lunas', '-')
ON CONFLICT DO NOTHING;

