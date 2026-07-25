import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./components/LoginPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { OwnerDashboard } from "./components/OwnerDashboard";
import { AddMonthModal } from "./components/AddMonthModal";
import { INITIAL_MONTHLY_DATA } from "./initialData";
import { RotateCcw } from "lucide-react";

export default function App() {
  // Auth state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("posjasaku_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Monthly data state
  const [allMonthData, setAllMonthData] = useState(() => {
    const savedData = localStorage.getItem("posjasaku_recap_data");
    return savedData ? JSON.parse(savedData) : INITIAL_MONTHLY_DATA;
  });

  // Selected Month Key
  const [selectedMonthKey, setSelectedMonthKey] = useState("2026-07");

  // Add Month Modal state
  const [isAddMonthModalOpen, setIsAddMonthModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("posjasaku_recap_data", JSON.stringify(allMonthData));
  }, [allMonthData]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("posjasaku_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("posjasaku_user");
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Reset to default dataset
  const handleResetData = () => {
    if (window.confirm("Apakah Anda yakin ingin mengembalikan data ke sampel awal (Juli 2026)?")) {
      setAllMonthData(INITIAL_MONTHLY_DATA);
      setSelectedMonthKey("2026-07");
    }
  };

  // Current selected month data object
  const currentMonthData = allMonthData[selectedMonthKey] || Object.values(allMonthData)[0];

  // Save/Edit Transaction
  const handleSaveTransaction = (trxData) => {
    if (!currentMonthData) return;

    setAllMonthData((prev) => {
      const monthObj = prev[selectedMonthKey];
      let updatedTransactions = [...monthObj.transactions];

      if (trxData.id) {
        // Edit existing
        updatedTransactions = updatedTransactions.map((t) =>
          t.id === trxData.id ? { ...trxData } : t
        );
      } else {
        // Create new
        const newTrx = {
          ...trxData,
          id: `trx-${Date.now()}`
        };
        updatedTransactions.push(newTrx);
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
  const handleDeleteTransaction = (trxId) => {
    if (!currentMonthData) return;
    if (!window.confirm("Hapus baris transaksi ini?")) return;

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

  // Add blank row (+1 row)
  const handleAddEmptyRow = () => {
    const transactions = currentMonthData?.transactions || [];
    const nextNo = transactions.length > 0 ? Math.max(...transactions.map((t) => t.no || 0)) + 1 : 1;

    handleSaveTransaction({
      no: nextNo,
      tanggal: "",
      jenisJasa: "",
      caraBayar: "",
      price: 0,
      dp: 0,
      sisa: 0,
      ket: "Belum Lunas",
      tglPelunasan: ""
    });
  };

  // Update Catatan perbulan
  const handleUpdateCatatan = (newCatatan) => {
    setAllMonthData((prev) => ({
      ...prev,
      [selectedMonthKey]: {
        ...prev[selectedMonthKey],
        catatan: newCatatan
      }
    }));
  };

  // Add new Month recap
  const handleAddMonth = (newMonthObj) => {
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
    <div className="app-layout">
      {/* Top Header Navbar */}
      <Navbar
        user={user}
        selectedMonthKey={selectedMonthKey}
        monthDataList={allMonthData}
        onSelectMonth={(key) => setSelectedMonthKey(key)}
        onLogout={handleLogout}
        onAddMonthClick={() => setIsAddMonthModalOpen(true)}
      />

      {/* Main View switching based on Role */}
      <main className="main-content">
        {user.role === "admin" ? (
          <AdminDashboard
            monthData={currentMonthData}
            onSaveTransaction={handleSaveTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onQuickToggleLunas={handleQuickToggleLunas}
            onAddEmptyRow={handleAddEmptyRow}
            onUpdateCatatan={handleUpdateCatatan}
          />
        ) : (
          <OwnerDashboard monthData={currentMonthData} />
        )}
      </main>

      {/* Bottom Footer & Reset Data Button */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>&copy; 2026 PosJasaku - Sistem Rekapitulasi Keuangan React (Siap Deploy Vercel)</p>
          <button onClick={handleResetData} className="btn-reset-data" title="Reset Sampel Data">
            <RotateCcw size={14} />
            <span>Reset Data Sampel</span>
          </button>
        </div>
      </footer>

      {/* Modal for creating a new Month Recap */}
      <AddMonthModal
        isOpen={isAddMonthModalOpen}
        onClose={() => setIsAddMonthModalOpen(false)}
        onAddMonth={handleAddMonth}
      />
    </div>
  );
}
