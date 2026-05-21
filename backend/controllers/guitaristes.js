const slugify = require("slugify");
const Guitariste = require("../models/guitaristes");
const cloudinary = require("../config/cloudinary");

// CREATE
exports.createGuitariste = async (req, res) => {
  console.log("FILES:", req.files);
console.log("BODY:", req.body);
  try {
    let style = [];
    if (typeof req.body.style === "string") {
      style = req.body.style
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(req.body.style)) {
      style = req.body.style.map((s) => s.trim());
    }

    let instrument = [];
    if (typeof req.body.instrument === "string") {
      instrument = req.body.instrument
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(req.body.instrument)) {
      instrument = req.body.instrument.map((s) => s.trim());
    }

    const photoFile = req.files?.image?.[0];
    const audioFile = req.files?.audio?.[0];

    const photo = photoFile?.path || null;
    const photoPublicId = getPublicId(photoFile);

    const audio = audioFile?.path || null;
    const audioPublicId = getPublicId(audioFile);

    const guitariste = new Guitariste({
      ...req.body,
      style,
      instrument,
      photo,
      photoPublicId,
      audio,
      audioPublicId,
      userId: req.auth.userId,
    });

    await guitariste.save();

    res.status(201).json({
      message: "Guitariste enregistré !",
      guitariste,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(400).json({ error: error.message });
  }
};

// GET ALL
exports.getAllGuitaristes = async (req, res) => {
  try {
    const data = await Guitariste.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// GET ONE (USER)
exports.getMyGuitariste = async (req, res) => {
  try {
    const guitariste = await Guitariste.findOne({ userId: req.auth.userId });
    res.status(200).json(guitariste || null);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getGuitaristeById = async (req, res) => {
  try {
    const g = await Guitariste.findById(req.params.id);
    if (!g) return res.status(404).json({ message: "Non trouvé" });
    res.status(200).json(g);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getGuitaristeBySlug = async (req, res) => {
  try {
    const g = await Guitariste.findOne({ slug: req.params.slug });
    if (!g) return res.status(404).json({ message: "Non trouvé" });
    res.status(200).json(g);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// RECENTS
exports.getRecentGuitaristes = async (req, res) => {
  try {
    const g = await Guitariste.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json(g);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getRecentAnnonces = async (req, res) => {
  try {
    const g = await Guitariste.find({ annonce: { $exists: true, $ne: "" } })
      .sort({ annonceDate: -1 })
      .limit(4);

    res.status(200).json(g);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// UPDATE (CLEAN CLOUDINARY LOGIC)
exports.updateMyGuitariste = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const isAdmin = req.auth.isAdmin;
    const id = isAdmin ? req.params.id : null;

    let guitariste = id
      ? await Guitariste.findById(id)
      : await Guitariste.findOne({ userId });

    if (!guitariste) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    let updatedData = { ...req.body };

    // styles
    updatedData.style =
      typeof req.body.style === "string"
        ? req.body.style
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(req.body.style)
          ? req.body.style.map((s) => s.trim())
          : [];

    // instruments
    updatedData.instrument =
      typeof req.body.instrument === "string"
        ? req.body.instrument
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(req.body.instrument)
          ? req.body.instrument.map((s) => s.trim())
          : [];

    // IMAGE UPDATE
    if (req.files?.image?.[0]) {
      if (guitariste.photoPublicId) {
        await cloudinary.uploader.destroy(guitariste.photoPublicId);
      }

      updatedData.photo = req.files.image[0].path;
      updatedData.photoPublicId = req.files.image[0].filename;
    }

    // AUDIO UPDATE
    if (req.files?.audio?.[0]) {
      if (guitariste.audioPublicId) {
        await cloudinary.uploader.destroy(guitariste.audioPublicId, {
          resource_type: "video",
        });
      }

      updatedData.audio = req.files.audio[0].path;
      updatedData.audioPublicId = req.files.audio[0].filename;
    }

    // slug update
    if (updatedData.nom && updatedData.nom !== guitariste.nom) {
      const baseSlug = slugify(updatedData.nom, { lower: true, strict: true });

      let slug = baseSlug;
      let counter = 1;

      while (await Guitariste.findOne({ slug, _id: { $ne: guitariste._id } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      updatedData.slug = slug;
    }

    delete updatedData.userId;

    const updated = await Guitariste.findByIdAndUpdate(
      guitariste._id,
      updatedData,
      { new: true },
    );

    res.status(200).json({
      message: "Profil mis à jour !",
      slug: updated.slug,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//DELETE (CLEAN CLOUDINARY)
exports.deleteMyGuitariste = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const isAdmin = req.auth.isAdmin;

    const id = isAdmin ? req.params.id : null;

    const guitariste = id
      ? await Guitariste.findById(id)
      : await Guitariste.findOne({ userId });

    if (!guitariste) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    if (guitariste.photoPublicId) {
      await cloudinary.uploader.destroy(guitariste.photoPublicId);
    }

    if (guitariste.audioPublicId) {
      await cloudinary.uploader.destroy(guitariste.audioPublicId, {
        resource_type: "video",
      });
    }

    await Guitariste.findByIdAndDelete(guitariste._id);

    res.status(200).json({ message: "Profil supprimé !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
