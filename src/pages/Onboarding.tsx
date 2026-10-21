import { Navigate, useNavigate } from 'react-router'
import { Loading } from '../components/Loading'
import { ZipForm } from '../components/ZipForm'
import { useSettings } from '../hooks/useSettings'

export function Onboarding() {
  const { settings, loading } = useSettings()
  const navigate = useNavigate()

  if (loading) return <Loading />
  if (settings) return <Navigate to="/" replace />

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-8 px-4 py-10">
      <div className="flex flex-col gap-3">
        <p aria-hidden="true" className="text-5xl">
          🍣
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Sushi Picker</h1>
        <p className="text-lg text-muted">
          Too many options? Answer three quick questions and get one confident sushi pick
          in the SF Bay Area, in under 30 seconds.
        </p>
      </div>
      <ZipForm
        submitLabel="Let's go"
        showLocationButton
        onDone={() => {
          void navigate('/', { replace: true })
        }}
      />
      <p className="text-sm text-muted">
        Your zip code stays on this device. It's only used to work out how far each spot
        is.
      </p>
    </div>
  )
}
