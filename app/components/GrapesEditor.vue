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
import { useGrapesEditor } from '~/composables/useGrapesEditor'

const props = defineProps<{ siteId: string }>()

const {
  siteName,
  activeRightTab,
  currentDevice,
  setDevice,
  undo,
  redo,
  clearCanvas,
  goHome,
  openPreview,
} = useGrapesEditor(props.siteId)
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
