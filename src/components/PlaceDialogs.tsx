import { useId, useState, type SubmitEvent } from 'react'
import type { SavedPlace, Verdict } from '../types'
import { Dialog } from './Dialog'
import { ThumbDownIcon, ThumbUpIcon } from './icons'
import { buttonClass, inputClass } from './ui'

export function VerdictDialog({
  open,
  spotName,
  onChoose,
  onClose,
}: {
  open: boolean
  spotName: string
  onChoose: (verdict: Verdict) => void
  onClose: () => void
}) {
  return (
    <Dialog open={open} title={`How was ${spotName}?`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={buttonClass('secondary', 'min-h-16 flex-col')}
          onClick={() => {
            onChoose('up')
          }}
        >
          <ThumbUpIcon />
          Thumbs up
        </button>
        <button
          type="button"
          className={buttonClass('secondary', 'min-h-16 flex-col')}
          onClick={() => {
            onChoose('down')
          }}
        >
          <ThumbDownIcon />
          Thumbs down
        </button>
      </div>
      <button
        type="button"
        className={buttonClass('ghost')}
        onClick={() => {
          onChoose(null)
        }}
      >
        Just mark as been
      </button>
      <button type="button" className={buttonClass('ghost')} onClick={onClose}>
        Cancel
      </button>
    </Dialog>
  )
}

interface EditDetails {
  note: string
  recommendedBy: string
}

/** Mounted only while the dialog is open, so its fields always start from the saved values. */
function EditForm({
  place,
  onSave,
  onClose,
}: {
  place: SavedPlace
  onSave: (details: EditDetails) => void
  onClose: () => void
}) {
  const [note, setNote] = useState(place.note ?? '')
  const [recommendedBy, setRecommendedBy] = useState(place.recommendedBy ?? '')
  const noteId = useId()
  const whoId = useId()

  const submit = (e: SubmitEvent) => {
    e.preventDefault()
    onSave({ note, recommendedBy })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor={whoId} className="font-semibold">
          Who recommended it?
        </label>
        <input
          id={whoId}
          className={inputClass}
          value={recommendedBy}
          maxLength={60}
          onChange={(e) => {
            setRecommendedBy(e.target.value)
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={noteId} className="font-semibold">
          Note
        </label>
        <textarea
          id={noteId}
          className={`${inputClass} min-h-24`}
          value={note}
          maxLength={280}
          onChange={(e) => {
            setNote(e.target.value)
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={buttonClass('secondary', 'flex-1')}
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className={buttonClass('primary', 'flex-1')}>
          Save
        </button>
      </div>
    </form>
  )
}

export function EditDialog({
  open,
  place,
  spotName,
  onSave,
  onClose,
}: {
  open: boolean
  place: SavedPlace
  spotName: string
  onSave: (details: EditDetails) => void
  onClose: () => void
}) {
  return (
    <Dialog open={open} title={`Edit ${spotName}`} onClose={onClose}>
      <EditForm place={place} onSave={onSave} onClose={onClose} />
    </Dialog>
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Dialog open={open} title={title} onClose={onClose}>
      <p className="text-muted">{message}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className={buttonClass('secondary', 'flex-1')}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className={buttonClass('danger', 'flex-1')}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}
