import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import db from './dbService'

process.env.NODE_ENV === 'production' || require('dotenv').config()  // for development
const SECRET = process.env.SECRET

interface RefreshToken {
  userId: string
  token: string
}

interface ResponseData {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
}

export const authenticate = async (name: string, password: string): Promise<ResponseData> => {
  const user = await db.collections.users.findOne({ name }, { projection: { password: 1 } })

  if (!user) return { error: 'user not found' }
  if (!bcrypt.compareSync(password, user.password)) return { error: 'incorrect password' }

  return await issueToken(user._id)
}

export const refresh = async (token: string): Promise<ResponseData> => {
  const user = await RTInterface.findByToken(token)

  if (!user) return {error: 'not match'}

  return await issueToken(user.userId)
}

export default {
  authenticate,
  refresh
}

const issueToken = async (userId: string) => {
  const newRefreshToken = uuid()
  const refreshToken = await RTInterface.findById(userId)
  if (refreshToken) await RTInterface.remove(refreshToken)

  RTInterface.add({ token: newRefreshToken, userId })

  return {
    access_token: jwt.sign({ id: userId }, SECRET, { expiresIn: 3600 }),
    refresh_token: newRefreshToken,
    expires_in: 3600
  }
}

const refreshTokens: RefreshToken[] = []
const RTInterface = {
  add: async (user: RefreshToken) => {
    refreshTokens.push(user)
  },

  findByToken: async (token: string) => {
    return refreshTokens.find((el, index, arr) => el.token === token)
  },

  findById: async (userId: string) => {
    return refreshTokens.find((el, index, arr) => el.userId === userId)
  },

  remove: async (token: RefreshToken) => {
    const index = refreshTokens.indexOf(token)
    refreshTokens.splice(index, 1)
  }
}
