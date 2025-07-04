const mongoose = require("mongoose");
const slugify = require("slugify");

const guitaristeSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    nom: { type: String, required: true },
    slug: { type: String },
    ville: { type: String },
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
    copyrightAccepted: { type: Boolean, required: true, default: false },
    likes: {
      type: Number,
      default: 0,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reportedByVisitors: {
      type: [String],
      default: [],
    },
    reports: [
      {
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
        from: { type: String }, // userId ou visitorId
      },
    ],
  },
  { timestamps: true }
);

guitaristeSchema.pre("save", async function (next) {
  if (!this.isModified("nom")) return next();

  const baseSlug = slugify(this.nom, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Recherche d’un slug unique via le modèle actuel
  while (await this.constructor.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model("Guitariste", guitaristeSchema);
