<template>
  <div class="editor-shell">
    <!-- ── Top Navbar ── -->
    <header class="editor-navbar">
      <div class="navbar-brand">
        <button class="btn-home" @click="goHome" title="Back to dashboard">
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
        <button class="action-btn" title="Undo" @click="undo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
          </svg>
          Undo
        </button>
        <button class="action-btn" title="Redo" @click="redo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
          </svg>
          Redo
        </button>
        <div class="divider-v" />
        <button class="action-btn" @click="clearCanvas">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
          Clear
        </button>
        <button class="action-btn accent" @click="openPreview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Preview
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
          Blocks
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
            Styles
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
            Traits
          </button>
          <button class="tab-btn" :class="{ active: activeRightTab === 'layers' }" @click="activeRightTab = 'layers'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Layers
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
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps<{ siteId: string }>()

const router = useRouter()
const activeRightTab = ref<'styles' | 'traits' | 'layers'>('styles')

// Resolve site name from the websites composable
const { getSite, refresh: refreshSites } = useWebsites()
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
const undo = () => editor?.UndoManager.undo()
const redo = () => editor?.UndoManager.redo()
const clearCanvas = () => {
  if (editor && confirm('Clear the canvas? This cannot be undone.')) {
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
    label: 'Text & Banner',
    category: 'Sections',
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#6c63ff" opacity="0.15"/>
      <rect x="4" y="8" width="32" height="18" rx="3" fill="#6c63ff" opacity="0.5"/>
      <rect x="4" y="29" width="20" height="3" rx="1.5" fill="#6c63ff"/>
      <rect x="4" y="34" width="14" height="2" rx="1" fill="#8892a4"/>
    </svg>`,
    content: `
      <section style="
        position: relative;
        width: 100%;
        min-height: 480px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <!-- Background decorative blobs -->
        <div style="
          position: absolute; top: -60px; right: -60px;
          width: 280px; height: 280px; border-radius: 50%;
          background: rgba(139, 92, 246, 0.3);
          filter: blur(60px); pointer-events: none;
        "></div>
        <div style="
          position: absolute; bottom: -80px; left: -40px;
          width: 240px; height: 240px; border-radius: 50%;
          background: rgba(99, 102, 241, 0.25);
          filter: blur(70px); pointer-events: none;
        "></div>

        <!-- Content -->
        <div data-gjs-droppable="false" style="
          position: relative; z-index: 2;
          text-align: center;
          padding: 60px 40px;
          max-width: 700px;
        ">
          <span style="
            display: inline-block;
            font-size: 12px; font-weight: 600;
            letter-spacing: 0.14em; text-transform: uppercase;
            color: #a78bfa;
            background: rgba(167, 139, 250, 0.12);
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: 100px; padding: 4px 14px;
            margin-bottom: 24px;
          ">New Feature</span>

          <h1 style="
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 800;
            line-height: 1.15;
            color: #ffffff;
            margin: 0 0 20px;
            letter-spacing: -0.02em;
          ">Build Beautiful Pages<br/>Without Coding</h1>

          <p style="
            font-size: 18px;
            line-height: 1.7;
            color: rgba(255, 255, 255, 0.72);
            margin: 0 0 36px;
            max-width: 520px;
            margin-left: auto;
            margin-right: auto;
          ">Drag and drop components to create stunning landing pages in minutes. No technical knowledge required.</p>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <a href="#" style="
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #7c3aed, #6d28d9);
              color: white; text-decoration: none;
              font-size: 15px; font-weight: 600;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
              transition: opacity 0.2s;
            ">Get Started Free</a>
            <a href="#" style="
              display: inline-block;
              padding: 14px 30px;
              background: rgba(255,255,255,0.08);
              border: 1px solid rgba(255,255,255,0.2);
              color: white; text-decoration: none;
              font-size: 15px; font-weight: 600;
              border-radius: 8px;
            ">Watch Demo →</a>
          </div>
        </div>
      </section>
    `
  })

  // ── 2. Multi Columns — 2 cols ──────────────────────────
  bm.add('multi-cols-2', {
    label: 'Multi Cols (2)',
    category: 'Sections',
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#34d399" opacity="0.1"/>
      <rect x="4" y="10" width="14" height="20" rx="3" fill="#34d399" opacity="0.5"/>
      <rect x="22" y="10" width="14" height="20" rx="3" fill="#34d399" opacity="0.5"/>
    </svg>`,
    content: `
      <section style="
        width: 100%;
        padding: 80px 40px;
        background: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <h2 style="
          text-align: center;
          font-size: 2rem; font-weight: 700;
          color: #1e1b4b; margin: 0 0 12px;
          letter-spacing: -0.01em;
        ">Two Column Layout</h2>
        <p style="
          text-align: center; color: #6b7280;
          font-size: 16px; margin: 0 0 56px;
        ">Edit this section to add your own content</p>

        <div style="
          display: flex;
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Column 1 -->
          <div style="
            flex: 1; min-width: 280px;
            padding: 36px;
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
    label: 'Multi Cols (3)',
    category: 'Sections',
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#fbbf24" opacity="0.1"/>
      <rect x="4" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
      <rect x="16" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
      <rect x="28" y="10" width="8" height="20" rx="2" fill="#fbbf24" opacity="0.6"/>
    </svg>`,
    content: `
      <section style="
        width: 100%;
        padding: 80px 40px;
        background: linear-gradient(180deg, #fafbff 0%, #f0f2f8 100%);
        font-family: 'Inter', system-ui, sans-serif;
      ">
        <h2 style="
          text-align: center;
          font-size: 2rem; font-weight: 700;
          color: #1e1b4b; margin: 0 0 12px;
          letter-spacing: -0.01em;
        ">Three Column Layout</h2>
        <p style="
          text-align: center; color: #6b7280;
          font-size: 16px; margin: 0 0 56px;
        ">Showcase your features, team, or services in three equal columns</p>

        <div style="
          display: flex;
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
        ">
          <!-- Column 1 -->
          <div style="
            flex: 1; min-width: 220px;
            padding: 32px 28px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            text-align: center;
          ">
            <div style="font-size: 36px; margin-bottom: 16px;">🎯</div>
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
            flex: 1; min-width: 220px;
            padding: 32px 28px;
            background: linear-gradient(135deg, #6c63ff, #7c3aed);
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(108, 99, 255, 0.35);
            text-align: center;
          ">
            <div style="font-size: 36px; margin-bottom: 16px;">⚡</div>
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
            flex: 1; min-width: 220px;
            padding: 32px 28px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            text-align: center;
          ">
            <div style="font-size: 36px; margin-bottom: 16px;">🔒</div>
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
    label: 'Text Content',
    category: 'Basic',
    media: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#6c63ff" opacity="0.1"/>
      <rect x="6" y="10" width="28" height="4" rx="2" fill="#6c63ff" opacity="0.7"/>
      <rect x="6" y="18" width="24" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
      <rect x="6" y="24" width="26" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
      <rect x="6" y="30" width="20" height="3" rx="1.5" fill="#8892a4" opacity="0.7"/>
    </svg>`,
    content: `
      <section style="
        width: 100%; padding: 60px 40px;
        background: white;
        font-family: 'Inter', system-ui, sans-serif;
        max-width: 820px; margin: 0 auto;
      ">
        <h2 style="
          font-size: 1.8rem; font-weight: 700;
          color: #1e1b4b; margin: 0 0 16px;
          letter-spacing: -0.01em;
        ">Your Title Goes Here</h2>
        <p style="
          font-size: 16px; line-height: 1.8;
          color: #4b5563; margin: 0 0 20px;
        ">This is a paragraph of text. Click to edit and type your content directly. You can also use the style panel on the right to customize fonts, colors, and spacing.</p>
        <p style="
          font-size: 16px; line-height: 1.8;
          color: #4b5563; margin: 0;
        ">Add another paragraph here for more detailed content.</p>
      </section>
    `
  })
}

