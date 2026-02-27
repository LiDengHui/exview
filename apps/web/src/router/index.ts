import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/form', component: () => import('../views/FormView.vue') },
  { path: '/table', component: () => import('../views/TableView.vue') },
  { path: '/menu', component: () => import('../views/MenuView.vue') },
  { path: '/toolbar', component: () => import('../views/ToolbarView.vue') },
  { path: '/schema-playground', component: () => import('../views/SchemaPlaygroundView.vue') },
  { path: '/schema-examples', component: () => import('../views/SchemaExamplesView.vue') },
  { path: '/schema-dynamic', component: () => import('../views/SchemaDynamicView.vue') },
  { path: '/schema-advanced', component: () => import('../views/SchemaAdvancedView.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
