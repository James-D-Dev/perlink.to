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
    label: 'My Account',
    icon: 'i-lucide-user',
    onSelect: () => navigateTo('/admin/settings')
  }, {
    label: 'Billing',
    icon: 'i-lucide-credit-card',
    onSelect: () => navigateTo('/admin/billing')
  }, {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/admin/settings'
  }],
  [{
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    onSelect: handleSignOut
  }]
])
</script>
