import React from "react";
import { Eye, TrendingUp, DollarSign, AlertTriangle, CheckCheck, FileText, Printer } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TransactionTable } from "./TransactionTable";
import { formatRupiah } from "../utils/exportUtils";

export function OwnerDashboard({ monthData }) {
  const transactions = monthData?.transactions || [];
  const filledTransactions = transactions.filter((t) => t.jenisJasa || t.price > 0);

  const totalPrice = filledTransactions.reduce((acc, t) => acc + (Number(t.price) || 0), 0);
  const totalDp = filledTransactions.reduce((acc, t) => acc + (Number(t.dp) || 0), 0);
  const totalSisa = filledTransactions.reduce((acc, t) => acc + (Number(t.sisa) || 0), 0);
  const totalLunas = filledTransactions.filter((t) => t.ket === "Lunas").length;
  const totalBelum = filledTransactions.filter((t) => t.ket === "Belum Lunas").length;
  const lunasRate = filledTransactions.length > 0 ? Math.round((totalLunas / filledTransactions.length) * 100) : 0;

  // Chart Data Preparation
  const barChartData = filledTransactions.map((t) => ({
    name: `No.${t.no} ${t.jenisJasa ? t.jenisJasa.substring(0, 14) + "..." : ""}`,
    Price: t.price || 0,
    DP: t.dp || 0,
    Sisa: t.sisa ?? (t.price - t.dp)
  }));

  const pieChartData = [
    { name: "Lunas", value: totalLunas, color: "#059669" },
    { name: "Belum Lunas", value: totalBelum, color: "#f59e0b" }
  ].filter((d) => d.value > 0);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="dashboard-container owner-dashboard">
      {/* Owner Header Banner */}
      <div className="owner-banner">
        <div className="banner-content">
          <div className="banner-badge owner-badge-theme">
            <Eye size={18} />
            <span>Mode Owner (Laporan & Analytics)</span>
          </div>
          <h2>Laporan Ringkasan & Rekapitulasi - {monthData?.monthName}</h2>
          <p>
            Tampilan khusus Executive Owner untuk memantau performa pendapatan, arus kas masuk, serta status pelunasan transaksi secara realtime.
          </p>
        </div>
        <div className="banner-actions">
          <button onClick={handlePrintReport} className="btn-print-report">
            <Printer size={18} />
            <span>Cetak Laporan (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="kpi-grid">
        <div className="kpi-card text-emerald border-left-emerald">
          <div className="kpi-header-flex">
            <span className="kpi-label">Total Omset Pendapatan</span>
            <div className="kpi-icon-wrapper icon-emerald">
              <DollarSign size={20} />
            </div>
          </div>
          <h3 className="kpi-value">{formatRupiah(totalPrice)}</h3>
          <p className="kpi-sub">Target omset bulan {monthData?.monthName}</p>
        </div>

        <div className="kpi-card text-blue border-left-blue">
          <div className="kpi-header-flex">
            <span className="kpi-label">Kas Masuk (Total DP)</span>
            <div className="kpi-icon-wrapper icon-blue">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="kpi-value">{formatRupiah(totalDp)}</h3>
          <p className="kpi-sub">Uang muka tunai / transfer diterima</p>
        </div>

        <div className="kpi-card text-amber border-left-amber">
          <div className="kpi-header-flex">
            <span className="kpi-label">Total Sisa Piutang</span>
            <div className="kpi-icon-wrapper icon-amber">
              <AlertTriangle size={20} />
            </div>
          </div>
          <h3 className="kpi-value">{formatRupiah(totalSisa)}</h3>
          <p className="kpi-sub">{totalBelum} transaksi belum lunas</p>
        </div>

        <div className="kpi-card text-purple border-left-purple">
          <div className="kpi-header-flex">
            <span className="kpi-label">Tingkat Pelunasan</span>
            <div className="kpi-icon-wrapper icon-purple">
              <CheckCheck size={20} />
            </div>
          </div>
          <h3 className="kpi-value">{lunasRate}%</h3>
          <p className="kpi-sub">{totalLunas} dari {filledTransactions.length} transaksi selesai</p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="charts-grid">
        {/* Bar Chart: Price vs DP vs Sisa */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Grafik Komposisi Pembayaran per Transaksi</h3>
            <span className="chart-subtitle">Price vs DP vs Sisa Pembayaran</span>
          </div>
          <div className="chart-wrapper">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tickFormatter={(val) => `Rp${val / 1000}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatRupiah(value)} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar dataKey="Price" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Price" />
                  <Bar dataKey="DP" fill="#10b981" radius={[4, 4, 0, 0]} name="DP Masuk" />
                  <Bar dataKey="Sisa" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Sisa Piutang" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">Belum ada grafik transaksi pada bulan ini.</div>
            )}
          </div>
        </div>

        {/* Donut Chart: Lunas vs Belum Lunas */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Status Pelunasan Transaksi</h3>
            <span className="chart-subtitle">Proporsi Lunas & Belum Lunas</span>
          </div>
          <div className="chart-wrapper pie-chart-wrapper">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Transaksi`, "Jumlah"]} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">Belum ada data status pelunasan.</div>
            )}
          </div>
        </div>
      </div>

      {/* Read-Only Recap Table section */}
      <div className="owner-table-section">
        <div className="section-title-bar">
          <FileText size={20} color="#059669" />
          <h3>Tabel Rekapitulasi Data Keuangan (Read-Only)</h3>
        </div>

        <TransactionTable
          monthData={monthData}
          role="owner"
        />
      </div>
    </div>
  );
}
