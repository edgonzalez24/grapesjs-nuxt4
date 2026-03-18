export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'id is required' })

  const supabase = useSupabase()
  const { data, error } = await supabase
    .from('site_content')
    .select('html, css, gjson')
    .eq('site_id', id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Return empty defaults when no content has been saved yet
  return data ?? { html: '', css: '', gjson: null }
})
