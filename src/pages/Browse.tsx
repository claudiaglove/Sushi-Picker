import { useId, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { SaveButton } from '../components/SaveButton'
import { cardClass, inputClass } from '../components/ui'
import { useSpots } from '../hooks/useSpots'
import { PRICE_LABEL, STYLE_LABEL, describeSpot } from '../lib/format'
import {
  PRICE_TIERS,
  REGIONS,
  SPOT_STYLES,
  type PriceTier,
  type Region,
  type SpotStyle,
} from '../types'

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  className = '',
}: {
  className?: string
  label: string
  value: T | ''
  onChange: (value: T | '') => void
  options: { value: T; label: string }[]
}) {
  const id = useId()
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        className={inputClass}
        value={value}
        onChange={(e) => {
          onChange(e.target.value as T | '')
        }}
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Browse() {
  const { spots, milesTo, loading } = useSpots()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<Region | ''>('')
  const [price, setPrice] = useState<PriceTier | ''>('')
  const [style, setStyle] = useState<SpotStyle | ''>('')
  const searchId = useId()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return spots
      .filter(
        (s) =>
          (!q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)) &&
          (!region || s.region === region) &&
          (!price || s.priceTier === price) &&
          (!style || s.style === style),
      )
      .map((spot) => ({ spot, miles: milesTo(spot) }))
      .sort((a, b) => (a.miles ?? 0) - (b.miles ?? 0))
  }, [spots, query, region, price, style, milesTo])

  if (loading) return <Loading />

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Browse</h1>

      <form
        role="search"
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={searchId} className="text-sm font-semibold">
            Search by name or city
          </label>
          <input
            id={searchId}
            type="search"
            className={inputClass}
            value={query}
            placeholder="Search sushi spots"
            onChange={(e) => {
              setQuery(e.target.value)
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Select
            label="Region"
            value={region}
            onChange={setRegion}
            options={REGIONS.map((r) => ({ value: r, label: r }))}
          />
          <Select
            label="Price"
            value={price}
            onChange={setPrice}
            options={PRICE_TIERS.map((p) => ({ value: p, label: PRICE_LABEL[p] }))}
          />
          <Select
            className="col-span-2 sm:col-span-1"
            label="Style"
            value={style}
            onChange={setStyle}
            options={SPOT_STYLES.map((s) => ({ value: s, label: STYLE_LABEL[s] }))}
          />
        </div>
      </form>

      <p role="status" className="text-sm text-muted">
        {results.length} {results.length === 1 ? 'spot' : 'spots'}
      </p>

      {results.length === 0 ? (
        <EmptyState title="No spots match">
          Try clearing a filter or searching for something else.
        </EmptyState>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {results.map(({ spot, miles }) => (
            <li
              key={spot.id}
              className={`${cardClass} flex items-center justify-between gap-3`}
            >
              <div className="min-w-0">
                <h2 className="text-lg font-bold">{spot.name}</h2>
                <p className="text-muted">
                  {spot.city} · {spot.region}
                </p>
                <p className="text-muted">{describeSpot(spot, miles)}</p>
              </div>
              <SaveButton spot={spot} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
