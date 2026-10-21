import type { PriceTier, Region, Spot, SpotStyle } from '../../types'
import type { SpotRepository } from '../repositories'
import type { Client } from './client'
import type { Database } from './database.types'

type SpotRow = Database['public']['Tables']['spots']['Row']

// The DB enforces these values with CHECK constraints, so the casts are safe.
function toSpot(row: SpotRow): Spot {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    region: row.region as Region,
    lat: row.lat,
    lng: row.lng,
    priceTier: row.price_tier as PriceTier,
    style: row.style as SpotStyle,
    hours: row.hours ?? undefined,
    address: row.address,
    mapsUrl: row.maps_url,
  }
}

export class SupabaseSpotRepository implements SpotRepository {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async list(): Promise<Spot[]> {
    const { data, error } = await this.client.from('spots').select('*').order('name')
    if (error) throw new Error(`Couldn't load sushi spots: ${error.message}`)
    return data.map(toSpot)
  }

  async getById(id: string): Promise<Spot | null> {
    const { data, error } = await this.client
      .from('spots')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(`Couldn't load that spot: ${error.message}`)
    return data ? toSpot(data) : null
  }
}
