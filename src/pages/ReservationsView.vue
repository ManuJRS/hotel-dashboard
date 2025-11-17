<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHotelStore } from '../stores/hotelStore'
import type { ReservationStatus } from '../types/hotel'

const store = useHotelStore()

// Tipo para las filas "resueltas" (join con rooms y guests)
interface ReservationItem {
  id: number
  guestName: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: ReservationStatus
  total: number
}

interface Header {
  title: string
  key: keyof ReservationItem | 'actions'
}

const headers: Header[] = [
  { title: 'Huésped', key: 'guestName' },
  { title: 'Habitación', key: 'roomNumber' },
  { title: 'Check-in', key: 'checkIn' },
  { title: 'Check-out', key: 'checkOut' },
  { title: 'Estado', key: 'status' },
  { title: 'Total', key: 'total' },
  { title: 'Acciones', key: 'actions' }
]

// Mapeamos reservations → ReservationItem
const reservations = computed<ReservationItem[]>(() =>
  store.reservations.map(res => {
    const room = store.rooms.find(r => r.id === res.roomId)
    const guest = store.guests.find(g => g.id === res.guestId)

    return {
      id: res.id,
      guestName: guest?.name ?? 'Desconocido',
      roomNumber: room?.number ?? 'N/A',
      checkIn: res.checkIn,
      checkOut: res.checkOut,
      status: res.status,
      total: res.total
    }
  })
)

function getStatusColor(status: ReservationStatus) {
  switch (status) {
    case 'confirmed':
      return 'blue'
    case 'in_progress':
      return 'green'
    case 'completed':
      return 'teal'
    case 'cancelled':
      return 'red'
    default:
      return 'grey'
  }
}

/* =============== Modal de DETALLE =============== */

const detailsDialog = ref(false)
const selectedReservationId = ref<number | null>(null)

const selectedReservation = computed(() => {
  if (selectedReservationId.value == null) return null

  const res = store.reservations.find(r => r.id === selectedReservationId.value)
  if (!res) return null

  const room = store.rooms.find(r => r.id === res.roomId)
  const guest = store.guests.find(g => g.id === res.guestId)

  return {
    id: res.id,
    checkIn: res.checkIn,
    checkOut: res.checkOut,
    status: res.status,
    total: res.total,
    notes: res.notes ?? '',
    roomNumber: room?.number ?? 'N/A',
    roomType: room?.type ?? 'N/A',
    roomCapacity: room?.capacity ?? null,
    guestName: guest?.name ?? 'Desconocido',
    guestEmail: guest?.email ?? '',
    guestPhone: guest?.phone ?? ''
  }
})

function openDetails(id: number) {
  selectedReservationId.value = id
  detailsDialog.value = true
}

function closeDetails() {
  detailsDialog.value = false
}

/* =============== Modal NUEVA / EDITAR RESERVA =============== */

interface NewReservationForm {
  guestId: number | null        // huésped existente (opcional)
  newGuestName: string          // datos de huésped nuevo (opcionales)
  newGuestEmail: string
  newGuestPhone: string
  roomId: number | null
  checkIn: string
  checkOut: string
  status: ReservationStatus
  total: number | null
}

const newReservationDialog = ref(false)
const isEditing = ref(false)
const editingReservationId = ref<number | null>(null)

const form = ref<NewReservationForm>({
  guestId: null,
  newGuestName: '',
  newGuestEmail: '',
  newGuestPhone: '',
  roomId: null,
  checkIn: '',
  checkOut: '',
  status: 'confirmed',
  total: null
})

const formError = ref('')

// Opciones para selects
const guestOptions = computed(() =>
  store.guests.map(g => ({
    title: g.name,
    value: g.id
  }))
)

const roomOptions = computed(() =>
  store.rooms.map(r => ({
    title: `${r.number} – ${r.type}`,
    value: r.id
  }))
)

function resetForm() {
  form.value = {
    guestId: null,
    newGuestName: '',
    newGuestEmail: '',
    newGuestPhone: '',
    roomId: null,
    checkIn: '',
    checkOut: '',
    status: 'confirmed',
    total: null
  }
  formError.value = ''
  editingReservationId.value = null
}

function openNewReservation() {
  resetForm()
  isEditing.value = false
  newReservationDialog.value = true
}

function openEditReservation(id: number) {
  const res = store.reservations.find(r => r.id === id)
  if (!res) return

  resetForm()
  isEditing.value = true
  editingReservationId.value = id

  // Prefill con datos de la reserva
  form.value.guestId = res.guestId
  form.value.roomId = res.roomId
  form.value.checkIn = res.checkIn
  form.value.checkOut = res.checkOut
  form.value.status = res.status
  form.value.total = res.total

  newReservationDialog.value = true
}

