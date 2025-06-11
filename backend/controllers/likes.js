const mongoose = require("mongoose");
const Guitariste = require("../models/guitaristes");
const Like = require("../models/likes");
const User = require("../models/user");

async function toggleLike({ userId, visitorKey, profileId }) {
  if (!userId && !visitorKey) throw new Error("userId ou visitorKey requis");

  const query = { profileId };
  if (userId) query.userId = userId;
  else query.visitorKey = visitorKey;

  const existingLike = await Like.findOne(query);

  let liked;

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $pull: { likedProfiles: { profileId } },
      });
    }

    liked = false;
  } else {
    await Like.create(query);

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { likedProfiles: { profileId, likedAt: new Date() } },
      });
    }

    liked = true;
  }

  const newCount = await Like.countDocuments({ profileId });
  await Guitariste.findByIdAndUpdate(profileId, { likes: newCount });

  return { liked, newCount };
}

async function getLikeStatus(req, res) {
  try {
    console.log("req.user:", req.user);
    const userId = req.auth ? req.auth.userId : null;
    const profileId = req.params.id;
    const visitorKey = req.query.visitorKey || null;

    console.log(
      "Checking likes for userId:",
      userId,
      "profileId:",
      profileId,
      "visitorKey:",
      visitorKey
    );

    let existingLike = null;

    if (userId) {
      existingLike = await Like.findOne({ userId, profileId });
    } else if (visitorKey) {
      existingLike = await Like.findOne({ visitorKey, profileId });
    }

    console.log("existingLike:", existingLike);

    const count = await Like.countDocuments({ profileId });

    res.json({
      liked: !!existingLike,
      count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function toggleLikeAnonymous(req, res) {
  try {
    const profileId = req.params.id;
    const { visitorKey } = req.body;

    if (!visitorKey) {
      return res.status(400).json({ error: "visitorKey requis" });
    }

    const existingLike = await Like.findOne({ profileId, visitorKey });

    if (existingLike) {
      return res.json({ liked: true }); // déjà liké
    }

    await Like.create({ profileId, visitorKey });
    await Guitariste.findByIdAndUpdate(profileId, { $inc: { likes: 1 } });

    const newCount = await Like.countDocuments({ profileId });

    return res.json({ liked: true, newCount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getLikeCount(req, res) {
  try {
    const profileId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ error: "ID profile invalide" });
    }

    const count = await Like.countDocuments({ profileId });
    res.json({ count });
  } catch (err) {
    console.error("Erreur getLikeCount:", err);
    res.status(500).json({ error: "Erreur lors du comptage des likes" });
  }
}

async function transferVisitorLikesToUser(req, res) {
  const { visitorKey } = req.body;
  const userId = req.auth.userId;

  if (!visitorKey || !userId) {
    return res.status(400).json({ message: "visitorKey et userId requis" });
  }

  try {
    const visitorLikes = await Like.find({ visitorKey });

    for (const like of visitorLikes) {
      const existingLike = await Like.findOne({
        userId,
        profileId: like.profileId,
      });

      if (!existingLike) {
        like.userId = userId;
        like.visitorKey = null;
        await like.save();
      } else {
        await like.deleteOne();
      }
    }

    const updatedProfiles = new Set(visitorLikes.map((like) => like.profileId));
    for (const profileId of updatedProfiles) {
      const newCount = await Like.countDocuments({ profileId });
      await Guitariste.findByIdAndUpdate(profileId, { likes: newCount });
    }

    res.status(200).json({ message: "Likes transférés avec succès" });
  } catch (error) {
    console.error("Erreur lors du transfert des likes:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  toggleLike,
  getLikeStatus,
  toggleLikeAnonymous,
  getLikeCount,
  transferVisitorLikesToUser,
};
