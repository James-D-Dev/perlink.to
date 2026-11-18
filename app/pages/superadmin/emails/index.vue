<template>
  <UDashboardPanel id="superadmin-emails">
    <template #header>
      <UDashboardNavbar title="Emails">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton variant="ghost" color="neutral" icon="i-lucide-refresh-cw" :loading="pending" aria-label="Refresh" @click="reload()" />
          <UButton icon="i-lucide-pen-line" label="New email" @click="compose()" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto grid w-full max-w-7xl gap-6 py-2 sm:py-4 lg:grid-cols-5">
        <!-- List -->
        <UCard :ui="superadminCardUi" class="lg:col-span-2" :class="view !== 'list' ? 'hidden lg:block' : ''">
          <template #header>
            <div class="space-y-3">
              <div class="flex gap-1 rounded-xl bg-sand/60 p-1">
                <button
                  v-for="tab in tabs"
                  :key="tab.value"
                  type="button"
                  class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors"
                  :class="box === tab.value ? 'bg-default font-medium text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
                  @click="box = tab.value"
                >
                  <UIcon :name="tab.icon" class="size-4" />
                  {{ tab.label }}
                  <UBadge v-if="tab.value === 'in' && unread" size="sm" :label="String(unread)" />
                </button>
              </div>
              <UInput v-model="search" icon="i-lucide-search" placeholder="Search address or subject" class="w-full" />
            </div>
          </template>

          <p v-if="!pending && !emails.length" class="px-5 py-12 text-center text-sm text-muted">
            {{ search ? 'Nothing matches.' : box === 'in' ? 'No mail to support@perlink.to yet.' : 'Nothing sent yet.' }}
          </p>
          <ul class="divide-y divide-line">
            <li v-for="email in emails" :key="email.id">
              <button
                type="button"
                class="w-full px-5 py-3.5 text-left transition-colors hover:bg-sand/40"
                :class="selectedId === email.id ? 'bg-sand/60' : ''"
                @click="openEmail(email.id)"
              >
                <div class="flex items-center gap-2">
                  <span v-if="email.direction === 'in' && !email.read" class="size-2 shrink-0 rounded-full bg-tint" aria-label="Unread" />
                  <p class="min-w-0 flex-1 truncate text-sm" :class="email.direction === 'in' && !email.read ? 'font-semibold' : 'font-medium'">
                    {{ email.direction === 'in' ? (email.fromName || email.from) : email.to }}
                  </p>
                  <UIcon v-if="email.hasAttachments" name="i-lucide-paperclip" class="size-3.5 shrink-0 text-muted" />
                  <span class="shrink-0 text-xs text-muted">{{ when(email.createdAt) }}</span>
                </div>
                <p class="mt-0.5 truncate text-sm" :class="email.direction === 'in' && !email.read ? 'text-ink' : 'text-ink-soft'">{{ email.subject || '(no subject)' }}</p>
                <div class="mt-0.5 flex items-center gap-2">
                  <p class="min-w-0 flex-1 truncate text-xs text-muted">{{ email.snippet }}</p>
                  <UBadge v-if="email.direction === 'out' && email.kind === 'system'" color="neutral" variant="soft" size="sm" label="auto" />
                  <UBadge v-if="email.status === 'failed'" color="error" variant="soft" size="sm" label="failed" />
                </div>
              </button>
            </li>
          </ul>
          <template v-if="hasMore || page > 1" #footer>
            <div class="flex justify-between">
              <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-chevron-left" label="Newer" :disabled="page === 1" @click="page--" />
              <UButton size="xs" color="neutral" variant="soft" trailing-icon="i-lucide-chevron-right" label="Older" :disabled="!hasMore" @click="page++" />
            </div>
          </template>
        </UCard>

        <!-- Write -->
        <UCard v-if="view === 'compose'" :ui="superadminPanelUi" class="lg:col-span-3">
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UButton class="lg:hidden" size="xs" color="neutral" variant="ghost" icon="i-lucide-arrow-left" aria-label="Back" @click="back()" />
                <h2 class="font-medium">{{ replyToId ? 'Reply' : 'New email' }}</h2>
              </div>
              <span class="text-xs text-muted">From Perlink Support &lt;support@perlink.to&gt;</span>
            </div>
          </template>
          <form class="space-y-4" @submit.prevent="send">
            <UFormField label="To">
              <UInput v-model="to" type="email" placeholder="name@example.com" class="w-full" autocomplete="off" required />
            </UFormField>
            <UFormField label="Subject">
              <UInput v-model="subject" placeholder="About your Perlink account" class="w-full" maxlength="200" required />
            </UFormField>
            <UFormField label="Message" :hint="`${body.length}/20000`">
              <UTextarea v-model="body" :rows="12" autoresize class="w-full" placeholder="Hi there,&#10;&#10;…&#10;&#10;Perlink Support" maxlength="20000" required />
            </UFormField>
            <p class="text-xs text-muted">
              Sent as plain text (blank lines start a new paragraph).
              <template v-if="replyToId">It joins the sender's conversation. </template>
              Replies come back to this Inbox and to Gmail.
            </p>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="soft" label="Discard" :disabled="sending" @click="discard()" />
              <UButton type="submit" icon="i-lucide-send" label="Send" :loading="sending" :disabled="!canSend" />
            </div>
          </form>
        </UCard>

        <!-- Read -->
        <UCard v-else-if="view === 'read'" :ui="superadminPanelUi" class="min-w-0 lg:col-span-3">
          <template #header>
            <div class="flex items-start gap-2">
              <UButton class="lg:hidden" size="xs" color="neutral" variant="ghost" icon="i-lucide-arrow-left" aria-label="Back" @click="back()" />
              <div class="min-w-0 flex-1">
                <h2 class="font-medium break-words">{{ detail?.email.subject || '(no subject)' }}</h2>
                <p v-if="detail" class="mt-1 text-xs text-muted break-all">
                  <template v-if="detail.email.direction === 'in'">
                    From <span class="text-ink">{{ detail.email.fromName ? `${detail.email.fromName} <${detail.email.from}>` : detail.email.from }}</span>
                  </template>
                  <template v-else>
                    To <span class="text-ink">{{ detail.email.to }}</span> · from {{ detail.email.from }}
                  </template>
                  · {{ when(detail.email.createdAt, true) }}
                </p>
              </div>
            </div>
          </template>

          <div v-if="detailPending && !detail" class="py-12 text-center text-sm text-muted">Loading…</div>
          <div v-else-if="detail" class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <UButton v-if="detail.email.direction === 'in'" size="sm" icon="i-lucide-reply" label="Reply" @click="reply()" />
              <UButton v-else size="sm" color="neutral" variant="soft" icon="i-lucide-pen-line" label="Write again" @click="writeAgain()" />
              <UButton v-if="detail.email.direction === 'in'" size="sm" color="neutral" variant="soft" icon="i-lucide-mail" label="Mark unread" @click="markUnread()" />
              <UButton v-if="detail.email.userId" size="sm" color="neutral" variant="ghost" icon="i-lucide-user" label="Account" :to="`/superadmin/users/${detail.email.userId}`" />
              <UButton
                v-if="detail.email.html && detail.email.text"
                size="sm"
                color="neutral"
                variant="ghost"
                :icon="plain ? 'i-lucide-layout-template' : 'i-lucide-text'"
                :label="plain ? 'Formatted' : 'Plain text'"
                @click="plain = !plain"
              />
            </div>

            <UAlert v-if="detail.email.error" color="error" variant="soft" icon="i-lucide-triangle-alert" :title="detail.email.error" />

            <iframe
              v-if="detail.email.html && !plain"
              :srcdoc="frameDoc(detail.email.html)"
              sandbox=""
              referrerpolicy="no-referrer"
              title="Email content"
              class="h-[60vh] w-full rounded-xl border border-line bg-white"
            />
            <pre v-else class="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-ink">{{ detail.email.text || '(empty)' }}</pre>

            <div v-if="detail.email.attachments.length" class="space-y-2">
              <p class="text-xs font-medium uppercase tracking-wide text-muted">Attachments</p>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="file in detail.email.attachments"
                  :key="file.index"
                  size="sm"
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-paperclip"
                  :label="`${file.filename} · ${size(file.size)}`"
                  :to="`/api/superadmin/email/${detail.email.id}/attachments/${file.index}`"
                  external
                  download
                />
              </div>
            </div>

            <div v-if="detail.thread.length" class="space-y-2 border-t border-line pt-4">
              <p class="text-xs font-medium uppercase tracking-wide text-muted">More with {{ detail.email.direction === 'in' ? detail.email.from : detail.email.to }}</p>
              <ul class="space-y-1">
                <li v-for="item in detail.thread" :key="item.id">
                  <button type="button" class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-sand/40" @click="openEmail(item.id)">
                    <UIcon :name="item.direction === 'in' ? 'i-lucide-inbox' : 'i-lucide-send'" class="size-4 shrink-0 text-muted" />
                    <span class="min-w-0 flex-1 truncate">{{ item.subject || '(no subject)' }}</span>
                    <span class="shrink-0 text-xs text-muted">{{ when(item.createdAt) }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </UCard>

        <div v-else class="hidden items-center justify-center rounded-3xl border border-dashed border-line text-sm text-muted lg:col-span-3 lg:flex">
          Choose an email to read it.
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { superadminCardUi, superadminPanelUi } from '~/utils/superadmin'

// support@perlink.to in Superadmin: the Inbox (mail received there, which
// also still goes to Gmail) and Sent (everything Perlink sends: what's
// written here and the automatic emails). Answer from here.
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
})

