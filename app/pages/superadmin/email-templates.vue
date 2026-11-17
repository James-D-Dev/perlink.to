<template>
  <UDashboardPanel id="superadmin-email-templates">
    <template #header>
      <UDashboardNavbar title="Email templates">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="!data" class="py-16 text-center text-sm text-muted">Loading…</div>
      <div v-else class="mx-auto grid w-full max-w-[1400px] gap-6 py-2 sm:py-4 xl:grid-cols-12">
        <!-- Templates -->
        <UCard :ui="superadminCardUi" class="xl:col-span-3">
          <template #header>
            <h2 class="font-medium">Emails</h2>
          </template>
          <ul class="divide-y divide-line">
            <li>
              <button type="button" class="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-sand/40" :class="selected === 'layout' ? 'bg-sand/60' : ''" @click="select('layout')">
                <UIcon name="i-lucide-palette" class="mt-0.5 size-4 shrink-0 text-muted" />
                <span class="min-w-0">
                  <span class="block text-sm font-medium">Layout</span>
                  <span class="block text-xs text-muted">Colour and footer of every email</span>
                </span>
              </button>
            </li>
            <li v-for="t in data.templates" :key="t.id">
              <button type="button" class="flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-sand/40" :class="selected === t.id ? 'bg-sand/60' : ''" @click="select(t.id)">
                <UIcon :name="audienceIcon[t.audience]" class="mt-0.5 size-4 shrink-0 text-muted" />
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-2">
                    <span class="truncate text-sm font-medium">{{ t.name }}</span>
                    <UBadge v-if="isCustomised(t)" size="sm" variant="soft" label="Edited" />
                  </span>
                  <span class="block text-xs text-muted">To {{ t.audience }}</span>
                </span>
              </button>
            </li>
          </ul>
        </UCard>

        <!-- Editor -->
        <UCard :ui="superadminPanelUi" class="xl:col-span-4">
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <h2 class="font-medium">{{ selected === 'layout' ? 'Layout' : current?.name }}</h2>
                <p class="mt-0.5 text-xs text-muted">{{ selected === 'layout' ? 'Shared by all Perlink emails.' : current?.description }}</p>
              </div>
              <div class="flex shrink-0 gap-1 rounded-xl bg-sand/60 p-1">
                <button
                  v-for="l in langs"
                  :key="l"
                  type="button"
                  class="rounded-lg px-2.5 py-1 text-xs uppercase transition-colors"
                  :class="lang === l ? 'bg-default font-semibold text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
                  @click="lang = l"
                >
                  {{ l }}
                </button>
              </div>
            </div>
          </template>

          <!-- Layout -->
          <div v-if="selected === 'layout'" class="space-y-5">
            <UFormField label="Accent colour" help="The button and “per” in the logo.">
              <div class="flex items-center gap-3">
                <input v-model="layoutDraft.accent" type="color" class="size-10 cursor-pointer rounded-lg border border-line bg-transparent p-0.5" aria-label="Pick a colour">
                <UInput v-model="layoutDraft.accent" class="w-32 font-mono" maxlength="7" />
                <div class="flex gap-1.5">
                  <button v-for="c in swatches" :key="c" type="button" class="size-6 rounded-full ring-1 ring-line" :style="{ background: c }" :aria-label="c" @click="layoutDraft.accent = c" />
                </div>
              </div>
            </UFormField>
            <UFormField :label="`Footer (${lang.toUpperCase()})`" help="Above perlink.to and the support address.">
              <UInput v-model="layoutDraft.footer[lang]" class="w-full" maxlength="300" />
            </UFormField>
            <div class="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
              <UButton color="neutral" variant="ghost" icon="i-lucide-rotate-ccw" label="Default" :disabled="saving" @click="resetLayout()" />
              <UButton color="neutral" variant="soft" icon="i-lucide-send" label="Send test" :loading="testing" @click="sendTest()" />
              <UButton icon="i-lucide-check" label="Save" :loading="saving" :disabled="!layoutDirty || !validColour" @click="saveLayout()" />
            </div>
          </div>

          <!-- A template -->
          <div v-else-if="current" class="space-y-4">
            <UFormField label="Subject">
              <UInput v-model="draft[lang].subject" class="w-full" maxlength="300" />
            </UFormField>
            <UFormField label="Heading" help="Big title in the card. Leave empty for none.">
              <UInput v-model="draft[lang].heading" class="w-full" maxlength="300" />
            </UFormField>
            <UFormField label="Message">
              <UTextarea ref="bodyField" v-model="draft[lang].body" :rows="9" autoresize class="w-full" maxlength="10000" />
            </UFormField>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Button">
                <UInput v-model="draft[lang].button" class="w-full" maxlength="100" />
              </UFormField>
              <UFormField label="Small print">
                <UInput v-model="draft[lang].note" class="w-full" maxlength="1000" />
              </UFormField>
            </div>

            <div class="space-y-2 rounded-xl bg-sand/40 p-3 text-xs text-ink-soft">
              <p class="font-medium text-ink">Variables <span class="font-normal text-muted">(click to add to the message)</span></p>
              <div class="flex flex-wrap gap-1.5">
                <button v-for="(sample, key) in current.variables" :key="key" type="button" class="rounded-md bg-default px-2 py-1 font-mono ring-1 ring-line hover:ring-tint" :title="`Sample: ${sample}`" @click="insertVariable(String(key))">
                  {{ `\{\{${key}\}\}` }}
                </button>
              </div>
              <p class="text-muted">Blank line = new paragraph · lines starting <code>- </code> or <code>1. </code> = a list · <code>**bold**</code> · <code v-pre>{{button}}</code> on its own line = where the button goes</p>
            </div>

            <div class="flex flex-wrap items-center justify-end gap-2 border-t border-line pt-4">
              <span v-if="dirty" class="mr-auto text-xs text-warning">Unsaved changes</span>
              <UButton color="neutral" variant="ghost" icon="i-lucide-rotate-ccw" label="Default" :disabled="saving || !isCustomised(current)" @click="resetTemplate()" />
              <UButton color="neutral" variant="soft" icon="i-lucide-send" label="Send test" :loading="testing" @click="sendTest()" />
              <UButton icon="i-lucide-check" label="Save" :loading="saving" :disabled="!dirty" @click="saveTemplate()" />
            </div>
          </div>
        </UCard>

        <!-- Preview -->
        <UCard :ui="superadminCardUi" class="min-w-0 xl:col-span-5">
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-xs text-muted">Subject</p>
                <p class="truncate text-sm font-medium">{{ preview?.subject || '…' }}</p>
              </div>
              <div class="flex shrink-0 gap-1 rounded-xl bg-sand/60 p-1">
                <button
                  v-for="d in devices"
                  :key="d.value"
                  type="button"
                  class="rounded-lg p-1.5 transition-colors"
                  :class="device === d.value ? 'bg-default text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
                  :aria-label="d.label"
                  @click="device = d.value"
                >
                  <UIcon :name="d.icon" class="size-4" />
                </button>
              </div>
            </div>
          </template>
          <div class="flex justify-center bg-[#f3f1ee] p-3">
            <iframe
              v-if="preview"
              :srcdoc="preview.html"
              sandbox=""
              title="Email preview"
              class="h-[720px] rounded-lg bg-[#f3f1ee] transition-[width]"
              :style="{ width: device === 'mobile' ? '375px' : '100%' }"
            />
          </div>
          <p class="px-5 py-3 text-xs text-muted">Sample values. Each real email fills in its own.</p>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { superadminCardUi, superadminPanelUi } from '~/utils/superadmin'