const DEFAULT_TEMPLATE = `
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
    ">Bienvenido a tu sitio</h2>
    <p style="
      text-align: center; color: #6b7280;
      font-size: 18px; margin: 0 0 64px;
      max-width: 600px; margin-left: auto; margin-right: auto;
      line-height: 1.6;
    ">Comienza editando este diseño predeterminado de dos columnas. Puedes arrastrar nuevos bloques desde el panel izquierdo.</p>

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
        ">Diseño Flexible</h3>
        <p style="
          font-size: 16px; line-height: 1.7;
          color: #4b5563; margin: 0;
        ">Este es un bloque de columna predeterminado. Puedes cambiar los colores, fuentes y espaciado usando el panel de estilos a la derecha.</p>
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
        ">Listo para Publicar</h3>
        <p style="
          font-size: 16px; line-height: 1.7;
          color: #4b5563; margin: 0;
        ">Una vez que termines de editar, puedes previsualizar tu sitio y ver cómo se adapta a dispositivos móviles automáticamente.</p>
      </div>
    </div>
  </section>
`

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

    blockManager: {
      appendTo: '#gjs-blocks',
    },

    styleManager: {
      appendTo: '#gjs-styles',
      sectors: [
        {
          name: 'Layout',
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
          name: 'Dimension',
          open: false,
          properties: ['width', 'min-height', 'max-width'],
        },
        {
          name: 'Typography',
          open: false,
          properties: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align'],
        },
        {
          name: 'Decorations',
          open: false,
          properties: ['background-color', 'border-radius', 'box-shadow', 'opacity'],
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
        { name: 'Desktop', width: '' },
        { name: 'Tablet', width: '768px', widthMedia: '768px' },
        { name: 'Mobile', width: '375px', widthMedia: '480px' },
      ],
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
    editor.setComponents(DEFAULT_TEMPLATE)
  }


  // Auto-save on every change (debounced)
  editor.on('update', scheduleSave)
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
