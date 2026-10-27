<template>
  <AppSheet v-model:open="open" :title="title" :ui="{ content: 'max-w-md' }">
    <template #body>
      <!-- Paid -->
      <div v-if="paid" class="flex flex-col items-center py-4 text-center">
        <div class="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <UIcon name="i-lucide-check" class="size-7" />
        </div>
        <p class="mt-4 text-lg font-semibold text-ink">{{ t('dashboard.billing.checkout.paidTitle') }}</p>
        <p class="mt-1 text-sm text-ink-muted">{{ t('dashboard.billing.checkout.paidText', { plan: planName, date: formatDate(paid.expiresAt) }) }}</p>
      </div>

      <template v-else>
        <!-- Bank transfer or crypto, when both are set up -->
        <div v-if="methods.length > 1" class="mb-4 grid grid-cols-2 gap-1 rounded-full bg-sand/70 p-1">
          <button
            v-for="m in methods"
            :key="m"
            type="button"
            class="flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition"
            :class="method === m ? 'bg-paper text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
            @click="method = m"
          >
            <UIcon v-if="m === 'bank'" name="i-lucide-landmark" class="size-4 shrink-0" />
            <!-- USDC and USDT logos, stacked -->
            <span v-else class="flex shrink-0 -space-x-1.5">
              <UIcon :name="CRYPTO_TOKEN_ICONS.USDC" class="size-[18px] rounded-full ring-2 ring-paper" />
              <UIcon :name="CRYPTO_TOKEN_ICONS.USDT" class="size-[18px] rounded-full ring-2 ring-paper" />
            </span>
            <span class="truncate">{{ m === 'bank' ? t('dashboard.billing.checkout.methodBank') : t('dashboard.billing.checkout.methodCrypto') }}</span>
          </button>
        </div>

        <!-- One fixed height for every tab and state, so switching doesn't
             make the sheet jump; long content scrolls inside -->
        <div class="-mx-1 h-[min(34rem,60dvh)] overflow-y-auto px-1">
        <div v-if="loading" class="flex h-full items-center justify-center">
          <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-ink-muted" />
        </div>

        <!-- Not confirmed: say so, with the code to quote and a way to send it again -->
        <div v-else-if="status === 'rejected'" class="flex flex-col items-center py-4 text-center">
          <div class="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <UIcon name="i-lucide-circle-alert" class="size-7" />
          </div>
          <p class="mt-4 text-lg font-semibold text-ink">{{ t('dashboard.billing.checkout.rejectedTitle') }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ t('dashboard.billing.checkout.rejectedText') }}</p>
          <p class="mt-3 font-mono text-sm font-semibold tracking-wide text-ink">{{ paymentCode }}</p>
          <UButton class="mt-3" size="sm" color="neutral" variant="soft" icon="i-lucide-mail" :label="t('dashboard.billing.checkout.contactSupport')" :href="`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Perlink payment ${paymentCode}`)}`" />
        </div>

        <!-- Waiting for review -->
        <div v-else-if="status === 'submitted'" class="flex flex-col items-center py-4 text-center">
          <div class="flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <UIcon name="i-lucide-hourglass" class="size-7" />
          </div>
          <p class="mt-4 text-lg font-semibold text-ink">{{ t('dashboard.billing.checkout.submittedTitle') }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ t('dashboard.billing.checkout.submittedText') }}</p>
          <p v-if="check" class="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" :class="check.verdict === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-sand text-ink-soft'">
            <UIcon :name="check.verdict === 'ok' ? 'i-lucide-badge-check' : 'i-lucide-info'" class="size-3.5" />
            {{ t(`dashboard.billing.checkout.check.${check.verdict}`) }}
          </p>
        </div>

        <!-- Bank transfer: just the VietQR code (amount and note are in it) -->
        <div v-else-if="method === 'bank' && transfer" class="flex flex-col items-center">
          <img
            :src="transfer.qrImage"
            :alt="`${transfer.bankName} · ${transfer.accountNumber} · ${transfer.note}`"
            width="540"
            height="540"
            class="w-full max-w-72 rounded-2xl bg-white ring-1 ring-line"
          >
          <p class="mt-2 text-xs text-ink-muted">{{ t('dashboard.billing.checkout.scan') }}</p>
        </div>

        <!-- Crypto: USDT / USDC to the wallet, then the transaction hash -->
        <div v-else-if="method === 'crypto' && cryptoInfo" class="space-y-4">
          <div class="rounded-2xl bg-sand/50 px-4 py-3 text-center ring-1 ring-line">
            <p class="text-xs text-ink-muted">{{ t('dashboard.billing.checkout.cryptoAmount') }}</p>
            <p class="mt-0.5 flex items-center justify-center gap-2 text-2xl font-semibold tabular-nums text-ink">
              <UIcon :name="CRYPTO_TOKEN_ICONS[token as CryptoToken]" class="size-6 shrink-0" />
              {{ cryptoInfo.amountUsd }} {{ token }}
              <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-copy" :aria-label="t('dashboard.billing.checkout.amount')" @click="copy(String(cryptoInfo.amountUsd))" />
            </p>
          </div>

          <div>
            <p class="mb-1.5 text-xs font-medium text-ink-muted">{{ t('dashboard.billing.checkout.network') }}</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="n in cryptoInfo.networks"
                :key="n.id"
                type="button"
                class="flex items-center gap-1.5 rounded-full border py-1 pl-3 pr-1 text-xs font-medium transition"
                :class="network === n.id ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft hover:border-ink-faint'"
                @click="network = n.id"
              >
                {{ n.name }}
                <span v-if="CRYPTO_NETWORK_BY_ID[n.id]" class="flex size-5 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-black/5">
                  <UIcon :name="CRYPTO_NETWORK_BY_ID[n.id]!.icon" class="size-3.5" />
                </span>
              </button>
            </div>
          </div>
          <div>
            <p class="mb-1.5 text-xs font-medium text-ink-muted">{{ t('dashboard.billing.checkout.token') }}</p>
            <USelect
              v-model="token"
              :items="tokenItems"
              :icon="CRYPTO_TOKEN_ICONS[token as CryptoToken]"
              class="w-full"
              :ui="{ leadingIcon: 'size-5', itemLeadingIcon: 'size-5' }"
            />
          </div>

          <div class="flex items-center gap-3 rounded-2xl bg-paper p-3 ring-1 ring-line">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="size-24 shrink-0 rounded-lg bg-white p-1.5 ring-1 ring-line" v-html="qrSvg(cryptoInfo.address)" />
            <div class="min-w-0">
              <p class="text-xs text-ink-muted">{{ t('dashboard.billing.checkout.address') }}</p>
              <p class="mt-0.5 break-all font-mono text-xs text-ink">{{ cryptoInfo.address }}</p>
              <UButton class="mt-1.5" size="xs" color="neutral" variant="soft" icon="i-lucide-copy" :label="t('dashboard.billing.checkout.copy')" @click="copy(cryptoInfo.address)" />
            </div>
          </div>
          <p class="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-100">
            {{ t('dashboard.billing.checkout.cryptoWarning', { token, network: networkName }) }}
          </p>

          <div>
            <label class="mb-1.5 block text-xs font-medium text-ink-muted" for="tx-hash">{{ t('dashboard.billing.checkout.txHash') }}</label>
            <UInput id="tx-hash" v-model="txHash" class="w-full font-mono" :placeholder="t('dashboard.billing.checkout.txHashPlaceholder')" autocomplete="off" spellcheck="false" />
            <p class="mt-1.5 text-xs text-ink-muted">{{ t('dashboard.billing.checkout.txHashHint') }}</p>
          </div>
        </div>
        </div>
      </template>
    </template>

    <template #footer>
      <UButton v-if="paid" block :label="t('dashboard.billing.checkout.done')" @click="open = false" />
      <div v-else-if="!loading" class="flex w-full gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-refresh-cw" :loading="refreshing" :label="t('dashboard.billing.checkout.refresh')" @click="refreshStatus" />
        <UButton
          v-if="status === 'rejected'"
          class="flex-1 justify-center"
          icon="i-lucide-rotate-ccw"
          :label="t('dashboard.billing.checkout.tryAgain')"
          @click="status = 'pending'"
        />
        <UButton
          v-else-if="status !== 'submitted'"
          class="flex-1 justify-center"
          icon="i-lucide-check"
          :loading="submitting"
          :disabled="method === 'crypto' && !txHash.trim()"
          :label="t('dashboard.billing.checkout.submit')"
          @click="submit"
        />
      </div>
    </template>
  </AppSheet>
