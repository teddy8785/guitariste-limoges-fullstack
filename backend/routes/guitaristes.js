const express = require("express");
const router = express.Router();
const guitaristeCtrl = require("../controllers/guitaristes");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer-config");

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

// Routes génériques
router.get("/", guitaristeCtrl.getAllGuitaristes);
// POST avec auth + upload image
router.post("/", auth, multiUpload, guitaristeCtrl.createGuitariste);
router.put("/me", auth, multiUpload, guitaristeCtrl.updateMyGuitariste);
router.delete("/me", auth, guitaristeCtrl.deleteMyGuitariste);

module.exports = router;
