const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/users", requireAdmin, adminController.getAllUsers);
router.delete("/users/:id", requireAdmin, adminController.deleteUser);
router.get('/admin/dashboard', requireAdmin, (req, res) => {
  res.json({ message: 'Bienvenue dans le panneau d’administration' });
});

module.exports = router;