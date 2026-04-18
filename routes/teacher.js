import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/summary/:teacherId', async (req, res) => {
  await db.read()
  const teacherId = req.params.teacherId
  const bookings = (db.data.bookings || []).filter(b => b.teacherId === teacherId)
  res.json({
    totalSessions: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approvedByTeacher: bookings.filter(b => b.status === 'teacher_approved').length,
    approvedFinal: bookings.filter(b => b.status === 'admin_approved').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  })
})

router.get('/bookings/:teacherId', async (req, res) => {
  await db.read()
  const teacherId = req.params.teacherId
  const bookings = (db.data.bookings || [])
    .filter(b => b.teacherId === teacherId)
    .map((booking) => ({
      ...booking,
      student: db.data.users.find((u) => u.id === booking.studentId)?.name || 'Unknown student'
    }))
  res.json(bookings)
})

router.patch('/bookings/:id/approve', async (req, res) => {
  await db.read()
  const booking = db.data.bookings.find(b => b.id === req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })
  booking.status = 'teacher_approved'
  await db.write()
  res.json(booking)
})

router.patch('/bookings/:id/reject', async (req, res) => {
  await db.read()
  const booking = db.data.bookings.find(b => b.id === req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })
  booking.status = 'cancelled'
  booking.cancelReason = req.body.reason || 'Rejected by teacher'
  await db.write()
  res.json(booking)
})

router.get('/availability/:teacherId', async (req, res) => {
  await db.read()
  const teacher = db.data.users.find(u => u.id === req.params.teacherId)
  res.json(teacher?.availability || [])
})

router.post('/availability', async (req, res) => {
  await db.read()
  const teacher = db.data.users.find(u => u.id === req.body.teacherId)
  if (!teacher) return res.status(404).json({ message: 'Teacher not found.' })
  teacher.availability ||= []
  const slot = {
    id: `slot-${Date.now()}`,
    day: req.body.day || '',
    from: req.body.from || '',
    to: req.body.to || ''
  }
  teacher.availability.push(slot)
  await db.write()
  res.status(201).json(slot)
})

router.delete('/availability/:teacherId/:slotId', async (req, res) => {
  await db.read()
  const teacher = db.data.users.find(u => u.id === req.params.teacherId)
  if (!teacher) return res.status(404).json({ message: 'Teacher not found.' })
  teacher.availability = (teacher.availability || []).filter(s => s.id !== req.params.slotId)
  await db.write()
  res.json({ success: true })
})

export default router
