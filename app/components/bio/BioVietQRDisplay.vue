<template>
  <!-- The themed QR card, then the details to type by hand, each copyable,
       and a clean QR picture to save and open from a banking app -->
  <section class="flex flex-col items-center gap-3">
    <!-- Template previews: a sample until the owner adds their account -->
    <span v-if="sample" class="inline-flex items-center gap-1.5 rounded-full bg-current/10 px-3 py-1 text-xs font-medium">
      <UIcon name="i-lucide-info" class="size-3.5 opacity-70" />{{ t('qrSample') }}
    </span>
    <ClientOnly>
      <QRCodeWithTheme
        :qr-string="data.qrString!"
        :bank-name="data.bankName"
        :account-number="data.accountNumber"
        :account-name="data.accountName"
        :amount="amount"
        :theme-id="data.theme || 'vietnam'"
        class="w-full max-w-xs"
      />
      <template #fallback>
        <div class="aspect-[800/1157] w-full max-w-xs rounded-xl bg-current/5" />
      </template>
    </ClientOnly>

    <div v-if="rows.length && !sample" class="w-full overflow-hidden" :style="cardStyle">
      <dl class="divide-y divide-current/10">
        <div v-for="row in rows" :key="row.key" class="flex items-center gap-3 px-4 py-3">
          <dt class="w-28 shrink-0 text-[13px] opacity-65">{{ row.label }}</dt>
          <dd class="min-w-0 flex-1 truncate text-right text-[15px] font-semibold" :class="row.mono && 'font-mono tracking-wide tabular-nums'">{{ row.value }}</dd>
          <button
            v-if="row.copy"
            type="button"
            class="flex size-8 shrink-0 items-center justify-center rounded-full transition hover:bg-current/10"
            :aria-label="row.copyLabel"
            @click="copy(row.key, row.copy)"
          >
            <UIcon :name="copied === row.key ? 'i-lucide-check' : 'i-lucide-copy'" class="size-4" :class="copied === row.key ? 'text-emerald-500' : 'opacity-60'" />
          </button>
        </div>
      </dl>
      <div class="grid grid-cols-2 gap-2 border-t border-current/10 p-3">
        <button
          type="button"
          class="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold transition active:scale-[0.98]"
          :style="buttonStyle"
          @click="copy('account', data.accountNumber || '')"
        >
          <UIcon :name="copied === 'account' ? 'i-lucide-check' : 'i-lucide-copy'" class="size-4 shrink-0" />
          <span class="truncate">{{ copied === 'account' ? t('qrCopied') : t('qrCopyAccount') }}</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold transition active:scale-[0.98]"
          :style="outlineStyle"
          :disabled="saving"
          @click="saveImage"
        >
          <UIcon :name="saving ? 'i-lucide-loader-circle' : 'i-lucide-download'" class="size-4 shrink-0" :class="saving && 'animate-spin'" />
          <span class="truncate">{{ t('qrSave') }}</span>
        </button>
      </div>
      <p class="px-4 pb-3 text-center text-xs opacity-60">{{ t('qrHint') }}</p>
    </div>

    <!-- "Copied!" for a moment, wherever the page is scrolled -->
    <Transition enter-from-class="opacity-0 translate-y-2" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="copied" class="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center" role="status">
        <span class="rounded-full bg-[#1c1a17]/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur">{{ t('qrCopied') }}</span>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import qrcode from 'qrcode-generator'
import type { VietQRInfo } from '~/types/bio'
import { formatVnd } from '#shared/plans'

const props = defineProps<{
  data: VietQRInfo
  /** Sample details on a template preview: nothing to copy or save */
  sample?: boolean
  cardStyle?: CSSProperties
  /** The page's filled button */
  accentStyle?: CSSProperties
}>()

const { t } = useSiteI18n()

const amount = computed(() => Math.max(0, Math.round(Number(props.data.amount) || 0)))

const rows = computed(() => {
  const d = props.data
  const list: { key: string; label: string; value: string; copy?: string; copyLabel?: string; mono?: boolean }[] = []
  if (d.bankName) list.push({ key: 'bank', label: t('qrBank'), value: d.bankName })
  if (d.accountName) list.push({ key: 'holder', label: t('qrHolder'), value: d.accountName })
  if (d.accountNumber) list.push({ key: 'account', label: t('qrAccountNo'), value: d.accountNumber, copy: d.accountNumber, copyLabel: t('qrCopyAccount'), mono: true })
  if (amount.value) list.push({ key: 'amount', label: t('qrAmount'), value: formatVnd(amount.value), copy: String(amount.value), copyLabel: t('qrAmount') })
  if (d.note) list.push({ key: 'note', label: t('qrNote'), value: d.note, copy: d.note, copyLabel: t('qrCopyNote') })
  return list
})

const radius = computed(() => `calc(${String(props.cardStyle?.borderRadius || '16px')} * 0.6)`)
const buttonStyle = computed<CSSProperties>(() => ({ ...props.accentStyle, borderRadius: radius.value }))
const outlineStyle = computed<CSSProperties>(() => ({ border: '1.5px solid currentColor', borderRadius: radius.value, opacity: 0.9 }))

const copied = ref('')
let copiedTimer: ReturnType<typeof setTimeout> | undefined
async function copy(key: string, text: string) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Older browsers: a hidden field
    const field = document.createElement('textarea')
    field.value = text
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    document.execCommand('copy')
    field.remove()
  }
  copied.value = key
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = ''), 1600)
}

// A clean card to keep in the photo library: the QR, then bank, account,
// holder, amount and note, which banking apps can read from the picture
const saving = ref(false)
async function saveImage() {
  const d = props.data
  if (!d.qrString || saving.value) return
  saving.value = true
  try {
    const qr = qrcode(0, 'M')
    qr.addData(d.qrString)
    qr.make()
    const count = qr.getModuleCount()
    const W = 900
    const cell = Math.floor(620 / count)
    const qrSize = cell * count
    const lines = [d.bankName, d.accountNumber, d.accountName, amount.value ? formatVnd(amount.value) : '', d.note].filter(Boolean) as string[]
    const H = 140 + qrSize + 60 + lines.length * 58 + 90
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#1c1a17'
    ctx.textAlign = 'center'
    ctx.font = '600 34px system-ui, -apple-system, sans-serif'
    ctx.fillText('VietQR', W / 2, 84)
    const left = (W - qrSize) / 2
    const top = 120
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) ctx.fillRect(left + c * cell, top + r * cell, cell, cell)
      }
    }
    let y = top + qrSize + 80
    lines.forEach((line, i) => {
      ctx.font = i === 1 ? '700 40px ui-monospace, Menlo, monospace' : '500 32px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = i === 1 ? '#1c1a17' : '#57534e'
      ctx.fillText(line, W / 2, y)
      y += 58
    })
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
    if (!blob) return
    const name = `vietqr-${d.accountNumber || 'qr'}.png`
    const file = new File([blob], name, { type: 'image/png' })
    // Phones: the share sheet has "Save image"
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] })
        return
      } catch {
        // Cancelled: fall through to a download
      }
    }
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = name
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } finally {
    saving.value = false
  }
}
</script>
