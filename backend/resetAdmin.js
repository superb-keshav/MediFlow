require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Admin schema (simple & safe)
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Admin = mongoose.model("Admin", AdminSchema);

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Remove any existing admins (optional but clean)
    await Admin.deleteMany({});

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      password: hashedPassword
    });

    console.log("✅ Admin reset successfully in MongoDB Atlas");
    console.log("👉 Username: admin");
    console.log("👉 Password: admin123");

    process.exit();
  } catch (err) {
    console.error("❌ Error resetting admin:", err);
    process.exit(1);
  }
}

resetAdmin();
