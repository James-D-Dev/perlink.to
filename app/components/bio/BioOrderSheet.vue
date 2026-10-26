<template>
  <!-- A bottom sheet you can drag down on phones, a dialog on larger screens -->
  <AppSheet v-model:open="open" :title="placed ? t('orderSuccess') : t('orderTitle')" :ui="{ content: 'sm:max-w-[440px] overflow-hidden' }" @after:leave="onClosed">
    <template #content>
      <div v-if="product" class="relative flex min-h-0 flex-1 flex-col overflow-hidden text-[#1c1a17]" :style="{ '--accent': accentColor }">
          <button
            type="button"
            class="absolute right-3.5 top-3.5 z-20 flex size-8 items-center justify-center rounded-full bg-black/[0.06] text-black/55 transition hover:bg-black/10 hover:text-black"
            aria-label="Close"
            @click="closeOrder"
          >
            <UIcon name="i-lucide-x" class="size-[18px]" />
          </button>

          <!-- ───────── Placed ───────── -->
          <div v-if="placed" class="min-h-0 flex-1 overflow-y-auto">
            <div class="px-6 pb-2 pt-9 text-center">
              <div class="success-mark mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_30px_-8px] shadow-emerald-500/60">
                <UIcon name="i-lucide-check" class="size-8 stroke-[3]" />
              </div>
              <h2 class="mt-5 text-[22px] font-bold tracking-tight">{{ t('orderSuccess') }}</h2>
              <p class="mt-1.5 text-[15px] text-black/55">{{ t('orderPlacedText') }}</p>
              <button
                type="button"
                class="glass-cell mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:bg-white"
                @click="copy(placed.code)"
              >
                <span class="text-black/50">{{ t('orderCode') }}</span>
                <span class="font-mono font-bold tracking-wide">{{ placed.code }}</span>
                <UIcon :name="copied === placed.code ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5 text-black/40" />
              </button>
            </div>

            <!-- Transfer: QR and the details to type by hand -->
            <section v-if="placed.transfer" class="mx-4 mt-5 overflow-hidden rounded-3xl glass-cell">
              <div class="flex items-center gap-2 border-b border-black/[0.06] px-5 py-3.5">
                <UIcon name="i-lucide-landmark" class="size-[18px] text-[var(--accent)]" />
                <h3 class="text-[15px] font-semibold">{{ t('orderPayTitle') }}</h3>
                <span class="ml-auto text-lg font-bold tabular-nums">{{ formatVnd(placed.transfer.amount) }}</span>
              </div>
              <div class="px-5 pb-5 pt-4">
                <ol class="mb-4 space-y-2 text-[13px] text-black/65">
                  <li class="flex gap-2.5"><span class="step">1</span>{{ t('orderStep1') }}</li>
                  <li class="flex gap-2.5"><span class="step">2</span>{{ t('orderStep2', { code: placed.transfer.note }) }}</li>
                </ol>
                <div class="mx-auto w-[220px] rounded-2xl bg-white p-3 ring-1 ring-black/10">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="aspect-square w-full" v-html="qrSvg(placed.transfer.qrString)" />
                  <p class="mt-2 text-center text-[11px] font-semibold tracking-[0.18em] text-black/40">VIETQR</p>
                </div>
                <div class="mt-2 flex justify-center">
                  <a :href="qrImage(placed.transfer.qrString)" :download="`${placed.code}.gif`" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-black/60 transition hover:bg-black/5 hover:text-black">
                    <UIcon name="i-lucide-download" class="size-3.5" />
                    {{ t('orderSaveQr') }}
                  </a>
                </div>
                <dl class="mt-3 divide-y divide-black/[0.06] rounded-2xl bg-black/[0.035] text-sm">
                  <div v-for="row in transferRows" :key="row.label" class="flex items-center gap-3 px-4 py-2.5">
                    <dt class="w-24 shrink-0 text-black/50">{{ row.label }}</dt>
                    <dd class="min-w-0 flex-1 truncate text-right font-semibold" :class="row.mono && 'font-mono tracking-wide'">{{ row.value }}</dd>
                    <button v-if="row.copy" type="button" class="flex size-7 shrink-0 items-center justify-center rounded-full text-black/40 transition hover:bg-black/5 hover:text-black" :aria-label="row.label" @click="copy(row.copy)">
                      <UIcon :name="copied === row.copy ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5" />
                    </button>
                  </div>
                </dl>
              </div>
            </section>

            <!-- Receipt -->
            <section class="mx-4 mt-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/[0.06]">
              <h3 class="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">{{ t('orderSummary') }}</h3>
              <div class="mt-3 flex items-center gap-3">
                <img v-if="placed.product.imageUrl" :src="placed.product.imageUrl" alt="" class="size-12 shrink-0 rounded-xl object-cover">
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium">{{ placed.product.name }}</p>
                  <p class="text-sm text-black/50 tabular-nums">× {{ placed.quantity }}</p>
                </div>
                <p v-if="placed.total" class="font-semibold tabular-nums">{{ formatVnd(placed.total) }}</p>
              </div>
              <dl class="mt-4 space-y-2 border-t border-dashed border-black/10 pt-4 text-sm">
                <div class="flex gap-3"><dt class="w-24 shrink-0 text-black/50">{{ t('orderPayment') }}</dt><dd>{{ placed.payment === 'transfer' ? t('orderTransfer') : t('orderCod') }}</dd></div>
                <div class="flex gap-3"><dt class="w-24 shrink-0 text-black/50">{{ t('orderName') }}</dt><dd class="min-w-0 break-words">{{ placed.name }} · {{ placed.phone }}</dd></div>
                <div v-if="placed.address" class="flex gap-3"><dt class="w-24 shrink-0 text-black/50">{{ t('orderAddress') }}</dt><dd class="min-w-0 break-words">{{ placed.address }}</dd></div>
              </dl>
            </section>
            <p class="px-6 pb-4 pt-3 text-center text-xs text-black/40">{{ t('orderScreenshot') }}</p>

            <div class="sticky bottom-0 border-t border-black/[0.06] bg-white/50 p-4 backdrop-blur-xl">
              <button type="button" class="cta" @click="closeOrder">{{ t('orderDone') }}</button>
            </div>
          </div>

          <!-- ───────── Form ───────── -->
          <form v-else class="flex min-h-0 flex-1 flex-col" novalidate @submit.prevent="placeOrder">
            <div class="min-h-0 flex-1 overflow-y-auto pb-4">
              <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" class="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true">

              <!-- Product -->
              <div class="px-5 pb-5 pt-8 sm:pt-6">
                <p class="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/40">{{ t('orderTitle') }}</p>
                <div class="flex items-center gap-3.5 rounded-3xl bg-white p-3 pr-4 shadow-sm ring-1 ring-black/[0.06]">
                  <div class="size-[72px] shrink-0 overflow-hidden rounded-2xl bg-black/5">
                    <img v-if="product.imageUrl" :src="product.imageUrl" alt="" class="size-full object-cover">
                    <UIcon v-else name="i-lucide-shopping-bag" class="m-6 size-6 text-black/30" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="line-clamp-2 text-[15px] font-semibold leading-snug">{{ product.name }}</p>
                    <p v-if="product.price" class="mt-1 flex items-baseline gap-1.5 tabular-nums">
                      <span class="font-bold text-[var(--accent)]">{{ formatVnd(product.price) }}</span>
                      <span v-if="(product.comparePrice ?? 0) > product.price" class="text-xs text-black/35 line-through">{{ formatVnd(product.comparePrice!) }}</span>
                    </p>
                  </div>
                  <div class="flex shrink-0 flex-col items-center rounded-2xl bg-[#f5f4f2] p-1" :aria-label="t('orderQuantity')">
                    <button type="button" class="qty" :disabled="form.quantity >= 99" :aria-label="'+'" @click="form.quantity++">
                      <UIcon name="i-lucide-plus" class="size-3.5" />
                    </button>
                    <span class="w-8 py-0.5 text-center text-[15px] font-bold tabular-nums">{{ form.quantity }}</span>
                    <button type="button" class="qty" :disabled="form.quantity <= 1" :aria-label="'−'" @click="form.quantity--">
                      <UIcon name="i-lucide-minus" class="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contact -->
              <section class="px-5">
                <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/40">{{ t('orderContact') }}</h3>
                <div class="overflow-hidden rounded-3xl glass-cell">
                  <label class="field">
                    <UIcon name="i-lucide-user-round" class="field-icon" />
                    <input v-model="form.name" required maxlength="120" autocomplete="name" :placeholder="`${t('orderName')} *`" class="field-input">
                  </label>
                  <label class="field" :class="phoneError && 'field-error'">
                    <UIcon name="i-lucide-phone" class="field-icon" />
                    <input v-model="form.phone" required type="tel" inputmode="tel" maxlength="40" autocomplete="tel" :placeholder="`${t('orderPhone')} *`" class="field-input" @blur="phoneTouched = true">
                  </label>
                  <label v-if="data.askAddress" class="field field-top">
                    <UIcon name="i-lucide-map-pin" class="field-icon mt-[0.95rem]" />
                    <textarea v-model="form.address" required rows="2" maxlength="500" autocomplete="street-address" :placeholder="`${t('orderAddress')} *`" class="field-input resize-none py-3" />
                  </label>
                  <label class="field">
                    <UIcon name="i-lucide-message-square-text" class="field-icon" />
                    <input v-model="form.note" maxlength="1000" :placeholder="t('orderNote')" class="field-input">
                  </label>
                </div>
                <p v-if="phoneError" class="mt-2 flex items-center gap-1.5 px-1 text-[13px] text-red-600">
                  <UIcon name="i-lucide-circle-alert" class="size-3.5" />
                  {{ t('orderPhoneInvalid') }}
                </p>
              </section>

              <!-- Payment -->
              <section class="mt-6 px-5">
                <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/40">{{ t('orderPayment') }}</h3>
                <div class="space-y-2">
                  <label
                    v-for="option in paymentOptions"
                    :key="option.value"
                    class="flex cursor-pointer items-center gap-3.5 rounded-3xl bg-white p-4 shadow-sm ring-1 transition"
                    :class="form.payment === option.value ? 'ring-2 ring-[var(--accent)]' : 'ring-black/[0.06] hover:ring-black/15'"
                  >
                    <input v-model="form.payment" type="radio" :value="option.value" class="sr-only">
                    <span class="flex size-11 shrink-0 items-center justify-center rounded-2xl" :class="form.payment === option.value ? 'bg-[var(--accent)] text-white' : 'bg-[#f5f4f2] text-black/60'">
                      <UIcon :name="option.icon" class="size-5" />
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block text-[15px] font-semibold">{{ option.label }}</span>
                      <span class="block text-[13px] text-black/50">{{ option.hint }}</span>
                    </span>
                    <span class="flex size-5 shrink-0 items-center justify-center rounded-full ring-2" :class="form.payment === option.value ? 'bg-[var(--accent)] ring-[var(--accent)]' : 'ring-black/15'">
                      <span v-if="form.payment === option.value" class="size-2 rounded-full bg-white" />
                    </span>
                  </label>
                </div>
              </section>

              <p v-if="error" class="mx-5 mt-4 flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3 text-[13px] text-red-700 ring-1 ring-red-100">
                <UIcon name="i-lucide-circle-alert" class="mt-0.5 size-4 shrink-0" />
                {{ error }}
              </p>
              <p v-if="preview" class="mx-5 mt-4 text-center text-xs text-black/45">{{ t('orderPreview') }}</p>
            </div>

            <!-- Total and order -->
            <div class="border-t border-black/[0.06] bg-white/50 px-5 pb-5 pt-4 backdrop-blur-xl">
              <div v-if="product.price" class="mb-3 flex items-baseline justify-between">
                <span class="text-sm text-black/55">{{ t('orderTotal') }} · {{ form.quantity }} × {{ formatVnd(product.price) }}</span>
                <span class="text-xl font-bold tabular-nums">{{ formatVnd(product.price * form.quantity) }}</span>
              </div>
              <button type="submit" class="cta" :disabled="sending || preview || !canSubmit">
                <UIcon v-if="sending" name="i-lucide-loader-circle" class="size-5 animate-spin" />
                <template v-else>
                  <UIcon name="i-lucide-shopping-bag" class="size-[18px]" />
                  {{ t('orderPlace') }}<template v-if="product.price"> · {{ formatVnd(product.price * form.quantity) }}</template>
                </template>
              </button>
            </div>
          </form>
      </div>
    </template>
  </AppSheet>
