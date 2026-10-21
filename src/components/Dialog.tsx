import { useEffect, useId, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/** Modal built on native <dialog>: focus trap, Esc to close, and a labelled title for free. */
export function Dialog({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Backdrop click is a mouse nicety; keyboard users close with Esc (native) or Cancel.
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface p-0 text-ink shadow-xl"
    >
      {open && (
        <div className="flex flex-col gap-4 p-5">
          <h2 id={titleId} className="text-xl font-bold">
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
