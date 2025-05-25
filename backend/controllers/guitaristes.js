const Guitariste = require('../models/guitaristes');

exports.createGuitariste = (req, res) => {
  const guitariste = new Guitariste({
    ...req.body
  });

  guitariste.save()
    .then(() => res.status(201).json({ message: 'Guitariste enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllGuitaristes = (req, res) => {
  Guitariste.find()
    .then(guitaristes => res.status(200).json(guitaristes))
    .catch(error => res.status(400).json({ error }));
};