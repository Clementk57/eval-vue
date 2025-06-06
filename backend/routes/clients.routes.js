import express from 'express'
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../models/client.model.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const clients = await getAllClients()
    res.json(clients)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des clients.' })
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const c = await getClientById(id)
    if (!c) {
      return res.status(404).json({ message: `Client #${id} introuvable.` })
    }
    res.json(c)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la récupération d’un client.' })
  }
})

router.post('/', async (req, res) => {
  const nouvelleDonnee = req.body
  try {
    const created = await createClient(nouvelleDonnee)
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la création du client.' })
  }
})

router.patch('/:id', async (req, res) => {
  const id = req.params.id
  const fieldsToUpdate = req.body
  try {
    const updated = await updateClient(id, fieldsToUpdate)
    if (!updated) {
      return res.status(404).json({ message: `Client #${id} introuvable.` })
    }
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du client.' })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const success = await deleteClient(id)
    if (!success) {
      return res.status(404).json({ message: `Client #${id} introuvable.` })
    }
    res.json({ message: 'Client supprimé avec succès.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du client.' })
  }
})

export default router
