<template>
  <UDashboardPanel id="superadmin-support" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <UDashboardNavbar title="Support chat">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton variant="ghost" color="neutral" icon="i-lucide-refresh-cw" :loading="pending" @click="refreshAll" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex h-full min-h-0">
        <!-- Conversations -->
        <aside class="w-full shrink-0 overflow-y-auto border-r border-default md:w-80" :class="selected ? 'hidden md:block' : ''">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Search by email or name" class="w-full p-3" />
          <p v-if="!pending && !filtered.length" class="px-4 py-12 text-center text-sm text-muted">
            {{ threads.length ? 'No matches.' : 'No conversations yet. Users write from the chat button in their dashboard.' }}
          </p>
          <button
            v-for="thread in filtered"
            :key="thread.userId"
            type="button"
            class="flex w-full items-start gap-3 border-b border-default px-4 py-3 text-left transition hover:bg-elevated/60"
            :class="thread.userId === selected ? 'bg-elevated' : ''"
            @click="select(thread.userId)"
          >
            <UAvatar :src="thread.avatar || undefined" :alt="thread.name || thread.email || '?'" size="md" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <p class="truncate text-sm" :class="thread.unread ? 'font-semibold' : 'font-medium'">{{ thread.name || thread.email || thread.userId }}</p>
                <span class="shrink-0 text-[11px] text-muted">{{ shortTime(thread.lastAt) }}</span>
              </div>
              <p v-if="thread.name" class="truncate text-xs text-muted">{{ thread.email }}</p>
              <div class="mt-0.5 flex items-center gap-2">
                <p class="min-w-0 flex-1 truncate text-xs" :class="thread.unread ? 'text-highlighted' : 'text-muted'">
                  <span v-if="thread.lastSender === 'admin'" class="text-muted">You: </span>{{ thread.lastBody }}
                </p>
                <UBadge v-if="thread.unread" color="error" size="sm" :label="String(thread.unread)" />
              </div>
            </div>
          </button>
        </aside>

        <!-- One conversation -->
        <section v-if="selected" class="flex min-w-0 flex-1 flex-col">
          <header v-if="conversation" class="flex items-center gap-3 border-b border-default px-4 py-3">
            <UButton class="md:hidden" variant="ghost" color="neutral" icon="i-lucide-arrow-left" @click="select(null)" />
            <UAvatar :src="conversation.user.avatar || undefined" :alt="conversation.user.name || conversation.user.email" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ conversation.user.name || conversation.user.email }}</p>
              <p class="truncate text-xs text-muted">
                {{ conversation.user.email }} · {{ (conversation.user.plan || 'free').toUpperCase() }}
                <template v-if="conversation.user.language"> · {{ conversation.user.language }}</template>
                · {{ conversation.user.telegram ? 'gets replies on Telegram' : 'no Telegram: sees replies in the dashboard' }}
              </p>
            </div>
            <UButton :to="`/superadmin/users/${conversation.user.id}`" variant="outline" color="neutral" size="sm" icon="i-lucide-user" label="User" />
          </header>

          <div ref="scroller" class="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            <template v-for="(m, i) in conversation?.messages ?? []" :key="m.id">
              <p v-if="showDay(i)" class="pt-2 text-center text-[11px] text-muted">{{ dayLabel(m.createdAt) }}</p>
              <div class="flex" :class="m.sender === 'admin' ? 'justify-end' : ''">
                <div class="max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed" :class="m.sender === 'admin' ? 'rounded-br-md bg-primary text-inverted' : 'rounded-bl-md bg-elevated'">
                  <p class="whitespace-pre-line break-words">{{ m.body }}</p>
                  <p class="mt-0.5 text-right text-[10px] opacity-70">
                    {{ timeLabel(m.createdAt) }}<template v-if="m.sender === 'admin'"> · {{ m.read ? 'Seen' : 'Sent' }}</template>
                  </p>
                </div>
              </div>
            </template>
          </div>

          <form class="border-t border-default p-3" @submit.prevent="reply">
            <p v-if="error" class="mb-2 text-xs text-error">{{ error }}</p>
            <div class="flex items-end gap-2">
              <UTextarea v-model="draft" :rows="2" autoresize :maxrows="8" :maxlength="2000" placeholder="Reply… (Enter to send, Shift+Enter for a new line)" class="flex-1" @keydown.enter.exact.prevent="reply" />
              <UButton type="submit" icon="i-lucide-send-horizontal" :loading="sending" :disabled="!draft.trim()" label="Send" />
            </div>
          </form>
        </section>
        <div v-else class="hidden flex-1 items-center justify-center text-sm text-muted md:flex">Pick a conversation</div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
