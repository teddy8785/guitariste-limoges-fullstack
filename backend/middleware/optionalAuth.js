const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.auth = {
        userId: decodedToken.userId,
        role: decodedToken.role,
        isAdmin: decodedToken.role === "admin",
      };
    } catch (err) {
      // Token invalide, mais on ne bloque pas la requête
      console.warn("Token invalide ou expiré : visiteur anonyme");
    }
  }

  next();
};
