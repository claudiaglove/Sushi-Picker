/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Leave unset to use local mock data. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase publishable (anon) key. Safe for browsers; access is enforced by RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
