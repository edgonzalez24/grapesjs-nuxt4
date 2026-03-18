export interface Website {
  id: string
  name: string
  created_at: string
  // Keep camelCase alias for view compatibility
  createdAt?: string
}

// Normalize DB row → view-friendly object
function normalize(site: Website): Website {
  return { ...site, createdAt: site.created_at }
}

export function useWebsites() {
  const sites = ref<Website[]>([])

  async function refresh() {
    const data = await $fetch<Website[]>('/api/sites')
    sites.value = data.map(normalize)
  }

  async function createSite(name: string): Promise<Website> {
    const data = await $fetch<Website>('/api/sites', {
      method: 'POST',
      body: { name },
    })
    await refresh()
    return normalize(data)
  }

  async function deleteSite(siteId: string) {
    await $fetch(`/api/sites/${siteId}`, { method: 'DELETE' })
    await refresh()
  }

  function getSite(siteId: string): Website | undefined {
    return sites.value.find((s) => s.id === siteId)
  }

  return { sites, refresh, createSite, deleteSite, getSite }
}