</template>

<script setup lang="ts">
import qrcode from 'qrcode-generator'
import type { ProductItem, ProductsBlock } from '~/types/bio'
import { formatVnd } from '#shared/plans'

// Order form for one product (products block on the page, or a product
// stand in the 3D room): quantity, contact, address, COD or transfer; after
// ordering, a receipt and, when paying by transfer, the VietQR to pay
const props = defineProps<{
  data: Pick<ProductsBlock['data'], 'askAddress' | 'payment'>
  blockId: string
  username: string
  /** Editor previews never order */
  preview?: boolean
  /** The page has a bank account (VietQR block) to pay by transfer */
  canTransfer?: boolean
  /** The site's accent colour for the button and highlights; with several, the first dark enough to carry white text */
  accent?: string | (string | undefined)[]
}>()
const product = defineModel<ProductItem | null>('product', { default: null })

const { t } = useSiteI18n()

interface Transfer { qrString: string; bankName: string; accountNumber: string; accountName: string; amount: number; note: string }
interface Placed {
  code: string
  total: number
  transfer: Transfer | null
  // What was ordered, for the receipt
  product: ProductItem
  quantity: number
  payment: 'cod' | 'transfer'
  name: string
  phone: string
  address: string
}
const placed = ref<Placed | null>(null)
const sending = ref(false)
const error = ref('')
const phoneTouched = ref(false)
const copied = ref('')
const form = reactive({ quantity: 1, name: '', phone: '', address: '', note: '', payment: 'cod' as 'cod' | 'transfer', website: '' })

