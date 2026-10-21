import { Link, NavLink, Outlet } from 'react-router'
import { BookmarkIcon, GearIcon, SearchIcon, SparkleIcon } from './icons'

const tabs = [
  { to: '/', label: 'Pick', icon: SparkleIcon, end: true },
  { to: '/places', label: 'My places', icon: BookmarkIcon, end: false },
  { to: '/browse', label: 'Browse', icon: SearchIcon, end: false },
]

/** Header (with settings), centered content column, and thumb-friendly bottom tabs. */
export function AppShell() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col md:max-w-2xl lg:max-w-3xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/95 px-4 py-2 backdrop-blur">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2 rounded-lg text-lg font-extrabold tracking-tight"
        >
          <span aria-hidden="true" className="text-accent">
            ●
          </span>
          Sushi Picker
        </Link>
        <NavLink
          to="/settings"
          aria-label="Settings"
          className={({ isActive }) =>
            `flex size-11 items-center justify-center rounded-xl hover:bg-soft ${isActive ? 'text-accent' : ''}`
          }
        >
          <GearIcon />
        </NavLink>
      </header>

      <main className="flex-1 px-4 pt-5 pb-28">
        <Outlet />
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="m-0 mx-auto flex max-w-md list-none p-0 md:max-w-2xl lg:max-w-3xl">
          {tabs.map(({ to, label, icon: Icon, end }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-0.5 text-sm font-semibold ${
                    isActive ? 'text-accent' : 'text-muted hover:text-ink'
                  }`
                }
              >
                <Icon />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
