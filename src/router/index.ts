import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


import DashboardView from '../pages/DashboardView.vue'
import RoomsView from '../pages/RoomsView.vue'
import ReservationsView from '../pages/ReservationsView.vue'
import GuestsView from '../pages/GuestsView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/rooms', name: 'rooms', component: RoomsView },
  { path: '/reservations', name: 'reservations', component: ReservationsView },
  { path: '/guests', name: 'guests', component: GuestsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
