const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1/ConstructionApp");

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("SuperAdmin123", 10);
  const admin = new User({
    id: "superadmin-uuid",
    login: "superadmin",
    password: hashedPassword,
    role: "superadmin",
    email: "admin@system.com",
    active: true
  });
  await admin.save();
  console.log("Super Admin created");
  mongoose.disconnect();
}

createAdmin();
