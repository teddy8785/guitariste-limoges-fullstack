const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const guitaristeRoutes = require("./routes/guitaristes");
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

require('dotenv').config();

// Connexion MongoDB
mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("Connexion à MongoDB réussie !"))
.catch(err => console.log("Connexion à MongoDB échouée !", err));

// Middleware CORS (dev + future prod)
const allowedOrigins = [
  "http://localhost:3000",       // Ton frontend local
  // "https://www.tonsite.com",  ← Tu pourras le décommenter quand tu auras un domaine
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS non autorisé : " + origin));
    }
  },
  credentials: true,
}));

// Middleware corps de requêtes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Fichiers statiques (images, audios)
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/audios", express.static(path.join(__dirname, "audios")));

// Routes API
app.use("/api/guitaristes", guitaristeRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;