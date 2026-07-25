import React, { useState, useEffect } from "react";
import { Database, CheckCircle2, AlertCircle, X, Save, Copy, RefreshCw, Server, Unplug, ShieldCheck } from "lucide-react";
import { getSupabaseCredentials, reinitSupabaseClient } from "../utils/supabaseClient";
import { seedInitialDataToSupabase, seedInitialUsersToSupabase, fetchAllMonthDataFromSupabase } from "../utils/supabaseService";
import { INITIAL_MONTHLY_DATA, MOCK_USERS } from "../initialData";

export function SupabaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [url, setUrl] = useState("");
  const [anonKey, setAnonKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url || "");
      setAnonKey(creds.anonKey || "");
      setIsSaved(creds.isConfigured);
      setStatusMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");

    try {
      const creds = reinitSupabaseClient(url.trim(), anonKey.trim());
      if (creds.isConfigured) {
        setIsSaved(true);
        setStatusMsg("Berhasil menyimpan kredensial Supabase!");
        
        // Seed users & initial data
        await seedInitialUsersToSupabase(MOCK_USERS);
        const remoteData = await fetchAllMonthDataFromSupabase();
        if (!remoteData || Object.keys(remoteData).length === 0) {
          setStatusMsg("Terkoneksi! Melakukan seeding data awal ke Supabase...");
          await seedInitialDataToSupabase(INITIAL_MONTHLY_DATA);
        }
        
        if (onConfigSaved) {
          onConfigSaved();
        }
      } else {
        setIsSaved(false);
        setStatusMsg("Project URL atau Anon Key tidak boleh kosong.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Gagal mengonfirmasi koneksi Supabase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetCreds = () => {
    if (window.confirm("Apakah Anda yakin ingin memutus koneksi Supabase? Aplikasi akan beralih ke penyimpanan lokal browser.")) {
      reinitSupabaseClient("", "");
      setUrl("");
      setAnonKey("");
      setIsSaved(false);
      setStatusMsg("Kredensial Supabase dihapus. Menggunakan storage lokal.");
      if (onConfigSaved) onConfigSaved();
    }
  };

  const handleCopySql = () => {
    const sqlScript = `-- ======================================================
-- SCRIPT SETUP DATABASE WEABOOCODING UNTUK SUPABASE
-- ======================================================
-- 1. Tabel Rekap Bulanan
CREATE TABLE IF NOT EXISTS public.recap_months (
  month_key TEXT PRIMARY KEY,
  month_name TEXT NOT NULL,
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Transaksi Harian
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_key TEXT REFERENCES public.recap_months(month_key) ON DELETE CASCADE,
  no INTEGER NOT NULL,
  tanggal TEXT DEFAULT '',
  jenis_jasa TEXT DEFAULT '',
  cara_bayar TEXT DEFAULT '',
  price NUMERIC(15, 2) DEFAULT 0,
  dp NUMERIC(15, 2) DEFAULT 0,
  sisa NUMERIC(15, 2) DEFAULT 0,
  ket TEXT DEFAULT 'Belum Lunas',
  tgl_pelunasan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Users / Pengguna
CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS & Allow Public Access
ALTER TABLE public.recap_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for recap_months" ON public.recap_months FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for recap_months" ON public.recap_months FOR ALL USING (true);

CREATE POLICY "Allow public read for transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete for transactions" ON public.transactions FOR ALL USING (true);

CREATE POLICY "Allow public read for app_users" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for app_users" ON public.app_users FOR ALL USING (true);`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="sp-modal-overlay" onClick={onClose}>
      <div className="sp-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sp-modal-header">
          <div className="sp-modal-title-wrapper">
            <div className="sp-header-icon-box">
              <Database size={22} color="#10B981" />
            </div>
            <div>
              <div className="sp-header-badge">SUPABASE CLOUD DATABASE</div>
              <h3 className="sp-header-title">Konfigurasi Database Cloud</h3>
            </div>
          </div>
          <button className="sp-btn-close" onClick={onClose} title="Tutup">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="sp-modal-body">
          {/* Status Indicator Card */}
          <div className={`sp-status-card ${isSaved ? "sp-connected" : "sp-disconnected"}`}>
            <div className="sp-status-icon-wrap">
              {isSaved ? <CheckCircle2 size={22} color="#059669" /> : <AlertCircle size={22} color="#d97706" />}
            </div>
            <div className="sp-status-text">
              <div className="sp-status-headline">
                <strong>{isSaved ? "Terhubung ke Supabase Cloud" : "Database Belum Terhubung"}</strong>
                {isSaved && <span className="sp-active-pill">LIVE SINKRON</span>}
              </div>
              <p>
                {isSaved
                  ? "Seluruh transaksi, rekap bulanan, dan akun pengguna tersimpan otomatis ke Supabase PostgreSQL."
                  : "Masukkan Supabase Project URL dan Anon Key untuk mengaktifkan database realtime."}
              </p>
            </div>
          </div>

          {/* Toast / Alert Message */}
          {statusMsg && <div className="sp-alert-banner">{statusMsg}</div>}

          {/* Form Credentials */}
          <form onSubmit={handleSave} className="sp-form-content">
            <div className="sp-input-group">
              <label htmlFor="sp-url">
                Supabase Project URL <span className="sp-required">*</span>
              </label>
              <input
                id="sp-url"
                type="url"
                placeholder="https://krpyihfukvqxhhwggcft.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="sp-input-field"
                required
              />
              <span className="sp-field-hint">Dapat ditemukan di Supabase Dashboard → Project Settings → API</span>
            </div>

            <div className="sp-input-group">
              <label htmlFor="sp-key">
                Supabase Anon / Publishable API Key <span className="sp-required">*</span>
              </label>
              <textarea
                id="sp-key"
                placeholder="sb_publishable_... atau eyJhbGciOi... (Anon Key)"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="sp-input-field sp-code-font"
                rows={3}
                required
              />
            </div>

            <div className="sp-form-actions">
              <button type="submit" className="sp-btn-submit" disabled={loading}>
                {loading ? <RefreshCw size={16} className="spin-icon" /> : <Save size={16} />}
                <span>{loading ? "Menghubungkan..." : "Simpan & Hubungkan"}</span>
              </button>

              {isSaved && (
                <button type="button" onClick={handleResetCreds} className="sp-btn-disconnect">
                  <Unplug size={16} />
                  <span>Putus Koneksi</span>
                </button>
              )}
            </div>
          </form>

          {/* Quick SQL DDL Section */}
          <div className="sp-sql-container">
            <div className="sp-sql-header">
              <div className="sp-sql-title">
                <Server size={16} color="#059669" />
                <span>Script Setup SQL DDL</span>
              </div>
              <button type="button" onClick={handleCopySql} className="sp-btn-copy-sql">
                {copiedSql ? <ShieldCheck size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copiedSql ? "Tersalin ke Clipboard!" : "Salin Script SQL"}</span>
              </button>
            </div>
            <p className="sp-sql-desc">
              Jalankan script ini di menu <strong>SQL Editor</strong> dashboard Supabase untuk membuat tabel `recap_months`, `transactions`, dan `app_users`.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
