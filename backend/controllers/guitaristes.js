const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const sharp = require("sharp");
const Guitariste = require("../models/guitaristes");

exports.createGuitariste = async (req, res) => {
  try {
    let photoUrl = "";
    let photoDownUrl = "";

    if (req.file) {
      const originalName = req.file.originalname
        .split(" ")
        .join("_")
        .split(".")[0];
      const timestamp = Date.now();
      const jpgFilename = `${originalName}_${timestamp}.jpg`;
      const webpFilename = `${originalName}_${timestamp}.webp`;

      // Convertir et sauvegarder JPG
      await sharp(req.file.buffer)
        .jpeg({ quality: 90 })
        .toFile(path.join("images", jpgFilename));

      // Convertir et sauvegarder WebP
      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(path.join("images", webpFilename));

      photoUrl = `${req.protocol}://${req.get("host")}/images/${jpgFilename}`;
      photoDownUrl = `${req.protocol}://${req.get(
        "host"
      )}/images/${webpFilename}`;
    }

    const guitariste = new Guitariste({
      ...req.body,
      photo: photoUrl, // URL JPG
      photoDown: photoDownUrl, // URL WebP
      userId: req.auth.userId,
    });

    await guitariste.save();
    res.status(201).json({ message: "Guitariste enregistré !" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};

exports.getAllGuitaristes = (req, res) => {
  Guitariste.find()
    .then((guitaristes) => res.status(200).json(guitaristes))
    .catch((error) => res.status(400).json({ error }));
};

exports.getMyGuitariste = (req, res) => {
  Guitariste.findOne({ userId: req.auth.userId })
    .then((guitariste) => {
      if (!guitariste) {
        return res.status(404).json({ message: "Profil non trouvé" });
      }
      res.status(200).json(guitariste);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getGuitaristeById = async (req, res) => {
  try {
    const guitariste = await Guitariste.findById(req.params.id);
    if (!guitariste) {
      return res.status(404).json({ message: "Guitariste non trouvé" });
    }
    res.status(200).json(guitariste);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

async function deleteFileIfExists(fileUrl) {
  if (!fileUrl) return;
  const filename = fileUrl.split("/images/")[1];
  if (!filename) return;
  const filepath = path.join("images", filename);

  try {
    await fsPromises.unlink(filepath);
  } catch (err) {
    console.log(`Erreur suppression fichier ${filename}:`, err.message);
  }
}

exports.updateMyGuitariste = async (req, res) => {
  try {
    const guitariste = await Guitariste.findOne({ userId: req.auth.userId });
    if (!guitariste)
      return res.status(404).json({ error: "Profil non trouvé" });

    let updatedData = { ...req.body };

    if (req.file) {
      // Supprimer les anciennes images JPG et WebP
      await deleteFileIfExists(guitariste.photo);
      await deleteFileIfExists(guitariste.photoDown);

      const originalName = req.file.originalname
        .split(" ")
        .join("_")
        .split(".")[0];
      const timestamp = Date.now();
      const jpgFilename = `${originalName}_${timestamp}.jpg`;
      const webpFilename = `${originalName}_${timestamp}.webp`;

      // Convertir et sauvegarder JPG
      await sharp(req.file.buffer)
        .jpeg({ quality: 90 })
        .toFile(path.join("images", jpgFilename));

      // Convertir et sauvegarder WebP
      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(path.join("images", webpFilename));

      updatedData.photo = `${req.protocol}://${req.get(
        "host"
      )}/images/${jpgFilename}`;
      updatedData.photoDown = `${req.protocol}://${req.get(
        "host"
      )}/images/${webpFilename}`;
    }

    await Guitariste.updateOne(
      { userId: req.auth.userId },
      { ...updatedData, userId: req.auth.userId }
    );

    res.status(200).json({ message: "Profil mis à jour !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteMyGuitariste = (req, res) => {
  Guitariste.findOne({ userId: req.auth.userId })
    .then((guitariste) => {
      if (!guitariste)
        return res.status(404).json({ error: "Profil non trouvé" });

      // Supprimer l'image JPG
      if (guitariste.photo) {
        const filenameJpg = guitariste.photo.split("/images/")[1];
        fs.unlink(`images/${filenameJpg}`, (err) => {
          if (err) console.log("Erreur suppression image JPG:", err);
        });
      }

      // Supprimer l'image WebP (photoDown)
      if (guitariste.photoDown) {
        const filenameWebp = guitariste.photoDown.split("/images/")[1];
        fs.unlink(`images/${filenameWebp}`, (err) => {
          if (err) console.log("Erreur suppression image WebP:", err);
        });
      }

      Guitariste.deleteOne({ userId: req.auth.userId })
        .then(() => res.status(200).json({ message: "Profil supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
