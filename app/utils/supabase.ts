import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#app'

export function useSupabase() {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing from runtime configuration.')
  }

  return createClient(supabaseUrl as string, supabaseKey as string)
}
