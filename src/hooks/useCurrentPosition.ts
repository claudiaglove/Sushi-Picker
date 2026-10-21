import { useCallback } from 'react'
import type { LatLng } from '../types'

/** Wraps the browser Geolocation API. Rejects with a user-friendly Error message. */
export function useCurrentPosition() {
  return useCallback(
    () =>
      new Promise<LatLng>((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(
            new Error("Your browser can't share its location. Enter a zip code instead."),
          )
          return
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          },
          (err) => {
            reject(
              new Error(
                err.code === err.PERMISSION_DENIED
                  ? 'Location permission was denied. Enter a zip code instead.'
                  : "Couldn't get your location. Enter a zip code instead.",
              ),
            )
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
        )
      }),
    [],
  )
}
