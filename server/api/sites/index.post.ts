function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string }>(event)
  if (!body?.name?.trim()) {
    throw createError({ statusCode: 400, message: 'name is required' })
  }

  const supabase = useSupabase()
  const base = slugify(body.name) || 'website'

  // Get existing slugs to guarantee uniqueness
  const { data: existing } = await supabase
    .from('sites')
    .select('id')
    .like('id', `${base}%`)

  const existingIds = new Set((existing ?? []).map((s: { id: string }) => s.id))
  let slug = base
  let counter = 2
  while (existingIds.has(slug)) {
    slug = `${base}-${counter++}`
  }

  const { data, error } = await supabase
    .from('sites')
    .insert({ id: slug, name: body.name.trim() })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
