<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useHotelStore } from '../src/stores/hotelStore'

const drawer = ref(true)
const hotelStore = useHotelStore()

// Detectar si estamos en mobile (según Vuetify)
const { mobile } = useDisplay()

interface NavItem {
  title: string
  icon: string
  to: string
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Habitaciones', icon: 'mdi-bed', to: '/rooms' },
  { title: 'Reservas', icon: 'mdi-calendar-check', to: '/reservations' },
  { title: 'Huéspedes', icon: 'mdi-account-group', to: '/guests' }
]

onMounted(() => {
  hotelStore.loadInitialData()
  // En desktop → abierto, en mobile → cerrado
  drawer.value = !mobile.value
})

// Si cambias de tamaño (por ejemplo rotas el cel), ajustar estado
watch(
  mobile,
  (isMobile) => {
    drawer.value = !isMobile
  }
)
</script>

<template>
  <v-app>
    <v-layout>
      <!-- NAV LATERAL -->
      <v-navigation-drawer
        v-model="drawer"
        app
        :permanent="!mobile"
        :temporary="mobile"
      >
        <v-sheet
          class="pa-4"
          color="primary"
        >
          <div class="text-h6">Hotel Admin</div>
          <div class="text-caption">
            Panel de control
          </div>
        </v-sheet>

        <v-divider />

<v-list density="comfortable" nav>
  <v-list-item
    v-for="item in navItems"
    :key="item.to"
    :to="item.to"
    :prepend-icon="item.icon"
    link
  >
    <v-list-item-title>
      {{ item.title }}
    </v-list-item-title>
  </v-list-item>
</v-list>
      </v-navigation-drawer>

      <!-- CONTENIDO PRINCIPAL -->
      <v-main>
        <!-- TOPBAR -->
        <v-app-bar
          flat
          color="surface"
        >
          <!-- En mobile este botón abre/cierra el menú -->
          <v-app-bar-nav-icon @click="drawer = !drawer" />

          <v-app-bar-title>Hotel Dashboard</v-app-bar-title>

          <v-spacer />

          <v-btn icon>
            <v-icon icon="mdi-bell-outline" />
          </v-btn>

          <v-btn
            icon
            class="ml-2"
          >
            <v-icon icon="mdi-account-circle" />
          </v-btn>
        </v-app-bar>

        <!-- CONTENIDO DE CADA PÁGINA -->
        <v-container
          fluid
          class="pa-6"
        >
          <router-view />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>
