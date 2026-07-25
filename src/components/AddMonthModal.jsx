import React, { useState } from "react";
import { X, Calendar, Plus } from "lucide-react";

export function AddMonthModal({ isOpen, onClose, onAddMonth }) {
  const [monthName, setMonthName] = useState("");
  const [catatan, setCatatan] = useState("Rekap perbulan.");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!monthName.trim()) return;

    // Generate month key based on input or current time
    const key = `month-${Date.now()}`;
    onAddMonth({
      monthKey: key,
      monthName: monthName.trim(),
      catatan: catatan.trim(),
      transactions: [
        {
          id: `trx-${Date.now()}-1`,
          no: 1,
          tanggal: "",
          jenisJasa: "",
          caraBayar: "",
          price: 0,
          dp: 0,
          sisa: 0,
          ket: "Belum Lunas",
          tglPelunasan: ""
        }
      ]
    });

    setMonthName("");
    setCatatan("Rekap perbulan.");
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-small">
        <div className="modal-header">
          <h3>Tambah Rekap Bulan Baru</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nama Bulan & Tahun</label>
            <div className="input-icon-wrapper">
              <Calendar size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Contoh: Agustus 2026"
                value={monthName}
                onChange={(e) => setMonthName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Catatan Awal Perbulan</label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan rekapitulasi perbulan..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Batal
            </button>
            <button type="submit" className="btn-save">
              <Plus size={16} />
              <span>Buat Bulan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
