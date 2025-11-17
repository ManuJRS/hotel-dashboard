import type { HotelData } from '../types/hotel'

export async function fetchInitialData(): Promise<HotelData> {
  const res = await fetch('/db.json')
  if (!res.ok) {
    throw new Error('No se pudo cargar db.json')
  }
  return res.json()
}
