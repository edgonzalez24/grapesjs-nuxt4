import { createClient } from '@supabase/supabase-js'

export function useSupabase() {
  const config = useRuntimeConfig()
  return createClient(config.public.supabaseUrl as string, config.public.supabaseKey as string)
}
