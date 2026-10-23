<template>
  <UDashboardPanel id="qr-create">
    <template #header>
      <UDashboardNavbar title="Create a new QR Code">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right> </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Code Details -->
              <UCard class="bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-lg font-medium text-gray-900">
                        Code details
                      </h2>
                      <p class="text-sm text-gray-500 mt-1">
                        You can create {{ remainingCodes }} more codes this
                        month.
                        <NuxtLink
                          to="/dashboard/upgrade"
                          class="text-primary underline"
                          >Upgrade for more</NuxtLink
                        >
                      </p>
                    </div>
                    <UIcon name="i-lucide-chevron-up" class="text-gray-400" />
                  </div>
                </template>

                <div class="space-y-6">
                  <!-- Destination URL -->
                  <UFormField
                    label="Destination URL"
                    required
                    hint="Enter ↵ to create"
                  >
                    <template #label>
                      <div class="inline-flex items-center justify-between">
                        <span>Destination URL</span>
                      </div>
                    </template>
                    <UInput
                      v-model="form.destinationUrl"
                      placeholder="https://example.com"
                      size="xl"
                      class="w-full"
                      @keyup.enter="createQRCode"
                    />
                  </UFormField>

                  <!-- Title (optional) -->
                  <UFormField label="Title (optional)">
                    <UInput
                      v-model="form.title"
                      placeholder="My QR Code"
                      size="xl"
                      class="w-full"
                    />
                  </UFormField>
                </div>
              </UCard>

              <!-- Advanced Settings -->
              <UCard class="bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-medium text-gray-900">
                      Advanced settings
                    </h2>
                    <UIcon name="i-lucide-chevron-up" class="text-gray-400" />
                  </div>
                </template>

                <div class="space-y-4">
                  <!-- UTM Parameters -->
                  <div
                    class="flex items-center justify-between py-3 border-b border-gray-100"
                  >
                    <div class="flex items-center gap-3">
                      <UIcon
                        name="i-lucide-link"
                        class="text-gray-500 w-5 h-5"
                      />
                      <span class="text-gray-700">UTM parameters</span>
                      <UKbd v-if="!isProUser" class="bg-primary/10 text-primary"
                        >Pro</UKbd
                      >
                    </div>
                    <USwitch v-model="form.useUTM" size="xl"/>
                  </div>

                  <div v-if="form.useUTM" class="pl-8 space-y-3">
                    <UFormField label="UTM Source">
                      <UInput
                        v-model="form.utmSource"
                        placeholder="e.g., newsletter, social"
                        size="xl"
                        class="w-full"
                      />
                    </UFormField>
                    <UFormField label="UTM Medium">
                      <UInput
                        v-model="form.utmMedium"
                        placeholder="e.g., email, qr"
                        size="xl"
                        class="w-full"
                      />
                    </UFormField>
                    <UFormField label="UTM Campaign">
                      <UInput
                        v-model="form.utmCampaign"
                        placeholder="e.g., summer_sale_2024"
                        size="xl"
                        class="w-full"
                      />
                    </UFormField>
                    <p class="text-xs text-gray-500">
                      Add UTMs to track web traffic in analytics tools.
                    </p>
                  </div>

                  <!-- Code expiration -->
                  <div class="flex items-center justify-between py-3">
                    <div class="flex items-center gap-3">
                      <UIcon
                        name="i-lucide-clock"
                        class="text-gray-500 w-5 h-5"
                      />
                      <span class="text-gray-700">Code expiration</span>
                      <UKbd v-if="!isProUser" class="bg-primary/10 text-primary"
                        >Pro</UKbd
                      >
                    </div>
                    <USwitch v-model="form.hasExpiration"  size="xl"/>
                  </div>

                  <div v-if="form.hasExpiration" class="pl-8">
                    <UFormField label="Expires at">
                      <div class="flex gap-3">
                        <UInputDate
                          v-model="form.expiresDate"
                          icon="i-lucide-calendar"
                          class="w-52"
                        />
                        <UInputTime
                          v-model="form.expiresTime"
                          icon="i-lucide-clock"
                          class="w-32"
                        />
                      </div>
                    </UFormField>
                  </div>
                </div>
              </UCard>
            </div>

            <!-- Right: Preview -->
            <div class="lg:col-span-1">
              <div class="sticky top-8 space-y-4">
                <div class="text-sm font-medium text-gray-700">Preview</div>

                <div
                  class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <!-- QR Preview -->
                  <div
                    class="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4"
                  >
                    <QRCodeRender
                      v-if="qrValue"
                      :value="'perlink.to'"
                      :dots-type="qrConfig.dotsType"
                      :corners-square-type="qrConfig.cornersSquareType"
                      :corners-dot-type="qrConfig.cornersDotType"
                      :foreground="qrConfig.foregroundColor"
                      :background="qrConfig.backgroundColor"
                      :size="200"
                      class="w-full h-full"
                    />
                    <div v-else class="text-center text-gray-400">
                      <UIcon
                        name="i-lucide-qr-code"
                        class="w-16 h-16 mx-auto mb-2"
                      />
                      <p class="text-sm">Enter a URL to see preview</p>
                    </div>
                  </div>

                  <!-- Destination URL Preview -->
                  <div v-if="form.destinationUrl" class="text-center">
                    <p class="text-sm text-gray-500 mb-1">
                      Your QR code will link to:
                    </p>
                    <NuxtLink
                      :to="form.destinationUrl"
                      target="_blank"
                      class="text-primary text-sm font-medium hover:underline break-all"
                    >
                      {{ form.destinationUrl }}
                    </NuxtLink>
                  </div>

                  <div class="mt-4 pt-4 border-t border-gray-100">
                    <p class="text-xs text-gray-500 text-center">
                      This code is preview only, so don't copy it just yet. Your
                      code will be generated once you finish creating it.
                    </p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between gap-4">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    size="lg"
                    @click="$router.back()"
                  >
                    Cancel
                  </UButton>
                  <UButton
                    color="primary"
                    size="lg"
                    :loading="isCreating"
                    :disabled="!canCreate"
                    class="flex-1"
                    @click="createQRCode"
                  >
                    <template v-if="isCreating">Creating...</template>
                    <template v-else>Create QR Code</template>
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { User } from "#auth-utils";
import QRCodeRender from "~/components/features/QRCodeRender.vue";
import {
  CalendarDate,
  Time,
  now,
  getLocalTimeZone,
} from "@internationalized/date";

