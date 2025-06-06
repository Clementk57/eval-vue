<template>
  <div class="container pt-4 list-container">
    <!-- En-tête de la page -->
    <div class="row mb-3 header-row align-items-center">
      <div class="col-md-8">
        <h1><i class="bi bi-receipt-cutoff me-2"></i>Liste des factures</h1>
      </div>
      <div class="col-md-4 text-end">
        <BButton
          variant="success"
          iconLeft="plus-circle"
          @click="$router.push({ name: 'facture-create' })"
          class="add-btn shadow-sm"
        >
          Ajouter une facture
        </BButton>
      </div>
    </div>

    <!-- Tableau des factures -->
    <div class="row">
      <div class="col-12">
        <table class="table table-striped invoice-table">
          <thead class="table-light">
            <tr>
              <th class="text-center">#</th>
              <th><i class="bi bi-hash me-1"></i>Numéro</th>
              <th><i class="bi bi-calendar-date me-1"></i>Date</th>
              <th><i class="bi bi-person me-1"></i>Client</th>
              <th class="text-center"><i class="bi bi-currency-euro me-1"></i>Total HT</th>
              <th class="text-center"><i class="bi bi-currency-euro me-1"></i>Total TTC</th>
              <th class="text-center"><i class="bi bi-gear me-1"></i>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in factures" :key="f.id">
              <td class="text-center">{{ f.id }}</td>
              <td>{{ f.numero }}</td>
              <td>{{ f.date }}</td>
              <td>
                <span v-if="clientsMap[f.clientId]">
                  {{ clientsMap[f.clientId].prenom }} {{ clientsMap[f.clientId].nom }}
                </span>
                <span v-else class="text-muted">N/A</span>
              </td>
              <!-- Cellules de prix stylées avec fond vert pâle et icône -->
              <td class="text-center">
                <span class="price-cell">
                  <i class="bi bi-cash-stack me-1"></i>
                  {{ formatMontant(calcTotalHT(f)) }} €
                </span>
              </td>
              <td class="text-center">
                <span class="price-cell">
                  <i class="bi bi-cash-coin me-1"></i>
                  {{ formatMontant(calcTotalHT(f) * 1.2) }} €
                </span>
              </td>
              <td class="text-center">
                <div class="d-flex gap-2 justify-content-center">
                  <BButton
                    size="sm"
                    variant="primary"
                    iconLeft="pencil-square"
                    @click="$router.push({ name: 'facture-edit', params: { id: f.id } })"
                    class="action-btn btn-primary shadow-sm"
                  >
                    Éditer
                  </BButton>
                  <BButton
                    size="sm"
                    variant="danger"
                    iconLeft="trash"
                    @click="onDelete(f.id)"
                    class="action-btn btn-danger shadow-sm"
                  >
                    Supprimer
                  </BButton>
                </div>
              </td>
            </tr>
            <tr v-if="factures.length === 0">
              <td colspan="7" class="text-center text-muted">Aucune facture disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFactureStore } from '@/stores/facture.store.js'
import { useClientStore } from '@/stores/client.store.js'

const factureStore = useFactureStore()
const { factures } = storeToRefs(factureStore)
const { getFactures, deleteFacture } = factureStore

const clientStore = useClientStore()
const { clients } = storeToRefs(clientStore)
const { getClients } = clientStore

const clientsMap = ref({})

onBeforeMount(async () => {
  try {
    await getFactures()
    await getClients()
    clientsMap.value = clients.value.reduce((map, c) => {
      map[c.id] = c
      return map
    }, {})
  } catch (err) {
    console.error('Erreur lors du chargement des données :', err)
  }
})

function onDelete(id) {
  if (!confirm(`Voulez-vous vraiment supprimer la facture #${id} ?`)) return
  deleteFacture(id).catch((err) => console.error(err))
}

