<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      container
      :is-active="isActive"
      title="Template & Theme"
      icon="i-lucide-palette"
      @toggle="$emit('toggle')"
    >
      <!-- <template #actions>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-more-vertical"
        />
      </template> -->
    </BioBlockItemHeader>

    <div
      v-if="isActive"
      class="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-5"
    >
      <!-- Mode toggle -->
      <UTabs
        :items="[
          { label: 'Theme Presets', value: 'presets' },
          { label: 'Customize', value: 'custom' },
        ]"
        :model-value="editMode"
        color="neutral"
        variant="pill"
        class="w-full"
        size="xl"
        @update:model-value="editMode = $event as 'presets' | 'custom'"
      >
        <template #content="{ item }">
          <!-- Preset picker -->
          <template v-if="editMode === 'presets'">
            <BioThemePresetPicker
              :selected-id="selectedPresetId"
              @select="onPresetSelect"
            />
            <div>
              <label class="text-sm font-medium text-gray-700 dark:text-neutral-200 mb-2 block"
                >Header Layout</label
              >
              <BioHeaderLayoutPicker
                :model-value="themeConfig.header.layout"
                :avatar-url="avatarUrl"
                :title="title"
                :bio="bio"
                :social-links="socialLinks"
                :banner-url="themeConfig.header.bannerUrl"
                :bio-page-id="bioPageId"
                @update:model-value="emitHeader('layout', $event)"
                @update:banner-url="emitHeader('bannerUrl', $event)"
              />
            </div>
          </template>

          <!-- Custom editor -->
          <template v-if="editMode === 'custom'">
            <div class="space-y-6">
              <!-- Colors -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Colors</label
                >
                <BioColorPicker
                  :primary="themeConfig.colors.primary"
                  :secondary="themeConfig.colors.secondary"
                  :third="themeConfig.colors.third"
                  @select="
                    (p) =>
                      emit('updateTheme', {
                        colors: {
                          primary: p.primary,
                          secondary: p.secondary,
                          third: p.third,
                        },
                        card: {
                          ...props.themeConfig.card,
                          textColor: p.textColor,
                        },
                        button: {
                          ...props.themeConfig.button,
                          textColor: p.textColor,
                        },
                      })
                  "
                />
                <div class="grid grid-cols-3 gap-2 mt-3">
                  <div
                    v-for="colorKey in [
                      'primary',
                      'secondary',
                      'third',
                    ] as const"
                    :key="colorKey"
                  >
                    <label
                      class="text-xs text-gray-500 dark:text-neutral-400 mb-1 block capitalize"
                      >{{ colorKey }}</label
                    >
                    <div class="flex items-center gap-1.5">
                      <UPopover>
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          class="p-0 rounded-full overflow-hidden shrink-0"
                        >
                          <span
                            class="size-6 rounded-full border-2 border-gray-300 dark:border-white/15"
                            :style="{
                              backgroundColor:
                                themeConfig.colors[colorKey] || '#000000',
                            }"
                          />
                        </UButton>
                        <template #content>
                          <UColorPicker
                            :model-value="
                              themeConfig.colors[colorKey] || '#000000'
                            "
                            class="p-2"
                            @update:model-value="
                              emitColors(colorKey, $event || '#000000')
                            "
                          />
                        </template>
                      </UPopover>
                      <UInput
                        :model-value="themeConfig.colors[colorKey]"
                        size="xs"
                        class="flex-1 font-mono"
                        @update:model-value="
                          emitColors(colorKey, $event as string)
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Background -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Background</label
                >
                <BioBackgroundPicker
                  :background="themeConfig.background"
                  @select="(v) => emit('updateTheme', { background: v })"
                />
              </div>

              <!-- Header -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Header Title</label
                >
                <div class="grid grid-cols-3 gap-4">
                  <!-- Font Family -->
                  <UFormField label="Font Family">
                    <FontSelect
                      :model-value="themeConfig.header.fontFamily || 'system-ui'"
                      :font-options="nameFontOptions"
                      @update:model-value="onNameFontChange($event)"
                    />
                  </UFormField>
                  <!-- Font Size -->
                  <UFormField label="Font Size">
                    <USelect
                      :model-value="themeConfig.header.fontSize || '1.5rem'"
                      :items="[
                        { label: 'Small', value: '1.25rem' },
                        { label: 'Medium', value: '1.5rem' },
                        { label: 'Large', value: '1.875rem' },
                        { label: 'XL', value: '2.25rem' },
                      ]"
                      size="md"
                      class="w-full"
                      @update:model-value="emitHeader('fontSize', $event)"
                    />
                  </UFormField>
                  <!-- Text Color -->
                  <UFormField label="Text Color">
                    <div class="flex items-center gap-2">
                      <UPopover>
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          class="p-0 rounded-full overflow-hidden"
                        >
                          <span
                            class="size-8 rounded-full border-2 border-gray-300 dark:border-white/15"
                            :style="{
                              backgroundColor:
                                themeConfig.header.textColor ||
                                themeConfig.colors?.primary ||
                                '#000000',
                            }"
                          />
                        </UButton>
                        <template #content>
                          <UColorPicker
                            :model-value="
                              themeConfig.header.textColor ||
                              themeConfig.colors?.primary ||
                              '#000000'
                            "
                            class="p-2"
                            @update:model-value="
                              emitHeader('textColor', $event)
                            "
                          />
                        </template>
                      </UPopover>
                      <button
                        v-if="themeConfig.header.textColor"
                        class="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"
                        @click="emitHeader('textColor', undefined)"
                      >
                        reset
                      </button>
                    </div>
                  </UFormField>
                  <!-- Weight -->
                  <UFormField label="Weight">
                    <USelect
                      :model-value="themeConfig.header.fontWeight || '700'"
                      :items="fontWeightOptions"
                      size="md"
                      class="w-full"
                      @update:model-value="emitHeader('fontWeight', $event)"
                    />
                  </UFormField>
                  <!-- Letter spacing -->
                  <UFormField label="Letter Spacing">
                    <USelect
                      :model-value="themeConfig.header.letterSpacing || 'normal'"
                      :items="letterSpacingOptions"
                      size="md"
                      class="w-full"
                      @update:model-value="emitHeader('letterSpacing', $event === 'normal' ? undefined : $event)"
                    />
                  </UFormField>
                  <!-- Block titles -->
                  <UFormField label="Block Title Font">
                    <FontSelect
                      :model-value="themeConfig.typography.headingFont || 'system-ui'"
                      :font-options="headingFontOptions"
                      @update:model-value="onHeadingFontChange($event)"
                    />
                  </UFormField>
                </div>
              </div>

              <!-- Bio Text -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Bio Text</label
                >
                <div class="grid grid-cols-3 gap-4">
                  <!-- Font Family -->
                  <UFormField label="Font Family">
                    <FontSelect
                      :model-value="themeConfig.typography.bioFontFamily || 'system-ui'"
                      :font-options="paragraphFontOptions"
                      @update:model-value="onParagraphFontChange($event)"
                    />
                  </UFormField>
                  <!-- Font Size -->
                  <UFormField label="Font Size">
                    <USelect
                      :model-value="
                        themeConfig.typography.bioFontSize || '0.875rem'
                      "
                      :items="[
                        { label: 'XS', value: '0.75rem' },
                        { label: 'Small', value: '0.875rem' },
                        { label: 'Medium', value: '1rem' },
                        { label: 'Large', value: '1.125rem' },
                      ]"
                      size="md"
                      class="w-full"
                      @update:model-value="
                        emitTypography('bioFontSize', $event)
                      "
                    />
                  </UFormField>
                  <!-- Text Color -->
                  <UFormField label="Text Color">
                    <div class="flex items-center gap-2">
                      <UPopover>
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          class="p-0 rounded-full overflow-hidden"
                        >
                          <span
                            class="size-8 rounded-full border-2 border-gray-300 dark:border-white/15"
                            :style="{
                              backgroundColor:
                                themeConfig.typography.bioTextColor ||
                                themeConfig.colors?.primary ||
                                '#000000',
                            }"
                          />
                        </UButton>
                        <template #content>
                          <UColorPicker
                            :model-value="
                              themeConfig.typography.bioTextColor ||
                              themeConfig.colors?.primary ||
                              '#000000'
                            "
                            class="p-2"
                            @update:model-value="
                              emitTypography('bioTextColor', $event)
                            "
                          />
                        </template>
                      </UPopover>
                      <button
                        v-if="themeConfig.typography.bioTextColor"
                        class="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"
                        @click="emitTypography('bioTextColor', undefined)"
                      >
                        reset
                      </button>
                    </div>
                  </UFormField>
                </div>
              </div>

              <!-- Card -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Card Style</label
                >
                <div class="grid grid-cols-3 gap-4">
                  <!-- Style -->
                  <UFormField label="Style">
                    <USelect
                      :model-value="themeConfig.card.style || 'filled'"
                      :items="[
                        { label: 'Filled', value: 'filled' },
                        { label: 'Outline', value: 'outline' },
                        { label: 'Ghost', value: 'ghost' },
                        { label: 'Soft', value: 'soft' },
                      ]"
                      size="md"
                      class="w-full"
                      @update:model-value="emitCard('style', $event)"
                    />
                  </UFormField>
                  <!-- Surface colour -->
                  <UFormField label="Card Color" help="Empty uses the primary colour.">
                    <BioColorField
                      :model-value="themeConfig.card.backgroundColor"
                      :fallback="themeConfig.colors.primary"
                      label="Card color"
                      placeholder="Auto"
                      @update:model-value="emitCard('backgroundColor', $event)"
                    />
                  </UFormField>
                  <!-- Border colour -->
                  <UFormField label="Border Color">
                    <BioColorField
                      :model-value="themeConfig.card.outlineColor"
                      :fallback="themeConfig.colors.primary"
                      label="Card border color"
                      placeholder="Auto"
                      @update:model-value="emitCard('outlineColor', $event)"
                    />
                  </UFormField>
                  <!-- Text Color -->
                  <UFormField label="Text Color">
                    <div class="flex items-center gap-2">
                      <UPopover>
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          class="p-0 rounded-full overflow-hidden"
                        >
                          <span
                            class="size-8 rounded-full border-2 border-gray-300 dark:border-white/15"
                            :style="{
                              backgroundColor:
                                themeConfig.card.textColor || '#000000',
                            }"
                          />
                        </UButton>
                        <template #content>
                          <UColorPicker
                            :model-value="
                              themeConfig.card.textColor || '#000000'
                            "
                            class="p-2"
                            @update:model-value="emitCard('textColor', $event)"
                          />
                        </template>
                      </UPopover>
                      <button
                        v-if="themeConfig.card.textColor"
                        class="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"
                        @click="emitCard('textColor', undefined)"
                      >
                        reset
                      </button>
                    </div>
                  </UFormField>
                  <!-- Corner Radius -->
                  <UFormField label="Corner Radius">
                    <UInput
                      :model-value="String(themeConfig.card.cornerRadius)"
                      size="md"
                      type="number"
                      class="w-full"
                      @update:model-value="
                        emitCard('cornerRadius', Number($event))
                      "
                    />
                  </UFormField>
                  <!-- Shadow -->
                  <UFormField label="Shadow">
                    <USelect
                      :model-value="themeConfig.card.shadow || 'none'"
                      :items="shadowOptions"
                      size="md"
                      class="w-full"
                      @update:model-value="emitCard('shadow', $event as string)"
                    />
                  </UFormField>
                  <!-- Backdrop Blur -->
                  <UFormField label="Backdrop Blur">
                    <USelect
                      :model-value="themeConfig.card.backdropBlur || 'none'"
                      :items="[
                        { label: 'None', value: 'none' },
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                        { label: 'XL', value: 'xl' },
                      ]"
                      size="md"
                      class="w-full"
                      @update:model-value="
                        emitCard('backdropBlur', $event as string)
                      "
                    />
                  </UFormField>
                  <!-- Appear Animation -->
                  <UFormField label="Appear Animation">
                    <USelect
                      :model-value="themeConfig.card.animationAppear || 'none'"
                      :items="appearOptions"
                      size="md"
                      class="w-full"
                      @update:model-value="
                        emitCard('animationAppear', $event as string)
                      "
                    />
                  </UFormField>
                  <!-- Hover Animation -->
                  <UFormField label="Hover Animation">
                    <USelect
                      :model-value="themeConfig.card.animationHover || 'none'"
                      :items="hoverOptions"
                      size="md"
                      class="w-full"
                      @update:model-value="
                        emitCard('animationHover', $event as string)
                      "
                    />
                  </UFormField>
                </div>
              </div>

              <!-- Button -->
              <!-- <div>
            `  <label class="text-lg font-bold text-perlink-blue/60 mb-2 block">Button Style</label>
              <div class="flex items-center gap-2 mb-3">
                <label class="text-xs text-gray-500 dark:text-neutral-400">Text Color</label>
                <input
                  type="color"
                  :value="themeConfig.button.textColor || '#ffffff'"
                  class="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-white/10"
                  @input="emitButton('textColor', ($event.target as HTMLInputElement).value)"
                />
                <button
                  v-if="themeConfig.button.textColor"
                  class="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"
                  @click="emitButton('textColor', undefined)"
                >reset</button>
              </div>
              <div class="flex gap-2 flex-wrap">
                <UButton
                  v-for="style in (['filled', 'outline', 'ghost', 'soft'] as const)"
                  :key="style"
                  size="xs"
                  :variant="themeConfig.button.style === style ? 'solid' : 'outline'"
                  :color="themeConfig.button.style === style ? 'primary' : 'neutral'"
                  @click="emitButton('style', style)"
                >
                  {{ style }}
                </UButton>
              </div>
              <div class="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400 mb-1 block">Appear animation</label>
                  <USelect
                    :model-value="themeConfig.button.animationAppear || 'none'"
                    :items="appearOptions"
                    size="sm"
                    @update:model-value="emitButton('animationAppear', $event as string)"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-neutral-400 mb-1 block">Hover animation</label>
                  <USelect
                    :model-value="themeConfig.button.animationHover || 'none'"
                    :items="hoverOptions"
                    size="sm"
                    @update:model-value="emitButton('animationHover', $event as string)"
                  />
                </div>
              </div>
              <div class="mt-3">
                <label class="text-xs text-gray-500 dark:text-neutral-400 mb-1 block">Duration</label>
                <USelect
                  :model-value="themeConfig.button.animationDuration || 'normal'"
                  :items="durationOptions"
                  size="sm"
                  @update:model-value="emitButton('animationDuration', $event as string)"
                />
              </div>
            </div> -->`

              <!-- Page -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Page</label
                >
                <div class="grid grid-cols-3 gap-4">
                  <UFormField label="Text Color">
                    <BioColorField
                      :model-value="themeConfig.typography.textColor"
                      fallback="#334155"
                      label="Page text color"
                      placeholder="Auto"
                      @update:model-value="emitTypography('textColor', $event)"
                    />
                  </UFormField>
                  <UFormField label="Block Spacing">
                    <USelect
                      :model-value="themeConfig.page?.blockGap || 'normal'"
                      :items="blockGapOptions"
                      size="md"
                      class="w-full"
                      @update:model-value="emitPage('blockGap', $event)"
                    />
                  </UFormField>
                  <UFormField label="Block Titles">
                    <USelect
                      :model-value="themeConfig.page?.titleAlign || 'center'"
                      :items="[{ label: 'Centered', value: 'center' }, { label: 'Left', value: 'left' }]"
                      size="md"
                      class="w-full"
                      @update:model-value="emitPage('titleAlign', $event)"
                    />
                  </UFormField>
                  <UFormField label="Social Icons">
                    <USelect
                      :model-value="themeConfig.social?.style || 'soft'"
                      :items="socialStyleOptions"
                      size="md"
                      class="w-full"
                      @update:model-value="emit('updateTheme', { social: { style: $event as any } })"
                    />
                  </UFormField>
                </div>
              </div>

              <!-- Typography -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Font</label
                >
                <FontSelect
                  :model-value="themeConfig.typography.paragraphFont"
                  :font-options="paragraphFontOptions"
                  @update:model-value="onGenericParagraphFontChange($event)"
                />
              </div>

              <!-- Avatar -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Avatar Shape</label
                >
                <div class="flex gap-3">
                  <UButton
                    v-for="shape in ['circle', 'rounded', 'square'] as const"
                    :key="shape"
                    variant="outline"
                    color="neutral"
                    class="flex flex-col items-center gap-1.5 flex-1 h-auto py-2 px-2"
                    :class="
                      themeConfig.avatar.shape === shape
                        ? 'border-primary-500! bg-primary-50!'
                        : ''
                    "
                    @click="emitAvatar('shape', shape)"
                  >
                    <img
                      :src="avatarUrl || avatarDefaultImg"
                      class="w-10 h-10 object-cover"
                      :style="{
                        borderRadius:
                          shape === 'circle'
                            ? '9999px'
                            : shape === 'rounded'
                              ? '8px'
                              : '2px',
                      }"
                      @error="
                        (e) =>
                          ((e.target as HTMLImageElement).src =
                            avatarDefaultImg)
                      "
                    />
                    <span
                      class="text-[10px] font-medium capitalize"
                      :class="
                        themeConfig.avatar.shape === shape
                          ? 'text-primary-600'
                          : 'text-gray-500 dark:text-neutral-400'
                      "
                      >{{ shape }}</span
                    >
                  </UButton>
                </div>
              </div>

              <!-- Link Card Layout -->
              <div>
                <label class="text-lg font-bold text-perlink-blue/60 mb-2 block"
                  >Link Card Layout</label
                >
                <div class="flex flex-col gap-2">
                  <UButton
                    v-for="opt in linkLayoutOptions"
                    :key="opt.value"
                    size="xs"
                    :variant="
                      themeConfig.link.layout === opt.value
                        ? 'solid'
                        : 'outline'
                    "
                    :color="
                      themeConfig.link.layout === opt.value
                        ? 'primary'
                        : 'neutral'
                    "
                    @click="emitLink('layout', opt.value)"
                  >
                    {{ opt.label }}
                  </UButton>
                </div>
              </div>
            </div>
          </template>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Template, ThemeConfig, SocialLink } from "~/types/bio";
