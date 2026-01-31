import { useEffect, useState } from "react";

export default function AdminMedicineList({ token, filter }) {
  const [meds, setMeds] = useState([]);
  const [editId, setEditId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    price: "",
    quantity: ""
  });

  const [search, setSearch] = useState("");

  const fetchMedicines = async () => {
    const res = await fetch("https://mediflow-backend-v54m.onrender.com/api/medicines");
    const data = await res.json();
    setMeds(data);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const startEdit = (med) => {
    setEditId(med._id);
    setEditData({
      name: med.name,
      price: med.price,
      quantity: med.quantity
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({ name: "", price: "", quantity: "" });
  };

  const updateMedicine = async (id) => {
    if (!editData.name || !editData.price || !editData.quantity) {
      alert("Please fill all fields");
      return;
    }

    await fetch(`https://mediflow-backend-v54m.onrender.com/api/medicines/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify(editData)
    });

    cancelEdit();
    fetchMedicines();
  };

  const deleteMedicine = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    await fetch(`https://mediflow-backend-v54m.onrender.com/api/medicines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    });

    fetchMedicines();
  };

  // 🔍 Search + optional low stock filter
  const filteredMeds = meds.filter(m => {
    const matchSearch = m.name
      .toLowerCase()
      .includes(search.toLowerCase());

    if (filter === "low") {
      return matchSearch && m.quantity <= 10;
    }
    return matchSearch;
  });

  return (
    <div>
      <h2>Manage Stock</h2>

      {/* SEARCH */}
      <input
        placeholder="Search medicine..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          marginBottom: "15px",
          padding: "8px",
          width: "300px"
        }}
      />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredMeds.map(med => (
            <tr key={med._id}>
              {/* NAME */}
              <td>
                {editId === med._id ? (
                  <input
                    value={editData.name}
                    onChange={e =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                ) : (
                  med.name
                )}
              </td>

              {/* PRICE */}
              <td>
                {editId === med._id ? (
                  <input
                    type="number"
                    value={editData.price}
                    onChange={e =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    style={{ width: "80px" }}
                  />
                ) : (
                  `₹${med.price}`
                )}
              </td>

              {/* QUANTITY */}
              <td>
                {editId === med._id ? (
                  <input
                    type="number"
                    value={editData.quantity}
                    onChange={e =>
                      setEditData({ ...editData, quantity: e.target.value })
                    }
                    style={{ width: "70px" }}
                  />
                ) : (
                  med.quantity
                )}
              </td>

              {/* ACTIONS */}
              <td>
                {editId === med._id ? (
                  <>
                    <button
                      className="edit"
                      onClick={() => updateMedicine(med._id)}
                    >
                      Save
                    </button>
                    <button
                      className="delete"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit"
                      onClick={() => startEdit(med)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteMedicine(med._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
