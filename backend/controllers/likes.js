const Guitariste = require("../models/guitaristes");
const Like = require("../models/likes");
const User = require("../models/user");

async function toggleLike({ userId, visitorKey, guitaristeId }) {
  let query = { guitaristeId };

  if (userId) {
    query.userId = userId;
  } else if (visitorKey) {
    query.visitorKey = visitorKey;
  } else {
    throw new Error("userId ou visitorKey requis");
  }

  const existingLike = await Like.findOne(query);

  let liked;

  if (existingLike) {
    // Unlike
    await Like.deleteOne({ _id: existingLike._id });
    await Guitariste.findByIdAndUpdate(guitaristeId, { $inc: { likes: -1 } });

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $pull: { likedGuitaristes: guitaristeId },
      });
    }

    liked = false;
  } else {
    // Like
    await Like.create(query);
    await Guitariste.findByIdAndUpdate(guitaristeId, { $inc: { likes: 1 } });

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: { likedGuitaristes: guitaristeId },
      });
    }

    liked = true;
  }

  const newCount = await Like.countDocuments({ guitaristeId });

  return { liked, newCount };
}

async function getLikeStatus(req, res) {
  try {
    const userId = req.user ? req.user._id : null;
    const guitaristeId = req.params.id;
    const visitorKey = req.query.visitorKey || null;

    let existingLike = null;

    if (userId) {
      existingLike = await Like.findOne({ userId, guitaristeId });
    } else if (visitorKey) {
      existingLike = await Like.findOne({ visitorKey, guitaristeId });
    }

    const count = await Like.countDocuments({ guitaristeId });

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
    const guitaristeId = req.params.id;
    const { visitorKey } = req.body;

    if (!visitorKey) {
      return res.status(400).json({ error: "visitorKey requis" });
    }

    const existingLike = await Like.findOne({ guitaristeId, visitorKey });

    if (existingLike) {
      return res.json({ liked: true }); // déjà liké
    }

    await Like.create({ guitaristeId, visitorKey });
    await Guitariste.findByIdAndUpdate(guitaristeId, { $inc: { likes: 1 } });

    const newCount = await Like.countDocuments({ guitaristeId });

    return res.json({ liked: true, newCount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getLikeCount(req, res) {
  try {
    const guitaristeId = req.params.id;
    console.log("API getLikeCount called with id:", guitaristeId);
    console.log(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(guitaristeId)) {
      return res.status(400).json({ error: "ID guitariste invalide" });
    }

    const count = await Like.countDocuments({ guitaristeId });
    res.json({ count });
  } catch (err) {
    console.error("Erreur getLikeCount:", err);
    res.status(500).json({ error: "Erreur lors du comptage des likes" });
  }
}

module.exports = {
  toggleLike,
  getLikeStatus,
  toggleLikeAnonymous,
  getLikeCount,
};
