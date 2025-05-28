const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const sharp = require("sharp");
const Guitariste = require("../models/guitaristes");

exports.createGuitariste = async (req, res) => {
  try {
    let photoUrl = "";
    let photoDownUrl = "";
    let audioUrl = "";

    // Gestion image
    if (req.files && req.files["image"] && req.files["image"][0]) {
      const imageFile = req.files["image"][0];
      const originalName = imageFile.originalname
        .split(" ")
        .join("_")
        .split(".")[0];
      const timestamp = Date.now();
      const jpgFilename = `${originalName}_${timestamp}.jpg`;
      const webpFilename = `${originalName}_${timestamp}.webp`;

      await sharp(imageFile.buffer)
        .jpeg({ quality: 90 })
        .toFile(path.join("images", jpgFilename));

      await sharp(imageFile.buffer)
        .webp({ quality: 80 })
        .toFile(path.join("images", webpFilename));

      photoUrl = `${req.protocol}://${req.get("host")}/images/${jpgFilename}`;
      photoDownUrl = `${req.protocol}://${req.get(
        "host"
      )}/images/${webpFilename}`;
    }

    // Gestion audio
    if (req.files && req.files["audio"] && req.files["audio"][0]) {
      const audioFile = req.files["audio"][0];
      const originalName = audioFile.originalname
        .split(" ")
        .join("_")
        .split(".")[0];
      const timestamp = Date.now();
      const audioFilename = `${originalName}_${timestamp}${path.extname(
        audioFile.originalname
      )}`;

      await fsPromises.writeFile(
        path.join("audios", audioFilename),
        audioFile.buffer
      );

      audioUrl = `${req.protocol}://${req.get("host")}/audios/${audioFilename}`;
    }

    // Conversion des styles texte -> tableau
    if (typeof req.body.style === "string") {
      req.body.style = req.body.style
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Conversion des instruments texte -> tableau
    if (typeof req.body.instrument === "string") {
      req.body.instrument = req.body.instrument
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    const guitariste = new Guitariste({
      ...req.body,
      photo: photoUrl, // URL JPG
      photoDown: photoDownUrl, // URL WebP
      audio: audioUrl, // URL audio
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
        if (!guitariste) {
          return res.status(200).json(null); // ou {}
        }
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

    // Conversion des styles texte -> tableau
    if (typeof req.body.style === "string") {
      req.body.style = req.body.style
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Conversion des instruments texte -> tableau
    if (typeof req.body.instrument === "string") {
      req.body.instrument = req.body.instrument
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Gestion image
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

      await sharp(imageFile.buffer)
        .jpeg({ quality: 90 })
        .toFile(path.join("images", jpgFilename));
      await sharp(imageFile.buffer)
        .webp({ quality: 80 })
        .toFile(path.join("images", webpFilename));

      updatedData.photo = `${req.protocol}://${req.get(
        "host"
      )}/images/${jpgFilename}`;
      updatedData.photoDown = `${req.protocol}://${req.get(
        "host"
      )}/images/${webpFilename}`;
    }

    // Gestion audio
    if (req.files && req.files["audio"] && req.files["audio"][0]) {
      // Supprimer ancien audio
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
