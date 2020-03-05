import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

process.env.NODE_ENV === 'production' || require('dotenv').config()  // for development
const SECRET = process.env.SECRET

interface RequestWithToken extends Request {
  token: string
}

export const authorization = () => {
  return async (req: RequestWithToken, res: Response, next: () => void) => {
    try {

      if (!req.token) {
        res.status(401).json({ message: 'Unathorized' })
        return
      }

      jwt.verify(req.token, SECRET)
      next()

    } catch (e) {
      res.status(403).json({ message: 'Forbidden' })
    }
  }
}

export default authorization
