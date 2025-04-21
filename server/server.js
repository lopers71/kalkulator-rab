import express from 'express'
import jsonServer from 'json-server'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create Express server
const app = express()

// Initial data for json-server
const initialData = {
  "material_costs": [],
  "price_history": []
}

// CORS configuration
app.use(cors())

// Parse JSON bodies
app.use(express.json())

// JSON Server setup with in-memory data
const router = jsonServer.router(initialData)
const middlewares = jsonServer.defaults()

// Use default json-server middlewares
app.use(middlewares)

// Use json-server router
app.use(router)

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

// For Vercel
export default app 