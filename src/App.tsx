import { Navigate, Outlet, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell'
import { Loading } from './components/Loading'
import { useSettings } from './hooks/useSettings'
import { Browse } from './pages/Browse'
import { MyPlaces } from './pages/MyPlaces'
import { Onboarding } from './pages/Onboarding'
import { Pick } from './pages/Pick'
import { Result } from './pages/Result'
import { Settings } from './pages/Settings'

/** Everything except onboarding needs a saved zip code. */
function RequireSettings() {
  const { settings, loading } = useSettings()
  if (loading) return <Loading />
  if (!settings) return <Navigate to="/welcome" replace />
  return <Outlet />
}

export function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Onboarding />} />
      <Route element={<RequireSettings />}>
        <Route element={<AppShell />}>
          <Route index element={<Pick />} />
          <Route path="result" element={<Result />} />
          <Route path="places" element={<MyPlaces />} />
          <Route path="browse" element={<Browse />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
