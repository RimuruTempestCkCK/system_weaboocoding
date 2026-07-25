import React, { useState } from "react";
import { ShieldCheck, Eye, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { MOCK_USERS } from "../initialData";

export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setErrorMsg("Username atau password salah! Silakan coba lagi.");
    }
  };

  const handleQuickLogin = (role) => {
    const foundUser = MOCK_USERS.find((u) => u.role === role);
    if (foundUser) {
      onLogin(foundUser);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-background-glow"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand-icon">
            <Sparkles size={28} color="#059669" />
          </div>
          <h2>Portal Rekap & Laporan Keuangan</h2>
          <p>Silakan masuk menggunakan akun atau pilih Mode Quick Demo untuk mencoba aplikasi.</p>
        </div>

        {errorMsg && <div className="login-error-alert">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                placeholder="Masukkan username (admin / owner)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-login-submit">
            <span>Masuk</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-divider">
          <span>Atau Akses Langsung Demo (1-Click Login)</span>
        </div>

        <div className="quick-login-grid">
          {/* Admin Quick Login */}
          <div className="quick-login-card admin-quick" onClick={() => handleQuickLogin("admin")}>
            <div className="quick-card-header">
              <div className="icon-badge admin-badge">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4>Role Admin</h4>
                <span className="role-tag admin-tag">Full Input & Edit</span>
              </div>
            </div>
            <ul className="quick-card-features">
              <li><CheckCircle2 size={14} /> Input & Edit Transaksi Jasa</li>
              <li><CheckCircle2 size={14} /> Atur DP, Sisa, & Status Lunas</li>
              <li><CheckCircle2 size={14} /> Kelola Catatan Perbulan</li>
            </ul>
            <button className="btn-quick-action btn-admin-action">
              Masuk sebagai Admin &rarr;
            </button>
          </div>

          {/* Owner Quick Login */}
          <div className="quick-login-card owner-quick" onClick={() => handleQuickLogin("owner")}>
            <div className="quick-card-header">
              <div className="icon-badge owner-badge">
                <Eye size={20} />
              </div>
              <div>
                <h4>Role Owner</h4>
                <span className="role-tag owner-tag">Laporan & Rekap (Read-Only)</span>
              </div>
            </div>
            <ul className="quick-card-features">
              <li><CheckCircle2 size={14} /> Lihat Grafik Analysis Keuangan</li>
              <li><CheckCircle2 size={14} /> Pantau Rekap Transaksi & Sisa Piutang</li>
              <li><CheckCircle2 size={14} /> Export Laporan CSV / Print PDF</li>
            </ul>
            <button className="btn-quick-action btn-owner-action">
              Masuk sebagai Owner &rarr;
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>&copy; 2026 PosJasaku - Solusi Rekap Keuangan Jasa</p>
        </div>
      </div>
    </div>
  );
}
