const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Guitariste = require("../models/guitaristes");
const cloudinary = require("../config/cloudinary");
const resend = require("../config/resend");

exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      email: req.body.email,
      password: hash,
      role: req.body.role || "user",
      isVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 1000 * 60 * 60,
    });

    await user.save();

    const verifyUrl = `${process.env.FRONT_URL}/verify-email/${verificationToken}`;

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "Vérification de votre compte",
      html: `
    <h2>Bienvenue 👋</h2>
    <p>Clique sur le lien :</p>
    <a href="${verifyUrl}">Activer mon compte</a>
  `,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "Utilisateur créé ! Vérifie ton email.",
      userId: user._id,
      role: user.role,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Identifiants incorrects." });
      }
      if (!user.isVerified) {
        return res.status(403).json({
          message: "Compte non vérifié. Vérifie ton email.",
        });
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
              { expiresIn: "24h" },
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

//Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
      await user.save();

      const resetUrl = `http://localhost:3000/reset-password/${token}`;
      console.log(`✅ Lien de réinitialisation : ${resetUrl}`);
    }

    res.json({ message: "Si ce compte existe, un lien a été envoyé." });
  } catch (error) {
    console.error("Erreur forgotPassword :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

//Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("Token reçu :", token);
  console.log("Date actuelle (timestamp) :", Date.now());

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("User trouvé :", user);

    if (!user) {
      return res.status(400).json({ error: "Lien invalide ou expiré." });
    }

    // Continue avec la réinitialisation
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur resetPassword :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const guitariste = await Guitariste.findOne({ userId });

    if (guitariste) {
      // DELETE IMAGE CLOUDINARY
      if (guitariste.photoPublicId) {
        await cloudinary.uploader.destroy(guitariste.photoPublicId);
      }

      // DELETE AUDIO CLOUDINARY
      if (guitariste.audioPublicId) {
        await cloudinary.uploader.destroy(guitariste.audioPublicId, {
          resource_type: "video",
        });
      }

      // DELETE DB PROFILE
      await Guitariste.deleteOne({ userId });
    }

    // DELETE USER
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Compte supprimé + médias Cloudinary supprimés !",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
