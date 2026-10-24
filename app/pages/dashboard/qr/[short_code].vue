<template>
  <UDashboardPanel id="qr-customize">
    <template #header>
      <UDashboardNavbar title="Customize QR Code">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div class="flex items-center gap-4">
            <UButton
              to="/dashboard/qr-codes"
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-left"
            />
            <div>
              <h1 class="text-2xl font-bold text-highlighted dark:text-white">Customize QR Code</h1>
              <p class="text-sm text-muted dark:text-neutral-400">
                {{ linkData?.destinationUrl || "Loading..." }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <UButton variant="outline" color="neutral" @click="resetToDefault">
              <UIcon name="i-lucide-rotate-ccw" class="w-4 h-4 mr-2" />
              Reset
            </UButton>
            <UButton color="primary" @click="saveChanges" :loading="saving">
              <UIcon name="i-lucide-download" class="w-4 h-4 mr-2" />
              Save Changes
            </UButton>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Panel - Customization Options -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Patterns -->
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-highlighted dark:text-white">Select styles</h3>
                  <span class="text-xs text-muted dark:text-neutral-400">Patterns</span>
                </div>
              </template>

              <div class="space-y-4">
                <p class="text-sm text-muted dark:text-neutral-400">Patterns</p>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="pattern in dotPatterns"
                    :key="pattern.value"
                    class="relative size-16 rounded-lg border-2 transition-all flex items-center justify-center"
                    :class="[
                      config.dotsType === pattern.value
                        ? 'border-primary bg-primary/5'
                        : 'border-default dark:border-white/10 hover:border-accented dark:hover:border-white/20',
                      pattern.locked
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer',
                    ]"
                    @click="!pattern.locked && (config.dotsType = pattern.value)"
                    :disabled="pattern.locked"
                  >
                    <img
                      :src="pattern.preview"
                      class="w-full h-full p-1 object-contain"
                    />
                    <div
                      v-if="pattern.locked"
                      class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center"
                    >
                      <UIcon name="i-lucide-lock" class="w-3 h-3 text-white" />
                    </div>
                  </button>
                  <button
                    v-if="hasMorePatterns"
                    class="size-16 rounded-lg border-2 border-dashed border-accented dark:border-white/15 flex items-center justify-center text-primary hover:border-primary transition-colors"
                    @click="showUpgradeModal = true"
                  >
                    <span class="text-xs">+ More</span>
                  </button>
                </div>
              </div>

              <!-- Corners -->
              <div class="space-y-4 mt-6 pt-6 border-t border-muted dark:border-white/5">
                <p class="text-sm text-muted dark:text-neutral-400">Corners</p>
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="corner in cornerStyles"
                    :key="corner.value"
                    class="relative size-10 rounded-lg border-2 transition-all flex items-center justify-center"
                    :class="[
                      config.cornersSquareType === corner.value
                        ? 'border-primary bg-primary/5'
                        : 'border-default dark:border-white/10 hover:border-accented dark:hover:border-white/20',
                      corner.locked
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer',
                    ]"
                    @click="
                      !corner.locked &&
                      ((config.cornersSquareType = corner.value),
                      (config.cornersDotType = getCornersDotType(corner.value)))
                    "
                    :disabled="corner.locked"
                  >
                    <img
                      :src="corner.preview"
                      class="w-full h-full p-1 object-contain"
                    />
                    <div
                      v-if="corner.locked"
                      class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center"
                    >
                      <UIcon name="i-lucide-lock" class="w-3 h-3 text-white" />
                    </div>
                  </button>
                  <button
                    v-if="hasMoreCorners"
                    class="size-10 rounded-lg border-2 border-dashed border-accented dark:border-white/15 flex items-center justify-center text-primary hover:border-primary transition-colors"
                    @click="showUpgradeModal = true"
                  >
                    <span class="text-xs">+ More</span>
                  </button>
                </div>
              </div>
            </UCard>

            <!-- Colors -->
            <UCard>
              <template #header>
                <h3 class="font-semibold text-highlighted dark:text-white">Choose your colors</h3>
              </template>

              <!-- Preset Colors -->
              <div class="space-y-3">
                <p class="text-sm text-muted dark:text-neutral-400">Preset</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in presetColors"
                    :key="color.value"
                    class="w-10 h-10 rounded-full border-2 transition-all"
                    :class="
                      config.foreground === color.value
                        ? 'border-gray-900 scale-110'
                        : 'border-transparent hover:scale-105'
                    "
                    :style="{ backgroundColor: color.value }"
                    @click="config.foreground = color.value"
                  />
                </div>
              </div>

              <!-- Custom Hex -->
              <div class="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label class="block text-sm text-muted dark:text-neutral-400 mb-2">Code</label>
                  <USelect
                    v-model="colorType"
                    :items="[
                      { label: 'Single color', value: 'single' },
                      {
                        label: 'Gradient',
                        value: 'gradient',
                        disabled: !canUseGradient,
                      },
                    ]"
                  />
                </div>
                <div class="relative">
                  <label class="block text-sm text-muted dark:text-neutral-400 mb-2">Hex value</label>
                  <div class="flex items-center gap-2">
                    <UInput
                      v-model="config.foreground"
                      size="xl"
                      class="flex-1 font-mono"
                      maxlength="7"
                      :ui="{
                        base: 'pl-12',
                        leading: 'pl-0',
                      }"
                    >
                      <template #leading>
                        <UPopover>
                          <UButton
                            size="md"
                            color="neutral"
                            variant="outline"
                            class="p-0 rounded-lg overflow-hidden shrink-0"
                          >
                            <span
                              class="size-10 rounded-lg border-2 border-accented dark:border-white/15"
                              :style="{ backgroundColor: config.foreground }"
                            />
                          </UButton>
                          <template #content>
                            <UColorPicker v-model="config.foreground" class="p-2" />
                          </template>
                        </UPopover>
                      </template>
                    </UInput>
                  </div>
                </div>
              </div>

              <!-- Background -->
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm text-muted dark:text-neutral-400 mb-2">Background</label>
                  <USelect
                    v-model="bgType"
                    :items="[
                      { label: 'Single color', value: 'single' },
                      {
                        label: 'Transparent',
                        value: 'transparent',
                        disabled: !canUseTransparent,
                      },
                    ]"
                  />
                </div>
                <div class="relative">
                  <label class="block text-sm text-muted dark:text-neutral-400 mb-2">Hex value</label>
                  <div class="flex items-center gap-2">
                    <UInput
                      v-model="config.background"
                      size="xl"
                      class="flex-1 font-mono"
                      maxlength="7"
                      :disabled="bgType === 'transparent'"
                      :ui="{
                        base: 'pl-12',
                        leading: 'pl-0',
                      }"
                    >
                      <template #leading>
                        <UPopover>
                          <UButton
                            size="md"
                            color="neutral"
                            variant="outline"
                            class="p-0 rounded-lg overflow-hidden shrink-0"
                            :disabled="bgType === 'transparent'"
                          >
                            <span
                              class="size-10 rounded-lg border-2 border-accented dark:border-white/15"
                              :style="{ backgroundColor: config.background }"
                            />
                          </UButton>
                          <template #content>
                            <UColorPicker v-model="config.background" class="p-2" />
                          </template>
                        </UPopover>
                      </template>
                    </UInput>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Logo / Center Text -->
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-highlighted dark:text-white">
                    Add a logo or center text
                  </h3>
                  <UBadge
                    v-if="!canAddLogo"
                    color="neutral"
                    variant="soft"
                    size="sm"
                    class="cursor-pointer"
                    @click="showUpgradeModal = true"
                  >
                    <UIcon name="i-lucide-lock" class="w-3 h-3 mr-1" />
                    Upgrade
                  </UBadge>
                </div>
              </template>

              <div
                class="space-y-4"
                :class="{ 'opacity-50 pointer-events-none': !canAddLogo }"
              >
                <!-- Logo Options -->
                <div class="flex flex-wrap gap-3">
                  <button
                    class="w-14 h-14 rounded-lg border-2 border-default dark:border-white/10 flex items-center justify-center hover:border-primary transition-colors"
                    :class="{ 'border-primary bg-primary/5': !config.logo }"
                    @click="config.logo = ''"
                  >
                    <UIcon name="i-lucide-x" class="w-5 h-5 text-dimmed dark:text-neutral-500" />
                  </button>
                  <button
                    v-for="logo in presetLogos"
                    :key="logo.value"
                    class="w-14 h-14 rounded-lg border-2 transition-all flex items-center justify-center"
                    :class="
                      config.logo === logo.value
                        ? 'border-primary bg-primary/5'
                        : 'border-default dark:border-white/10 hover:border-accented dark:hover:border-white/20'
                    "
                    @click="config.logo = logo.value"
                  >
                    <UIcon :name="logo.icon" class="w-6 h-6" />
                  </button>
                  <button
                    class="w-14 h-14 rounded-lg border-2 border-dashed border-accented dark:border-white/15 flex flex-col items-center justify-center text-xs text-muted dark:text-neutral-400 hover:border-primary hover:text-primary transition-colors"
                    @click="showUploadModal = true"
                  >
                    <UIcon name="i-lucide-upload" class="w-4 h-4 mb-1" />
                    <span>Custom</span>
                  </button>
                </div>

                <!-- Custom Text Option -->
                <div class="flex gap-3">
                  <UInput
                    v-model="customText"
                    placeholder="Or enter custom text"
                    class="flex-1"
                  />
                  <UButton variant="outline" @click="applyCustomText">
                    Apply
                  </UButton>
                </div>

                <p class="text-xs text-muted dark:text-neutral-400">
                  File type: PNG, 1:1 aspect ratio. Max size: 5MB, 2500x2500px
                </p>
              </div>
            </UCard>

            <!-- Frames -->
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-highlighted dark:text-white">Select a frame</h3>
                  <UBadge
                    v-if="!canUseFrames"
                    color="neutral"
                    variant="soft"
                    size="sm"
                    class="cursor-pointer"
                    @click="showUpgradeModal = true"
                  >
                    <UIcon name="i-lucide-lock" class="w-3 h-3 mr-1" />
                    Upgrade
                  </UBadge>
                </div>
              </template>

              <div
                class="flex flex-wrap gap-3"
                :class="{ 'opacity-50 pointer-events-none': !canUseFrames }"
              >
                <button
                  v-for="frame in frames"
                  :key="frame.value"
                  class="relative w-20 h-20 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1"
                  :class="
                    config.frame === frame.value
                      ? 'border-primary bg-primary/5'
                      : 'border-default dark:border-white/10 hover:border-accented dark:hover:border-white/20'
                  "
                  @click="config.frame = frame.value"
                >
                  <div
                    class="w-12 h-12 border-2 rounded"
                    :class="frame.borderClass"
                  ></div>
                  <span class="text-xs text-muted dark:text-neutral-400">{{ frame.label }}</span>
                  <div
                    v-if="frame.locked"
                    class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center"
                  >
                    <UIcon name="i-lucide-lock" class="w-3 h-3 text-white" />
                  </div>
                </button>
                <button
                  v-if="hasMoreFrames"
                  class="w-20 h-20 rounded-lg border-2 border-dashed border-accented dark:border-white/15 flex items-center justify-center text-primary hover:border-primary transition-colors"
                  @click="showUpgradeModal = true"
                >
                  <span class="text-xs">+ More</span>
                </button>
              </div>
            </UCard>

            <!-- Advanced Options -->
            <UCard>
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-highlighted dark:text-white">Advanced options</h3>
                </div>
              </template>

              <div class="space-y-4">
                <!-- Branding -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-highlighted dark:text-white">Branding</p>
                    <p class="text-sm text-muted dark:text-neutral-400">Perlink logo</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <UBadge
                      v-if="!canRemoveBranding"
                      color="neutral"
                      variant="soft"
                      size="sm"
                      class="cursor-pointer"
                      @click="showUpgradeModal = true"
                    >
                      <UIcon name="i-lucide-lock" class="w-3 h-3 mr-1" />
                      Upgrade
                    </UBadge>
                    <USwitch
                      v-model="config.showBranding"
                      :disabled="!canRemoveBranding"
                      size="xl"
                    />
                  </div>
                </div>

                <!-- Use QR Color for Corners -->
                <div
                  class="flex items-center justify-between pt-4 border-t border-muted dark:border-white/5"
                >
                  <div>
                    <p class="font-medium text-highlighted dark:text-white">Corners</p>
                    <p class="text-sm text-muted dark:text-neutral-400">Use QR Code color</p>
                  </div>
                  <USwitch v-model="config.useQrColorForCorners" size="xl" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Right Panel - Preview -->
          <div class="lg:col-span-1">
            <div class="sticky top-6">
              <UCard class="bg-muted dark:bg-white/[0.03]">
                <template #header>
                  <h3 class="font-semibold text-highlighted dark:text-white text-center">Preview</h3>
                </template>

                <div class="flex flex-col items-center">
                  <!-- QR Preview -->
                  <div class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl p-6 rounded-xl shadow-sm">
                    <ClientOnly>
                      <QRCodeRender
                        v-if="linkData"
                        :key="qrConfigKey"
                        :value="qrValue"
                        :foreground="config.foreground"
                        :background="config.background"
                        :image="config.logo"
                        :dots-type="config.dotsType"
                        :corners-square-type="config.cornersSquareType"
                        :corners-dot-type="config.cornersDotType"
                        :width="280"
                        :height="280"
                      />
                    </ClientOnly>
                  </div>

                  <!-- Reset to Default -->
                  <UButton
                    variant="ghost"
                    color="primary"
                    class="mt-4"
                    @click="resetToDefault"
                  >
                    <UIcon name="i-lucide-rotate-ccw" class="w-4 h-4 mr-2" />
                    Reset to default
                  </UButton>
                </div>
              </UCard>

              <!-- Download Options -->
              <UCard class="mt-4">
                <template #header>
                  <h3 class="font-semibold text-highlighted dark:text-white">Download</h3>
                </template>

                <div class="space-y-3">
                  <UButton color="primary" block @click="downloadQR('png')">
                    <UIcon name="i-lucide-download" class="w-4 h-4 mr-2" />
                    Download PNG
                  </UButton>
                </div>
              </UCard>
            </div>
          </div>
        </div>

        <!-- Upgrade Modal -->
        <UModal v-model="showUpgradeModal">
          <UCard class="max-w-md mx-auto text-center p-6">
            <div
              class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <UIcon name="i-lucide-crown" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-highlighted dark:text-white mb-2">
              Unlock Premium Features
            </h3>
            <p class="text-muted dark:text-neutral-300 mb-6">
              Upgrade to Starter ($5) or higher to access all QR code customization
              options including custom logos, frames, and transparent backgrounds.
            </p>
            <div class="flex gap-3">
              <UButton
                variant="outline"
                color="neutral"
                class="flex-1"
                @click="showUpgradeModal = false"
              >
                Maybe Later
              </UButton>
              <UButton
                color="primary"
                class="flex-1"
                to="/dashboard/upgrade"
                @click="showUpgradeModal = false"
              >
                Upgrade Now
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import QRCodeRender from "~/components/features/QRCodeRender.vue";
import { useQRPreview } from "@/composables/useQRPreview";
import type { User } from "#auth-utils";

