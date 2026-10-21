import { useCallback, useMemo } from 'react'
import { useDataContext } from '../context/DataContext'
import type { SavedPlace, Verdict } from '../types'

const clean = (value?: string): string | undefined => {
  const trimmed = value?.trim()
  return trimmed === '' ? undefined : trimmed
}

export function useSavedPlaces() {
  const { saved, ready, savePlace, removePlace } = useDataContext()
  const bySpotId = useMemo(() => new Map(saved.map((p) => [p.spotId, p])), [saved])

  const getSaved = useCallback((spotId: string) => bySpotId.get(spotId), [bySpotId])

  const saveAsWantToTry = useCallback(
    (spotId: string, recommendedBy?: string) =>
      savePlace({
        spotId,
        status: 'want_to_try',
        verdict: null,
        recommendedBy: clean(recommendedBy),
      }),
    [savePlace],
  )

  const markBeen = useCallback(
    (place: SavedPlace, verdict: Verdict) =>
      savePlace({ ...place, status: 'been', verdict }),
    [savePlace],
  )

  /** Update note / recommendedBy. Empty strings clear the field. */
  const editDetails = useCallback(
    (place: SavedPlace, details: { note: string; recommendedBy: string }) =>
      savePlace({
        ...place,
        note: clean(details.note),
        recommendedBy: clean(details.recommendedBy),
      }),
    [savePlace],
  )

  return {
    saved,
    loading: !ready,
    getSaved,
    saveAsWantToTry,
    markBeen,
    editDetails,
    remove: removePlace,
  }
}
