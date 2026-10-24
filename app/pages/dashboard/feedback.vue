<template>
  <UDashboardPanel id="admin-feedback">
    <template #header>
      <UDashboardNavbar :title="t('dashboard.feedback.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="max-w-xl w-full mx-auto py-8 px-4">
        <h1 class="text-2xl font-bold text-highlighted dark:text-white mb-6">{{ t('dashboard.feedback.title') }}</h1>

        <!-- Feedback Form -->
        <UCard class="mb-6">
          <template #header>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-message-square"
                  class="w-5 h-5 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-highlighted dark:text-white">
                  {{ t('dashboard.feedback.formHeading') }}
                </h2>
                <p class="text-sm text-muted dark:text-neutral-400">{{ t('dashboard.feedback.formIntro') }}</p>
              </div>
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="submitFeedback">
            <UFormField :label="t('dashboard.feedback.type')" required>
              <USelect
                v-model="form.type"
                :items="feedbackTypes"
                :placeholder="t('dashboard.feedback.typePlaceholder')"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="t('dashboard.feedback.subject')" required>
              <UInput
                v-model="form.subject"
                :placeholder="t('dashboard.feedback.subjectPlaceholder')"
                class="w-full"
                required
              />
            </UFormField>

            <UFormField :label="t('dashboard.feedback.message')" required>
              <UTextarea
                v-model="form.message"
                :placeholder="t('dashboard.feedback.messagePlaceholder')"
                class="w-full"
                :rows="5"
                required
              />
            </UFormField>

            <UFormField :label="t('dashboard.feedback.rating')">
              <div class="flex items-center gap-2">
                <UButton
                  v-for="star in [1, 2, 3, 4, 5]"
                  :key="star"
                  variant="ghost"
                  color="neutral"
                  size="lg"
                  :class="
                    form.rating && star <= form.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  "
                  @click="form.rating = star"
                >
                  <UIcon name="i-lucide-star" class="w-6 h-6" />
                </UButton>
                <span v-if="form.rating" class="ml-2 text-sm text-muted dark:text-neutral-300">
                  {{ t('dashboard.feedback.ratingValue', { rating: form.rating }) }}
                </span>
              </div>
            </UFormField>

            <div class="flex items-center justify-end gap-3 pt-4">
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                @click="resetForm"
              >
                {{ t('dashboard.feedback.clear') }}
              </UButton>
              <UButton
                type="submit"
                color="primary"
                :loading="submitting"
                :disabled="!isFormValid"
              >
                <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
                {{ t('dashboard.feedback.submit') }}
              </UButton>
            </div>
          </form>
        </UCard>

        <!-- My Feedback History -->
        <UCard v-if="feedbackHistory.length > 0">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg bg-elevated dark:bg-white/[0.06] flex items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-history"
                    class="w-5 h-5 text-muted dark:text-neutral-300"
                  />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-highlighted dark:text-white">
                    {{ t('dashboard.feedback.historyHeading') }}
                  </h2>
                  <p class="text-sm text-muted dark:text-neutral-400">
                    {{ t('dashboard.feedback.historyIntro') }}
                  </p>
                </div>
              </div>
              <UBadge color="primary" variant="soft">
                {{ t('dashboard.feedback.submittedCount', { n: feedbackHistory.length }) }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="item in feedbackHistory"
              :key="item.id"
              class="border border-muted dark:border-white/5 rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <UBadge
                    :color="getTypeColor(item.type)"
                    variant="soft"
                    size="sm"
                    class="mb-2"
                  >
                    {{ formatType(item.type) }}
                  </UBadge>
                  <h3 class="font-medium text-highlighted dark:text-white">{{ item.subject }}</h3>
                </div>
                <UBadge
                  :color="getStatusColor(item.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ formatStatus(item.status) }}
                </UBadge>
              </div>

              <p class="text-sm text-muted dark:text-neutral-300 mb-3 line-clamp-2">
                {{ item.message }}
              </p>

              <div
                class="flex items-center justify-between text-xs text-muted dark:text-neutral-400"
              >
                <div class="flex items-center gap-3">
                  <span
                    v-if="item.rating"
                    class="flex items-center gap-1 text-yellow-500"
                  >
                    <UIcon name="i-lucide-star" class="w-3 h-3" />
                    {{ item.rating }}/5
                  </span>
                  <span>{{ formatDate(item.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
});

const toast = useToast();
const { t, te, locale } = useI18n();

const form = ref({
  type: "general",
  subject: "",
  message: "",
  rating: null as number | null,
});

const submitting = ref(false);
const feedbackHistory = ref<any[]>([]);
const loading = ref(false);

const feedbackTypes = computed(() =>
  ["general", "bug", "feature", "improvement", "other"].map((value) => ({
    value,
    label: t(`dashboard.feedback.types.${value}`),
  })),
);

const isFormValid = computed(() => {
  return form.value.type && form.value.subject && form.value.message;
});

function resetForm() {
  form.value = {
    type: "general",
    subject: "",
    message: "",
    rating: null,
  };
}

function getTypeColor(
  type: string,
):
  | "neutral"
  | "error"
  | "primary"
  | "warning"
  | "secondary"
  | "success"
  | "info"
  | undefined {
  const colors: Record<
    string,
    | "neutral"
    | "error"
    | "primary"
    | "warning"
    | "secondary"
    | "success"
    | "info"
  > = {
    general: "neutral",
    bug: "error",
    feature: "primary",
    improvement: "warning",
    other: "secondary",
  };
  return colors[type] || "neutral";
}

function formatType(type: string) {
  const key = `dashboard.feedback.typeBadges.${type}`;
  return te(key) ? t(key) : type;
}

function formatStatus(status: string) {
  const key = `dashboard.feedback.statuses.${status}`;
  return te(key) ? t(key) : status;
}

function getStatusColor(
  status: string,
):
  | "neutral"
  | "error"
  | "primary"
  | "warning"
  | "secondary"
  | "success"
  | "info"
  | undefined {
  const colors: Record<
    string,
    | "neutral"
    | "error"
    | "primary"
    | "warning"
    | "secondary"
    | "success"
    | "info"
  > = {
    pending: "warning",
    reviewing: "primary",
    resolved: "success",
    closed: "neutral",
  };
  return colors[status] || "neutral";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(locale.value === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function submitFeedback() {
  if (!isFormValid.value) return;

  submitting.value = true;
  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
      data?: any;
    }>("/api/feedback", {
      method: "POST",
      body: {
        type: form.value.type,
        subject: form.value.subject,
        message: form.value.message,
        rating: form.value.rating,
      },
    });

    if (response.success) {
      toast.add({
        title: t("dashboard.feedback.submitted"),
        description: t("dashboard.feedback.submittedText"),
        color: "success",
      });
      resetForm();
      await loadFeedbackHistory();
    } else {
      toast.add({
        title: t("dashboard.feedback.submitFailed"),
        description: response.message || t("dashboard.feedback.tryAgain"),
        color: "error",
      });
    }
  } catch (error: any) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: error.message || t("dashboard.feedback.submitError"),
      color: "error",
    });
  } finally {
    submitting.value = false;
  }
}

async function loadFeedbackHistory() {
  loading.value = true;
  try {
    const response = await $fetch<{
      success: boolean;
      data: any[];
    }>("/api/feedback");
    if (response.success) {
      feedbackHistory.value = response.data || [];
    }
  } catch (error) {
    console.error("Failed to load feedback history:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadFeedbackHistory();
});
</script>
