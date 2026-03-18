export default defineEventHandler(async () => {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
