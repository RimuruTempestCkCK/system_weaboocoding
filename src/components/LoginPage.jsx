import React, { useState } from "react";
import { ShieldCheck, Eye, Lock, User, ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { MOCK_USERS } from "../initialData";

export function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState("admin"); // 'admin' or 'owner'
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setErrorMsg("");
    if (role === "admin") {
      setUsername("admin");
      setPassword("admin123");
    } else {
      setUsername("owner");
      setPassword("owner123");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      setErrorMsg("Username atau password salah! Silakan periksa kembali.");
    }
  };

  const handleQuickLogin = (role) => {
    const foundUser = MOCK_USERS.find((u) => u.role === role);
    if (foundUser) {
      onLogin(foundUser);
    }
  };

  return (
    <div className="clean-login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="clean-login-card">
        {/* Top Branding Header */}
        <div className="clean-login-header">
          <div className="clean-brand-logo">
            <Sparkles size={24} color="#059669" />
          </div>
          <h2>PosJasaku</h2>
          <p>Portal Rekapitulasi & Laporan Keuangan Jasa</p>
        </div>

        {/* Clean Role Tabs */}
        <div className="login-role-tabs">
          <button
            type="button"
            className={`role-tab ${selectedRole === "admin" ? "active-tab admin-active" : ""}`}
            onClick={() => handleRoleTabChange("admin")}
          >
            <ShieldCheck size={16} />
            <span>Akses Admin</span>
          </button>
          <button
            type="button"
            className={`role-tab ${selectedRole === "owner" ? "active-tab owner-active" : ""}`}
            onClick={() => handleRoleTabChange("owner")}
          >
            <Eye size={16} />
            <span>Akses Owner</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && <div className="clean-login-alert">{errorMsg}</div>}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="clean-login-form">
          <div className="clean-form-group">
            <label>Username</label>
            <div className="clean-input-box">
              <User className="clean-input-icon" size={18} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="clean-form-group">
            <label>Password</label>
            <div className="clean-input-box">
              <Lock className="clean-input-icon" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`clean-submit-btn ${selectedRole === "owner" ? "btn-theme-owner" : "btn-theme-admin"}`}
          >
            <span>Masuk Sebagai {selectedRole === "admin" ? "Admin" : "Owner"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Clean 1-Click Quick Demo Bar */}
        <div className="clean-quick-login-divider">
          <span>Atau Masuk Cepat (1-Click Demo)</span>
        </div>

        <div className="clean-quick-login-buttons">
          <button
            onClick={() => handleQuickLogin("admin")}
            className="btn-quick-login-admin"
          >
            <ShieldCheck size={16} />
            <span>1-Click Admin (Input & Edit)</span>
          </button>

          <button
            onClick={() => handleQuickLogin("owner")}
            className="btn-quick-login-owner"
          >
            <Eye size={16} />
            <span>1-Click Owner (Laporan Only)</span>
          </button>
        </div>

        <div className="clean-login-footer">
          <p>&copy; 2026 PosJasaku • System Rekap Perbulan Ready for Vercel</p>
        </div>
      </div>
    </div>
  );
}
