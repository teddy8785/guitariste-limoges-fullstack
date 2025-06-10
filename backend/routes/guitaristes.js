const express = require("express");
const router = express.Router();
const guitaristeCtrl = require("../controllers/guitaristes");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer-config");
const {
  toggleLikeAnonymous,
  toggleLike,
  getLikeStatus,
  getLikeCount,
} = require("../controllers/likes");

const multiUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

// Routes plus spécifiques
router.get("/id/:id", guitaristeCtrl.getGuitaristeById);
router.get("/me", auth, guitaristeCtrl.getMyGuitariste);
router.get("/recents", guitaristeCtrl.getRecentGuitaristes);
router.get("/slug/:slug", guitaristeCtrl.getGuitaristeBySlug);
router.get("/annonces/recentes", guitaristeCtrl.getRecentAnnonces);

router.get("/:id/like-status", getLikeStatus);
router.get("/:id/like-count", getLikeCount);
router.post("/:id/like", async (req, res) => {
    console.log("req.body:", req.body);
  const userId = req.user?._id;
  const guitaristeId = req.params.id;
  const visitorKey = req.body.visitorKey;

  try {
    if (userId) {
      // Passer un objet avec les bonnes propriétés
      const result = await toggleLike({ userId, guitaristeId });
      return res.json(result);
    }

    if (!visitorKey) {
    return res.status(400).json({ error: "visitorKey requis" });
  }

    // Appeler toggleLike avec visitorKey et guitaristeId
    const result = await toggleLike({ visitorKey, guitaristeId });
    return res.json(result);
  } catch (err) {
    console.error("Erreur toggle like:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Routes génériques
router.get("/", guitaristeCtrl.getAllGuitaristes);
// POST avec auth + upload image
router.post("/", auth, multiUpload, guitaristeCtrl.createGuitariste);
router.put("/me", auth, multiUpload, guitaristeCtrl.updateMyGuitariste);
router.delete("/me", auth, guitaristeCtrl.deleteMyGuitariste);

module.exports = router;
