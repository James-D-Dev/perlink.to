<template>
  <div class="space-y-4">
    <!-- Click Count Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-gray-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-gray-900">{{ totalClicks }}</div>
        <div class="text-sm text-gray-600">Total Clicks</div>
      </div>
      <div class="bg-blue-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-blue-600">{{ bioLinkClicks }}</div>
        <div class="text-sm text-gray-600">Bio Links</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-green-600">{{ socialLinkClicks }}</div>
        <div class="text-sm text-gray-600">Social Links</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  bioPageId: string;
}>();

// Mock data for now - in real implementation, you'd fetch this from API
const totalClicks = ref(0);
const bioLinkClicks = ref(0);
const socialLinkClicks = ref(0);

// Fetch click counts
const fetchClickCounts = async () => {
  try {
    // In real implementation, you'd have an API endpoint to get click counts
    // For now, using mock data
    totalClicks.value = Math.floor(Math.random() * 1000);
    bioLinkClicks.value = Math.floor(Math.random() * 500);
    socialLinkClicks.value = Math.floor(Math.random() * 200);
  } catch (error) {
    console.error('Failed to fetch click counts:', error);
  }
};

onMounted(() => {
  fetchClickCounts();
});
</script>
