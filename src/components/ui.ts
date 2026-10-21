export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line bg-surface text-ink hover:bg-soft',
  ghost: 'text-ink hover:bg-soft',
  danger: 'border border-bad bg-surface text-bad hover:bg-soft',
}

/** Class string for <button> and <a> so both look identical. All hit areas are >= 44px. */
export function buttonClass(variant: ButtonVariant = 'secondary', extra = ''): string {
  return `${base} ${variants[variant]} ${extra}`.trim()
}

export const inputClass =
  'min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2 text-base text-ink placeholder:text-muted'

export const cardClass = 'rounded-2xl border border-line bg-surface p-4 shadow-sm'
