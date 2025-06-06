<template>
  <div class="container pt-4 clients-list-container">
    <!-- En-tête de la page -->
    <div class="row mb-3 header-row align-items-center">
      <div class="col-md-8">
        <h1>
          <i class="bi bi-people-fill me-2"></i>Liste des clients
        </h1>
      </div>
      <div class="col-md-4 text-end">
        <BButton
          variant="success"
          iconLeft="plus-circle"
          @click="$router.push({ name: 'client-create' })"
          class="add-btn shadow-sm"
        >
          Ajouter un client
        </BButton>
      </div>
    </div>

    <!-- Tableau des clients -->
    <div class="row">
      <div class="col-12">
        <table class="table table-striped clients-table">
          <thead class="table-light">
            <tr>
              <th class="text-center">
                <i class="bi bi-hash"></i>
              </th>
              <th>
                <i class="bi bi-person-fill me-1"></i>Prénom
              </th>
              <th>
                <i class="bi bi-person-badge-fill me-1"></i>Nom
              </th>
              <th>
                <i class="bi bi-building me-1"></i>Entreprise
              </th>
              <th class="text-center">
                <i class="bi bi-telephone-fill me-1"></i>Téléphone
              </th>
              <th class="text-center">
                <i class="bi bi-envelope-fill me-1"></i>Email
              </th>
              <th class="text-center">
                <i class="bi bi-gear me-1"></i>Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clients" :key="c.id">
              <td class="text-center">{{ c.id }}</td>
              <td>{{ c.prenom }}</td>
              <td>{{ c.nom }}</td>
              <td>{{ c.entreprise }}</td>
              <td class="text-center">{{ c.telephone }}</td>
              <td class="text-center">{{ c.email }}</td>
              <td class="text-center">
                <div class="d-flex gap-2 justify-content-center">
                  <BButton
                    size="sm"
                    variant="primary"
                    iconLeft="pencil-square"
                    @click="$router.push({ name: 'client-edit', params: { id: c.id } })"
                    class="action-btn btn-primary shadow-sm"
                  >
                    Éditer
                  </BButton>
                  <BButton
                    size="sm"
                    variant="danger"
                    iconLeft="trash"
                    @click="onDelete(c.id)"
                    class="action-btn btn-danger shadow-sm"
                  >
                    Supprimer
                  </BButton>
                </div>
              </td>
            </tr>
            <tr v-if="clients.length === 0">
              <td colspan="7" class="text-center text-muted">
                Aucun client disponible.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useClientStore } from '@/stores/client.store.js'
import { storeToRefs } from 'pinia'

const clientStore = useClientStore()
const { clients } = storeToRefs(clientStore)
const { getClients, deleteClient } = clientStore

onBeforeMount(async () => {
  try {
    await getClients()
  } catch (err) {
    console.error('Erreur lors du chargement des clients :', err)
  }
})

function onDelete(id) {
  if (!confirm(`Voulez-vous vraiment supprimer le client #${id} ?`)) return
  deleteClient(id).catch(err => console.error(err))
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
  margin: 0;
  min-height: 100vh;
}


.container {
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.clients-list-container {
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
  margin-right: 0;
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


.clients-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--color-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.clients-table thead th {
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
.clients-table thead th i {
  font-size: 1rem;
  vertical-align: middle;
}

.clients-table th,
.clients-table td {
  padding: 12px 15px;
  vertical-align: middle;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 0.94rem;
}

.clients-table tbody tr:nth-of-type(odd) {
  background-color: #fdfdfd;
}
.clients-table tbody tr:nth-of-type(even) {
  background-color: #fafafa;
}
.clients-table tbody tr:hover {
  background-color: #f1f3f5;
}

.clients-table .text-center {
  text-align: center;
}


.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: var(--color-white);
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

  .clients-table th,
  .clients-table td {
    padding: 10px 8px;
    font-size: 0.85rem;
  }

  .add-btn {
    font-size: 0.95rem;
    min-width: 150px;
  }
}
</style>