// White text goes on the accent, so very light colours (and anything that
// isn't a plain hex colour) fall back to ink
const accentColor = computed(() => {
  const candidates = Array.isArray(props.accent) ? props.accent : [props.accent]
  for (const value of candidates) {
    const hex = value?.trim()
    if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) continue
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
    if (0.299 * r! + 0.587 * g! + 0.114 * b! <= 200) return hex
  }
  return '#1c1a17'
})

const PAYMENT_LABELS = {
  cod: { label: () => t('orderCod'), hint: () => t('orderCodHint'), icon: 'i-lucide-truck' },
  transfer: { label: () => t('orderTransfer'), hint: () => t('orderTransferHint'), icon: 'i-lucide-qr-code' },
}
const paymentOptions = computed(() =>
  productPaymentOptions(props.data.payment, props.canTransfer).map(value => ({
    value,
    label: PAYMENT_LABELS[value].label(),
    hint: PAYMENT_LABELS[value].hint(),
    icon: PAYMENT_LABELS[value].icon,
  })),
)

const phoneValid = computed(() => /^[+\d][\d\s.-]{7,}$/.test(form.phone.trim()))
const phoneError = computed(() => phoneTouched.value && !!form.phone.trim() && !phoneValid.value)
const canSubmit = computed(() => !!form.name.trim() && phoneValid.value && (!props.data.askAddress || !!form.address.trim()))

