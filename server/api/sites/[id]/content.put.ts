interface ContentBody {
  html?: string
  css?: string
  gjson?: unknown
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'id is required' })

  const body = await readBody<ContentBody>(event)

  const supabase = useSupabase()
  const { error } = await supabase.from('site_content').upsert({
    site_id: id,
    html: body.html ?? '',
    css: body.css ?? '',
    gjson: body.gjson ?? null,
    updated_at: new Date().toISOString(),
  })

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { success: true }
})
