<template>
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition duration-200" leave-active-class="transition duration-150">
      <div v-if="product" class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-[2px] sm:items-center sm:p-4" @click.self="closeOrder">
        <div class="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white text-[#1c1a17] shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true">
          <div class="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/95 px-5 py-3.5 backdrop-blur">
            <p class="font-semibold">{{ t('orderTitle') }}</p>
            <button type="button" class="flex size-8 items-center justify-center rounded-full hover:bg-black/5" aria-label="Close" @click="closeOrder">
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </div>

          <!-- Placed -->
          <div v-if="placed" class="space-y-4 p-5 text-center">
            <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <UIcon name="i-lucide-check" class="size-6" />
            </div>
            <div>
              <p class="text-lg font-semibold">{{ t('orderPlaced', { code: placed.code }) }}</p>
              <p class="mt-1 text-sm text-black/60">{{ t('orderPlacedText') }}</p>
            </div>
            <template v-if="placed.transfer">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="mx-auto size-52 rounded-2xl bg-white p-2 ring-1 ring-black/10" v-html="qrSvg(placed.transfer.qrString)" />
              <p class="text-xs text-black/60">{{ t('orderScan', { code: placed.transfer.note }) }}</p>
              <dl class="divide-y divide-black/5 rounded-xl bg-black/[0.03] text-left text-sm">
                <div class="flex justify-between gap-3 px-3 py-2"><dt class="text-black/55">{{ placed.transfer.bankName }}</dt><dd class="font-medium">{{ placed.transfer.accountNumber }}</dd></div>
                <div v-if="placed.transfer.accountName" class="flex justify-between gap-3 px-3 py-2"><dt class="text-black/55">&nbsp;</dt><dd class="font-medium">{{ placed.transfer.accountName }}</dd></div>
                <div v-if="placed.transfer.amount" class="flex justify-between gap-3 px-3 py-2"><dt class="text-black/55">{{ t('orderTotal') }}</dt><dd class="font-semibold">{{ formatVnd(placed.transfer.amount) }}</dd></div>
                <div class="flex justify-between gap-3 px-3 py-2"><dt class="text-black/55">{{ t('orderMemo') }}</dt><dd class="font-mono font-semibold">{{ placed.transfer.note }}</dd></div>
              </dl>
            </template>
          </div>

          <!-- Form -->
          <form v-else-if="product" class="space-y-4 p-5" @submit.prevent="placeOrder">
            <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" class="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true">

            <div class="flex items-center gap-3">
              <img v-if="product.imageUrl" :src="product.imageUrl" alt="" class="size-14 shrink-0 rounded-xl object-cover">
              <div class="min-w-0 flex-1">
                <p class="line-clamp-2 font-medium leading-snug">{{ product.name }}</p>
                <p v-if="product.price" class="text-sm text-black/60 tabular-nums">{{ formatVnd(product.price) }}</p>
              </div>
              <!-- Quantity -->
              <div class="flex shrink-0 items-center rounded-full ring-1 ring-black/10" :aria-label="t('orderQuantity')">
                <button type="button" class="flex size-8 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-30" :disabled="form.quantity <= 1" @click="form.quantity--">
                  <UIcon name="i-lucide-minus" class="size-3.5" />
                </button>
                <span class="w-6 text-center text-sm font-semibold tabular-nums">{{ form.quantity }}</span>
                <button type="button" class="flex size-8 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-30" :disabled="form.quantity >= 99" @click="form.quantity++">
                  <UIcon name="i-lucide-plus" class="size-3.5" />
                </button>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <label class="block">
                <span :class="labelClass">{{ t('formName') }} *</span>
                <input v-model="form.name" required maxlength="120" autocomplete="name" :class="inputClass">
              </label>
              <label class="block">
                <span :class="labelClass">{{ t('orderPhone') }} *</span>
                <input v-model="form.phone" required type="tel" minlength="6" maxlength="40" autocomplete="tel" :class="inputClass">
              </label>
            </div>
            <label v-if="data.askAddress" class="block">
              <span :class="labelClass">{{ t('orderAddress') }} *</span>
              <textarea v-model="form.address" required rows="2" maxlength="500" autocomplete="street-address" :class="inputClass" />
            </label>
            <label class="block">
              <span :class="labelClass">{{ t('orderNote') }}</span>
              <input v-model="form.note" maxlength="1000" :class="inputClass">
            </label>

            <!-- Payment -->
            <fieldset v-if="paymentOptions.length > 1">
              <legend :class="labelClass">{{ t('orderPayment') }}</legend>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="option in paymentOptions"
                  :key="option.value"
                  class="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm ring-1 transition"
                  :class="form.payment === option.value ? 'bg-black/[0.04] ring-2 ring-black' : 'ring-black/10'"
                >
                  <input v-model="form.payment" type="radio" :value="option.value" class="sr-only">
                  <UIcon :name="option.icon" class="size-4 shrink-0" />
                  <span class="leading-tight">{{ option.label }}</span>
                </label>
              </div>
            </fieldset>

            <div v-if="product.price" class="flex items-baseline justify-between border-t border-black/5 pt-3">
              <span class="text-sm text-black/60">{{ t('orderTotal') }}</span>
              <span class="text-lg font-bold tabular-nums">{{ formatVnd(product.price * form.quantity) }}</span>
            </div>

            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
            <p v-if="preview" class="text-xs text-black/50">{{ t('orderPreview') }}</p>

            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-full bg-[#1c1a17] px-4 py-3 text-[15px] font-semibold text-white disabled:opacity-50"
              :disabled="sending || preview"
            >
              <UIcon v-if="sending" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ t('orderPlace') }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import qrcode from 'qrcode-generator'
