const mongoose = require("mongoose");
const Guitariste = require("../models/guitaristes");
const Like = require("../models/likes");
const User = require("../models/user");

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.auth?.userId || null;
    const visitorKey = req.body.visitorKey || null;
    const profileId = req.params.id;

    if (!userId && !visitorKey) {
      return res.status(400).json({
        error: "userId ou visitorKey requis",
      });
    }

    const query = { profileId };

    if (userId) {
      query.userId = userId;
    } else {
      query.visitorKey = visitorKey;
    }

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
          $addToSet: {
            likedProfiles: {
              profileId,
              likedAt: new Date(),
            },
          },
        });
      }

      liked = true;
    }

    const newCount = await Like.countDocuments({ profileId });

    await Guitariste.findByIdAndUpdate(profileId, {
      likes: newCount,
    });

    return res.json({
      liked,
      count: newCount,
    });
  } catch (err) {
    console.error("TOGGLE LIKE ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getLikeStatus = async (req, res) => {
  try {
    const userId = req.auth ? req.auth.userId : null;
    const profileId = req.params.id;
    const visitorKey = req.query.visitorKey || null;

    let existingLike = null;

    if (userId) {
      existingLike = await Like.findOne({ userId, profileId });
    } else if (visitorKey) {
      existingLike = await Like.findOne({ visitorKey, profileId });
    }

    const count = await Like.countDocuments({ profileId });

    res.json({
      liked: !!existingLike,
      count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBulkLikeStatus = async (req, res) => {
  try {
    const userId = req.auth?.userId || null;
    const visitorKey = req.body.visitorKey || null;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids requis" });
    }

    // récupérer tous les likes en 1 requête
    const likes = await Like.find({
      profileId: { $in: ids },
    }).select("profileId userId visitorKey");

    // compter par profileId
    const countMap = {};
    const likedMap = {};

    for (const like of likes) {
      const id = like.profileId.toString();

      // count
      countMap[id] = (countMap[id] || 0) + 1;

      // liked (user connecté)
      if (userId && like.userId?.toString() === userId) {
        likedMap[id] = true;
      }

      // liked (visitor)
      if (!userId && visitorKey && like.visitorKey === visitorKey) {
        likedMap[id] = true;
      }
    }

    // format final propre pour le front
    const result = {};

    for (const id of ids) {
      result[id] = {
        liked: !!likedMap[id],
        count: countMap[id] || 0,
      };
    }

    return res.json(result);
  } catch (err) {
    console.error("BULK LIKE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getLikeCount = async (req, res) => {
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
};