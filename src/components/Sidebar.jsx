import React from "react";
import {
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  Eye,
  Calendar,
  PlusCircle,
  Printer,
  LogOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Database
} from "lucide-react";

export function Sidebar({
  user,
  selectedMonthKey,
  monthDataList,
  onSelectMonth,
  onAddMonthClick,
  onLogout,
  onResetData,
  isCollapsed,
  onToggleCollapse,
  isSupabaseConfigured,
  onOpenSupabaseModal
}) {
  const isOwner = user?.role === "owner";

  return (
    <aside className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header / Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo-wrapper">
          <Sparkles className="brand-icon" size={22} />
        </div>
        {!isCollapsed && (
          <div className="brand-text">
            <h2>WeabooCoding</h2>
            <span className="brand-tagline">Rekap Keuangan</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="sidebar-collapse-btn"
          title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Role Pill Banner */}
      <div className="sidebar-role-container">
        <div className={`sidebar-role-badge ${isOwner ? "role-owner" : "role-admin"}`}>
          {isOwner ? <Eye size={16} /> : <ShieldCheck size={16} />}
          {!isCollapsed && <span>{isOwner ? "Mode Owner" : "Mode Admin"}</span>}
        </div>
      </div>

      {/* Month Selector in Sidebar */}
      <div className="sidebar-section">
        {!isCollapsed && <span className="sidebar-section-title">PILIH BULAN REKAP</span>}
        <div className="sidebar-month-select-wrapper">
          <Calendar size={16} className="month-icon" />
          <select
            value={selectedMonthKey}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="sidebar-month-select"
            title="Pilih Bulan"
          >
            {Object.keys(monthDataList).map((key) => (
              <option key={key} value={key}>
                {monthDataList[key].monthName}
              </option>
            ))}
          </select>
        </div>

        {user?.role === "admin" && (
          <button onClick={onAddMonthClick} className="sidebar-btn-add-month">
            <PlusCircle size={16} />
            {!isCollapsed && <span>+ Bulan Baru</span>}
          </button>
        )}
      </div>

        <div className="sidebar-nav-item active">
          <LayoutDashboard size={18} />
          {!isCollapsed && <span>Dashboard & Rekap</span>}
        </div>

        <button onClick={onOpenSupabaseModal} className="sidebar-nav-item nav-button supabase-item">
          <Database size={18} color="#10B981" />
          {!isCollapsed && (
            <div className="sp-item-text">
              <span>Supabase Cloud</span>
              <span className={`sp-status-dot ${isSupabaseConfigured ? "dot-active" : "dot-warning"}`}>
                {isSupabaseConfigured ? "Terhubung" : "Konfigurasi"}
              </span>
            </div>
          )}
        </button>

        {isOwner && (
          <button onClick={() => window.print()} className="sidebar-nav-item nav-button">
            <Printer size={18} />
            {!isCollapsed && <span>Cetak Laporan PDF</span>}
          </button>
        )}

      {/* Sidebar Footer / User Info & Logout */}
      <div className="sidebar-footer">
        <button onClick={onResetData} className="sidebar-reset-btn" title="Reset Sampel Data">
          <RotateCcw size={16} />
          {!isCollapsed && <span>Reset Sampel Data</span>}
        </button>

        <div className="sidebar-user-card">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <span className="user-display-name">{user?.name}</span>
              <span className="user-role-label">{user?.role === "admin" ? "Administrator" : "Business Owner"}</span>
            </div>
          )}
          <button onClick={onLogout} className="sidebar-logout-btn" title="Keluar">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