import type { ProductItem, ProductsBlock } from '~/types/bio'
import { formatVnd } from '#shared/plans'

// Order form for one product (products block on the page, or a product
// stand in the 3D room): quantity, contact, address, COD or transfer; after
// ordering, the VietQR to pay when paying by transfer
const props = defineProps<{
  data: Pick<ProductsBlock['data'], 'askAddress' | 'payment'>
  blockId: string
  username: string
  /** Editor previews never order */
  preview?: boolean
  /** The page has a bank account (VietQR block) to pay by transfer */
  canTransfer?: boolean
}>()
const product = defineModel<ProductItem | null>('product', { default: null })

const { t } = useSiteI18n()

interface Placed {
  code: string
  transfer: { qrString: string; bankName: string; accountNumber: string; accountName: string; amount: number; note: string } | null
}
const placed = ref<Placed | null>(null)
const sending = ref(false)
const error = ref('')
const form = reactive({ quantity: 1, name: '', phone: '', address: '', note: '', payment: 'cod' as 'cod' | 'transfer', website: '' })

const PAYMENT_LABELS = {
  cod: { label: () => t('orderCod'), icon: 'i-lucide-truck' },
  transfer: { label: () => t('orderTransfer'), icon: 'i-lucide-landmark' },
}
const paymentOptions = computed(() =>
  productPaymentOptions(props.data.payment, props.canTransfer).map(value => ({ value, label: PAYMENT_LABELS[value].label(), icon: PAYMENT_LABELS[value].icon })),
)

// A fresh form for each product
watch(product, (item) => {
  if (!item) return
  placed.value = null
  error.value = ''
  form.quantity = 1
  form.payment = paymentOptions.value[0]?.value ?? 'cod'
})

function closeOrder() {
  product.value = null
  placed.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && product.value) closeOrder()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

async function placeOrder() {
  if (!product.value || props.preview || sending.value) return
  sending.value = true
  error.value = ''
  try {
    const res = await $fetch<Placed>(`/api/bio/${props.username}/order`, {
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
    placed.value = res
  } catch (e: any) {
    error.value = e?.data?.statusMessage && e?.statusCode !== 500 ? e.data.statusMessage : t('orderError')
  } finally {
    sending.value = false
  }
}

function qrSvg(text: string) {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })
}

// Neutral fields on the white sheet
const labelClass = 'mb-1.5 block text-xs font-medium text-black/60'
const inputClass = 'w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5'
</script>
