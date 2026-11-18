import { toValue, type MaybeRefOrGetter } from 'vue'
import { toAppLanguage, type AppLanguage } from '#shared/language'

// Example addresses for the "perlink.to/…" boxes: a person, a brand, a shop…
// (address characters only: lowercase letters, digits, hyphens, so Chinese,
// Japanese and Korean names are romanised)
const EXAMPLES: Record<AppLanguage, string[]> = {
  en: ['yourname', 'sunny-cafe', 'anna-smith', 'studio-lumi', 'the-bakehouse', 'mia-yoga'],
  vi: ['ten-cua-ban', 'minh-anh', 'quan-ca-phe', 'tiem-banh-nho', 'studio-mai', 'ha-nails'],
  zh: ['yourname', 'lin-xiaoyu', 'yunduo-cafe', 'xiaomei-bakery', 'studio-lumi', 'wang-yoga'],
  ja: ['yourname', 'misaki-sato', 'kumo-cafe', 'pan-koubou', 'studio-lumi', 'yui-yoga'],
  ko: ['yourname', 'kim-jieun', 'gureum-cafe', 'bakery-dalkom', 'studio-lumi', 'seoyeon-yoga'],
}

/** Addresses that fit the page's topic (a wedding page suggests a couple's names) */
const TOPIC_EXAMPLES: Record<string, Record<AppLanguage, string[]>> = {
  wedding: {
    en: ['linh-and-nam', 'anna-and-james', 'our-wedding', 'mia-loves-tom', 'the-nguyens-2026'],
    vi: ['linh-va-nam', 'minh-anh-va-huy', 'dam-cuoi-tu-ha', 'ngoc-loves-quan', 'thiep-cuoi-lan-tuan'],
    zh: ['xiaolin-and-ajie', 'our-wedding', 'wang-and-li-2026', 'yu-loves-hao'],
    ja: ['kenta-and-misaki', 'our-wedding', 'yui-loves-sho', 'tanaka-wedding-2026'],
    ko: ['minjun-and-jieun', 'our-wedding', 'seoyeon-loves-jihoon', 'wedding-2026-kim'],
  },
  birthday: {
    en: ['happy-birthday-mai', 'anna-turns-30', 'birthday-lily', 'for-mom-60'],
    vi: ['chuc-mung-sinh-nhat-mai', 'sinh-nhat-be-na', 'mung-me-60-tuoi', 'happy-birthday-lan'],
    zh: ['happy-birthday-xiaomei', 'shengri-kuaile-lin', 'for-mom-60', 'birthday-yuyu'],
    ja: ['happy-birthday-yui', 'otanjoubi-sakura', 'for-mom-60', 'birthday-haruto'],
    ko: ['happy-birthday-seoyeon', 'saengil-chukha-jimin', 'for-mom-60', 'birthday-minji'],
  },
  valentine: {
    en: ['for-lan', 'be-my-valentine', 'mia-and-tom', 'love-you-anna'],
    vi: ['gui-em-lan', 'valentine-cua-anh', 'minh-va-ha', 'yeu-em-ngoc'],
    zh: ['for-xiaomei', 'be-my-valentine', 'hao-and-yu', 'love-you-lin'],
    ja: ['for-yui', 'be-my-valentine', 'sho-and-yui', 'daisuki-misaki'],
    ko: ['for-jieun', 'be-my-valentine', 'minjun-and-jieun', 'saranghae-seoyeon'],
  },
  'qr-menu': {
    en: ['sunny-cafe', 'pho-corner', 'the-bakehouse', 'green-tea-bar'],
    vi: ['quan-ca-phe', 'pho-ba-lan', 'tiem-banh-nho', 'tra-sua-may'],
    zh: ['yunduo-cafe', 'lanzhou-noodles', 'xiaomei-bakery', 'green-tea-bar'],
    ja: ['kumo-cafe', 'ramen-hanabi', 'pan-koubou', 'matcha-bar'],
    ko: ['gureum-cafe', 'kimbap-house', 'bakery-dalkom', 'green-tea-bar'],
  },
  homestay: {
    en: ['pine-hill-homestay', 'sea-breeze-villa', 'dalat-garden-house', 'old-town-stay'],
    vi: ['homestay-doi-thong', 'villa-bien-xanh', 'nha-vuon-da-lat', 'phong-co-hoi-an'],
    zh: ['dali-garden-house', 'sea-breeze-minsu', 'old-town-stay', 'pine-hill-inn'],
    ja: ['karuizawa-cottage', 'sea-breeze-house', 'kyoto-machiya-stay', 'pine-hill-inn'],
    ko: ['jeju-stay', 'sea-breeze-house', 'hanok-stay-seoul', 'pine-hill-stay'],
  },
  'link-in-bio': {
    en: ['anna-smith', 'mia-yoga', 'chef-tom', 'studio-lumi'],
    vi: ['minh-anh', 'ha-nails', 'bep-cua-tom', 'studio-mai'],
    zh: ['lin-xiaoyu', 'wang-yoga', 'chef-ajie', 'studio-lumi'],
    ja: ['misaki-sato', 'yui-yoga', 'chef-kenta', 'studio-lumi'],
    ko: ['kim-jieun', 'seoyeon-yoga', 'chef-minjun', 'studio-lumi'],
  },
  personal: {
    en: ['anna-smith', 'james-lee', 'minh-tran', 'hello-mia'],
    vi: ['nguyen-minh-anh', 'tran-tuan', 'le-thu-ha', 'xin-chao-mai'],
    zh: ['lin-xiaoyu', 'wang-hao', 'chen-jie', 'hello-xiaomei'],
    ja: ['misaki-sato', 'kenta-tanaka', 'yui-suzuki', 'hello-haruto'],
    ko: ['kim-jieun', 'lee-minjun', 'park-seoyeon', 'hello-jimin'],
  },
  portfolio: {
    en: ['anna-designs', 'minh-builds', 'lumi-photo', 'studio-arch', 'mia-portfolio'],
    vi: ['minh-design', 'tuan-dev', 'mai-photo', 'kts-hoang', 'portfolio-cua-ha'],
    zh: ['xiaoyu-design', 'hao-builds', 'lin-photo', 'studio-arch', 'chen-portfolio'],
    ja: ['misaki-design', 'kenta-builds', 'yui-photo', 'studio-arch', 'sato-portfolio'],
    ko: ['jieun-design', 'minjun-builds', 'seoyeon-photo', 'studio-arch', 'kim-portfolio'],
  },
  designer: {
    en: ['anna-designs', 'studio-lumi', 'mia-ui', 'pixel-tom'],
    vi: ['minh-design', 'ha-ui-ux', 'studio-mai', 'thiet-ke-cua-lan'],
    zh: ['xiaoyu-design', 'studio-lumi', 'lin-ui', 'pixel-hao'],
    ja: ['misaki-design', 'studio-lumi', 'yui-ui', 'pixel-kenta'],
    ko: ['jieun-design', 'studio-lumi', 'seoyeon-ui', 'pixel-minjun'],
  },
  developer: {
    en: ['minh-builds', 'dev-anna', 'tom-codes', 'james-dev'],
    vi: ['tuan-dev', 'lap-trinh-minh', 'code-cua-ha', 'dev-hoang'],
    zh: ['hao-builds', 'dev-xiaoyu', 'chen-codes', 'wang-dev'],
    ja: ['kenta-builds', 'dev-misaki', 'haruto-codes', 'tanaka-dev'],
    ko: ['minjun-builds', 'dev-jieun', 'jihoon-codes', 'kim-dev'],
  },
  photographer: {
    en: ['lumi-photo', 'anna-shoots', 'tom-in-frame', 'mia-film'],
    vi: ['mai-photo', 'chup-anh-tuan', 'anh-cuoi-ha', 'film-cua-lan'],
    zh: ['lin-photo', 'xiaoyu-shoots', 'hao-in-frame', 'chen-film'],
    ja: ['yui-photo', 'misaki-shoots', 'kenta-in-frame', 'haruto-film'],
    ko: ['seoyeon-photo', 'jieun-shoots', 'minjun-in-frame', 'jimin-film'],
  },
  architect: {
    en: ['studio-arch', 'anna-architect', 'tom-spaces', 'mia-interiors'],
    vi: ['kts-hoang', 'kien-truc-minh', 'noi-that-ha', 'studio-kts-lan'],
    zh: ['studio-arch', 'chen-architect', 'hao-spaces', 'lin-interiors'],
    ja: ['studio-arch', 'tanaka-architect', 'kenta-spaces', 'yui-interiors'],
    ko: ['studio-arch', 'kim-architect', 'minjun-spaces', 'seoyeon-interiors'],
  },
  student: {
    en: ['anna-student', 'minh-portfolio', 'tom-class-of-2027', 'mia-cv'],
    vi: ['minh-sinh-vien', 'ha-portfolio', 'cv-cua-tuan', 'lan-k66'],
    zh: ['xiaoyu-student', 'hao-portfolio', 'lin-class-of-2027', 'chen-cv'],
    ja: ['misaki-student', 'kenta-portfolio', 'yui-class-of-2027', 'haruto-cv'],
    ko: ['jieun-student', 'minjun-portfolio', 'seoyeon-class-of-2027', 'jimin-cv'],
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
    const language = toAppLanguage(toValue(lang))
    const forTopic = TOPIC_EXAMPLES[toValue(topic) ?? '']
    return forTopic?.[language] ?? EXAMPLES[language]
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
