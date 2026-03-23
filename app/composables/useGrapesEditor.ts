import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSupabase } from '~/utils/supabase'
import { registerBlocks, getDefaultTemplate } from '~/utils/editor/blocks'

export function useGrapesEditor(siteId: string) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const supabase = useSupabase()
  const { getSite, refresh: refreshSites } = useWebsites()

  const activeRightTab = ref<'styles' | 'traits' | 'layers'>('styles')
  const currentDevice = ref('desktop')
  const siteName = computed(() => getSite(siteId)?.name ?? siteId)

  let editor: any = null
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  const setDevice = (device: string) => {
    if (!editor) return
    currentDevice.value = device
    editor.setDevice(device)
  }

  // ─── API helpers ─────────────────────────────────────────
  async function loadContent() {
    try {
      return await $fetch<{ html: string; css: string; gjson: unknown }>(
        `/api/sites/${siteId}/content`
      )
    } catch {
      return { html: '', css: '', gjson: null }
    }
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(async () => {
      if (!editor) return
      await $fetch(`/api/sites/${siteId}/content`, {
        method: 'PUT',
        body: {
          html: editor.getHtml(),
          css: editor.getCss(),
          gjson: editor.getProjectData(),
        },
      })
    }, 800)
  }

  const undo = () => editor?.UndoManager.undo()
  const redo = () => editor?.UndoManager.redo()

  const clearCanvas = () => {
    if (editor && confirm(t('editor.clearConfirm'))) {
      editor.DomComponents.clear()
      editor.CssComposer.clear()
      $fetch(`/api/sites/${siteId}/content`, {
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
    await router.push(`/${siteId}`)
  }

  // Watch for locale changes to update GrapesJS internal language
  watch(locale, (newLocale) => {
    if (editor) {
      editor.setLocale(newLocale)
    }
  })

  onMounted(async () => {
    refreshSites()
    const grapesjs = (await import('grapesjs')).default

    editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      width: 'auto',
      storageManager: false,
      panels: { defaults: [] },
      assetManager: {
        upload: 'https://none',
        async uploadFile(e: any) {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
          const bucket = 'images'

          for (const file of files) {
            try {
              const fileExt = file.name.split('.').pop()
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
              const filePath = `uploads/${siteId}/${fileName}`

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
      blockManager: { appendTo: '#gjs-blocks' },
      styleManager: {
        appendTo: '#gjs-styles',
        sectors: [
          {
            name: t('editor.sectors.layout'),
            open: true,
            properties: ['display', 'flex-direction', 'align-items', 'justify-content', 'gap', 'padding', 'margin'],
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
            properties: ['background-image', 'background-position', 'background-size', 'background-repeat', 'background-attachment'],
          },
        ],
      },
      traitManager: { appendTo: '#gjs-traits' },
      layerManager: { appendTo: '#gjs-layers' },
      canvas: {
        styles: ['https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'],
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

    registerBlocks(editor, t)

    const content = await loadContent()
    if (content.gjson) {
      editor.loadProjectData(content.gjson as object)
    } else if (content.html) {
      editor.setComponents(content.html)
      if (content.css) editor.setStyle(content.css)
    } else {
      editor.setComponents(getDefaultTemplate(t))
    }

    editor.on('update', scheduleSave)
    editor.on('load', () => {
      const body = editor.Canvas.getBody()
      if (body) {
        body.style.margin = '0'
        body.style.padding = '0'
        body.style.overflowX = 'hidden'
      }
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

  return {
    editor: computed(() => editor),
    activeRightTab,
    currentDevice,
    siteName,
    setDevice,
    undo,
    redo,
    clearCanvas,
    goHome,
    openPreview,
  }
}
