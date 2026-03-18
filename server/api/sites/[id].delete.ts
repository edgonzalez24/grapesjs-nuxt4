export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'id is required' })

  const supabase = useSupabase()
  const { error } = await supabase.from('sites').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
