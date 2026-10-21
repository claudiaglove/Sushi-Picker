import type { SavedPlace } from '../../types'
import type { SavedPlacesRepository } from '../repositories'
import { readJson, removeKey, writeJson } from './storage'

const KEY = 'sushi-picker:v1:saved-places'

export class LocalStorageSavedPlacesRepository implements SavedPlacesRepository {
  list(): Promise<SavedPlace[]> {
    return Promise.resolve((readJson(KEY) as SavedPlace[] | null) ?? [])
  }

  async upsert(place: Omit<SavedPlace, 'updatedAt'>): Promise<SavedPlace> {
    const stamped: SavedPlace = { ...place, updatedAt: new Date().toISOString() }
    const rest = (await this.list()).filter((p) => p.spotId !== place.spotId)
    writeJson(KEY, [...rest, stamped])
    return stamped
  }

  async remove(spotId: string): Promise<void> {
    const rest = (await this.list()).filter((p) => p.spotId !== spotId)
    writeJson(KEY, rest)
  }

  clear(): Promise<void> {
    removeKey(KEY)
    return Promise.resolve()
  }
}