interface ListEmail {
  id: string; direction: 'in' | 'out'; kind: string; from: string; fromName: string | null; to: string; subject: string
  snippet: string; userId: string | null; status: string; error: string | null; hasAttachments: boolean; read: boolean; createdAt: string
}
interface FullEmail {
  id: string; direction: 'in' | 'out'; kind: string; from: string; fromName: string | null; to: string; subject: string
  text: string | null; html: string | null; userId: string | null; status: string; error: string | null; createdAt: string
  attachments: { index: number; filename: string; mimeType?: string; size: number }[]
}
interface Detail { email: FullEmail; thread: { id: string; direction: 'in' | 'out'; subject: string; createdAt: string }[] }

const route = useRoute()
const toast = useToast()

const tabs = [
  { value: 'in' as const, label: 'Inbox', icon: 'i-lucide-inbox' },
  { value: 'out' as const, label: 'Sent', icon: 'i-lucide-send' },
]
const box = ref<'in' | 'out'>(useRoute().query.box === 'out' ? 'out' : 'in')
const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const page = ref(1)
watch([box, debouncedSearch], () => { page.value = 1 })

const { data, pending, refresh } = useFetch<{ emails: ListEmail[]; unread: number; hasMore: boolean }>('/api/superadmin/email', {
  query: { box, q: debouncedSearch, page },
  server: false,
})
const emails = computed(() => data.value?.emails ?? [])
const unread = computed(() => data.value?.unread ?? 0)
const hasMore = computed(() => !!data.value?.hasMore)

