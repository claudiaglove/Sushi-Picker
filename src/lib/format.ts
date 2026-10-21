import type { PriceTier, Spot, SpotStyle, Where, Who, Budget } from '../types'
import type { ScoredSpot } from './pick'

export const PRICE_LABEL: Record<PriceTier, string> = {
  casual: 'Casual',
  mid: 'Mid-priced',
  omakase: 'Omakase splurge',
}

export const PRICE_SYMBOL: Record<PriceTier, string> = {
  casual: '$',
  mid: '$$',
  omakase: '$$$$',
}

export const STYLE_LABEL: Record<SpotStyle, string> = {
  omakase: 'Omakase',
  'nigiri bar': 'Nigiri bar',
  rolls: 'Rolls',
  conveyor: 'Conveyor belt',
  takeout: 'Takeout',
}

export const BUDGET_OPTIONS: { value: Budget; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'mid', label: 'Mid' },
  { value: 'omakase', label: 'Omakase splurge' },
]

export const WHO_OPTIONS: { value: Who; label: string }[] = [
  { value: 'solo', label: 'Solo' },
  { value: 'date', label: 'Date' },
  { value: 'group', label: 'Group' },
]

export const WHERE_OPTIONS: { value: Where; label: string }[] = [
  { value: 'near', label: 'Within 5 mi' },
  { value: 'mid', label: 'Within 15 mi' },
  { value: 'anywhere', label: 'Anywhere in the Bay' },
]

export function formatMiles(miles: number): string {
  return miles < 10 ? `${miles.toFixed(1)} mi` : `${Math.round(miles)} mi`
}

/** "Mid-priced nigiri bar, 4.2 mi away, on your want-to-try list" */
export function reasonLine(pick: ScoredSpot): string {
  const { spot, distanceMiles, savedReason } = pick
  const parts = [
    `${PRICE_LABEL[spot.priceTier]} ${STYLE_LABEL[spot.style].toLowerCase()}`,
    `${formatMiles(distanceMiles)} away`,
  ]
  if (savedReason === 'want_to_try') parts.push('on your want-to-try list')
  else if (savedReason === 'liked') parts.push('you liked it before')
  return parts.join(', ')
}

export function describeSpot(spot: Spot, miles: number | null): string {
  const base = `${PRICE_LABEL[spot.priceTier]} · ${STYLE_LABEL[spot.style]}`
  return miles === null ? base : `${base} · ${formatMiles(miles)}`
}
