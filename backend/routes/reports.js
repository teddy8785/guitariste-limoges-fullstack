const express = require("express");
const router = express.Router();
const Profile = require("../models/guitaristes"); // adapte si tu utilises un autre modèle
const auth = require("../middleware/auth"); // middleware d'authentification
const optionalAuth = require("../middleware/optionalAuth");
const reportController = require("../controllers/report");

// Middleware de debug pour voir quand une route du routeur /api/report est appelée
router.use((req, res, next) => {
  // console.log(`Route /api${req.path} appelée avec méthode ${req.method}`);
  next();
});

// Route pour signaler un profil
router.post("/", optionalAuth, reportController.reportProfile);
router.get("/admin/reported-profiles", auth, reportController.getReportedProfiles);

// Vérifie si l'utilisateur (ou visiteur) a déjà signalé un profil
router.get("/status", optionalAuth, reportController.getReportStatus);
router.post("/check-report", optionalAuth, reportController.postCheckReport);

module.exports = router;
