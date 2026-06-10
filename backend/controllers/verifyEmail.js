const User = require("../models/user");

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token.trim();

    console.log("TOKEN:", token);

    const user = await User.findOne({ verificationToken: token });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalide",
      });
    }

    if (!user.verificationTokenExpires) {
      return res.status(400).json({
        success: false,
        message: "Token sans expiration",
      });
    }

    if (user.verificationTokenExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Lien expiré",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    console.log("REQ PARAM:", req.params.token);
    console.log(
      "DB MATCH:",
      await User.find({ verificationToken: req.params.token }),
    );
    return res.json({
      success: true,
      message: "succès",
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