function submitReservation() {
  const f = form.value

  // Validar datos base
  if (!f.roomId || !f.checkIn || !f.checkOut || f.total == null) {
    formError.value = 'Completa habitación, fechas y total antes de guardar.'
    return
  }

  // Debe haber o un huésped existente o un huésped nuevo
  if (!f.guestId && !f.newGuestName) {
    formError.value = 'Selecciona un huésped existente o ingresa uno nuevo.'
    return
  }

  let guestIdToUse: number

  if (f.guestId) {
    // Usar huésped existente
    guestIdToUse = f.guestId
  } else {
    // Crear huésped nuevo en el store
    guestIdToUse = store.addGuest({
      name: f.newGuestName,
      email: f.newGuestEmail,
      phone: f.newGuestPhone,
      document: '',
      country: ''
    })
  }

  if (!isEditing.value) {
    // Crear reserva nueva (POST simulado)
    store.addReservation({
      guestId: guestIdToUse,
      roomId: f.roomId,
      checkIn: f.checkIn,
      checkOut: f.checkOut,
      status: f.status,
      total: f.total
    })
  } else {
    // Editar reserva existente (PUT/PATCH simulado)
    if (editingReservationId.value == null) {
      formError.value = 'Error interno: no hay reserva seleccionada.'
      return
    }

    store.updateReservation(editingReservationId.value, {
      guestId: guestIdToUse,
      roomId: f.roomId,
      checkIn: f.checkIn,
      checkOut: f.checkOut,
      status: f.status,
      total: f.total
    })
  }

  newReservationDialog.value = false
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h4">Reservas</h1>
        <p class="text-body-2 text-medium-emphasis">
          Listado de reservas con estado, huésped y habitación.
        </p>
      </div>

      <v-btn
        color="primary"
        @click="openNewReservation"
      >
        Nueva reserva
      </v-btn>
    </div>

    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="reservations"
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

          <!-- Total con formato -->
          <template #item.total="{ value }">
            $ {{ value.toLocaleString() }}
          </template>

          <!-- Columna de acciones -->
          <template #item.actions="{ item }">
            <v-btn
              size="small"
              variant="text"
              @click="openDetails(item.id)"
            >
              Ver detalle
            </v-btn>
            <v-btn
              size="small"
              variant="text"
              @click="openEditReservation(item.id)"
            >
              Editar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- MODAL DETALLE -->
    <v-dialog
      v-model="detailsDialog"
      max-width="500"
    >
      <v-card v-if="selectedReservation">
        <v-card-title class="text-h6">
          Detalle de reserva #{{ selectedReservation.id }}
        </v-card-title>

        <v-card-text>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Huésped
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedReservation.guestName }}
                <span v-if="selectedReservation.guestEmail">
                  • {{ selectedReservation.guestEmail }}
                </span>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Teléfono
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedReservation.guestPhone || 'N/D' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-2" />

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Habitación
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedReservation.roomNumber }} – {{ selectedReservation.roomType }}
                <span v-if="selectedReservation.roomCapacity">
                  (Capacidad: {{ selectedReservation.roomCapacity }})
                </span>
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-2" />

            <!-- Check-in -->
            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Check-in
              </v-list-item-title>
              <v-list-item-subtitle class="text-body-2" style="white-space: normal;">
                {{ selectedReservation.checkIn }}
              </v-list-item-subtitle>
            </v-list-item>

            <!-- Check-out -->
            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Check-out
              </v-list-item-title>
              <v-list-item-subtitle class="text-body-2" style="white-space: normal;">
                {{ selectedReservation.checkOut }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Estado
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip
                  :color="getStatusColor(selectedReservation.status)"
                  size="small"
                  label
                >
                  {{ selectedReservation.status }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Total
              </v-list-item-title>
              <v-list-item-subtitle>
                $ {{ selectedReservation.total.toLocaleString() }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="text-subtitle-2">
                Notas
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedReservation.notes || 'Sin notas adicionales' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeDetails"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- MODAL NUEVA / EDITAR RESERVA -->
    <v-dialog
      v-model="newReservationDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ isEditing ? 'Editar reserva' : 'Nueva reserva' }}
        </v-card-title>

        <v-card-text>
          <v-form>
            <div class="text-caption text-medium-emphasis mb-1">
              Selecciona un huésped existente <strong>o</strong> crea uno nuevo.
            </div>

            <v-select
              v-model="form.guestId"
              :items="guestOptions"
              label="Huésped existente (opcional)"
              item-title="title"
              item-value="value"
              density="comfortable"
              class="mb-3"
              clearable
            />

            <v-divider class="my-4" />

            <div class="text-caption text-medium-emphasis mb-2">
              O bien, registra un huésped nuevo:
            </div>

            <v-text-field
              v-model="form.newGuestName"
              label="Nombre del nuevo huésped"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="form.newGuestEmail"
              label="Email (opcional)"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="form.newGuestPhone"
              label="Teléfono (opcional)"
              density="comfortable"
              class="mb-4"
            />

            <v-select
              v-model="form.roomId"
              :items="roomOptions"
              label="Habitación"
              item-title="title"
              item-value="value"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="form.checkIn"
              label="Check-in (YYYY-MM-DD)"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="form.checkOut"
              label="Check-out (YYYY-MM-DD)"
              density="comfortable"
              class="mb-3"
            />

            <v-select
              v-model="form.status"
              :items="[
                { title: 'Confirmada', value: 'confirmed' },
                { title: 'En curso', value: 'in_progress' },
                { title: 'Completada', value: 'completed' },
                { title: 'Cancelada', value: 'cancelled' }
              ]"
              label="Estado"
              item-title="title"
              item-value="value"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model.number="form.total"
              type="number"
              label="Total"
              density="comfortable"
              class="mb-1"
            />

            <p
              v-if="formError"
              class="text-caption text-error mt-1"
            >
              {{ formError }}
            </p>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="newReservationDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="submitReservation"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