// Page meta
definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
});

const { user: sessionUser } = useUserSession();
const user = sessionUser as Ref<User | null>;

const isProUser = computed(() => {
  return user.value?.plan !== "free";
});

const route = useRoute();
const toast = useToast();

// Loading states
const saving = ref(false);
const loading = ref(true);

// Link data
interface QRStyleConfig {
  dotsType: string;
  cornersSquareType: string;
  cornersDotType: string;
  foregroundColor: string;
  backgroundColor: string;
  useGradient: boolean;
  frameStyle: string;
  showBranding: boolean;
  foreground: string;
  background: string;
  logo: string;
  frame: string;
  useQrColorForCorners: boolean;
}

interface QRCodeData {
  id: string;
  userId: string;
  shortCode: string;
  name: string | null;
  destinationUrl: string;
  title: string;
  styleConfig: QRStyleConfig;
  logoUrl: string | null;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  isActive: boolean;
}

const linkData = ref<QRCodeData | null>(null);

// Permission checks based on plan
const canUseGradient = computed(() => isProUser.value);
const canUseTransparent = computed(() => isProUser.value);
const canAddLogo = computed(() => isProUser.value);
const canUseFrames = computed(() => isProUser.value);
const canRemoveBranding = computed(() => isProUser.value);

// Modals
const showUpgradeModal = ref(false);
const showUploadModal = ref(false);

