<script setup lang="ts">
import { computed } from 'vue'
import { useHotelStore } from '../stores/hotelStore'
import type { Guest } from '../types/hotel'

const store = useHotelStore()

interface GuestItem extends Guest {
  reservationsCount: number
}

// Headers de la tabla
interface Header {
  title: string
  key: keyof GuestItem
}

const headers: Header[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'Reservas', key: 'reservationsCount' }
]

// Mapeamos huéspedes + contamos cuántas reservas tiene cada uno
const guests = computed<GuestItem[]>(() =>
  store.guests.map(guest => {
    const count = store.reservations.filter(
      r => r.guestId === guest.id
    ).length

    return {
      ...guest,
      reservationsCount: count
    }
  })
)
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Huéspedes</h1>
    <p class="text-body-2 text-medium-emphasis mb-4">
      Lista de huéspedes y número de reservas asociadas.
    </p>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="guests"
          item-key="id"
          class="elevation-1"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
