<template>
  <!-- The last thing in a site's settings: deleting it for good, behind a
       typed confirmation -->
  <div class="rounded-xl border border-red-200 bg-red-50/40 p-6 dark:border-red-500/25 dark:bg-red-500/[0.06]">
    <h3 class="mb-1 font-semibold text-red-800 dark:text-red-300">{{ t('dashboard.editor.settings.deleteHeading') }}</h3>
    <p class="mb-4 text-sm text-red-900/80 dark:text-red-200/80">{{ t('dashboard.editor.settings.deleteText') }}</p>
    <UButton color="error" variant="soft" icon="i-lucide-trash-2" :label="t('dashboard.editor.settings.deleteButton')" @click="open = true" />

    <UModal v-model:open="open" :title="t('dashboard.editor.settings.deleteTitle')" :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-muted">{{ t('dashboard.editor.settings.deleteWarning') }}</p>
          <ul class="space-y-1.5 text-sm text-default">
            <li v-for="item in losses" :key="item" class="flex items-start gap-2">
              <UIcon name="i-lucide-x" class="mt-0.5 size-4 shrink-0 text-red-500" />{{ item }}
            </li>
          </ul>
          <UFormField :label="t('dashboard.editor.settings.deleteConfirmLabel', { address: username })">
            <UInput v-model="typed" :placeholder="username" class="w-full" autocomplete="off" autocapitalize="off" spellcheck="false" @keydown.enter="remove" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <UButton color="neutral" variant="ghost" :label="t('common.cancel')" @click="open = false" />
        <UButton color="error" icon="i-lucide-trash-2" :loading="deleting" :disabled="!matches" :label="t('dashboard.editor.settings.deleteConfirm')" @click="remove" />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ username: string }>()

const { t } = useI18n()
const toast = useToast()
const open = ref(false)
const typed = ref('')
const deleting = ref(false)
const matches = computed(() => typed.value.trim().toLowerCase() === props.username.toLowerCase())
const losses = computed(() => [
  t('dashboard.editor.settings.deleteLossPage', { address: `perlink.to/${props.username}` }),
  t('dashboard.editor.settings.deleteLossInbox'),
  t('dashboard.editor.settings.deleteLossPosts'),
  t('dashboard.editor.settings.deleteLossStats'),
])

watch(open, (value) => {
  if (!value) typed.value = ''
})

async function remove() {
  if (!matches.value || deleting.value) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/bio/${props.username}/delete`, { method: 'POST', body: { confirm: typed.value.trim() } })
    open.value = false
    toast.add({ title: t('dashboard.editor.settings.deleted', { address: `perlink.to/${props.username}` }), color: 'success' })
    await navigateTo('/dashboard/site')
  } catch {
    toast.add({ title: t('dashboard.editor.settings.deleteFailed'), color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>
