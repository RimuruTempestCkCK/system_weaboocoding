# 📝 Laporan Daftar File & Fitur yang Dibuat

Dokumen ini berisi daftar lengkap file source code, komponen React, stylesheet, serta utility yang telah dibuat untuk aplikasi **PosJasaku (Rekap & Laporan Keuangan Jasa)**.

---

## 📂 1. Daftar File Utama Proyek

| Nama File | Lokasi / Path | Deskripsi & Fungsi |
| :--- | :--- | :--- |
| **`App.jsx`** | `src/App.jsx` | Component utama (Root) yang menangani state data bulanan, autentikasi user, routing role Admin/Owner, serta integrasi `localStorage`. |
| **`Navbar.jsx`** | `src/components/Navbar.jsx` | Header navigasi atas yang berisi logo, pemilih bulan rekap (*Month Selector*), badge role aktif, dan tombol Logout. |
| **`LoginPage.jsx`** | `src/components/LoginPage.jsx` | Halaman login dengan form kredensial dan tombol **1-Click Quick Demo Login** untuk Admin dan Owner. |
| **`AdminDashboard.jsx`** | `src/components/AdminDashboard.jsx` | Dashboard khusus **Admin** untuk menginput, mengedit, menghapus transaksi, melihat ringkasan omset, dan mengedit catatan perbulan. |
| **`OwnerDashboard.jsx`** | `src/components/OwnerDashboard.jsx` | Dashboard khusus **Owner** (Read-Only) yang dilengkapi dengan grafik visual Recharts (Bar Chart & Donut Chart) serta ringkasan KPI. |
| **`TransactionTable.jsx`**| `src/components/TransactionTable.jsx` | Component tabel rekapitulasi utama yang menampilkan seluruh baris transaksi, kalkulasi total transaksi, dan area catatan perbulan. |
| **`TransactionModal.jsx`**| `src/components/TransactionModal.jsx` | Form modal interaktif untuk menambah atau mengubah data baris transaksi dengan kalkulasi sisa pembayaran otomatis. |
| **`AddMonthModal.jsx`** | `src/components/AddMonthModal.jsx` | Form modal untuk membuat lembar rekapitulasi bulan baru (contoh: *Agustus 2026*). |
| **`initialData.js`** | `src/initialData.js` | Dataset awal yang memuat rekap transaksi bulan **Juli 2026** (sesuai contoh user) dan data kredensial login demo. |
| **`exportUtils.js`** | `src/utils/exportUtils.js` | Helper utility untuk format mata uang Rupiah (`IDR`) serta fungsi export data ke file **CSV / Excel**. |
| **`index.css`** | `src/index.css` | File styling utama berbasis Vanilla CSS modern dengan tema glassmorphism, responsive grid, status badge, dan print layout. |
| **`vite.config.js`** | `vite.config.js` | Konfigurasi bundler Vite yang telah disesuaikan agar kompatibel dengan lingkungan Windows & Vercel build. |
| **`vercel.json`** | `vercel.json` | File konfigurasi rewrite SPA untuk memastikan aplikasi berjalan tanpa error 404 saat di-deploy ke Vercel. |
| **`package.json`** | `package.json` | Konfigurasi dependensi npm (`react`, `react-dom`, `lucide-react`, `recharts`, `vite`). |

---

## 📊 2. Struktur Data Tabel Rekapitulasi

Tabel rekapitulasi keuangan disusun dengan 9 kolom data berikut:

1. **No**: Nomor urut transaksi (1, 2, 3, dst.)
2. **Tanggal**: Tanggal transaksi dilaksanakan
3. **Jenis jasa**: Nama layanan / proyek jasa
4. **Cara bayar**: Metode pembayaran (*Transfer BCA, Mandiri, QRIS, Cash*)
5. **Price**: Total biaya jasa (Format Rupiah)
6. **DP**: Down Payment / Uang muka (Format Rupiah)
7. **Sisa pembayaran**: Calculated Field (`Price - DP`)
8. **Ket (Lunas/belum)**: Status pelunasan (*Lunas* / *Belum Lunas*)
9. **Tgl pelunasan**: Tanggal ketika sisa pembayaran dilunasi
10. **Catatan perbulan**: Area catatan bulanan di bagian bawah tabel.

---

## 🛠️ 3. Perbedaan Fitur Berdasarkan Role

### 🛡️ Role Admin:
- Can Add / Edit / Delete transaction rows.
- Can Quick-mark transactions as "Lunas".
- Can add new blank rows (+1).
- Can edit monthly notes (*Catatan perbulan*).
- Can create new monthly recap sheets.

### 👁️ Role Owner:
- Read-only view for tables and monthly notes.
- Executive KPI Cards (Total Omset, DP Received, Piutang, % Pelunasan).
- Interactive Charts:
  - *Price vs DP vs Sisa Bar Chart*.
  - *Lunas vs Belum Lunas Donut Chart*.
- Export data to **CSV / Excel** and Print **PDF**.
