import React, { useState } from "react";
import { DollarSign, CreditCard, AlertCircle, CheckCircle, PlusCircle, ShieldCheck } from "lucide-react";
import { TransactionTable } from "./TransactionTable";
import { TransactionModal } from "./TransactionModal";
import { formatRupiah } from "../utils/exportUtils";

export function AdminDashboard({
  monthData,
  onSaveTransaction,
  onDeleteTransaction,
  onQuickToggleLunas,
  onAddEmptyRow,
  onUpdateCatatan
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState(null);

  const transactions = monthData?.transactions || [];
  const totalPrice = transactions.reduce((acc, t) => acc + (Number(t.price) || 0), 0);
  const totalDp = transactions.reduce((acc, t) => acc + (Number(t.dp) || 0), 0);
  const totalSisa = transactions.reduce((acc, t) => acc + (Number(t.sisa) || 0), 0);
  const totalLunas = transactions.filter((t) => t.ket === "Lunas" && (t.jenisJasa || t.price > 0)).length;
  const totalBelum = transactions.filter((t) => t.ket === "Belum Lunas" && (t.jenisJasa || t.price > 0)).length;

  const handleOpenAddModal = () => {
    setEditingTrx(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trx) => {
    setEditingTrx(trx);
    setIsModalOpen(true);
  };

  const handleSaveModal = (trxData) => {
    onSaveTransaction(trxData);
  };

  // Next row number
  const nextNo = transactions.length > 0 ? Math.max(...transactions.map((t) => t.no || 0)) + 1 : 1;

  return (
    <div className="dashboard-container">
      {/* Admin Welcome Banner */}
      <div className="admin-banner">
        <div className="banner-content">
          <div className="banner-badge">
            <ShieldCheck size={18} />
            <span>Mode Admin / Pengelola Data</span>
          </div>
          <h2>Kelola Rekap Keuangan Jasa ({monthData?.monthName})</h2>
          <p>
            Anda memiliki akses penuh untuk menginput, mengedit, menghapus transaksi, dan memperbarui catatan rekap perbulan.
          </p>
        </div>
        <button onClick={handleOpenAddModal} className="btn-banner-add">
          <PlusCircle size={18} />
          <span>Input Transaksi Baru</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card text-emerald">
          <div className="kpi-icon-wrapper icon-emerald">
            <DollarSign size={22} />
          </div>
          <div>
            <span className="kpi-label">Total Omset (Price)</span>
            <h3 className="kpi-value">{formatRupiah(totalPrice)}</h3>
            <span className="kpi-sub">Total nilai transaksi jasa</span>
          </div>
        </div>

        <div className="kpi-card text-blue">
          <div className="kpi-icon-wrapper icon-blue">
            <CreditCard size={22} />
          </div>
          <div>
            <span className="kpi-label">Total DP Masuk</span>
            <h3 className="kpi-value">{formatRupiah(totalDp)}</h3>
            <span className="kpi-sub">Uang muka yang diterima</span>
          </div>
        </div>

        <div className="kpi-card text-amber">
          <div className="kpi-icon-wrapper icon-amber">
            <AlertCircle size={22} />
          </div>
          <div>
            <span className="kpi-label">Sisa Pembayaran (Piutang)</span>
            <h3 className="kpi-value">{formatRupiah(totalSisa)}</h3>
            <span className="kpi-sub">{totalBelum} Transaksi Belum Lunas</span>
          </div>
        </div>

        <div className="kpi-card text-purple">
          <div className="kpi-icon-wrapper icon-purple">
            <CheckCircle size={22} />
          </div>
          <div>
            <span className="kpi-label">Status Pelunasan</span>
            <h3 className="kpi-value">{totalLunas} Lunas</h3>
            <span className="kpi-sub">{totalBelum} Belum Lunas</span>
          </div>
        </div>
      </div>

      {/* Transaction Table Component */}
      <TransactionTable
        monthData={monthData}
        role="admin"
        onEditTransaction={handleOpenEditModal}
        onDeleteTransaction={onDeleteTransaction}
        onQuickToggleLunas={onQuickToggleLunas}
        onAddRow={onAddEmptyRow}
        onUpdateCatatan={onUpdateCatatan}
      />

      {/* Modal for Add / Edit */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialTrx={editingTrx}
        defaultNo={nextNo}
      />
    </div>
  );
}
