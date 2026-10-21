import { useId, useState, type SubmitEvent } from 'react'
import { useCurrentPosition } from '../hooks/useCurrentPosition'
import { useSettings, useZipLookup } from '../hooks/useSettings'
import { PinIcon } from './icons'
import { buttonClass, inputClass } from './ui'

interface Props {
  initialZip?: string
  submitLabel: string
  showLocationButton?: boolean
  onDone?: () => void
}

const ZIP_PATTERN = /^\d{5}$/

/** Zip entry (plus optional geolocation) shared by onboarding and settings. */
export function ZipForm({
  initialZip = '',
  submitLabel,
  showLocationButton = false,
  onDone,
}: Props) {
  const { saveSettings } = useSettings()
  const { lookupZip, nearestZip } = useZipLookup()
  const getPosition = useCurrentPosition()
  const [zip, setZip] = useState(initialZip)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const inputId = useId()
  const errorId = useId()

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()
    const value = zip.trim()
    if (!ZIP_PATTERN.test(value)) {
      setError('Please enter a 5-digit zip code.')
      return
    }
    setBusy(true)
    const coords = await lookupZip(value)
    if (!coords) {
      setBusy(false)
      setError(
        "We don't have that zip code yet. Sushi Picker covers the SF Bay Area, so try a nearby one.",
      )
      return
    }
    await saveSettings({ zipCode: value, ...coords })
    setBusy(false)
    setError(null)
    onDone?.()
  }

  const locate = async () => {
    setBusy(true)
    setError(null)
    try {
      const coords = await getPosition()
      const nearest = await nearestZip(coords.lat, coords.lng)
      if (!nearest) {
        setError(
          'You seem to be outside the Bay Area. Enter a Bay Area zip code instead.',
        )
        return
      }
      await saveSettings({ zipCode: nearest, ...coords })
      onDone?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't get your location.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        void submit(e)
      }}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-lg font-bold">
          Your zip code
        </label>
        <input
          id={inputId}
          className={`${inputClass} text-xl tracking-widest aria-[invalid=true]:border-bad`}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="94103"
          value={zip}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, ''))
            setError(null)
          }}
        />
        <p id={errorId} role="alert" className="min-h-6 text-bad">
          {error}
        </p>
      </div>
      <button type="submit" className={buttonClass('primary')} disabled={busy}>
        {submitLabel}
      </button>
      {showLocationButton && (
        <button
          type="button"
          className={buttonClass('secondary')}
          disabled={busy}
          onClick={() => {
            void locate()
          }}
        >
          <PinIcon width={20} height={20} />
          Use my current location
        </button>
      )}
    </form>
  )
}
