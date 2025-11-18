<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useHotelStore } from '../src/stores/hotelStore'
import AppFooter from './components/charts/AppFooter.vue'

const drawer = ref(true)
const hotelStore = useHotelStore()

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
  drawer.value = !mobile.value
})

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
          <div class="text-h6">¡Bienvenido!</div>
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

      <v-main>
        <v-app-bar
          flat
          color="surface"
        >
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

        <v-container
          fluid
          class="pa-6"
        >
          <router-view />

        </v-container>
        
      </v-main>
      <AppFooter />
    </v-layout>
              

  </v-app>
  
</template>
