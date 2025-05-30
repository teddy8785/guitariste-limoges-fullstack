const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Token manquant');

    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé. Admin uniquement.' });
    }

    req.auth = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Requête non authentifiée' });
  }
};