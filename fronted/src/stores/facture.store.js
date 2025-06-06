import { ref, computed } from 'vue'
import { defineStore }   from 'pinia'
import axios             from 'axios'

export const useFactureStore = defineStore('facture', () => {
  const factures = ref([])
  const facture  = ref(null)

  const totalFacturesCount = computed(() => factures.value.length)

  async function getFactures() {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/factures`)
      factures.value = resp.data
    } catch (err) {
      console.error('Erreur getFactures:', err)
    }
  }

  async function getFacture(id) {
  try {
    console.log(`[store] → appel GET /api/factures/${id}`) 
    const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/factures/${id}`)
    console.log(`[store] ← réponse GET /api/factures/${id}`, resp.data)
    facture.value = resp.data
  } catch (err) {
    console.error(`[store] Erreur getFacture(${id}) :`, err)
  }
}



  async function createFacture(dataToSend) {
    try {
      const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/factures`, dataToSend)
      facture.value = resp.data
      factures.value.push(resp.data)
    } catch (err) {
      console.error('Erreur createFacture:', err.response || err)
      throw err
    }
  }

  async function updateFacture(id, dataToUpdate) {
    try {
      const resp = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/factures/${id}`,
        dataToUpdate
      )
      facture.value = resp.data
      const idx = factures.value.findIndex((f) => f.id === +id)
      if (idx !== -1) factures.value[idx] = resp.data
    } catch (err) {
      console.error('Erreur updateFacture:', err.response || err)
      throw err
    }
  }

  async function deleteFacture(id) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/factures/${id}`)
      factures.value = factures.value.filter((f) => f.id !== +id)
      if (facture.value && facture.value.id === +id) facture.value = null
    } catch (err) {
      console.error('Erreur deleteFacture:', err.response || err)
      throw err
    }
  }

  return {
    factures,
    facture,
    totalFacturesCount,
    getFactures,
    getFacture,
    createFacture,
    updateFacture,
    deleteFacture
  }
})
