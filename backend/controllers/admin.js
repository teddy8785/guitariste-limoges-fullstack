const User = require("../models/user");
const Guitariste = require("../models/guitaristes");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

// Liste tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // on masque le password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

async function deleteFileIfExists(fileUrl) {
  if (!fileUrl) return;
  const filename = fileUrl.includes("/images/")
    ? fileUrl.split("/images/")[1]
    : fileUrl.includes("/audios/")
    ? fileUrl.split("/audios/")[1]
    : null;
  if (!filename) return;

  const folder = fileUrl.includes("/images/") ? "images" : "audios";
  const filepath = path.join(__dirname, "..", folder, filename);

  try {
    await fs.promises.unlink(filepath);
  } catch (err) {
    console.log(`Erreur suppression fichier ${filename}:`, err.message);
  }
}

exports.deleteGuitaristeByAdmin = async (req, res) => {
  try {
    const guitariste = await Guitariste.findById(req.params.id);
    if (!guitariste) {
      return res.status(404).json({ error: "Guitariste non trouvé" });
    }

    await deleteFileIfExists(guitariste.photo);
    await deleteFileIfExists(guitariste.photoDown);
    await deleteFileIfExists(guitariste.audio);

    await Guitariste.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Profil supprimé par admin !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.updateGuitaristeByAdmin = async (req, res) => {
  try {
    const guitariste = await Guitariste.findById(req.params.id);
    if (!guitariste) {
      return res.status(404).json({ error: "Guitariste non trouvé" });
    }

    let updatedData = { ...req.body };

    // Conversion des styles texte -> tableau
    if (typeof req.body.style === "string") {
      updatedData.style = req.body.style
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else if (Array.isArray(req.body.style)) {
      updatedData.style = req.body.style.map((s) => s.trim());
    } else {
      updatedData.style = [];
    }

    // Conversion des instruments texte -> tableau
    if (typeof req.body.instrument === "string") {
      updatedData.instrument = req.body.instrument
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else if (Array.isArray(req.body.instrument)) {
      updatedData.instrument = req.body.instrument.map((s) => s.trim());
    } else {
      updatedData.instrument = [];
    }

    // Gestion suppression photo uniquement si photoDeleted === "true"
    if (req.body.photoDeleted === "true") {
      await deleteFileIfExists(guitariste.photo);
      await deleteFileIfExists(guitariste.photoDown);
      updatedData.photo = null;
      updatedData.photoDown = null;
    }

    // Gestion image (upload)
    if (req.files && req.files["image"] && req.files["image"][0]) {
      await deleteFileIfExists(guitariste.photo);
      await deleteFileIfExists(guitariste.photoDown);

      const imageFile = req.files["image"][0];
      const originalName = imageFile.originalname
        .split(" ")
        .join("_")
        .split(".")[0];
      const timestamp = Date.now();
      const jpgFilename = `${originalName}_${timestamp}.jpg`;
      const webpFilename = `${originalName}_${timestamp}.webp`;

      // Redimensionner à 300x400
      const resizedImage = sharp(imageFile.buffer).resize({
        width: 300,
        height: 400,
        fit: "cover",
      });

      await resizedImage
        .jpeg({ quality: 90 })
        .toFile(path.join("images", jpgFilename));
      await resizedImage
        .webp({ quality: 80 })
        .toFile(path.join("images", webpFilename));

      updatedData.photo = `${req.protocol}://${req.get(
        "host"
      )}/images/${jpgFilename}`;
      updatedData.photoDown = `${req.protocol}://${req.get(
        "host"
      )}/images/${webpFilename}`;
    }

    // Gestion audio (upload)
    if (req.files && req.files["audio"] && req.files["audio"][0]) {
      await deleteFileIfExists(guitariste.audio);

      const audioFile = req.files["audio"][0];
      const audioOriginalName = audioFile.originalname
        .split(" ")
        .join("_")
        .split(".")[0];
      const timestampAudio = Date.now();
      const audioFilename = `${audioOriginalName}_${timestampAudio}${path.extname(
        audioFile.originalname
      )}`;

      await fsPromises.writeFile(
        path.join("audios", audioFilename),
        audioFile.buffer
      );

      updatedData.audio = `${req.protocol}://${req.get(
        "host"
      )}/audios/${audioFilename}`;
    }

    // Mise à jour de la date annonce si nécessaire
    if (req.body.annonce) {
      updatedData.annonceDate = new Date();
    }

    await Guitariste.updateOne({ _id: req.params.id }, updatedData);

    res.status(200).json({ message: "Profil mis à jour par admin !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
