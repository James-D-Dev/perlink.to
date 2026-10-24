<template>
  <section class="p-5" :style="cardStyle">
    <h2 v-if="data.title" class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">
      {{ data.title }}
    </h2>
    <p v-if="data.description" class="mt-1 text-sm opacity-75">{{ data.description }}</p>

    <div v-if="sent" class="mt-4 flex items-start gap-2 rounded-lg bg-current/5 p-3 text-sm">
      <UIcon name="i-lucide-circle-check" class="mt-0.5 size-4 shrink-0" />
      <span>{{ data.successMessage || t('formSent') }}</span>
    </div>

    <form v-else class="mt-4 space-y-3" @submit.prevent="submit">
      <!-- Honeypot: hidden from people, bots fill it in -->
      <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" class="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true">

      <label class="block">
        <span class="mb-1 block text-xs font-medium opacity-75">{{ t('formName') }} *</span>
        <input v-model="values.name" required maxlength="120" autocomplete="name" :class="inputClass">
      </label>

      <div v-if="fields.phone || fields.email" class="grid gap-3" :class="fields.phone && fields.email && 'sm:grid-cols-2'">
        <label v-if="fields.phone" class="block">
          <span class="mb-1 block text-xs font-medium opacity-75">{{ t('formPhone') }}</span>
          <input v-model="values.phone" type="tel" maxlength="40" autocomplete="tel" :class="inputClass">
        </label>
        <label v-if="fields.email" class="block">
          <span class="mb-1 block text-xs font-medium opacity-75">{{ t('formEmail') }}</span>
          <input v-model="values.email" type="email" maxlength="120" autocomplete="email" :class="inputClass">
        </label>
      </div>

      <div v-if="fields.date || fields.time || fields.guests" class="grid grid-cols-3 gap-3">
        <label v-if="fields.date" class="block" :class="!fields.time && !fields.guests && 'col-span-3'">
          <span class="mb-1 block text-xs font-medium opacity-75">{{ t('formDate') }}</span>
          <input v-model="values.date" type="date" :min="today" :class="inputClass">
        </label>
        <label v-if="fields.time" class="block">
          <span class="mb-1 block text-xs font-medium opacity-75">{{ t('formTime') }}</span>
          <input v-model="values.time" type="time" :class="inputClass">
        </label>
        <label v-if="fields.guests" class="block">
          <span class="mb-1 block text-xs font-medium opacity-75">{{ t('formGuests') }}</span>
          <input v-model="values.guests" type="number" min="1" max="999" inputmode="numeric" :class="inputClass">
        </label>
      </div>

      <label v-if="fields.message" class="block">
        <span class="mb-1 block text-xs font-medium opacity-75">{{ t('formMessage') }}</span>
        <textarea v-model="values.message" rows="3" maxlength="2000" :class="inputClass" />
      </label>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="preview" class="text-xs opacity-60">{{ t('formPreview') }}</p>

      <button
        type="submit"
        class="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
        :style="buttonStyle"
        :disabled="sending || preview"
      >
        <UIcon v-if="sending" name="i-lucide-loader-circle" class="size-4 animate-spin" />
        {{ sending ? t('formSending') : data.submitLabel || (data.kind === 'booking' ? t('formBook') : t('formSend')) }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import type { FormBlock } from '~/types/bio'

const props = defineProps<{
  data: FormBlock['data']
  blockId: string
  username: string
  /** Editor previews and template thumbnails never send */
  preview?: boolean
  cardStyle: Record<string, string | undefined>
  buttonStyle: Record<string, string | undefined>
  headingStyle?: Record<string, string | undefined>
}>()

const { t } = useSiteI18n()

const fields = computed(() => props.data.fields ?? FORM_PRESETS.booking)
const values = reactive<Record<string, string>>({ name: '', phone: '', email: '', date: '', time: '', guests: '', message: '' })
const website = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref('')

const today = new Date().toISOString().slice(0, 10)

// Neutral fields that sit on any card colour
const inputClass = 'w-full rounded-md border border-black/10 bg-white/90 px-3 py-2 text-[15px] text-[#1c1a17] outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5'

async function submit() {
  if (props.preview || sending.value) return
  sending.value = true
  error.value = ''
  try {
    await $fetch(`/api/bio/${props.username}/form`, {
      method: 'POST',
      body: { blockId: props.blockId, values: { ...values, guests: String(values.guests ?? '') }, website: website.value },
    })
    sent.value = true
  } catch {
    error.value = t('formError')
  } finally {
    sending.value = false
  }
}
</script>
