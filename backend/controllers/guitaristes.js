const Guitariste = require("../models/guitaristes");

exports.createGuitariste = (req, res) => {
  const guitariste = new Guitariste({
    ...req.body,
    userId: req.auth.userId,
  });

  guitariste
    .save()
    .then(() => res.status(201).json({ message: "Guitariste enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllGuitaristes = (req, res) => {
  Guitariste.find()
    .then((guitaristes) => res.status(200).json(guitaristes))
    .catch((error) => res.status(400).json({ error }));
};

exports.getMyGuitariste = (req, res) => {
  Guitariste.findOne({ userId: req.auth.userId })
    .then(guitariste => {
      if (!guitariste) {
        return res.status(404).json({ message: 'Profil non trouvé' });
      }
      res.status(200).json(guitariste);
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getGuitaristeById = async (req, res) => {
  try {
    const guitariste = await Guitariste.findById(req.params.id);
    if (!guitariste) {
      return res.status(404).json({ message: 'Guitariste non trouvé' });
    }
    res.status(200).json(guitariste);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.updateMyGuitariste = (req, res) => {
  Guitariste.findOneAndUpdate(
    { userId: req.auth.userId },
    { ...req.body },
    { new: true }
  )
    .then(guitariste => {
      if (!guitariste) {
        return res.status(404).json({ message: 'Profil non trouvé' });
      }
      res.status(200).json(guitariste);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteMyGuitariste = (req, res) => {
  Guitariste.findOneAndDelete({ userId: req.auth.userId })
    .then(guitariste => {
      if (!guitariste) {
        return res.status(404).json({ message: 'Profil non trouvé' });
      }
      res.status(200).json({ message: 'Profil supprimé' });
    })
    .catch(error => res.status(500).json({ error }));
};