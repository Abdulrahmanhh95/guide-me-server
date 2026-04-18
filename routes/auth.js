import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  await db.read()
  const user = db.data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const { password: _, ...safeUser } = user
  res.json({ user: safeUser, token: `demo-token-${safeUser.id}` })
})

export default router
