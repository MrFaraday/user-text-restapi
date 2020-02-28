// authorization.js

const jwt = require('jsonwebtoken');
process.env.NODE_ENV === 'production' || require('dotenv').config();

const SECRET = process.env.SECRET;

const authorization = async (req, res, next) => {
  try {
    jwt.verify(req.token, SECRET);
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unathorized' })
  }
}

module.exports = authorization;
