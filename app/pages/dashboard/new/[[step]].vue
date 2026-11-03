<template>
  <!-- The create flow: full screen, one decision per step, each step its own
       address (so Back works). Nothing is made until the last step -->
  <div class="flex min-h-dvh flex-col bg-paper text-ink">
    <!-- Bar: the mark, how far along, a way out -->
    <header class="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div class="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <NuxtLink to="/dashboard" class="flex items-center" :aria-label="text.close">
          <AppLogo variant="mark" :size="28" />
        </NuxtLink>
        <p v-if="stepIndex >= 0" class="flex-1 text-center text-sm font-medium text-ink-muted">
          {{ text.stepOf(stepIndex + 1, STEPS.length) }}
        </p>
        <span v-else class="flex-1" />
        <UButton to="/dashboard" icon="i-lucide-x" color="neutral" variant="ghost" :aria-label="text.close" />
      </div>
      <div v-if="stepIndex >= 0" class="h-0.5 bg-sand">
        <div class="h-full bg-tint transition-[width] duration-500" :style="{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }" />
      </div>
    </header>

    <main class="flex-1 px-4 pb-32 pt-8 sm:px-6 sm:pt-12">
      <!-- 1. What it's for -->
      <section v-if="step === 'goal'" class="mx-auto w-full max-w-3xl">
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ text.goal.title }}</h1>
        <p class="mt-2 text-ink-muted">{{ text.goal.lead }}</p>

        <!-- No room left on the plan: say so before they fill anything in -->
        <div v-if="atSiteLimit" class="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200">
          <UIcon name="i-lucide-info" class="size-5 shrink-0 text-sky-700" />
          <p class="min-w-0 flex-1 text-sm text-sky-900">{{ text.limit(billing!.limits.sites) }}</p>
          <UButton to="/dashboard/upgrade" size="sm" :label="text.seePlans" />
        </div>

        <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            v-for="goal in SITE_GOALS"
            :key="goal.id"
            type="button"
            class="group flex items-center gap-3 rounded-2xl bg-paper p-4 text-left ring-1 transition sm:flex-col sm:items-start sm:gap-4 sm:p-5"
            :class="state.goal === goal.id ? 'ring-2 ring-tint' : 'ring-line hover:bg-sand/60'"
            :aria-pressed="state.goal === goal.id"
            @click="chooseGoal(goal.id)"
          >
            <span class="flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors" :class="state.goal === goal.id ? 'bg-tint text-white' : 'bg-sand text-ink-soft'">
              <UIcon :name="goal.icon" class="size-5" />
            </span>
            <span class="min-w-0">
              <span class="block font-semibold">{{ goal[lang].label }}</span>
              <span class="mt-0.5 block text-sm text-ink-muted">{{ goal[lang].hint }}</span>
            </span>
          </button>
        </div>
      </section>

      <!-- 2. Name, a line about it, a photo -->
      <section v-else-if="step === 'basics'" class="mx-auto w-full max-w-xl">
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ text.basics.title }}</h1>
        <p class="mt-2 text-ink-muted">{{ text.basics.lead }}</p>

        <div class="mt-8 flex items-center gap-4">
          <button
            type="button"
            class="group relative size-20 shrink-0 rounded-full"
            :aria-label="text.basics.photo"
            @click="photoInput?.click()"
          >
            <!-- The photo is clipped to the circle; the camera badge sits over its edge, whole -->
            <span class="flex size-full items-center justify-center overflow-hidden rounded-full bg-sand text-2xl font-semibold text-ink-soft ring-1 ring-line transition group-hover:ring-ink-faint">
              <img v-if="avatarPreview" :src="avatarPreview" alt="" class="size-full object-cover">
              <template v-else>{{ initial }}</template>
            </span>
            <span class="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full bg-ink text-paper ring-2 ring-paper">
              <UIcon name="i-lucide-camera" class="size-3.5" />
            </span>
          </button>
          <div class="min-w-0 text-sm">
            <p class="font-medium">{{ text.basics.photo }}</p>
            <p class="text-ink-muted">{{ text.basics.photoHint }}</p>
            <button v-if="avatarPreview" type="button" class="mt-1 text-ink-muted underline underline-offset-2 hover:text-ink" @click="clearPhoto">{{ text.basics.removePhoto }}</button>
          </div>
          <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="pickPhoto">
        </div>

        <div class="mt-8 space-y-5">
          <UFormField :label="text.basics.name" required>
            <UInput v-model="state.title" size="xl" class="w-full" maxlength="60" :placeholder="goalCopy.title" autofocus @keydown.enter="next" />
          </UFormField>
          <UFormField :label="text.basics.about" :hint="`${state.bio.length}/160`">
            <UTextarea v-model="state.bio" :rows="3" autoresize class="w-full" maxlength="160" :placeholder="goalCopy.bio" />
          </UFormField>
        </div>
      </section>

      <!-- 3. A look, every template shown with their own name and photo -->
      <section v-else-if="step === 'look'" class="mx-auto w-full max-w-5xl">
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ text.look.title }}</h1>
        <p class="mt-2 text-ink-muted">{{ text.look.lead }}</p>

        <div class="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          <button
            v-for="template in shownTemplates"
            :key="template.id"
            type="button"
            class="group overflow-hidden rounded-3xl bg-paper text-left ring-1 transition"
            :class="state.templateId === template.id ? 'ring-2 ring-tint' : 'ring-line hover:-translate-y-0.5 hover:shadow-xl'"
            :aria-pressed="state.templateId === template.id"
            @click="state.templateId = template.id"
          >
            <div class="relative aspect-[3/4] overflow-hidden border-b border-line">
              <SiteTemplateThumbnail lazy :template="template" :scale="0.4" :personal="personal" />
              <span v-if="state.templateId === template.id" class="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-tint text-white shadow">
                <UIcon name="i-lucide-check" class="size-4" />
              </span>
            </div>
            <div class="p-3 sm:p-4">
              <p class="truncate text-sm font-semibold sm:text-base">{{ t(`dashboard.templates.${template.id}.name`) }}</p>
              <p class="mt-0.5 line-clamp-2 text-xs text-ink-muted sm:text-sm">{{ t(`dashboard.templates.${template.id}.description`) }}</p>
            </div>
          </button>
        </div>
        <div v-if="!showAll && otherTemplates.length" class="mt-8 flex justify-center">
          <UButton color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" :label="text.look.more(otherTemplates.length)" @click="showAll = true" />
        </div>
      </section>

      <!-- 4. The address, then the site is made -->
      <section v-else-if="step === 'address'" class="mx-auto w-full max-w-xl">
        <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">{{ text.address.title }}</h1>
        <p class="mt-2 text-ink-muted">{{ text.address.lead }}</p>

        <!-- A full plan: the last step is where it matters -->
        <div v-if="atSiteLimit" class="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200">
          <UIcon name="i-lucide-info" class="size-5 shrink-0 text-sky-700" />
          <p class="min-w-0 flex-1 text-sm text-sky-900">{{ text.limit(billing!.limits.sites) }}</p>
          <UButton to="/dashboard/upgrade" size="sm" :label="text.seePlans" />
        </div>

        <div class="mt-8 flex items-center rounded-2xl bg-paper px-4 ring-1 ring-line transition focus-within:ring-2 focus-within:ring-tint">
          <span class="shrink-0 text-lg text-ink-muted">perlink.to/</span>
          <input
            v-model="state.address"
            type="text"
            inputmode="url"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            class="min-w-0 flex-1 bg-transparent py-4 text-lg font-medium outline-none"
            :aria-label="text.address.title"
            @keydown.enter="next"
          >
          <UIcon v-if="addressStatus === 'checking'" name="i-lucide-loader-circle" class="size-5 shrink-0 animate-spin text-ink-muted" />
          <UIcon v-else-if="addressStatus === 'available'" name="i-lucide-circle-check" class="size-5 shrink-0 text-success" />
          <UIcon v-else-if="addressStatus === 'taken' || addressStatus === 'invalid'" name="i-lucide-circle-alert" class="size-5 shrink-0 text-error" />
        </div>
        <p class="mt-2 min-h-5 text-sm" :class="addressStatus === 'available' ? 'text-success' : addressStatus === 'taken' || addressStatus === 'invalid' ? 'text-error' : 'text-ink-muted'">
          {{ addressMessage }}
        </p>

        <div v-if="suggestions.length" class="mt-6">
          <p class="text-sm font-medium">{{ text.address.suggestions }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="option in suggestions"
              :key="option"
              type="button"
              class="rounded-full px-3.5 py-1.5 text-sm ring-1 transition"
              :class="state.address === option ? 'bg-ink text-paper ring-ink' : 'ring-line hover:bg-sand'"
              @click="state.address = option"
            >
              perlink.to/{{ option }}
            </button>
          </div>
        </div>
        <p class="mt-8 text-sm text-ink-muted">{{ text.address.later }}</p>
      </section>

      <!-- Made: a look at it, then on to the editor -->
      <section v-else-if="step === 'done'" class="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 text-center sm:flex-row sm:items-center sm:text-left">
        <div class="relative aspect-[9/16] w-56 shrink-0 overflow-hidden rounded-[2rem] ring-[6px] ring-ink sm:w-64">
          <SiteTemplateThumbnail v-if="doneTemplate" :template="doneTemplate" :scale="0.66" :personal="donePersonal" />
        </div>
        <div>
          <span class="inline-flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <UIcon name="i-lucide-check" class="size-6" />
          </span>
          <h1 class="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{{ text.done.title }}</h1>
          <p class="mt-2 text-ink-muted">{{ text.done.lead(doneSite) }}</p>
          <div class="mt-6 flex flex-col gap-2 sm:flex-row">
            <UButton size="lg" :to="`/dashboard/site/${doneSite}`" trailing-icon="i-lucide-arrow-right" :label="text.done.edit" class="justify-center" />
            <UButton size="lg" to="/dashboard/site" color="neutral" variant="outline" :label="text.done.sites" class="justify-center" />
          </div>
        </div>
      </section>
    </main>

    <!-- Back and Continue, always at hand -->
    <footer v-if="stepIndex >= 0" class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <p v-if="atSiteLimit" class="flex items-center gap-1.5 border-b border-line px-4 py-2 text-xs text-ink-muted sm:hidden">
        <UIcon name="i-lucide-info" class="size-3.5 shrink-0 text-sky-600" />
        <span class="min-w-0 flex-1">{{ text.limitShort(billing!.limits.sites) }}</span>
        <NuxtLink to="/dashboard/upgrade" class="shrink-0 font-medium text-ink underline underline-offset-2">{{ text.seePlans }}</NuxtLink>
      </p>
      <div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <UButton v-if="stepIndex > 0" color="neutral" variant="ghost" icon="i-lucide-arrow-left" :label="text.back" @click="back" />
        <span v-else />
        <!-- A full plan, said where the button is -->
        <p v-if="atSiteLimit" class="hidden min-w-0 flex-1 items-center justify-end gap-1.5 text-right text-xs text-ink-muted sm:flex">
          <UIcon name="i-lucide-info" class="size-3.5 shrink-0 text-sky-600" />
          <span class="truncate">{{ text.limitShort(billing!.limits.sites) }}</span>
          <NuxtLink to="/dashboard/upgrade" class="shrink-0 font-medium text-ink underline underline-offset-2">{{ text.seePlans }}</NuxtLink>
        </p>
        <UButton
          size="lg"
          :loading="creating"
          :disabled="!canContinue"
          :trailing-icon="step === 'address' ? 'i-lucide-sparkles' : 'i-lucide-arrow-right'"
          :label="step === 'address' ? text.create : text.next"
          @click="next"
        />
      </div>
    </footer>

    <BillingUpgradeDialog />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { SITE_GOALS, addressFromName, goalForCategory, type SiteGoalId } from '~/data/siteGoals'

definePageMeta({
  layout: false,
  middleware: 'auth',
  ssr: false,
  // One page for every step, so the photo picked (kept in memory) and the
  // finished site survive moving between them
  key: 'new-site',
})

const STEPS = ['goal', 'basics', 'look', 'address'] as const
type Step = typeof STEPS[number] | 'done'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const lang = computed<'en' | 'vi'>(() => (locale.value === 'vi' ? 'vi' : 'en'))
useHead({ htmlAttrs: { class: 'admin-theme' } })

const TEXT = {
  en: {
    close: 'Back to the dashboard',
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    back: 'Back',
    next: 'Continue',
    create: 'Create my site',
    seePlans: 'See plans',
    limit: (n: number) => `Your plan has ${n} live ${n === 1 ? 'site' : 'sites'} and they're all in use. You can still make and edit this site; it stays a draft until you upgrade or take another site offline.`,
    limitShort: (n: number) => `Your ${n} live ${n === 1 ? 'site is' : 'sites are'} in use: this one will be saved as a draft.`,
    goal: { title: 'What is your site for?', lead: 'We’ll suggest the templates and blocks that fit. You can change everything later.' },
    basics: {
      title: 'Tell visitors who you are',
      lead: 'Your page uses these right away, instead of sample text.',
      photo: 'Photo or logo',
      photoHint: 'Optional. A square picture works best.',
      removePhoto: 'Remove',
      name: 'Name of your page',
      about: 'One line about it',
    },
    look: { title: 'Pick a look', lead: 'Every template is shown with your name. Colors, fonts and blocks can all be changed in the editor.', more: (n: number) => `See ${n} more templates` },
    address: {
      title: 'Choose your address',
      lead: 'This is the link you’ll share. Letters, numbers, hyphens and underscores.',
      suggestions: 'Free addresses for you',
      later: 'You can change the address later in the site’s settings.',
      checking: 'Checking…',
      available: (a: string) => `perlink.to/${a} is free`,
      taken: 'That address is taken. Try another, or pick a suggestion.',
      short: 'At least 3 characters.',
      failed: 'Couldn’t check the address. Try again.',
    },
    done: { title: 'Your site is ready', lead: (a: string) => `perlink.to/${a} is saved as a draft. Add your links and photos in the editor, then publish when you’re happy.`, edit: 'Open the editor', sites: 'My sites' },
    failed: 'Couldn’t create the site',
  },
  vi: {
    close: 'Về bảng điều khiển',
    stepOf: (n: number, total: number) => `Bước ${n}/${total}`,
    back: 'Quay lại',
    next: 'Tiếp tục',
    create: 'Tạo trang của tôi',
    seePlans: 'Xem các gói',
    limit: (n: number) => `Gói của bạn cho ${n} trang đang hiển thị và đã dùng hết. Bạn vẫn tạo và chỉnh sửa trang này bình thường; trang sẽ ở dạng nháp cho tới khi bạn nâng cấp hoặc ẩn bớt một trang khác.`,
    limitShort: (n: number) => `Đã dùng hết ${n} trang hiển thị: trang này sẽ lưu nháp.`,
    goal: { title: 'Trang của bạn dùng để làm gì?', lead: 'Perlink sẽ gợi ý mẫu và khối nội dung phù hợp. Mọi thứ đều sửa lại được sau.' },
    basics: {
      title: 'Giới thiệu đôi chút về bạn',
      lead: 'Trang của bạn dùng ngay những thông tin này thay cho chữ mẫu.',
      photo: 'Ảnh đại diện hoặc logo',
      photoHint: 'Không bắt buộc. Ảnh vuông là đẹp nhất.',
      removePhoto: 'Gỡ ảnh',
      name: 'Tên trang',
      about: 'Một câu giới thiệu',
    },
    look: { title: 'Chọn giao diện', lead: 'Mỗi mẫu đều hiển thị bằng tên của bạn. Màu, phông chữ và các khối đều đổi được trong trình chỉnh sửa.', more: (n: number) => `Xem thêm ${n} mẫu` },
    address: {
      title: 'Chọn địa chỉ trang',
      lead: 'Đây là đường link bạn sẽ chia sẻ. Gồm chữ, số, gạch ngang và gạch dưới.',
      suggestions: 'Địa chỉ còn trống cho bạn',
      later: 'Bạn có thể đổi địa chỉ sau trong phần cài đặt của trang.',
      checking: 'Đang kiểm tra…',
      available: (a: string) => `perlink.to/${a} còn trống`,
      taken: 'Địa chỉ này đã có người dùng. Thử tên khác hoặc chọn một gợi ý.',
      short: 'Ít nhất 3 ký tự.',
      failed: 'Không kiểm tra được địa chỉ. Thử lại nhé.',
    },
    done: { title: 'Trang của bạn đã sẵn sàng', lead: (a: string) => `perlink.to/${a} đang được lưu ở dạng nháp. Thêm liên kết và hình ảnh trong trình chỉnh sửa, rồi đăng khi bạn ưng ý.`, edit: 'Mở trình chỉnh sửa', sites: 'Trang của tôi' },
    failed: 'Không tạo được trang',
  },
}
const text = computed(() => TEXT[lang.value])

// ---------- State, kept for the tab so a reload doesn't lose it ----------
interface Draft { goal: SiteGoalId | null; title: string; bio: string; templateId: string | null; address: string }
const STORE = 'perlink:new-site'
const empty = (): Draft => ({ goal: null, title: '', bio: '', templateId: null, address: '' })
const state = reactive<Draft>(empty())
function restore() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || 'null')
    if (saved) Object.assign(state, saved)
  } catch {}
}
watch(state, () => {
  try { sessionStorage.setItem(STORE, JSON.stringify(state)) } catch {}
}, { deep: true })

