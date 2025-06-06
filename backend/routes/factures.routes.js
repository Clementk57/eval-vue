import express from 'express'
import {
  getAllFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture
} from '../models/facture.model.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const factures = await getAllFactures()
    res.json(factures)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la lecture des factures.' })
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const f = await getFactureById(id)
    if (!f) return res.status(404).json({ message: `Facture #${id} introuvable.` })
    res.json(f)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la lecture d’une facture.' })
  }
})

router.post('/', async (req, res) => {

  const newFacture = req.body
  if (!newFacture.numero || newFacture.numero.length < 3) {
    return res.status(400).json({ message: 'Missing numero ou numero trop court.' })
  }
  try {
    const created = await createFacture(newFacture)
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la création.' })
  }
})

router.patch('/:id', async (req, res) => {
  const id = req.params.id
  const fieldsToUpdate = req.body
  try {
    const updated = await updateFacture(id, fieldsToUpdate)
    if (!updated) return res.status(404).json({ message: `Facture #${id} introuvable.` })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' })
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const ok = await deleteFacture(id)
    if (!ok) return res.status(404).json({ message: `Facture #${id} introuvable.` })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' })
  }
})

export default router
