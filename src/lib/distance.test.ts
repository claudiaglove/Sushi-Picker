import { describe, expect, it } from 'vitest'
import { haversineMiles } from './distance'

const sf = { lat: 37.7749, lng: -122.4194 }
const sanJose = { lat: 37.3382, lng: -121.8863 }
const oakland = { lat: 37.8044, lng: -122.2712 }

describe('haversineMiles', () => {
  it('is zero for identical points', () => {
    expect(haversineMiles(sf, sf)).toBe(0)
  })

  it('matches known distances (SF to San Jose is ~42 mi as the crow flies)', () => {
    expect(haversineMiles(sf, sanJose)).toBeGreaterThan(41)
    expect(haversineMiles(sf, sanJose)).toBeLessThan(43.5)
  })

  it('matches a short hop (SF to Oakland is ~8.4 mi)', () => {
    expect(haversineMiles(sf, oakland)).toBeCloseTo(8.4, 0)
  })

  it('is symmetric', () => {
    expect(haversineMiles(sf, oakland)).toBeCloseTo(haversineMiles(oakland, sf), 10)
  })

  it('handles one degree of latitude (~69 mi)', () => {
    const d = haversineMiles({ lat: 37, lng: -122 }, { lat: 38, lng: -122 })
    expect(d).toBeCloseTo(69.09, 1)
  })

  it('does not return NaN for antipodal points', () => {
    const d = haversineMiles({ lat: 0, lng: 0 }, { lat: 0, lng: 180 })
    expect(d).toBeCloseTo(Math.PI * 3958.8, 3)
  })
})
