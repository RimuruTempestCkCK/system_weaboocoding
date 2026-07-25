// Helpers for currency formatting

export function formatRupiah(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

