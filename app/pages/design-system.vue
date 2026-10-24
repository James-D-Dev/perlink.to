<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <p class="mk-eyebrow mb-4">Design system</p>
      <h1 class="mk-display text-5xl sm:text-6xl">Perlink design system</h1>
      <p class="mt-5 max-w-2xl text-lg text-ink-muted">
        Warm paper and sand surfaces, ink text and hairline rules. Colour comes from imagery and the gradient orbs, never from UI chrome.
        Tokens live in <code class="rounded bg-sand px-1.5 py-0.5 text-sm">app/assets/css/main.css</code>; components in
        <code class="rounded bg-sand px-1.5 py-0.5 text-sm">app/components/marketing</code>.
      </p>
    </MarketingMkSection>

    <!-- Logo -->
    <MarketingMkSection title="Logo" description="A geometric lowercase p with a gradient orb in its bowl; the wordmark is Inter Tight, medium, tight tracking.">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="flex h-40 items-center justify-center rounded-2xl bg-sand"><AppLogo :size="40" /></div>
        <div class="flex h-40 items-center justify-center rounded-2xl bg-ink"><AppLogo :size="40" inverted /></div>
        <div class="flex h-40 items-center justify-center gap-6 rounded-2xl bg-sand">
          <AppLogo variant="mark" :size="56" />
          <AppLogo variant="mark" :size="32" />
          <AppLogo variant="mark" :size="18" />
        </div>
      </div>
    </MarketingMkSection>

    <!-- Colour -->
    <MarketingMkSection title="Colour" description="Neutral, warm and quiet. Use ink for primary actions; never introduce a brand colour for buttons.">
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div v-for="swatch in colors" :key="swatch.token">
          <div class="h-24 rounded-2xl ring-1 ring-line" :style="{ background: swatch.value }" />
          <p class="mt-2 text-sm font-medium">{{ swatch.name }}</p>
          <p class="text-xs text-ink-muted">{{ swatch.token }} · {{ swatch.value }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Type -->
    <MarketingMkSection title="Typography" description="Display: Inter Tight 300 with tight tracking. Body: Inter 400/500. Keep body copy at 15–18px with relaxed leading.">
      <div class="divide-y divide-line border-y border-line">
        <div v-for="sample in type" :key="sample.label" class="grid gap-2 py-6 sm:grid-cols-[180px_1fr] sm:items-baseline">
          <p class="text-xs text-ink-muted">{{ sample.label }}</p>
          <p :class="sample.class">{{ sample.text }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Components -->
    <MarketingMkSection title="Buttons" description="Pill shaped. One solid button per view; outline for secondary actions; ghost for tertiary.">
      <div class="flex flex-wrap items-center gap-3">
        <MarketingMkButton>Solid</MarketingMkButton>
        <MarketingMkButton variant="outline">Outline</MarketingMkButton>
        <MarketingMkButton variant="ghost">Ghost</MarketingMkButton>
        <MarketingMkButton trailing-icon="i-lucide-arrow-right">With icon</MarketingMkButton>
        <MarketingMkButton size="sm">Small</MarketingMkButton>
        <MarketingMkButton size="lg">Large</MarketingMkButton>
        <span class="rounded-2xl bg-ink p-3"><MarketingMkButton variant="inverse">Inverse</MarketingMkButton></span>
      </div>
    </MarketingMkSection>

    <MarketingMkSection title="Surfaces and cards" description="Cards are sand with a 16px radius and no shadow. Floating panels (popups) are paper with a hairline ring and a soft shadow.">
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl bg-sand p-6">
          <p class="text-sm font-medium">Card</p>
          <p class="mt-1 text-sm text-ink-muted">bg-sand · rounded-2xl</p>
        </div>
        <div class="rounded-2xl bg-paper p-6 ring-1 ring-line">
          <p class="text-sm font-medium">Outlined</p>
          <p class="mt-1 text-sm text-ink-muted">bg-paper · ring-line</p>
        </div>
        <div class="rounded-2xl bg-paper p-6 shadow-[0_24px_60px_-12px_rgba(12,11,10,0.25)] ring-1 ring-line">
          <p class="text-sm font-medium">Floating</p>
          <p class="mt-1 text-sm text-ink-muted">Popups and menus</p>
        </div>
      </div>
    </MarketingMkSection>

    <MarketingMkSection title="Orbs" description="Gradient spheres drawn from the 3D lands. Use them as accents in margins, never behind text.">
      <div class="flex flex-wrap items-end gap-6">
        <div v-for="palette in orbs" :key="palette" class="text-center">
          <MarketingMkOrb :palette="palette" :size="96" />
          <p class="mt-2 text-xs text-ink-muted">{{ palette }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <MarketingMkSection title="Inputs" description="The claim box is the signature input: a pill with the domain as a prefix and the action inside.">
      <MarketingMkClaimForm />
    </MarketingMkSection>

    <MarketingMkSection title="Layout" description="Pages are stacks of bands: a hairline rule on top, a 72rem framed column with corner marks, and generous vertical padding (96px on desktop). Grids of cells use a 1px gap over the line colour.">
      <div class="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-line">
        <div v-for="n in 6" :key="n" class="flex h-20 items-center justify-center bg-paper text-sm text-ink-muted">Cell {{ n }}</div>
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', colorMode: 'light' })
useSeoMeta({ title: 'Design system — Perlink', robots: 'noindex, nofollow' })

const colors = [
  { name: 'Paper', token: 'paper', value: '#fdfcfb' },
  { name: 'Sand', token: 'sand', value: '#f5f3f1' },
  { name: 'Sand strong', token: 'sand-strong', value: '#ebe7e2' },
  { name: 'Line', token: 'line', value: '#e8e4df' },
  { name: 'Ink', token: 'ink', value: '#0c0b0a' },
  { name: 'Ink soft', token: 'ink-soft', value: '#3a3631' },
  { name: 'Ink muted', token: 'ink-muted', value: '#6b655e' },
  { name: 'Ink faint', token: 'ink-faint', value: '#9b948c' },
]

const type = [
  { label: 'Display XL · 64px', class: 'mk-display text-[64px]', text: 'Your own site.' },
  { label: 'Display L · 44px', class: 'mk-display text-[44px]', text: 'Build a world, not just a page' },
  { label: 'Display M · 30px', class: 'mk-display text-3xl', text: 'Welcome to Perlink' },
  { label: 'Lead · 18px', class: 'text-lg text-ink-soft', text: 'Pick a template, make it yours, publish at perlink.to/you.' },
  { label: 'Body · 15px', class: 'text-[15px]', text: 'Furnish a room, pick a land and let people look around.' },
  { label: 'Small · 13px', class: 'text-[13px] text-ink-muted', text: 'Free to start · No credit card · Live in a minute' },
  { label: 'Eyebrow · 12px', class: 'mk-eyebrow', text: 'Templates' },
]

const orbs = ['sunset', 'sakura', 'lagoon', 'mars', 'night', 'mint'] as const
</script>
