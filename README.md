# Sushi Picker

Mobile-first web app that takes a sushi lover in the SF Bay Area from "I want sushi" to one confident pick in under 30 seconds. Front end only for now: all data comes from a local JSON file and `localStorage`, behind interfaces that a Supabase implementation will replace later.

Stack: React 19, TypeScript (strict), Vite, React Router, Tailwind CSS v4, Vitest, ESLint, Prettier.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script                 | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm test`             | Vitest unit tests (distance + pick logic) |
| `npm run lint`         | ESLint (type-aware, jsx-a11y, hooks)      |
| `npm run typecheck`    | `tsc -b`                                  |
| `npm run format:check` | Prettier check (`npm run format` to fix)  |
| `npm run build`        | Typecheck + production build into `dist/` |

## How it's organized

```
src/
  types.ts                 Spot, SavedPlace, UserSettings (+ answer types)
  data/
    repositories.ts        The interfaces the UI depends on
    index.ts               createRepositories(): the one place data sources are chosen
    supabase/              Supabase client + repositories + generated types
    mock/                  spots.json + localStorage implementations (offline fallback)
    zipCentroids.json      Bay Area zip -> lat/lng (approximate centroids)
    zipLookup.ts           Bundled ZipRepository
  context/DataProvider.tsx Loads data through the repositories, shares it with hooks
  hooks/                   useSpots(), useSavedPlaces(), useSettings(), ...
  lib/                     Pure, tested logic: distance.ts (haversine), pick.ts, format.ts
  components/, pages/      UI. Never import mock data or localStorage.
```

The "components never touch data directly" rule is enforced by ESLint (`no-restricted-imports` / `no-restricted-globals` in `eslint.config.js`).

## Supabase

The app talks to Supabase when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (copy `.env.example` to `.env.local`). With them unset it falls back to the local mock data, so it still runs offline.

- **Schema:** `supabase/migrations/20261008000000_init_sushi_picker.sql` (already applied to the project). `spots` is public read-only; `saved_places` and `user_settings` are private per user via row-level security; `updated_at` is stamped by a trigger.
- **Auth:** email + password. A signed-out visitor sees the login screen (`src/pages/Login.tsx`, gated by `AuthGate`); Settings shows the account and a Sign out button. If "Confirm email" is on in the Supabase dashboard, sign-up shows a "check your inbox" message; if it's off, sign-up signs the user in right away. Without the env vars (offline fallback) there is no login screen.
- **Redirect URLs:** if you turn "Confirm email" back on, set Authentication → URL Configuration → Site URL to your app's URL (`http://localhost:5173` in dev) and add your production URL when you deploy, or the confirmation link goes to the wrong place.
- **Code:** `src/data/supabase/` holds the client, the auth/spot/saved-place/settings repositories and the generated `database.types.ts`. The only wiring is in `createRepositories()` in `src/data/index.ts`; the UI reaches auth through `useAuth()` and data through the existing hooks.
- The first migration's header comment mentions anonymous users; that was the earlier plan. The tables and RLS policies are unchanged by the switch to email login (`authenticated` role, rows owned via `auth.uid()`).
- Not built yet: password reset, email change, account deletion.
- The key is the publishable/anon key, which is meant for browsers; RLS is what protects data. Never put the `service_role` key in this app.

## Notes

- The 20 spots in `src/data/mock/spots.json` are fictional placeholders. Their `mapsUrl` is a plain Google Maps search link by coordinates (no API calls).
- `zipCentroids.json` holds approximate centroids for ~190 common Bay Area zips. They're fine for straight-line distance, but replace them with an official dataset if you need precision or wider coverage.
- "Clear saved data" in Settings wipes your lists and zip code (you stay signed in) and returns you to onboarding.
