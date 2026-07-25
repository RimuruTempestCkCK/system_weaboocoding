import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { OwnerDashboard } from "./components/OwnerDashboard";
import { AddMonthModal } from "./components/AddMonthModal";
import { SupabaseConfigModal } from "./components/SupabaseConfigModal";
import { INITIAL_MONTHLY_DATA } from "./initialData";
import { getSupabaseCredentials } from "./utils/supabaseClient";
import {
  fetchAllMonthDataFromSupabase,
  saveTransactionToSupabase,
  deleteTransactionFromSupabase,
  updateMonthCatatanInSupabase,
  createMonthInSupabase,
  seedInitialDataToSupabase
} from "./utils/supabaseService";

export default function App() {
  // Auth state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("weaboocoding_user") || localStorage.getItem("posjasaku_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Monthly data state
  const [allMonthData, setAllMonthData] = useState(() => {
    const savedData = localStorage.getItem("weaboocoding_recap_data") || localStorage.getItem("posjasaku_recap_data");
    return savedData ? JSON.parse(savedData) : INITIAL_MONTHLY_DATA;
  });

  // Selected Month Key
  const [selectedMonthKey, setSelectedMonthKey] = useState("2026-07");

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Add Month Modal state
  const [isAddMonthModalOpen, setIsAddMonthModalOpen] = useState(false);

  // Supabase Config Modal state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Active Supabase Configured State
  const [isSupabaseActive, setIsSupabaseActive] = useState(() => getSupabaseCredentials().isConfigured);

  // Sync state to LocalStorage as fallback
  useEffect(() => {
    localStorage.setItem("weaboocoding_recap_data", JSON.stringify(allMonthData));
  }, [allMonthData]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("weaboocoding_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("weaboocoding_user");
      localStorage.removeItem("posjasaku_user");
    }
  }, [user]);

  // Sync data from Supabase
  const syncWithSupabase = useCallback(async () => {
    const creds = getSupabaseCredentials();
    setIsSupabaseActive(creds.isConfigured);

    if (creds.isConfigured) {
      const remoteData = await fetchAllMonthDataFromSupabase();
      if (remoteData && Object.keys(remoteData).length > 0) {
        setAllMonthData(remoteData);
      } else {
        // Seed if database is empty
        await seedInitialDataToSupabase(INITIAL_MONTHLY_DATA);
        const seededData = await fetchAllMonthDataFromSupabase();
        if (seededData && Object.keys(seededData).length > 0) {
          setAllMonthData(seededData);
        }
      }
    }
  }, []);

  // Initial fetch from Supabase if configured
  useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Reset data to initial sample
  const handleResetData = () => {
    if (window.confirm("Apakah Anda yakin ingin mengembalikan data ke sampel awal (Juli 2026)?")) {
      setAllMonthData(INITIAL_MONTHLY_DATA);
      setSelectedMonthKey("2026-07");
    }
  };

  // Selected month data object
  const currentMonthData = allMonthData[selectedMonthKey] || Object.values(allMonthData)[0];

  // Save/Edit Transaction
  const handleSaveTransaction = async (trxData) => {
    if (!currentMonthData) return;

    let finalTrx = { ...trxData };

    // If Supabase is connected, save to Cloud
    if (isSupabaseActive) {
      const savedRemote = await saveTransactionToSupabase(selectedMonthKey, trxData);
      if (savedRemote && savedRemote.id) {
        finalTrx.id = savedRemote.id;
      }
    } else if (!finalTrx.id) {
      finalTrx.id = `trx-${Date.now()}`;
    }

    setAllMonthData((prev) => {
      const monthObj = prev[selectedMonthKey] || {
        monthName: selectedMonthKey,
        catatan: "",
        transactions: []
      };
      let updatedTransactions = [...monthObj.transactions];

      const existingIndex = updatedTransactions.findIndex((t) => t.id === finalTrx.id);
      if (existingIndex >= 0) {
        updatedTransactions[existingIndex] = finalTrx;
      } else {
        updatedTransactions.push(finalTrx);
      }

      // Sort by No
      updatedTransactions.sort((a, b) => (a.no || 0) - (b.no || 0));

      return {
        ...prev,
        [selectedMonthKey]: {
          ...monthObj,
          transactions: updatedTransactions
        }
      };
    });
  };

  // Delete Transaction
  const handleDeleteTransaction = async (trxId) => {
    if (!currentMonthData) return;
    if (!window.confirm("Hapus baris transaksi ini?")) return;

    if (isSupabaseActive) {
      await deleteTransactionFromSupabase(trxId);
    }

    setAllMonthData((prev) => {
      const monthObj = prev[selectedMonthKey];
      const updatedTransactions = monthObj.transactions.filter((t) => t.id !== trxId);
      return {
        ...prev,
        [selectedMonthKey]: {
          ...monthObj,
          transactions: updatedTransactions
        }
      };
    });
  };

  // Quick Mark as Lunas
  const handleQuickToggleLunas = (trx) => {
    const todayStr = new Date().toISOString().split("T")[0];
    handleSaveTransaction({
      ...trx,
      ket: "Lunas",
      tglPelunasan: todayStr,
      sisa: 0
    });
  };

  // Update Catatan perbulan
  const handleUpdateCatatan = async (newCatatan) => {
    if (isSupabaseActive) {
      await updateMonthCatatanInSupabase(selectedMonthKey, newCatatan);
    }

    setAllMonthData((prev) => ({
      ...prev,
      [selectedMonthKey]: {
        ...prev[selectedMonthKey],
        catatan: newCatatan
      }
    }));
  };

  // Add new Month recap
  const handleAddMonth = async (newMonthObj) => {
    if (isSupabaseActive) {
      await createMonthInSupabase(newMonthObj.monthKey, newMonthObj.monthName, newMonthObj.catatan || "");
    }

    setAllMonthData((prev) => ({
      ...prev,
      [newMonthObj.monthKey]: newMonthObj
    }));
    setSelectedMonthKey(newMonthObj.monthKey);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      {/* Left Sidebar */}
      <Sidebar
        user={user}
        selectedMonthKey={selectedMonthKey}
        monthDataList={allMonthData}
        onSelectMonth={(key) => setSelectedMonthKey(key)}
        onAddMonthClick={() => setIsAddMonthModalOpen(true)}
        onLogout={handleLogout}
        onResetData={handleResetData}
        monthData={currentMonthData}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSupabaseConfigured={isSupabaseActive}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Right Content Area */}
      <div className="main-wrapper">
        <Navbar
          user={user}
          selectedMonthKey={selectedMonthKey}
          monthDataList={allMonthData}
          onSelectMonth={(key) => setSelectedMonthKey(key)}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSupabaseConfigured={isSupabaseActive}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />

        <main className="content-area">
          {user.role === "admin" ? (
            <AdminDashboard
              monthData={currentMonthData}
              onSaveTransaction={handleSaveTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onQuickToggleLunas={handleQuickToggleLunas}
              onUpdateCatatan={handleUpdateCatatan}
            />
          ) : (
            <OwnerDashboard monthData={currentMonthData} />
          )}
        </main>

        <footer className="clean-footer">
          <div className="footer-content">
            <p>&copy; 2026 WeabooCoding • Sistem Rekapitulasi & Laporan Keuangan Jasa (Supabase Cloud)</p>
          </div>
        </footer>
      </div>

      {/* Modal for creating a new Month Recap */}
      <AddMonthModal
        isOpen={isAddMonthModalOpen}
        onClose={() => setIsAddMonthModalOpen(false)}
        onAddMonth={handleAddMonth}
      />

      {/* Modal for Supabase Configuration */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={syncWithSupabase}
      />
    </div>
  );
}