// The photo stays in the page until the site exists (uploads belong to a site)
const avatarFile = shallowRef<File | null>(null)
const avatarPreview = ref('')
const photoInput = ref<HTMLInputElement | null>(null)
function pickPhoto(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}
function clearPhoto() {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarFile.value = null
  avatarPreview.value = ''
  if (photoInput.value) photoInput.value.value = ''
}

// ---------- Steps ----------
const step = computed<Step>(() => {
  const value = String(route.params.step || 'goal')
  return (value === 'done' || (STEPS as readonly string[]).includes(value) ? value : 'goal') as Step
})
const stepIndex = computed(() => (STEPS as readonly string[]).indexOf(step.value))
const go = (to: Step) => router.push({ path: `/dashboard/new/${to}` })

// A fresh start from "Create a site"; a template or an address chosen
// elsewhere comes along (?template=, ?address=)
onMounted(() => {
  const fresh = !route.params.step
  if (fresh) {
    try { sessionStorage.removeItem(STORE) } catch {}
    Object.assign(state, empty())
  } else {
    restore()
  }
  const template = PAGE_TEMPLATES.find(item => item.id === route.query.template)
  if (template) {
    state.templateId = template.id
    state.goal = goalForCategory(template.category)
  }
  if (typeof route.query.address === 'string') state.address = route.query.address.toLowerCase()
  if (fresh) {
    router.replace({ path: `/dashboard/new/${template ? 'basics' : 'goal'}` })
  } else if (step.value !== 'done' && missingBefore(step.value)) {
    router.replace({ path: `/dashboard/new/${missingBefore(step.value)}` })
  }
})

