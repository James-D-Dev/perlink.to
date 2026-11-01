import { toValue, type MaybeRefOrGetter } from 'vue'

// Example addresses for the "perlink.to/…" boxes: a person, a brand, a shop…
// (address characters only: lowercase letters, digits, hyphens)
const EXAMPLES: Record<string, string[]> = {
  en: ['yourname', 'sunny-cafe', 'anna-smith', 'studio-lumi', 'the-bakehouse', 'mia-yoga'],
  vi: ['ten-cua-ban', 'minh-anh', 'quan-ca-phe', 'tiem-banh-nho', 'studio-mai', 'ha-nails'],
}

/**
 * A placeholder that types out example addresses, holds each a moment, then
 * deletes it and types the next. Stops while `paused` (something is typed in,
 * so the placeholder isn't showing), and stays on the first example for
 * people who prefer reduced motion.
 */
export function useTypingPlaceholder(lang: MaybeRefOrGetter<string>, paused: MaybeRefOrGetter<boolean> = false) {
  const examples = computed(() => EXAMPLES[toValue(lang)] ?? EXAMPLES.en!)
  // The first example in full until the page is live (also what the server renders)
  const text = ref(examples.value[0]!)
  let index = 0
  let typed = text.value.length
  let deleting = false
  let timer: ReturnType<typeof setTimeout> | null = null

  function stop() {
    if (timer) clearTimeout(timer)
    timer = null
  }

  function step() {
    const word = examples.value[index % examples.value.length]!
    let wait: number
    if (deleting) {
      typed--
      if (typed <= 0) {
        typed = 0
        deleting = false
        index++
        wait = 350
      } else {
        wait = 45
      }
    } else {
      typed++
      if (typed >= word.length) {
        typed = word.length
        deleting = true
        // Hold the whole address a moment before deleting it
        wait = 1600
      } else {
        // A little uneven, like real typing
        wait = 70 + Math.random() * 70
      }
    }
    text.value = examples.value[index % examples.value.length]!.slice(0, typed)
    timer = setTimeout(step, wait)
  }

  function start() {
    stop()
    if (toValue(paused) || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    timer = setTimeout(step, deleting || typed ? 1600 : 350)
  }

  onMounted(() => {
    deleting = true
    start()
  })
  onBeforeUnmount(stop)
  watch(() => toValue(paused), on => (on ? stop() : start()))
  watch(examples, (list) => {
    index = 0
    typed = list[0]!.length
    deleting = true
    text.value = list[0]!
    start()
  })

  return text
}
