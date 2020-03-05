import { Request, Response, Router } from 'express'
import bearerToken from 'express-bearer-token'

import authorization from '../middlewares/autorization'
import db from '../services/dbService'

export const router = Router()

router.use(bearerToken())
router.use(authorization())

router.get(/^\/\w{4,16}$/, async (req: Request, res: Response) => {
  try {
    const userName = req.originalUrl.match(/(\w{4,16})$/)[1]  // извлекаем имя пользователя
    const user = await db.collections.users.findOne({ name: userName }, { projection: { password: 0 } })

    if (!user) {
      res.status(400).json({ message: 'User not found' })
      return
    }

    const text = await db.collections.text.find({ user_id: user._id }).toArray()

    res.json({
      ...user,
      text
    })
  } catch (e) {
    res.status(500).json({ message: 'Server Error' })
    console.log(e)
  }
})

export default router
