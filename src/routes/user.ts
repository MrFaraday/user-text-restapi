import { Application } from 'express'
import bearerToken from 'express-bearer-token'

import authorization from '../middlewares/autorization'

export const user_route = (app: Application) => {
  const collections = app.locals.collections

  app.get(/^\/\w{4,16}$/, bearerToken(), authorization(), async (req, res) => {
    try {
      const userName = req.originalUrl.match(/^\/(\w{4,16})$/)[1]  // извлекаем имя пользователя
      const user = await collections['users'].findOne({ name: userName }, { projection: { password: 0 } })

      if (!user) {
        res.status(400).json({ message: 'User not found' })
        return
      }

      const text = await collections['text'].find({ user_id: user._id }).toArray()

      res.json({
        ...user,
        text
      })
    } catch (e) {
      res.status(500).json({ message: 'Server Error' })
      console.log(e)
    }
  })
}