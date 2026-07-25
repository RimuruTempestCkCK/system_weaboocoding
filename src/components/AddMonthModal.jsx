import React, { useState } from "react";
import { X, Calendar, Plus, StickyNote, Sparkles } from "lucide-react";
import { showToastSuccess, showAlertError } from "../utils/alertUtils";

export function AddMonthModal({ isOpen, onClose, onAddMonth }) {
  const [monthName, setMonthName] = useState("");
  const [catatan, setCatatan] = useState("Rekapitulasi transaksi harian.");

  if (!isOpen) return null;

  // Preset generator for current & upcoming months
  const getPresetMonths = () => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const d = new Date();
    const currentMonthIdx = d.getMonth();
    const currentYear = d.getFullYear();

    const presets = [];
    for (let i = 0; i < 4; i++) {
      const idx = (currentMonthIdx + i) % 12;
      const yr = currentYear + Math.floor((currentMonthIdx + i) / 12);
      presets.push(`${months[idx]} ${yr}`);
    }
    return presets;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!monthName.trim()) {
      showAlertError("Nama Bulan Diperlukan", "Silakan isi atau pilih rekomendasi nama bulan terlebih dahulu.");
      return;
    }

    // Generate unique month key (e.g. month-172100000)
    const key = `month-${Date.now()}`;
    onAddMonth({
      monthKey: key,
      monthName: monthName.trim(),
      catatan: catatan.trim(),
      transactions: []
    });

    showToastSuccess(`Bulan Baru Berhasil Dibuat!`, `Rekap bulan "${monthName.trim()}" telah ditambahkan.`);

    setMonthName("");
    setCatatan("Rekapitulasi transaksi harian.");
    onClose();
  };

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup-card-dialog modal-medium" onClick={(e) => e.stopPropagation()}>
        {/* Pop-Up Header */}
        <div className="popup-header">
          <div className="popup-header-title-flex">
            <div className="popup-icon-badge">
              <Calendar size={22} color="#059669" />
            </div>
            <div>
              <h3 className="popup-title">Tambah Rekap Bulan Baru</h3>
              <p className="popup-subtitle">
                Buat lembar kerja rekapitulasi keuangan baru untuk periode bulan tertentu
              </p>
            </div>
          </div>
          <button onClick={onClose} className="popup-close-btn" title="Tutup Modal (Esc)">
            <X size={20} />
          </button>
        </div>

        {/* Pop-Up Form Body */}
        <form onSubmit={handleSubmit} className="popup-form-body">
          {/* Section Box 1: Informasi Bulan */}
          <div className="popup-section-box">
            <div className="popup-section-title">
              <Calendar size={16} color="#059669" />
              <span>1. PERIODE & NAMA BULAN</span>
            </div>

            <div className="popup-field">
              <label htmlFor="input-month-name">Nama Bulan & Tahun <span className="sp-required">*</span></label>
              <div className="popup-input-with-icon">
                <Calendar size={18} className="field-icon" />
                <input
                  id="input-month-name"
                  type="text"
                  placeholder="Contoh: Agustus 2026, September 2026..."
                  value={monthName}
                  onChange={(e) => setMonthName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Month Presets */}
            <div className="preset-month-wrapper">
              <span className="preset-label">
                <Sparkles size={13} color="#059669" /> Pilih Rekomendasi Cepat:
              </span>
              <div className="preset-buttons-grid">
                {getPresetMonths().map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn-preset-month ${monthName === preset ? "active-preset" : ""}`}
                    onClick={() => setMonthName(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Box 2: Catatan Awal */}
          <div className="popup-section-box">
            <div className="popup-section-title">
              <StickyNote size={16} color="#059669" />
              <span>2. CATATAN AWAL REKAPITULASI</span>
            </div>

            <div className="popup-field">
              <label htmlFor="input-catatan">Catatan / Deskripsi Singkat</label>
              <textarea
                id="input-catatan"
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tuliskan catatan rekapitulasi perbulan (opsional)..."
                className="popup-textarea"
              />
            </div>
          </div>

          {/* Pop-Up Footer Buttons */}
          <div className="popup-footer-actions">
            <button type="button" onClick={onClose} className="btn-popup-cancel">
              Batal
            </button>
            <button type="submit" className="btn-popup-save">
              <Plus size={18} />
              <span>Buat Rekap Bulan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
