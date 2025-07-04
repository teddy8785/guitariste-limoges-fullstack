const Profile = require("../models/guitaristes");

exports.reportProfile = async (req, res) => {
  const { profileId, visitorId, reason } = req.body;
  const userId = req.auth?.userId;

  if (!reason) {
    return res
      .status(400)
      .json({ message: "Un motif de signalement est requis." });
  }

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profil non trouvé." });
    }

    // Initialisation défensive
    if (!profile.reportedBy) profile.reportedBy = [];
    if (!profile.reportedByVisitors) profile.reportedByVisitors = [];
    if (!profile.reports) profile.reports = [];

    // Vérifie si déjà signalé
    if (
      userId &&
      profile.reportedBy.some((id) => id.toString() === userId.toString())
    ) {
      return res
        .status(400)
        .json({ message: "Vous avez déjà signalé ce profil." });
    }

    if (visitorId && profile.reportedByVisitors.includes(visitorId)) {
      return res
        .status(400)
        .json({ message: "Vous avez déjà signalé ce profil." });
    }

    // Mise à jour des données
    if (userId) profile.reportedBy.push(userId);
    if (visitorId) profile.reportedByVisitors.push(visitorId);

    profile.reports.push({
      reason,
      date: new Date(),
      from: userId || visitorId || "inconnu",
    });

    profile.isReported = true;
    profile.reportCount = (profile.reportCount || 0) + 1;

    await profile.save();

    res.status(200).json({ message: "Signalement enregistré." });
  } catch (error) {
    console.error("Erreur signalement :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getReportedProfiles = async (req, res) => {
  try {
    if (!req.auth || req.auth.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const reportedProfiles = await Profile.find({ isReported: true });

    return res.status(200).json(reportedProfiles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getReportStatus = async (req, res) => {
  const { profileId, visitorId } = req.query;
  const userId = req.auth?.userId;

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ reported: false });
    }

    const reportedByUser = userId
      ? profile.reportedBy.some((id) => id.toString() === userId.toString())
      : false;

    const reportedByVisitor = visitorId
      ? profile.reportedByVisitors?.includes(visitorId)
      : false;

    return res.status(200).json({
      reported: reportedByUser || reportedByVisitor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reported: false });
  }
};

exports.postCheckReport = async (req, res) => {
  const { profileId, visitorId } = req.body;
  const userId = req.auth?.userId;

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ alreadyReported: false });

    let already = false;

    if (userId) {
      already =
        Array.isArray(profile.reportedBy) &&
        profile.reportedBy.some((id) => id.toString() === userId.toString());
    } else if (visitorId) {
      already =
        Array.isArray(profile.reportedByVisitors) &&
        profile.reportedByVisitors.includes(visitorId);
    }

    res.json({ alreadyReported: already });
  } catch (err) {
    console.error(err);
    res.status(500).json({ alreadyReported: false });
  }
};
