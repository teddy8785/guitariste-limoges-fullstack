require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmin() {
  const hashedPassword = await bcrypt.hash(process.env.JTW_SECRET, 10);

  const adminUser = new User({
    email: "admin@guitaristes.fr",
    password: hashedPassword,
    role: "admin",
  });

  try {
    await adminUser.save();
    console.log("✅ Admin créé !");
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();