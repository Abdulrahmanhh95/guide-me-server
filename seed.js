import { db, initDb } from './db.js'
import { nanoid } from 'nanoid'

await initDb()

db.data.users = [
  {
    id: nanoid(),
    name: 'Adam Haddad',
    email: 'student@guideme.app',
    password: '123456',
    role: 'student',
    scholarshipStatus: 'scholarship',
    sponsor: 'UNICEF',
    remainingSessions: 12,
    track: 'scientific',
    phone: '+963900000001',
    guardianPhone: '+963900000002'
  },
  {
    id: nanoid(),
    name: 'Ahmad Al Ali',
    email: 'teacher@guideme.app',
    password: '123456',
    role: 'teacher',
    subject: 'Mathematics',
    rating: 4.9,
    bio: 'Faculty of Science - 8 years experience'
  },
  {
    id: nanoid(),
    name: 'Main Admin',
    email: 'admin@guideme.app',
    password: '123456',
    role: 'admin'
  }
]

const student = db.data.users.find(u => u.role === 'student')
const teacher = db.data.users.find(u => u.role === 'teacher')

db.data.bookings = [
  {
    id: nanoid(),
    studentId: student.id,
    teacherId: teacher.id,
    subject: 'Mathematics',
    sessionDate: '2026-04-20',
    sessionTime: '18:00',
    durationMinutes: 45,
    sessionsCount: 1,
    note: 'Need help with algebra and equations',
    status: 'teacher_approved',
    type: 'individual',
    createdAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    studentId: student.id,
    teacherId: teacher.id,
    subject: 'Physics',
    sessionDate: '2026-04-22',
    sessionTime: '17:00',
    durationMinutes: 45,
    sessionsCount: 2,
    note: 'Revision for motion chapter',
    status: 'pending',
    type: 'individual',
    createdAt: new Date().toISOString()
  }
]

db.data.notifications = [
  {
    id: nanoid(),
    userId: student.id,
    text: 'Your mathematics session was approved by the teacher.',
    createdAt: new Date().toISOString()
  }
]

await db.write()
console.log('Seed completed.')


db.data.tests = [
  {
    id: nanoid(),
    subject: 'Mathematics',
    questions: [
      {
        question: '2 + 2 = ?',
        options: ['3', '4', '5', '6'],
        correct: 1
      }
    ]
  }
]

db.data.reviews = [
  {
    id: nanoid(),
    teacherId: teacher.id,
    rating: 5,
    comment: 'Excellent explanation and very clear teaching.',
    createdAt: new Date().toISOString()
  }
]