// The first earlier step still unanswered, if any
function missingBefore(current: Step): Step | null {
  const index = (STEPS as readonly string[]).indexOf(current)
  if (index > 0 && !state.goal) return 'goal'
  if (index > 1 && !state.title.trim()) return 'basics'
  if (index > 2 && !state.templateId) return 'look'
  return null
}

function chooseGoal(id: SiteGoalId) {
  state.goal = id
  // Templates follow the goal
  const suggested = templatesFor(id)
  if (!state.templateId || !suggested.some(item => item.id === state.templateId)) state.templateId = suggested[0]?.id ?? null
  next()
}

const canContinue = computed(() => {
  if (step.value === 'goal') return !!state.goal
  if (step.value === 'basics') return !!state.title.trim()
  if (step.value === 'look') return !!state.templateId
  if (step.value === 'address') return addressStatus.value === 'available'
  return false
})

function next() {
  if (!canContinue.value) return
  if (step.value === 'address') return create()
  go(STEPS[stepIndex.value + 1]!)
}
function back() {
  if (stepIndex.value > 0) go(STEPS[stepIndex.value - 1]!)
}

// ---------- Goal and templates ----------
const goalCopy = computed(() => (SITE_GOALS.find(goal => goal.id === state.goal) ?? SITE_GOALS[0]!)[lang.value])
const initial = computed(() => Array.from(state.title.trim() || '?')[0]!.toUpperCase())
function templatesFor(goal: SiteGoalId | null) {
  const categories = SITE_GOALS.find(item => item.id === goal)?.categories ?? []
  return PAGE_TEMPLATES.filter(item => categories.includes(item.category))
}
const showAll = ref(false)
const suggestedTemplates = computed(() => templatesFor(state.goal))
const otherTemplates = computed(() => PAGE_TEMPLATES.filter(item => !suggestedTemplates.value.includes(item)))
const shownTemplates = computed(() => {
  const list = showAll.value || !suggestedTemplates.value.length ? [...suggestedTemplates.value, ...otherTemplates.value] : suggestedTemplates.value
  // A template picked elsewhere stays in view
  const picked = PAGE_TEMPLATES.find(item => item.id === state.templateId)
  return picked && !list.includes(picked) ? [picked, ...list] : list
})
const personal = computed(() => ({ title: state.title.trim(), bio: state.bio.trim(), avatarUrl: avatarPreview.value }))

