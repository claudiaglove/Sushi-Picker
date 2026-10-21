import { useId, useState, type SubmitEvent } from 'react'
import { buttonClass, inputClass } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

type Mode = 'signIn' | 'signUp'

const MODES: { value: Mode; label: string }[] = [
  { value: 'signIn', label: 'Sign in' },
  { value: 'signUp', label: 'Create account' },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 6

export function Login() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('signIn')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const firstNameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const errorId = useId()

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()
    setNotice(null)
    const cleanFirstName = firstName.trim()
    const cleanEmail = email.trim()
    if (mode === 'signUp' && cleanFirstName === '') {
      setError('Please enter your first name.')
      return
    }
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < MIN_PASSWORD) {
      setError(`Your password needs at least ${String(MIN_PASSWORD)} characters.`)
      return
    }
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signIn') {
        await signIn(cleanEmail, password)
      } else {
        const { needsEmailConfirmation } = await signUp(
          cleanEmail,
          password,
          cleanFirstName,
        )
        if (needsEmailConfirmation) {
          setMode('signIn')
          setPassword('')
          setNotice(
            `We sent a confirmation link to ${cleanEmail}. Click it, then sign in here.`,
          )
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-10">
      <div className="flex flex-col gap-3">
        <p aria-hidden="true" className="text-5xl">
          🍣
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Sushi Picker</h1>
        <p className="text-lg text-muted">
          Sign in to keep your want-to-try list and verdicts, and pick up where you left
          off on any device.
        </p>
      </div>

      <div
        role="group"
        aria-label="Sign in or create account"
        className="grid grid-cols-2 gap-1 rounded-xl bg-soft p-1"
      >
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-pressed={mode === m.value}
            onClick={() => {
              setMode(m.value)
              setError(null)
              setNotice(null)
            }}
            className={`min-h-11 rounded-lg px-3 font-semibold ${
              mode === m.value
                ? 'bg-surface text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          void submit(e)
        }}
        className="flex flex-col gap-4"
      >
        {mode === 'signUp' && (
          <div className="flex flex-col gap-1">
            <label htmlFor={firstNameId} className="font-semibold">
              First name
            </label>
            <input
              id={firstNameId}
              type="text"
              className={`${inputClass} aria-[invalid=true]:border-bad`}
              autoComplete="given-name"
              maxLength={50}
              value={firstName}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(e) => {
                setFirstName(e.target.value)
              }}
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor={emailId} className="font-semibold">
            Email
          </label>
          <input
            id={emailId}
            type="email"
            className={`${inputClass} aria-[invalid=true]:border-bad`}
            autoComplete="email"
            inputMode="email"
            value={email}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={passwordId} className="font-semibold">
            Password
          </label>
          <input
            id={passwordId}
            type="password"
            className={`${inputClass} aria-[invalid=true]:border-bad`}
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            value={password}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          {mode === 'signUp' && (
            <p className="text-sm text-muted">At least {MIN_PASSWORD} characters.</p>
          )}
        </div>

        <p id={errorId} role="alert" className="min-h-6 text-bad">
          {error}
        </p>
        {notice && (
          <p role="status" className="rounded-xl bg-accent-soft p-3 font-semibold">
            {notice}
          </p>
        )}

        <button
          type="submit"
          className={buttonClass('primary', 'min-h-14 text-lg')}
          disabled={busy}
        >
          {busy ? 'One moment…' : mode === 'signIn' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
