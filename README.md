# 📊 WeabooCoding - Sistem Rekapitulasi & Laporan Keuangan Jasa (React JS)

Aplikasi web modern berbasis **React JS** yang dirancang khusus untuk pencatatan transaksi harian, rekapitulasi keuangan bulanan, serta analisis laporan keuangan executive. Aplikasi disiapkan dan dioptimalkan untuk di-deploy ke **Vercel**.

---

## 🚀 Pembaruan Fitur Utama

1. **🪟 Pop-Up Modal Dialog untuk Input & Edit**:
   - Baik penginputan transaksi harian baru maupun pengeditan baris transaksi menggunakan **Pop-Up Dialog** interaktif yang rapi dan elegan.
   - Mendukung klik di luar area modal (*Backdrop Click Close*) dan penekanan tombol `Esc`.
2. **📅 Input Harian & Tanggal Otomatis**:
   - Tanggal transaksi secara otomatis terisi tanggal hari login Admin (misal: `2026-07-25`).
3. **📆 Bebas Edit Rekap Bulan Lalu**:
   - Admin dan Owner dapat berpindah ke bulan berjalan maupun bulan-bulan lalu (*Mei 2026*, *Juni 2026*, *Juli 2026*) via *Month Selector*.
   - Admin bebas menambah, mengedit, atau menghapus transaksi pada bulan lalu.
4. **⚡ Perhitungan Otomatis**:
   - Total Omset, DP Masuk, Sisa Piutang, dan Status Pelunasan dikalkulasi secara realtime.

---

## 📂 Struktur File Utama

* `src/components/TransactionModal.jsx`: **Pop-Up Modal** Dialog utama untuk Input & Edit Transaksi.
* `src/components/TransactionTable.jsx`: Tabel rekapitulasi data keuangan & aksi Edit (Buka Pop-Up), Hapus, Tandai Lunas.
* `src/components/AdminDashboard.jsx`: Dashboard Admin dengan trigger Pop-Up & KPI Cards.
* `src/components/OwnerDashboard.jsx`: Dashboard Owner (Read-Only) dengan grafik Recharts & Cetak PDF.
* `src/components/Sidebar.jsx`: Collapsible Left Sidebar.
* `src/components/Navbar.jsx`: Clean top header bar.
* `LAPORAN_PROYEK.md`: Dokumentasi lengkap proyek.
* `vercel.json`: Konfigurasi deployment Vercel.

---

## 🔑 Kredensial Login Demo

* **Admin**: `admin` / `admin123`
* **Owner**: `owner` / `owner123`

---

## 🛠️ Cara Menjalankan

```bash
# Mode Dev
npm run dev

# Production Build
npm run build
```
