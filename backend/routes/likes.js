const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const likesCtrl = require("../controllers/likes");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const {
  toggleLikeAnonymous,
  toggleLike,
  getLikeStatus,
  getLikeCount,
} = require("../controllers/likes");

router.get("/:id/like-status", optionalAuth, getLikeStatus);
router.get("/:id/like-count", getLikeCount);
router.post("/:id/like", optionalAuth, async (req, res) => {
  const userId = req.auth?.userId;
  const profileId = req.params.id; // ici on utilise "profileId" partout
  const visitorKey = req.body.visitorKey;

  try {
    if (userId) {
      const result = await toggleLike({ userId, profileId });
      return res.json(result);
    }

    if (!visitorKey) {
      return res.status(400).json({ error: "visitorKey requis" });
    }

    const result = await toggleLike({ visitorKey, profileId });
    return res.json(result);
  } catch (err) {
    console.error("Erreur toggle like:", err);
    return res.status(500).json({ error: err.message });
  }
});
router.post("/transfer", auth, likesCtrl.transferVisitorLikesToUser);
// Route pour récupérer les profils likés par un utilisateur
router.get("/user/:userId/liked-profiles", userCtrl.getLikedProfiles);

// ici tu peux aussi ajouter d'autres routes likes si besoin

module.exports = router;