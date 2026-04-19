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
const PORT = process.env.PORT || 5000

await initDb()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'GUIDE ME API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/teacher', teacherRoutes)
app.use('/api/tests', testsRoutes)
app.use('/api/reviews', reviewsRoutes)

app.listen(PORT, () => {
  console.log(`GUIDE ME server running on port ${PORT}`)
})
