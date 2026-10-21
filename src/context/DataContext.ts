import { createContext, useContext } from 'react'
import type { SavedPlace, Spot, UserSettings } from '../types'

export interface DataContextValue {
  /** False until the first load from the repositories finishes. */
  ready: boolean
  spots: Spot[]
  saved: SavedPlace[]
  settings: UserSettings | null
  savePlace: (place: Omit<SavedPlace, 'updatedAt'>) => Promise<void>
  removePlace: (spotId: string) => Promise<void>
  saveSettings: (settings: UserSettings) => Promise<void>
  /** Wipes saved places and the saved zip code. */
  clearAll: () => Promise<void>
  lookupZip: (zip: string) => Promise<{ lat: number; lng: number } | null>
  nearestZip: (lat: number, lng: number) => Promise<string | null>
}

export const DataContext = createContext<DataContextValue | null>(null)

export function useDataContext(): DataContextValue {
  const value = useContext(DataContext)
  if (!value) throw new Error('Data hooks must be used inside <DataProvider>')
  return value
}
