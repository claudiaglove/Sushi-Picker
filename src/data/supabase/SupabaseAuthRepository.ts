import type { AuthUser } from '../../types'
import type { AuthRepository } from '../repositories'
import { friendlyAuthMessage } from './authErrors'
import type { Client } from './client'

const toAuthUser = (user: { id: string; email?: string | undefined }): AuthUser => ({
  id: user.id,
  email: user.email ?? null,
})

export class SupabaseAuthRepository implements AuthRepository {
  private readonly client: Client

  constructor(client: Client) {
    this.client = client
  }

  async getUser(): Promise<AuthUser | null> {
    // Reads the locally stored session (no network round trip).
    const { data } = await this.client.auth.getSession()
    return data.session ? toAuthUser(data.session.user) : null
  }

  onChange(listener: (user: AuthUser | null) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      listener(session ? toAuthUser(session.user) : null)
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({ email, password })
    if (error) throw new Error(friendlyAuthMessage(error))
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
  ): Promise<{ needsEmailConfirmation: boolean }> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      // Where the confirmation link sends people back to (must be an allowed redirect URL).
      options: {
        emailRedirectTo: window.location.origin,
        // Saved in the user's auth metadata (no extra table needed).
        data: { first_name: firstName },
      },
    })
    if (error) throw new Error(friendlyAuthMessage(error))
    return { needsEmailConfirmation: data.session === null }
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut()
    if (error) throw new Error(friendlyAuthMessage(error))
  }
}
