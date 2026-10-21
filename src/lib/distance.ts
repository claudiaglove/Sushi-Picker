import type { LatLng } from '../types'

const EARTH_RADIUS_MILES = 3958.8

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

/** Straight-line (great-circle) distance in miles between two coordinates. */
export function haversineMiles(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2
  // Clamp guards against floating-point drift slightly above 1 near antipodes.
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.min(1, Math.sqrt(h)))
}
