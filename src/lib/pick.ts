import type { Budget, LatLng, SavedPlace, Spot, SpotStyle, Where, Who } from '../types'
import { haversineMiles } from './distance'

export const PAGE_SIZE = 3

export const MAX_MILES: Record<Where, number> = {
  near: 5,
  mid: 15,
  anywhere: Infinity,
}

// Scoring weights. Saved-ness dominates distance and style so that a spot the
// user already wants to try beats a closer stranger.
const WANT_TO_TRY_BOOST = 50
const THUMBS_UP_BOOST = 15
const PROXIMITY_MAX = 30 // points at 0 mi, falling 1 pt/mi to 0 at 30 mi
const STRONG_STYLE_FIT = 20
const MILD_STYLE_FIT = 10

const STYLE_FIT: Record<Who, Partial<Record<SpotStyle, number>>> = {
  date: { omakase: STRONG_STYLE_FIT, 'nigiri bar': STRONG_STYLE_FIT },
  group: { rolls: STRONG_STYLE_FIT, conveyor: STRONG_STYLE_FIT },
  solo: {
    'nigiri bar': MILD_STYLE_FIT,
    conveyor: MILD_STYLE_FIT,
    takeout: MILD_STYLE_FIT,
  },
}

export type SavedReason = 'want_to_try' | 'liked' | null

export interface ScoredSpot {
  spot: Spot
  distanceMiles: number
  score: number
  savedReason: SavedReason
  /** True when the style is a good match for the "who" answer. */
  styleFits: boolean
}

export interface PickInput {
  spots: Spot[]
  saved: SavedPlace[]
  origin: LatLng
  budget: Budget
  who: Who
  where: Where
  /** Zero-based page of three. Wraps around when it runs past the last page. */
  page?: number
}

export interface PickResult {
  picks: ScoredSpot[]
  /** True when no spot fit the distance filter, so it was widened. */
  relaxed: boolean
  /** Number of candidate spots (after filters). */
  total: number
  /** The page actually returned (after wrapping). */
  page: number
  pageCount: number
}

function savedReasonFor(place: SavedPlace | undefined): SavedReason {
  if (place?.status === 'want_to_try') return 'want_to_try'
  if (place?.status === 'been' && place.verdict === 'up') return 'liked'
  return null
}

function score(
  distanceMiles: number,
  savedReason: SavedReason,
  styleBonus: number,
): number {
  const saved =
    savedReason === 'want_to_try'
      ? WANT_TO_TRY_BOOST
      : savedReason === 'liked'
        ? THUMBS_UP_BOOST
        : 0
  const proximity = Math.max(0, PROXIMITY_MAX - distanceMiles)
  return saved + proximity + styleBonus
}

/** Rank every spot that passes the budget filter and isn't thumbs-downed. */
function rank(input: PickInput): ScoredSpot[] {
  const savedById = new Map(input.saved.map((p) => [p.spotId, p]))
  const ranked: ScoredSpot[] = []
  for (const spot of input.spots) {
    if (spot.priceTier !== input.budget) continue
    const place = savedById.get(spot.id)
    if (place?.verdict === 'down') continue
    const distanceMiles = haversineMiles(input.origin, spot)
    const savedReason = savedReasonFor(place)
    const styleBonus = STYLE_FIT[input.who][spot.style] ?? 0
    ranked.push({
      spot,
      distanceMiles,
      savedReason,
      styleFits: styleBonus > 0,
      score: score(distanceMiles, savedReason, styleBonus),
    })
  }
  return ranked.sort(
    (a, b) =>
      b.score - a.score ||
      a.distanceMiles - b.distanceMiles ||
      a.spot.id.localeCompare(b.spot.id),
  )
}

export function pickSpots(input: PickInput): PickResult {
  const ranked = rank(input)
  const limit = MAX_MILES[input.where]
  let candidates = ranked.filter((c) => c.distanceMiles <= limit)
  let relaxed = false
  if (candidates.length === 0 && ranked.length > 0) {
    candidates = ranked
    relaxed = true
  }

  const pageCount = Math.max(1, Math.ceil(candidates.length / PAGE_SIZE))
  const requested = input.page ?? 0
  const page = ((requested % pageCount) + pageCount) % pageCount
  return {
    picks: candidates.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    relaxed,
    total: candidates.length,
    page,
    pageCount,
  }
}
