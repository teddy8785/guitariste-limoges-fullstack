require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");
const cors = require("cors");

const guitaristeRoutes = require("./routes/guitaristes");
const userRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const likesRoutes = require("./routes/likes");
const reportRoutes = require("./routes/reports");
const uploadRoutes = require("./routes/upload");

const app = express();

// Connexion MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

// Middleware CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://guitariste-limoges-fullstack.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Middleware corps de requêtes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Fichiers statiques (images, audios)
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/audios", express.static(path.join(__dirname, "audios")));

// Middleware qui log toutes les requêtes (juste pour debug)
app.use((req, res, next) => {
  // console.log(`REQ: ${req.method} ${req.url}`);
  next();
});

// Toutes les routes API
app.use("/api/guitaristes", guitaristeRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/upload", uploadRoutes);

module.exports = app;
