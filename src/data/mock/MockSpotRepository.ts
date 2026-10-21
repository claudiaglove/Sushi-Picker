import type { Spot } from '../../types'
import type { SpotRepository } from '../repositories'
import spots from './spots.json'

// JSON imports are widened to `string`; the file is the source of truth for the union types.
const all = spots as Spot[]

export class MockSpotRepository implements SpotRepository {
  list(): Promise<Spot[]> {
    return Promise.resolve(all)
  }

  getById(id: string): Promise<Spot | null> {
    return Promise.resolve(all.find((s) => s.id === id) ?? null)
  }
}
