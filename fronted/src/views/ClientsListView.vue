<template>
  <div class="container pt-4 clients-list-container">
    <div class="row mb-3 header-row">
      <div class="col-md-8">
        <h1>Liste des clients</h1>
      </div>
      <div class="col-md-4 text-end">
        <BButton
          variant="success"
          iconLeft="plus-circle"
          @click="$router.push({ name: 'client-create' })"
          class="add-btn"
        >
          Ajouter un client
        </BButton>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <table class="table table-striped clients-table">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Entreprise</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clients" :key="c.id">
              <td>{{ c.id }}</td>
              <td>{{ c.prenom }}</td>
              <td>{{ c.nom }}</td>
              <td>{{ c.entreprise }}</td>
              <td>{{ c.telephone }}</td>
              <td>{{ c.email }}</td>
              <td>
                <div class="d-flex gap-2">
                  <BButton
                    size="sm"
                    variant="primary"
                    iconLeft="pencil-square"
                    @click="$router.push({ name: 'client-edit', params: { id: c.id } })"
                    class="action-btn btn-primary"
                  >
                    Éditer
                  </BButton>
                  <BButton
                    size="sm"
                    variant="danger"
                    iconLeft="trash"
                    @click="onDelete(c.id)"
                    class="action-btn btn-danger"
                  >
                    Supprimer
                  </BButton>
                </div>
              </td>
            </tr>
            <tr v-if="clients.length === 0">
              <td colspan="7" class="text-center">Aucun client disponible.</td>
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
  await getClients()
})

function onDelete(id) {
  if (!confirm(`Supprimer le client #${id} ?`)) return
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
  --color-danger: #dc3545;
  --color-border: #ced4da;
  --border-radius: 4px;
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
}

.container {
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.clients-list-container {
  background-color: var(--color-bg);
  border-radius: 8px;
  padding: 20px;
}

.header-row h1 {
  color: #343a40;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0;
}

.add-btn {
  display: inline-block;
  font-weight: 500;
  color: var(--color-white);
  background-color: var(--color-success);
  border: 1px solid var(--color-success);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  cursor: pointer;
  min-width: 160px;
}

.add-btn:hover,
.add-btn:focus {
  background-color: #218838;
  border-color: #1e7e34;
  color: #fff;
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

.clients-table th,
.clients-table td {
  padding: 12px 15px;
  vertical-align: middle;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.clients-table thead th {
  background-color: #e9ecef;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.clients-table tbody tr:nth-of-type(odd) {
  background-color: #fafafa;
}

.clients-table tbody tr:hover {
  background-color: #f1f3f5;
}

.action-btn {
  display: inline-block;
  font-weight: 500;
  color: var(--color-white);
  text-align: center;
  vertical-align: middle;
  user-select: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
  cursor: pointer;
  min-width: 75px;
}

.btn-primary {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn-danger {
  background-color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.btn-danger:hover,
.btn-danger:focus {
  background-color: #c82333;
  border-color: #bd2130;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background-color: #f1f1f1;
}

.text-center {
  padding: 15px 0;
  color: var(--color-muted);
  font-style: italic;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.75rem;
  }

  .container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