</template>

<script setup lang="ts">
import qrcode from 'qrcode-generator'
import { CRYPTO_NETWORK_BY_ID, CRYPTO_TOKEN_ICONS, type CryptoToken } from '#shared/crypto'
import type { BillingPeriod, PaidPlanId } from '#shared/plans'
import { SUPPORT_EMAIL } from '~/utils/legal'

// Pay for a plan by bank transfer (VietQR, VND) or in USDT / USDC to the
// crypto wallet. "Done" sends it for review; the plan turns on once the
// superadmin approves (or a bank webhook matches the transfer).
const props = defineProps<{
  plan: PaidPlanId
  period: BillingPeriod
}>()
const emit = defineEmits<{ paid: [] }>()
const open = defineModel<boolean>('open', { default: false })

const { t, locale } = useI18n()
const toast = useToast()
const { info, refresh } = useBilling()

type Method = 'bank' | 'crypto'
interface Transfer { qrString: string; qrImage: string; bankName: string; accountNumber: string; accountName: string; amount: number; note: string }
interface CryptoInfo { address: string; amountUsd: number; networks: { id: string; name: string; tokens: string[] }[] }
interface Check { verdict: 'ok' | 'short' | 'none' | 'failed' | 'pending' | 'error' }

const methods = computed<Method[]>(() => {
  const available = info.value?.paymentMethods ?? { bank: true, crypto: false }
  return (['bank', 'crypto'] as Method[]).filter(m => available[m])
})
const method = ref<Method>('bank')

