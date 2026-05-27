const mongoose = require("mongoose");

const likeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    visitorKey: {
      type: String,
      required: false,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guitariste",
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ userId: 1, profileId: 1 }, { unique: true, sparse: true });

likeSchema.index(
  { visitorKey: 1, profileId: 1 },
  { unique: true, sparse: true },
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
