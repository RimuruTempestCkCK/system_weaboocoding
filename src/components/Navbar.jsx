import React from "react";
import { Menu, Calendar, ShieldCheck, Eye, LogOut, ChevronRight, Database } from "lucide-react";

export function Navbar({
  user,
  selectedMonthKey,
  monthDataList,
  onSelectMonth,
  onLogout,
  onToggleSidebar,
  isSupabaseConfigured,
  onOpenSupabaseModal
}) {
  const currentMonthName = monthDataList[selectedMonthKey]?.monthName || "Rekap Bulanan";
  const isOwner = user?.role === "owner";

  return (
    <header className="clean-navbar">
      <div className="navbar-left">
        <button onClick={onToggleSidebar} className="btn-toggle-sidebar" title="Toggle Sidebar">
          <Menu size={20} />
        </button>

        <div className="navbar-breadcrumb">
          <span className="bc-parent">WeabooCoding</span>
          <ChevronRight size={14} className="bc-separator" />
          <span className="bc-current">{currentMonthName}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Supabase Status Indicator & Config Trigger */}
        <button
          onClick={onOpenSupabaseModal}
          className={`supabase-nav-badge ${isSupabaseConfigured ? "sp-connected" : "sp-disconnected"}`}
          title="Konfigurasi Supabase Cloud Database"
        >
          <Database size={14} />
          <span>{isSupabaseConfigured ? "Supabase Active" : "Ke Supabase"}</span>
        </button>

        {/* Quick Month Switcher in Navbar */}
        <div className="quick-month-badge">
          <Calendar size={16} color="#059669" />
          <select
            value={selectedMonthKey}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="quick-month-select"
          >
            {Object.keys(monthDataList).map((key) => (
              <option key={key} value={key}>
                {monthDataList[key].monthName}
              </option>
            ))}
          </select>
        </div>

        {/* Clean Role Badge */}
        <div className={`clean-role-badge ${isOwner ? "role-owner" : "role-admin"}`}>
          {isOwner ? <Eye size={14} /> : <ShieldCheck size={14} />}
          <span>{isOwner ? "Owner (Read-Only)" : "Admin"}</span>
        </div>

        {/* Logout Quick Action */}
        <button onClick={onLogout} className="btn-clean-logout" title="Keluar">
          <LogOut size={16} />
          <span className="logout-text">Keluar</span>
        </button>
      </div>
    </header>
  );
}

