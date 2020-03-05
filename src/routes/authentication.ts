import { Request, Response, Router } from 'express'

import { authenticate, refresh } from '../services/authService'

export const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body

    if (!name || !password) {
      res.status(401).json({ message: 'No data provided' })
      return
    }

    const responseData = await authenticate(name, password)

    if (responseData.error) {
      res.status(406).json({ message: 'Incorrect username or password' })
      return
    }

    res.json(responseData)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token)  {
      res.status(401).json({ message: 'Refresh token not found' })
      return
    }

    const responseData = await refresh(refresh_token)

    if (responseData.error) {
      res.status(406).json({ message: 'Wrong token' })
      return
    }

    res.json(responseData)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

export default router
