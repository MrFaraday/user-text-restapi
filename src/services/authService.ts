import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'

import refreshService from './refreshService'

process.env.NODE_ENV === 'production' || require('dotenv').config()  // for development
const SECRET = process.env.SECRET

export const issueToken = async (userId: string) => {
  const newRefreshToken = uuid()
  refreshService.add({
    token: newRefreshToken,
    userId
  })

  return {
    access_token: jwt.sign({ id: userId }, SECRET, { expiresIn: 3600 }),
    refresh_token: newRefreshToken,
    expires_in: 3600
  }
}

export default issueToken
