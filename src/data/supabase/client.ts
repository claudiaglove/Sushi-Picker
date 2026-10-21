import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

export type Client = SupabaseClient<Database>

export function createSupabaseClient(url: string, key: string): Client {
  return createClient<Database>(url, key)
}

/** The signed-in user's id (from the locally stored session). Throws if nobody is signed in. */
export function createUserIdGetter(client: Client): () => Promise<string> {
  return async () => {
    const { data } = await client.auth.getSession()
    if (!data.session) throw new Error('Please sign in to continue.')
    return data.session.user.id
  }
}
