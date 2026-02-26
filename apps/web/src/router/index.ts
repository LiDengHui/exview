import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormView from '../views/FormView.vue'
import TableView from '../views/TableView.vue'

export const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
  { path: '/table', component: TableView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
