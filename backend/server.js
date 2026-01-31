require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cors());


// mongoose.connect("mongodb://127.0.0.1:27017/medical_inventory_full");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB error:", err));

const Admin = mongoose.model("Admin", new mongoose.Schema({
  username: String,
  password: String
}));

const Medicine = mongoose.model("Medicine", new mongoose.Schema({
  name: String,
  description: String,
  disease: String,
  price: Number,
  quantity: Number,
  batchNumber: String,
  expiryDate: Date,
  image: String,
}));

const auth = (req,res,next)=>{
  const token = req.headers.authorization;
  if(!token) return res.status(403).send("No token");
  try{
    jwt.verify(token,"secretkey");
    next();
  }catch(e){
    res.status(401).send("Invalid token");
  }
};

app.post("/api/admin/register", async(req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await new Admin({username:req.body.username,password:hash}).save();
  res.send("Admin registered");
});

app.post("/api/admin/login", async(req,res)=>{
  const admin = await Admin.findOne({username:req.body.username});
  if(!admin) return res.status(401).send("Invalid credentials");
  const ok = await bcrypt.compare(req.body.password, admin.password);
  if(!ok) return res.status(401).send("Invalid credentials");
  const token = jwt.sign({id:admin._id},"secretkey");
  res.json({token});
});

app.post("/api/medicines", auth, async(req,res)=>{
  await new Medicine(req.body).save();
  res.send("Medicine added");
});

// Update stock quantity
app.put("/api/medicines/:id", auth, async (req, res) => {
  const { quantity } = req.body;

  await Medicine.findByIdAndUpdate(req.params.id, {
    quantity: quantity
  });

  res.send("Stock updated");
});


// Delete medicine
app.delete("/api/medicines/:id", auth, async (req, res) => {
  await Medicine.findByIdAndDelete(req.params.id);
  res.send("Medicine deleted");
});



app.get("/api/medicines", async(req,res)=>{
  res.json(await Medicine.find());
});

app.get("/api/expiry-alerts", async(req,res)=>{
  const today = new Date();
  const limit = new Date();
  limit.setDate(today.getDate() + 30);
  const meds = await Medicine.find({ expiryDate: { $lte: limit }});
  res.json(meds);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
