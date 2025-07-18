const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Guitariste = require("../models/guitaristes");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        role: req.body.role || "user",
      });
      user
        .save()
        .then((savedUser) => {
          // Crée un token comme dans login
          const token = jwt.sign(
            { userId: savedUser._id, role: savedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          res.status(201).json({
            message: "Utilisateur créé !",
            userId: savedUser._id,
            role: savedUser.role,
            token: token,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement :", error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      console.error("Erreur lors du hash :", error);
      res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects." });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Identifiants incorrects." });
          }
          res.status(200).json({
            userId: user._id,
            role: user.role,
            token: jwt.sign(
              { userId: user._id, role: user.role },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ message: "Erreur serveur" }));
    })
    .catch((error) => {
      console.error("Erreur login:", error);
      res.status(500).json({ message: "Erreur serveur" });
    });
};

exports.getLikedProfiles = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID utilisateur invalide" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Extraire les profileIds likés
    const likedProfileIds = user.likedProfiles.map((p) => p.profileId);

    // Rechercher les guitaristes avec ces IDs
    const likedProfiles = await Guitariste.find({
      _id: { $in: likedProfileIds },
    });

    res.json({ likedProfiles });
  } catch (error) {
    console.error("Erreur getLikedProfiles:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
