import type { UserSettings } from '../../types'
import type { SettingsRepository } from '../repositories'
import { readJson, removeKey, writeJson } from './storage'

const KEY = 'sushi-picker:v1:settings'

export class LocalStorageSettingsRepository implements SettingsRepository {
  get(): Promise<UserSettings | null> {
    return Promise.resolve(readJson(KEY) as UserSettings | null)
  }

  set(settings: UserSettings): Promise<void> {
    writeJson(KEY, settings)
    return Promise.resolve()
  }

  clear(): Promise<void> {
    removeKey(KEY)
    return Promise.resolve()
  }
}
