const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const requireAuth = require("../middleware/auth"); // Middleware d'authentification
const requireAdmin = require("../middleware/requireAdmin");
const upload = require('../middleware/multer-config');

const multiUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);

// Exemple pour GET users
router.get("/users", requireAuth, requireAdmin, adminController.getAllUsers);
router.delete("/users/:id", requireAuth, requireAdmin, adminController.deleteUser);

router.get('/admin/dashboard', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Bienvenue dans le panneau d’administration' });
});

// Gestion guitaristes par admin
router.delete('/guitaristes/:id', requireAuth, requireAdmin, adminController.deleteGuitaristeByAdmin);
router.put('/guitaristes/:id', requireAuth, requireAdmin, multiUpload, adminController.updateGuitaristeByAdmin);

module.exports = router;