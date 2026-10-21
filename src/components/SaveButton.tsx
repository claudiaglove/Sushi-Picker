import { useState } from 'react'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import type { Spot } from '../types'
import { CheckIcon, BookmarkIcon } from './icons'
import { SaveDialog } from './SaveDialog'
import { buttonClass, type ButtonVariant } from './ui'

interface Props {
  spot: Spot
  variant?: ButtonVariant
  className?: string
}

/** Save-as-want-to-try button that flips to a "Saved"/"Been" status once the spot is on a list. */
export function SaveButton({ spot, variant = 'secondary', className = '' }: Props) {
  const { getSaved, saveAsWantToTry } = useSavedPlaces()
  const [open, setOpen] = useState(false)
  const existing = getSaved(spot.id)

  if (existing) {
    return (
      <span
        className={buttonClass('ghost', `cursor-default text-good ${className}`)}
        role="status"
      >
        <CheckIcon width={20} height={20} />
        {existing.status === 'been' ? 'Been' : 'Saved'}
      </span>
    )
  }

  return (
    <>
      <button
        type="button"
        className={buttonClass(variant, className)}
        onClick={() => {
          setOpen(true)
        }}
      >
        <BookmarkIcon width={20} height={20} />
        Save
      </button>
      <SaveDialog
        open={open}
        spotName={spot.name}
        onSave={(who) => saveAsWantToTry(spot.id, who)}
        onClose={() => {
          setOpen(false)
        }}
      />
    </>
  )
}