// Config
const colorType = ref("single");
const bgType = ref("single");
const customText = ref("");

const config = ref({
  dotsType: "rounded",
  cornersSquareType: "square", // 'dot' | 'square' | 'extra-rounded'
  cornersDotType: "square", // follows cornersSquareType mapping
  foreground: "#000000",
  background: "#ffffff",
  logo: "",
  frame: "none",
  showBranding: true,
  useQrColorForCorners: true,
});

// Map cornersSquareType to cornersDotType (only 'dot' or 'square' allowed)
function getCornersDotType(squareType: string): string {
  // cornersDotOptions.type only accepts: 'dot' | 'square'
  const mapping: Record<string, string> = {
    dot: "dot", // dot square -> dot inner
    square: "square", // square square -> square inner
    "extra-rounded": "square", // extra-rounded square -> square inner (fallback)
  };
  return mapping[squareType] || "square";
}

// QR Value
const qrValue = computed(() => {
  return linkData.value
    ? `https://perlink.to/qr/${linkData.value.shortCode}`
    : "";
});

// QR Preview composable (Canvas-based PNG)
const { generateDotPatternPreview, generateCornerSquarePreview } =
  useQRPreview();

// Reactive data URLs for previews
const dotPatternPreviews = ref<Record<string, string>>({});
const cornerSquarePreviews = ref<Record<string, string>>({});

