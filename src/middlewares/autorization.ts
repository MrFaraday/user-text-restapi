const jwt = require('jsonwebtoken');
process.env.NODE_ENV === 'production' || require('dotenv').config();

const SECRET = process.env.SECRET;

interface RequestWithToken extends Express.Request {
  token: string
}

interface ResponseWithStatus extends Express.Response {
  status(status: number): ResponseWithStatus,
  json(obj: object): ResponseWithStatus
}

module.exports = () => {
  return async (req: RequestWithToken, res: ResponseWithStatus, next: Function) => {
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
