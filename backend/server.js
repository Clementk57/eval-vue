// backend/server.js
import express from 'express'
import cors from 'cors'

import facturesRouter from './routes/factures.routes.js'
import clientsRouter  from './routes/clients.routes.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/factures', facturesRouter)
app.use('/api/clients', clientsRouter)

app.get('/', (req, res) => {
  res.send({ message: 'Bienvenue sur l’API Facturation !' })
})

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
})
