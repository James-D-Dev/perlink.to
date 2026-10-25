<template>
  <template v-for="(part, i) in parts" :key="i">
    <NuxtLink v-if="part.type === 'link'" :to="part.href" class="font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-ink">{{ part.text }}</NuxtLink>
    <a v-else-if="part.type === 'email'" :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-ink">{{ SUPPORT_EMAIL }}</a>
    <strong v-else-if="part.type === 'bold'" class="font-semibold text-ink">{{ part.text }}</strong>
    <template v-else>{{ part.text }}</template>
  </template>
</template>

<script setup lang="ts">
// One line of legal text: [label](/path) links, **bold** and {email}
const props = defineProps<{ text: string }>()

type Part = { type: 'text' | 'bold' | 'email'; text: string } | { type: 'link'; text: string; href: string }

const TOKEN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\{email\}/g

const parts = computed(() => {
  const out: Part[] = []
  let last = 0
  for (const match of props.text.matchAll(TOKEN)) {
    if (match.index! > last) out.push({ type: 'text', text: props.text.slice(last, match.index) })
    if (match[1]) out.push({ type: 'link', text: match[1], href: match[2]! })
    else if (match[3]) out.push({ type: 'bold', text: match[3] })
    else out.push({ type: 'email', text: SUPPORT_EMAIL })
    last = match.index! + match[0].length
  }
  if (last < props.text.length) out.push({ type: 'text', text: props.text.slice(last) })
  return out
})
</script>
