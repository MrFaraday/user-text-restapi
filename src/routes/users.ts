import { Request, Response, Router } from 'express'
import bearerToken from 'express-bearer-token'

import authorization from '../middlewares/autorization'
import db from '../services/dbService'
import { request } from 'http'

export const router = Router()

router.use(bearerToken())
router.use(authorization())

router.get(/(\/\d{1,5})?$/, async (req: Request, res: Response) => {
  try {
    let page: number = parseInt(req.originalUrl.match(/^\/users(?:\/([0-9]*))?$/)[1], 10) || 1 // берём страницу изи url или первую, если в url её нет
    page = page > 0 ? page : 1
    const usersCount: number = await db.collections.users.countDocuments()

    // 3 users per page
    let totalPages = Math.floor(usersCount / 3)
    usersCount % 3 === 0 || totalPages++

    if (totalPages < page) return res.status(400).json({ message: 'Incorrect page' })

    const users = await db.collections.users.find()
      .project({ password: 0 })
      .skip((page - 1) * 3)
      .limit(3)
      .toArray()

    for (const user of users) {
      const text = await db.collections.text.find({ user_id: user._id }).toArray()
      user.texts = text
    }

    res.json({
      users,
      page,
      total_pages: totalPages,
      users_count: usersCount
    })
  } catch (e) {
    res.status(500).json({ message: 'Server Error' })
    console.log(e)
  }
})

export default router
