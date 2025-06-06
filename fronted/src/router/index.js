import { createRouter, createWebHistory } from 'vue-router'

import FacturesListView from '@/views/FacturesListView.vue'
import FactureEditView  from '@/views/FactureEditView.vue'

import ClientsListView from '@/views/ClientsListView.vue'
import ClientEditView  from '@/views/ClientEditView.vue'

const routes = [
  // Factures
  {
    path: '/factures',
    name: 'factures-list',
    component: FacturesListView
  },
  {
    path: '/factures/edit/:id',
    name: 'facture-edit',
    props: true,
    component: FactureEditView
  },
  {
    path: '/factures/create',
    name: 'facture-create',
    component: FactureEditView
  },

  // Clients
  {
    path: '/clients',
    name: 'clients-list',
    component: ClientsListView
  },
  {
    path: '/clients/edit/:id',
    name: 'client-edit',
    props: true,
    component: ClientEditView
  },
  {
    path: '/clients/create',
    name: 'client-create',
    component: ClientEditView
  },

  {
    path: '/',
    redirect: { name: 'factures-list' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
