import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/teachers', async (req, res) => {
  await db.read()
  const teachers = db.data.users
    .filter((u) => u.role === 'teacher')
    .map(({ password, ...safeUser }) => safeUser)
  res.json(teachers)
})

router.get('/:id', async (req, res) => {
  await db.read()
  const user = db.data.users.find((u) => u.id === req.params.id)

  if (!user) return res.status(404).json({ message: 'User not found.' })

  const { password, ...safeUser } = user
  res.json(safeUser)
})

export default router
