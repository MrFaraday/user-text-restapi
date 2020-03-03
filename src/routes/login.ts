import { Request, Response, Application } from 'express'
import bcrypt from 'bcryptjs'

import issueToken from '../services/authService'
import refreshService from '../services/refreshService'

export const login_route = (app: Application) => {
  const collections = app.locals.collections

  app.post('/auth', async (req : Request, res: Response) => {
    const { name, password } = req.body

    if (!name || !password) {
      res.status(401).json({ message: 'No data provided' })
      return
    }

    const user = await collections['users'].findOne({ name }, { projection: { password: 1 } })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(403).json({ message: 'Incorrect username or password' })
      return
    }

    res.json(await issueToken(user._id))
  })

  app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body
    const user = await refreshService.find(refreshToken)
    if (!user) {
      res.status(403).json({ message: 'Wrong token' })
      return
    }

    const userId = user.userId
    await refreshService.remove(user)
    res.json(await issueToken(userId))
  })
}
