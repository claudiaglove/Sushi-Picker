import { describe, expect, it } from 'vitest'
import type { SavedPlace, Spot } from '../types'
import { reasonLine } from './format'
import { pickSpots, type PickInput } from './pick'

const origin = { lat: 37.7749, lng: -122.4194 } // downtown SF

function spot(id: string, over: Partial<Spot> = {}): Spot {
  return {
    id,
    name: id,
    city: 'San Francisco',
    region: 'SF',
    lat: 37.7749,
    lng: -122.4194,
    priceTier: 'mid',
    style: 'nigiri bar',
    address: '1 Test St',
    mapsUrl: 'https://example.com',
    ...over,
  }
}

// ~0.0145 deg lat ≈ 1 mi
const milesNorth = (mi: number) => ({ lat: 37.7749 + mi * 0.01447, lng: -122.4194 })

function saved(spotId: string, over: Partial<SavedPlace> = {}): SavedPlace {
  return {
    spotId,
    status: 'want_to_try',
    verdict: null,
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...over,
  }
}

function input(over: Partial<PickInput>): PickInput {
  return {
    spots: [],
    saved: [],
    origin,
    budget: 'mid',
    who: 'solo',
    where: 'anywhere',
    ...over,
  }
}

const ids = (r: ReturnType<typeof pickSpots>) => r.picks.map((p) => p.spot.id)

describe('pickSpots filters', () => {
  it('keeps only spots matching the budget', () => {
    const spots = [
      spot('a', { priceTier: 'casual' }),
      spot('b', { priceTier: 'mid' }),
      spot('c', { priceTier: 'omakase' }),
    ]
    expect(ids(pickSpots(input({ spots, budget: 'mid' })))).toEqual(['b'])
  })

  it('applies the distance filter', () => {
    const spots = [
      spot('close', milesNorth(2)),
      spot('medium', milesNorth(10)),
      spot('far', milesNorth(30)),
    ]
    expect(ids(pickSpots(input({ spots, where: 'near' })))).toEqual(['close'])
    expect(ids(pickSpots(input({ spots, where: 'mid' })))).toEqual(['close', 'medium'])
    expect(ids(pickSpots(input({ spots, where: 'anywhere' })))).toEqual([
      'close',
      'medium',
      'far',
    ])
  })

  it('excludes thumbs-down spots', () => {
    const spots = [spot('a'), spot('b')]
    const result = pickSpots(
      input({ spots, saved: [saved('a', { status: 'been', verdict: 'down' })] }),
    )
    expect(ids(result)).toEqual(['b'])
  })
})

describe('pickSpots scoring', () => {
  it('prefers closer spots when all else is equal', () => {
    const spots = [spot('far', milesNorth(12)), spot('near', milesNorth(1))]
    expect(ids(pickSpots(input({ spots })))).toEqual(['near', 'far'])
  })

  it('gives want-to-try a big boost over a closer unsaved spot', () => {
    const spots = [spot('near', milesNorth(1)), spot('wanted', milesNorth(14))]
    const result = pickSpots(input({ spots, saved: [saved('wanted')] }))
    expect(ids(result)[0]).toBe('wanted')
    expect(result.picks[0]?.savedReason).toBe('want_to_try')
  })

  it('gives thumbs-up a small boost: beats a similar spot, loses to want-to-try', () => {
    const spots = [
      spot('plain', milesNorth(3)),
      spot('liked', milesNorth(5)),
      spot('wanted', milesNorth(8)),
    ]
    const result = pickSpots(
      input({
        spots,
        saved: [saved('liked', { status: 'been', verdict: 'up' }), saved('wanted')],
      }),
    )
    expect(ids(result)).toEqual(['wanted', 'liked', 'plain'])
  })

  it('does not boost a been spot without a verdict', () => {
    const spots = [spot('near', milesNorth(1)), spot('meh', milesNorth(6))]
    const result = pickSpots(
      input({ spots, saved: [saved('meh', { status: 'been', verdict: null })] }),
    )
    expect(ids(result)).toEqual(['near', 'meh'])
  })

  it('favors omakase / nigiri bar for a date', () => {
    const spots = [
      spot('rolls', { ...milesNorth(1), style: 'rolls' }),
      spot('nigiri', { ...milesNorth(3), style: 'nigiri bar' }),
    ]
    const result = pickSpots(input({ spots, who: 'date' }))
    expect(ids(result)).toEqual(['nigiri', 'rolls'])
    expect(result.picks[0]?.styleFits).toBe(true)
  })

  it('favors rolls / conveyor for a group', () => {
    const spots = [
      spot('nigiri', { ...milesNorth(1), style: 'nigiri bar' }),
      spot('conveyor', { ...milesNorth(3), style: 'conveyor' }),
    ]
    expect(ids(pickSpots(input({ spots, who: 'group' })))[0]).toBe('conveyor')
  })

  it('is deterministic for exact ties (by id)', () => {
    const spots = [spot('b'), spot('a')]
    expect(ids(pickSpots(input({ spots })))).toEqual(['a', 'b'])
  })
})

describe('pickSpots paging', () => {
  const many = Array.from({ length: 7 }, (_, i) => spot(`s${i}`, milesNorth(i + 1)))

  it('returns the top three on page 0', () => {
    const result = pickSpots(input({ spots: many }))
    expect(ids(result)).toEqual(['s0', 's1', 's2'])
    expect(result.pageCount).toBe(3)
    expect(result.total).toBe(7)
  })

  it('moves to the next three, then the remainder', () => {
    expect(ids(pickSpots(input({ spots: many, page: 1 })))).toEqual(['s3', 's4', 's5'])
    expect(ids(pickSpots(input({ spots: many, page: 2 })))).toEqual(['s6'])
  })

  it('wraps around past the last page', () => {
    const result = pickSpots(input({ spots: many, page: 3 }))
    expect(result.page).toBe(0)
    expect(ids(result)).toEqual(['s0', 's1', 's2'])
  })
})

describe('pickSpots relaxation', () => {
  it('relaxes the distance filter when nothing is close enough and says so', () => {
    const spots = [spot('far', milesNorth(40))]
    const result = pickSpots(input({ spots, where: 'near' }))
    expect(result.relaxed).toBe(true)
    expect(ids(result)).toEqual(['far'])
  })

  it('does not flag relaxation when something fits', () => {
    const spots = [spot('close', milesNorth(1)), spot('far', milesNorth(40))]
    const result = pickSpots(input({ spots, where: 'near' }))
    expect(result.relaxed).toBe(false)
    expect(ids(result)).toEqual(['close'])
  })

  it('never relaxes budget: returns nothing if no spot matches it', () => {
    const spots = [spot('a', { priceTier: 'casual' })]
    const result = pickSpots(input({ spots, budget: 'omakase' }))
    expect(result.picks).toEqual([])
    expect(result.relaxed).toBe(false)
    expect(result.total).toBe(0)
  })
})

describe('reasonLine', () => {
  it('builds the one-line reason', () => {
    const spots = [spot('a', milesNorth(4.2))]
    const result = pickSpots(input({ spots, saved: [saved('a')] }))
    const first = result.picks[0]
    if (!first) throw new Error('expected a pick')
    expect(reasonLine(first)).toBe(
      'Mid-priced nigiri bar, 4.2 mi away, on your want-to-try list',
    )
  })
})