// ---------- Address ----------
const addressStatus = ref<'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'failed'>('idle')
const addressMessage = computed(() => ({
  idle: '',
  checking: text.value.address.checking,
  available: text.value.address.available(state.address),
  taken: text.value.address.taken,
  invalid: text.value.address.short,
  failed: text.value.address.failed,
})[addressStatus.value])

async function isFree(address: string) {
  const res = await $fetch<{ success: boolean }>('/api/check_bio_username_exists', { method: 'POST', body: { username: address } })
  return res.success
}
const checkAddress = useDebounceFn(async (value: string) => {
  try {
    const free = await isFree(value)
    if (value === state.address) addressStatus.value = free ? 'available' : 'taken'
  } catch {
    if (value === state.address) addressStatus.value = 'failed'
  }
}, 350)
watch(() => state.address, (raw) => {
  const value = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').slice(0, 30)
  if (value !== raw) {
    state.address = value
    return
  }
  if (!value) addressStatus.value = 'idle'
  else if (value.length < 3) addressStatus.value = 'invalid'
  else {
    addressStatus.value = 'checking'
    checkAddress(value)
  }
}, { immediate: true })

// Free addresses made from the name, offered (and the first one filled in)
const suggestions = ref<string[]>([])
// (also once the saved draft is back, after a reload on this step)
watch([step, () => state.title], async ([current]) => {
  if (current !== 'address') return
  const base = addressFromName(state.title)
  if (!base) return
  const candidates = [...new Set([base, base.replace(/-/g, ''), `${base}-vn`, `${base}-${new Date().getFullYear() % 100}`]
    .filter(item => item.length >= 3 && item.length <= 30))]
  const free: string[] = []
  for (const candidate of candidates) {
    if (free.length >= 3) break
    if (await isFree(candidate).catch(() => false)) free.push(candidate)
  }
  suggestions.value = free
  if (!state.address && free[0]) state.address = free[0]
}, { immediate: true })

