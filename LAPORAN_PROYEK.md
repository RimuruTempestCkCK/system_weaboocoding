# 📝 Laporan Proyek & Dokumentasi Sistem WeabooCoding

Dokumen ini berisi pencatatan lengkap mengenai arsitektur, daftar komponen, serta seluruh fitur yang telah diperbarui dalam proyek **WeabooCoding (Sistem Rekapitulasi & Laporan Keuangan Jasa berbasis React JS)**.

---

## 🚀 1. Fitur Utama & Pembaruan Terkini

### ☁️ A. Integrasi Cloud Database (Supabase Ready)
- **Hybrid Storage Model**: Mendukung **Supabase Cloud Database (PostgreSQL)** secara real-time dan **`localStorage` Browser** sebagai fallback otomatis.
- **Auto Seeding**: Apabila database Supabase masih kosong, aplikasi secara otomatis melakukan *initial seeding* dataset bawaan.
- **CRUD Operations**: Seluruh aksi tambah transaksi, edit, hapus, tambah bulan, dan perbarui catatan tersinkronisasi langsung dengan Supabase.

### 🪟 B. Pop-Up Modal Dialog untuk Input & Edit Transaksi
- **Mode Input Transaksi Baru**: Membuka **Pop-Up Dialog** interaktif ketika Admin mengeklik tombol `+ Input Transaksi Baru`.
- **Mode Edit Transaksi**: Membuka **Pop-Up Dialog** yang terisi otomatis dengan data baris yang sedang diedit ketika Admin mengeklik ikon `Edit` pada tabel rekapitulasi.
- **Navigasi Pop-Up**: Mendukung *Backdrop Click Close* dan penekanan tombol `Esc` untuk menutup pop-up.
- **Kalkulasi Otomatis (Realtime)**: Otomatis menghitung `Sisa Pembayaran = Price - DP` saat mengetik angka nominal dan menentukan status `Lunas` bila sisa pembayaran bernilai Rp0.
- **Tanggal Otomatis Hari Ini**: Tanggal transaksi secara otomatis terisi dengan tanggal hari login Admin (misal: `2026-07-25`).

### 📅 C. Input Harian & Fleksibilitas Edit Bulan Lalu
- **Switching Bulan**: Admin dan Owner dapat berpindah ke bulan apa saja (*Juli 2026*, *Juni 2026 (Bulan Lalu)*, *Mei 2026*, dll) melalui *Month Selector* pada Sidebar & Navbar.
- **Edit Bulan Lalu**: Admin dapat menambah, mengubah, atau menghapus transaksi pada bulan-bulan lalu secara bebas.
- **Bebas Tanpa Baris Kosong Dummy**: Tabel rekapitulasi hanya menampilkan transaksi aktif yang benar-benar terisi tanpa ada tombol *tambah baris kosong*.

---

## 📂 2. Daftar File & Komponen Terupdate

| Nama File | Path File | Fungsi & Peran Komponen |
| :--- | :--- | :--- |
| **`supabaseClient.js`** | `src/utils/supabaseClient.js` | Inisialisasi SDK Supabase Client dengan validasi env variables. |
| **`supabaseService.js`** | `src/utils/supabaseService.js` | Modul layanan CRUD (Fetch, Upsert, Delete, Catatan, Auto-seed) ke Supabase. |
| **`SUPABASE_SETUP.sql`** | `SUPABASE_SETUP.sql` | Script SQL DDL siap pakai untuk membuat tabel `recap_months` & `transactions` di Supabase. |
| **`.env.example`** | `.env.example` | Template variabel lingkungan (`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`). |
| **`TransactionModal.jsx`** | `src/components/TransactionModal.jsx` | **Pop-Up Dialog** utama untuk Input & Edit transaksi. |
| **`TransactionTable.jsx`** | `src/components/TransactionTable.jsx` | Tabel rekapitulasi transaksi harian dengan aksi Edit, Tandai Lunas, & Hapus. |
| **`AdminDashboard.jsx`** | `src/components/AdminDashboard.jsx` | Dashboard pengelola untuk **Admin** dengan KPI Card & tombol input. |
| **`OwnerDashboard.jsx`** | `src/components/OwnerDashboard.jsx` | Dashboard **Owner (Read-Only)** dengan grafik Recharts & Cetak PDF. |
| **`Navbar.jsx`** | `src/components/Navbar.jsx` | Header topbar clean dengan breadcrumb, quick month selector, & logout. |
| **`Sidebar.jsx`** | `src/components/Sidebar.jsx` | Left Sidebar collapsible dengan menu navigasi, role indicator, & pemilih bulan. |
| **`LoginPage.jsx`** | `src/components/LoginPage.jsx` | Halaman Login ultra-clean dengan tab switcher role & tombol 1-Click Quick Demo Login. |
| **`App.jsx`** | `src/App.jsx` | Root Layout yang mengelola state data transaksi, sync Supabase, & `localStorage`. |
| **`initialData.js`** | `src/initialData.js` | Dataset awal terstruktur (*Juli 2026*, *Juni 2026*, *Mei 2026*). |
| **`exportUtils.js`** | `src/utils/exportUtils.js` | Helper utility format mata uang Rupiah (`IDR`). |

---

## 🛠️ 3. Panduan Menghubungkan Supabase Cloud

1. **Buat Proyek Supabase**: Masuk ke [supabase.com](https://supabase.com) dan buat proyek baru.
2. **Jalankan Script SQL**:
   - Buka menu **SQL Editor** di Dashboard Supabase.
   - Copy & paste isi file [`SUPABASE_SETUP.sql`](file:///D:/DOWNLOAD%20FOLDER/system_weaboocoding/SUPABASE_SETUP.sql).
   - Klik tombol **Run**.
3. **Salin API Keys**:
   - Buka **Project Settings** -> **API**.
   - Salin **Project URL** dan **anon public key**.
4. **Buat File `.env`**:
   - Buat file `.env` di root folder proyek dan isi:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```
5. **Vercel Deployment**: Tambahkan dua *Environment Variables* di atas pada menu Settings Vercel saat deploy.
