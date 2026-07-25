# 📝 Laporan Proyek & Dokumentasi Sistem WeabooCoding

Dokumen ini berisi pencatatan lengkap mengenai arsitektur, daftar komponen, serta seluruh fitur yang telah diperbarui dalam proyek **WeabooCoding (Sistem Rekapitulasi & Laporan Keuangan Jasa berbasis React JS)**.

---

## 🚀 1. Fitur Utama & Pembaruan Terkini

### 🪟 A. Pop-Up Modal Dialog untuk Input & Edit Transaksi
- **Mode Input Transaksi Baru**: Membuka **Pop-Up Dialog** interaktif ketika Admin mengeklik tombol `+ Input Transaksi Baru`.
- **Mode Edit Transaksi**: Membuka **Pop-Up Dialog** yang terisi otomatis dengan data baris yang sedang diedit ketika Admin mengeklik ikon `Edit` pada tabel rekapitulasi.
- **Navigasi Pop-Up**: Mendukung *Backdrop Click Close* dan penekanan tombol `Esc` untuk menutup pop-up.
- **Kalkulasi Otomatis (Realtime)**: Otomatis menghitung `Sisa Pembayaran = Price - DP` saat mengetik angka nominal dan menentukan status `Lunas` bila sisa pembayaran bernilai Rp0.
- **Tanggal Otomatis Hari Ini**: Tanggal transaksi secara otomatis terisi dengan tanggal hari login Admin (misal: `2026-07-25`).

### 📅 B. Input Harian & Fleksibilitas Edit Bulan Lalu
- **Switching Bulan**: Admin dan Owner dapat berpindah ke bulan apa saja (*Juli 2026*, *Juni 2026 (Bulan Lalu)*, *Mei 2026*, dll) melalui *Month Selector* pada Sidebar & Navbar.
- **Edit Bulan Lalu**: Admin dapat menambah, mengubah, atau menghapus transaksi pada bulan-bulan lalu secara bebas.
- **Bebas Tanpa Baris Kosong Dummy**: Tabel rekapitulasi hanya menampilkan transaksi aktif yang benar-benar terisi tanpa ada tombol *tambah baris kosong*.

---

## 📂 2. Daftar File & Komponen Terupdate

| Nama File | Path File | Fungsi & Peran Komponen |
| :--- | :--- | :--- |
| **`TransactionModal.jsx`** | `src/components/TransactionModal.jsx` | **Pop-Up Dialog** utama untuk Input & Edit transaksi. Dilengkapi 3 blok section interaktif, live format Rupiah, & auto calc. |
| **`TransactionTable.jsx`** | `src/components/TransactionTable.jsx` | Tabel rekapitulasi transaksi harian. Menangani aksi trigger **Pop-Up Edit**, Tandai Lunas, Hapus, & Ringkasan Perhitungan Otomatis. |
| **`AdminDashboard.jsx`** | `src/components/AdminDashboard.jsx` | Dashboard pengelola untuk **Admin**. Memiliki tombol trigger **Pop-Up Input Transaksi Baru** & KPI Card summary. |
| **`OwnerDashboard.jsx`** | `src/components/OwnerDashboard.jsx` | Dashboard **Owner (Read-Only)** dengan analisis grafik Recharts (*Bar Chart & Donut Chart*) serta fitur Cetak PDF. |
| **`Navbar.jsx`** | `src/components/Navbar.jsx` | Header topbar clean dengan tombol toggle sidebar, breadcrumb, quick month selector, & logout. |
| **`Sidebar.jsx`** | `src/components/Sidebar.jsx` | Left Sidebar collapsible dengan menu navigasi, role indicator, pemilih bulan, & profil pengguna. |
| **`LoginPage.jsx`** | `src/components/LoginPage.jsx` | Halaman Login ultra-clean dengan tab switcher role & tombol 1-Click Quick Demo Login. |
| **`App.jsx`** | `src/App.jsx` | Root Layout yang mengelola state data transaksi, role routing, & penyimpanan otomatis ke `localStorage`. |
| **`initialData.js`** | `src/initialData.js` | Dataset awal terstruktur yang mencakup bulan berjalan (*Juli 2026*) serta bulan lalu (*Juni 2026*, *Mei 2026*). |
| **`exportUtils.js`** | `src/utils/exportUtils.js` | Helper utility format mata uang Rupiah (`IDR`). |
| **`index.css`** | `src/index.css` | Styling utama Vanilla CSS dengan animasi `@keyframes popUpScale`, glassmorphism backdrop, & print styles. |
| **`vercel.json`** | `vercel.json` | Konfigurasi SPA rewrite rules untuk deployment tanpa error 404 di Vercel. |

---

## 📊 3. Ringkasan Perhitungan Otomatis

1. **Sisa Pembayaran**: `Price` dikurangi `DP`.
2. **Status Pelunasan**: Bernilai `Lunas` apabila Sisa Pembayaran `≤ 0`, dan `Belum Lunas` bila masih ada sisa piutang.
3. **Total Omset Pendapatan**: Penjumlahan seluruh nominal `Price` pada bulan yang dipilih.
4. **Total DP Masuk**: Penjumlahan seluruh nominal `DP` yang diterima.
5. **Total Piutang Berjalan**: Penjumlahan seluruh nominal `Sisa Pembayaran` yang belum dilunasi.