// Meta
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { user: sessionUser } = useUserSession();
const user = sessionUser as Ref<User | null>;

const isProUser = computed(() => {
  return user.value?.plan !== "free";
});

// State
const isCreating = ref(false);

// Form state
const form = ref({
  destinationUrl: "",
  title: "",
  name: "",
  useUTM: false,
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  hasExpiration: false,
  expiresDate: undefined as CalendarDate | undefined,
  expiresTime: new Time(12, 0, 0),
});

// Convert date and time to ISO string for API
const expiresAtISO = computed(() => {
  if (!form.value.expiresDate) return undefined;
  const date = form.value.expiresDate;
  const time = form.value.expiresTime;
  const dateTime = date.toDate(getLocalTimeZone());
  dateTime.setHours(time.hour, time.minute, time.second);
  return dateTime.toISOString();
});

// QR Config (default styling)
const qrConfig = ref({
  dotsType: "rounded",
  cornersSquareType: "square",
  cornersDotType: "square",
  foregroundColor: "#000000",
  backgroundColor: "#ffffff",
});

// Computed
const canCreate = computed(() => {
  return form.value.destinationUrl && !isCreating.value;
});

const remainingCodes = computed(() => {
  // TODO: Fetch from user plan
  return 5;
});

const qrValue = computed(() => {
  if (!form.value.destinationUrl) return "";

  let url = form.value.destinationUrl;
  if (
    form.value.useUTM &&
    (form.value.utmSource || form.value.utmMedium || form.value.utmCampaign)
  ) {
    const params = new URLSearchParams();
    if (form.value.utmSource) params.set("utm_source", form.value.utmSource);
    if (form.value.utmMedium) params.set("utm_medium", form.value.utmMedium);
    if (form.value.utmCampaign)
      params.set("utm_campaign", form.value.utmCampaign);
    url += (url.includes("?") ? "&" : "?") + params.toString();
  }

  return url;
});

// Methods
async function createQRCode() {
  if (!canCreate.value) return;

  isCreating.value = true;

  try {
    const { data } = await $fetch("/api/qr", {
      method: "POST",
      body: {
        destinationUrl: form.value.destinationUrl,
        title: form.value.title,
        name: form.value.name,
        styleConfig: {
          dotsType: qrConfig.value.dotsType,
          cornersSquareType: qrConfig.value.cornersSquareType,
          cornersDotType: qrConfig.value.cornersDotType,
          foregroundColor: qrConfig.value.foregroundColor,
          backgroundColor: qrConfig.value.backgroundColor,
          useGradient: false,
          frameStyle: "none",
          showBranding: true,
        },
        expiresAt: form.value.hasExpiration ? expiresAtISO.value : undefined,
      },
    });

    if (data) {
      navigateTo(`/dashboard/qr/${data.shortCode}`);
    }
  } catch (error: any) {
    console.error("Failed to create QR code:", error);
    // TODO: Show error toast
  } finally {
    isCreating.value = false;
  }
}
</script>