const transferRows = computed(() => {
  const tr = placed.value?.transfer
  if (!tr) return []
  return [
    { label: tr.bankName, value: tr.accountNumber, copy: tr.accountNumber, mono: true },
    ...(tr.accountName ? [{ label: t('orderAccount'), value: tr.accountName }] : []),
    { label: t('orderTotal'), value: formatVnd(tr.amount), copy: String(tr.amount) },
    { label: t('orderMemo'), value: tr.note, copy: tr.note, mono: true },
  ] as { label: string; value: string; copy?: string; mono?: boolean }[]
})

// A fresh form for each product
watch(product, (item) => {
  if (!item) return
  placed.value = null
  error.value = ''
  phoneTouched.value = false
  form.quantity = 1
  form.payment = paymentOptions.value[0]?.value ?? 'cod'
})

// The product stays until the sheet has slid away, so it doesn't empty mid-way
const open = ref(false)
watch(product, item => (open.value = !!item), { immediate: true })

function closeOrder() {
  open.value = false
}

function onClosed() {
  product.value = null
  placed.value = null
}

async function placeOrder() {
  phoneTouched.value = true
  if (!product.value || props.preview || sending.value || !canSubmit.value) return
  sending.value = true
  error.value = ''
  try {
    const res = await $fetch<{ code: string; total: number; transfer: Transfer | null }>(`/api/bio/${props.username}/order`, {
      method: 'POST',
      body: {
        blockId: props.blockId,
        productId: product.value.id,
        quantity: form.quantity,
        name: form.name,
        phone: form.phone,
        address: props.data.askAddress ? form.address : undefined,
        note: form.note || undefined,
        payment: form.payment,
        website: form.website,
      },
    })
    placed.value = {
      ...res,
      product: product.value,
      quantity: form.quantity,
      payment: form.payment,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: props.data.askAddress ? form.address.trim() : '',
    }
  } catch (e: any) {
    error.value = e?.data?.statusMessage && e?.statusCode !== 500 ? e.data.statusMessage : t('orderError')
  } finally {
    sending.value = false
  }
}

