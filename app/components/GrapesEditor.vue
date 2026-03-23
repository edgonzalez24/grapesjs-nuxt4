<template>
  <div class="editor-shell">
    <!-- ── Top Navbar ── -->
    <header class="editor-navbar">
      <div class="navbar-brand">
        <button class="btn-home" @click="goHome" :title="$t('editor.back')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <span class="brand-icon">🎨</span>
        <span class="brand-name">{{ siteName }}</span>
        <span class="brand-badge">GrapesJS + Nuxt 4</span>
      </div>

      <div class="navbar-actions">
        <LanguageSelector />
        
        <div class="divider-v" />

        <button class="action-btn" :title="$t('editor.undo')" @click="undo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
          </svg>
          {{ $t('editor.undo') }}
        </button>
        <button class="action-btn" :title="$t('editor.redo')" @click="redo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
          </svg>
          {{ $t('editor.redo') }}
        </button>

        <div class="divider-v" />

        <div class="device-switcher">
          <button class="device-btn" :class="{ active: currentDevice === 'desktop' }" @click="setDevice('desktop')"
            :title="$t('editor.desktop')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
          <button class="device-btn" :class="{ active: currentDevice === 'tablet' }" @click="setDevice('tablet')"
            :title="$t('editor.tablet')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
          <button class="device-btn" :class="{ active: currentDevice === 'mobile' }" @click="setDevice('mobile')"
            :title="$t('editor.mobile')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </button>
        </div>

        <div class="divider-v" />

        <button class="action-btn" @click="clearCanvas">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
          {{ $t('editor.clear') }}
        </button>
        <button class="action-btn accent" @click="openPreview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {{ $t('editor.preview') }}
        </button>
      </div>
    </header>

    <!-- ── Editor Body ── -->
    <div class="editor-body">
      <!-- Left: Blocks Panel -->
      <aside class="panel-left">
        <div class="panel-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          {{ $t('editor.blocks') }}
        </div>
        <div id="gjs-blocks" class="blocks-container" />
      </aside>

      <!-- Center: Canvas -->
      <main class="canvas-area">
        <div id="gjs" class="gjs-canvas" />
      </main>

      <!-- Right: Style Manager -->
      <aside class="panel-right">
        <div class="panel-tabs">
          <button class="tab-btn" :class="{ active: activeRightTab === 'styles' }" @click="activeRightTab = 'styles'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {{ $t('editor.styles') }}
          </button>
          <button class="tab-btn" :class="{ active: activeRightTab === 'traits' }" @click="activeRightTab = 'traits'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            {{ $t('editor.traits') }}
          </button>
          <button class="tab-btn" :class="{ active: activeRightTab === 'layers' }" @click="activeRightTab = 'layers'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            {{ $t('editor.layers') }}
          </button>
        </div>
        <div id="gjs-styles" class="panel-pane" :class="{ hidden: activeRightTab !== 'styles' }" />
        <div id="gjs-traits" class="panel-pane" :class="{ hidden: activeRightTab !== 'traits' }" />
        <div id="gjs-layers" class="panel-pane" :class="{ hidden: activeRightTab !== 'layers' }" />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupabase } from '~/utils/supabase'

const props = defineProps<{ siteId: string }>()

const router = useRouter()
const activeRightTab = ref<'styles' | 'traits' | 'layers'>('styles')
const currentDevice = ref('desktop')

const setDevice = (device: string) => {
  if (!editor) return
  currentDevice.value = device
  editor.setDevice(device)
}

// Resolve site name from the websites composable
const { getSite, refresh: refreshSites } = useWebsites()
const supabase = useSupabase()
const siteName = computed(() => getSite(props.siteId)?.name ?? props.siteId)

let editor: any = null
let saveTimer: ReturnType<typeof setTimeout> | null = null

// ─── API helpers ─────────────────────────────────────────
async function loadContent() {
  try {
    return await $fetch<{ html: string; css: string; gjson: unknown }>(
      `/api/sites/${props.siteId}/content`
    )
  } catch {
    return { html: '', css: '', gjson: null }
  }
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    if (!editor) return
    await $fetch(`/api/sites/${props.siteId}/content`, {
      method: 'PUT',
      body: {
        html: editor.getHtml(),
        css: editor.getCss(),
        gjson: editor.getProjectData(),
      },
    })
  }, 800)
}

