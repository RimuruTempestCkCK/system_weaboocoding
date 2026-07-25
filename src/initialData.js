export const INITIAL_MONTHLY_DATA = {
  "2026-07": {
    monthKey: "2026-07",
    monthName: "Juli 2026",
    catatan: "Rekapitulasi keuangan bulan Juli 2026. Semua perhitungan ter-update otomatis.",
    transactions: [
      {
        id: "trx-7-1",
        no: 1,
        tanggal: "2026-07-02",
        jenisJasa: "Jasa Pembuatan Website & Domain",
        caraBayar: "Transfer Bank BCA",
        price: 400000,
        dp: 50000,
        sisa: 350000,
        ket: "Belum Lunas",
        tglPelunasan: ""
      },
      {
        id: "trx-7-2",
        no: 2,
        tanggal: "2026-07-05",
        jenisJasa: "Jasa Desain User Interface (UI/UX)",
        caraBayar: "QRIS / E-Wallet",
        price: 200000,
        dp: 0,
        sisa: 200000,
        ket: "Belum Lunas",
        tglPelunasan: ""
      },
      {
        id: "trx-7-3",
        no: 3,
        tanggal: "2026-07-08",
        jenisJasa: "Jasa Maintenance & Server",
        caraBayar: "Transfer Bank Mandiri",
        price: 150000,
        dp: 150000,
        sisa: 0,
        ket: "Lunas",
        tglPelunasan: "2026-07-08"
      },
      {
        id: "trx-7-4",
        no: 4,
        tanggal: "2026-07-12",
        jenisJasa: "Jasa SEO & Optimization",
        caraBayar: "Cash / Tunai",
        price: 300000,
        dp: 100000,
        sisa: 200000,
        ket: "Belum Lunas",
        tglPelunasan: ""
      },
      {
        id: "trx-7-5",
        no: 5,
        tanggal: "2026-07-25",
        jenisJasa: "Jasa Redesign Landing Page",
        caraBayar: "Transfer Bank BCA",
        price: 250000,
        dp: 250000,
        sisa: 0,
        ket: "Lunas",
        tglPelunasan: "2026-07-25"
      }
    ]
  },
  "2026-06": {
    monthKey: "2026-06",
    monthName: "Juni 2026 (Bulan Lalu)",
    catatan: "Rekapitulasi bulan lalu (Juni 2026). Admin dapat menambah atau mengedit transaksi bulan lalu kapan saja.",
    transactions: [
      {
        id: "trx-juni-1",
        no: 1,
        tanggal: "2026-06-10",
        jenisJasa: "Jasa Pembuatan E-Commerce",
        caraBayar: "Transfer Bank BCA",
        price: 1200000,
        dp: 600000,
        sisa: 600000,
        ket: "Belum Lunas",
        tglPelunasan: ""
      },
      {
        id: "trx-juni-2",
        no: 2,
        tanggal: "2026-06-18",
        jenisJasa: "Jasa Setup Domain & Hosting",
        caraBayar: "QRIS / E-Wallet",
        price: 350000,
        dp: 350000,
        sisa: 0,
        ket: "Lunas",
        tglPelunasan: "2026-06-18"
      }
    ]
  },
  "2026-05": {
    monthKey: "2026-05",
    monthName: "Mei 2026 (Bulan Lalu)",
    catatan: "Rekapitulasi bulan Mei 2026.",
    transactions: [
      {
        id: "trx-mei-1",
        no: 1,
        tanggal: "2026-05-15",
        jenisJasa: "Jasa Branding & Logo Design",
        caraBayar: "Transfer Bank Mandiri",
        price: 500000,
        dp: 500000,
        sisa: 0,
        ket: "Lunas",
        tglPelunasan: "2026-05-15"
      }
    ]
  }
};

export const MOCK_USERS = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrator (Admin)",
    email: "admin@weaboocoding.com"
  },
  {
    username: "owner",
    password: "owner123",
    role: "owner",
    name: "Business Owner",
    email: "owner@weaboocoding.com"
  }
];
