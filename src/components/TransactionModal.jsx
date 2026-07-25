import React, { useState, useEffect } from "react";
import { X, Save, Calendar, FileText, DollarSign, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "../utils/exportUtils";
import { showToastSuccess, showAlertError } from "../utils/alertUtils";

export function TransactionModal({ isOpen, onClose, onSave, initialTrx, defaultNo }) {
  // Helper to get local date string YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    no: defaultNo,
    tanggal: getTodayString(),
    jenisJasa: "",
    caraBayar: "Transfer Bank BCA",
    price: "",
    dp: "",
    ket: "Belum Lunas",
    tglPelunasan: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (initialTrx) {
        // Mode Edit Transaksi -> Pop-Up Modal terisi data yang diedit
        setFormData({
          id: initialTrx.id,
          no: initialTrx.no || defaultNo,
          tanggal: initialTrx.tanggal || getTodayString(),
          jenisJasa: initialTrx.jenisJasa || "",
          caraBayar: initialTrx.caraBayar || "Transfer Bank BCA",
          price: initialTrx.price !== undefined ? initialTrx.price : "",
          dp: initialTrx.dp !== undefined ? initialTrx.dp : "",
          ket: initialTrx.ket || "Belum Lunas",
          tglPelunasan: initialTrx.tglPelunasan || ""
        });
      } else {
        // Mode Input Transaksi Baru -> Pop-Up Modal dengan tanggal otomatis hari ini
        setFormData({
          no: defaultNo,
          tanggal: getTodayString(),
          jenisJasa: "",
          caraBayar: "Transfer Bank BCA",
          price: "",
          dp: "",
          ket: "Belum Lunas",
          tglPelunasan: ""
        });
      }
    }
  }, [initialTrx, defaultNo, isOpen]);

  // Handle ESC key to close popup modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const priceNum = Math.max(0, Number(formData.price) || 0);
  const dpNum = Math.max(0, Number(formData.dp) || 0);
  const sisaNum = Math.max(0, priceNum - dpNum);

  const handlePriceChange = (val) => {
    const p = Math.max(0, Number(val) || 0);
    const d = Number(formData.dp) || 0;
    const computedSisa = p - d;
    const isLunas = computedSisa <= 0 && p > 0;

    setFormData((prev) => ({
      ...prev,
      price: val,
      ket: isLunas ? "Lunas" : prev.ket,
      tglPelunasan: isLunas ? (prev.tglPelunasan || prev.tanggal || getTodayString()) : prev.tglPelunasan
    }));
  };

  const handleDpChange = (val) => {
    const d = Math.max(0, Number(val) || 0);
    const p = Number(formData.price) || 0;
    const computedSisa = p - d;
    const isLunas = computedSisa <= 0 && p > 0;

    setFormData((prev) => ({
      ...prev,
      dp: val,
      ket: isLunas ? "Lunas" : prev.ket,
      tglPelunasan: isLunas ? (prev.tglPelunasan || prev.tanggal || getTodayString()) : prev.tglPelunasan
    }));
  };

  const handleKetChange = (newKet) => {
    setFormData((prev) => ({
      ...prev,
      ket: newKet,
      tglPelunasan: newKet === "Lunas" ? (prev.tglPelunasan || prev.tanggal || getTodayString()) : prev.tglPelunasan
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jenisJasa.trim()) {
      showAlertError("Data Belum Lengkap", "Silakan isi Jenis Jasa / Layanan terlebih dahulu.");
      return;
    }
    if (!formData.price || priceNum <= 0) {
      showAlertError("Nominal Tidak Valid", "Silakan masukkan Harga Total (Price) yang lebih dari 0.");
      return;
    }

    onSave({
      ...formData,
      no: Number(formData.no),
      price: priceNum,
      dp: dpNum,
      sisa: sisaNum
    });
    showToastSuccess(
      initialTrx ? "Perubahan Disimpan" : "Transaksi Disimpan",
      initialTrx ? `Transaksi No. ${formData.no} diperbarui!` : `Transaksi No. ${formData.no} berhasil disimpan.`
    );
    onClose();
  };

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-card-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Pop-Up Header */}
        <div className="popup-header">
          <div className="popup-header-title-flex">
            <div className="popup-icon-badge">
              <FileText size={22} color="#059669" />
            </div>
            <div>
              <h3 className="popup-title">
                {initialTrx ? `Edit Transaksi (No. ${formData.no})` : `Input Transaksi Harian Baru`}
              </h3>
              <p className="popup-subtitle">
                {initialTrx
                  ? "Perbarui detail transaksi, nominal DP, atau status pelunasan"
                  : `Form input transaksi (Tanggal otomatis: ${formData.tanggal})`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="popup-close-btn" title="Tutup Modal (Esc)">
            <X size={20} />
          </button>
        </div>

        {/* Pop-Up Form Body */}
        <form onSubmit={handleSubmit} className="popup-form-body">
          {/* Group 1: Informasi Layanan */}
          <div className="popup-section-box">
            <div className="popup-section-title">
              <FileText size={16} color="#059669" />
              <span>1. INFORMASI LAYANAN & PENGGUNAAN</span>
            </div>

            <div className="popup-grid-2">
              <div className="popup-field">
                <label>No. Urut Transaksi</label>
                <input
                  type="number"
                  value={formData.no}
                  onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                  required
                />
              </div>

              <div className="popup-field">
                <label>Tanggal Transaksi</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="popup-field">
              <label>Jenis Jasa / Layanan</label>
              <input
                type="text"
                placeholder="Contoh: Jasa Pembuatan Website, Desain UI/UX..."
                value={formData.jenisJasa}
                onChange={(e) => setFormData({ ...formData, jenisJasa: e.target.value })}
                required
              />
            </div>

            <div className="popup-field">
              <label>Cara Bayar / Metode Pembayaran</label>
              <select
                value={formData.caraBayar}
                onChange={(e) => setFormData({ ...formData, caraBayar: e.target.value })}
              >
                <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                <option value="Transfer Bank BRI">Transfer Bank BRI</option>
                <option value="QRIS / E-Wallet">QRIS / E-Wallet (Gopay/OVO/ShopeePay)</option>
                <option value="Cash / Tunai">Cash / Tunai</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Group 2: Nominal & Perhitungan Otomatis */}
          <div className="popup-section-box">
            <div className="popup-section-title">
              <DollarSign size={16} color="#059669" />
              <span>2. NOMINAL BIAYA & PERHITUNGAN OTOMATIS</span>
            </div>

            <div className="popup-grid-2">
              <div className="popup-field">
                <label>Price / Harga Total (Rp)</label>
                <input
                  type="number"
                  placeholder="400000"
                  value={formData.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  required
                />
                <span className="popup-format-badge">{formatRupiah(priceNum)}</span>
              </div>

              <div className="popup-field">
                <label>DP / Uang Muka (Rp)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.dp}
                  onChange={(e) => handleDpChange(e.target.value)}
                />
                <span className="popup-format-badge">{formatRupiah(dpNum)}</span>
              </div>
            </div>

            {/* Live Auto Calculation Result Box */}
            <div className="popup-calc-banner">
              <div>
                <span className="calc-banner-title">Sisa Pembayaran (Piutang)</span>
                <span className="calc-banner-sub">Perhitungan Otomatis: Price dikurangi DP</span>
              </div>
              <div className="calc-banner-amount">
                {formatRupiah(sisaNum)}
              </div>
            </div>
          </div>

          {/* Group 3: Status Pelunasan */}
          <div className="popup-section-box">
            <div className="popup-section-title">
              <CheckCircle2 size={16} color="#059669" />
              <span>3. STATUS KETERANGAN & PELUNASAN</span>
            </div>

            <div className="popup-grid-2">
              <div className="popup-field">
                <label>Keterangan Status</label>
                <select
                  value={formData.ket}
                  onChange={(e) => handleKetChange(e.target.value)}
                  className={formData.ket === "Lunas" ? "select-status-lunas" : "select-status-belum"}
                >
                  <option value="Belum Lunas">Belum Lunas</option>
                  <option value="Lunas">Lunas</option>
                </select>
              </div>

              <div className="popup-field">
                <label>Tanggal Pelunasan</label>
                <input
                  type="date"
                  value={formData.tglPelunasan}
                  onChange={(e) => setFormData({ ...formData, tglPelunasan: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Pop-Up Footer Buttons */}
          <div className="popup-footer-actions">
            <button type="button" onClick={onClose} className="btn-popup-cancel">
              Batal
            </button>
            <button type="submit" className="btn-popup-save">
              <Save size={16} />
              <span>{initialTrx ? "Simpan Perubahan" : "Simpan Transaksi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
