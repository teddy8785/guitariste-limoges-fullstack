const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = {
      userId: decodedToken.userId,
      role: decodedToken.role,
      isAdmin: decodedToken.role === "admin", // ou selon la valeur exacte pour admin dans ton token
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée" });
  }
};
