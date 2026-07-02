<template>
  <div
    class="relative w-full flex gap-0.5 md:gap-1 border border-perlink-cyan/30 rounded-full p-1 md:p-2 bg-white/80 focus:ring-2 focus:ring-perlink-cyan focus:outline-none hover:ring-2 hover:ring-perlink-cyan hover:outline-none shadow-lg md:shadow-xl shadow-perlink-cyan/20"
  >
    <UDropdownMenu
      :items="domainItems"
      :modal="false"
      :content="{ align: 'start', side: 'bottom', sideOffset: 8 }"
      class="flex items-center pl-2 md:pl-3"
      size="md"
    >
      <button
        type="button"
        class="flex items-center gap-0.5 md:gap-1 text-sm md:text-xl font-medium text-perlink-blue hover:text-perlink-cyan transition-colors focus:outline-none whitespace-nowrap"
      >
        <UIcon name="i-lucide-chevron-down" class="size-4 md:size-5 mt-0.5 opacity-60 flex-shrink-0" />
        <span class="hidden sm:inline">{{ selectedDomain }}</span><span class="sm:hidden">{{ selectedDomain.split('.')[0] }}</span>/
      </button>
    </UDropdownMenu>
    <div class="relative flex-1 min-w-0">
      <input
        type="text"
        v-model="inputValue"
        @keyup.enter="handleConfirm"
        :placeholder="$slots['placeholder-overlay'] ? '' : placeholder"
        class="text-sm md:text-xl text-perlink-blue/80 font-medium flex-1 focus:outline-none h-full w-full bg-transparent px-1"
      />
      <div
        v-if="$slots['placeholder-overlay'] && !inputValue"
        class="absolute left-0 text-sm md:text-xl text-perlink-blue/80 inset-y-0 flex items-center pointer-events-none px-1"
      >
        <slot name="placeholder-overlay" />
      </div>
    </div>

    <UButton
    color="primary"
     @click="handleConfirm"
      class="py-3 md:py-3 text-xs md:text-base px-3 md:px-4 flex-shrink-0 rounded-full"
       :disabled="checking"
    >
      <span>{{ checking ? '...' : 'Claim your link' }}</span>
    </UButton>

    <!-- <ButtonInteractiveHoverButton
      @click="handleConfirm"
      :text="checking ? '...' : 'Claim your link'"
      :disabled="checking"
     
    /> -->
  </div>
  <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    domain?: string;
    placeholder?: string;
    confirmText?: string;
  }>(),
  {
    placeholder: "your-name",
    confirmText: "Claim your link",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:domain": [value: string];
  confirm: [slug: string];
}>();

const inputValue = ref(props.modelValue ?? "");
const error = ref("");
const checking = ref(false);
const selectedDomain = ref(props.domain ?? "perlink.to");

watch(() => props.domain, (val) => {
  if (val) selectedDomain.value = val;
});

const domainItems = [
  [
    {
      label: "perlink.to",
      onSelect: () => {
        selectedDomain.value = "perlink.to";
        emit("update:domain", "perlink.to");
      },
    },
    {
      label: "s.perlink.to",
      onSelect: () => {
        selectedDomain.value = "s.perlink.to";
        emit("update:domain", "s.perlink.to");
      },
    },
  ],
];

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) inputValue.value = val;
  },
);

watch(inputValue, (val) => {
  emit("update:modelValue", val);
});

async function handleConfirm() {
  error.value = "";
  const val = inputValue.value.trim().toLowerCase();

  if (!val) {
    error.value = "Please enter a link name";
    return;
  }

  const validRegex = /^[a-z0-9_-]{3,30}$/;
  if (!validRegex.test(val)) {
    error.value =
      "Link name must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores only";
    return;
  }

  checking.value = true;
  try {
    const check = await $fetch("/api/check_slug_availability", {
      method: "POST",
      body: { slug: val, domain: selectedDomain.value },
    });

    if (!check.success) {
      error.value = check.message || "This link name is already taken";
      return;
    }

    emit("confirm", val);
  } catch {
    error.value = "Error checking availability. Please try again.";
  } finally {
    checking.value = false;
  }
}
</script>
