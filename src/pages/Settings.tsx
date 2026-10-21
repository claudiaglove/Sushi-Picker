import { useState } from 'react'
import { ConfirmDialog } from '../components/PlaceDialogs'
import { ZipForm } from '../components/ZipForm'
import { buttonClass, cardClass } from '../components/ui'
import { Loading } from '../components/Loading'
import { useAuth } from '../hooks/useAuth'
import { useSettings } from '../hooks/useSettings'

export function Settings() {
  const { settings, clearAll, loading } = useSettings()
  const { user, signOut } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [saved, setSaved] = useState(false)

  if (loading || !settings) return <Loading />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>

      {user?.email && (
        <section
          className={`${cardClass} flex flex-col gap-3`}
          aria-labelledby="account-heading"
        >
          <h2 id="account-heading" className="text-lg font-bold">
            Account
          </h2>
          <p className="text-muted">
            Signed in as <strong className="break-all text-ink">{user.email}</strong>
          </p>
          <button
            type="button"
            className={buttonClass('secondary')}
            onClick={() => {
              void signOut()
            }}
          >
            Sign out
          </button>
        </section>
      )}

      <section
        className={`${cardClass} flex flex-col gap-3`}
        aria-labelledby="zip-heading"
      >
        <h2 id="zip-heading" className="text-lg font-bold">
          Location
        </h2>
        <p className="text-muted">
          Distances are measured from{' '}
          <strong className="text-ink">{settings.zipCode}</strong>.
        </p>
        <ZipForm
          key={settings.zipCode}
          initialZip={settings.zipCode}
          submitLabel="Update zip code"
          showLocationButton
          onDone={() => {
            setSaved(true)
          }}
        />
        {saved && (
          <p role="status" className="font-semibold text-good">
            Zip code updated.
          </p>
        )}
      </section>

      <section
        className={`${cardClass} flex flex-col gap-3`}
        aria-labelledby="data-heading"
      >
        <h2 id="data-heading" className="text-lg font-bold">
          Saved data
        </h2>
        <p className="text-muted">
          Your lists and zip code are saved to your account. Clearing removes all of them;
          you'll stay signed in.
        </p>
        <button
          type="button"
          className={buttonClass('danger')}
          onClick={() => {
            setConfirming(true)
          }}
        >
          Clear saved data
        </button>
      </section>

      <ConfirmDialog
        open={confirming}
        title="Clear all saved data?"
        message="This removes your Want to try and Been lists and your zip code. You'll start over from the welcome screen."
        confirmLabel="Clear everything"
        onClose={() => {
          setConfirming(false)
        }}
        onConfirm={() => {
          void clearAll()
        }}
      />
    </div>
  )
}
