import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { PlaceItem } from '../components/PlaceItem'
import { buttonClass } from '../components/ui'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import { useSpots } from '../hooks/useSpots'
import type { SavedStatus } from '../types'

const TABS: { status: SavedStatus; label: string; empty: string }[] = [
  {
    status: 'want_to_try',
    label: 'Want to try',
    empty: 'Save spots from Browse or your results and they will show up here.',
  },
  {
    status: 'been',
    label: 'Been',
    empty: 'Mark a saved spot as "been" to keep a record.',
  },
]

export function MyPlaces() {
  const { saved, loading: savedLoading } = useSavedPlaces()
  const { getSpot, milesTo, loading: spotsLoading } = useSpots()
  const [active, setActive] = useState<SavedStatus>('want_to_try')
  const baseId = useId()

  const items = useMemo(() => {
    const rows = saved
      .filter((p) => p.status === active)
      .flatMap((place) => {
        const spot = getSpot(place.spotId)
        return spot ? [{ place, spot, miles: milesTo(spot) }] : []
      })
    return active === 'want_to_try'
      ? rows.sort((a, b) => (a.miles ?? 0) - (b.miles ?? 0))
      : rows.sort((a, b) => b.place.updatedAt.localeCompare(a.place.updatedAt))
  }, [saved, active, getSpot, milesTo])

  const counts = (status: SavedStatus) => saved.filter((p) => p.status === status).length

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const next = active === 'want_to_try' ? 'been' : 'want_to_try'
    setActive(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  if (savedLoading || spotsLoading) return <Loading />
  const current = TABS.find((t) => t.status === active)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-tight">My places</h1>

      <div
        role="tablist"
        aria-label="My places"
        className="grid grid-cols-2 gap-1 rounded-xl bg-soft p-1"
      >
        {TABS.map((tab) => {
          const selected = tab.status === active
          return (
            <button
              key={tab.status}
              id={`${baseId}-tab-${tab.status}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                setActive(tab.status)
              }}
              onKeyDown={onKeyDown}
              className={`min-h-11 rounded-lg px-3 font-semibold ${
                selected ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label} ({counts(tab.status)})
            </button>
          )
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
      >
        {items.length === 0 ? (
          <EmptyState
            title={`Nothing in ${current?.label ?? 'this list'} yet`}
            action={
              <Link to="/browse" className={buttonClass('primary')}>
                Browse spots
              </Link>
            }
          >
            {current?.empty}
          </EmptyState>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {items.map(({ place, spot, miles }) => (
              <PlaceItem key={place.spotId} place={place} spot={spot} miles={miles} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
