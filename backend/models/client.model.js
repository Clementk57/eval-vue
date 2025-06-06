import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const DATA_PATH = path.resolve(__dirname, '../data/clients.json')

async function readData() {
  if (!(await fs.pathExists(DATA_PATH))) {
    await fs.writeJSON(DATA_PATH, { clients: [] }, { spaces: 2 })
  }
  return fs.readJSON(DATA_PATH)
}

async function writeData(data) {
  return fs.writeJSON(DATA_PATH, data, { spaces: 2 })
}

export async function getAllClients() {
  const data = await readData()
  return data.clients
}

export async function getClientById(id) {
  const data = await readData()
  return data.clients.find((c) => c.id === +id) || null
}

export async function createClient(newClient) {
  const data = await readData()
  const maxId = data.clients.reduce((acc, c) => (c.id > acc ? c.id : acc), 0)
  const nextId = maxId + 1
  const clientToAdd = { id: nextId, ...newClient }
  data.clients.push(clientToAdd)
  await writeData(data)
  return clientToAdd
}

export async function updateClient(id, fieldsToUpdate) {
  const data = await readData()
  const idx = data.clients.findIndex((c) => c.id === +id)
  if (idx === -1) return null
  data.clients[idx] = { ...data.clients[idx], ...fieldsToUpdate, id: +id }
  await writeData(data)
  return data.clients[idx]
}

export async function deleteClient(id) {
  const data = await readData()
  const idx = data.clients.findIndex((c) => c.id === +id)
  if (idx === -1) return false
  data.clients.splice(idx, 1)
  await writeData(data)
  return true
}