// Generate PNG previews client-side
onMounted(() => {
  // Dot patterns
  [
    "square",
    "rounded",
    "dots",
    "classy",
    "classy-rounded",
    "extra-rounded",
  ].forEach((type) => {
    dotPatternPreviews.value[type] = generateDotPatternPreview(type);
  });
  // Corner styles
  ["square", "extra-rounded", "dot"].forEach((type) => {
    cornerSquarePreviews.value[type] = generateCornerSquarePreview(type);
  });
});

// Dot Patterns
const dotPatterns = computed(() => [
  {
    value: "square",
    preview: dotPatternPreviews.value["square"],
    locked: false,
  },
  {
    value: "rounded",
    preview: dotPatternPreviews.value["rounded"],
    locked: false,
  },
  {
    value: "dots",
    preview: dotPatternPreviews.value["dots"],
    locked: !isProUser.value,
  },
  {
    value: "classy",
    preview: dotPatternPreviews.value["classy"],
    locked: !isProUser.value,
  },
  {
    value: "classy-rounded",
    preview: dotPatternPreviews.value["classy-rounded"],
    locked: !isProUser.value,
  },
  {
    value: "extra-rounded",
    preview: dotPatternPreviews.value["extra-rounded"],
    locked: !isProUser.value,
  },
]);

