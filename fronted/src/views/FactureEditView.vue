<template>
  <div class="container pt-4">
    <div class="row">
      <div class="col-md-10 offset-md-1">

        <h1 v-if="isEditMode">Éditer la facture #{{ idParam }}</h1>
        <h1 v-else>Créer une nouvelle facture</h1>

        <div v-if="isEditMode && isLoading">
          <p class="text-muted"><em>Chargement de la facture n°{{ idParam }}…</em></p>
        </div>

        <div v-else-if="isEditMode && !isLoading && !facture">
          <p class="text-danger">La facture n°{{ idParam }} est introuvable.</p>
          <BButton variant="secondary" @click="goBack">Revenir à la liste</BButton>
        </div>

        <form
          v-else-if="ready && (!isEditMode || (isEditMode && facture))"
          @submit.prevent="onSave"
          class="invoice-form"
        >
          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label for="numero" class="form-label">Facture N°</label>
              <input
                type="text"
                id="numero"
                class="form-control"
                v-model="form.numero"
                required
              />
            </div>
            <div class="col-md-5">
              <label for="description" class="form-label">Description</label>
              <input
                type="text"
                id="description"
                class="form-control"
                v-model="form.description"
                required
              />
            </div>
            <div class="col-md-3">
              <label for="date" class="form-label">Émise le</label>
              <input
                type="date"
                id="date"
                class="form-control"
                v-model="form.date"
                required
              />
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label for="client" class="form-label">Client</label>
              <select
                id="client"
                class="form-select"
                v-model.number="form.clientId"
                required
              >
                <option disabled value="">Sélectionnez un client</option>
                <option
                  v-for="c in clients"
                  :key="c.id"
                  :value="c.id"
                >
                  {{ c.prenom }} {{ c.nom }} – {{ c.entreprise }}
                </option>
              </select>
            </div>
            <div class="col-md-6 text-end align-self-end">
              <BButton
                v-if="isEditMode && facture"
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
                @click="goBack"
              >
                Retour
              </BButton>
            </div>
          </div>

          <hr class="separator" />

          <h5 class="mb-3">Articles</h5>

          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="row g-2 align-items-end mb-3 item-row"
          >
            <div class="col-md-4">
              <label class="form-label">Prestation</label>
              <input
                type="text"
                class="form-control"
                v-model="item.prestation"
                placeholder="Libellé de la prestation"
                required
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">Quantité</label>
              <input
                type="number"
                class="form-control"
                v-model.number="item.quantite"
                min="1"
                required
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">PU (€)</label>
              <input
                type="number"
                class="form-control"
                v-model.number="item.montantUnitaire"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">Total (€)</label>
              <input
                type="text"
                class="form-control-plaintext total-cell"
                :value="formatCurrency(item.quantite * item.montantUnitaire)"
                readonly
              />
            </div>
            <div class="col-md-2 text-end">
              <BButton
                variant="danger"
                size="sm"
                iconLeft="trash"
                @click="removeItem(index)"
              >
                Supprimer
              </BButton>
            </div>
          </div>

          <BButton
            variant="secondary"
            size="sm"
            iconLeft="plus"
            class="mb-4"
            @click="addItem"
          >
            Ajouter un article
          </BButton>

          <hr class="separator" />

          <div class="row g-3 summary-row">
            <div class="col-md-6 offset-md-6">
              <div class="d-flex justify-content-between">
                <strong>Total HT :</strong>
                <strong>{{ formatCurrency(totalHT) }}</strong>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <label for="remise" class="form-label mb-0">Remise (€)</label>
                <input
                  type="number"
                  id="remise"
                  class="form-control w-auto"
                  v-model.number="form.remise"
                  min="0"
                  step="0.01"
                />
              </div>
              <div class="d-flex justify-content-between mt-2">
                <span>Total Net :</span>
                <span>{{ formatCurrency(totalNet) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <label for="dejaPaye" class="form-label mb-0">Déjà payé (€)</label>
                <input
                  type="number"
                  id="dejaPaye"
                  class="form-control w-auto"
                  v-model.number="form.dejaPaye"
                  min="0"
                  step="0.01"
                />
              </div>
              <div class="d-flex justify-content-between mt-2">
                <strong>Reste à payer :</strong>
                <strong>{{ formatCurrency(remaining) }}</strong>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <BButton
              :disabled="formInvalid"
              iconLeft="save"
              type="submit"
              variant="primary"
              class="save-btn"
            >
              Enregistrer
            </BButton>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useFactureStore } from '@/stores/facture.store.js'
import { useClientStore } from '@/stores/client.store.js'
import { factureInterface } from '@/interfaces/facture.js'

const props = defineProps({
  id: { type: [String, Number], required: false }
})
const idParamRaw = props.id ?? null
const idParam = idParamRaw !== null ? Number(idParamRaw) : null
const isEditMode = computed(() => idParam !== null)
const router = useRouter()

const factureStore = useFactureStore()
const clientStore = useClientStore()
const { getFacture, createFacture, updateFacture, deleteFacture } = factureStore
const { getClients } = clientStore
const { facture } = storeToRefs(factureStore)
const { clients } = storeToRefs(clientStore)

const form = ref({ ...factureInterface, items: [] })
const isLoading = ref(false)
const ready = ref(false)

onBeforeMount(async () => {
  await getClients()
  if (isEditMode.value) {
    isLoading.value = true
    await getFacture(idParam)
    isLoading.value = false
    if (!facture.value || typeof facture.value !== 'object') {
      alert(`❗ Facture #${idParam} introuvable.`)
      return router.push({ name: 'factures-list' })
    }
    const f = facture.value
    form.value = {
      id: f.id,
      numero: f.numero,
      description: f.description,
      date: f.date,
      clientId: f.clientId,
      items: JSON.parse(JSON.stringify(f.items || [])),
      remise: f.remise ?? 0,
      dejaPaye: f.dejaPaye ?? 0
    }
  } else {
    form.value = { ...factureInterface, items: [] }
  }
  ready.value = true
})

const totalHT = computed(() => {
  if (!form.value.items.length) return 0
  return form.value.items.reduce((acc, ligne) => {
    const q = Number(ligne.quantite) || 0
    const pu = Number(ligne.montantUnitaire) || 0
    return acc + q * pu
  }, 0)
})

const totalNet = computed(() => {
  const ht = totalHT.value
  const remise = Number(form.value.remise) || 0
  return ht - remise
})

const remaining = computed(() => {
  const net = totalNet.value
  const payé = Number(form.value.dejaPaye) || 0
  return net - payé
})

const formInvalid = computed(() => {
  if (!form.value) return true
  if (!form.value.numero || form.value.numero.length < 3) return true
  if (!form.value.description || form.value.description.length < 3) return true
  if (!form.value.date) return true
  if (!form.value.clientId) return true
  for (const ligne of form.value.items) {
    if (
      !ligne.prestation ||
      ligne.prestation.length < 1 ||
      !ligne.quantite ||
      ligne.quantite <= 0 ||
      !ligne.montantUnitaire ||
      ligne.montantUnitaire < 0
    ) {
      return true
    }
  }
  return false
})

function addItem() {
  form.value.items.push({
    prestation: '',
    quantite: 1,
    montantUnitaire: 0
  })
}

function removeItem(index) {
  form.value.items.splice(index, 1)
}

function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value ?? 0)
}

