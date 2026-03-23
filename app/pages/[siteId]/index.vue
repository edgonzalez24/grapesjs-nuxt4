<template>
  <div class="preview-page">
    <!-- Toolbar -->
    <header class="preview-toolbar">
      <div class="toolbar-left">
        <span class="logo-icon">🎨</span>
        <span class="toolbar-title">{{ siteName }}</span>
        <span class="preview-badge">{{ t('preview.live') }}</span>
      </div>
      <div class="toolbar-right">
        <LanguageSelector />
        <div class="divider-v" />
        <button class="btn-edit" @click="goEdit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          {{ t('preview.edit') }}
        </button>
        <button class="btn-back" @click="goHome">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {{ t('preview.dashboard') }}
        </button>
      </div>
    </header>

    <!-- Canvas -->
    <div class="preview-canvas">
      <div v-if="!hasContent" class="empty-state">
        <div class="empty-icon">📄</div>
        <h2>{{ t('preview.noContent') }}</h2>
        <p>{{ t('preview.noContentSubtitle') }}</p>
        <button class="btn-primary" @click="goEdit">{{ t('preview.openEditor') }}</button>
      </div>

      <div v-if="hasContent" class="preview-content" v-html="previewHtml" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const siteId = computed(() => route.params.siteId as string)

// SSR: fetch site content on the server
const { data: content } = await useAsyncData(
  `site-content-${siteId.value}`,
  () => $fetch<{ html: string; css: string; gjson: unknown }>(`/api/sites/${siteId.value}/content`),
  { default: () => ({ html: '', css: '', gjson: null }) }
)

// Also fetch site metadata (name) server-side
const { data: site } = await useAsyncData(
  `site-meta-${siteId.value}`,
  () => $fetch<{ id: string; name: string }>(`/api/sites/${siteId.value}`).catch(() => null)
)

const siteName = computed(() => site.value?.name ?? siteId.value)

const previewHtml = computed(() => {
  if (!content.value?.html) return ''
  return `<style>${content.value.css}</style>${content.value.html}`
})

const hasContent = computed(() => previewHtml.value.trim().length > 0)

// Dynamic SEO meta
const url = useRequestURL()

useSeoMeta({
  title: () => siteName.value,
  description: () => t('preview.seoDescription', { siteName: siteName.value }),
  // OG
  ogTitle: () => siteName.value,
  ogDescription: () => t('preview.seoDescription', { siteName: siteName.value }),
  ogImage: `${url.origin}/og-image.png`,
  ogUrl: () => url.href,
  ogType: 'website',
  // Twitter
  twitterCard: 'summary_large_image',
  twitterTitle: () => siteName.value,
  twitterDescription: () => t('preview.seoDescription', { siteName: siteName.value }),
  twitterImage: `${url.origin}/og-image.png`,
})

function goEdit() {
  router.push(`/${siteId.value}/edit`)
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.preview-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f0f2f8;
}

/* Toolbar */
.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 22px;
  filter: drop-shadow(0 0 8px rgba(108, 99, 255, 0.5));
}

.toolbar-title {
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}

.preview-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: rgba(52, 211, 153, 0.15);
  color: var(--color-success);
  padding: 2px 8px;
  border-radius: 100px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider-v {
  width: 1px;
  height: 20px;
  background: var(--color-border);
  margin: 0 4px;
}

.btn-edit,
.btn-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.btn-back:hover {
  background: var(--color-surface-2);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Canvas */
.preview-canvas {
  flex: 1;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-content {
  width: 100%;
  max-width: 1200px;
  background: white;
  box-shadow: var(--shadow);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 80px 24px;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 8px;
  filter: grayscale(0.5);
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
}

.empty-state p {
  font-size: 15px;
  max-width: 320px;
}

.btn-primary {
  margin-top: 8px;
  padding: 10px 22px;
  background: linear-gradient(135deg, var(--color-accent), #a78bfa);
  border: none;
  border-radius: var(--radius);
  color: white;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.85;
}
</style>
