<template>
  <!-- Step 1: Slug input (shown when no slug provided) -->
  <div v-if="!activeSlug" class="space-y-6">
    <div class="text-left space-y-2">
      <h1 class="text-2xl md:text-3xl font-bold text-highlighted">
        Claim your link
      </h1>
      <p class="text-muted">Enter the name you want for your perlink</p>
    </div>

    <FeaturesSlugInput
      v-model="slugInput"
      v-model:domain="selectedDomain"
      :hide-domain-switch="!allowShortLinks"
      placeholder="your-name"
      confirm-text="Continue"
      @confirm="onSlugConfirmed"
    />
  </div>

  <!-- Step 2: Type selection cards -->
  <template v-else>
    <div class="text-left space-y-2">
      <h1 class="text-2xl md:text-3xl font-bold text-highlighted">
        {{ selectedDomain === 's.perlink.to' ? 'Create a short link' : 'Create a bio page' }}
      </h1>
      <p class="text-muted">
        {{ selectedDomain === 's.perlink.to' ? 'Shorten your URL at' : 'Your bio page will be at' }}
        <strong class="text-primary">{{ selectedDomain }}/{{ activeSlug }}</strong>
        <button
          class="ml-2 text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 underline"
          @click="activeSlug = ''"
        >
          change
        </button>
      </p>
    </div>

    <!-- Selection Cards -->
    <div class="grid gap-4">
      <!-- Bio Link Card -->
      <UCard
        v-if="selectedDomain === 'perlink.to'"
        variant="solid"
        class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl hover:border-secondary/50 transition-colors"
      >
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-highlighted">Bio Link</h3>
            <p class="text-sm text-muted mt-1">
              Create a personal profile page with all your links in one place
            </p>
            <div class="mt-3 text-xs text-primary mb-4">
              perlink.to/{{ activeSlug }} → Your bio page
            </div>
            <UButton
              size="xl"
              color="primary"
              variant="solid"
              block
              :loading="bioLoading"
              loading-auto
              @click="$emit('createBio')"
            >
              Create Bio Page
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Short Link Card -->
      <UCard
        v-if="selectedDomain === 's.perlink.to'"
        variant="solid"
        class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl hover:border-secondary/50 transition-colors"
      >
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-highlighted">Short Link</h3>
            <p class="text-sm text-muted mt-1 mb-3">
              Transform a long URL into a short, memorable link
            </p>

            <!-- URL Input -->
            <UFormField :error="urlError">
              <UInput
                :model-value="url"
                placeholder="https://example.com/your-long-url"
                size="xl"
                class="w-full"
                @update:model-value="$emit('update:url', $event)"
                @keyup.enter="$emit('createShort')"
              />
            </UFormField>

            <UButton
              size="xl"
              color="secondary"
              variant="solid"
              block
              class="mt-4"
              :loading="shortLoading"
              loading-auto
              :disabled="!url"
              @click="$emit('createShort')"
            >
              Create Short Link
            </UButton>

            <div class="mt-2 text-xs text-secondary">
              s.perlink.to/{{ activeSlug }} → Your destination
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </template>
</template>

<script setup lang="ts">
const props = defineProps<{
  slug: string;
  url: string;
  urlError?: string;
  bioLoading?: boolean;
  shortLoading?: boolean;
  /** Short links are hidden from the product for now; set true to offer them again */
  allowShortLinks?: boolean;
}>();

const emit = defineEmits<{
  createBio: [];
  createShort: [];
  "update:url": [value: string];
  "update:slug": [value: string];
}>();

const router = useRouter();
const route = useRoute();
const slugInput = ref("");
const selectedDomain = ref(
  (props.allowShortLinks && (route.query.domain as string)) || "perlink.to"
);
const activeSlug = ref(props.slug);

watch(() => props.slug, (val) => {
  activeSlug.value = val;
});

watch(activeSlug, (val) => {
  emit("update:slug", val);
});

function onSlugConfirmed(val: string) {
  activeSlug.value = val;
  router.replace({ query: { ...route.query, input: val, domain: selectedDomain.value } });
}
</script>
