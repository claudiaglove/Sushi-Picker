import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Login } from '../pages/Login'
import { Loading } from './Loading'

/** Shows the login screen until someone is signed in, then renders the app. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  if (status === 'loading') return <Loading />
  if (status === 'signedOut') return <Login />
  return children
}
