const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');
const refreshService = require('./refreshService');
process.env.NODE_ENV === 'production' || require('dotenv').config();

const SECRET = process.env.SECRET;

module.exports = async (userId) => {
  const newRefreshToken = uuid();
  refreshService.add({
    token: newRefreshToken,
    userId
  });

  return {
    access_token: jwt.sign({ id: userId }, SECRET, { expiresIn: 3600 }),
    refreshToken: newRefreshToken,
    expiresIn: 3600
  }
}
