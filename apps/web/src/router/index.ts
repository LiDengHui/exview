import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormView from '../views/FormView.vue'
import TableView from '../views/TableView.vue'
import MenuView from '../views/MenuView.vue'
import ToolbarView from '../views/ToolbarView.vue'

export const routes = [
  { path: '/', component: HomeView },
  { path: '/form', component: FormView },
  { path: '/table', component: TableView },
  { path: '/menu', component: MenuView },
  { path: '/toolbar', component: ToolbarView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
