<template>
  <UDropdownMenu :items="items" :content="compact ? { side: 'bottom', align: 'end' } : { side: 'top' }">
    <!-- The phone bar: just the round photo -->
    <UButton
      v-if="compact"
      :avatar="{ src: user?.avatar || undefined, alt: user?.name || 'User' }"
      color="neutral"
      variant="ghost"
      square
      :aria-label="user?.name || user?.username || 'Account'"
    />
    <UButton
      v-else
      v-bind="{
        label: collapsed ? undefined : (user?.name || user?.username || 'User'),
        avatar: {
          src: user?.avatar || undefined,
          alt: user?.name || 'User'
        }
      }"
      color="neutral"
      variant="ghost"
      class="w-full"
      :block="collapsed"
      :ui="{ label: 'truncate' }"
    >
      <!-- The account's plan, as a small chip after the name -->
      <template v-if="!collapsed && plan" #trailing>
        <span
          class="ms-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ring-1"
          :class="PLAN_CHIP[plan]"
        >
          {{ t(`dashboard.billing.plans.${plan}.name`) }}
        </span>
      </template>
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { User } from '#auth-utils'

defineProps<{
  collapsed?: boolean
  /** Only the photo, for the bar on top of phone pages */
  compact?: boolean
}>()

const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const handleSignOut = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await useUserSession().clear()
    await navigateTo('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const { t, locale, locales, setLocale } = useI18n()

// The plan chip next to the name (the dashboard layout loads the billing info)
const { info: billing } = useBilling()
const plan = computed(() => billing.value?.plan)
const PLAN_CHIP: Record<string, string> = {
  free: 'bg-sand text-ink-muted ring-line',
  starter: 'bg-sky-50 text-sky-700 ring-sky-200',
  plus: 'bg-ink text-paper ring-ink',
  max: 'bg-gradient-to-r from-amber-400 to-pink-500 text-white ring-transparent',
}

const items = computed<DropdownMenuItem[][]>(() => [
  [{
    label: user.value?.name || 'User',
    avatar: {
      src: user.value?.avatar || undefined,
      alt: user.value?.name || 'User'
    },
    type: 'label'
  }],
  [{
    label: t('menu.account'),
    icon: 'i-lucide-user',
    to: '/dashboard/settings'
  }, {
    label: t('menu.plans'),
    icon: 'i-lucide-credit-card',
    to: '/dashboard/upgrade'
  }, {
    label: t('menu.language'),
    icon: 'i-lucide-languages',
    children: locales.value.map(l => ({
      label: l.name,
      type: 'checkbox' as const,
      checked: locale.value === l.code,
      onSelect: (e: Event) => {
        e.preventDefault()
        setLocale(l.code)
      }
    }))
  }],
  [{
    label: t('menu.signOut'),
    icon: 'i-lucide-log-out',
    onSelect: handleSignOut
  }]
])
</script>
