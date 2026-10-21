import { createContext, useContext } from 'react'
import type { AuthUser } from '../types'

export interface AuthContextValue {
  /** `loading` until the stored session has been checked. */
  status: 'loading' | 'signedOut' | 'signedIn'
  user: AuthUser | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    firstName: string,
  ) => Promise<{ needsEmailConfirmation: boolean }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('Auth hooks must be used inside <AuthProvider>')
  return value
}
