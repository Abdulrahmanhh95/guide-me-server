import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/:teacherId', async (req, res) => {
  await db.read()
  const reviews = (db.data.reviews || []).filter(r => r.teacherId === req.params.teacherId)
  res.json(reviews)
})

router.post('/', async (req, res) => {
  await db.read()
  db.data.reviews ||= []
  const review = {
    id: `review-${Date.now()}`,
    teacherId: req.body.teacherId,
    rating: Number(req.body.rating || 5),
    comment: req.body.comment || '',
    createdAt: new Date().toISOString()
  }
  db.data.reviews.push(review)
  await db.write()
  res.status(201).json(review)
})

export default router
