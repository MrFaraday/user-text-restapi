import { Application } from 'express'
import bearerToken from 'express-bearer-token'

import authorization from '../middlewares/autorization'

export const users_route = (app: Application) => {
  const collections = app.locals.collections

  app.get(/^\/users(\/[0-9]*)?$/, bearerToken(), authorization(), async (req, res) => {
    try {
      const page: number = parseInt(req.originalUrl.match(/^\/users(?:\/([0-9]*))?$/)[1]) || 1 // берём страницу изи url или первую, если в url её нет
      const users_size: number = await collections['users'].countDocuments()

      // 3 users per page
      let totalPages = Math.floor(users_size / 3)
      users_size % 3 === 0 || totalPages++

      if (totalPages < page) return res.status(400).json({ message: 'Incorrect page' })

      const users = await collections['users'].find()
        .project({ password: 0 })
        .skip((page - 1) * 3)
        .limit(3)
        .toArray()

      for (const user of users) {
        const text = await collections['text'].find({ user_id: user._id }).toArray()
        user.texts = text
      }

      res.json({
        users,
        page,
        totalPages,
        usersCount: users_size
      })
    } catch (e) {
      res.status(500).json({ message: 'Server Error' })
      console.log(e)
    }
  })
}
