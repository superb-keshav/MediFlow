import { useEffect, useState } from "react";

export default function ExpiryDashboard() {
  const [expiringMeds, setExpiringMeds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/medicines")
      .then(res => res.json())
      .then(data => {
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        const filtered = data.filter(med => {
          const exp = new Date(med.expiryDate);
          return exp >= today && exp <= next30Days;
        });

        setExpiringMeds(filtered);
      });
  }, []);

  return (
    <div className="card">
      <h2>Expiry Alerts (Next 30 Days)</h2>

      {expiringMeds.length === 0 ? (
        <p>✅ No medicines expiring soon</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Batch</th>
              <th>Expiry Date</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {expiringMeds.map(m => (
              <tr key={m._id}>
                <td className="expiry-warning">{m.name}</td>
                <td>{m.batchNumber}</td>
                <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                <td>{m.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
