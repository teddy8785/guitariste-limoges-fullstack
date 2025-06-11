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
  { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
