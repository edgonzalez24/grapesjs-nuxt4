<template>
  <div class="editor-page">
    <ClientOnly>
      <GrapesEditor :key="locale" :site-id="siteId" />
      <template #fallback>
        <div class="loading-screen">
          <div class="loading-inner">
            <div class="logo">
              <span class="logo-icon">🎨</span>
              <h1>Page Builder</h1>
            </div>
            <div class="spinner"></div>
            <p>Initializing editor…</p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
const route = useRoute()
const { locale } = useI18n()
const siteId = computed(() => route.params.siteId as string)
</script>

<style scoped>
.editor-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: var(--color-bg);
}

.loading-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 40px;
  filter: drop-shadow(0 0 16px rgba(108, 99, 255, 0.6));
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #6c63ff, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-inner p {
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
