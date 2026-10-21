import { useId } from 'react'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  legend: string
  options: Option<T>[]
  value: T | null
  onChange: (value: T) => void
}

/** Single-tap segmented question built from real radio inputs (keyboard + screen-reader friendly). */
export function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: Props<T>) {
  const name = useId()
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-2 text-lg font-bold">{legend}</legend>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative block">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => {
                onChange(option.value)
              }}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span className="flex min-h-14 items-center justify-center rounded-xl border-2 border-line bg-surface px-2 py-2 text-center text-[15px] leading-tight font-semibold peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-ink peer-hover:bg-soft peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:text-base">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
