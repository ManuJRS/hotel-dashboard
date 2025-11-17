export type RoomStatus = 'available' | 'occupied' | 'maintenance'
export type ReservationStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface Room {
  id: number
  number: string
  type: string
  capacity: number
  status: RoomStatus
  price: number

  // 🔽 Nuevos campos
  floor?: number
  amenities?: string[]
  description?: string
}

export interface Guest {
  id: number
  name: string
  email: string
  phone: string

  // 🔽 Nuevos campos
  document?: string
  country?: string
}

export interface Reservation {
  id: number
  roomId: number
  guestId: number
  checkIn: string
  checkOut: string
  status: ReservationStatus
  total: number

  // 🔽 Nuevo campo
  notes?: string
}

export interface HotelData {
  rooms: Room[]
  guests: Guest[]
  reservations: Reservation[]
}
