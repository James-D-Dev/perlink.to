<template>
  <div class="space-y-3">
    <!-- Tabs -->
    <UTabs
      :items="tabItems"
      :model-value="activeTab"
      color="neutral"
      variant="link"
      size="sm"
      :ui="{ list: 'mb-0' }"
      @update:model-value="activeTab = $event as 'no-banner' | 'banner'"
    />

    <!-- Layout grid -->
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="opt in activeOptions"
        :key="opt.value"
        class="flex flex-col items-center gap-1.5 p-1 rounded-xl border-2 transition-all"
        :class="(modelValue ?? 'centered') === opt.value
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 dark:border-white/10 hover:border-gray-400 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl'"
        @click="emit('update:modelValue', opt.value)"
      >
        <!-- Preview -->
        <div class="w-full rounded-lg overflow-hidden border border-gray-300 dark:border-white/15 bg-gray-50 dark:bg-white/[0.03]" style="aspect-ratio: 3/3">

          <!-- centered -->
          <template v-if="opt.value === 'centered'">
            <div class="w-full h-full flex flex-col items-center pt-[10%] px-[10%] gap-[6%]">
              <img :src="avatarSrc" class="rounded-full object-cover shrink-0 bg-gray-400" style="width: 30%; aspect-ratio: 1" @error="onAvatarError" />
              <span v-if="title" class="w-full text-center font-semibold truncate leading-none" style="font-size: 58%; color: #222">{{ title }}</span>
              <div v-else class="w-[55%] rounded-full bg-gray-400" style="height: 4px" />
              <span v-if="bio" class="w-full text-center truncate leading-none" style="font-size: 56%; color: #888">{{ bio }}</span>
            </div>
          </template>

          <!-- left -->
          <template v-else-if="opt.value === 'left'">
            <div class="w-full py-4 flex flex-col justify-center px-[8%]">
              <div class="flex flex-row items-center gap-[8%]">
                <img :src="avatarSrc" class="rounded-full object-cover shrink-0 bg-gray-400" style="width: 30%; aspect-ratio: 1" @error="onAvatarError" />
                <div class="flex flex-col gap-[12%] flex-1 min-w-0 text-left">
                  <span v-if="title" class="font-semibold truncate leading-none" style="font-size: 58%; color: #222">{{ title }}</span>
                  <div v-else class="w-[80%] rounded-full bg-gray-400" style="height: 4px" />
                  <span v-if="bio" class="truncate leading-none" style="font-size: 56%; color: #888">{{ bio }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- cover -->
          <template v-else-if="opt.value === 'cover'">
            <div class="w-full h-full relative">
              <img :src="avatarSrc" class="absolute inset-0 w-full h-full object-cover" @error="onAvatarError" />
              <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 40%, transparent 100%)" />
              <div class="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-[8%] gap-[5%]">
                <span v-if="title" class="font-semibold text-white/90 truncate max-w-[85%]" style="font-size: 58%">{{ title }}</span>
                <div v-else class="w-[50%] rounded-full bg-white/70 dark:bg-white/[0.04] dark:backdrop-blur-xl" style="height: 4px" />
                <span v-if="bio" class="text-white/70 truncate max-w-[85%]" style="font-size: 56%">{{ bio }}</span>
              </div>
            </div>
          </template>

          <!-- image-overlay -->
          <template v-else-if="opt.value === 'image-overlay'">
            <div class="w-full h-full relative">
              <img :src="avatarSrc" class="absolute inset-0 w-full h-full object-cover" @error="onAvatarError" />
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-[5%]" style="background: rgba(0,0,0,0.42)">
                <span v-if="title" class="font-semibold text-white/90 truncate max-w-[85%]" style="font-size: 58%">{{ title }}</span>
                <div v-else class="w-[50%] rounded-full bg-white/70 dark:bg-white/[0.04] dark:backdrop-blur-xl" style="height: 4px" />
                <span v-if="bio" class="text-white/70 truncate max-w-[85%]" style="font-size: 56%">{{ bio }}</span>
              </div>
            </div>
          </template>

          <!-- banner-circle -->
          <template v-else-if="opt.value === 'banner-circle'">
            <div class="w-full h-full flex flex-col">
              <div class="w-full shrink-0 bg-gray-300 overflow-hidden" style="height: 35%">
                <img v-if="bannerUrl" :src="bannerUrl" class="w-full h-full object-cover" />
              </div>
              <div class="flex flex-col items-center px-[8%]" style="margin-top: -13%">
                <img :src="avatarSrc" class="rounded-full object-cover border border-white shrink-0 bg-gray-500" style="width: 26%; aspect-ratio: 1" @error="onAvatarError" />
                <span v-if="title" class="font-semibold truncate max-w-full mt-[6%]" style="font-size: 58%; color: #222">{{ title }}</span>
                <div v-else class="w-[50%] rounded-full bg-gray-400 mt-[6%]" style="height: 4px" />
                <span v-if="bio" class="truncate max-w-full mt-[4%]" style="font-size: 56%; color: #888">{{ bio }}</span>
              </div>
            </div>
          </template>

          <!-- banner-square -->
          <template v-else-if="opt.value === 'banner-square'">
            <div class="w-full h-full flex flex-col">
              <div class="w-full shrink-0 bg-gray-300 overflow-hidden" style="height: 35%">
                <img v-if="bannerUrl" :src="bannerUrl" class="w-full h-full object-cover" />
              </div>
              <div class="flex flex-col items-center px-[8%]" style="margin-top: -13%">
                <img :src="avatarSrc" class="rounded object-cover border border-white shrink-0 bg-gray-500" style="width: 26%; aspect-ratio: 1" @error="onAvatarError" />
                <span v-if="title" class="font-semibold truncate max-w-full mt-[6%]" style="font-size: 58%; color: #222">{{ title }}</span>
                <div v-else class="w-[50%] rounded-full bg-gray-400 mt-[6%]" style="height: 4px" />
                <span v-if="bio" class="truncate max-w-full mt-[4%]" style="font-size: 56%; color: #888">{{ bio }}</span>
              </div>
            </div>
          </template>

        </div>
        <span class="text-[10px] font-medium text-gray-600 dark:text-neutral-300 leading-tight text-center">{{ opt.label }}</span>
      </button>
    </div>

    <!-- Banner upload UI (only on banner tab) -->
    <template v-if="activeTab === 'banner'">
      <input ref="bannerInputRef" type="file" accept="image/*" class="hidden" @change="onBannerFileChange" />
      <div
        class="w-full rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-gray-400 transition-colors overflow-hidden"
        style="min-height: 120px"
        @click="bannerInputRef?.click()"
      >
        <template v-if="bannerUrl">
          <div class="relative w-full h-full">
            <img :src="bannerUrl" class="w-full object-cover" style="max-height: 160px" />
            <button
              class="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
              @click.stop="emit('update:bannerUrl', undefined)"
            >
              <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
            </button>
          </div>
        </template>
        <template v-else>
          <p class="text-sm text-gray-400 dark:text-neutral-500">{{ t('theme.headerLayout.addBanner') }}</p>
          <UButton color="neutral" size="sm" icon="i-lucide-upload" :loading="bannerUploading" @click.stop="bannerInputRef?.click()">
            {{ t('theme.headerLayout.upload') }}
          </UButton>
          <p v-if="bannerError" class="text-xs text-red-500 text-center px-4">{{ bannerError }}</p>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ThemeHeaderLayout, SocialLink } from '~/types/bio'
