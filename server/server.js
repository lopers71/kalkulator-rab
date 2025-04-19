import express from 'express'
import jsonServer from 'json-server'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const router = jsonServer.router(join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

// Enable CORS
app.use(cors())

// Parse JSON bodies
app.use(express.json())

// Use default json-server middlewares
app.use(middlewares)

// Use json-server router
app.use(router)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
}) 