import { defineStore } from 'pinia'
import { fetchInitialData } from '../services/hoetelApi'
import type { Room, Guest, Reservation, HotelData } from '../types/hotel'



const STORAGE_KEY = 'hotel-dashboard-state'

export interface HotelState {
  rooms: Room[]
  reservations: Reservation[]
  guests: Guest[]
  isLoaded: boolean
}

export const useHotelStore = defineStore('hotel', {
  state: (): HotelState => ({
    rooms: [],
    reservations: [],
    guests: [],
    isLoaded: false
  }),

  actions: {
    loadFromLocalStorage(): boolean {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return false

      const parsed = JSON.parse(saved) as HotelData

      this.rooms = parsed.rooms
      this.reservations = parsed.reservations
      this.guests = parsed.guests
      this.isLoaded = true
      return true
    },

    async loadInitialData(): Promise<void> {
      const hasLocal = this.loadFromLocalStorage()
      if (hasLocal) return

      const data = await fetchInitialData()
      this.rooms = data.rooms
      this.reservations = data.reservations
      this.guests = data.guests
      this.isLoaded = true

      this.saveToLocalStorage()
    },

    saveToLocalStorage(): void {
      const payload: HotelData = {
        rooms: this.rooms,
        reservations: this.reservations,
        guests: this.guests
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },

    /** Crear una reserva nueva (simula un POST) */
    addReservation(input: Omit<Reservation, 'id'>): void {
      // id máximo actual, por si borraste algunas reservas
      const lastId = this.reservations.reduce((max, r) => {
        return r.id > max ? r.id : max
      }, 0)

      const newReservation: Reservation = {
        ...input,
        id: lastId + 1
      }

      this.reservations.push(newReservation)
      this.saveToLocalStorage()
    },

        addGuest(guest: Omit<Guest, 'id'>): number {
      const lastId = this.guests.reduce((max, g) => {
        return g.id > max ? g.id : max
      }, 0)

      const newGuest: Guest = {
        ...guest,
        id: lastId + 1
      }

      this.guests.push(newGuest)
      this.saveToLocalStorage()
      return newGuest.id
    },

    /** Actualizar una reserva (simula PUT/PATCH) */
    updateReservation(id: number, changes: Partial<Omit<Reservation, 'id'>>): void {
      const idx = this.reservations.findIndex(r => r.id === id)
      if (idx === -1) return

      const current = this.reservations[idx]

      // Aquí es donde TS se pone dramático.
      // Le decimos explícitamente: este objeto es un Reservation completo.
      const updated: Reservation = {
        ...current,
        ...changes
      } as Reservation

      this.reservations[idx] = updated
      this.saveToLocalStorage()
    },

    /** Eliminar una reserva (simula DELETE) */
    removeReservation(id: number): void {
      this.reservations = this.reservations.filter(r => r.id !== id)
      this.saveToLocalStorage()
    }
  }
})