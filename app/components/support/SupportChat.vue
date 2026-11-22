<template>
  <div v-if="loggedIn && !hidden && available" class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
    >
      <section
        v-if="open"
        class="flex h-[min(72vh,560px)] w-[min(370px,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_24px_60px_-12px_rgba(12,11,10,0.3)] ring-1 ring-line"
        role="dialog"
        :aria-label="t('dashboard.support.title')"
      >
        <header class="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <span class="relative inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-tint text-white">
            <UIcon name="i-lucide-headset" class="size-5" />
            <span class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-paper" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">{{ t('dashboard.support.title') }}</p>
            <p class="truncate text-xs text-ink-muted">{{ t('dashboard.support.subtitle') }}</p>
          </div>
          <button type="button" class="inline-flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-sand hover:text-ink" :aria-label="t('dashboard.support.close')" @click="open = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </header>

        <div ref="scroller" class="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          <!-- Support's greeting, always first -->
          <div class="flex">
            <p class="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md bg-sand px-3.5 py-2.5 text-sm leading-relaxed">{{ t('dashboard.support.greeting') }}</p>
          </div>
          <template v-for="(m, i) in messages" :key="m.id">
            <p v-if="showDay(i)" class="pt-2 text-center text-[11px] text-ink-faint">{{ dayLabel(m.createdAt) }}</p>
            <div class="flex" :class="m.sender === 'user' ? 'justify-end' : ''">
              <div
                class="max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed"
                :class="m.sender === 'user' ? 'rounded-br-md bg-tint text-white' : 'rounded-bl-md bg-sand text-ink'"
              >
                <p class="whitespace-pre-line break-words">{{ m.body }}</p>
                <p class="mt-0.5 text-right text-[10px]" :class="m.sender === 'user' ? 'text-white/70' : 'text-ink-faint'">
                  {{ timeLabel(m.createdAt) }}<template v-if="m.pending"> · {{ t('dashboard.support.sending') }}</template>
                </p>
              </div>
            </div>
          </template>
          <p v-if="messages.length && lastIsUser" class="pt-1 text-center text-[11px] text-ink-faint">{{ t('dashboard.support.willReply') }}</p>
        </div>

        <form class="border-t border-line p-3" @submit.prevent="send">
          <p v-if="error" class="mb-2 text-xs text-red-600">{{ error }}</p>
          <div class="flex items-end gap-2">
            <textarea
              ref="input"
              v-model="draft"
              rows="1"
              :maxlength="2000"
              :placeholder="t('dashboard.support.placeholder')"
              class="max-h-32 min-h-10 flex-1 resize-none rounded-xl bg-sand px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-tint/40"
              @keydown.enter.exact.prevent="send"
              @input="grow"
            />
            <UButton type="submit" icon="i-lucide-send-horizontal" square size="lg" :loading="sending" :disabled="!draft.trim()" :aria-label="t('dashboard.support.send')" />
          </div>
        </form>
      </section>
    </Transition>

    <button
      v-if="!open"
      type="button"
      class="relative inline-flex h-12 items-center gap-2 rounded-full bg-tint pl-4 pr-5 text-sm font-semibold text-white shadow-[0_10px_28px_-8px_rgb(0_102_214/0.6)] transition hover:brightness-110"
      :aria-label="t('dashboard.support.open')"
      @click="open = true"
    >
      <UIcon name="i-lucide-message-circle" class="size-5" />
      <span class="hidden sm:inline">{{ t('dashboard.support.launcher') }}</span>
      <span v-if="unread" class="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-5 ring-2 ring-paper">{{ unread }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface SupportMessage { id: string; sender: 'user' | 'admin'; body: string; createdAt: string; read: boolean; pending?: boolean }

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const { loggedIn } = useUserSession()
const open = useSupportChat()
const helpOpen = useHelpCenter()

// Not over the site and room editors (they have their own controls in that corner)
const hidden = computed(() => /^\/dashboard\/(site\/[^/]+|room\/[^/]+)\/?$/.test(route.path))

const messages = ref<SupportMessage[]>([])
const unread = ref(0)
const draft = ref('')
const sending = ref(false)
const error = ref('')
const scroller = ref<HTMLElement | null>(null)
const input = ref<HTMLTextAreaElement | null>(null)

// Shown once the server answers (not before its database is ready)
const available = ref(false)
const lastIsUser = computed(() => messages.value.at(-1)?.sender === 'user')

// D1 times are UTC without a zone
const toDate = (value: string) => new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`)
const timeLabel = (value: string) => toDate(value).toLocaleTimeString(locale.value, { hour: '2-digit', minute: '2-digit' })
const dayLabel = (value: string) => toDate(value).toLocaleDateString(locale.value, { day: 'numeric', month: 'short', year: 'numeric' })
const showDay = (i: number) => i === 0 || toDate(messages.value[i]!.createdAt).toDateString() !== toDate(messages.value[i - 1]!.createdAt).toDateString()

function scrollDown() {
  nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight }))
}

function grow() {
  const el = input.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 128)}px`
}

async function load() {
  try {
    const data = await $fetch<{ messages: SupportMessage[]; unread: number }>('/api/support', { query: { read: open.value ? '1' : undefined } })
    const grew = data.messages.length !== messages.value.filter(m => !m.pending).length
    messages.value = [...data.messages, ...messages.value.filter(m => m.pending)]
    unread.value = open.value ? 0 : data.unread
    available.value = true
    if (grew) scrollDown()
  } catch {}
}

async function checkUnread() {
  try {
    unread.value = (await $fetch<{ unread: number }>('/api/support/unread')).unread
    available.value = true
  } catch {}
}

async function send() {
  const body = draft.value.trim()
  if (!body || sending.value) return
  sending.value = true
  error.value = ''
  const temp: SupportMessage = { id: `temp-${Date.now()}`, sender: 'user', body, createdAt: new Date().toISOString(), read: false, pending: true }
  messages.value.push(temp)
  draft.value = ''
  nextTick(grow)
  scrollDown()
  try {
    await $fetch('/api/support', { method: 'POST', body: { body } })
    messages.value = messages.value.filter(m => m !== temp)
    await load()
  } catch (e: any) {
    messages.value = messages.value.filter(m => m !== temp)
    draft.value = body
    error.value = e?.statusCode === 429 ? t('dashboard.support.tooMany') : t('dashboard.support.failed')
  } finally {
    sending.value = false
  }
}

// Open: refresh every 8 s; closed: check for answers every minute (only while the tab is visible)
let timer: ReturnType<typeof setInterval> | null = null
function schedule() {
  if (timer) clearInterval(timer)
  if (!loggedIn.value) return
  timer = setInterval(() => {
    if (document.visibilityState !== 'visible') return
    open.value ? load() : checkUnread()
  }, open.value ? 8000 : 60000)
}

watch(open, (isOpen) => {
  if (isOpen) {
    helpOpen.value = false
    unread.value = 0
    load()
    nextTick(() => input.value?.focus())
  }
  schedule()
})
watch(helpOpen, (isOpen) => { if (isOpen) open.value = false })

onMounted(() => {
  if (!loggedIn.value) return
  // From the Telegram "Open the chat" button
  if (route.query.support === '1') {
    open.value = true
    load()
    const { support: _, ...query } = route.query
    router.replace({ query })
  } else {
    checkUnread()
  }
  schedule()
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>
