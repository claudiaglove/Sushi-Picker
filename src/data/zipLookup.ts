import { haversineMiles } from '../lib/distance'
import centroids from './zipCentroids.json'
import type { ZipRepository } from './repositories'

const table: Record<string, { lat: number; lng: number }> = centroids

/** Bundled Bay Area zip centroids. Swap for a table/API if coverage needs to grow. */
export const bundledZipRepository: ZipRepository = {
  lookup(zip) {
    return Promise.resolve(table[zip.trim()] ?? null)
  },
  nearest(lat, lng) {
    let best: string | null = null
    let bestMiles = Infinity
    for (const [zip, c] of Object.entries(table)) {
      const miles = haversineMiles({ lat, lng }, c)
      if (miles < bestMiles) {
        best = zip
        bestMiles = miles
      }
    }
    // More than ~50 mi from any known zip: not in the Bay Area.
    return Promise.resolve(bestMiles <= 50 ? best : null)
  },
}
