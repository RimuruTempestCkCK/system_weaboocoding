import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";

export function TransactionModal({ isOpen, onClose, onSave, initialTrx, defaultNo }) {
  const [formData, setFormData] = useState({
    no: defaultNo,
    tanggal: new Date().toISOString().split("T")[0],
    jenisJasa: "",
    caraBayar: "Transfer BCA",
    price: "",
    dp: "",
    ket: "Belum Lunas",
    tglPelunasan: ""
  });

  useEffect(() => {
    if (initialTrx) {
      setFormData({
        id: initialTrx.id,
        no: initialTrx.no || defaultNo,
        tanggal: initialTrx.tanggal || "",
        jenisJasa: initialTrx.jenisJasa || "",
        caraBayar: initialTrx.caraBayar || "Transfer BCA",
        price: initialTrx.price || "",
        dp: initialTrx.dp || "",
        ket: initialTrx.ket || "Belum Lunas",
        tglPelunasan: initialTrx.tglPelunasan || ""
      });
    } else {
      setFormData({
        no: defaultNo,
        tanggal: new Date().toISOString().split("T")[0],
        jenisJasa: "",
        caraBayar: "Transfer BCA",
        price: "",
        dp: "",
        ket: "Belum Lunas",
        tglPelunasan: ""
      });
    }
  }, [initialTrx, defaultNo, isOpen]);

  if (!isOpen) return null;

  const priceNum = Number(formData.price) || 0;
  const dpNum = Number(formData.dp) || 0;
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
      tglPelunasan: isLunas ? prev.tanggal || new Date().toISOString().split("T")[0] : prev.tglPelunasan
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
      tglPelunasan: isLunas ? prev.tanggal || new Date().toISOString().split("T")[0] : prev.tglPelunasan
    }));
  };

  const handleKetChange = (newKet) => {
    setFormData((prev) => ({
      ...prev,
      ket: newKet,
      tglPelunasan: newKet === "Lunas" ? (prev.tglPelunasan || prev.tanggal || new Date().toISOString().split("T")[0]) : ""
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      no: Number(formData.no),
      price: priceNum,
      dp: dpNum,
      sisa: sisaNum
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{initialTrx ? `Edit Transaksi No. ${formData.no}` : `Tambah Transaksi (No. ${formData.no})`}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label>No</label>
              <input
                type="number"
                value={formData.no}
                onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Tanggal Transaksi</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Jenis Jasa</label>
            <input
              type="text"
              placeholder="Contoh: Jasa Pembuatan Website, UI/UX, Maintenance..."
              value={formData.jenisJasa}
              onChange={(e) => setFormData({ ...formData, jenisJasa: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Cara Bayar</label>
            <select
              value={formData.caraBayar}
              onChange={(e) => setFormData({ ...formData, caraBayar: e.target.value })}
            >
              <option value="Transfer BCA">Transfer Bank BCA</option>
              <option value="Transfer Mandiri">Transfer Bank Mandiri</option>
              <option value="Transfer BRI">Transfer Bank BRI</option>
              <option value="QRIS / E-Wallet">QRIS / E-Wallet (Gopay/OVO/ShopeePay)</option>
              <option value="Cash">Cash / Tunai</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Price (Rp)</label>
              <input
                type="number"
                placeholder="400000"
                value={formData.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>DP (Rp)</label>
              <input
                type="number"
                placeholder="50000"
                value={formData.dp}
                onChange={(e) => handleDpChange(e.target.value)}
              />
            </div>
          </div>

          {/* Computed Auto Field */}
          <div className="computed-sisa-box">
            <span>Sisa Pembayaran Otomatis:</span>
            <span className="computed-value">
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(sisaNum)}
            </span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Keterangan Status</label>
              <select
                value={formData.ket}
                onChange={(e) => handleKetChange(e.target.value)}
              >
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Lunas">Lunas</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tanggal Pelunasan</label>
              <input
                type="date"
                value={formData.tglPelunasan}
                disabled={formData.ket !== "Lunas"}
                onChange={(e) => setFormData({ ...formData, tglPelunasan: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Batal
            </button>
            <button type="submit" className="btn-save">
              <Save size={16} />
              <span>Simpan Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
