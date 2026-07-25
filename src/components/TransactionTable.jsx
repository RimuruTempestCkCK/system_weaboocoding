import React, { useState } from "react";
import { Edit2, Trash2, CheckCircle, StickyNote, Calendar } from "lucide-react";
import { formatRupiah } from "../utils/exportUtils";

export function TransactionTable({
  monthData,
  role,
  onEditTransaction,
  onDeleteTransaction,
  onQuickToggleLunas,
  onUpdateCatatan
}) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(monthData?.catatan || "");

  if (!monthData) return <div className="no-data-msg">Data bulan tidak ditemukan.</div>;

  const transactions = monthData.transactions || [];

  // Automatic calculation summaries
  const totalPrice = transactions.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const totalDp = transactions.reduce((acc, item) => acc + (Number(item.dp) || 0), 0);
  const totalSisa = transactions.reduce((acc, item) => acc + (Number(item.sisa) || 0), 0);
  const totalLunasCount = transactions.filter((item) => item.ket === "Lunas").length;

  const handleSaveNotes = () => {
    onUpdateCatatan(notesInput);
    setIsEditingNotes(false);
  };

  return (
    <div className="recap-table-wrapper">
      {/* Table Title Header */}
      <div className="table-top-bar">
        <div className="table-title-group">
          <div className="table-month-badge">
            <Calendar size={18} color="#059669" />
            <h2 className="table-month-header">{monthData.monthName}</h2>
          </div>
          <p className="table-month-sub">
            Total {transactions.length} transaksi diinput pada bulan ini ({totalLunasCount} Lunas)
          </p>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="table-responsive-container">
        <table className="styled-recap-table">
          <thead>
            <tr>
              <th style={{ width: "55px", textAlign: "center" }}>No</th>
              <th style={{ width: "115px" }}>Tanggal</th>
              <th>Jenis Jasa</th>
              <th>Cara Bayar</th>
              <th style={{ textAlign: "right" }}>Price (Rp)</th>
              <th style={{ textAlign: "right" }}>DP (Rp)</th>
              <th style={{ textAlign: "right" }}>Sisa Pembayaran</th>
              <th style={{ textAlign: "center" }}>Ket (Lunas/Belum)</th>
              <th style={{ width: "120px" }}>Tgl Pelunasan</th>
              {role === "admin" && <th style={{ textAlign: "center", width: "100px" }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((trx, idx) => {
                const isLunas = trx.ket === "Lunas";

                return (
                  <tr key={trx.id || idx} className={isLunas ? "row-lunas" : "row-belum"}>
                    <td style={{ textAlign: "center", fontWeight: "700" }}>{trx.no}</td>
                    <td className="cell-date">{trx.tanggal || "-"}</td>
                    <td className="cell-jenis-jasa">{trx.jenisJasa || "-"}</td>
                    <td>{trx.caraBayar || "-"}</td>
                    <td style={{ textAlign: "right" }} className="cell-number">
                      {formatRupiah(trx.price)}
                    </td>
                    <td style={{ textAlign: "right" }} className="cell-number">
                      {formatRupiah(trx.dp)}
                    </td>
                    <td style={{ textAlign: "right" }} className="cell-number cell-sisa">
                      {formatRupiah(trx.sisa ?? (trx.price - trx.dp))}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`status-pill ${isLunas ? "pill-lunas" : "pill-belum"}`}>
                        {trx.ket || "Belum Lunas"}
                      </span>
                    </td>
                    <td className="cell-date">{trx.tglPelunasan || "-"}</td>
                    {role === "admin" && (
                      <td>
                        <div className="table-actions-cell">
                          <button
                            onClick={() => onEditTransaction(trx)}
                            className="btn-action-icon edit"
                            title="Edit Transaksi (Pop-up)"
                          >
                            <Edit2 size={14} />
                          </button>
                          {!isLunas && (
                            <button
                              onClick={() => onQuickToggleLunas(trx)}
                              className="btn-action-icon lunas"
                              title="Tandai Lunas"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteTransaction(trx.id)}
                            className="btn-action-icon delete"
                            title="Hapus Transaksi Ini"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={role === "admin" ? 10 : 9} className="empty-table-cell">
                  Belum ada transaksi diinput pada bulan ini. Klik <strong>"Input Transaksi Baru"</strong> untuk menginput data harian.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {/* Automatic Calculations Summary Row */}
            <tr className="footer-summary-row">
              <td colSpan={4} className="footer-summary-label">
                Total Perhitungan Otomatis
              </td>
              <td style={{ textAlign: "right" }} className="cell-summary-val">
                {formatRupiah(totalPrice)}
              </td>
              <td style={{ textAlign: "right" }} className="cell-summary-val">
                {formatRupiah(totalDp)}
              </td>
              <td style={{ textAlign: "right" }} className="cell-summary-val highlight-sisa">
                {formatRupiah(totalSisa)}
              </td>
              <td colSpan={role === "admin" ? 3 : 2} className="cell-summary-extra">
                <span className="summary-badge">
                  {totalLunasCount} dari {transactions.length} Transaksi Lunas
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Catatan Perbulan Section */}
      <div className="notes-section">
        <div className="notes-header">
          <div className="notes-title">
            <StickyNote size={18} color="#059669" />
            <h3>Catatan Rekap Perbulan ({monthData.monthName})</h3>
          </div>
          {role === "admin" && !isEditingNotes && (
            <button onClick={() => { setNotesInput(monthData.catatan || ""); setIsEditingNotes(true); }} className="btn-edit-notes">
              Edit Catatan
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="notes-edit-box">
            <textarea
              rows={3}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Tulis catatan perbulan di sini..."
              className="notes-textarea"
            />
            <div className="notes-actions">
              <button onClick={() => setIsEditingNotes(false)} className="btn-cancel-notes">
                Batal
              </button>
              <button onClick={handleSaveNotes} className="btn-save-notes">
                Simpan Catatan
              </button>
            </div>
          </div>
        ) : (
          <div className="notes-display-box">
            <p>{monthData.catatan || "Belum ada catatan untuk bulan ini."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
