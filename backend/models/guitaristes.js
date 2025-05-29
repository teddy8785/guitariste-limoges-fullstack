const mongoose = require('mongoose');

const guitaristeSchema = mongoose.Schema({
  userId: { type: String, required: true },
  nom: { type: String, required: true },
  ville: { type:String },
  photo: { type: String },
  photoDown: { type: String },
  style: { type: [String] },
  instrument: { type: [String] },
  audio: { type: String },
  histoire: { type: String },
  mail: { type: String },
  lienx: { type: String },
  lieninstagram: { type: String },
  lienyoutube: { type: String },
  annonce: { type: String },
  annonceDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Guitariste', guitaristeSchema);