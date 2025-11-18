<script setup lang="ts">
import { ref } from 'vue'
import { computed } from 'vue'
import { useHotelStore } from '../stores/hotelStore'
import type { Guest } from '../types/hotel'

const store = useHotelStore()

interface GuestItem extends Guest {
  reservationsCount: number
}

interface Header {
  title: string
  key: keyof GuestItem | 'actions'
}

const headers: Header[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Teléfono', key: 'phone' },
  { title: 'País', key: 'country' },
  { title: 'Reservas', key: 'reservationsCount' },
  { title: 'Acciones', key: 'actions' }
]

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

/* ========== Modal editar huésped ========== */

const editDialog = ref(false)
const editingGuestId = ref<number | null>(null)

const editForm = ref({
  name: '',
  email: '',
  phone: '',
  document: '',
  country: ''
})

function openEditGuest(id: number) {
  const guest = store.guests.find(g => g.id === id)
  if (!guest) return

  editingGuestId.value = id
  editForm.value = {
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    document: guest.document ?? '',
    country: guest.country ?? ''
  }

  editDialog.value = true
}

function saveGuest() {
  if (editingGuestId.value == null) return

  store.updateGuest(editingGuestId.value, {
    name: editForm.value.name,
    email: editForm.value.email,
    phone: editForm.value.phone,
    document: editForm.value.document,
    country: editForm.value.country
  })

  editDialog.value = false
}
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
        >
          <template #item.actions="{ item }">
            <v-btn
              size="small"
              variant="text"
              @click="openEditGuest(item.id)"
            >
              Editar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="editDialog"
      max-width="480"
    >
      <v-card>
        <v-card-title class="text-h6">
          Editar huésped
        </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              v-model="editForm.name"
              label="Nombre"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="editForm.email"
              label="Email"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="editForm.phone"
              label="Teléfono"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="editForm.document"
              label="Documento (ID / Pasaporte)"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="editForm.country"
              label="País"
              density="comfortable"
              class="mb-1"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="saveGuest">
            Guardar cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>