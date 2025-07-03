const express = require("express");
const router = express.Router();
const Profile = require("../models/guitaristes"); // adapte si tu utilises un autre modèle
const auth = require("../middleware/auth"); // middleware d'authentification
const optionalAuth = require("../middleware/optionalAuth");

// Middleware de debug pour voir quand une route du routeur /api/report est appelée
router.use((req, res, next) => {
  console.log(`Route /api${req.path} appelée avec méthode ${req.method}`);
  next();
});

// Route pour signaler un profil
router.post("/report", optionalAuth, async (req, res) => {
  console.log("Requête de signalement reçue, body:", req.body);
  const { profileId, visitorId } = req.body;
  const userId = req.auth?.userId;

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profil introuvable." });
    }

    if (!profile.reportedBy) profile.reportedBy = [];
    if (!profile.reportedByVisitors) profile.reportedByVisitors = [];

    // PRIORITÉ À L’UTILISATEUR CONNECTÉ
    if (userId) {
      const alreadyReported = profile.reportedBy.some(
        (reporterId) => reporterId.toString() === userId.toString()
      );
      if (alreadyReported) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà signalé ce profil." });
      }
      profile.reportedBy.push(userId);
    }
    // SI PAS CONNECTÉ, ON UTILISE visitorId
    else if (visitorId) {
      const alreadyReported = profile.reportedByVisitors.includes(visitorId);
      if (alreadyReported) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà signalé ce profil." });
      }
      profile.reportedByVisitors.push(visitorId);
    }
    // NI CONNECTÉ NI VISITEUR IDENTIFIÉ → ERREUR
    else {
      return res
        .status(400)
        .json({ message: "Aucun identifiant trouvé pour le signalement." });
    }

    profile.isReported = true;
    profile.reportCount = (profile.reportCount || 0) + 1;

    await profile.save();

    return res.status(200).json({ message: "Profil signalé avec succès." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
});
router.get("/admin/reported-profiles", auth, async (req, res) => {
  try {
    // Vérifie que l'utilisateur est admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const reportedProfiles = await Profile.find({ isReported: true });

    res.status(200).json(reportedProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
// Vérifie si l'utilisateur (ou visiteur) a déjà signalé un profil
router.get("/report/status", optionalAuth, async (req, res) => {
  const { profileId, visitorId } = req.query;
  const userId = req.auth?.userId;

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ reported: false });
    }

    const reportedByUser = userId
      ? profile.reportedBy.some((id) => id.toString() === userId.toString())
      : false;

    const reportedByVisitor = visitorId
      ? profile.reportedByVisitors?.includes(visitorId)
      : false;

    return res.status(200).json({
      reported: reportedByUser || reportedByVisitor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reported: false });
  }
});
router.post("/check-report", optionalAuth, async (req, res) => {
  const { profileId, visitorId } = req.body;
  const userId = req.auth?.userId;

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ alreadyReported: false });

    let already = false;

    if (userId) {
      already =
        Array.isArray(profile.reportedBy) &&
        profile.reportedBy.some((id) => id.toString() === userId.toString());
    } else if (visitorId) {
      already =
        Array.isArray(profile.reportedByVisitors) &&
        profile.reportedByVisitors.includes(visitorId);
    }

    res.json({ alreadyReported: already });
  } catch (err) {
    console.error(err);
    res.status(500).json({ alreadyReported: false });
  }
});

module.exports = router;
