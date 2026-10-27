<template>
  <UDashboardPanel id="superadmin-emails">
    <template #header>
      <UDashboardNavbar title="Emails">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton variant="ghost" color="neutral" icon="i-lucide-refresh-cw" :loading="pending" @click="refresh()" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto grid w-full max-w-6xl gap-6 py-2 sm:py-4 lg:grid-cols-5">
        <!-- Write -->
        <UCard :ui="superadminPanelUi" class="lg:col-span-3">
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <h2 class="font-medium">New email</h2>
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
            <p class="text-xs text-muted">Sent as plain text (blank lines start a new paragraph). Replies come back to support@perlink.to.</p>
            <div class="flex justify-end gap-2">
              <UButton color="neutral" variant="soft" label="Clear" :disabled="sending" @click="clear" />
              <UButton type="submit" icon="i-lucide-send" label="Send email" :loading="sending" :disabled="!canSend" />
            </div>
          </form>
        </UCard>

        <!-- Sent -->
        <UCard :ui="superadminCardUi" class="lg:col-span-2">
          <template #header>
            <h2 class="font-medium">Sent</h2>
          </template>
          <p v-if="!pending && !emails.length" class="px-5 py-10 text-center text-sm text-muted">No emails sent yet.</p>
          <ul class="divide-y divide-line">
            <li v-for="email in emails" :key="email.id">
              <button type="button" class="w-full px-5 py-3.5 text-left transition-colors hover:bg-sand/40" @click="open = open === email.id ? null : email.id">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-medium">{{ email.subject }}</p>
                  <UBadge :color="email.status === 'sent' ? 'success' : 'error'" variant="soft" size="sm" :label="email.status" />
                </div>
                <p class="mt-0.5 truncate text-xs text-muted">
                  {{ email.to }} · {{ formatAdminDate(email.createdAt) }}
                </p>
                <p v-if="email.error" class="mt-1 text-xs text-error">{{ email.error }}</p>
                <p v-if="open === email.id" class="mt-2 whitespace-pre-line text-sm text-default">{{ email.body }}</p>
              </button>
              <div v-if="open === email.id" class="flex gap-2 px-5 pb-3">
                <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-reply" label="Write again" @click="reuse(email)" />
                <UButton v-if="email.userId" size="xs" color="neutral" variant="ghost" icon="i-lucide-user" label="Account" :to="`/superadmin/users/${email.userId}`" />
              </div>
            </li>
          </ul>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { formatAdminDate, superadminCardUi, superadminPanelUi } from '~/utils/superadmin'

// Write to people from support@perlink.to (Cloudflare Email Sending through
// the perlink-email Worker), and see what was sent
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
})

interface SentEmail { id: string; to: string; userId: string | null; subject: string; body: string; status: string; error: string | null; createdAt: string }

const route = useRoute()
const toast = useToast()

const to = ref(typeof route.query.to === 'string' ? route.query.to : '')
const subject = ref('')
const body = ref('')
const sending = ref(false)
const open = ref<string | null>(null)

const canSend = computed(() => /.+@.+\..+/.test(to.value.trim()) && subject.value.trim() && body.value.trim())

const { data, pending, refresh } = useFetch<{ emails: SentEmail[] }>('/api/superadmin/email', { server: false })
const emails = computed(() => data.value?.emails ?? [])

function clear() {
  subject.value = ''
  body.value = ''
}

function reuse(email: SentEmail) {
  to.value = email.to
  subject.value = email.subject.startsWith('Re: ') ? email.subject : `Re: ${email.subject}`
  body.value = ''
}

async function send() {
  if (!canSend.value) return
  sending.value = true
  try {
    await $fetch('/api/superadmin/email/send', { method: 'POST', body: { to: to.value.trim(), subject: subject.value.trim(), body: body.value } })
    toast.add({ title: 'Email sent', description: to.value.trim(), color: 'success' })
    clear()
  } catch (error: any) {
    toast.add({ title: 'Not sent', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    sending.value = false
    refresh()
  }
}
</script>