// ─── Helpers ─────────────────────────────────────────────
const { t, locale } = useI18n()

const undo = () => editor?.UndoManager.undo()
const redo = () => editor?.UndoManager.redo()
const clearCanvas = () => {
  if (editor && confirm(t('editor.clearConfirm'))) {
    editor.DomComponents.clear()
    editor.CssComposer.clear()
    // Persist cleared state to API
    $fetch(`/api/sites/${props.siteId}/content`, {
      method: 'PUT',
      body: { html: '', css: '', gjson: null },
    })
  }
}

function goHome() {
  router.push('/')
}

async function openPreview() {
  if (!editor) return
  await router.push(`/${props.siteId}`)
}

// ─── Block Definitions ───────────────────────────────────
function registerBlocks(editor: any) {
  const bm = editor.BlockManager

  // ── 1. Text & Banner ──────────────────────────────────
  bm.add('text-banner', {
    label: t('blocks.textBanner'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#6c63ff" opacity="0.15"/>
      <rect x="4" y="8" width="32" height="18" rx="3" fill="#6c63ff" opacity="0.5"/>
      <rect x="4" y="29" width="20" height="3" rx="1.5" fill="#6c63ff"/>
      <rect x="4" y="34" width="14" height="2" rx="1" fill="#8892a4"/>
    </svg>`,
    content: `
      <section data-gjs-name="Banner Section" style="
        position: relative;
        width: 100%;
        height: 50vh;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-color: #1e1b4b;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <!-- Dedicated Background Image Container -->
        <div data-gjs-name="Banner Image" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          background-image: url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        "></div>

        <!-- Background Overlay -->
        <div data-gjs-name="Banner Overlay" data-gjs-selectable="false" data-gjs-hoverable="false" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          background: linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(49, 46, 129, 0.7) 50%, rgba(76, 29, 149, 0.7) 100%);
          pointer-events: none;
        "></div>

        <!-- Content Area -->
        <div data-gjs-name="Banner Content" data-gjs-droppable="true" style="
          position: relative; z-index: 3;
          text-align: center;
          padding: clamp(30px, 8vw, 60px) clamp(20px, 5vw, 40px);
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        ">
          <span data-gjs-name="Badge" style="
            display: inline-block;
            font-size: 11px; font-weight: 600;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: #a78bfa;
            background: rgba(167, 139, 250, 0.12);
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: 100px; padding: 4px 14px;
            margin-bottom: 20px;
          ">New Feature</span>

          <h1 data-gjs-name="Main Heading" style="
            font-size: clamp(1.8rem, 5vw, 3.5rem);
            font-weight: 800;
            line-height: 1.1;
            color: #ffffff;
            margin: 0 0 20px;
            letter-spacing: -0.03em;
          ">Banner Section Experience</h1>

          <p data-gjs-name="Subheading" style="
            font-size: clamp(15px, 2vw, 18px);
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.85);
            margin: 0 0 32px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          ">Create high-impact sections that capture attention immediately. Now with a more compact 50vh height for better visibility.</p>

          <div data-gjs-name="Button Group" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a data-gjs-name="Primary Button" href="#" style="
              display: inline-block;
              padding: 12px 28px;
              background: #ffffff;
              color: #1e1b4b; text-decoration: none;
              font-size: 14px; font-weight: 700;
              border-radius: 10px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
              transition: transform 0.2s;
            ">Get Started →</a>
          </div>
        </div>
      </section>
    `
  })

  // ── 2. Multi Columns — 2 cols ──────────────────────────
  bm.add('multi-cols-2', {
    label: t('blocks.multiCols2'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#34d399" opacity="0.1"/>
      <rect x="4" y="10" width="14" height="20" rx="3" fill="#34d399" opacity="0.5"/>
      <rect x="22" y="10" width="14" height="20" rx="3" fill="#34d399" opacity="0.5"/>
    </svg>`,
    content: `
      <section style="
        width: 100%;
        padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px);
        background: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <h2 style="
          text-align: center;
          font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700;
          color: #1e1b4b; margin: 0 0 12px;
          letter-spacing: -0.01em;
        ">Two Column Layout</h2>
        <p style="
          text-align: center; color: #6b7280;
          font-size: clamp(14px, 2vw, 16px); margin: 0 0 48px;
        ">Edit this section to add your own content</p>

        <div style="
          display: flex;
          gap: clamp(16px, 3vw, 32px);
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Column 1 -->
          <div style="
            flex: 1; min-width: 260px;
            padding: clamp(24px, 4vw, 36px);
            background: #f8f9fc;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          ">
            <div style="
              width: 48px; height: 48px; border-radius: 12px;
              background: linear-gradient(135deg, #6c63ff, #a78bfa);
              display: flex; align-items: center; justify-content: center;
              font-size: 22px; margin-bottom: 20px;
            ">✨</div>
            <h3 style="
              font-size: 1.2rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 12px;
            ">Feature One</h3>
            <p style="
              font-size: 15px; line-height: 1.7;
              color: #6b7280; margin: 0;
            ">Describe the first key feature or benefit here. Keep it concise and focused on the user's needs.</p>
          </div>

          <!-- Column 2 -->
          <div style="
            flex: 1; min-width: 280px;
            padding: 36px;
            background: #f8f9fc;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          ">
            <div style="
              width: 48px; height: 48px; border-radius: 12px;
              background: linear-gradient(135deg, #34d399, #059669);
              display: flex; align-items: center; justify-content: center;
              font-size: 22px; margin-bottom: 20px;
            ">🚀</div>
            <h3 style="
              font-size: 1.2rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 12px;
            ">Feature Two</h3>
            <p style="
              font-size: 15px; line-height: 1.7;
              color: #6b7280; margin: 0;
            ">Describe the second key feature or benefit here. Keep it concise and focused on the user's needs.</p>
          </div>
        </div>
      </section>
    `
  })

  // ── 3. Multi Columns — 3 cols ──────────────────────────
  bm.add('multi-cols-3', {
    label: t('blocks.multiCols3'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#fbbf24" opacity="0.1"/>
      <rect x="4" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
      <rect x="16" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
      <rect x="28" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
    </svg>`,
    content: `
      <section style="
        width: 100%;
        padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px);
        background: linear-gradient(180deg, #fafbff 0%, #f0f2f8 100%);
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <h2 style="
          text-align: center;
          font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700;
          color: #1e1b4b; margin: 0 0 12px;
          letter-spacing: -0.01em;
        ">Three Column Layout</h2>
        <p style="
          text-align: center; color: #6b7280;
          font-size: clamp(14px, 2vw, 16px); margin: 0 0 48px;
        ">Showcase your features, team, or services in three equal columns</p>

        <div style="
          display: flex;
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Column 1 -->
          <div style="
            flex: 1; min-width: 240px;
            padding: clamp(24px, 4vw, 32px) 24px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            text-align: center;
          ">
            <div style="font-size: clamp(28px, 4vw, 36px); margin-bottom: 16px;">🎯</div>
            <h3 style="
              font-size: 1.1rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 10px;
            ">Precision</h3>
            <p style="
              font-size: 14px; line-height: 1.65;
              color: #6b7280; margin: 0;
            ">Built for accuracy and attention to detail in every component.</p>
          </div>

          <!-- Column 2 -->
          <div style="
            flex: 1; min-width: 240px;
            padding: clamp(24px, 4vw, 32px) 24px;
            background: linear-gradient(135deg, #6c63ff, #7c3aed);
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(108, 99, 255, 0.35);
            text-align: center;
          ">
            <div style="font-size: clamp(28px, 4vw, 36px); margin-bottom: 16px;">⚡</div>
            <h3 style="
              font-size: 1.1rem; font-weight: 700;
              color: white; margin: 0 0 10px;
            ">Performance</h3>
            <p style="
              font-size: 14px; line-height: 1.65;
              color: rgba(255,255,255,0.8); margin: 0;
            ">Lightning-fast experience with optimized rendering.</p>
          </div>

          <!-- Column 3 -->
          <div style="
            flex: 1; min-width: 240px;
            padding: clamp(24px, 4vw, 32px) 24px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            text-align: center;
          ">
            <div style="font-size: clamp(28px, 4vw, 36px); margin-bottom: 16px;">🔒</div>
            <h3 style="
              font-size: 1.1rem; font-weight: 700;
              color: #1e1b4b; margin: 0 0 10px;
            ">Security</h3>
            <p style="
              font-size: 14px; line-height: 1.65;
              color: #6b7280; margin: 0;
            ">Enterprise-grade security baked in from the ground up.</p>
          </div>
        </div>
      </section>
    `
  })

  // ── 4. Text Content ────────────────────────────────────
  bm.add('text-content', {
    label: t('blocks.textContent'),
    category: t('blocks.categories.basic'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#6c63ff" opacity="0.1"/>
      <rect x="6" y="10" width="28" height="4" rx="2" fill="#6c63ff" opacity="0.7"/>
      <rect x="6" y="18" width="24" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
      <rect x="6" y="24" width="26" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
      <rect x="6" y="30" width="20" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
    </svg>`,
    content: `
      <section style="
        width: 100%; padding: clamp(30px, 8vw, 60px) clamp(20px, 5vw, 40px);
        background: white;
        font-family: 'Inter', system-ui, sans-serif;
        max-width: 820px; margin: 0 auto;
      ">
        <h2 style="
          font-size: clamp(1.4rem, 4vw, 1.8rem); font-weight: 700;
          color: #1e1b4b; margin: 0 0 16px;
          letter-spacing: -0.01em;
        ">Your Title Goes Here</h2>
        <p style="
          font-size: clamp(14px, 2vw, 16px); line-height: 1.8;
          color: #4b5563; margin: 0 0 20px;
        ">This is a paragraph of text. Click to edit and type your content directly. You can also use the style panel on the right to customize fonts, colors, and spacing.</p>
      </section>
    `
  })

  // ── 5. Image & Text ────────────────────────────────────
  bm.add('image-text', {
    label: t('blocks.imageText'),
    category: t('blocks.categories.sections'),
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#ec4899" opacity="0.1"/>
      <rect x="4" y="10" width="14" height="20" rx="2" fill="#ec4899" opacity="0.5"/>
      <rect x="22" y="12" width="14" height="2" rx="1" fill="#ec4899" opacity="0.8"/>
      <rect x="22" y="18" width="14" height="2" rx="1" fill="#8892a4" opacity="0.5"/>
      <rect x="22" y="24" width="10" height="2" rx="1" fill="#8892a4" opacity="0.5"/>
    </svg>`,
    content: `
      <section style="
        width: 100%; padding: clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px);
        background: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: clamp(24px, 5vw, 60px);
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Image Column -->
          <div style="flex: 1; min-width: 280px;">
            <div style="
              width: 100%; height: clamp(280px, 40vh, 400px);
              background: #f3f4f6;
              border-radius: 20px;
              overflow: hidden;
              display: flex; align-items: center; justify-content: center;
            ">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" 
                   alt="Modern Workspace" 
                   style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          </div>

          <!-- Text Column -->
          <div style="flex: 1; min-width: 280px;">
            <div style="
              padding: 10px 0;
            ">
              <span style="
                display: inline-block;
                color: #ec4899;
                font-weight: 700;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                margin-bottom: 16px;
              ">Premium Design</span>
              
              <h2 style="
                font-size: clamp(1.6rem, 4vw, 2.5rem);
                font-weight: 800;
                color: #111827;
                line-height: 1.2;
                margin: 0 0 20px;
                letter-spacing: -0.02em;
              ">Elevate Your Visual Experience</h2>
              
              <p style="
                font-size: clamp(15px, 2vw, 18px);
                line-height: 1.7;
                color: #4b5563;
                margin-bottom: 28px;
              ">Create a lasting impression with our beautifully crafted sections. Our design philosophy focuses on clarity, elegance, and user engagement.</p>
              
              <ul style="list-style: none; padding: 0; margin-bottom: 28px;">
                <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-weight: 500; color: #374151; font-size: 14px;">
                  <span style="display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; background: rgba(236,72,153,0.1); color: #ec4899; border-radius: 50%; font-size: 12px;">✓</span>
                  Mobile Responsive Layouts
                </li>
              </ul>
              
              <a href="#" style="
                display: inline-block;
                padding: 10px 24px;
                background: #111827;
                color: white;
                text-decoration: none;
                font-weight: 600;
                border-radius: 10px;
                font-size: 14px;
              ">Explore More</a>
            </div>
          </div>
        </div>
      </section>
    `
  })
}

function getDefaultTemplate() {
  return `
    <section style="
      width: 100%;
      padding: 80px 40px;
      background: #ffffff;
      font-family: 'Inter', system-ui, sans-serif;
    ">
      <h2 style="
        text-align: center;
        font-size: 2.2rem; font-weight: 800;
        color: #1e1b4b; margin: 0 0 16px;
        letter-spacing: -0.02em;
      ">${t('editor.defaultTemplate.title')}</h2>
      <p style="
        text-align: center; color: #6b7280;
        font-size: 18px; margin: 0 0 64px;
        max-width: 600px; margin-left: auto; margin-right: auto;
        line-height: 1.6;
      ">${t('editor.defaultTemplate.subtitle')}</p>

      <div style="
        display: flex;
        gap: 32px;
        max-width: 1100px;
        margin: 0 auto;
        flex-wrap: wrap;
      ">
        <!-- Column 1 -->
        <div style="
          flex: 1; min-width: 300px;
          padding: 40px;
          background: #f8fbff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s;
        ">
          <div style="
            width: 56px; height: 56px; border-radius: 14px;
            background: linear-gradient(135deg, #6c63ff, #a78bfa);
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin-bottom: 24px;
            box-shadow: 0 8px 16px rgba(108, 99, 255, 0.2);
          ">✨</div>
          <h3 style="
            font-size: 1.4rem; font-weight: 700;
            color: #1e1b4b; margin: 0 0 14px;
          ">${t('editor.defaultTemplate.feature1Title')}</h3>
          <p style="
            font-size: 16px; line-height: 1.7;
            color: #4b5563; margin: 0;
          ">${t('editor.defaultTemplate.feature1Text')}</p>
        </div>

        <!-- Column 2 -->
        <div style="
          flex: 1; min-width: 300px;
          padding: 40px;
          background: #f8fbff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s;
        ">
          <div style="
            width: 56px; height: 56px; border-radius: 14px;
            background: linear-gradient(135deg, #34d399, #059669);
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin-bottom: 24px;
            box-shadow: 0 8px 16px rgba(52, 211, 153, 0.2);
          ">🚀</div>
          <h3 style="
            font-size: 1.4rem; font-weight: 700;
            color: #1e1b4b; margin: 0 0 14px;
          ">${t('editor.defaultTemplate.feature2Title')}</h3>
          <p style="
            font-size: 16px; line-height: 1.7;
            color: #4b5563; margin: 0;
          ">${t('editor.defaultTemplate.feature2Text')}</p>
        </div>
      </div>
    </section>
  `
}

// Watch for locale changes to update GrapesJS internal language
watch(locale, (newLocale) => {
  if (editor) {
    editor.setLocale(newLocale)
  }
})

// ─── Editor Init ─────────────────────────────────────────
onMounted(async () => {
  refreshSites()
  const grapesjs = (await import('grapesjs')).default

  editor = grapesjs.init({
    container: '#gjs',
    height: '100%',
    width: 'auto',
    storageManager: false,

    // Built-in panel slots → remapped to our DOM nodes
    panels: { defaults: [] },

    assetManager: {
      upload: 'https://none', // Set to a string to enable upload button UI, but our custom uploadFile handles the logic
      async uploadFile(e: any, assetManager: any) {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
        const bucket = 'images'

        for (const file of files) {
          try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
            const filePath = `uploads/${props.siteId}/${fileName}`

            const { data, error } = await supabase.storage
              .from(bucket)
              .upload(filePath, file)

            if (error) {
              console.error('Error uploading to Supabase:', error)
              alert(`Error uploading ${file.name}: ${error.message}`)
              continue
            }

            const { data: { publicUrl } } = supabase.storage
              .from(bucket)
              .getPublicUrl(data.path)

            editor.Assets.add(publicUrl)
          } catch (err: any) {
            console.error('Unexpected upload error:', err)
            alert(`Unexpected error uploading ${file.name}`)
          }
        }
      }
    },

    blockManager: {
      appendTo: '#gjs-blocks',
    },

    styleManager: {
      appendTo: '#gjs-styles',
      sectors: [
        {
          name: t('editor.sectors.layout'),
          open: true,
          properties: [
            'display',
            'flex-direction',
            'align-items',
            'justify-content',
            'gap',
            'padding',
            'margin',
          ],
        },
        {
          name: t('editor.sectors.dimension'),
          open: false,
          properties: ['width', 'height', 'min-height', 'max-width'],
        },
        {
          name: t('editor.sectors.typography'),
          open: false,
          properties: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align'],
        },
        {
          name: t('editor.sectors.decorations'),
          open: false,
          properties: ['background-color', 'border-radius', 'box-shadow', 'opacity'],
        },
        {
          name: t('editor.sectors.background'),
          open: false,
          properties: [
            'background-image',
            'background-position',
            'background-size',
            'background-repeat',
            'background-attachment',
          ],
        },
      ],
    },

    traitManager: {
      appendTo: '#gjs-traits',
    },

    layerManager: {
      appendTo: '#gjs-layers',
    },

    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
      ],
    },

    deviceManager: {
      devices: [
        { id: 'desktop', name: t('editor.desktop'), width: '' },
        { id: 'tablet', name: t('editor.tablet'), width: '768px', widthMedia: '992px' },
        { id: 'mobile', name: t('editor.mobile'), width: '320px', widthMedia: '480px' },
      ],
    },

    i18n: {
      locale: locale.value,
      detectLocale: false,
    },
  })

  registerBlocks(editor)

  // Load previously saved content for this site from API
  const content = await loadContent()
  if (content.gjson) {
    // Restore full GrapesJS JSON schema (components + styles)
    editor.loadProjectData(content.gjson as object)
  } else if (content.html) {
    editor.setComponents(content.html)
    if (content.css) editor.setStyle(content.css)
  } else {
    // New site: load default template
    editor.setComponents(getDefaultTemplate())
  }


  // Auto-save on every change (debounced)
  editor.on('update', scheduleSave)

  // Reset body margin/padding for full-screen sections
  editor.on('load', () => {
    const body = editor.Canvas.getBody()
    if (body) {
      body.style.margin = '0'
      body.style.padding = '0'
      body.style.overflowX = 'hidden'
    }
    // Inject global responsive styles
    editor.addStyle(`
      * { box-sizing: border-box; }
      img { max-width: 100%; height: auto; display: block; }
      .gjs-dashed * { max-width: 100%; }
      section, div { max-width: 100%; }
    `)
  })
})

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
  editor?.destroy()
  editor = null
})
</script>

<style scoped>
/* ── Shell layout ── */
.editor-shell {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: var(--color-bg);
  overflow: hidden;
}

/* ── Navbar ── */
.editor-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 20px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  z-index: 50;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.18s ease;
  flex-shrink: 0;
}

.btn-home:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.brand-icon {
  font-size: 22px;
  filter: drop-shadow(0 0 8px rgba(108, 99, 255, 0.6));
}

.brand-name {
  font-size: 15px;
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

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.18s ease;
}

.action-btn:hover {
  background: var(--color-surface-2);
  border-color: var(--color-border);
  color: var(--color-text);
}

.action-btn.accent {
  background: linear-gradient(135deg, var(--color-accent), #7c3aed);
  border-color: transparent;
  color: white;
  padding: 6px 16px;
}

.action-btn.accent:hover {
  opacity: 0.88;
  color: white;
}

.divider-v {
  width: 1px;
  height: 20px;
  background: var(--color-border);
  margin: 0 6px;
}

/* ── Device Switcher ── */
.device-switcher {
  display: flex;
  align-items: center;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2px;
  margin: 0 4px;
}

.device-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.device-btn:hover {
  color: var(--color-text);
}

.device-btn.active {
  background: var(--color-surface);
  color: var(--color-accent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* ── Body layout ── */
.editor-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Left Panel ── */
.panel-left {
  width: 220px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.blocks-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.blocks-container::-webkit-scrollbar {
  width: 4px;
}

.blocks-container::-webkit-scrollbar-track {
  background: transparent;
}

.blocks-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

/* ── Canvas ── */
.canvas-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.gjs-canvas {
  width: 100%;
  height: 100%;
}

/* ── Right Panel ── */
.panel-right {
  width: 260px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all 0.18s ease;
}

.tab-btn:hover {
  color: var(--color-text);
  background: var(--color-surface-2);
}

.tab-btn.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.panel-pane {
  flex: 1;
  overflow-y: auto;
}

.panel-pane.hidden {
  display: none;
}

.panel-pane::-webkit-scrollbar {
  width: 4px;
}

.panel-pane::-webkit-scrollbar-track {
  background: transparent;
}

.panel-pane::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}
</style>
