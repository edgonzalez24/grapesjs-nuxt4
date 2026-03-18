<template>
  <div class="dashboard">

    <!-- Header -->
    <header class="dash-header">
      <div class="brand">
        <span class="brand-icon">🎨</span>
        <span class="brand-name">Page Builder</span>
        <span class="brand-badge">GrapesJS + Nuxt 4</span>
      </div>
      <button class="btn-new" @click="showModal = true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Website
      </button>
    </header>

    <!-- Main content -->
    <main class="dash-main">
      <!-- Empty state -->
      <div v-if="sites.length === 0" class="empty-state">
        <div class="empty-glyph">🌐</div>
        <h2>No websites yet</h2>
        <p>Create your first website to get started building with GrapesJS.</p>
        <button class="btn-primary" @click="showModal = true">Create Website</button>
      </div>

      <!-- Sites grid -->
      <div v-else class="sites-grid">
        <div v-for="site in sites" :key="site.id" class="site-card">
          <div class="card-top">
            <div class="card-icon">🌐</div>
            <div class="card-meta">
              <h3 class="card-title">{{ site.name }}</h3>
              <span class="card-slug">/{{ site.id }}</span>
            </div>
          </div>

          <div class="card-date">
            Created {{ formatDate(site.created_at) }}
          </div>

          <div class="card-actions">
            <NuxtLink :to="`/${site.id}/edit`" class="card-btn primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </NuxtLink>
            <NuxtLink :to="`/${site.id}`" class="card-btn secondary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview
            </NuxtLink>
            <button class="card-btn danger" @click="confirmDelete(site)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h2 class="modal-title">New Website</h2>
          <p class="modal-desc">Choose a name for your website. A URL slug will be generated automatically.</p>

          <div class="field">
            <label class="field-label">Website Name</label>
            <input ref="nameInput" v-model="newName" class="field-input" placeholder="e.g. My Portfolio" maxlength="60"
              @keydown.enter="handleCreate" @keydown.esc="closeModal" />
            <span v-if="newName" class="field-hint">
              URL: /{{ slugPreview }}
            </span>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeModal">Cancel</button>
            <button class="btn-confirm" :disabled="!newName.trim() || isCreating" @click="handleCreate">
              {{ isCreating ? 'Creating...' : 'Create Website' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirm Modal -->
    <Transition name="fade">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal">
          <h2 class="modal-title">Delete Website</h2>
          <p class="modal-desc">
            Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>?
            All content will be permanently removed.
          </p>
          <div class="modal-actions">
            <button class="btn-cancel" :disabled="isDeleting" @click="deleteTarget = null">Cancel</button>
            <button class="btn-danger" :disabled="isDeleting" @click="handleDelete">
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import type { Website } from '~/composables/useWebsites'

const { sites, refresh, createSite, deleteSite } = useWebsites()
const showModal = ref(false)
const newName = ref('')
const nameInput = ref<HTMLInputElement | null>(null)
const deleteTarget = ref<Website | null>(null)
const router = useRouter()

const slugPreview = computed(() => {
  const base = newName.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return base || 'website'
})

onMounted(async () => await refresh())

const isCreating = ref(false)
const isDeleting = ref(false)

watch(showModal, async (val) => {
  if (val) {
    await nextTick()
    nameInput.value?.focus()
  } else {
    isCreating.value = false
  }
})

function closeModal() {
  showModal.value = false
  newName.value = ''
}

async function handleCreate() {
  if (!newName.value.trim() || isCreating.value) return
  try {
    isCreating.value = true
    const site = await createSite(newName.value)
    closeModal()
    router.push(`/${site.id}/edit`)
  } catch (e) {
    console.error('Failed to create site:', e)
    isCreating.value = false
  }
}

function confirmDelete(site: Website) {
  deleteTarget.value = site
}

async function handleDelete() {
  if (!deleteTarget.value || isDeleting.value) return
  try {
    isDeleting.value = true
    await deleteSite(deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e) {
    console.error('Failed to delete site:', e)
  } finally {
    isDeleting.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

/* Header */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 60px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(108, 99, 255, 0.6));
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
}

.brand-badge {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  background: rgba(108, 99, 255, 0.15);
  color: var(--color-accent);
  padding: 2px 8px;
  border-radius: 100px;
  border: 1px solid rgba(108, 99, 255, 0.3);
}

.btn-new {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  background: linear-gradient(135deg, var(--color-accent), #7c3aed);
  border: none;
  border-radius: var(--radius);
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-new:hover {
  opacity: 0.85;
}

/* Main */
.dash-main {
  flex: 1;
  padding: 48px 32px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 24px;
  gap: 16px;
  color: var(--color-text-muted);
}

.empty-glyph {
  font-size: 72px;
  filter: grayscale(0.3);
  margin-bottom: 8px;
}

.empty-state h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
}

.empty-state p {
  font-size: 15px;
  max-width: 360px;
}

.btn-primary {
  margin-top: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--color-accent), #a78bfa);
  border: none;
  border-radius: var(--radius);
  color: white;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.85;
}

/* Grid */
.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Card */
.site-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.site-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 20px rgba(108, 99, 255, 0.15);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.card-icon {
  font-size: 32px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-2);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.card-slug {
  font-size: 12px;
  color: var(--color-text-muted);
  font-family: monospace;
  background: var(--color-surface-2);
  padding: 1px 6px;
  border-radius: 4px;
}

.card-date {
  font-size: 12px;
  color: var(--color-text-muted);
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.card-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.18s ease;
}

.card-btn.primary {
  background: var(--color-accent);
  color: white;
  flex: 1;
  justify-content: center;
}

.card-btn.primary:hover {
  opacity: 0.85;
}

.card-btn.secondary {
  background: var(--color-surface-2);
  border-color: var(--color-border);
  color: var(--color-text);
  flex: 1;
  justify-content: center;
}

.card-btn.secondary:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.card-btn.danger {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-muted);
  padding: 7px 12px;
}

.card-btn.danger:hover {
  border-color: #f87171;
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}

.modal-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.field-input {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 14px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: var(--color-accent);
}

.field-hint {
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: monospace;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn-cancel {
  flex: 1;
  padding: 9px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.btn-confirm {
  flex: 1;
  padding: 9px;
  background: linear-gradient(135deg, var(--color-accent), #7c3aed);
  border: none;
  border-radius: var(--radius);
  color: white;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-confirm:hover {
  opacity: 0.85;
}

.btn-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-danger {
  flex: 1;
  padding: 9px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: var(--radius);
  color: #f87171;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: rgba(248, 113, 113, 0.2);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