import { type ThemePreset } from "~/data/themePresets";
import { nameFontOptions, headingFontOptions, paragraphFontOptions, type FontOption } from "~/data/fontOptions";
import { useGoogleFonts } from "~/composables/useGoogleFonts";
import avatarDefaultImg from "~/assets/images/avatar-default-1.jpg";

const props = defineProps<{
  isActive: boolean;
  templates: Template[];
  selectedTemplate: string;
  themeConfig: ThemeConfig;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  socialLinks?: SocialLink[];
  bioPageId?: string;
}>();

const emit = defineEmits<{
  toggle: [];
  selectTemplate: [id: string];
  updateTheme: [patch: Partial<ThemeConfig>];
}>();

const editMode = ref<"presets" | "custom">("presets");
const selectedPresetId = ref<string | undefined>(undefined);

function onPresetSelect(preset: ThemePreset) {
  selectedPresetId.value = preset.id;
  // Theme patches merge into the current theme, so clear the extras a
  // template may have set that the preset doesn't define
  const theme = preset.theme;
  emit("updateTheme", {
    ...theme,
    card: { backgroundColor: undefined, outlineColor: undefined, ...theme.card },
    header: { fontWeight: undefined, letterSpacing: undefined, fontFamily: undefined, fontSize: undefined, textColor: undefined, ...theme.header },
    typography: { textColor: undefined, bioTextColor: undefined, bioFontFamily: undefined, ...theme.typography },
    social: theme.social ?? { style: "soft" },
    page: theme.page ?? { blockGap: "normal", titleAlign: "center" },
  });
}

