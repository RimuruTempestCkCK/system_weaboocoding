import React, { useState, useEffect } from "react";
import { Database, CheckCircle2, AlertCircle, X, Save, Copy, RefreshCw, Server } from "lucide-react";
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
        
        // Seed users & data
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
    reinitSupabaseClient("", "");
    setUrl("");
    setAnonKey("");
    setIsSaved(false);
    setStatusMsg("Kredensial Supabase dihapus.");
    if (onConfigSaved) onConfigSaved();
  };

  const handleCopySql = () => {
    const sqlScript = `-- SCRIPT SETUP SUPABASE WEABOOCODING
CREATE TABLE IF NOT EXISTS public.recap_months (
  month_key TEXT PRIMARY KEY,
  month_name TEXT NOT NULL,
  catatan TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

ALTER TABLE public.recap_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for recap_months" ON public.recap_months FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for recap_months" ON public.recap_months FOR ALL USING (true);
CREATE POLICY "Allow public read for transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete for transactions" ON public.transactions FOR ALL USING (true);`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content supabase-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="header-icon-circle supabase-icon-bg">
              <Database size={20} color="#10B981" />
            </div>
            <div>
              <h3>Konfigurasi Supabase Cloud Database</h3>
              <p className="modal-subtitle">Integrasi Database PostgreSQL Realtime</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Indicator */}
          <div className={`supabase-status-box ${isSaved ? "status-connected" : "status-disconnected"}`}>
            {isSaved ? (
              <>
                <CheckCircle2 size={20} className="status-icon" />
                <div>
                  <strong>Terhubung ke Supabase Cloud</strong>
                  <p>Seluruh data rekap & transaksi tersimpan langsung ke PostgreSQL Supabase.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={20} className="status-icon" />
                <div>
                  <strong>Belum Terhubung ke Supabase</strong>
                  <p>Masukkan Project URL dan Anon Key untuk menghubungkan database Supabase Cloud.</p>
                </div>
              </>
            )}
          </div>

          {statusMsg && <div className="supabase-alert-msg">{statusMsg}</div>}

          <form onSubmit={handleSave} className="supabase-form">
            <div className="form-group">
              <label htmlFor="sp-url">
                Supabase Project URL <span className="req">*</span>
              </label>
              <input
                id="sp-url"
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sp-key">
                Supabase Anon / Public API Key <span className="req">*</span>
              </label>
              <textarea
                id="sp-key"
                placeholder="eyJhYmdj... (Anon Public Key)"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="form-control code-font"
                rows={3}
                required
              />
            </div>

            <div className="supabase-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <RefreshCw size={16} className="spin-icon" /> : <Save size={16} />}
                <span>{loading ? "Menghubungkan..." : "Simpan & Hubungkan"}</span>
              </button>

              {isSaved && (
                <button type="button" onClick={handleResetCreds} className="btn-secondary text-danger">
                  Putus Koneksi Supabase
                </button>
              )}
            </div>
          </form>

          {/* Quick SQL DDL Section */}
          <div className="sql-ddl-box">
            <div className="sql-ddl-header">
              <Server size={16} />
              <span>Script SQL DDL (Tabel `recap_months` & `transactions`)</span>
              <button type="button" onClick={handleCopySql} className="btn-copy-sql">
                {copiedSql ? <CheckCircle2 size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copiedSql ? "Tersalin!" : "Salin SQL"}</span>
              </button>
            </div>
            <p className="sql-hint">
              Jalankan script SQL ini pada menu <strong>SQL Editor</strong> di dashboard Supabase Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
