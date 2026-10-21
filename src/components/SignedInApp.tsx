import { App } from '../App'
import { DataProvider } from '../context/DataProvider'
import type { Repositories } from '../data'
import { useAuth } from '../hooks/useAuth'

/** Keyed by user so switching accounts never shows the previous user's data. */
export function SignedInApp({ repositories }: { repositories: Repositories }) {
  const { user } = useAuth()
  return (
    <DataProvider key={user?.id} repositories={repositories}>
      <App />
    </DataProvider>
  )
}