const loading = ref(false)
const submitting = ref(false)
const refreshing = ref(false)
const paymentId = ref<string | null>(null)
const paymentCode = ref('')
const status = ref('pending')
const transfer = ref<Transfer | null>(null)
const cryptoInfo = ref<CryptoInfo | null>(null)
const check = ref<Check | null>(null)
const paid = ref<{ expiresAt: string } | null>(null)

const network = ref('bsc')
const token = ref('USDT')
const txHash = ref('')
const networkTokens = computed(() => cryptoInfo.value?.networks.find(n => n.id === network.value)?.tokens ?? [])
const tokenItems = computed(() => networkTokens.value.map(tk => ({ label: tk, value: tk, icon: CRYPTO_TOKEN_ICONS[tk as CryptoToken] })))
const networkName = computed(() => cryptoInfo.value?.networks.find(n => n.id === network.value)?.name ?? '')
watch(networkTokens, (tokens) => {
  if (!tokens.includes(token.value)) token.value = tokens[0] ?? 'USDT'
})

const planName = computed(() => t(`dashboard.billing.plans.${props.plan}.name`))
const title = computed(() =>
  `${t('dashboard.billing.checkout.title', { plan: planName.value })} · ${t(props.period === 'annual' ? 'dashboard.billing.checkout.periodAnnual' : 'dashboard.billing.checkout.periodMonthly')}`,
)

function qrSvg(text: string) {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-GB')

function copy(text: string) {
  navigator.clipboard.writeText(text)
  toast.add({ title: t('dashboard.billing.checkout.copied'), description: text })
}

async function start() {
  loading.value = true
  paid.value = null
  check.value = null
  try {
    const res = await $fetch<{ id: string; code: string; status: string; transfer: Transfer | null; crypto: CryptoInfo | null }>('/api/billing/checkout', {
      method: 'POST',
      body: { plan: props.plan, period: props.period, method: method.value },
    })
    paymentId.value = res.id
    paymentCode.value = res.code
    status.value = res.status
    transfer.value = res.transfer
    cryptoInfo.value = res.crypto
  } catch (error: any) {
    toast.add({ title: t('dashboard.billing.checkout.failed'), description: error?.data?.statusMessage, color: 'error' })
    open.value = false
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (!paymentId.value) return
  submitting.value = true
  try {
    const res = await $fetch<{ status: string; check?: Check | null }>(`/api/billing/payments/${paymentId.value}/submit`, {
      method: 'POST',
      body: method.value === 'crypto' ? { network: network.value, token: token.value, txHash: txHash.value.trim() } : {},
    })
    status.value = res.status
    check.value = res.check ?? null
    if (res.status === 'paid') await onPaid()
    // The dashboard now knows a payment is waiting, and checks back for it
    else refresh()
  } catch (error: any) {
    toast.add({ title: t('dashboard.billing.checkout.submitFailed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    submitting.value = false
  }
}

// Paid: the dialog closes and the "you're upgraded" celebration takes over
// (BillingCelebration, from the refreshed billing info)
async function onPaid(expiresAt?: string) {
  paid.value = { expiresAt: expiresAt ?? new Date().toISOString() }
  stopPolling()
  await refresh()
  emit('paid')
  if (info.value?.celebrate) open.value = false
}

async function poll() {
  if (!paymentId.value || paid.value) return
  const res = await $fetch<{ status: string; expiresAt?: string; check?: Check | null }>(`/api/billing/payments/${paymentId.value}`)
  // A rejected payment stays shown as rejected until the payer chooses to try again
  if (!(status.value === 'pending' && res.status === 'rejected')) status.value = res.status
  if (res.check) check.value = res.check
  if (res.status === 'paid') await onPaid(res.expiresAt)
}

async function refreshStatus() {
  refreshing.value = true
  try {
    await poll()
  } catch {
    // Shown again on the next try
  } finally {
    refreshing.value = false
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
  timer = setInterval(() => poll().catch(() => {}), 5000)
}

// Switching between bank and crypto starts that kind of payment
watch(method, () => {
  if (open.value) start()
})
watch(open, (isOpen) => {
  if (isOpen) {
    const first = methods.value[0] ?? 'bank'
    // A different method starts through the watcher below
    if (method.value !== first) method.value = first
    else start()
    startPolling()
  } else {
    stopPolling()
  }
}, { immediate: true })
onBeforeUnmount(stopPolling)
</script>
