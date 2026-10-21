import type { AuthUser } from '../../types'
import type { AuthRepository } from '../repositories'

const LOCAL_USER: AuthUser = { id: 'local-user', email: null }

/** Offline fallback: everyone is the same always-signed-in local user, so no login screen. */
export class LocalAuthRepository implements AuthRepository {
  getUser(): Promise<AuthUser | null> {
    return Promise.resolve(LOCAL_USER)
  }

  onChange(): () => void {
    return () => undefined
  }

  signIn(): Promise<void> {
    return Promise.resolve()
  }

  signUp(): Promise<{ needsEmailConfirmation: boolean }> {
    return Promise.resolve({ needsEmailConfirmation: false })
  }

  signOut(): Promise<void> {
    return Promise.resolve()
  }
}
