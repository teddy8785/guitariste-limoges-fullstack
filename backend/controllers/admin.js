const User = require("../models/user");
const Guitariste = require("../models/guitaristes");
const cloudinary = require("../config/cloudinary");

// USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// DELETE GUITARISTE (ADMIN)
exports.deleteGuitaristeByAdmin = async (req, res) => {
  try {
    const g = await Guitariste.findById(req.params.id);

    if (!g) {
      return res.status(404).json({ error: "Guitariste non trouvé" });
    }

    // supprimer image Cloudinary
    if (g.photoPublicId) {
      await cloudinary.uploader.destroy(g.photoPublicId);
    }

    if (g.photoDownPublicId) {
      await cloudinary.uploader.destroy(g.photoDownPublicId);
    }

    // supprimer audio Cloudinary
    if (g.audioPublicId) {
      await cloudinary.uploader.destroy(g.audioPublicId, {
        resource_type: "video",
      });
    }

    await Guitariste.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Profil supprimé par admin !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// UPDATE ADMIN (CLOUDINARY CLEAN)
exports.updateGuitaristeByAdmin = async (req, res) => {
  try {
    const g = await Guitariste.findById(req.params.id);

    if (!g) {
      return res.status(404).json({ error: "Guitariste non trouvé" });
    }

    let updatedData = { ...req.body };

    // styles
    updatedData.style =
      typeof req.body.style === "string"
        ? req.body.style.split(",").map(s => s.trim()).filter(Boolean)
        : Array.isArray(req.body.style)
        ? req.body.style.map(s => s.trim())
        : [];

    // instruments
    updatedData.instrument =
      typeof req.body.instrument === "string"
        ? req.body.instrument.split(",").map(s => s.trim()).filter(Boolean)
        : Array.isArray(req.body.instrument)
        ? req.body.instrument.map(s => s.trim())
        : [];

    // DELETE PHOTO
    if (String(req.body.photoDeleted) === "true") {
      if (g.photoPublicId) {
        await cloudinary.uploader.destroy(g.photoPublicId);
      }
      if (g.photoDownPublicId) {
        await cloudinary.uploader.destroy(g.photoDownPublicId);
      }

      updatedData.photo = null;
      updatedData.photoDown = null;
      updatedData.photoPublicId = null;
      updatedData.photoDownPublicId = null;
    }

    // DELETE AUDIO
    if (String(req.body.audioDeleted) === "true") {
      if (g.audioPublicId) {
        await cloudinary.uploader.destroy(g.audioPublicId, {
          resource_type: "video",
        });
      }

      updatedData.audio = null;
      updatedData.audioPublicId = null;
    }

    // UPLOAD IMAGE
    if (req.files?.image?.[0]) {
      if (g.photoPublicId) {
        await cloudinary.uploader.destroy(g.photoPublicId);
      }

      updatedData.photo = req.files.image[0].path;
      updatedData.photoPublicId = req.files.image[0].filename;

      if (g.photoDownPublicId) {
        await cloudinary.uploader.destroy(g.photoDownPublicId);
      }

      updatedData.photoDown = req.files.image[0].path;
      updatedData.photoDownPublicId = req.files.image[0].filename;
    }

    // UPLOAD AUDIO
    if (req.files?.audio?.[0]) {
      if (g.audioPublicId) {
        await cloudinary.uploader.destroy(g.audioPublicId, {
          resource_type: "video",
        });
      }

      updatedData.audio = req.files.audio[0].path;
      updatedData.audioPublicId = req.files.audio[0].filename;
    }

    // ANNOUNCE DATE
    if (req.body.annonce) {
      updatedData.annonceDate = new Date();
    }

    const updated = await Guitariste.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profil mis à jour par admin !",
      slug: updated.slug,
      id: updated._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};