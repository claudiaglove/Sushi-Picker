import { useCallback, useMemo } from 'react'
import { useDataContext } from '../context/DataContext'
import { haversineMiles } from '../lib/distance'
import type { Spot } from '../types'

export function useSpots() {
  const { spots, settings, ready } = useDataContext()
  const byId = useMemo(() => new Map(spots.map((s) => [s.id, s])), [spots])

  const getSpot = useCallback((id: string): Spot | undefined => byId.get(id), [byId])

  /** Straight-line miles from the user's saved location, or null if none yet. */
  const milesTo = useCallback(
    (spot: Spot): number | null => (settings ? haversineMiles(settings, spot) : null),
    [settings],
  )

  return { spots, loading: !ready, getSpot, milesTo }
}