// Google Fonts loader
const { loadFont, preloadBioFonts } = useGoogleFonts();

// Initialize fonts on mount
onMounted(() => {
  preloadBioFonts();
});

// Font change handlers with dynamic loading
function onNameFontChange(value: string) {
  const selectedFont = nameFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitHeader('fontFamily', value);
}

function onParagraphFontChange(value: string) {
  const selectedFont = paragraphFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitTypography('bioFontFamily', value);
}

function onHeadingFontChange(value: string) {
  const selectedFont = headingFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitTypography('headingFont', value);
}

const fontWeightOptions = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semibold', value: '600' },
  { label: 'Bold', value: '700' },
];

const letterSpacingOptions = [
  { label: 'Tight', value: '-0.03em' },
  { label: 'Snug', value: '-0.015em' },
  { label: 'Normal', value: 'normal' },
  { label: 'Wide', value: '0.04em' },
  { label: 'Extra wide', value: '0.12em' },
];

const blockGapOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Normal', value: 'normal' },
  { label: 'Relaxed', value: 'relaxed' },
];

const socialStyleOptions = [
  { label: 'Soft', value: 'soft' },
  { label: 'Filled', value: 'filled' },
  { label: 'Outline', value: 'outline' },
  { label: 'Icon only', value: 'plain' },
];

