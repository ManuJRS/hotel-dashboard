<script setup lang="ts">
import { computed } from 'vue'
import { useHotelStore } from '../stores/hotelStore'
import ReservationStatusChart from '../components/charts/ReservationStatusChart.vue'
import RoomsByStatusChart from '../components/charts/RoomsByStatusChart.vue'

const store = useHotelStore()

// 🔹 KPIs básicos
const totalRooms = computed(() => store.rooms.length)

const availableRooms = computed(() =>
  store.rooms.filter(r => r.status === 'available').length
)

const occupiedRooms = computed(() =>
  store.rooms.filter(r => r.status === 'occupied').length
)

const occupancyPercent = computed(() => {
  if (!totalRooms.value) return 0
  return Math.round(
    (occupiedRooms.value / totalRooms.value) * 100
  )
})

// 🔹 KPI reservas activas
const activeReservations = computed(() =>
  store.reservations.filter(r =>
    r.status === 'confirmed' || r.status === 'in_progress'
  ).length
)

// 🔹 Ingreso “estimado” del mes (ejemplo sencillo)
const estimatedRevenue = computed(() =>
  store.reservations.reduce((sum, r) => sum + r.total, 0)
)
</script>

<template>
  <div>
    <!-- Título -->
    <div class="mb-6">
      <h1 class="text-h4">Dashboard general</h1>
      <p class="text-body-2 text-medium-emphasis">
        Resumen de ocupación, habitaciones y reservas del hotel.
      </p>
    </div>

    <!-- KPIs -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-1">
              Ocupación hoy
            </div>
            <div class="text-h4">
              {{ occupancyPercent }}%
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ occupiedRooms }} de {{ totalRooms }} habitaciones ocupadas
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-1">
              Habitaciones libres
            </div>
            <div class="text-h4">
              {{ availableRooms }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Total habitaciones: {{ totalRooms }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-1">
              Reservas activas
            </div>
            <div class="text-h4">
              {{ activeReservations }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Confirmadas o en curso
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-caption text-medium-emphasis mb-1">
              Ingreso estimado
            </div>
            <div class="text-h5">
              $ {{ estimatedRevenue.toLocaleString() }}
            </div>
            <div class="text-caption text-medium-emphasis">
              Suma de todas las reservas
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficas / secciones inferiores -->
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card class="h-100">
          <v-card-title>
            Estado de las reservas
          </v-card-title>
          <v-card-text>
            <ReservationStatusChart />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="h-100">
          <v-card-title>
            Resumen rápido
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>
                  Habitaciones totales
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ totalRooms }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>
                  Habitaciones ocupadas
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ occupiedRooms }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>
                  Habitaciones disponibles
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ availableRooms }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>
                  Reservas totales
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ store.reservations.length }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-6">
  <v-col cols="12" md="6">
    <v-card class="h-100">
      <v-card-title>
        Habitaciones por estado
      </v-card-title>
      <v-card-text>
        <RoomsByStatusChart />
      </v-card-text>
    </v-card>
  </v-col>
</v-row>
  </div>
</template>