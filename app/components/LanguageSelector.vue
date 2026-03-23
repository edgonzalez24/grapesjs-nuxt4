<template>
  <div class="language-selector">
    <div class="selector-trigger" @click.stop="isOpen = !isOpen">
      <span class="current-flag">{{ currentLocaleFlag }}</span>
      <span class="current-name">{{ currentLocaleName }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :class="{ 'rotate': isOpen }">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
    
    <Transition name="slide-up">
      <div v-if="isOpen" class="selector-dropdown" v-click-outside="close">
        <div 
          v-for="locale in locales" 
          :key="locale.code" 
          class="selector-item" 
          :class="{ active: locale.code === currentLocale }"
          @click="selectLocale(locale.code)"
        >
          <span class="item-flag">{{ getFlag(locale.code) }}</span>
          <span class="item-name">{{ locale.name }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '#imports'
const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)

const currentLocale = computed(() => locale.value)
const currentLocaleName = computed(() => locales.value.find(l => l.code === locale.value)?.name)

const currentLocaleFlag = computed(() => getFlag(locale.value))

function getFlag(code: string) {
  switch (code) {
    case 'en': return '🇺🇸'
    case 'es': return '🇪🇸'
    case 'pt': return '🇧🇷'
    default: return '🌐'
  }
}

async function selectLocale(code: string) {
  await setLocale(code as any)
  isOpen.value = false
}

function close() {
  isOpen.value = false
}

// Simple click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: any) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.language-selector {
  position: relative;
  font-family: var(--font-sans);
}

.selector-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.selector-trigger:hover {
  border-color: var(--color-accent);
}

.current-flag {
  font-size: 16px;
}

.current-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.selector-trigger svg {
  transition: transform 0.2s;
  color: var(--color-text-muted);
}

.selector-trigger svg.rotate {
  transform: rotate(180deg);
}

.selector-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 140px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.selector-item:hover {
  background: var(--color-surface-2);
}

.selector-item.active {
  background: rgba(108, 99, 255, 0.1);
  color: var(--color-accent);
}

.item-flag {
  font-size: 16px;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
