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

      // Redimensionner automatiquement à 300x400
      const resizedImage = sharp(imageFile.buffer).resize({
        width: 300,
        height: 400,
        fit: "cover", // crop si nécessaire pour remplir complètement
      });

      await resizedImage
        .jpeg({ quality: 90 })
        .toFile(path.join("images", jpgFilename));

      await resizedImage
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
    } else if (Array.isArray(req.body.style)) {
      req.body.style = req.body.style.map((s) => s.trim());
    } else {
      req.body.style = [];
    }

    // Conversion des instruments texte -> tableau
    if (typeof req.body.instrument === "string") {
      req.body.instrument = req.body.instrument
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else if (Array.isArray(req.body.instrument)) {
      req.body.instrument = req.body.instrument.map((s) => s.trim());
    } else {
      req.body.instrument = [];
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

exports.getRecentGuitaristes = (req, res) => {
  Guitariste.find()
    .sort({ createdAt: -1 }) // trie par date création décroissante
    .limit(4)                 // limite à 4 résultats
    .then((guitaristes) => res.status(200).json(guitaristes))
    .catch((error) => res.status(500).json({ message: "Erreur serveur", error }));
};

exports.getRecentAnnonces = (req, res) => {
  Guitariste.find({ annonce: { $exists: true, $ne: "" } }) // filtre pour les profils qui ont une annonce non vide
    .sort({ annonceDate: -1 }) // trie par date d'annonce décroissante (les plus récentes en premier)
    .limit(4) // limite à 4 résultats
    .then((guitaristes) => res.status(200).json(guitaristes))
    .catch((error) => res.status(400).json({ error }));
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
    const userId = req.auth.userId;
    const isAdmin = req.auth.isAdmin;

    // Si admin, peut modifier un profil via params.id, sinon c'est le profil de l'utilisateur connecté
    const guitaristeId = isAdmin && req.params.id ? req.params.id : null;

    let guitariste;
    if (isAdmin && guitaristeId) {
      guitariste = await Guitariste.findById(guitaristeId);
      if (!guitariste) return res.status(404).json({ error: "Profil non trouvé" });
    } else {
      guitariste = await Guitariste.findOne({ userId });
      if (!guitariste) return res.status(404).json({ error: "Profil non trouvé" });
    }

    let updatedData = { ...req.body };

    // Conversion styles
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

    // Conversion instruments
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

    // Suppression photo si demandé
    if (req.body.photoDeleted === "true") {
      await deleteFileIfExists(guitariste.photo);
      await deleteFileIfExists(guitariste.photoDown);
      updatedData.photo = null;
      updatedData.photoDown = null;
    }

    // Gestion image (upload et redimension)
    if (req.files && req.files["image"] && req.files["image"][0]) {
      await deleteFileIfExists(guitariste.photo);
      await deleteFileIfExists(guitariste.photoDown);

      const imageFile = req.files["image"][0];
      const originalName = imageFile.originalname.split(" ").join("_").split(".")[0];
      const timestamp = Date.now();
      const jpgFilename = `${originalName}_${timestamp}.jpg`;
      const webpFilename = `${originalName}_${timestamp}.webp`;

      const resizedImage = sharp(imageFile.buffer).resize({
        width: 300,
        height: 400,
        fit: "cover",
      });

      await resizedImage.jpeg({ quality: 90 }).toFile(path.join("images", jpgFilename));
      await resizedImage.webp({ quality: 80 }).toFile(path.join("images", webpFilename));

      updatedData.photo = `${req.protocol}://${req.get("host")}/images/${jpgFilename}`;
      updatedData.photoDown = `${req.protocol}://${req.get("host")}/images/${webpFilename}`;
    }

    // Gestion audio
    if (req.files && req.files["audio"] && req.files["audio"][0]) {
      await deleteFileIfExists(guitariste.audio);

      const audioFile = req.files["audio"][0];
      const audioOriginalName = audioFile.originalname.split(" ").join("_").split(".")[0];
      const timestampAudio = Date.now();
      const audioFilename = `${audioOriginalName}_${timestampAudio}${path.extname(audioFile.originalname)}`;

      await fsPromises.writeFile(path.join("audios", audioFilename), audioFile.buffer);

      updatedData.audio = `${req.protocol}://${req.get("host")}/audios/${audioFilename}`;
    }

    // Mise à jour date annonce si modif annonce
    if (req.body.annonce) {
      updatedData.annonceDate = new Date();
    }

    // On interdit la modification du userId
    delete updatedData.userId;

    await Guitariste.updateOne({ _id: guitariste._id }, updatedData);

    res.status(200).json({ message: "Profil mis à jour !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.deleteMyGuitariste = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const isAdmin = req.auth.isAdmin; // suppose que tu as ce booléen dans auth

    // L'id du profil à supprimer : 
    // - admin peut passer un id dans params
    // - user normal supprime son propre profil (userId)
    const guitaristeId = isAdmin ? req.params.id : null;

    let guitariste;
    if (isAdmin && guitaristeId) {
      guitariste = await Guitariste.findById(guitaristeId);
      if (!guitariste) return res.status(404).json({ error: "Profil non trouvé" });
    } else {
      guitariste = await Guitariste.findOne({ userId });
      if (!guitariste) return res.status(404).json({ error: "Profil non trouvé" });
    }

    // Supprimer les fichiers
    if (guitariste.photo) {
      const filenameJpg = guitariste.photo.split("/images/")[1];
      await fsPromises.unlink(path.join("images", filenameJpg)).catch(() => {});
    }
    if (guitariste.photoDown) {
      const filenameWebp = guitariste.photoDown.split("/images/")[1];
      await fsPromises.unlink(path.join("images", filenameWebp)).catch(() => {});
    }
    if (guitariste.audio) {
      const filenameAudio = guitariste.audio.split("/audios/")[1];
      await fsPromises.unlink(path.join("audios", filenameAudio)).catch(() => {});
    }

    // Supprimer la fiche dans la DB
    if (isAdmin && guitaristeId) {
      await Guitariste.findByIdAndDelete(guitaristeId);
    } else {
      await Guitariste.deleteOne({ userId });
    }

    res.status(200).json({ message: "Profil supprimé !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};