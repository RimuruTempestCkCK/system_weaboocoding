import React, { useState } from "react";
import { Edit2, Trash2, CheckCircle, FileSpreadsheet, PlusCircle, StickyNote } from "lucide-react";
import { formatRupiah, exportToCSV } from "../utils/exportUtils";

export function TransactionTable({
  monthData,
  role,
  onEditTransaction,
  onDeleteTransaction,
  onQuickToggleLunas,
  onAddRow,
  onUpdateCatatan
}) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(monthData?.catatan || "");

  if (!monthData) return <div className="no-data-msg">Data bulan tidak ditemukan.</div>;

  const transactions = monthData.transactions || [];

  // Summary totals
  const totalPrice = transactions.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const totalDp = transactions.reduce((acc, item) => acc + (Number(item.dp) || 0), 0);
  const totalSisa = transactions.reduce((acc, item) => acc + (Number(item.sisa) || 0), 0);
  const totalLunasCount = transactions.filter((item) => item.ket === "Lunas" && (item.jenisJasa || item.price > 0)).length;
  const totalFilledCount = transactions.filter((item) => item.jenisJasa || item.price > 0).length;

  const handleSaveNotes = () => {
    onUpdateCatatan(notesInput);
    setIsEditingNotes(false);
  };

  return (
    <div className="recap-table-wrapper">
      {/* Table Title Header */}
      <div className="table-top-bar">
        <div>
          <h2 className="table-month-header">{monthData.monthName}</h2>
          <p className="table-month-sub">
            Total {totalFilledCount} Transaksi Selesai/Proses ({totalLunasCount} Lunas)
          </p>
        </div>
        <div className="table-action-buttons">
          <button
            onClick={() => exportToCSV(monthData)}
            className="btn-export-csv"
            title="Download CSV / Excel"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>

          {role === "admin" && (
            <button onClick={onAddRow} className="btn-add-row">
              <PlusCircle size={16} />
              <span>Tambah Baris (+1)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="table-responsive-container">
        <table className="styled-recap-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}>No</th>
              <th style={{ width: "110px" }}>Tanggal</th>
              <th>Jenis Jasa</th>
              <th>Cara Bayar</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "right" }}>DP</th>
              <th style={{ textAlign: "right" }}>Sisa Pembayaran</th>
              <th style={{ textAlign: "center" }}>Ket (Lunas/Belum)</th>
              <th style={{ width: "120px" }}>Tgl Pelunasan</th>
              {role === "admin" && <th style={{ textAlign: "center", width: "110px" }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, idx) => {
              const isFilled = trx.jenisJasa || trx.price > 0;
              const isLunas = trx.ket === "Lunas";

              return (
                <tr key={trx.id || idx} className={!isFilled ? "empty-row" : isLunas ? "row-lunas" : "row-belum"}>
                  <td style={{ textAlign: "center", fontWeight: "600" }}>{trx.no}</td>
                  <td>{trx.tanggal || "-"}</td>
                  <td className="cell-jenis-jasa">
                    {trx.jenisJasa ? trx.jenisJasa : <span className="placeholder-text">-</span>}
                  </td>
                  <td>{trx.caraBayar || "-"}</td>
                  <td style={{ textAlign: "right" }} className="cell-number">
                    {trx.price ? formatRupiah(trx.price) : "Rp0"}
                  </td>
                  <td style={{ textAlign: "right" }} className="cell-number">
                    {trx.dp ? formatRupiah(trx.dp) : "Rp0"}
                  </td>
                  <td style={{ textAlign: "right" }} className="cell-number cell-sisa">
                    {formatRupiah(trx.sisa ?? (trx.price - trx.dp))}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {isFilled ? (
                      <span className={`status-pill ${isLunas ? "pill-lunas" : "pill-belum"}`}>
                        {trx.ket || "Belum Lunas"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{trx.tglPelunasan || "-"}</td>
                  {role === "admin" && (
                    <td>
                      <div className="table-actions-cell">
                        <button
                          onClick={() => onEditTransaction(trx)}
                          className="btn-action-icon edit"
                          title="Edit Baris"
                        >
                          <Edit2 size={14} />
                        </button>
                        {isFilled && !isLunas && (
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
                          title="Hapus Baris"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {/* Total Transaksi summary row matching requested design */}
            <tr className="footer-summary-row">
              <td colSpan={4} className="footer-summary-label">
                Total Transaksi
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
                  {totalLunasCount} dari {totalFilledCount} Lunas
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Catatan Section (Matching user spec: "catatan: kita nikin rekap perbulan") */}
      <div className="notes-section">
        <div className="notes-header">
          <div className="notes-title">
            <StickyNote size={18} color="#059669" />
            <h3>Catatan Rekap Perbulan</h3>
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
