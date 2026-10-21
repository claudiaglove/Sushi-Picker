import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Repositories } from '../data'
import type { SavedPlace, Spot, UserSettings } from '../types'
import { buttonClass } from '../components/ui'
import { DataContext, type DataContextValue } from './DataContext'

const messageOf = (err: unknown): string =>
  err instanceof Error ? err.message : 'Something went wrong. Please try again.'

interface Props {
  repositories: Repositories
  children: ReactNode
}

/**
 * Loads everything through the repository interfaces and shares it with hooks.
 * This is the only place that knows repositories exist; the UI never sees them.
 */
export function DataProvider({ repositories, children }: Props) {
  const [ready, setReady] = useState(false)
  const [spots, setSpots] = useState<Spot[]>([])
  const [saved, setSaved] = useState<SavedPlace[]>([])
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    void Promise.all([
      repositories.spots.list(),
      repositories.savedPlaces.list(),
      repositories.settings.get(),
    ])
      .then(([s, p, u]) => {
        if (cancelled) return
        setSpots(s)
        setSaved(p)
        setSettings(u)
        setLoadError(null)
        setReady(true)
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(messageOf(err))
      })
    return () => {
      cancelled = true
    }
  }, [repositories, attempt])

  /** Runs a mutation; on failure shows a banner instead of leaving an unhandled rejection. */
  const guard = useCallback(
    <A extends unknown[]>(fn: (...args: A) => Promise<void>) =>
      async (...args: A): Promise<void> => {
        try {
          await fn(...args)
          setActionError(null)
        } catch (err) {
          setActionError(messageOf(err))
        }
      },
    [],
  )

  const savePlace = useMemo(
    () =>
      guard(async (place: Omit<SavedPlace, 'updatedAt'>) => {
        const stored = await repositories.savedPlaces.upsert(place)
        setSaved((prev) => [...prev.filter((p) => p.spotId !== stored.spotId), stored])
      }),
    [repositories, guard],
  )

  const removePlace = useMemo(
    () =>
      guard(async (spotId: string) => {
        await repositories.savedPlaces.remove(spotId)
        setSaved((prev) => prev.filter((p) => p.spotId !== spotId))
      }),
    [repositories, guard],
  )

  const saveSettings = useMemo(
    () =>
      guard(async (next: UserSettings) => {
        await repositories.settings.set(next)
        setSettings(next)
      }),
    [repositories, guard],
  )

  const clearAll = useMemo(
    () =>
      guard(async () => {
        await Promise.all([
          repositories.savedPlaces.clear(),
          repositories.settings.clear(),
        ])
        setSaved([])
        setSettings(null)
      }),
    [repositories, guard],
  )

  const value = useMemo<DataContextValue>(
    () => ({
      ready,
      spots,
      saved,
      settings,
      savePlace,
      removePlace,
      saveSettings,
      clearAll,
      lookupZip: (zip) => repositories.zips.lookup(zip),
      nearestZip: (lat, lng) => repositories.zips.nearest(lat, lng),
    }),
    [
      ready,
      spots,
      saved,
      settings,
      savePlace,
      removePlace,
      saveSettings,
      clearAll,
      repositories,
    ],
  )

  if (loadError) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-extrabold">Can't reach the sushi database</h1>
        <p role="alert" className="text-muted">
          {loadError}
        </p>
        <button
          type="button"
          className={buttonClass('primary')}
          onClick={() => {
            setLoadError(null)
            setAttempt((n) => n + 1)
          }}
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <DataContext.Provider value={value}>
      {actionError && (
        <div
          role="alert"
          className="fixed inset-x-0 top-0 z-50 mx-auto flex max-w-md items-start justify-between gap-3 bg-bad p-3 text-sm font-semibold text-bg md:rounded-b-xl"
        >
          <span>{actionError}</span>
          <button
            type="button"
            className="min-h-6 underline"
            onClick={() => {
              setActionError(null)
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      {children}
    </DataContext.Provider>
  )
}
