// Export helpers for CSV download and Print PDF formatting

export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function exportToCSV(monthData) {
  if (!monthData || !monthData.transactions) return;

  const headers = [
    "No",
    "Tanggal",
    "Jenis Jasa",
    "Cara Bayar",
    "Price",
    "DP",
    "Sisa Pembayaran",
    "Ket (Lunas/Belum)",
    "Tgl Pelunasan"
  ];

  const rows = monthData.transactions.map((t) => [
    t.no,
    t.tanggal || "-",
    `"${(t.jenisJasa || "").replace(/"/g, '""')}"`,
    `"${(t.caraBayar || "").replace(/"/g, '""')}"`,
    t.price || 0,
    t.dp || 0,
    t.sisa || 0,
    t.ket || "Belum Lunas",
    t.tglPelunasan || "-"
  ]);

  // Total summary calculation
  const totalPrice = monthData.transactions.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const totalDp = monthData.transactions.reduce((acc, curr) => acc + (Number(curr.dp) || 0), 0);
  const totalSisa = monthData.transactions.reduce((acc, curr) => acc + (Number(curr.sisa) || 0), 0);

  rows.push([]);
  rows.push(["Total Transaksi", "", "", "", totalPrice, totalDp, totalSisa, "", ""]);
  rows.push(["Catatan", `"${(monthData.catatan || "").replace(/"/g, '""')}"`]);

  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `Rekap_Keuangan_${monthData.monthName.replace(/\s+/g, "_")}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
