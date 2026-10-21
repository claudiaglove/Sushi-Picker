import { useDataContext } from '../context/DataContext'

export function useSettings() {
  const { settings, ready, saveSettings, clearAll } = useDataContext()
  return { settings, loading: !ready, saveSettings, clearAll }
}

/** Zip code -> coordinates, via the zip repository. */
export function useZipLookup() {
  const { lookupZip, nearestZip } = useDataContext()
  return { lookupZip, nearestZip }
}
