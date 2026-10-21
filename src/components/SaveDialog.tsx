import { useId, useState, type SubmitEvent } from 'react'
import { buttonClass, inputClass } from './ui'
import { Dialog } from './Dialog'

interface Props {
  open: boolean
  spotName: string
  onSave: (recommendedBy: string) => Promise<void> | void
  onClose: () => void
}

function SaveForm({
  onSave,
  onClose,
}: {
  onSave: (recommendedBy: string) => Promise<void> | void
  onClose: () => void
}) {
  const [recommendedBy, setRecommendedBy] = useState('')
  const inputId = useId()

  const submit = (e: SubmitEvent) => {
    e.preventDefault()
    void Promise.resolve(onSave(recommendedBy)).then(onClose)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-muted">It'll go on your Want to try list.</p>
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="font-semibold">
          Who recommended it? <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id={inputId}
          className={inputClass}
          value={recommendedBy}
          maxLength={60}
          placeholder="e.g. Maya"
          onChange={(e) => {
            setRecommendedBy(e.target.value)
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

/** Save a spot as "Want to try", optionally noting who recommended it. */
export function SaveDialog({ open, spotName, onSave, onClose }: Props) {
  return (
    <Dialog open={open} title={`Save ${spotName}`} onClose={onClose}>
      <SaveForm onSave={onSave} onClose={onClose} />
    </Dialog>
  )
}
