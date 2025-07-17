const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const requireAuth = require("../middleware/auth"); // Middleware d'authentification
const requireAdmin = require("../middleware/requireAdmin");
const upload = require("../middleware/multer-config");
const Guitariste = require("../models/guitaristes");
const User = require("../models/user");

const multiUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

// Exemple pour GET users
router.get("/users", requireAuth, requireAdmin, adminController.getAllUsers);
router.delete(
  "/users/:id",
  requireAuth,
  requireAdmin,
  adminController.deleteUser
);

router.get("/admin/dashboard", requireAuth, requireAdmin, (req, res) => {
  res.json({ message: "Bienvenue dans le panneau d’administration" });
});

// Gestion guitaristes par admin
router.delete(
  "/guitaristes/:id",
  requireAuth,
  requireAdmin,
  adminController.deleteGuitaristeByAdmin
);
router.put(
  "/guitaristes/:id",
  requireAuth,
  requireAdmin,
  multiUpload,
  adminController.updateGuitaristeByAdmin
);

// Route pour voir tous les profils signalés
router.get(
  "/guitaristes/reported",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const reported = await Guitariste.find({ isReported: true }).sort({
        reportCount: -1,
      });
      res.status(200).json(reported);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }
);

// Nouvelle route pour récupérer les signalements détaillés d’un guitariste
router.get(
  "/guitaristes/:id/reports",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const guitariste = await Guitariste.findById(req.params.id);

      if (!guitariste) {
        return res.status(404).json({ message: "Profil non trouvé." });
      }

      const reportsWithSlug = await Promise.all(
        (guitariste.reports || []).map(async (report) => {
          if (report.from && report.from.length === 24) {
            try {
              const guitaristeFrom = await Guitariste.findOne({
                userId: report.from,
              }).select("slug");
              return {
                reason: report.reason,
                date: report.date,
                from: report.from,
                fromSlug: guitaristeFrom ? guitaristeFrom.slug : null,
              };
            } catch (e) {
              // Si une erreur survient pendant la recherche du user, retourne sans slug
              return {
                reason: report.reason,
                date: report.date,
                from: report.from,
                fromSlug: null,
              };
            }
          } else {
            return {
              reason: report.reason,
              date: report.date,
              from: report.from,
              fromSlug: null,
            };
          }
        })
      );

      res.status(200).json({ reports: reportsWithSlug });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }
);

module.exports = router;
