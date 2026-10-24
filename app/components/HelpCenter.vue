<template>
  <div class="fixed right-5 z-50 flex flex-col items-end gap-3 print:hidden" :class="aboveActionBar ? 'bottom-20 lg:bottom-5' : 'bottom-5'">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
    >
      <section
        v-if="open"
        class="flex max-h-[min(70vh,560px)] w-[min(360px,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_24px_60px_-12px_rgba(12,11,10,0.25)] ring-1 ring-line"
        role="dialog"
        aria-label="Help"
      >
        <header class="flex items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-5">
          <div>
            <p class="text-base font-medium">How can we help?</p>
            <p class="mt-0.5 text-sm text-ink-muted">Quick answers, or talk to us.</p>
          </div>
          <button type="button" class="-mr-1.5 -mt-1 inline-flex size-8 items-center justify-center rounded-full text-ink-muted hover:bg-sand hover:text-ink" aria-label="Close help" @click="open = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-2 py-2">
          <details v-for="item in answers" :key="item.q" class="group rounded-xl px-3 open:bg-sand">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm text-ink [&::-webkit-details-marker]:hidden">
              {{ item.q }}
              <UIcon name="i-lucide-chevron-down" class="size-4 shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
            </summary>
            <p class="pb-3 text-sm leading-relaxed text-ink-muted">{{ item.a }}</p>
          </details>
        </div>

        <footer class="grid grid-cols-2 gap-2 border-t border-line p-3">
          <a :href="mailto" class="flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper hover:bg-ink-soft">
            <UIcon name="i-lucide-mail" class="size-4" />
            Contact us
          </a>
          <NuxtLink
            :to="loggedIn ? '/dashboard/feedback' : '/login'"
            class="flex h-10 items-center justify-center gap-2 rounded-full text-sm font-medium text-ink ring-1 ring-inset ring-line hover:bg-sand"
            @click="open = false"
          >
            <UIcon name="i-lucide-message-square-heart" class="size-4" />
            Feedback
          </NuxtLink>
        </footer>
      </section>
    </Transition>

    <button
      type="button"
      class="inline-flex size-11 items-center justify-center rounded-full bg-ink text-paper shadow-[0_8px_24px_-6px_rgba(12,11,10,0.35)] transition-transform hover:scale-105"
      :aria-expanded="open"
      :aria-label="open ? 'Close help' : 'Help'"
      @click="open = !open"
    >
      <UIcon :name="open ? 'i-lucide-x' : 'i-lucide-circle-help'" class="size-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
// The site editor has a sticky action bar at the bottom on small screens
const route = useRoute()
const aboveActionBar = computed(() => route.path.startsWith('/dashboard/bio/'))

// Floating help: common questions plus ways to reach us. Shared open state
// so the dashboard sidebar's Help item can open it too.
const open = useHelpCenter()
const { loggedIn } = useUserSession()

const mailto = 'mailto:kimduc10a@gmail.com?subject=' + encodeURIComponent('Perlink help')

const answers = [
  { q: 'How do I create my site?', a: 'Go to Dashboard → Create, claim your perlink.to name and pick a template. You can change everything later.' },
  { q: 'How do I turn on the 3D world?', a: 'Open your site in the editor and switch on “3D room”. Then open the 3D editor to furnish the room and pick a land.' },
  { q: 'How do I publish?', a: 'Press Publish in the editor. Your site goes live at perlink.to/yourname straight away.' },
  { q: 'Can I add my own photos?', a: 'Yes. Add an image album block to your site, or place a picture frame in your 3D room and upload a photo.' },
  { q: 'Does it work on phones?', a: 'Yes. Sites are mobile-first, and the 3D world runs in the browser and adapts its quality to the device.' },
  { q: 'Can visitors still see a normal page?', a: 'Always. Visitors can switch from the 3D world to your 2D page with one tap.' },
]

watch(() => route.fullPath, () => (open.value = false))
</script>
