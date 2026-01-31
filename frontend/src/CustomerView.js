import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./CustomerView.css";

export default function CustomerView({ dark }) {
  const [meds, setMeds] = useState([]);
  const [cart, setCart] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("https://mediflow-backend-v54m.onrender.com/api/medicines")
      .then(res => res.json())
      .then(setMeds);
  }, []);

  /* ---------------- FILTERS ---------------- */
  const categories = [
    "All",
    ...Array.from(new Set(meds.map(m => m.disease))).sort((a, b) =>
      a.localeCompare(b)
    )
  ];

  const filteredMeds = meds.filter(m => {
    const matchSearch = m.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory =
      category === "All" || m.disease === category;
    return matchSearch && matchCategory;
  });

  /* ---------------- CART LOGIC ---------------- */
  const addItem = (med) => {
    setCart(prev => {
      const found = prev.find(i => i._id === med._id);
      if (found) {
        return prev.map(i =>
          i._id === med._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...med, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart(prev =>
      prev
        .map(i =>
          i._id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const getQuantity = (id) =>
    cart.find(i => i._id === id)?.quantity || 0;

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const qrData = {
    items: cart.map(i => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price
    })),
    totalAmount: total
  };

  return (
    <div className={dark ? "dark" : ""}>
      {/* SEARCH */}
      <div className="search-bar">
        <input
          placeholder="Search medicine..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORY */}
      <div className="category-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MED GRID */}
      <div className="grid">
        {filteredMeds.map(med => (
          <div className="card" key={med._id}>
            <img
              src={
                med.image ||
                "https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
              }
              alt={med.name}
              className="med-img"
            />

            <h3>{med.name}</h3>
            <p className="desc">{med.description}</p>
            <p className="disease">{med.disease}</p>
            <p className="price">₹{med.price}</p>

            {med.quantity <= 10 && (
              <p className="low-stock">
                Only {med.quantity} left
              </p>
            )}

            <div className="qty-box">
              <button onClick={() => removeItem(med._id)}>-</button>
              <span>{getQuantity(med._id)}</span>
              <button onClick={() => addItem(med)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* CHECKOUT BAR */}
      {cart.length > 0 && (
        <div className="checkout-bar">
          <span>Total: ₹{total}</span>
          <button onClick={() => setShowInvoice(true)}>
            Checkout
          </button>
        </div>
      )}

      {/* INVOICE MODAL */}
      {showInvoice && (
        <div className="qr-modal">
          <div className="checkout-modal">
            <h2>Invoice Summary</h2>

            <div className="items-section">
              {cart.map(item => (
                <div key={item._id} className="item-row">
                  <span>
                    {item.name} ({item.quantity})
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <hr />
              <div className="total-row">
                <strong>Total</strong>
                <strong>₹{total}</strong>
              </div>
            </div>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                className="close-btn"
                onClick={() => setShowInvoice(false)}
              >
                Cancel
              </button>

              <button
                style={{
                  marginLeft: "10px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "20px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setShowInvoice(false);
                  setShowQR(true);
                }}
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQR && (
  <div className="qr-modal">
    <div className="checkout-modal">
      <h2 style={{ textAlign: "center" }}>Scan & Pay</h2>

      <div className="payment-layout">
        {/* LEFT: QR */}
        <div className="qr-left">
          <QRCodeCanvas
            value={JSON.stringify(qrData)}
            size={220}
          />
          <p className="scan-text">Scan QR to Pay</p>
        </div>

        {/* RIGHT: INVOICE */}
        <div className="invoice-right">
          <h3>Order Summary</h3>

          {cart.map(item => (
            <div key={item._id} className="item-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <div className="total-row">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="close-btn"
          onClick={() => {
            setShowQR(false);
            setCart([]);
          }}
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
