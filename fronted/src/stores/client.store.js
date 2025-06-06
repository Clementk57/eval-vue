import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useClientStore = defineStore('client', () => {
  const clients = ref([])
  const client = ref(null)

  async function getClients() {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients`)
      clients.value = resp.data
    } catch (err) {
      console.error('Erreur getClients:', err)
    }
  }

  async function getClient(id) {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients/${id}`)
      client.value = resp.data
      console.log('URL API utilisée :', import.meta.env.VITE_API_URL)
    } catch (err) {
      console.error('Erreur getClient:', err)
      client.value = null
    }
  }

  async function createClient(dataToSend) {
    try {
      const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/clients`, dataToSend)
      client.value = resp.data
      clients.value.push(resp.data)
    } catch (err) {
      console.error('Erreur createClient:', err.response || err)
      throw err
    }
  }

  async function updateClient(id, fieldsToUpdate) {
    try {
      const resp = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
        fieldsToUpdate
      )
      client.value = resp.data
      const idx = clients.value.findIndex((c) => c.id === +id)
      if (idx !== -1) {
        clients.value[idx] = resp.data
      }
    } catch (err) {
      console.error('Erreur updateClient:', err.response || err)
      throw err
    }
  }

  async function deleteClient(id) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clients/${id}`)
      clients.value = clients.value.filter((c) => c.id !== +id)
      if (client.value && client.value.id === +id) {
        client.value = null
      }
    } catch (err) {
      console.error('Erreur deleteClient:', err.response || err)
      throw err
    }
  }

  return {
    clients,
    client,
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
  }
})