// Superadmin → Email templates: the words of each email Perlink sends (in
// English and Vietnamese) and the layout they share, with a live preview
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
})

type Lang = 'en' | 'vi'
interface Words { subject: string; heading: string; body: string; button: string; note: string }
interface Template {
  id: string; name: string; description: string; audience: 'user' | 'site owner' | 'admin'
  variables: Record<string, string>; defaults: Record<Lang, Words>; saved: Partial<Record<Lang, Partial<Words>>>
}
interface Layout { accent: string; footer: Record<Lang, string> }

const toast = useToast()
const langs: Lang[] = ['en', 'vi']
const audienceIcon = { 'user': 'i-lucide-user-round', 'site owner': 'i-lucide-store', 'admin': 'i-lucide-shield' } as const
const swatches = ['#0066d6', '#0c0b0a', '#7c3aed', '#db2777', '#059669', '#ea580c']
const devices = [
  { value: 'desktop' as const, label: 'Desktop', icon: 'i-lucide-monitor' },
  { value: 'mobile' as const, label: 'Phone', icon: 'i-lucide-smartphone' },
]

const { data, refresh } = useFetch<{ templates: Template[]; layout: Layout; defaultLayout: Layout }>('/api/superadmin/email-templates', { server: false })

const selected = ref<string>('welcome')
const lang = ref<Lang>('en')
const device = ref<'desktop' | 'mobile'>('desktop')
const saving = ref(false)
const testing = ref(false)

