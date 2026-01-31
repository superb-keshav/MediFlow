require("dotenv").config();
const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/medical_inventory_full");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB error:", err));

const MedicineSchema = new mongoose.Schema({
  name: String,
  description: String,
  disease: String,
  price: Number,
  quantity: Number,
  batchNumber: String,
  expiryDate: Date
});

const Medicine = mongoose.model("Medicine", MedicineSchema);

const medicines = [
  {
    name: "Paracetamol 500mg",
    description: "Used to reduce fever and mild pain",
    disease: "Fever, Headache",
    price: 25,
    quantity: 200,
    batchNumber: "PCM500-A1",
    expiryDate: "2026-05-30"
  },
  {
    name: "Ibuprofen 400mg",
    description: "Pain reliever and anti-inflammatory",
    disease: "Pain, Inflammation",
    price: 40,
    quantity: 150,
    batchNumber: "IBU400-B2",
    expiryDate: "2026-03-15"
  },
  {
    name: "Cetirizine 10mg",
    description: "Used for allergies",
    disease: "Allergy, Cold",
    price: 30,
    quantity: 180,
    batchNumber: "CET10-C3",
    expiryDate: "2026-07-20"
  },
  {
    name: "Azithromycin 500mg",
    description: "Antibiotic for bacterial infections",
    disease: "Bacterial Infection",
    price: 120,
    quantity: 90,
    batchNumber: "AZI500-D4",
    expiryDate: "2026-01-10"
  },
  {
    name: "Amoxicillin 500mg",
    description: "Broad-spectrum antibiotic",
    disease: "Infection",
    price: 95,
    quantity: 100,
    batchNumber: "AMX500-E5",
    expiryDate: "2026-04-18"
  },
  {
    name: "Pantoprazole 40mg",
    description: "Reduces stomach acid",
    disease: "Acidity, GERD",
    price: 60,
    quantity: 140,
    batchNumber: "PAN40-F6",
    expiryDate: "2026-06-12"
  },
  {
    name: "Omeprazole 20mg",
    description: "Treats acid reflux",
    disease: "Acidity, Ulcer",
    price: 55,
    quantity: 160,
    batchNumber: "OME20-G7",
    expiryDate: "2026-02-28"
  },
  {
    name: "Metformin 500mg",
    description: "Controls blood sugar",
    disease: "Diabetes",
    price: 35,
    quantity: 220,
    batchNumber: "MET500-H8",
    expiryDate: "2026-08-30"
  },
  {
    name: "Amlodipine 5mg",
    description: "Lowers blood pressure",
    disease: "Hypertension",
    price: 45,
    quantity: 130,
    batchNumber: "AML5-I9",
    expiryDate: "2026-09-05"
  },
  {
    name: "Losartan 50mg",
    description: "Treats high BP",
    disease: "Hypertension",
    price: 50,
    quantity: 125,
    batchNumber: "LOS50-J10",
    expiryDate: "2026-11-01"
  },
  {
    name: "Vitamin C Tablets",
    description: "Boosts immunity",
    disease: "Immunity",
    price: 80,
    quantity: 300,
    batchNumber: "VITC-K11",
    expiryDate: "2027-01-15"
  },
  {
    name: "Calcium + Vitamin D3",
    description: "Improves bone health",
    disease: "Bone Health",
    price: 110,
    quantity: 170,
    batchNumber: "CALD3-L12",
    expiryDate: "2027-03-20"
  },
  {
    name: "ORS Sachet",
    description: "Prevents dehydration",
    disease: "Dehydration",
    price: 20,
    quantity: 400,
    batchNumber: "ORS-M13",
    expiryDate: "2026-12-01"
  },
  {
    name: "Dolo 650",
    description: "Fever and pain relief",
    disease: "Fever, Pain",
    price: 30,
    quantity: 250,
    batchNumber: "DOLO650-N14",
    expiryDate: "2026-10-10"
  },
  {
    name: "Cough Syrup",
    description: "Relieves cough",
    disease: "Cough",
    price: 75,
    quantity: 90,
    batchNumber: "COUGH-O15",
    expiryDate: "2026-06-30"
  },
  {
    name: "Antacid Syrup",
    description: "Neutralizes acid",
    disease: "Acidity",
    price: 65,
    quantity: 110,
    batchNumber: "ANTAC-P16",
    expiryDate: "2026-09-18"
  },
  {
    name: "Insulin Injection",
    description: "Controls diabetes",
    disease: "Diabetes",
    price: 450,
    quantity: 40,
    batchNumber: "INS-Q17",
    expiryDate: "2025-12-31"
  },
  {
    name: "Salbutamol Inhaler",
    description: "Relieves asthma",
    disease: "Asthma",
    price: 320,
    quantity: 60,
    batchNumber: "SALB-R18",
    expiryDate: "2026-04-25"
  },
  {
    name: "Multivitamin Capsules",
    description: "Improves overall health",
    disease: "General Weakness",
    price: 150,
    quantity: 200,
    batchNumber: "MULTI-S19",
    expiryDate: "2027-02-14"
  },
  {
    name: "Zinc Tablets",
    description: "Supports immunity",
    disease: "Immunity",
    price: 55,
    quantity: 180,
    batchNumber: "ZINC-T20",
    expiryDate: "2026-08-08"
  }
];

async function seedDB() {
  try {
    await Medicine.deleteMany({});
    await Medicine.insertMany(medicines);
    console.log("✅ Database seeded successfully with 20 medicines");
  } catch (err) {
    console.error("❌ Seeding failed", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
