export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'id is required' })

  const supabase = useSupabase()
  const { data, error } = await supabase
    .from('sites')
    .select('id, name, slug, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, message: error.message })
  if (!data) throw createError({ statusCode: 404, message: 'Site not found' })

  return data
})
