<template>
  <div
    id="birthday-countdown-block"
    class="w-full"
    :class="themeClasses"
  >
    <div class="rounded-2xl p-6 text-center">
      <!-- Label -->
      <div v-if="data.label" class="text-sm font-medium opacity-80 mb-3">
        {{ data.label }}
      </div>

      <!-- Countdown Display -->
      <div class="mb-4">
        <div v-if="!isBirthdayToday" class="grid grid-cols-4 gap-2">
          <div class="flex flex-col items-center">
            <span class="text-2xl font-bold tabular-nums">{{ timeLeft.days }}</span>
            <span class="text-xs opacity-70 uppercase">days</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-bold tabular-nums">{{ timeLeft.hours }}</span>
            <span class="text-xs opacity-70 uppercase">hrs</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-bold tabular-nums">{{ timeLeft.minutes }}</span>
            <span class="text-xs opacity-70 uppercase">min</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-bold tabular-nums">{{ timeLeft.seconds }}</span>
            <span class="text-xs opacity-70 uppercase">sec</span>
          </div>
        </div>
        <div v-else class="flex flex-col items-center gap-2 text-xl font-bold">
          <UIcon name="i-lucide-party-popper" class="w-12 h-12 animate-bounce" />
          <span>It's Birthday Time!</span>
        </div>
      </div>

      <!-- Age Info -->
      <div v-if="data.showAge && nextBirthdayAge" class="text-sm opacity-80 mb-2">
        Turning {{ nextBirthdayAge }}
      </div>

      <!-- Date Display -->
      <div class="text-xs opacity-60">
        {{ formattedBirthDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { BirthdayCountdownBlock } from '~/types/bio';

const props = defineProps<{
  data: BirthdayCountdownBlock['data'];
}>();

const now = ref(new Date());
let interval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

// Parse birth date
const birthDate = computed(() => {
  if (!props.data.birthDate) return null;
  const [year, month, day] = props.data.birthDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
});

// Calculate next birthday
const nextBirthday = computed(() => {
  if (!birthDate.value) return null;
  
  const today = now.value;
  const currentYear = today.getFullYear();
  const birthMonth = birthDate.value.getMonth();
  const birthDay = birthDate.value.getDate();
  
  let nextBirthdayDate = new Date(currentYear, birthMonth, birthDay);
  
  // If birthday has passed this year, use next year
  if (nextBirthdayDate < today) {
    nextBirthdayDate = new Date(currentYear + 1, birthMonth, birthDay);
  }
  
  return nextBirthdayDate;
});

// Check if birthday is today
const isBirthdayToday = computed(() => {
  if (!birthDate.value) return false;
  const today = now.value;
  return (
    today.getMonth() === birthDate.value.getMonth() &&
    today.getDate() === birthDate.value.getDate()
  );
});

// Calculate time left
const timeLeft = computed(() => {
  if (!nextBirthday.value) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const diff = nextBirthday.value.getTime() - now.value.getTime();
  
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
});

// Calculate next birthday age
const nextBirthdayAge = computed(() => {
  if (!birthDate.value || !nextBirthday.value) return null;
  
  const birthYear = birthDate.value.getFullYear();
  const nextYear = nextBirthday.value.getFullYear();
  
  return nextYear - birthYear;
});

// Format birth date for display
const formattedBirthDate = computed(() => {
  if (!birthDate.value) return '';
  return birthDate.value.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
});

// Theme classes - using inline Tailwind instead of @apply
const themeClasses = computed(() => {
  const themes: Record<string, string> = {
    'classic': 'bg-gradient-to-br from-pink-400 to-rose-500 text-white',
    'modern': 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white',
    'minimal': 'bg-gray-100 text-gray-800 border border-gray-200',
    'party': 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white',
    'elegant': 'bg-gradient-to-br from-amber-300 to-orange-400 text-white',
  };
  return themes[props.data.theme] || themes.classic;
});
</script>