function goBack() {
  router.push({ name: 'factures-list' })
}

async function onDelete() {
  if (!isEditMode.value) return
  if (!confirm(`Supprimer la facture #${form.value.id} ?`)) return
  try {
    await deleteFacture(form.value.id)
    router.push({ name: 'factures-list' })
  } catch (err) {
    alert('Impossible de supprimer la facture.')
  }
}

async function onSave() {
  const payload = {
    numero: form.value.numero,
    description: form.value.description,
    date: form.value.date,
    clientId: form.value.clientId,
    items: form.value.items,
    remise: form.value.remise,
    dejaPaye: form.value.dejaPaye
  }
  try {
    if (isEditMode.value) {
      await updateFacture(form.value.id, payload)
    } else {
      await createFacture(payload)
    }
    router.push({ name: 'factures-list' })
  } catch (err) {
    alert('Erreur lors de l’enregistrement : ' + (err.response?.data?.message || err.message))
  }
}
</script>

<style scoped>
.container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

h5 {
  font-weight: 600;
  color: #555;
}

.separator {
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 30px 0;
}

.invoice-form {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.invoice-form .row.g-3 > .col-md-4 label,
.invoice-form .row.g-3 > .col-md-5 label,
.invoice-form .row.g-3 > .col-md-3 label,
.invoice-form .row.g-3 > .col-md-6 label {
  font-weight: 500;
  color: #444;
}

.item-row {
  background-color: #f1f1f1;
  padding: 15px;
  border-radius: 4px;
}

.item-row .form-label {
  font-size: 0.9rem;
}

.total-cell {
  font-weight: 500;
  color: #000;
}

.summary-row {
  padding-top: 15px;
}

.summary-row .form-label {
  font-size: 0.9rem;
}

.save-btn {
  min-width: 140px;
}

.me-2 {
  margin-right: 0.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
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
