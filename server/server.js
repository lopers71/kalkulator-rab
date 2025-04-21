import express from 'express'
import jsonServer from 'json-server'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://kalkulator-rab.vercel.app'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Parse JSON bodies
app.use(express.json())

// JSON Server setup
const router = jsonServer.router(join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

// Use default json-server middlewares
app.use(middlewares)

// Use json-server router
app.use(router)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 