// ---------- Plan room ----------
const { info: billing, ensure: ensureBilling } = useBilling()
onMounted(() => ensureBilling())
// Every live site on the plan is in use: a new site stays a draft (a heads-up, never a block)
const atSiteLimit = computed(() => !!billing.value && (billing.value.liveSites ?? billing.value.sites) >= billing.value.limits.sites)

// ---------- Make it ----------
const { createSite } = useCreateSite()
const toast = useToast()
const creating = ref(false)
const doneSite = ref('')
const doneTemplate = ref<typeof PAGE_TEMPLATES[number] | null>(null)
const donePersonal = ref({ title: '', bio: '', avatarUrl: '' })

async function create() {
  if (creating.value || !state.templateId) return
  creating.value = true
  try {
    const username = await createSite({
      username: state.address,
      templateId: state.templateId,
      title: state.title.trim(),
      bio: state.bio.trim(),
      avatarFile: avatarFile.value,
    })
    doneSite.value = username
    doneTemplate.value = PAGE_TEMPLATES.find(item => item.id === state.templateId) ?? null
    donePersonal.value = { ...personal.value }
    try { sessionStorage.removeItem(STORE) } catch {}
    await router.replace({ path: '/dashboard/new/done' })
  } catch (error: any) {
    if (useUpgradePrompt().fromError(error)) return
    toast.add({ title: text.value.failed, description: error?.data?.statusMessage || error?.message, color: 'error' })
    addressStatus.value = 'checking'
    checkAddress(state.address)
  } finally {
    creating.value = false
  }
}

// The done screen needs a site made here; a reload there goes to the list
watch(step, (current) => {
  if (current === 'done' && !doneSite.value) router.replace('/dashboard/site')
}, { immediate: true })

useSeoMeta({ title: () => `${lang.value === 'vi' ? 'Tạo trang mới' : 'New site'} — Perlink`, robots: 'noindex, nofollow' })
</script>