function copy(text: string) {
  navigator.clipboard?.writeText(text)
  copied.value = text
  setTimeout(() => {
    if (copied.value === text) copied.value = ''
  }, 1500)
}

function qrCode(text: string) {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  return qr
}
const qrSvg = (text: string) => qrCode(text).createSvgTag({ cellSize: 4, margin: 0, scalable: true })
/** A picture of the QR to save in the photo library and open in a banking app */
const qrImage = (text: string) => qrCode(text).createDataURL(8, 4)
</script>

<style scoped>
.field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
  transition: background-color 0.15s;
}
.field:last-child {
  border-bottom: 0;
}
.field-top {
  align-items: flex-start;
}
.field:focus-within {
  background: rgb(0 0 0 / 0.015);
}
.field-error {
  background: rgb(254 242 242);
}
.field-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  color: rgb(0 0 0 / 0.35);
}
.field:focus-within .field-icon {
  color: var(--accent);
}
.field-input {
  min-width: 0;
  flex: 1;
  background: transparent;
  padding: 0.95rem 0;
  font-size: 15px;
  outline: none;
}
.field-input::placeholder {
  color: rgb(0 0 0 / 0.38);
}
.qty {
  display: flex;
  width: 2rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  transition: background-color 0.15s;
}
.qty:hover:not(:disabled) {
  background: white;
}
.qty:disabled {
  opacity: 0.3;
}
.cta {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 9999px;
  background: var(--accent);
  padding: 0.95rem 1.25rem;
  font-size: 15px;
  font-weight: 700;
  color: white;
  box-shadow: 0 12px 24px -12px var(--accent);
  transition: transform 0.15s, opacity 0.15s;
}
.cta:active:not(:disabled) {
  transform: scale(0.98);
}
.cta:disabled {
  opacity: 0.45;
  box-shadow: none;
}
.step {
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: var(--accent);
  font-size: 11px;
  font-weight: 700;
  color: white;
}
.success-mark {
  animation: pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes pop {
  from { transform: scale(0.4); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .success-mark { animation: none; }
}
</style>
