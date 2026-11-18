<template>
  <!-- A real Perlink 3D room, live in the page: drag, zoom, tap the work -->
  <div>
    <div v-if="switchable" class="mb-4 flex flex-wrap gap-2" role="tablist" :aria-label="t.choose">
      <button
        v-for="item in DEMO_ROOMS"
        :key="item"
        type="button"
        role="tab"
        :aria-selected="kind === item"
        class="rounded-full px-4 py-2 text-sm transition-colors"
        :class="kind === item ? 'bg-ink text-paper' : 'bg-sand text-ink hover:bg-line'"
        @click="kind = item"
      >
        {{ t.kinds[item] }}
      </button>
    </div>

    <div class="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#14121a] sm:aspect-[16/10]">
      <ClientOnly>
        <RoomCanvas ref="canvas" :room="config" :force-mode="mode" @activate="onActivate" />
      </ClientOnly>

      <!-- Until the room has loaded -->
      <div v-if="loading" class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
        <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin" />
        <p class="text-sm">{{ t.loading }}</p>
      </div>

      <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
        <p class="rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur sm:text-sm">
          {{ t.live }} · {{ t.kinds[kind] }}
        </p>
        <div class="pointer-events-auto flex rounded-full bg-black/45 p-1 backdrop-blur">
          <button
            v-for="m in (['day', 'night'] as const)"
            :key="m"
            type="button"
            class="flex size-8 items-center justify-center rounded-full text-white transition"
            :class="mode === m ? 'bg-white/25' : 'opacity-60 hover:opacity-100'"
            :aria-label="t[m]"
            :aria-pressed="mode === m"
            @click="mode = m"
          >
            <UIcon :name="m === 'day' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
          </button>
        </div>
      </div>

      <p class="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-center text-xs text-white/85 [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] sm:p-4 sm:text-sm">
        {{ t.hint }}
      </p>

      <!-- A piece of work, large -->
      <div
        v-if="shown"
        class="absolute inset-0 z-10 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        :aria-label="t.photo"
        @click.self="shown = null"
      >
        <div class="relative">
          <img :src="shown" :alt="t.photo" class="max-h-[70vh] max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/15">
          <button
            type="button"
            class="absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur"
            :aria-label="t.close"
            @click="shown = null"
          >
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppLanguage } from '#shared/language'
import type { DemoRoom } from '~/data/portfolio3d/types'

const props = withDefaults(defineProps<{
  initial?: DemoRoom
  /** Buttons to switch between the kinds of work */
  switchable?: boolean
}>(), { initial: 'designer', switchable: false })

const { lang } = useMarketingLang()

const TEXT = {
  en: {
    choose: 'Choose a portfolio',
    kinds: { designer: 'Designer', developer: 'Developer', photographer: 'Photographer', architect: 'Architect', student: 'Student' },
    live: 'Live 3D room',
    loading: 'Opening the room…',
    hint: 'Drag to look around · Scroll or pinch to zoom · Tap a picture',
    day: 'Day',
    night: 'Night',
    photo: 'Sample work',
    close: 'Close',
  },
  vi: {
    choose: 'Chọn một portfolio',
    kinds: { designer: 'Designer', developer: 'Lập trình viên', photographer: 'Nhiếp ảnh gia', architect: 'Kiến trúc sư', student: 'Sinh viên' },
    live: 'Phòng 3D trực tiếp',
    loading: 'Đang mở phòng…',
    hint: 'Kéo để nhìn quanh · Cuộn hoặc chụm hai ngón để phóng to · Chạm vào một bức ảnh',
    day: 'Ban ngày',
    night: 'Ban đêm',
    photo: 'Tác phẩm mẫu',
    close: 'Đóng',
  },
  zh: {
    choose: '选择一个作品集',
    kinds: { designer: '设计师', developer: '程序员', photographer: '摄影师', architect: '建筑师', student: '学生' },
    live: '实时 3D 房间',
    loading: '正在打开房间…',
    hint: '拖动环顾四周 · 滚动或双指缩放 · 点击图片',
    day: '白天',
    night: '夜晚',
    photo: '示例作品',
    close: '关闭',
  },
  ja: {
    choose: 'ポートフォリオを選ぶ',
    kinds: { designer: 'デザイナー', developer: 'エンジニア', photographer: 'フォトグラファー', architect: '建築家', student: '学生' },
    live: 'ライブ3Dルーム',
    loading: 'ルームを開いています…',
    hint: 'ドラッグで見回す · スクロールやピンチでズーム · 写真をタップ',
    day: '昼',
    night: '夜',
    photo: '作品サンプル',
    close: '閉じる',
  },
  ko: {
    choose: '포트폴리오 선택',
    kinds: { designer: '디자이너', developer: '개발자', photographer: '사진작가', architect: '건축가', student: '학생' },
    live: '실시간 3D 룸',
    loading: '룸을 여는 중…',
    hint: '드래그해서 둘러보기 · 스크롤하거나 핀치해서 확대 · 사진을 탭하세요',
    day: '낮',
    night: '밤',
    photo: '샘플 작품',
    close: '닫기',
  },
} satisfies Record<AppLanguage, unknown>
const t = computed(() => TEXT[lang.value])

const kind = ref<DemoRoom>(props.initial)
// A page can switch the room from outside (the examples list)
watch(() => props.initial, (value) => { kind.value = value })
const config = computed(() => portfolioRoom(kind.value))
const mode = ref<'day' | 'night'>(config.value.environment.mode === 'night' ? 'night' : 'day')
watch(kind, () => {
  mode.value = config.value.environment.mode === 'night' ? 'night' : 'day'
  shown.value = null
})

// The loader stays until the models are in
const canvas = ref<{ isLoading: () => boolean } | null>(null)
const loading = ref(true)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    if (canvas.value && !canvas.value.isLoading()) {
      loading.value = false
      clearInterval(timer)
    }
  }, 250)
})
onBeforeUnmount(() => clearInterval(timer))

const shown = ref<string | null>(null)
function onActivate(id: string) {
  const image = config.value.objects.find(o => o.id === id)?.image
  if (image) shown.value = image
}
</script>
