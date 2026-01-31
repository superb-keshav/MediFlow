import { useState } from "react";
import AdminLogin from "./AdminLogin";
import Dashboard from "./Dashboard";
import AdminMedicineList from "./AdminMedicineList";
import ExpiryDashboard from "./ExpiryDashboard";
import AdminStats from "./AdminStats";
import CustomerView from "./CustomerView";
import "./Admin.css";

function App() {
  const [token, setToken] = useState(null);
  const [mode, setMode] = useState("customer"); // customer | admin
  const [adminView, setAdminView] = useState("add"); // add | list | expiry
  const [dark, setDark] = useState(false);
  const [stockFilter, setStockFilter] = useState(null); // null | "low"

  /* ---------------- CUSTOMER MODE ---------------- */

  /* ---------------- CUSTOMER MODE ---------------- */
if (mode === "customer") {
  return (
    <div>
      {/* CUSTOMER HEADER */}
      <div className="customer-header">
        <div className="brand">🏥 MedStore</div>

        <div className="header-actions">
          <button
            className="dark-toggle"
            onClick={() => setDark(!dark)}
            title="Toggle Dark Mode"
          >
            {dark ? "☀" : "🌙"}
          </button>

          <button
            className="admin-login-btn"
            onClick={() => setMode("admin")}
          >
            Admin Login
          </button>
        </div>
      </div>

      <CustomerView dark={dark} />
    </div>
  );
}


  /* ---------------- ADMIN LOGIN ---------------- */
  if (!token) {
    return <AdminLogin setToken={setToken} />;
  }

  /* ---------------- ADMIN DASHBOARD ---------------- */
  return (
    <div className={`admin-container ${dark ? "dark" : ""}`}>
      {/* HEADER */}
      <div className="admin-header">
        🏥 Medical Inventory Admin Panel
      </div>

      {/* NAVIGATION BAR */}
      <div className="admin-nav">
        <button
          className={adminView === "add" ? "active" : ""}
          onClick={() => {
            setAdminView("add");
            setStockFilter(null);
          }}
        >
          ➕ Add Medicine
        </button>

        <button
          className={adminView === "list" ? "active" : ""}
          onClick={() => {
            setAdminView("list");
            setStockFilter(null); // show all
          }}
        >
          📦 Manage Stock
        </button>

        <button
          className={adminView === "expiry" ? "active" : ""}
          onClick={() => {
            setAdminView("expiry");
            setStockFilter(null);
          }}
        >
          ⏰ Expiry Alerts
        </button>

        <button onClick={() => setDark(!dark)}>
          {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          className="logout"
          onClick={() => {
            setToken(null);
            setMode("customer");
            setDark(false);
            setStockFilter(null);
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-content">
        {/* DASHBOARD STATS */}
        <AdminStats
          onLowStockClick={() => {
            setAdminView("list");
            setStockFilter("low"); // activate low-stock filter
          }}
        />

        {/* VIEWS */}
        {adminView === "add" && <Dashboard token={token} />}

        {adminView === "list" && (
          <AdminMedicineList
            token={token}
            filter={stockFilter}
          />
        )}

        {adminView === "expiry" && <ExpiryDashboard />}
      </div>
    </div>
  );
}

export default App;
