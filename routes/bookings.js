import { Router } from 'express'
import { nanoid } from 'nanoid'
import { db } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  const { userId, role } = req.query
  await db.read()

  let bookings = db.data.bookings

  if (role === 'student') {
    bookings = bookings.filter((b) => b.studentId === userId)
  } else if (role === 'teacher') {
    bookings = bookings.filter((b) => b.teacherId === userId)
  }

  const enriched = bookings.map((booking) => ({
    ...booking,
    student: db.data.users.find((u) => u.id === booking.studentId)?.name || 'Unknown student',
    teacher: db.data.users.find((u) => u.id === booking.teacherId)?.name || 'Unknown teacher'
  }))

  res.json(enriched)
})

router.post('/', async (req, res) => {
  const { studentId, teacherId, subject, sessionDate, sessionTime, sessionsCount, note, type } = req.body

  if (!studentId || !teacherId || !subject || !sessionDate || !sessionTime) {
    return res.status(400).json({ message: 'Missing required fields.' })
  }

  await db.read()

  const booking = {
    id: nanoid(),
    studentId,
    teacherId,
    subject,
    sessionDate,
    sessionTime,
    durationMinutes: 45,
    sessionsCount: Number(sessionsCount || 1),
    note: note || '',
    type: type || 'individual',
    status: 'pending',
    createdAt: new Date().toISOString()
  }

  db.data.bookings.push(booking)
  await db.write()

  res.status(201).json(booking)
})

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['pending', 'teacher_approved', 'admin_approved', 'cancelled']

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' })
  }

  await db.read()
  const booking = db.data.bookings.find((b) => b.id === id)

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' })
  }

  booking.status = status
  await db.write()
  res.json(booking)
})

export default router