// 'list' only matters on phones, where one pane shows at a time
const view = ref<'list' | 'read' | 'compose'>('list')
const selectedId = ref<string | null>(null)
const detail = ref<Detail | null>(null)
const detailPending = ref(false)
const plain = ref(false)

async function openEmail(id: string) {
  selectedId.value = id
  view.value = 'read'
  plain.value = false
  detailPending.value = true
  try {
    detail.value = await $fetch<Detail>(`/api/superadmin/email/${id}`)
    const row = data.value?.emails.find(e => e.id === id)
    if (row && row.direction === 'in' && !row.read) {
      // useFetch data is shallow: replace it so the list and counts update
      data.value = {
        ...data.value!,
        unread: Math.max(0, data.value!.unread - 1),
        emails: data.value!.emails.map(e => (e.id === id ? { ...e, read: true } : e)),
      }
      refreshNuxtData('mail-unread')
    }
  } catch (error: any) {
    toast.add({ title: 'Could not open the email', description: error?.data?.statusMessage, color: 'error' })
    view.value = 'list'
  } finally {
    detailPending.value = false
  }
}

async function markUnread() {
  if (!detail.value) return
  await $fetch(`/api/superadmin/email/${detail.value.email.id}`, { method: 'PATCH', body: { read: false } })
  back()
  refresh()
  refreshNuxtData('mail-unread')
}

