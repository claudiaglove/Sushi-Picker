import type { SavedPlace, SavedStatus, Verdict } from '../../types'
import type { SavedPlacesRepository } from '../repositories'
import type { Client } from './client'
import type { Database } from './database.types'

type Row = Database['public']['Tables']['saved_places']['Row']

function toSavedPlace(row: Row): SavedPlace {
  return {
    spotId: row.spot_id,
    status: row.status as SavedStatus,
    verdict: row.verdict as Verdict,
    recommendedBy: row.recommended_by ?? undefined,
    note: row.note ?? undefined,
    updatedAt: row.updated_at,
  }
}

export class SupabaseSavedPlacesRepository implements SavedPlacesRepository {
  private readonly client: Client
  private readonly getUserId: () => Promise<string>

  constructor(client: Client, getUserId: () => Promise<string>) {
    this.client = client
    this.getUserId = getUserId
  }

  async list(): Promise<SavedPlace[]> {
    const userId = await this.getUserId()
    const { data, error } = await this.client
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
    if (error) throw new Error(`Couldn't load your places: ${error.message}`)
    return data.map(toSavedPlace)
  }

  async upsert(place: Omit<SavedPlace, 'updatedAt'>): Promise<SavedPlace> {
    const userId = await this.getUserId()
    // Optional fields are sent as explicit nulls so clearing a note/recommender really clears it.
    const { data, error } = await this.client
      .from('saved_places')
      .upsert(
        {
          user_id: userId,
          spot_id: place.spotId,
          status: place.status,
          verdict: place.verdict,
          recommended_by: place.recommendedBy ?? null,
          note: place.note ?? null,
        },
        { onConflict: 'user_id,spot_id' },
      )
      .select()
      .single()
    if (error) throw new Error(`Couldn't save that place: ${error.message}`)
    return toSavedPlace(data)
  }

  async remove(spotId: string): Promise<void> {
    const userId = await this.getUserId()
    const { error } = await this.client
      .from('saved_places')
      .delete()
      .eq('user_id', userId)
      .eq('spot_id', spotId)
    if (error) throw new Error(`Couldn't remove that place: ${error.message}`)
  }

  async clear(): Promise<void> {
    const userId = await this.getUserId()
    const { error } = await this.client
      .from('saved_places')
      .delete()
      .eq('user_id', userId)
    if (error) throw new Error(`Couldn't clear your places: ${error.message}`)
  }
}
