export const REGIONS = ['SF', 'Peninsula', 'South Bay', 'East Bay', 'North Bay'] as const
export type Region = (typeof REGIONS)[number]

export const PRICE_TIERS = ['casual', 'mid', 'omakase'] as const
export type PriceTier = (typeof PRICE_TIERS)[number]

export const SPOT_STYLES = [
  'omakase',
  'nigiri bar',
  'rolls',
  'conveyor',
  'takeout',
] as const
export type SpotStyle = (typeof SPOT_STYLES)[number]

export interface Spot {
  id: string
  name: string
  city: string
  region: Region
  lat: number
  lng: number
  priceTier: PriceTier
  style: SpotStyle
  hours?: string
  address: string
  mapsUrl: string
}

export type SavedStatus = 'want_to_try' | 'been'
export type Verdict = 'up' | 'down' | null

export interface SavedPlace {
  spotId: string
  status: SavedStatus
  verdict: Verdict
  recommendedBy?: string
  note?: string
  /** ISO timestamp. */
  updatedAt: string
}

export interface UserSettings {
  zipCode: string
  lat: number
  lng: number
}

export interface LatLng {
  lat: number
  lng: number
}

// Pick-for-me answers (UI + pick logic share these).
export type Budget = PriceTier
export type Who = 'solo' | 'date' | 'group'
export type Where = 'near' | 'mid' | 'anywhere'

export interface AuthUser {
  id: string
  email: string | null
}
