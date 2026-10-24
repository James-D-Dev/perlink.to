<template>
  <UModal
    v-model:open="open"
    :title="t('dashboard.qr.title')"
    :description="t('dashboard.qr.description')"
    :ui="{ content: 'sm:max-w-3xl' }"
  >
    <template #body>
      <div class="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <!-- Card preview -->
        <div class="mx-auto w-full max-w-[280px] overflow-hidden rounded-lg shadow-md ring-1 ring-default " v-html="previewSvg" />

        <div class="space-y-4">
          <UFormField :label="t('dashboard.qr.ctaLabel')">
            <div class="mb-2 flex flex-wrap gap-1.5">
              <UButton
                v-for="preset in ctaPresets"
                :key="preset"
                size="xs"
                :color="cta === preset ? 'primary' : 'neutral'"
                :variant="cta === preset ? 'solid' : 'outline'"
                @click="cta = preset"
              >
                {{ preset }}
              </UButton>
            </div>
            <UInput v-model="cta" maxlength="40" class="w-full" />
          </UFormField>

          <UFormField :label="t('dashboard.qr.styleLabel')">
            <div class="flex gap-2">
              <button
                v-for="option in styles"
                :key="option.value"
                type="button"
                class="flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-2 text-xs transition"
                :class="style === option.value ? 'border-inverted ring-1 ring-inverted text-highlighted' : 'border-default text-muted hover:border-accented'"
                @click="style = option.value"
              >
                <span class="h-6 w-full rounded" :style="{ background: option.colors.background, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }" />
                {{ option.label }}
              </button>
            </div>
          </UFormField>

          <p class="text-xs text-muted">{{ t('dashboard.qr.trackingNote') }}</p>

          <div class="flex flex-wrap gap-2 pt-1">
            <UButton icon="i-lucide-printer" :label="t('dashboard.qr.print')" @click="print" />
            <UButton icon="i-lucide-image-down" color="neutral" variant="outline" :label="t('dashboard.qr.downloadPng')" :loading="exporting" @click="downloadPng" />
            <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" :label="t('dashboard.qr.downloadSvg')" @click="downloadSvg" />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ThemeConfig } from '~/types/bio'

const props = defineProps<{
  username: string
  title: string
  themeConfig: ThemeConfig
}>()

const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()

// Visitors read the card, so its words follow the site language
const siteLang = computed(() => normalizeSiteLanguage(props.themeConfig.language))
const ctaPresets = computed(() => (['qrMenu', 'qrBook', 'qrScan'] as const).map(key => siteT(siteLang.value, key)))
const cta = ref('')
watch(ctaPresets, presets => (cta.value = presets[0] ?? ''), { immediate: true })

// Readable text on the site's own colour
function isDark(hex: string) {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex)
  if (!m) return true
  const [r, g, b] = [m[1], m[2], m[3]].map(v => parseInt(v!, 16))
  return 0.299 * r! + 0.587 * g! + 0.114 * b! < 150
}

const style = ref<'light' | 'dark' | 'brand'>('light')
const styles = computed(() => {
  const brand = props.themeConfig.colors?.primary || '#0c0b0a'
  const brandDark = isDark(brand)
  return [
    { value: 'light' as const, label: t('dashboard.qr.styles.light'), colors: { background: '#fdfcfb', foreground: '#0c0b0a', muted: '#6b655e' } },
    { value: 'dark' as const, label: t('dashboard.qr.styles.dark'), colors: { background: '#0c0b0a', foreground: '#fdfcfb', muted: '#a39b90' } },
    { value: 'brand' as const, label: t('dashboard.qr.styles.brand'), colors: { background: brand, foreground: brandDark ? '#ffffff' : '#0c0b0a', muted: brandDark ? 'rgba(255,255,255,0.75)' : 'rgba(12,11,10,0.65)' } },
  ]
})

// ?ref=qr lets analytics count scans as their own source
const url = computed(() => `https://perlink.to/${props.username}?ref=qr`)

const svg = computed(() => {
  const colors = styles.value.find(s => s.value === style.value)!.colors
  return qrCardSvg({
    url: url.value,
    title: props.title || props.username,
    cta: cta.value,
    caption: `perlink.to/${props.username}`,
    ...colors,
  })
})

// Same card, sized to fit the preview box
const previewSvg = computed(() =>
  svg.value.replace(`width="${QR_CARD_WIDTH}" height="${QR_CARD_HEIGHT}"`, 'width="100%" style="display:block;height:auto"'),
)

function save(blob: Blob, filename: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

function downloadSvg() {
  save(new Blob([svg.value], { type: 'image/svg+xml' }), `perlink-${props.username}-qr.svg`)
}

const exporting = ref(false)
async function downloadPng() {
  exporting.value = true
  try {
    save(await qrCardPng(svg.value), `perlink-${props.username}-qr.png`)
  } finally {
    exporting.value = false
  }
}

// Four cards on one A4 sheet, printed from a hidden frame
function print() {
  const frame = document.createElement('iframe')
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0'
  document.body.appendChild(frame)
  const doc = frame.contentDocument!
  const card = `<div class="card">${svg.value}</div>`
  doc.open()
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${props.username} QR</title>
<style>@page{size:A4;margin:10mm}body{margin:0}.sheet{display:grid;grid-template-columns:1fr 1fr;gap:8mm}
.card{border:1px dashed #ccc;break-inside:avoid}.card svg{display:block;width:100%;height:auto}</style></head>
<body><div class="sheet">${card.repeat(4)}</div></body></html>`)
  doc.close()
  frame.contentWindow!.focus()
  frame.contentWindow!.print()
  setTimeout(() => frame.remove(), 1000)
}
</script>
