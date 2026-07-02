<template>
  <div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon name="i-mingcute-lock-line" class="w-5 h-5 text-perlink-blue" />
        <h3 class="text-lg font-semibold text-perlink-blue">
          Password Protection
        </h3>
      </div>
    </div>

    <!-- Toggle -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        Require a password to access the short link destination.
      </p>
      <USwitch v-model="config.enabled" />
    </div>

    <!-- Password Field -->
    <div v-if="config.enabled" class="space-y-5">
      <div class="space-y-2">
        <label class="text-sm font-medium">Password</label>
        <div class="flex items-center gap-2">
          <UInput
            v-model="config.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter password"
            class="flex-1 font-mono"
            size="lg"
          />
          <UButton
            variant="ghost"
            color="neutral"
            :icon="
              showPassword ? 'i-mingcute-eye-close-line' : 'i-mingcute-eye-line'
            "
            @click="showPassword = !showPassword"
          />
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-mingcute-copy-2-line"
            @click="copyPassword"
          />
        </div>
      </div>

      <!-- Custom Message -->
      <div class="space-y-2">
        <UFormField label="Custom message (optional)" :hint="`${config.message.length}/100`">
          <UTextarea
            v-model="config.message"
            placeholder="Please enter the password to continue."
            :maxlength="100"
            :rows="3"
            size="lg"
            class="w-full"
          />
        </UFormField>
       
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PasswordConfig {
  enabled: boolean;
  password: string;
  message: string;
}

const props = defineProps<{
  modelValue: PasswordConfig;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: PasswordConfig];
}>();

const toast = useToast();
const showPassword = ref(false);

const config = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const copyPassword = async () => {
  if (!config.value.password) return;
  try {
    await navigator.clipboard.writeText(config.value.password);
    toast.add({
      title: "Copied",
      description: "Password copied to clipboard",
    });
  } catch {
    toast.add({
      title: "Failed to copy",
      color: "error",
    });
  }
};
</script>
