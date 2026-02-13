// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  // 1. Await cookies as a promise
  const cookieStore = await cookies();

  // 2. Return a simple client without complex setAll logic for now
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Leave empty for now to rule out cookie-setting errors
        },
      },
    }
  )
}