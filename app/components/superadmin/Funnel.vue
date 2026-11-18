<template>
  <!-- Activation funnel: signed up → made a site → published → views → paid,
       with who is stuck at the first two steps -->
  <div class="rounded-3xl bg-paper ring-1 ring-line">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
      <div>
        <h3 class="font-medium text-highlighted">Activation</h3>
        <p class="text-xs text-muted">How far new people get, by signup date (your account left out)</p>
      </div>
      <div class="inline-flex rounded-full bg-sand/60 p-1 text-sm">
        <button
          v-for="opt in periods"
          :key="opt.value"
          type="button"
          class="rounded-full px-3 py-1 transition-colors"
          :class="days === opt.value ? 'bg-default font-medium text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
          @click="days = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="p-5">
      <div v-if="!data" class="space-y-3">
        <USkeleton v-for="i in 5" :key="i" class="h-10 w-full rounded-xl" />
      </div>

      <template v-else>
        <p v-if="!top" class="py-8 text-center text-sm text-muted">Nobody signed up in this period.</p>

        <ol v-else class="space-y-2.5">
          <li v-for="(step, i) in rows" :key="step.key">
            <!-- Drop between this step and the one before -->
            <p
              v-if="i > 0 && step.lost > 0"
              class="mb-1.5 ml-11 flex items-center gap-1 text-xs"
              :class="step.key === worst ? 'font-medium text-error' : 'text-dimmed'"
            >
              <UIcon name="i-lucide-arrow-down-right" class="size-3.5" />
              {{ step.lost }} dropped ({{ step.lostPct }}%)
              <span v-if="step.key === worst" class="ml-1 rounded-full bg-error/10 px-1.5 py-px text-[10px] uppercase tracking-wide">Biggest drop</span>
            </p>

            <div class="flex items-center gap-3">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-xl" :class="step.tile">
                <UIcon :name="step.icon" class="size-4" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span class="truncate text-default">{{ step.label }}</span>
                  <span class="shrink-0 tabular-nums">
                    <span class="font-semibold text-highlighted">{{ step.count }}</span>
                    <span class="ml-1.5 text-xs text-muted">{{ step.pct }}%</span>
                  </span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-accented">
                  <div class="h-full rounded-full transition-all duration-500" :class="step.bar" :style="{ width: `${Math.max(step.pct, step.count ? 2 : 0)}%` }" />
                </div>
              </div>
            </div>
          </li>
        </ol>

        <!-- Who is stuck -->
        <div v-if="data.stuck.noSite.length || data.stuck.notPublished.length" class="mt-6 grid gap-4 sm:grid-cols-2">
          <div v-for="group in stuckGroups" :key="group.title">
            <p class="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
              <UIcon :name="group.icon" class="size-3.5" />
              {{ group.title }}
            </p>
            <p v-if="!group.people.length" class="text-sm text-dimmed">Nobody 🎉</p>
            <ul class="space-y-1">
              <li v-for="u in group.people" :key="u.id">
                <NuxtLink :to="`/superadmin/users/${u.id}`" class="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-sand/50">
                  <UAvatar :src="u.avatar || undefined" :text="initial(u.name || u.email)" size="xs" />
                  <span class="min-w-0 flex-1 truncate text-sm text-default">{{ u.name?.trim() || u.email || 'Unnamed account' }}</span>
                  <span class="shrink-0 text-xs text-dimmed">{{ ago(u.at) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Person { id: string; email: string; name: string | null; avatar: string | null; at: string }
interface Funnel {
  days: number | null
  viewsGoal: number
  steps: { key: 'signedUp' | 'madeSite' | 'published' | 'gotViews' | 'paid'; count: number }[]
  stuck: { noSite: Person[]; notPublished: Person[] }
}

const periods = [
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: 'all', label: 'All' },
]
const days = ref('90')

const { data } = useFetch<Funnel>('/api/superadmin/funnel', { query: { days }, server: false })

const STEP = {
  signedUp: { label: 'Signed up', icon: 'i-lucide-user-plus', tile: 'bg-sky-500/15 text-sky-500', bar: 'bg-sky-500' },
  madeSite: { label: 'Made a site', icon: 'i-lucide-layout-template', tile: 'bg-primary/15 text-primary', bar: 'bg-primary' },
  published: { label: 'Published it', icon: 'i-lucide-globe', tile: 'bg-violet-500/15 text-violet-500', bar: 'bg-violet-500' },
  gotViews: { label: '', icon: 'i-lucide-eye', tile: 'bg-amber-500/15 text-amber-500', bar: 'bg-amber-500' },
  paid: { label: 'Paid', icon: 'i-lucide-badge-dollar-sign', tile: 'bg-success/15 text-success', bar: 'bg-success' },
} as const

const top = computed(() => data.value?.steps[0]?.count ?? 0)

const rows = computed(() => {
  const steps = data.value?.steps ?? []
  return steps.map((s, i) => {
    const prev = i > 0 ? steps[i - 1]!.count : s.count
    const lost = Math.max(prev - s.count, 0)
    const meta = STEP[s.key]
    return {
      ...s,
      ...meta,
      label: s.key === 'gotViews' ? `${data.value?.viewsGoal ?? 10}+ views` : meta.label,
      pct: top.value ? Math.round((s.count / top.value) * 100) : 0,
      lost,
      lostPct: prev ? Math.round((lost / prev) * 100) : 0,
    }
  })
})

// The step that loses the largest share of the one before (paid left out: it's the end goal)
const worst = computed(() => {
  const candidates = rows.value.slice(1, -1).filter(r => r.lost > 0)
  return candidates.sort((a, b) => b.lostPct - a.lostPct)[0]?.key ?? null
})

const stuckGroups = computed(() => [
  { title: 'No site yet', icon: 'i-lucide-circle-dashed', people: data.value?.stuck.noSite ?? [] },
  { title: 'Site not published', icon: 'i-lucide-eye-off', people: data.value?.stuck.notPublished ?? [] },
])

const initial = (text: string | null) => (Array.from(text?.trim() || '')[0] || '?').toUpperCase()

const ago = (date: string) => {
  const ms = Date.now() - new Date(date.includes('T') ? date : `${date.replace(' ', 'T')}Z`).getTime()
  const d = Math.floor(ms / 86_400_000)
  if (d < 1) return 'today'
  return `${d}d ago`
}
</script>
