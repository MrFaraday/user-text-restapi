const jwt = require('jsonwebtoken');
process.env.NODE_ENV === 'production' || require('dotenv').config();

const SECRET = process.env.SECRET;

module.exports = () => {
  return async (req, res, next) => {
    try {

      if (!req.token) {
        res.status(401).json({ message: 'Unathorized' });
        return;
      }

      jwt.verify(req.token, SECRET);
      next();

    } catch (e) {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
}
