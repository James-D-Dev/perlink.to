<template>
  <UDashboardPanel id="link-detail" class="bg-background">
    <template #header>
      <UDashboardNavbar title="Link Detail">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            to="/dashboard/create"
            color="primary"
            icon="i-lucide-plus"
            label="Create Short Link"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="container max-w-6xl mx-auto flex flex-col space-y-6">
        <div v-if="!data?.success">
          <div class="p-4 md:p-8 space-y-6">
            <div class="space-y-1">
              <h1 class="text-2xl font-bold">Link not found</h1>
              <p class="text-muted-foreground">
                The link you are looking for does not exist.
              </p>
            </div>
          </div>
        </div>

        <template v-else>
          <!-- Link Header Card -->
          <div class="sm:bg-white rounded-2xl sm:border border-gray-200">
            <div class="p-0 sm:p-6 space-y-6">
              <!-- Title Row -->
              <div
                class="flex md:flex-row flex-col gap-4 items-start justify-between"
              >
                <div class="space-y-2">
                  <div class="relative group">
                    <div v-if="!isEditingTitle" class="flex items-center gap-2">
                      <h1 class="text-2xl font-bold" @click="startEditingTitle">
                        {{ linkTitle || "Untitled" }}
                      </h1>
                      <UButton
                        variant="ghost"
                        icon="i-mingcute-edit-line"
                        size="xs"
                        color="neutral"
                        @click="startEditingTitle"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div v-else class="flex items-center gap-2">
                      <input
                        ref="titleInput"
                        v-model="editedTitle"
                        class="text-2xl font-bold bg-transparent border-b-2 border-perlink-blue focus:outline-none focus:border-perlink-cyan w-full min-w-[200px]"
                        @keydown.enter="updateTitle"
                        @blur="updateTitle"
                      />
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-4 text-sm text-muted-foreground"
                  >
                    <div class="flex items-center gap-1.5">
                      <UIcon name="i-mingcute-calendar-line" class="w-4 h-4" />
                      <span>{{ formatDate(link?.created_at || "") }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <UIcon name="i-mingcute-tag-line" class="w-4 h-4" />
                      <span
                        v-if="link && link.tags && link.tags.length > 0"
                        class="text-xs"
                      >
                        <span
                          v-for="tag in link.tags"
                          :key="tag"
                          class="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 mr-1"
                        >
                          {{ tag }}
                        </span>
                      </span>
                      <span v-else>No tags</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <UButton
                    variant="outline"
                    color="neutral"
                    size="xl"
                    icon="i-mingcute-qrcode-2-line"
                  >
                    QR Code
                  </UButton>

                  <UButton
                    variant="outline"
                    color="neutral"
                    size="xl"
                    icon="i-mingcute-share-forward-line"
                    @click="showShareModal = true"
                  >
                    Share
                  </UButton>
                  <UButton
                    variant="subtle"
                    size="xl"
                    color="error"
                    icon="i-mingcute-delete-2-line"
                    @click="showDeleteModal = true"
                  />
                </div>
              </div>

              <div class="flex flex-col md:flex-row gap-4">
                <!-- URL Row -->
                <div
                  class="flex-1 flex items-center gap-3 p-3 bg-perlink-cyan/5 rounded-xl"
                >
                  <div
                    class="size-9 sm:size-10 rounded-lg overflow-hidden shadow-perlink-cyan/20 bg-perlink-cyan/20 border border-perlink-cyan/20 shadow-sm flex items-center justify-center"
                  >
                    <img
                      v-if="img"
                      :src="img"
                      alt=""
                      class="w-full h-full rounded"
                    />
                    <UIcon
                      v-else
                      name="i-mingcute-link-2-line"
                      class="w-5 h-5 text-perlink-blue"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <a
                      :href="shortLink"
                      target="_blank"
                      class="text-sm sm:text-base font-semibold text-perlink-blue hover:underline flex items-center gap-1"
                    >
                      {{ shortLink }}
                      <UIcon
                        name="i-mingcute-external-link-line"
                        class="w-3.5 h-3.5"
                      />
                    </a>
                    <div
                      class="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground"
                    >
                      <UIcon
                        name="i-mingcute-arrow-right-line"
                        class="w-3.5 h-3.5"
                      />
                      <a
                        :href="originLink"
                        target="_blank"
                        class="hover:underline truncate"
                      >
                        {{ originLink }}
                      </a>
                    </div>
                  </div>
                  <UButton
                    variant="subtle"
                    size="xl"
                    color="primary"
                    icon="i-mingcute-copy-2-line"
                    @click="copyLink"
                  >
                  </UButton>
                </div>

                <!-- Stats Row -->
                <div
                  class="flex flex-wrap gap-3 border border-gray-200 rounded-xl"
                >
                  <div class="p-3 rounded-xl">
                    <div class="flex items-center gap-2 mb-1">
                      <div
                        class="w-10 h-10 bg-perlink-cyan/10 flex items-center justify-center rounded-xl"
                      >
                        <UIcon
                          name="i-mingcute-cursor-3-line"
                          class="size-6 text-perlink-cyan"
                        />
                      </div>
                      <div>
                        <span class="text-xs font-medium text-muted-foreground"
                          >Total Clicks</span
                        >

                        <div class="flex items-baseline gap-2">
                          <span class="text-base font-bold">{{
                            stats.totalClicks.toLocaleString()
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-3 rounded-xl">
                    <div class="flex items-center gap-2 mb-1">
                      <div
                        class="w-10 h-10 bg-perlink-cyan/10 flex items-center justify-center rounded-xl"
                      >
                        <UIcon
                          name="i-mingcute-user-2-line"
                          class="size-6 text-perlink-cyan"
                        />
                      </div>

                      <div>
                        <span class="text-xs font-medium text-muted-foreground"
                          >Unique Clicks</span
                        >
                        <div class="flex items-baseline gap-2">
                          <span class="text-base font-bold">{{
                            stats.uniqueClicks.toLocaleString()
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="p-3 rounded-xl">
                    <div class="flex items-center gap-2 mb-1">
                      <div
                        class="w-10 h-10 bg-perlink-cyan/10 flex items-center justify-center rounded-xl"
                      >
                        <UIcon
                          name="i-mingcute-time-line"
                          class="size-6 text-perlink-blue"
                        />
                      </div>
                      <div>
                        <span class="text-xs font-medium text-muted-foreground"
                          >Last Click</span
                        >

                        <div class="text-sm font-medium">
                          {{ lastClickText }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <UTabs
            color="primary"
            variant="link"
            :content="false"
            :items="tabs"
            :model-value="activeTab"
            :ui="{ indicator: 'h-[2px]' }"
            @update:model-value="activeTab = $event as string"
            class="w-full border-b border-gray-200"
          />

          <!-- QR Code Tab -->
          <div v-if="activeTab === 'qr'" class="">
            <div class="grid md:grid-cols-2 gap-8">
              <!-- QR Preview -->
              <div class="space-y-4">
                <div
                  class="bg-white rounded-xl p-8 border border-gray-200 flex items-center justify-center"
                >
                  <div class="w-[280px] h-[280px]">
                    <ClientOnly>
                      <QRCodeRender
                        :key="`${qrConfig.foreground}-${qrConfig.background}-${qrConfig.logoSize}`"
                        :value="shortLink"
                        :image="img"
                        :foreground="qrConfig.foreground"
                        :background="qrConfig.background"
                        :logo-size="qrConfig.logoSize / 100"
                      />
                    </ClientOnly>
                  </div>
                </div>
                <div class="flex gap-3 justify-center">
                  <UButton
                    variant="outline"
                    size="sm"
                    icon="i-mingcute-download-2-line"
                    @click="downloadQR('png')"
                  >
                    Download PNG
                  </UButton>
                  <UButton
                    variant="outline"
                    size="sm"
                    icon="i-mingcute-download-2-line"
                    @click="downloadQR('svg')"
                  >
                    Download SVG
                  </UButton>
                </div>
              </div>

              <!-- QR Customization -->
              <div
                class="space-y-6 bg-white rounded-xl p-4 sm:p-6 border border-gray-200"
              >
                <h3 class="text-lg font-semibold">Customize QR Code</h3>

                <div class="grid grid-cols-2 gap-2">
                  <!-- Foreground Color -->
                  <div class="space-y-3">
                    <label class="text-sm font-medium">Foreground color</label>
                    <div class="flex items-center gap-2 sm:gap-3">
                      <UPopover>
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          class="p-0 rounded-full overflow-hidden shrink-0"
                        >
                          <span
                            class="size-8 rounded-full border-2 border-gray-300"
                            :style="{ backgroundColor: qrConfig.foreground }"
                          />
                        </UButton>
                        <template #content>
                          <UColorPicker
                            v-model="qrConfig.foreground"
                            class="p-2"
                          />
                        </template>
                      </UPopover>
                      <UInput
                        v-model="qrConfig.foreground"
                        size="sm"
                        class="w-32 font-mono"
                      />
                    </div>
                  </div>

                  <!-- Background Color -->
                  <div class="space-y-3">
                    <label class="text-sm font-medium">Background color</label>
                    <div class="flex items-center gap-2 sm:gap-3">
                      <UPopover>
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          class="p-0 rounded-full overflow-hidden shrink-0"
                        >
                          <span
                            class="size-8 rounded-full border-2 border-gray-300"
                            :style="{ backgroundColor: qrConfig.background }"
                          />
                        </UButton>
                        <template #content>
                          <UColorPicker
                            v-model="qrConfig.background"
                            class="p-2"
                          />
                        </template>
                      </UPopover>
                      <UInput
                        v-model="qrConfig.background"
                        size="sm"
                        class="w-32 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <!-- Logo -->
                <div class="space-y-3">
                  <label class="text-sm font-medium">Logo</label>
                  <div
                    class="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50"
                  >
                    <div
                      class="w-8 h-8 rounded bg-perlink-blue/10 flex items-center justify-center"
                    >
                      <UIcon
                        name="i-mingcute-link-2-line"
                        class="w-4 h-4 text-perlink-blue"
                      />
                    </div>
                    <span class="text-sm font-medium flex-1">Perlink Logo</span>
                    <UIcon
                      name="i-mingcute-arrow-down-line"
                      class="w-4 h-4 text-muted-foreground"
                    />
                  </div>
                </div>

                <!-- Logo Size Slider -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium">Logo size</label>
                    <span class="text-sm text-muted-foreground"
                      >{{ qrConfig.logoSize }}%</span
                    >
                  </div>
                  <USlider v-model="qrConfig.logoSize" :min="10" :max="50" />
                </div>
              </div>
            </div>
          </div>

          <!-- Password Tab -->
          <div v-if="activeTab === 'password'" class="">
            <LinkPasswordProtection v-model="passwordConfig" />
          </div>

          <!-- Analytics Tab -->
          <div v-else-if="activeTab === 'analytics'" class="">
            <LinkAnalytics v-if="link?.id" :link-id="link.id" />
          </div>

          <!-- Settings Tab -->
          <div v-else-if="activeTab === 'settings'" class="p-6">
            <div class="max-w-xl space-y-6">
              <div
                class="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl"
              >
                <div>
                  <h4 class="font-medium">Link Visibility</h4>
                  <p class="text-sm text-muted-foreground">
                    Make this link public or private
                  </p>
                </div>
                <USwitch
                  v-model="isPublicBool"
                  @update:model-value="updateVisibility"
                />
              </div>
            </div>
          </div>

          <!-- Tips Card -->
          <div
            class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200/60 flex items-start gap-3"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-mingcute-light-line"
                  class="w-5 h-5 text-amber-500 shrink-0 mt-0.5"
                />
                <h4 class="font-medium text-sm text-amber-900">Tips</h4>
              </div>
              <p class="text-sm text-amber-800/70">
                Add tags and a custom alias to make your links easier to manage
                and remember.
              </p>
            </div>
            <UButton
              variant="link"
              size="sm"
              color="primary"
              class="text-perlink-blue"
            >
              Learn more
            </UButton>
          </div>
        </template>
      </div>

      <LinkReadyModal
        v-model:open="showSuccessModal"
        :short-code="shortCode"
        @view-details="closeModal"
      />
      <LinkShareModal
        v-model:open="showShareModal"
        title="Share your short link"
        :short-code="shortCode"
        @view-details="closeShareModal"
      />
      <DeleteLinkModal v-model:open="showDeleteModal" :short-code="shortCode" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import LinkReadyModal from "~/components/modals/LinkReadyModal.vue";
import LinkShareModal from "~/components/modals/LinkShareModal.vue";
import type { ApiLinkResponse } from "../../../../types/response";
import DeleteLinkModal from "~/components/modals/DeleteLinkModal.vue";
import QRCodeRender from "~/components/features/QRCodeRender.vue";
import LinkPasswordProtection from "~/components/features/LinkPasswordProtection.vue";
import type { PasswordConfig } from "~/components/features/LinkPasswordProtection.vue";
import LinkAnalytics from "~/components/features/LinkAnalytics.vue";
import { getImageUrl } from "#imports";
import type { AcceptableValue, TabsItem } from "@nuxt/ui";
import { format } from "date-fns";

definePageMeta({
  layout: "admin",
  middleware: "auth",
  ssr: false,
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const shortCode = computed(() => route.params.short_code as string);
const showSuccessModal = ref(false);
const showShareModal = ref(false);
const showDeleteModal = ref(false);
const isPublic = ref(0);
const isUpdating = ref(false);
const isEditingTitle = ref(false);
const editedTitle = ref("");
const linkTitle = ref("");
const titleInput = ref<HTMLInputElement | null>(null);

const visibilityOptions = [
  { value: 1, label: "Active" },
  { value: 0, label: "Hidden" },
];

// Tabs
const tabs: TabsItem[] = [
  { label: "QR Code", value: "qr" },
  { label: "Password", value: "password" },
  { label: "Analytics", value: "analytics" },
  { label: "Settings", value: "settings" },
];
const activeTab = ref("qr");

// Stats from analytics API
const stats = ref({
  totalClicks: 0,
  uniqueClicks: 0,
});
const lastClickText = ref("-");

const fetchStats = async () => {
  const linkId = link.value?.id;
  if (!linkId) return;
  try {
    const res = await $fetch<any>(`/api/analytics/${linkId}/overview?period=all`);
    if (res.success && res.data) {
      stats.value.totalClicks = res.data.total_clicks || 0;
      stats.value.uniqueClicks = res.data.unique_clicks || 0;
      if (res.data.last_click_at) {
        const diff = Date.now() - new Date(res.data.last_click_at).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) lastClickText.value = "Just now";
        else if (minutes < 60) lastClickText.value = `${minutes} min ago`;
        else if (minutes < 1440) lastClickText.value = `${Math.floor(minutes / 60)}h ago`;
        else lastClickText.value = `${Math.floor(minutes / 1440)}d ago`;
      }
    }
  } catch (e) {
    // Silent fail
  }
};

onMounted(() => fetchStats());

// Password Protection config — persisted to links.meta.password
const passwordConfigDefaults: PasswordConfig = {
  enabled: false,
  password: '',
  message: 'Please enter the password to continue.',
};

const passwordConfig = ref<PasswordConfig>({ ...passwordConfigDefaults });
const isSavingPassword = ref(false);
let savePasswordTimer: ReturnType<typeof setTimeout> | null = null;

const savePasswordConfig = async () => {
  if (isSavingPassword.value) return;
  isSavingPassword.value = true;
  try {
    await $fetch<ApiLinkResponse>(`/api/links/${shortCode.value}`, {
      method: "PUT",
      body: {
        password: {
          enabled: passwordConfig.value.enabled,
          password: passwordConfig.value.password,
          message: passwordConfig.value.message,
        },
      },
    });
    toast.add({
      title: "Saved",
      description: "Password settings updated",
      color: "success",
    });
  } catch (e: any) {
    console.error("Failed to save password config", e);
    toast.add({
      title: "Error",
      description: "Failed to save password settings",
      color: "error",
    });
  } finally {
    isSavingPassword.value = false;
  }
};

let passwordConfigInitialized = false;
watch(
  passwordConfig,
  () => {
    if (!passwordConfigInitialized) return;
    if (savePasswordTimer) clearTimeout(savePasswordTimer);
    savePasswordTimer = setTimeout(savePasswordConfig, 800);
  },
  { deep: true },
);

// QR Customization config — persisted to links.meta.qr
interface QrConfig {
  foreground: string;
  background: string;
  logoSize: number;
}

const qrConfigDefaults: QrConfig = {
  foreground: "#111827",
  background: "#FFFFFF",
  logoSize: 30,
};

const qrConfig = reactive<QrConfig>({ ...qrConfigDefaults });
const isSavingQr = ref(false);
let saveQrTimer: ReturnType<typeof setTimeout> | null = null;

const saveQrConfig = async () => {
  if (isSavingQr.value) return;
  isSavingQr.value = true;
  try {
    await $fetch<ApiLinkResponse>(`/api/links/${shortCode.value}`, {
      method: "PUT",
      body: {
        qr: {
          foreground: qrConfig.foreground,
          background: qrConfig.background,
          logoSize: qrConfig.logoSize,
        },
      },
    });
  } catch (e: any) {
    console.error("Failed to save QR config", e);
  } finally {
    isSavingQr.value = false;
  }
};

// Debounced auto-save when qrConfig changes
let qrConfigInitialized = false;
watch(
  () => ({ ...qrConfig }),
  () => {
    if (!qrConfigInitialized) return;
    if (saveQrTimer) clearTimeout(saveQrTimer);
    saveQrTimer = setTimeout(saveQrConfig, 800);
  },
  { deep: true },
);

const { data, error } = await useFetch<ApiLinkResponse>(
  `/api/links/${shortCode.value}`,
);

// Set initial visibility state
if (data.value?.success && data.value.data) {
  isPublic.value = Number(data.value.data.is_public || 0);
  linkTitle.value = data.value.data.meta?.title || "";
  editedTitle.value = linkTitle.value;

  // Load saved QR config from meta.qr
  const savedQr = data.value.data.meta?.qr as QrConfig | undefined;
  if (savedQr) {
    qrConfig.foreground = savedQr.foreground || qrConfigDefaults.foreground;
    qrConfig.background = savedQr.background || qrConfigDefaults.background;
    qrConfig.logoSize = savedQr.logoSize ?? qrConfigDefaults.logoSize;
  }

  // Load saved password config from meta.password
  const savedPassword = data.value.data.meta?.password as PasswordConfig | undefined;
  if (savedPassword) {
    passwordConfig.value = {
      enabled: savedPassword.enabled ?? false,
      password: savedPassword.password || '',
      message: savedPassword.message || passwordConfigDefaults.message,
    };
  }

  nextTick(() => {
    qrConfigInitialized = true;
    passwordConfigInitialized = true;
  });
}

const shortLink = computed(() => {
  if (data.value && data.value.data)
    return `https://s.perlink.to/${shortCode.value}`;
  return "";
});
const originLink = computed(() => {
  if (data.value && data.value.data) return data.value.data.content;
  return "";
});
const img = computed(() => {
  return getImageUrl(data.value!.data!.meta!.image);
});

const link = computed(() => {
  return data.value!.data;
});

// Computed boolean for USwitch
const isPublicBool = computed({
  get: () => Boolean(isPublic.value),
  set: (val) => {
    isPublic.value = val ? 1 : 0;
  },
});

// Format helpers
const formatDate = (date: string) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy h:mm a");
};

const formatShortDate = (date: string) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy");
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shortLink.value);
    toast.add({
      title: "Copied to clipboard",
      description: shortLink.value,
    });
  } catch (error) {
    toast.add({
      title: "Failed to copy",
      description: "Please try again",
      color: "error",
    });
  }
};

// Check if this is a newly created link
onMounted(() => {
  if (route.query.new === "true") {
    showSuccessModal.value = true;
    // Remove the 'new' query parameter without page reload
    router.replace({ query: {} });
  }
});

const closeModal = () => {
  showSuccessModal.value = false;
};
const closeShareModal = () => {
  showShareModal.value = false;
};

const startEditingTitle = () => {
  isEditingTitle.value = true;
  editedTitle.value = linkTitle.value;
  // Focus the input after the DOM updates
  nextTick(() => {
    if (titleInput.value) {
      titleInput.value.focus();
    }
  });
};

const updateTitle = async () => {
  if (editedTitle.value.trim() === "") {
    // Revert to original title if empty
    editedTitle.value = linkTitle.value;
    isEditingTitle.value = false;
    return;
  }

  if (editedTitle.value === linkTitle.value) {
    // No changes, just exit edit mode
    isEditingTitle.value = false;
    return;
  }

  isUpdating.value = true;
  try {
    const res = await $fetch<ApiLinkResponse>(`/api/links/${shortCode.value}`, {
      method: "PUT",
      body: {
        title: editedTitle.value.trim(),
      },
    });

    if (res.success) {
      linkTitle.value = editedTitle.value.trim();
      toast.add({
        title: "Success",
        description: "Link title updated",
        color: "success",
      });
    } else {
      throw new Error(res.message || "Failed to update title");
    }
  } catch (error: any) {
    // Revert to original title on error
    editedTitle.value = linkTitle.value;
    toast.add({
      title: "Error",
      description: error.message || "Failed to update link title",
      color: "error",
    });
  } finally {
    isUpdating.value = false;
    isEditingTitle.value = false;
  }
};

const updateVisibility = async (value: boolean) => {
  try {
    isUpdating.value = true;
    const res = await $fetch<ApiLinkResponse>(`/api/links/${shortCode.value}`, {
      method: "PUT",
      body: {
        is_public: value,
      },
    });

    if (!res.success) {
      toast.add({
        title: "Error",
        description: res.message || "Failed to update visibility",
        color: "error",
      });
      // Revert value on error
      isPublic.value = Number(!value);
      return;
    }

    toast.add({
      title: "Success",
      description: `Link is now ${value ? "public" : "private"}`,
      color: "success",
    });
  } catch (error) {
    console.error("Error updating visibility:", error);
    toast.add({
      title: "Error",
      description: "Failed to update visibility",
      color: "error",
    });
    // Revert value on error
    isPublic.value = value ? 0 : 1;
  } finally {
    isUpdating.value = false;
  }
};

// QR Download helpers
const downloadQR = (format: "png" | "svg") => {
  toast.add({
    title: "Download started",
    description: `QR Code will be downloaded as ${format.toUpperCase()}`,
    color: "success",
  });
};
</script>