// Chat with users: they write from the chat button in their dashboard, each
// message reaches the admin on Telegram (a reply there answers too), and
// answers here show in their chat (and on Telegram, if they connected it).
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
})
useSeoMeta({ title: 'Support — Superadmin', robots: 'noindex' })

interface Thread { userId: string; email: string | null; name: string | null; avatar: string | null; lastAt: string; lastBody: string; lastSender: 'user' | 'admin'; unread: number; total: number }
interface Message { id: string; sender: 'user' | 'admin'; body: string; createdAt: string; read: boolean }
interface Conversation { user: { id: string; email: string; name: string | null; avatar: string | null; plan: string | null; language: string | null; createdAt: string; telegram: boolean }; messages: Message[] }

const route = useRoute()
const router = useRouter()
const search = ref('')
const selected = ref<string | null>(typeof route.query.user === 'string' ? route.query.user : null)
const draft = ref('')
const sending = ref(false)
const error = ref('')
const scroller = ref<HTMLElement | null>(null)

const { data, pending, refresh } = useFetch<{ threads: Thread[] }>('/api/superadmin/support', { server: false })
const threads = computed(() => data.value?.threads ?? [])
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? threads.value.filter(t => `${t.email ?? ''} ${t.name ?? ''}`.toLowerCase().includes(q)) : threads.value
})

const conversation = ref<Conversation | null>(null)
async function loadConversation(scroll = false) {
  if (!selected.value) return
  const id = selected.value
  try {
    const next = await $fetch<Conversation>(`/api/superadmin/support/${encodeURIComponent(id)}`)
    if (selected.value !== id) return
    const grew = next.messages.length !== conversation.value?.messages.length
    conversation.value = next
    if (scroll || grew) nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight }))
  } catch {
    conversation.value = null
  }
}

function select(id: string | null) {
  selected.value = id
  conversation.value = null
  error.value = ''
  router.replace({ query: id ? { user: id } : {} })
  if (id) loadConversation(true).then(() => refresh())
}

async function reply() {
  const body = draft.value.trim()
  if (!body || !selected.value || sending.value) return
  sending.value = true
  error.value = ''
  try {
    await $fetch(`/api/superadmin/support/${encodeURIComponent(selected.value)}`, { method: 'POST', body: { body } })
    draft.value = ''
    await Promise.all([loadConversation(true), refresh()])
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not send'
  } finally {
    sending.value = false
  }
}

function refreshAll() {
  refresh()
  loadConversation()
}

// New messages arrive while the page is open
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  if (selected.value) loadConversation(true)
  timer = setInterval(() => {
    if (document.visibilityState !== 'visible') return
    refresh()
    loadConversation()
  }, 10000)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

// D1 times are UTC without a zone
const toDate = (value: string) => new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`)
const timeLabel = (value: string) => toDate(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const dayLabel = (value: string) => toDate(value).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
function shortTime(value: string) {
  const d = toDate(value)
  return d.toDateString() === new Date().toDateString() ? timeLabel(value) : d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}
function showDay(i: number) {
  const list = conversation.value?.messages ?? []
  return i === 0 || toDate(list[i]!.createdAt).toDateString() !== toDate(list[i - 1]!.createdAt).toDateString()
}
</script>
