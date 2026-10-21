import type { Repositories } from './repositories'
import { LocalAuthRepository } from './mock/LocalAuthRepository'
import { LocalStorageSavedPlacesRepository } from './mock/LocalStorageSavedPlacesRepository'
import { LocalStorageSettingsRepository } from './mock/LocalStorageSettingsRepository'
import { MockSpotRepository } from './mock/MockSpotRepository'
import { createSupabaseClient, createUserIdGetter } from './supabase/client'
import { SupabaseAuthRepository } from './supabase/SupabaseAuthRepository'
import { SupabaseSavedPlacesRepository } from './supabase/SupabaseSavedPlacesRepository'
import { SupabaseSettingsRepository } from './supabase/SupabaseSettingsRepository'
import { SupabaseSpotRepository } from './supabase/SupabaseSpotRepository'
import { bundledZipRepository } from './zipLookup'

/**
 * Composition root and the ONE place data sources are chosen.
 * With VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set, auth and data come from Supabase
 * (email + password sign-in). Without them, the app falls back to local mock data and
 * skips the login screen.
 */
export function createRepositories(): Repositories {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (url && key) {
    const client = createSupabaseClient(url, key)
    const getUserId = createUserIdGetter(client)
    return {
      auth: new SupabaseAuthRepository(client),
      spots: new SupabaseSpotRepository(client),
      savedPlaces: new SupabaseSavedPlacesRepository(client, getUserId),
      settings: new SupabaseSettingsRepository(client, getUserId),
      zips: bundledZipRepository,
    }
  }

  return {
    auth: new LocalAuthRepository(),
    spots: new MockSpotRepository(),
    savedPlaces: new LocalStorageSavedPlacesRepository(),
    settings: new LocalStorageSettingsRepository(),
    zips: bundledZipRepository,
  }
}

export type { AuthRepository, Repositories } from './repositories'
