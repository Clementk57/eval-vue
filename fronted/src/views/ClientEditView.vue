<template>
  <div class="container pt-4 client-container">
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <h1 v-if="isEditMode">Éditer le client #{{ idParam }}</h1>
        <h1 v-else>Créer un nouveau client</h1>

        <form @submit.prevent="onSave" v-if="form" class="client-form">
          <h5>Contact :</h5>
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label for="prenom" class="form-label">Prénom</label>
              <input
                type="text"
                id="prenom"
                class="form-control"
                v-model="form.prenom"
                required
              />
            </div>
            <div class="col-md-4">
              <label for="nom" class="form-label">Nom</label>
              <input
                type="text"
                id="nom"
                class="form-control"
                v-model="form.nom"
                required
              />
            </div>
            <div class="col-md-4">
              <label for="entreprise" class="form-label">Entreprise</label>
              <input
                type="text"
                id="entreprise"
                class="form-control"
                v-model="form.entreprise"
              />
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label for="telephone" class="form-label">Téléphone</label>
              <input
                type="text"
                id="telephone"
                class="form-control"
                v-model="form.telephone"
              />
            </div>
            <div class="col-md-8">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                class="form-control"
                v-model="form.email"
              />
            </div>
          </div>

          <h5 class="mt-4">Coordonnées :</h5>
          <div class="row g-3 mt-2 mb-4">
            <div class="col-md-6">
              <label for="adresse1" class="form-label">Adresse 1</label>
              <input
                type="text"
                id="adresse1"
                class="form-control"
                v-model="form.adresse1"
              />
            </div>
            <div class="col-md-6">
              <label for="adresse2" class="form-label">Adresse 2</label>
              <input
                type="text"
                id="adresse2"
                class="form-control"
                v-model="form.adresse2"
              />
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-3">
              <label for="codePostal" class="form-label">Code Postal</label>
              <input
                type="text"
                id="codePostal"
                class="form-control"
                v-model="form.codePostal"
              />
            </div>
            <div class="col-md-3">
              <label for="ville" class="form-label">Ville</label>
              <input
                type="text"
                id="ville"
                class="form-control"
                v-model="form.ville"
              />
            </div>
            <div class="col-md-3">
              <label for="pays" class="form-label">Pays</label>
              <select
                id="pays"
                class="form-select"
                v-model="form.pays"
              >
                <option>France</option>
                <option>Belgique</option>
                <option>Suisse</option>
                <option>Luxembourg</option>
              </select>
            </div>
            <div class="col-md-3 text-end align-self-end">
              <BButton
                v-if="isEditMode"
                variant="danger"
                iconLeft="trash"
                class="me-2"
                @click="onDelete"
              >
                Supprimer
              </BButton>
              <BButton
                variant="secondary"
                iconLeft="arrow-left"
                @click="onCancel"
              >
                Retour
              </BButton>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <BButton :disabled="formInvalid" iconLeft="save" type="submit" variant="primary" class="save-btn">
              Enregistrer
            </BButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client.store.js'
import { clientInterface } from '@/interfaces/client.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const idParam = route.params.id ?? null
const isEditMode = computed(() => idParam !== null)

const clientStore = useClientStore()
const { getClient, createClient, updateClient, deleteClient } = clientStore
const { client } = storeToRefs(clientStore)

const form = ref({ ...clientInterface, id: null })

onBeforeMount(async () => {
  if (isEditMode.value) {
    await getClient(idParam)
    const c = client.value
    if (!c) {
      alert(`Client #${idParam} introuvable.`)
      return router.push({ name: 'clients-list' })
    }
    form.value = {
      id: c.id,
      prenom: c.prenom,
      nom: c.nom,
      entreprise: c.entreprise,
      telephone: c.telephone,
      email: c.email,
      adresse1: c.adresse1,
      adresse2: c.adresse2,
      codePostal: c.codePostal,
      ville: c.ville,
      pays: c.pays
    }
  } else {
    form.value = { ...clientInterface }
  }
})

const formInvalid = computed(() => {
  if (!form.value.prenom || form.value.prenom.length < 3) return true
  if (!form.value.nom || form.value.nom.length < 3) return true
  return false
})

function onCancel() {
  router.push({ name: 'clients-list' })
}

async function onDelete() {
  if (!isEditMode.value) return
  if (!confirm(`Supprimer le client #${form.value.id} ?`)) return
  try {
    await deleteClient(form.value.id)
    router.push({ name: 'clients-list' })
  } catch (err) {
    console.error(err)
  }
}

async function onSave() {
  try {
    if (isEditMode.value) {
      await updateClient(form.value.id, {
        prenom: form.value.prenom,
        nom: form.value.nom,
        entreprise: form.value.entreprise,
        telephone: form.value.telephone,
        email: form.value.email,
        adresse1: form.value.adresse1,
        adresse2: form.value.adresse2,
        codePostal: form.value.codePostal,
        ville: form.value.ville,
        pays: form.value.pays
      })
    } else {
      await createClient({
        prenom: form.value.prenom,
        nom: form.value.nom,
        entreprise: form.value.entreprise,
        telephone: form.value.telephone,
        email: form.value.email,
        adresse1: form.value.adresse1,
        adresse2: form.value.adresse2,
        codePostal: form.value.codePostal,
        ville: form.value.ville,
        pays: form.value.pays
      })
    }
    router.push({ name: 'clients-list' })
  } catch (err) {
    console.error('Erreur lors de l’enregistrement :', err.response?.data || err.message)
    alert('Impossible d’enregistrer : ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
.client-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

h1 {
  color: #343a40;
  margin-bottom: 20px;
}

h5 {
  font-weight: 600;
  color: #495057;
  margin-bottom: 10px;
}

.client-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.client-form .form-label {
  font-weight: 500;
  color: #444;
}

.me-2 {
  margin-right: 0.5rem;
}

.save-btn {
  min-width: 140px;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
