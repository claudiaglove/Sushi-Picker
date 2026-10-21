import { useState } from 'react'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import { formatMiles } from '../lib/format'
import type { SavedPlace, Spot } from '../types'
import { ThumbDownIcon, ThumbUpIcon } from './icons'
import { ConfirmDialog, EditDialog, VerdictDialog } from './PlaceDialogs'
import { buttonClass, cardClass } from './ui'

interface Props {
  place: SavedPlace
  spot: Spot
  miles: number | null
}

type Open = 'verdict' | 'edit' | 'remove' | null

export function PlaceItem({ place, spot, miles }: Props) {
  const { markBeen, editDetails, remove } = useSavedPlaces()
  const [open, setOpen] = useState<Open>(null)
  const close = () => {
    setOpen(null)
  }
  const isBeen = place.status === 'been'

  return (
    <li className={`${cardClass} flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold">{spot.name}</h3>
          <p className="text-muted">
            {spot.city}
            {miles !== null && ` · ${formatMiles(miles)}`}
          </p>
        </div>
        {place.verdict && (
          <span
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
              place.verdict === 'up' ? 'text-good' : 'text-bad'
            } bg-soft`}
          >
            {place.verdict === 'up' ? (
              <ThumbUpIcon width={18} height={18} />
            ) : (
              <ThumbDownIcon width={18} height={18} />
            )}
            {place.verdict === 'up' ? 'Loved it' : 'Skip next time'}
          </span>
        )}
      </div>

      {place.recommendedBy && (
        <p>
          <span className="text-muted">Recommended by</span> {place.recommendedBy}
        </p>
      )}
      {place.note && <p className="rounded-lg bg-soft p-2">{place.note}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass(isBeen ? 'secondary' : 'primary', 'flex-1')}
          onClick={() => {
            setOpen('verdict')
          }}
        >
          {isBeen ? 'Change verdict' : 'Mark as been'}
        </button>
        <button
          type="button"
          className={buttonClass('secondary')}
          onClick={() => {
            setOpen('edit')
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className={buttonClass('ghost', 'text-bad')}
          onClick={() => {
            setOpen('remove')
          }}
        >
          Remove
        </button>
      </div>

      <VerdictDialog
        open={open === 'verdict'}
        spotName={spot.name}
        onClose={close}
        onChoose={(verdict) => {
          void markBeen(place, verdict).then(close)
        }}
      />
      <EditDialog
        open={open === 'edit'}
        place={place}
        spotName={spot.name}
        onClose={close}
        onSave={(details) => {
          void editDetails(place, details).then(close)
        }}
      />
      <ConfirmDialog
        open={open === 'remove'}
        title={`Remove ${spot.name}?`}
        message="It'll come off your lists. You can always save it again from Browse."
        confirmLabel="Remove"
        onClose={close}
        onConfirm={() => {
          void remove(place.spotId).then(close)
        }}
      />
    </li>
  )
}
