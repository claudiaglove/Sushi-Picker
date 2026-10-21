import type { ReactNode } from 'react'

interface Props {
  title: string
  children?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, children, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      {children && <p className="max-w-xs text-muted">{children}</p>}
      {action}
    </div>
  )
}
