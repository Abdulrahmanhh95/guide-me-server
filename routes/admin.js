import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/summary', async (req, res) => {
  await db.read()
  const users = db.data.users || []
  const bookings = db.data.bookings || []

  res.json({
    users: {
      total: users.length,
      students: users.filter(u => u.role === 'student').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      admins: users.filter(u => u.role === 'admin').length
    },
    bookings: {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      teacherApproved: bookings.filter(b => b.status === 'teacher_approved').length,
      adminApproved: bookings.filter(b => b.status === 'admin_approved').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    }
  })
})

router.get('/users', async (req, res) => {
  await db.read()
  res.json(db.data.users.map(({ password, ...u }) => u))
})

router.post('/users', async (req, res) => {
  await db.read()
  const user = {
    id: `user-${Date.now()}`,
    name: req.body.name || 'New User',
    email: req.body.email || '',
    password: req.body.password || '123456',
    role: req.body.role || 'student',
    scholarshipStatus: req.body.scholarshipStatus || 'regular',
    remainingSessions: Number(req.body.remainingSessions || 0)
  }
  db.data.users.push(user)
  await db.write()
  const { password, ...safe } = user
  res.status(201).json(safe)
})

router.delete('/users/:id', async (req, res) => {
  await db.read()
  db.data.users = db.data.users.filter(u => u.id !== req.params.id)
  await db.write()
  res.json({ success: true })
})

router.get('/bookings', async (req, res) => {
  await db.read()
  const enriched = (db.data.bookings || []).map((booking) => ({
    ...booking,
    student: db.data.users.find((u) => u.id === booking.studentId)?.name || 'Unknown student',
    teacher: db.data.users.find((u) => u.id === booking.teacherId)?.name || 'Unknown teacher'
  }))
  res.json(enriched)
})

router.patch('/bookings/:id/approve', async (req, res) => {
  await db.read()
  const booking = db.data.bookings.find(b => b.id === req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })
  booking.status = 'admin_approved'
  await db.write()
  res.json(booking)
})

router.patch('/bookings/:id/cancel', async (req, res) => {
  await db.read()
  const booking = db.data.bookings.find(b => b.id === req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })
  booking.status = 'cancelled'
  booking.cancelReason = req.body.reason || 'Cancelled by admin'
  await db.write()
  res.json(booking)
})

export default router