function emitPage(key: string, value: any) {
  emit("updateTheme", {
    page: { blockGap: "normal", titleAlign: "center", ...props.themeConfig.page, [key]: value },
  });
}

function onGenericParagraphFontChange(value: string) {
  const selectedFont = paragraphFontOptions.find(f => f.value === value);
  if (selectedFont) {
    loadFont(selectedFont);
  }
  emitTypography('paragraphFont', value);
}

const shadowOptions = [
  { label: "None", value: "none" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const appearOptions = [
  { label: "None", value: "none" },
  { label: "Fade In", value: "fadeIn" },
  { label: "Fade In Down", value: "fadeInDown" },
  { label: "Fade In Up", value: "fadeInUp" },
  { label: "Fade In Left", value: "fadeInLeft" },
  { label: "Fade In Right", value: "fadeInRight" },
  { label: "Zoom In", value: "zoomIn" },
  { label: "Zoom In Down", value: "zoomInDown" },
  { label: "Zoom In Up", value: "zoomInUp" },
  { label: "Bounce In", value: "bounceIn" },
  { label: "Bounce In Down", value: "bounceInDown" },
  { label: "Bounce In Up", value: "bounceInUp" },
  { label: "Slide In Down", value: "slideInDown" },
  { label: "Slide In Up", value: "slideInUp" },
  { label: "Slide In Left", value: "slideInLeft" },
  { label: "Slide In Right", value: "slideInRight" },
  { label: "Back In Down", value: "backInDown" },
  { label: "Back In Up", value: "backInUp" },
  { label: "Flip In X", value: "flipInX" },
  { label: "Flip In Y", value: "flipInY" },
  { label: "Light Speed In Right", value: "lightSpeedInRight" },
  { label: "Rotate In", value: "rotateIn" },
];

const hoverOptions = [
  { label: "None", value: "none" },
  { label: "Pulse", value: "pulse" },
  { label: "Bounce", value: "bounce" },
  { label: "Rubber Band", value: "rubberBand" },
  { label: "Shake X", value: "shakeX" },
  { label: "Shake Y", value: "shakeY" },
  { label: "Head Shake", value: "headShake" },
  { label: "Swing", value: "swing" },
  { label: "Tada", value: "tada" },
  { label: "Wobble", value: "wobble" },
  { label: "Jello", value: "jello" },
  { label: "Heart Beat", value: "heartBeat" },
  { label: "Flash", value: "flash" },
  { label: "Flip", value: "flip" },
];

const durationOptions = [
  { label: "Faster (0.5s)", value: "faster" },
  { label: "Fast (0.8s)", value: "fast" },
  { label: "Normal (1s)", value: "normal" },
  { label: "Slow (2s)", value: "slow" },
  { label: "Slower (3s)", value: "slower" },
];

function emitColors(key: "primary" | "secondary" | "third", value: string) {
  emit("updateTheme", {
    colors: { ...props.themeConfig.colors, [key]: value },
  });
}

function emitBackground(key: string, value: any) {
  emit("updateTheme", {
    background: { ...props.themeConfig.background, [key]: value },
  });
}

function emitGradient(key: string, value: string) {
  emit("updateTheme", {
    background: {
      ...props.themeConfig.background,
      gradient: { ...props.themeConfig.background.gradient, [key]: value },
    },
  });
}

function emitCard(key: string, value: any) {
  emit("updateTheme", { card: { ...props.themeConfig.card, [key]: value } });
}

function emitButton(key: string, value: any) {
  emit("updateTheme", {
    button: { ...props.themeConfig.button, [key]: value },
  });
}

function emitTypography(key: string, value: string | undefined) {
  emit("updateTheme", {
    typography: { ...props.themeConfig.typography, [key]: value },
  });
}

function emitAvatar(key: string, value: any) {
  emit("updateTheme", {
    avatar: { ...props.themeConfig.avatar, [key]: value },
  });
}

const linkLayoutOptions = [
  { label: "Vertical (image top)", value: "vertical" },
  { label: "Horizontal (image left)", value: "horizontal-left" },
  { label: "Horizontal (image right)", value: "horizontal-right" },
  { label: "Centered (text only)", value: "centered" },
];

function emitLink(key: string, value: any) {
  emit("updateTheme", { link: { ...props.themeConfig.link, [key]: value } });
}

function emitHeader(key: string, value: any) {
  emit("updateTheme", {
    header: { ...props.themeConfig.header, [key]: value },
  });
}
</script>
