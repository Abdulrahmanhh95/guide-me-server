import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  await db.read()
  res.json(db.data.tests || [])
})

export default router
