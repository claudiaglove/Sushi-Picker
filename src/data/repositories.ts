import type { AuthUser, SavedPlace, Spot, UserSettings } from '../types'

/**
 * Data-access contracts. The UI only ever talks to these (through hooks).
 * Methods are async on purpose so a network-backed implementation (Supabase)
 * can replace the local ones without any UI change.
 */

export interface SpotRepository {
  list(): Promise<Spot[]>
  getById(id: string): Promise<Spot | null>
}

export interface SavedPlacesRepository {
  list(): Promise<SavedPlace[]>
  /** Insert or replace by spotId. The repository stamps `updatedAt`. */
  upsert(place: Omit<SavedPlace, 'updatedAt'>): Promise<SavedPlace>
  remove(spotId: string): Promise<void>
  clear(): Promise<void>
}

export interface SettingsRepository {
  get(): Promise<UserSettings | null>
  set(settings: UserSettings): Promise<void>
  clear(): Promise<void>
}

/** Zip -> coordinates. Bundled lookup today; could be a table/API later. */
export interface ZipRepository {
  lookup(zip: string): Promise<{ lat: number; lng: number } | null>
  /** Closest known zip to a coordinate (used after "Use my current location"). */
  nearest(lat: number, lng: number): Promise<string | null>
}

/** Who is signed in. Errors thrown by sign-in/up carry user-friendly messages. */
export interface AuthRepository {
  /** The current user from the stored session, or null when signed out. */
  getUser(): Promise<AuthUser | null>
  /** Subscribe to sign-in / sign-out. Returns an unsubscribe function. */
  onChange(listener: (user: AuthUser | null) => void): () => void
  signIn(email: string, password: string): Promise<void>
  /** `needsEmailConfirmation` is true when the user must click a link before signing in. */
  signUp(email: string, password: string): Promise<{ needsEmailConfirmation: boolean }>
  signOut(): Promise<void>
}

export interface Repositories {
  auth: AuthRepository
  spots: SpotRepository
  savedPlaces: SavedPlacesRepository
  settings: SettingsRepository
  zips: ZipRepository
}
