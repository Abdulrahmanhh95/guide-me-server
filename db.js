import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const file = path.join(__dirname, 'data', 'db.json')
const adapter = new JSONFile(file)

export const db = new Low(adapter, {
  users: [],
  bookings: [],
  notifications: [],
  tests: [],
  reviews: []
})

export async function initDb() {
  await db.read()
  db.data ||= { users: [], bookings: [], notifications: [], tests: [], reviews: [] }
  await db.write()
}
