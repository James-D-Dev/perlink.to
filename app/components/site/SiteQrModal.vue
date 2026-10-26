<template>
  <AppSheet v-model:open="open" :title="t('dashboard.qr.title')" :ui="{ content: 'sm:max-w-[680px]', body: 'p-5 sm:p-7' }">
    <template #body>
      <div class="grid items-center gap-5 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:gap-9">
        <!-- The card, floating on a soft stage -->
        <div class="rounded-[26px] bg-black/[0.04] p-4 sm:p-6 dark:bg-white/[0.05]">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="mx-auto w-full max-w-[160px] overflow-hidden sm:max-w-[220px] rounded-xl shadow-[0_18px_40px_-16px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06]" v-html="previewSvg" />
        </div>

        <div class="flex min-w-0 flex-col gap-5 sm:gap-6">
          <!-- What the card says -->
          <div>
            <p class="mb-2.5 text-[13px] font-medium text-muted">{{ t('dashboard.qr.ctaLabel') }}</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in ctaPresets"
                :key="preset"
                type="button"
                class="chip"
                :class="!customCta && cta === preset && 'chip-on'"
                @click="pickCta(preset)"
              >
                {{ preset }}
              </button>
              <button type="button" class="chip" :class="customCta && 'chip-on'" @click="startCustomCta">
                <UIcon name="i-lucide-pencil" class="size-3.5" />
                {{ t('dashboard.qr.custom') }}
              </button>
            </div>
            <UInput v-if="customCta" ref="ctaInput" v-model="cta" maxlength="40" class="mt-2.5 w-full" :placeholder="t('dashboard.qr.customPlaceholder')" />
          </div>

          <!-- Card colour -->
          <div>
            <p class="mb-2.5 text-[13px] font-medium text-muted">{{ t('dashboard.qr.styleLabel') }}</p>
            <div class="flex items-center gap-3">
              <UTooltip v-for="option in styles" :key="option.value" :text="option.label">
                <button
                  type="button"
                  class="size-9 rounded-full ring-offset-2 ring-offset-transparent transition-[box-shadow,transform] active:scale-95"
                  :class="style === option.value ? 'ring-2 ring-[var(--ui-text-highlighted)]' : 'ring-1 ring-black/10 dark:ring-white/15'"
                  :style="{ background: option.colors.background }"
                  :aria-label="option.label"
                  :aria-pressed="style === option.value"
                  @click="style = option.value"
                />
              </UTooltip>
            </div>
          </div>

          <!-- Print or save -->
          <div class="flex gap-2">
            <UButton icon="i-lucide-printer" size="lg" class="flex-1 justify-center" :label="t('dashboard.qr.print')" @click="print" />
            <UDropdownMenu :items="downloadItems" :content="{ align: 'end' }">
              <UButton icon="i-lucide-download" size="lg" color="neutral" variant="outline" :loading="exporting" :label="t('dashboard.qr.download')" />
            </UDropdownMenu>
          </div>

          <p class="flex items-center gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-chart-column" class="size-3.5 shrink-0" />
            {{ t('dashboard.qr.trackingNote') }}
          </p>
        </div>
      </div>
    </template>
  </AppSheet>
</template>

<script setup lang="ts">
import type { BioBlock, ThemeConfig } from '~/types/bio'

const props = defineProps<{
  username: string
  title: string
  themeConfig: ThemeConfig
  /** The page's blocks, to suggest a message that fits it (menu, shop, booking) */
  blocks?: BioBlock[]
}>()

const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()

// Visitors read the card, so its words follow the site language
const siteLang = computed(() => normalizeSiteLanguage(props.themeConfig.language))
// General messages first, then ones that fit what the page offers
const ctaPresets = computed(() => {
  const has = (name: string) => (props.blocks ?? []).some(b => b.name === name && !b.hidden)
  const keys: SiteMessageKey[] = ['qrScan', 'qrConnect']
  if (has('products')) keys.push('qrShop')
  if (has('menu')) keys.push('qrMenu')
  if (has('form')) keys.push('qrBook')
  return keys.map(key => siteT(siteLang.value, key))
})
const cta = ref('')
watch(ctaPresets, presets => (cta.value = presets[0] ?? ''), { immediate: true })

// Own words: a field appears under the choices
const customCta = ref(false)
const ctaInput = ref<{ inputRef?: HTMLInputElement } | null>(null)
function pickCta(preset: string) {
  customCta.value = false
  cta.value = preset
}
function startCustomCta() {
  customCta.value = true
  nextTick(() => ctaInput.value?.inputRef?.select())
}

const downloadItems = computed(() => [[
  { label: t('dashboard.qr.downloadPng'), description: t('dashboard.qr.pngHint'), icon: 'i-lucide-image', onSelect: () => downloadPng() },
  { label: t('dashboard.qr.downloadSvg'), description: t('dashboard.qr.svgHint'), icon: 'i-lucide-file-code', onSelect: () => downloadSvg() },
]])

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

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 2.25rem;
  padding: 0 0.9rem;
  border-radius: 9999px;
  font-size: 14px;
  background: rgb(0 0 0 / 0.045);
  color: var(--ui-text-toned);
  transition: background-color 0.15s, color 0.15s, transform 0.15s;
}
.chip:hover {
  background: rgb(0 0 0 / 0.07);
}
.chip:active {
  transform: scale(0.97);
}
.chip-on,
.chip-on:hover {
  background: var(--ui-bg-inverted);
  color: var(--ui-text-inverted);
}
:global(.dark) .chip {
  background: rgb(255 255 255 / 0.07);
}
</style>
