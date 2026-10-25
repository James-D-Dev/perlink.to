<template>
  <UModal v-model:open="open" :title="title" :ui="{ content: 'max-w-md' }">
    <template #body>
      <!-- Paid -->
      <div v-if="paid" class="flex flex-col items-center py-4 text-center">
        <div class="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <UIcon name="i-lucide-check" class="size-7" />
        </div>
        <p class="mt-4 text-lg font-semibold text-ink">{{ t('dashboard.billing.checkout.paidTitle') }}</p>
        <p class="mt-1 text-sm text-ink-muted">{{ t('dashboard.billing.checkout.paidText', { plan: planName, date: formatDate(paid.expiresAt) }) }}</p>
      </div>

      <div v-else-if="loading" class="flex justify-center py-16">
        <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-ink-muted" />
      </div>

      <div v-else-if="transfer" class="space-y-4">
        <!-- QR -->
        <div class="flex flex-col items-center">
          <div class="rounded-2xl bg-white p-3 ring-1 ring-line">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="size-52" v-html="qrSvg" />
          </div>
          <p class="mt-2 text-xs text-ink-muted">{{ t('dashboard.billing.checkout.scan') }}</p>
        </div>

        <!-- Manual transfer -->
        <div>
          <p class="mb-2 text-xs font-medium text-ink-muted">{{ t('dashboard.billing.checkout.manual') }}</p>
          <dl class="divide-y divide-line overflow-hidden rounded-xl bg-sand/50 text-sm ring-1 ring-line">
            <div v-for="row in rows" :key="row.label" class="flex items-center justify-between gap-3 px-3 py-2">
              <dt class="text-ink-muted">{{ row.label }}</dt>
              <dd class="flex min-w-0 items-center gap-1.5 font-medium text-ink">
                <span class="truncate" :class="row.strong && 'font-mono text-base tracking-wide'">{{ row.value }}</span>
                <UButton v-if="row.copy" size="xs" color="neutral" variant="ghost" icon="i-lucide-copy" :aria-label="row.label" @click="copy(row.copy)" />
              </dd>
            </div>
          </dl>
          <p class="mt-2 text-xs text-amber-700">{{ t('dashboard.billing.checkout.noteHint') }}</p>
        </div>

        <!-- Waiting -->
        <div class="flex items-start gap-2.5 rounded-xl bg-paper px-3 py-2.5 ring-1 ring-line">
          <UIcon name="i-lucide-loader-circle" class="mt-0.5 size-4 shrink-0 animate-spin text-ink-muted" />
          <div class="text-xs">
            <p class="font-medium text-ink">{{ t('dashboard.billing.checkout.waiting') }}</p>
            <p class="mt-0.5 text-ink-muted">{{ t('dashboard.billing.checkout.waitingHint') }}</p>
          </div>
        </div>
      </div>
    </template>

    <template v-if="paid" #footer>
      <UButton block :label="t('dashboard.billing.checkout.done')" @click="open = false" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import qrcode from 'qrcode-generator'
import { formatVnd, type BillingPeriod, type PaidPlanId } from '#shared/plans'

// Pay for a plan by bank transfer: VietQR plus the details to type by hand,
// then wait for the bank webhook to mark it paid
const props = defineProps<{
  plan: PaidPlanId
  period: BillingPeriod
}>()
const emit = defineEmits<{ paid: [] }>()
const open = defineModel<boolean>('open', { default: false })

const { t, locale } = useI18n()
const toast = useToast()
const { refresh } = useBilling()

interface Transfer { qrString: string; bankName: string; accountNumber: string; accountName: string; amount: number; note: string }

const loading = ref(false)
const paymentId = ref<string | null>(null)
const transfer = ref<Transfer | null>(null)
const paid = ref<{ expiresAt: string } | null>(null)

const planName = computed(() => t(`dashboard.billing.plans.${props.plan}.name`))
const title = computed(() =>
  `${t('dashboard.billing.checkout.title', { plan: planName.value })} · ${t(props.period === 'annual' ? 'dashboard.billing.checkout.periodAnnual' : 'dashboard.billing.checkout.periodMonthly')}`,
)

const qrSvg = computed(() => {
  if (!transfer.value) return ''
  const qr = qrcode(0, 'M')
  qr.addData(transfer.value.qrString)
  qr.make()
  return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })
})

const rows = computed(() => {
  const tr = transfer.value
  if (!tr) return []
  return [
    { label: t('dashboard.billing.checkout.bank'), value: tr.bankName },
    { label: t('dashboard.billing.checkout.account'), value: tr.accountNumber, copy: tr.accountNumber },
    ...(tr.accountName ? [{ label: t('dashboard.billing.checkout.accountName'), value: tr.accountName }] : []),
    { label: t('dashboard.billing.checkout.amount'), value: formatVnd(tr.amount), copy: String(tr.amount) },
    { label: t('dashboard.billing.checkout.note'), value: tr.note, copy: tr.note, strong: true },
  ]
})

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-GB')

function copy(text: string) {
  navigator.clipboard.writeText(text)
  toast.add({ title: t('dashboard.billing.checkout.copied'), description: text })
}

async function start() {
  loading.value = true
  paid.value = null
  transfer.value = null
  try {
    const res = await $fetch<{ id: string; transfer: Transfer | null }>('/api/billing/checkout', {
      method: 'POST',
      body: { plan: props.plan, period: props.period },
    })
    paymentId.value = res.id
    transfer.value = res.transfer
  } catch (error: any) {
    toast.add({ title: t('dashboard.billing.checkout.failed'), description: error?.data?.statusMessage, color: 'error' })
    open.value = false
  } finally {
    loading.value = false
  }
}

// Ask every few seconds while the dialog is open
let timer: ReturnType<typeof setInterval> | null = null
function stopPolling() {
  if (timer) clearInterval(timer)
  timer = null
}
function startPolling() {
  stopPolling()
  timer = setInterval(async () => {
    if (!paymentId.value || paid.value) return
    try {
      const res = await $fetch<{ status: string; expiresAt?: string }>(`/api/billing/payments/${paymentId.value}`)
      if (res.status === 'paid') {
        paid.value = { expiresAt: res.expiresAt ?? new Date().toISOString() }
        stopPolling()
        await refresh()
        emit('paid')
      }
    } catch {
      // Try again on the next tick
    }
  }, 4000)
}

watch(open, (isOpen) => {
  if (isOpen) {
    start()
    startPolling()
  } else {
    stopPolling()
  }
}, { immediate: true })
onBeforeUnmount(stopPolling)
</script>
