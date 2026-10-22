import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AuthRepository } from '../data'
import type { AuthUser } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContext'

interface Props {
  auth: AuthRepository
  children: ReactNode
}

export function AuthProvider({ auth, children }: Props) {
  // undefined = still checking the stored session; null = signed out.
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined)

  useEffect(() => {
    let active = true
    const unsubscribe = auth.onChange((next) => {
      if (active) setUser(next)
    })
    void auth.getUser().then((current) => {
      if (active) setUser((prev) => (prev === undefined ? current : prev))
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [auth])

  const value = useMemo<AuthContextValue>(
    () => ({
      status: user === undefined ? 'loading' : user ? 'signedIn' : 'signedOut',
      user: user ?? null,
      signIn: (email, password) => auth.signIn(email, password),
      signUp: (email, password) => auth.signUp(email, password),
      signOut: () => auth.signOut(),
    }),
    [auth, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
