import type { UserSettings } from '../../types'
import type { SettingsRepository } from '../repositories'
import type { Client } from './client'

export class SupabaseSettingsRepository implements SettingsRepository {
  private readonly client: Client
  private readonly getUserId: () => Promise<string>

  constructor(client: Client, getUserId: () => Promise<string>) {
    this.client = client
    this.getUserId = getUserId
  }

  async get(): Promise<UserSettings | null> {
    const userId = await this.getUserId()
    const { data, error } = await this.client
      .from('user_settings')
      .select('zip_code, lat, lng')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw new Error(`Couldn't load your settings: ${error.message}`)
    return data ? { zipCode: data.zip_code, lat: data.lat, lng: data.lng } : null
  }

  async set(settings: UserSettings): Promise<void> {
    const userId = await this.getUserId()
    const { error } = await this.client.from('user_settings').upsert(
      {
        user_id: userId,
        zip_code: settings.zipCode,
        lat: settings.lat,
        lng: settings.lng,
      },
      { onConflict: 'user_id' },
    )
    if (error) throw new Error(`Couldn't save your settings: ${error.message}`)
  }

  async clear(): Promise<void> {
    const userId = await this.getUserId()
    const { error } = await this.client
      .from('user_settings')
      .delete()
      .eq('user_id', userId)
    if (error) throw new Error(`Couldn't clear your settings: ${error.message}`)
  }
}