function back() {
  view.value = 'list'
  selectedId.value = null
}

function reload() {
  refresh()
  refreshNuxtData('mail-unread')
  if (view.value === 'read' && selectedId.value) openEmail(selectedId.value)
}

// Writing
const to = ref('')
const subject = ref('')
const body = ref('')
const replyToId = ref<string | null>(null)
const sending = ref(false)
const canSend = computed(() => /.+@.+\..+/.test(to.value.trim()) && subject.value.trim() && body.value.trim())

function compose(address = '') {
  replyToId.value = null
  to.value = address
  subject.value = ''
  body.value = ''
  selectedId.value = null
  view.value = 'compose'
}

const re = (s: string) => (/^re:/i.test(s) ? s : `Re: ${s}`)

function reply() {
  const email = detail.value?.email
  if (!email) return
  replyToId.value = email.id
  to.value = email.from
  subject.value = re(email.subject || '')
  const quoted = (email.text || '').trim().split('\n').slice(0, 40).map(line => `> ${line}`).join('\n')
  body.value = `\n\nOn ${when(email.createdAt, true)}, ${email.fromName || email.from} wrote:\n${quoted}`
  view.value = 'compose'
}

function writeAgain() {
  const email = detail.value?.email
  if (!email) return
  compose(email.to)
  subject.value = re(email.subject || '')
}

function discard() {
  if (selectedId.value || replyToId.value) {
    const id = replyToId.value || selectedId.value
    replyToId.value = null
    if (id) return openEmail(id)
  }
  back()
}

async function send() {
  if (!canSend.value) return
  sending.value = true
  try {
    await $fetch('/api/superadmin/email/send', {
      method: 'POST',
      body: { to: to.value.trim(), subject: subject.value.trim(), body: body.value, replyToId: replyToId.value || undefined },
    })
    toast.add({ title: 'Email sent', description: to.value.trim(), color: 'success' })
    replyToId.value = null
    box.value = 'out'
    back()
  } catch (error: any) {
    toast.add({ title: 'Not sent', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    sending.value = false
    refresh()
  }
}

// ?to=… (from an account page) opens a new email to that address
onMounted(() => {
  if (typeof route.query.to === 'string' && route.query.to) compose(route.query.to)
})

// Received HTML is shown in a sandboxed frame: no scripts, no forms, no
// access to this page; links open in a new tab
function frameDoc(html: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>body{margin:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;color:#1c1a17;word-wrap:break-word}img{max-width:100%;height:auto}</style></head><body>${html}</body></html>`
}

// D1 times are UTC without a zone
const toDate = (value: string) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value.replace(' ', 'T')}Z`)

function when(value: string, full = false) {
  const date = toDate(value)
  if (full) return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  const today = new Date()
  return date.toDateString() === today.toDateString()
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(date.getFullYear() !== today.getFullYear() ? { year: 'numeric' } : {}) })
}

function size(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
</script>