import avatarDefault from '~/assets/images/avatar-default-1.jpg'
import { useBannerUpload } from '~/composables/useBannerUpload'

const props = defineProps<{
  modelValue?: ThemeHeaderLayout
  avatarUrl?: string
  title?: string
  bio?: string
  socialLinks?: SocialLink[]
  bannerUrl?: string
  bioPageId?: string
}>()
const emit = defineEmits<{
  'update:modelValue': [v: ThemeHeaderLayout]
  'update:bannerUrl': [v: string | undefined]
}>()

const { t } = useI18n()

const tabItems = computed(() => [
  { value: 'no-banner', label: t('theme.headerLayout.tabs.noBanner') },
  { value: 'banner', label: t('theme.headerLayout.tabs.banner') },
])

const BANNER_LAYOUTS: ThemeHeaderLayout[] = ['banner-circle', 'banner-square']
const NO_BANNER_OPTIONS = computed<{ value: ThemeHeaderLayout; label: string }[]>(() => [
  { value: 'centered',      label: t('theme.headerLayout.options.centered') },
  { value: 'left',          label: t('theme.headerLayout.options.left') },
  { value: 'cover',         label: t('theme.headerLayout.options.cover') },
  { value: 'image-overlay', label: t('theme.headerLayout.options.imageOverlay') },
])
const BANNER_OPTIONS = computed<{ value: ThemeHeaderLayout; label: string }[]>(() => [
  { value: 'banner-circle', label: t('theme.headerLayout.options.bannerCircle') },
  { value: 'banner-square', label: t('theme.headerLayout.options.bannerSquare') },
])

const activeTab = ref<'no-banner' | 'banner'>(
  BANNER_LAYOUTS.includes(props.modelValue ?? 'centered') ? 'banner' : 'no-banner'
)
const activeOptions = computed(() => activeTab.value === 'banner' ? BANNER_OPTIONS.value : NO_BANNER_OPTIONS.value)


const avatarSrc = computed(() => props.avatarUrl || avatarDefault)

function onAvatarError(e: Event) {
  (e.target as HTMLImageElement).src = avatarDefault
}

const bannerInputRef = ref<HTMLInputElement | null>(null)
const { upload: uploadBanner, uploading: bannerUploading, error: bannerError } = useBannerUpload()

async function onBannerFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  ;(e.target as HTMLInputElement).value = ''
  try {
    const url = await uploadBanner(file, props.bioPageId ?? '')
    emit('update:bannerUrl', url)
  } catch {
    // error shown via bannerError
  }
}
</script>
