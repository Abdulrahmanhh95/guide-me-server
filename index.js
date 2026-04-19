import express from 'express'
import cors from 'cors'
import { initDb } from './db.js'
import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/bookings.js'
import userRoutes from './routes/users.js'
import adminRoutes from './routes/admin.js'
import teacherRoutes from './routes/teacher.js'
import testsRoutes from './routes/tests.js'
import reviewsRoutes from './routes/reviews.js'

const app = express()
const PORT = Number(process.env.PORT) || 8080

initDb().catch(err => {
  console.error('DB failed:', err)
})

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'GUIDE ME API is running' })
})

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, port: PORT })
})

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/teacher', teacherRoutes)
app.use('/api/tests', testsRoutes)
app.use('/api/reviews', reviewsRoutes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`GUIDE ME server running on port ${PORT}`)
})
