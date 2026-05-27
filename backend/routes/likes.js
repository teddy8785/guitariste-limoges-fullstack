const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const likesCtrl = require("../controllers/likes");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

// GET les profils likés par un user
router.get("/user/:userId/liked-profiles", userCtrl.getLikedProfiles);

// GET état like
router.post("/bulk", optionalAuth, likesCtrl.getBulkLikeStatus);
router.get("/:id/like-status", optionalAuth, likesCtrl.getLikeStatus);

// GET nombre de likes
router.get("/:id/like-count", likesCtrl.getLikeCount);

// POST like/unlike
router.post("/:id/like", auth, likesCtrl.toggleLike);

// TRANSFERT likes visiteur -> compte connecté
router.post("/transfer", auth, likesCtrl.transferVisitorLikesToUser);

module.exports = router;
