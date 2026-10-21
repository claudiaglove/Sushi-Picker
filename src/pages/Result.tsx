import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { EmptyState } from '../components/EmptyState'
import { ExternalIcon } from '../components/icons'
import { Loading } from '../components/Loading'
import { SaveButton } from '../components/SaveButton'
import { buttonClass, cardClass } from '../components/ui'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import { useSettings } from '../hooks/useSettings'
import { useSpots } from '../hooks/useSpots'
import { BUDGET_OPTIONS, WHERE_OPTIONS, WHO_OPTIONS, reasonLine } from '../lib/format'
import { pickSpots, type ScoredSpot } from '../lib/pick'
import type { Budget, Where, Who } from '../types'

function parse<T extends string>(raw: string | null, options: { value: T }[]): T | null {
  return options.find((o) => o.value === raw)?.value ?? null
}

function Directions({ pick, className = '' }: { pick: ScoredSpot; className?: string }) {
  return (
    <a
      href={pick.spot.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass('primary', className)}
    >
      Directions
      <ExternalIcon width={18} height={18} />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

export function Result() {
  const [params] = useSearchParams()
  const { spots, loading: spotsLoading } = useSpots()
  const { saved, loading: savedLoading } = useSavedPlaces()
  const { settings } = useSettings()
  const [page, setPage] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const budget: Budget | null = parse(params.get('budget'), BUDGET_OPTIONS)
  const who: Who | null = parse(params.get('who'), WHO_OPTIONS)
  const where: Where | null = parse(params.get('where'), WHERE_OPTIONS)

  const result = useMemo(
    () =>
      budget && who && where && settings
        ? pickSpots({ spots, saved, origin: settings, budget, who, where, page })
        : null,
    [spots, saved, settings, budget, who, where, page],
  )

  // After "Not feeling it", move focus to the new top pick so screen readers announce it.
  const shownPage = result?.page
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [shownPage])

  if (!budget || !who || !where) return <Navigate to="/" replace />
  if (spotsLoading || savedLoading || !result) return <Loading />

  const [top, ...backups] = result.picks

  if (!top) {
    return (
      <EmptyState
        title="Nothing matches that budget"
        action={
          <Link to="/" className={buttonClass('primary')}>
            Change my answers
          </Link>
        }
      >
        We couldn't find a spot in that price range. Try a different budget.
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {result.relaxed && (
        <p role="status" className="rounded-xl bg-accent-soft p-3 font-semibold">
          Nothing was that close, so we widened the distance to show you the nearest
          options.
        </p>
      )}

      <section
        aria-labelledby="top-pick"
        className={`${cardClass} flex flex-col gap-4 p-5`}
      >
        <p className="text-sm font-bold tracking-wide text-accent uppercase">Your pick</p>
        <div className="flex flex-col gap-2">
          <h1
            id="top-pick"
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl font-extrabold tracking-tight outline-none"
          >
            {top.spot.name}
          </h1>
          <p className="text-lg">{reasonLine(top)}.</p>
          <p className="text-muted">
            {top.spot.address}
            {top.spot.hours ? ` · ${top.spot.hours}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Directions pick={top} className="flex-1" />
          <SaveButton spot={top.spot} className="flex-1" />
        </div>
        {result.pageCount > 1 ? (
          <button
            type="button"
            className={buttonClass('ghost')}
            onClick={() => {
              setPage((p) => p + 1)
            }}
          >
            Not feeling it
          </button>
        ) : (
          <p className="text-center text-sm text-muted">That's every spot that fits.</p>
        )}
      </section>

      {backups.length > 0 && (
        <section aria-labelledby="backups" className="flex flex-col gap-3">
          <h2 id="backups" className="text-lg font-bold">
            Backups
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {backups.map((pick) => (
              <li key={pick.spot.id} className={`${cardClass} flex flex-col gap-3`}>
                <div>
                  <h3 className="text-lg font-bold">{pick.spot.name}</h3>
                  <p className="text-muted">{reasonLine(pick)}.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Directions pick={pick} className="flex-1" />
                  <SaveButton spot={pick.spot} className="flex-1" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link to="/" className={buttonClass('secondary')}>
        Change my answers
      </Link>
    </div>
  )
}
