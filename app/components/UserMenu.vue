<template>
  <UDropdownMenu :items="items" :popper="{ placement: 'top' }">
    <UButton
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
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { User } from '#auth-utils'

defineProps<{
  collapsed?: boolean
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
