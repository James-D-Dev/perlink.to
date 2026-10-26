<template>
  <!-- Phones: a real bottom sheet (vaul) that follows the finger, flicks
       closed, rubber-bands at the top and lets its content scroll -->
  <UDrawer
    v-if="phone"
    v-model:open="open"
    :title="title"
    :description="description"
    :dismissible="dismissible"
    :handle="true"
    :content="{ onOpenAutoFocus: (event: Event) => event.preventDefault() }"
    :ui="{ header: ui?.header, body: ui?.body, footer: ui?.footer, title: ui?.title, description: ui?.description, content: ui?.sheet }"
    @animation-end="(isOpen: boolean) => !isOpen && emit('after:leave')"
  >
    <template v-for="(_, name) in slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </UDrawer>

  <!-- Larger screens: the centred glass dialog -->
  <UModal
    v-else
    v-model:open="open"
    :title="title"
    :description="description"
    :dismissible="dismissible"
    :close="close"
    :content="noAutofocus ? { onOpenAutoFocus: (event: Event) => event.preventDefault() } : undefined"
    :ui="{ header: ui?.header, body: ui?.body, footer: ui?.footer, title: ui?.title, description: ui?.description, content: ui?.content }"
    @after:leave="emit('after:leave')"
  >
    <template v-for="(_, name) in slots" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

/**
 * A dialog that is a draggable bottom sheet on phones (UDrawer, like iOS
 * sheets) and a centred dialog elsewhere. Same slots as UModal: header,
 * body, footer, or content for a fully custom look.
 */
withDefaults(defineProps<{
  title?: string
  description?: string
  dismissible?: boolean
  /** The dialog's close button (larger screens; phones swipe down instead) */
  close?: boolean | Record<string, unknown>
  /** Don't put the cursor in the first field on open (phones never do: it
   * would pop the keyboard up over the sheet) */
  noAutofocus?: boolean
  /** content: the dialog box; sheet: the phone sheet */
  ui?: { content?: string; sheet?: string; header?: string; body?: string; footer?: string; title?: string; description?: string }
}>(), {
  title: undefined,
  description: undefined,
  dismissible: true,
  close: true,
  ui: undefined,
})

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ 'after:leave': [] }>()
const slots = defineSlots<Record<string, (scope?: any) => any>>()

const phone = useMediaQuery('(max-width: 639px)')
</script>
