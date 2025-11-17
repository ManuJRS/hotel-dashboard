<script setup lang="ts">
import { ref } from 'vue'
import { computed } from 'vue'
import { useHotelStore } from '../stores/hotelStore'
import type { Room } from '../types/hotel'

const store = useHotelStore()

// Tipo para item en la tabla
interface RoomItem extends Room {}

interface Header {
  title: string
  key: keyof RoomItem | 'actions'
}

const headers: Header[] = [
  { title: 'Número', key: 'number' },
  { title: 'Tipo', key: 'type' },
  { title: 'Capacidad', key: 'capacity' },
  { title: 'Piso', key: 'floor' },
  { title: 'Estado', key: 'status' },
  { title: 'Precio', key: 'price' },
  { title: 'Descripción', key: 'description' },
  { title: 'Acciones', key: 'actions' }
]

const rooms = computed<RoomItem[]>(() => store.rooms)

// Estado → color
function getStatusColor(status: Room['status']) {
  if (status === 'available') return 'green'
  if (status === 'occupied') return 'red'
  return 'orange' // maintenance
}

/* ============== MODAL DETALLE HABITACIÓN ============== */

const roomDialog = ref(false)
const selectedRoomId = ref<number | null>(null)

const selectedRoom = computed(() => {
  if (selectedRoomId.value == null) return null
  return store.rooms.find(r => r.id === selectedRoomId.value) ?? null
})

function openRoomDetails(id: number) {
  selectedRoomId.value = id
  roomDialog.value = true
}

function closeRoomDetails() {
  roomDialog.value = false
}
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Habitaciones</h1>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="rooms"
          item-key="id"
          class="elevation-1"
        >
          <!-- Estado con chip -->
          <template #item.status="{ value }">
            <v-chip
              :color="getStatusColor(value)"
              label
              size="small"
            >
              {{ value }}
            </v-chip>
          </template>

          <!-- Precio con formato -->
          <template #item.price="{ value }">
            $ {{ value.toLocaleString() }}
          </template>

          <!-- Piso -->
          <template #item.floor="{ value }">
            {{ value ?? 'N/D' }}
          </template>

          <!-- Descripción recortada -->
          <template #item.description="{ value }">
            <span v-if="value">
              {{ value.length > 40 ? value.slice(0, 40) + '…' : value }}
            </span>
            <span v-else>—</span>
          </template>

          <!-- Acciones -->
          <template #item.actions="{ item }">
            <v-btn
              size="small"
              variant="text"
              @click="openRoomDetails(item.id)"
            >
              Ver detalle
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- MODAL DETALLE HABITACIÓN -->
    <v-dialog
      v-model="roomDialog"
      max-width="520"
    >
      <v-card v-if="selectedRoom">
        <v-card-title class="text-h6">
          Habitación {{ selectedRoom.number }} – {{ selectedRoom.type }}
        </v-card-title>

        <v-card-text>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Información general
              </v-list-item-title>
              <v-list-item-subtitle>
                Piso: {{ selectedRoom.floor ?? 'N/D' }} •
                Capacidad: {{ selectedRoom.capacity }} personas
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Estado
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  :color="getStatusColor(selectedRoom.status)"
                  size="small"
                  label
                >
                  {{ selectedRoom.status }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Precio por noche
              </v-list-item-title>
              <v-list-item-subtitle>
                $ {{ selectedRoom.price.toLocaleString() }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-2" />

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Amenities
              </v-list-item-title>
              <v-list-item-subtitle>
                <div v-if="selectedRoom.amenities?.length" class="d-flex flex-wrap ga-1 mt-1">
                  <v-chip
                    v-for="amenity in selectedRoom.amenities"
                    :key="amenity"
                    size="small"
                    variant="outlined"
                  >
                    {{ amenity }}
                  </v-chip>
                </div>
                <span v-else>Sin amenities registrados.</span>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Descripción
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedRoom.description || 'Sin descripción.' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeRoomDetails">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>