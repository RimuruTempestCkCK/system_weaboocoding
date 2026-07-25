import React from "react";
import { LogOut, ShieldCheck, Eye, Calendar, Sparkles } from "lucide-react";

export function Navbar({ user, selectedMonthKey, monthDataList, onSelectMonth, onLogout, onAddMonthClick }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo-badge">
          <Sparkles className="logo-icon" size={22} />
        </div>
        <div>
          <h1 className="brand-title">RekapJasa</h1>
          <p className="brand-subtitle">Sistem Rekapitulasi & Laporan Keuangan</p>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Month Selector */}
        <div className="month-picker-container">
          <Calendar size={18} className="month-picker-icon" />
          <select
            value={selectedMonthKey}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="month-picker-select"
          >
            {Object.keys(monthDataList).map((key) => (
              <option key={key} value={key}>
                {monthDataList[key].monthName}
              </option>
            ))}
          </select>
          {user?.role === "admin" && (
            <button
              onClick={onAddMonthClick}
              className="btn-add-month"
              title="Buat Rekap Bulan Baru"
            >
              + Bulan Baru
            </button>
          )}
        </div>

        {/* User Role Badge */}
        <div className={`role-badge ${user?.role === "admin" ? "badge-admin" : "badge-owner"}`}>
          {user?.role === "admin" ? (
            <>
              <ShieldCheck size={16} />
              <span>Akses Admin</span>
            </>
          ) : (
            <>
              <Eye size={16} />
              <span>Akses Owner (Read-Only)</span>
            </>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="user-profile">
          <span className="user-name">{user?.name}</span>
          <button onClick={onLogout} className="btn-logout" title="Keluar">
            <LogOut size={18} />
            <span className="btn-logout-text">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
