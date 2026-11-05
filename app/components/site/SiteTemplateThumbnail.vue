<template>
  <!-- A real, scaled-down render of the template page -->
  <div ref="box" class="relative h-full w-full overflow-hidden" :style="{ background: template.preview.bg }">
    <div
      v-if="shown"
      class="pointer-events-none absolute left-0 top-0 origin-top-left"
      :style="{ width: `${100 / scale}%`, transform: `scale(${scale})` }"
      aria-hidden="true"
      inert
    >
      <BioPageView :bio-data="bioData" :username="template.id" mode="thumbnail" />
    </div>
    <!-- Marketing pages: make clear the prices and reviews inside are made up -->
    <span
      v-if="sample"
      class="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur"
    >{{ sampleLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { stableBlockIds } from '~/data/templateKit'
import type { BioData } from '~/types/bio'
import { localizeTemplateContent } from '~/data/templateCopyVi'
import type { PageTemplate } from '~/data/pageTemplates'

// Blocks inside show sample content instead of asking the server
provide(TEMPLATE_PREVIEW_KEY, true)

const props = withDefaults(defineProps<{
  template: PageTemplate
  scale?: number
  /** The owner's own name, intro and photo in place of the sample ones (create flow) */
  personal?: { title: string; bio: string; avatarUrl: string }
  /** Pages rendered in the browser (dashboard): build the page only once it
   * nears the screen, so a grid of 35 doesn't render them all at once */
  lazy?: boolean
  /** Show a "Sample" tag over the preview (marketing pages) */
  sample?: boolean
}>(), {
  scale: 0.5,
  personal: undefined,
  lazy: false,
  sample: false,
})


const box = ref<HTMLElement | null>(null)
// Marketing samples (sample) are drawn in the browser only: rendered on the
// server, their made-up menus, prices and headings made up most of the words
// and headings search engines read on our own pages. Their wrappers hydrate
// on visible, so each one is built only as it nears the screen.
const shown = ref(!props.lazy && !props.sample)
if (props.sample && !props.lazy) onMounted(() => { shown.value = true })
if (props.lazy) {
  useIntersectionObserver(box, ([entry], observer) => {
    if (!entry?.isIntersecting) return
    shown.value = true
    observer.disconnect()
  }, { rootMargin: '300px' })
}

// Dashboard previews follow the dashboard language; marketing pages their URL
const route = useRoute()
const { locale } = useI18n()
const { lang: marketingLang } = useMarketingLang()
const lang = computed(() => (route.path.startsWith('/dashboard') ? locale.value : marketingLang.value))
const sampleLabel = computed(() => (lang.value === 'vi' ? 'Nội dung mẫu' : 'Sample content'))

/** Template photos swapped for their small versions (480 px), anywhere in a value */
function smallPhotos<T>(value: T): T {
  return JSON.parse(JSON.stringify(value).replace(/(\/images\/templates\/photos\/[a-z0-9-]+?)(-sm)?\.(webp|jpg)/g, '$1-sm.webp')) as T
}

const bioData = computed<BioData>(() => {
  const content = localizeTemplateContent(props.template.build(), lang.value)
  return {
    title: props.personal?.title || content.title,
    bio: props.personal ? props.personal.bio : content.bio,
    avatarUrl: props.personal ? props.personal.avatarUrl : smallPhotos(content.avatarUrl || ''),
    templateId: 'modern',
    themeConfig: smallPhotos({ ...content.themeConfig, showShare: false }),
    // Numbered ids, so the thumbnail renders the same on the server and in the
    // browser; the photos' small versions, as a thumbnail shows them small
    blocks: smallPhotos(stableBlockIds(content.blocks, props.template.id)),
  }
})
</script>
