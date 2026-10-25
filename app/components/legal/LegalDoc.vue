<template>
  <section>
    <div class="mx-auto max-w-6xl border-x border-line px-5 py-10 sm:px-8 md:py-16">
      <!-- In short -->
      <p class="mk-eyebrow mb-4">{{ lang === 'vi' ? 'Tóm tắt nhanh' : 'In short' }}</p>
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="item in doc.summary" :key="item.title" class="rounded-2xl bg-sand p-5">
          <div class="flex size-9 items-center justify-center rounded-xl bg-paper text-ink ring-1 ring-line">
            <UIcon :name="item.icon" class="size-[18px]" />
          </div>
          <p class="mt-4 text-[15px] font-medium text-ink">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ item.text }}</p>
        </div>
      </div>

      <div class="mt-12 md:mt-16 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
        <!-- Contents: a fold-out on phones, a sticky list on wide screens -->
        <aside class="mb-10 lg:mb-0">
          <details class="group rounded-2xl bg-sand lg:hidden">
            <summary class="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
              {{ lang === 'vi' ? 'Nội dung trang' : 'On this page' }}
              <UIcon name="i-lucide-chevron-down" class="size-4 text-ink-muted transition-transform group-open:rotate-180" />
            </summary>
            <ol class="space-y-0.5 px-2 pb-3">
              <li v-for="(section, i) in doc.sections" :key="section.id">
                <a :href="`#${section.id}`" class="flex gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-muted hover:bg-paper hover:text-ink">
                  <span class="w-5 shrink-0 tabular-nums text-ink-faint">{{ i + 1 }}.</span>{{ section.title }}
                </a>
              </li>
            </ol>
          </details>

          <nav class="sticky top-24 hidden lg:block" :aria-label="lang === 'vi' ? 'Nội dung trang' : 'On this page'">
            <p class="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-ink-faint">{{ lang === 'vi' ? 'Nội dung' : 'Contents' }}</p>
            <ol class="space-y-0.5 border-l border-line">
              <li v-for="(section, i) in doc.sections" :key="section.id">
                <a
                  :href="`#${section.id}`"
                  class="-ml-px flex gap-2 border-l py-1.5 pl-3 text-[13px] leading-snug transition-colors"
                  :class="active === section.id ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-muted hover:text-ink'"
                >
                  <span class="w-4 shrink-0 tabular-nums text-ink-faint">{{ i + 1 }}</span>{{ section.title }}
                </a>
              </li>
            </ol>
          </nav>
        </aside>

        <!-- Sections -->
        <article class="min-w-0 max-w-[68ch]">
          <section
            v-for="(section, i) in doc.sections"
            :id="section.id"
            :key="section.id"
            ref="sectionEls"
            class="scroll-mt-24 border-t border-line py-9 first:border-t-0 first:pt-0"
          >
            <h2 class="flex items-baseline gap-3 text-xl font-semibold tracking-tight text-ink sm:text-[22px]">
              <span class="text-sm font-medium tabular-nums text-ink-faint">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ section.title }}
            </h2>

            <div class="mt-4 space-y-4 text-[15.5px] leading-7 text-ink-soft">
              <template v-for="(block, b) in section.blocks" :key="b">
                <p v-if="typeof block === 'string'"><LegalText :text="block" /></p>

                <ul v-else-if="'list' in block" class="space-y-2.5">
                  <li v-for="(item, k) in block.list" :key="k" class="relative pl-5">
                    <span class="absolute left-0.5 top-[0.7em] size-1.5 rounded-full bg-ink-faint" aria-hidden="true" />
                    <LegalText :text="item" />
                  </li>
                </ul>

                <div v-else-if="'note' in block" class="flex gap-3 rounded-xl bg-sand px-4 py-3.5 text-[15px]">
                  <UIcon name="i-lucide-info" class="mt-1 size-4 shrink-0 text-ink-muted" />
                  <p><LegalText :text="block.note" /></p>
                </div>

                <div v-else-if="'table' in block" class="overflow-hidden rounded-xl ring-1 ring-line">
                  <div
                    v-for="(row, r) in block.table"
                    :key="r"
                    class="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-2.5 text-sm"
                    :class="r === 0 ? 'bg-sand font-medium text-ink' : 'border-t border-line'"
                  >
                    <span class="min-w-0 break-words" :class="r > 0 && 'font-medium text-ink'">{{ row[0] }}</span>
                    <span class="min-w-0">{{ row[1] }}</span>
                  </div>
                </div>
              </template>
            </div>
          </section>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LegalDoc } from '~/data/legal/types'

// Body of a legal page: summary cards, contents and numbered sections
defineProps<{ doc: LegalDoc }>()
const lang = useLegalLang()

// The section being read, highlighted in the contents
const sectionEls = ref<HTMLElement[]>([])
const active = ref<string | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) active.value = visible[0].target.id
    },
    { rootMargin: '-96px 0px -60% 0px' },
  )
  sectionEls.value.forEach(el => observer!.observe(el))
})
onBeforeUnmount(() => observer?.disconnect())
</script>
