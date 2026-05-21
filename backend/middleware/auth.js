const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ error: "Token invalide" });
    }

    req.auth = {
      userId: decoded.userId,
      role: decoded.role || "user",
      isAdmin: decoded.role === "admin",
    };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    return res.status(401).json({
      error: "Requête non authentifiée ou token expiré",
    });
  }
};