const hasMorePatterns = computed(() => !isProUser.value);

// Corner Styles
const cornerStyles = computed(() => [
  {
    value: "square",
    preview: cornerSquarePreviews.value["square"],
    locked: false,
  },
  {
    value: "extra-rounded",
    preview: cornerSquarePreviews.value["extra-rounded"],
    locked: false,
  },
  {
    value: "dot",
    preview: cornerSquarePreviews.value["dot"],
    locked: !isProUser.value,
  },
  {
    value: "square-rounded",
    preview: cornerSquarePreviews.value["extra-rounded"],
    locked: !isProUser.value,
  },
]);

const hasMoreCorners = computed(() => !isProUser.value);

// Preset Colors
const presetColors = [
  { value: "#000000", label: "Black" },
  { value: "#dc2626", label: "Red" },
  { value: "#ea580c", label: "Orange" },
  { value: "#16a34a", label: "Green" },
  { value: "#0891b2", label: "Cyan" },
  { value: "#2563eb", label: "Blue" },
  { value: "#7c3aed", label: "Purple" },
  { value: "#db2777", label: "Pink" },
];

// Preset Logos
const presetLogos = [
  { value: "", icon: "i-lucide-x" },
  { value: "facebook", icon: "i-lucide-facebook" },
  { value: "twitter", icon: "i-lucide-twitter" },
  { value: "instagram", icon: "i-lucide-instagram" },
  { value: "youtube", icon: "i-lucide-youtube" },
];

