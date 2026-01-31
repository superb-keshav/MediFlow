import { useEffect, useState } from "react";

export default function AdminStats({ onLowStockClick }) {
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    expiring: 0
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/medicines")
      .then(res => res.json())
      .then(data => {
        const today = new Date();
        const next30 = new Date();
        next30.setDate(today.getDate() + 30);

        setStats({
          total: data.length,
          lowStock: data.filter(m => m.quantity <= 10).length,
          expiring: data.filter(m => {
            const exp = new Date(m.expiryDate);
            return exp >= today && exp <= next30;
          }).length
        });
      });
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
      <div className="card">
        📦 Total Medicines<br />
        <b>{stats.total}</b>
      </div>

      <div
        className="card"
        style={{ cursor: "pointer", border: "2px solid #ffc107" }}
        onClick={onLowStockClick}
      >
        ⚠ Low Stock<br />
        <b>{stats.lowStock}</b>
        <div style={{ fontSize: "12px", marginTop: "5px" }}>
          Click to view
        </div>
      </div>

      <div className="card">
        ⏰ Expiring Soon<br />
        <b>{stats.expiring}</b>
      </div>
    </div>
  );
}