function calcTotalHT(f) {
  if (!f.items || f.items.length === 0) return 0
  const sumLignes = f.items.reduce((acc, ligne) => {
    const q = Number(ligne.quantite) || 0
    const mu = Number(ligne.montantUnitaire) || 0
    return acc + q * mu
  }, 0)
  return sumLignes - (Number(f.remise) || 0)
}

function formatMontant(val) {
  return val.toFixed(2).replace('.', ',')
}
</script>

<style scoped>

:root {
  --font-family-base: "Helvetica Neue", Arial, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;
  --color-text: #333333;
  --color-muted: #6c757d;
  --color-bg: #f8f9fa;
  --color-white: #ffffff;
  --color-primary: #007bff;
  --color-primary-hover: #0056b3;
  --color-secondary: #6c757d;
  --color-secondary-hover: #5a6268;
  --color-success: #28a745;
  --color-success-bg: #e6f4ea; 
  --color-success-text: #155724; 
  --color-danger: #dc3545;
  --color-border: #ced4da;
  --border-radius: 6px;
  --transition-fast: 0.15s ease-in-out;
}

html {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  background-color: var(--color-bg);
  color: var(--color-text);
}

body {
  min-height: 100vh;
  margin: 0;
}


.container {
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.list-container {
  background-color: var(--color-white);
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Header Row */
.header-row {
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.header-row h1 {
  color: #343a40;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}
.header-row h1 i {
  font-size: 1.8rem;
  color: var(--color-primary);
}

/* Bouton d'ajout */
.add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-white);
  background-color: var(--color-success);
  border: 1px solid var(--color-success);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
  cursor: pointer;
  min-width: 180px;
}
.add-btn i {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}
.add-btn:hover,
.add-btn:focus {
  background-color: #218838;
  border-color: #1e7e34;
  transform: translateY(-1px);
}


.invoice-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--color-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.invoice-table thead th {
  background-color: #e9ecef;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  border-bottom: 2px solid var(--color-border);
  padding: 14px 16px;
  position: sticky;
  top: 0;
  z-index: 10;
}
.invoice-table thead th i {
  font-size: 1rem;
  vertical-align: middle;
}

.invoice-table th,
.invoice-table td {
  padding: 12px 15px;
  vertical-align: middle;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.94rem;
}

.invoice-table tbody tr:nth-of-type(odd) {
  background-color: #fdfdfd;
}
.invoice-table tbody tr:nth-of-type(even) {
  background-color: #fafafa;
}
.invoice-table tbody tr:hover {
  background-color: #f1f3f5;
}

.invoice-table .text-center {
  text-align: center;
}

/* Style pour les cellules de prix */
.price-cell {
  background-color: var(--color-success-bg);
  color: var(--color-success-text);
  border-radius: var(--border-radius);
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}
.price-cell i {
  font-size: 1rem;
  margin-right: 4px;
}
.price-cell:hover {
  background-color: #d0eccd;
  transform: translateY(-1px);
}

/* ============================= */
/* Boutons d'action (Éditer / Supprimer) */
/* ============================= */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--color-white);
  text-align: center;
  user-select: none;
  padding: 0.3rem 0.6rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
  cursor: pointer;
  min-width: 75px;
}
.action-btn i {
  margin-right: 4px;
}

/* Bouton Éditer */
.btn-primary {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.btn-primary:hover,
.btn-primary:focus {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

/* Bouton Supprimer */
.btn-danger {
  background-color: var(--color-danger);
  border: 1px solid var(--color-danger);
}
.btn-danger:hover,
.btn-danger:focus {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
}

/* Message quand aucune facture */
.text-muted {
  font-style: italic;
  color: var(--color-muted);
  padding: 15px 0;
}


@media (max-width: 768px) {
  h1 {
    font-size: 1.9rem;
  }

  .container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .invoice-table th,
  .invoice-table td {
    padding: 10px 8px;
    font-size: 0.85rem;
  }

  .add-btn {
    font-size: 0.95rem;
    min-width: 150px;
  }
}
</style>