// Frames
const frames = computed(() => [
  {
    value: "none",
    label: "None",
    borderClass: "border-accented",
    locked: false,
  },
  {
    value: "simple",
    label: "Simple",
    borderClass: "border-gray-400 rounded",
    locked: !isProUser.value,
  },
  {
    value: "rounded",
    label: "Rounded",
    borderClass: "border-gray-400 rounded-lg",
    locked: !isProUser.value,
  },
  {
    value: "double",
    label: "Double",
    borderClass: "border-gray-400 border-double",
    locked: !isProUser.value,
  },
  {
    value: "scan-me",
    label: "Scan Me",
    borderClass: "border-gray-400",
    locked: !isProUser.value,
  },
  {
    value: "scan-me-alt",
    label: "Scan Me",
    borderClass: "border-gray-400 rounded",
    locked: !isProUser.value,
  },
]);

const hasMoreFrames = computed(() => !isProUser.value);

// Key to force re-render QR code when config changes
const qrConfigKey = computed(() => {
  return `${config.value.dotsType}-${config.value.cornersSquareType}-${config.value.cornersDotType}-${config.value.foreground}-${config.value.background}-${config.value.logo}`;
});

// Load link data
async function loadLinkData() {
  try {
    const res = await $fetch<{ success: boolean; data: any }>(
      `/api/qr/${route.params.short_code}`,
    );
    linkData.value = res.data;
    if (res.data?.styleConfig) {
      const s = res.data.styleConfig;
      config.value = {
        dotsType: s.dotsType ?? config.value.dotsType,
        cornersSquareType:
          s.cornersSquareType ?? config.value.cornersSquareType,
        cornersDotType: s.cornersDotType ?? config.value.cornersDotType,
        foreground:
          s.foreground ?? s.foregroundColor ?? config.value.foreground,
        background:
          s.background ?? s.backgroundColor ?? config.value.background,
        logo: s.logo ?? config.value.logo,
        frame: s.frame ?? s.frameStyle ?? config.value.frame,
        showBranding: s.showBranding ?? config.value.showBranding,
        useQrColorForCorners:
          s.useQrColorForCorners ?? config.value.useQrColorForCorners,
      };
    }
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to load link data",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

// Actions
function resetToDefault() {
  config.value = {
    dotsType: "rounded",
    cornersSquareType: "square",
    cornersDotType: "square",
    foreground: "#000000",
    background: "#ffffff",
    logo: "",
    frame: "none",
    showBranding: isProUser.value,
    useQrColorForCorners: true,
  };
  toast.add({
    title: "Reset",
    description: "QR code reset to default settings",
    color: "neutral",
  });
}

function applyCustomText() {
  if (customText.value) {
    config.value.logo = "custom-text";
    toast.add({
      title: "Applied",
      description: "Custom text applied to QR code",
      color: "success",
    });
  }
}

async function saveChanges() {
  saving.value = true;
  try {
    await $fetch(`/api/qr/${route.params.short_code}/customize`, {
      method: "PUT",
      body: { styleConfig: config.value },
    });
    toast.add({
      title: "Saved",
      description: "QR code customization saved",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to save changes",
      color: "error",
    });
  } finally {
    saving.value = false;
  }
}

function downloadQR(format: "png" | "svg") {
  toast.add({
    title: "Downloading",
    description: `QR code downloaded as ${format.toUpperCase()}`,
    color: "success",
  });
}

// Load data on mount
onMounted(() => {
  loadLinkData();
});
</script>
