import { toValue, type MaybeRefOrGetter } from 'vue'

// Example addresses for the "perlink.to/…" boxes: a person, a brand, a shop…
// (address characters only: lowercase letters, digits, hyphens)
const EXAMPLES: Record<string, string[]> = {
  en: ['yourname', 'sunny-cafe', 'anna-smith', 'studio-lumi', 'the-bakehouse', 'mia-yoga'],
  vi: ['ten-cua-ban', 'minh-anh', 'quan-ca-phe', 'tiem-banh-nho', 'studio-mai', 'ha-nails'],
}

/** Addresses that fit the page's topic (a wedding page suggests a couple's names) */
const TOPIC_EXAMPLES: Record<string, Record<'en' | 'vi', string[]>> = {
  wedding: {
    en: ['linh-and-nam', 'anna-and-james', 'our-wedding', 'mia-loves-tom', 'the-nguyens-2026'],
    vi: ['linh-va-nam', 'minh-anh-va-huy', 'dam-cuoi-tu-ha', 'ngoc-loves-quan', 'thiep-cuoi-lan-tuan'],
  },
  birthday: {
    en: ['happy-birthday-mai', 'anna-turns-30', 'birthday-lily', 'for-mom-60'],
    vi: ['chuc-mung-sinh-nhat-mai', 'sinh-nhat-be-na', 'mung-me-60-tuoi', 'happy-birthday-lan'],
  },
  valentine: {
    en: ['for-lan', 'be-my-valentine', 'mia-and-tom', 'love-you-anna'],
    vi: ['gui-em-lan', 'valentine-cua-anh', 'minh-va-ha', 'yeu-em-ngoc'],
  },
  'qr-menu': {
    en: ['sunny-cafe', 'pho-corner', 'the-bakehouse', 'green-tea-bar'],
    vi: ['quan-ca-phe', 'pho-ba-lan', 'tiem-banh-nho', 'tra-sua-may'],
  },
  homestay: {
    en: ['pine-hill-homestay', 'sea-breeze-villa', 'dalat-garden-house', 'old-town-stay'],
    vi: ['homestay-doi-thong', 'villa-bien-xanh', 'nha-vuon-da-lat', 'phong-co-hoi-an'],
  },
  'link-in-bio': {
    en: ['anna-smith', 'mia-yoga', 'chef-tom', 'studio-lumi'],
    vi: ['minh-anh', 'ha-nails', 'bep-cua-tom', 'studio-mai'],
  },
  personal: {
    en: ['anna-smith', 'james-lee', 'minh-tran', 'hello-mia'],
    vi: ['nguyen-minh-anh', 'tran-tuan', 'le-thu-ha', 'xin-chao-mai'],
  },
  portfolio: {
    en: ['anna-designs', 'minh-builds', 'lumi-photo', 'studio-arch', 'mia-portfolio'],
    vi: ['minh-design', 'tuan-dev', 'mai-photo', 'kts-hoang', 'portfolio-cua-ha'],
  },
  designer: {
    en: ['anna-designs', 'studio-lumi', 'mia-ui', 'pixel-tom'],
    vi: ['minh-design', 'ha-ui-ux', 'studio-mai', 'thiet-ke-cua-lan'],
  },
  developer: {
    en: ['minh-builds', 'dev-anna', 'tom-codes', 'james-dev'],
    vi: ['tuan-dev', 'lap-trinh-minh', 'code-cua-ha', 'dev-hoang'],
  },
  photographer: {
    en: ['lumi-photo', 'anna-shoots', 'tom-in-frame', 'mia-film'],
    vi: ['mai-photo', 'chup-anh-tuan', 'anh-cuoi-ha', 'film-cua-lan'],
  },
  architect: {
    en: ['studio-arch', 'anna-architect', 'tom-spaces', 'mia-interiors'],
    vi: ['kts-hoang', 'kien-truc-minh', 'noi-that-ha', 'studio-kts-lan'],
  },
  student: {
    en: ['anna-student', 'minh-portfolio', 'tom-class-of-2027', 'mia-cv'],
    vi: ['minh-sinh-vien', 'ha-portfolio', 'cv-cua-tuan', 'lan-k66'],
  },
}

/**
 * A placeholder that types out example addresses (the topic's, when it has
 * its own), holds each a moment, then
 * deletes it and types the next. Stops while `paused` (something is typed in,
 * so the placeholder isn't showing), and stays on the first example for
 * people who prefer reduced motion.
 */
export function useTypingPlaceholder(lang: MaybeRefOrGetter<string>, paused: MaybeRefOrGetter<boolean> = false, topic?: MaybeRefOrGetter<string | undefined>) {
  const examples = computed(() => {
    const language = toValue(lang) === 'vi' ? 'vi' : 'en'
    const forTopic = TOPIC_EXAMPLES[toValue(topic) ?? '']
    return forTopic?.[language] ?? EXAMPLES[language]!
  })
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
