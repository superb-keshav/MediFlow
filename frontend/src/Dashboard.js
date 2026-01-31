import { useState } from "react";

export default function Dashboard({ token }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [disease, setDisease] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const addMedicine = async () => {
    if (!name || !description || !disease || !price || !quantity) {
      setMessage("❌ Please fill all fields");
      return;
    }

    try {
      const res = await fetch("https://mediflow-backend-v54m.onrender.com/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          name,
          description,
          disease,
          price,
          quantity,
          image
        })
      });

      if (!res.ok) {
        setMessage("❌ Failed to add medicine");
        return;
      }

      setMessage("✅ Medicine added successfully");

      setName("");
      setDescription("");
      setDisease("");
      setPrice("");
      setQuantity("");
      setImage("");
    } catch {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="card">
      <h2>Add Medicine</h2>
      {message && <p>{message}</p>}

      <input
        placeholder="Medicine Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        placeholder="Category / Disease"
        value={disease}
        onChange={e => setDisease(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price (₹)"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Stock Quantity"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />

      <input
        placeholder="Image URL (optional)"
        value={image}
        onChange={e => setImage(e.target.value)}
      />

      <button onClick={addMedicine}>➕ Add Medicine</button>
    </div>
  );
}