const current = computed(() => data.value?.templates.find(t => t.id === selected.value))
const merged = (t: Template, l: Lang): Words => ({ ...t.defaults[l], ...(t.saved[l] ?? {}) })
const isCustomised = (t: Template) => Object.values(t.saved ?? {}).some(words => words && Object.keys(words).length)

// The words being edited, both languages
const draft = ref<Record<Lang, Words>>({ en: emptyWords(), vi: emptyWords() })
function emptyWords(): Words { return { subject: '', heading: '', body: '', button: '', note: '' } }
const layoutDraft = ref<Layout>({ accent: '#0066d6', footer: { en: '', vi: '' } })

function loadDraft() {
  if (!data.value) return
  layoutDraft.value = structuredClone(toRaw(data.value.layout))
  const t = current.value
  if (t) draft.value = { en: merged(t, 'en'), vi: merged(t, 'vi') }
}
watch(data, loadDraft, { immediate: true })

const dirty = computed(() => {
  const t = current.value
  if (!t) return false
  return langs.some(l => JSON.stringify(draft.value[l]) !== JSON.stringify(merged(t, l)))
})
const layoutDirty = computed(() => !!data.value && JSON.stringify(layoutDraft.value) !== JSON.stringify(data.value.layout))
const validColour = computed(() => /^#[0-9a-f]{6}$/i.test(layoutDraft.value.accent))

function select(id: string) {
  if ((dirty.value || layoutDirty.value) && !window.confirm('Leave without saving your changes?')) return
  selected.value = id
  loadDraft()
}

const bodyField = ref()
function insertVariable(key: string) {
  const token = `{{${key}}}`
  const el: HTMLTextAreaElement | undefined = bodyField.value?.textareaRef ?? bodyField.value?.$el?.querySelector?.('textarea')
  const text = draft.value[lang.value].body
  if (el && typeof el.selectionStart === 'number') {
    const start = el.selectionStart
    draft.value[lang.value].body = text.slice(0, start) + token + text.slice(el.selectionEnd)
    nextTick(() => { el.focus(); el.setSelectionRange(start + token.length, start + token.length) })
  } else {
    draft.value[lang.value].body = `${text}${token}`
  }
}

// Live preview: the selected template (the welcome email while editing the layout)
const preview = ref<{ subject: string; html: string } | null>(null)
let previewTimer: ReturnType<typeof setTimeout> | undefined
function previewBody() {
  const id = selected.value === 'layout' ? 'welcome' : selected.value
  return {
    id,
    lang: lang.value,
    words: selected.value === 'layout' ? undefined : draft.value[lang.value],
    layout: validColour.value ? layoutDraft.value : undefined,
  }
}
watch([selected, lang, draft, layoutDraft], () => {
  clearTimeout(previewTimer)
  previewTimer = setTimeout(async () => {
    try {
      preview.value = await $fetch('/api/superadmin/email-templates/preview', { method: 'POST', body: previewBody() })
    } catch {}
  }, 250)
}, { deep: true, immediate: true })

async function saveTemplate() {
  if (!current.value) return
  saving.value = true
  try {
    await $fetch(`/api/superadmin/email-templates/${current.value.id}`, { method: 'PUT', body: draft.value })
    toast.add({ title: 'Template saved', description: 'New emails use it from now on.', color: 'success' })
    await refresh()
  } catch (error: any) {
    toast.add({ title: 'Not saved', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function resetTemplate() {
  if (!current.value || !window.confirm(`Go back to the default words of “${current.value.name}” (both languages)?`)) return
  saving.value = true
  try {
    await $fetch(`/api/superadmin/email-templates/${current.value.id}`, { method: 'PUT', body: { reset: true } })
    await refresh()
    toast.add({ title: 'Back to the default', color: 'success' })
  } finally {
    saving.value = false
  }
}

async function saveLayout() {
  saving.value = true
  try {
    await $fetch('/api/superadmin/email-templates/layout', { method: 'PUT', body: layoutDraft.value })
    toast.add({ title: 'Layout saved', color: 'success' })
    await refresh()
  } catch (error: any) {
    toast.add({ title: 'Not saved', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function resetLayout() {
  if (!window.confirm('Go back to the default colour and footer?')) return
  saving.value = true
  try {
    await $fetch('/api/superadmin/email-templates/layout', { method: 'PUT', body: { reset: true } })
    await refresh()
  } finally {
    saving.value = false
  }
}

async function sendTest() {
  testing.value = true
  try {
    const result = await $fetch<{ to: string }>('/api/superadmin/email-templates/test', { method: 'POST', body: previewBody() })
    toast.add({ title: 'Test sent', description: result.to, color: 'success' })
  } catch (error: any) {
    toast.add({ title: 'Not sent', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    testing.value = false
  }
}
</script>
