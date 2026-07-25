# 📊 PosJasaku - Sistem Rekapitulasi & Laporan Keuangan Jasa

Aplikasi web modern berbasis **React JS** yang dirancang khusus untuk pencatatan transaksi jasa, rekapitulasi keuangan bulanan, dan analisis laporan keuangan executive. Web ini disiapkan dan dioptimalkan untuk langsung di-deploy ke platform **Vercel**.

---

## 🚀 Fitur Utama & Role Akses

Aplikasi ini dilengkapi dengan **2 Role Akses Utama**:

### 🛡️ 1. Akses Admin (Pengelola Data)
* **Input Data Transaksi**: Menambah dan mengedit baris transaksi secara terstruktur.
* **Kalkulasi Otomatis**: System secara otomatis menghitung `Sisa Pembayaran = Price - DP` dan menentukan status `Lunas` atau `Belum Lunas`.
* **Aksi Cepat**: Tombol *Quick Action* untuk menandai transaksi Lunas (langsung mencatat tanggal pelunasan).
* **Manajemen Baris & Bulan**: Menambah baris kosong (+1), menghapus transaksi, serta membuat rekap untuk bulan-bulan baru (misal: *Agustus 2026*, *September 2026*).
* **Kelola Catatan Perbulan**: Mengedit catatan khusus pada setiap rekap bulanan.

### 👁️ 2. Akses Owner (Laporan & Analytics Executive)
* **Read-Only Mode**: Tampilan aman tanpa risiko perubahan data tidak disengaja.
* **Executive Dashboard KPI**:
  * Total Omset Pendapatan (*Price*)
  * Total Arus Kas Masuk (*DP*)
  * Total Piutang (*Sisa Pembayaran*)
  * Persentase Tingkat Pelunasan (%)
* **Grafik Analisis Visual (Recharts)**:
  * **Bar Chart**: Perbandingan nilai *Price*, *DP*, dan *Sisa* untuk setiap transaksi.
  * **Donut Chart**: Proporsi transaksi *Lunas* vs *Belum Lunas*.
* **Export & Print**: Fitur unduh laporan dalam format **CSV / Excel** dan cetak **PDF**.

---

## 📂 Struktur File & Komponen yang Telah Dibuat

Berikut adalah daftar lengkap file yang dibuat dalam proyek ini:

```
system_weaboocoding/
├── index.html                   # Entry point HTML aplikasi
├── package.json                 # Dependensi proyek (React, Vite, Recharts, Lucide Icons)
├── vite.config.js               # Konfigurasi Vite & optimizer build untuk Vercel/Windows
├── vercel.json                  # Routing SPA rewrite rules untuk deployment Vercel
├── README.md                    # Dokumentasi lengkap proyek ini
└── src/
    ├── main.jsx                 # Entry point JavaScript React DOM
    ├── App.jsx                  # Root Component (State Management, Routing Role, LocalStorage)
    ├── index.css                # CSS Design System, Glassmorphism, Responsive & Print Styles
    ├── initialData.js           # Data awal sampel transaksi (Juli 2026) & kredensial demo
    ├── utils/
    │   └── exportUtils.js       # Helper format Rupiah (IDR) & fungsi export CSV/Excel
    └── components/
        ├── Navbar.jsx           # Topbar navigasi, pemilih bulan, indikator role, & logout
        ├── LoginPage.jsx        # Form login & 1-Click Quick Demo Login (Admin/Owner)
        ├── AdminDashboard.jsx   # Dashboard pengelola data transaksi & KPI Admin
        ├── OwnerDashboard.jsx   # Executive report dashboard dengan grafik analytics
        ├── TransactionTable.jsx # Tabel rekapitulasi data keuangan & total summary
        ├── TransactionModal.jsx # Modal form untuk tambah/edit data transaksi
        └── AddMonthModal.jsx    # Modal form untuk membuat rekap bulan baru
```

---

## 📋 Skema Data Tabel Rekapitulasi

Setiap baris transaksi pada rekapitulasi bulanan memiliki struktur data sebagai berikut:

| Nama Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| **No** | Number | Nomor urut transaksi |
| **Tanggal** | Date / String | Tanggal transaksi dilakukan |
| **Jenis Jasa** | String | Deskripsi nama jasa (misal: *Pembuatan Website*, *UI/UX*) |
| **Cara Bayar** | String | Metode pembayaran (*Transfer BCA*, *QRIS*, *Cash*, dll) |
| **Price** | Currency (IDR) | Total harga jasa |
| **DP** | Currency (IDR) | Uang muka yang diterima |
| **Sisa Pembayaran**| Currency (IDR) | Otomatis terhitung `Price - DP` |
| **Ket (Lunas/belum)**| Enum / Badge | Status (`Lunas` / `Belum Lunas`) |
| **Tgl Pelunasan** | Date / String | Tanggal pelunasan biaya sisa |

---

## 🔑 Kredensial Login Demo

Anda dapat masuk menggunakan form login atau mengeklik tombol **1-Click Quick Login**:

* **Admin**:
  * Username: `admin`
  * Password: `admin123`
* **Owner**:
  * Username: `owner`
  * Password: `owner123`

---

## 🛠️ Cara Menjalankan Aplikasi

### 1. Jalankan di Mode Pengembangan (Local Dev):
```bash
npm run dev
```
Akses di browser melalui URL: `http://localhost:5173`

### 2. Jalankan Build Production:
```bash
npm run build
```

---

## 🌐 Panduan Deployment ke Vercel

1. **Push ke GitHub**: Upload folder proyek ini ke repository GitHub Anda.
2. **Konek ke Vercel**:
   * Buka [Vercel Dashboard](https://vercel.com).
   * Klik tombol **"Add New"** > **"Project"**.
   * Pilih repository GitHub proyek ini.
3. **Konfigurasi Project**:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Klik **Deploy**. Vercel akan membaca konfigurasi `vercel.json` secara otomatis.
