<template>
  <UDashboardPanel id="user-details">
    <template #header>
      <UDashboardNavbar title="User Details">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            to="/superadmin/users"
            color="neutral"
            icon="i-lucide-arrow-left"
            label="Back to Users"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-4xl mx-auto w-full px-2 md:px-4 py-4 space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <ULoader size="lg" />
        </div>

        <template v-else-if="user">
          <!-- User Profile Card -->
          <UCard class="bg-white">
            <div class="flex items-start gap-6">
              <UAvatar
                :src="user.avatar || undefined"
                :alt="user.name || ''"
                :text="(user.name?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase()"
                size="3xl"
                class="bg-gray-100"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                  <h2 class="text-2xl font-semibold text-gray-900">
                    {{ user.name || 'No name' }}
                  </h2>
                  <UBadge
                    :color="getStatusColor(user.status)"
                    variant="soft"
                    size="sm"
                  >
                    {{ user.status }}
                  </UBadge>
                </div>
                <p class="text-gray-500 mt-1">{{ user.email }}</p>
                <p class="text-sm text-gray-400 mt-1">
                  Member since {{ formatDate(user.createdAt) }}
                </p>
              </div>
            </div>
          </UCard>

          <!-- Plan Management -->
          <UCard class="bg-white">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-crown" class="w-5 h-5 text-amber-500" />
                <h3 class="text-lg font-semibold">Plan Management</h3>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">Current Plan</p>
                  <UBadge
                    :color="getPlanColor(user.plan)"
                    variant="soft"
                    size="lg"
                    class="mt-1 capitalize"
                  >
                    {{ user.plan || 'Free' }}
                  </UBadge>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">User ID</p>
                  <p class="text-sm font-mono text-gray-700">{{ user.id.slice(0, 8) }}...</p>
                </div>
              </div>

              <USeparator />

              <!-- Upgrade Plan -->
              <div class="space-y-2">
                <label class="text-sm font-medium">Upgrade Plan</label>
                <div class="flex items-center gap-3">
                  <USelect
                    v-model="selectedPlan"
                    :items="planOptions"
                    placeholder="Select plan"
                    class="w-48"
                  />
                  <UButton
                    color="primary"
                    icon="i-lucide-check"
                    :loading="isUpdatingPlan"
                    :disabled="selectedPlan === user.plan"
                    @click="updatePlan"
                  >
                    Update Plan
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard class="bg-white">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <UIcon name="i-lucide-link" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Short Links</p>
                  <p class="text-xl font-semibold">{{ stats.linksCount }}</p>
                </div>
              </div>
            </UCard>
            <UCard class="bg-white">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-50 rounded-lg">
                  <UIcon name="i-lucide-qr-code" class="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">QR Codes</p>
                  <p class="text-xl font-semibold">{{ stats.qrCount }}</p>
                </div>
              </div>
            </UCard>
            <UCard class="bg-white">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-50 rounded-lg">
                  <UIcon name="i-lucide-mouse-pointer-click" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Total Clicks</p>
                  <p class="text-xl font-semibold">{{ stats.clicksCount }}</p>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Actions -->
          <UCard class="bg-white">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-settings" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">Actions</h3>
              </div>
            </template>

            <div class="flex flex-wrap gap-3">
              <UButton
                :color="user.status === 'banned' ? 'success' : 'error'"
                :icon="user.status === 'banned' ? 'i-lucide-check-circle' : 'i-lucide-ban'"
                variant="soft"
                :loading="isTogglingBan"
                @click="toggleBan"
              >
                {{ user.status === 'banned' ? 'Unban User' : 'Ban User' }}
              </UButton>

              <UButton
                color="error"
                icon="i-lucide-trash"
                variant="soft"
                :loading="isDeleting"
                @click="deleteUser"
              >
                Delete User
              </UButton>
            </div>
          </UCard>
        </template>

        <!-- Not Found -->
        <div v-else class="text-center py-12">
          <UIcon name="i-lucide-user-x" class="w-16 h-16 text-gray-300 mx-auto" />
          <h3 class="mt-4 text-lg font-medium text-gray-900">User not found</h3>
          <p class="mt-1 text-gray-500">The user you're looking for doesn't exist.</p>
          <UButton to="/superadmin/users" color="primary" class="mt-4">
            Back to Users
          </UButton>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PLAN_OPTIONS, type PlanId, usePlans } from '~/composables/usePlans'

interface User {
  id: string
  name: string | null
  email: string
  avatar: string | null
  status: 'active' | 'pending' | 'banned' | 'inactive'
  plan: 'free' | 'starter' | 'plus' | 'pro' | null
  createdAt: string
}

interface UserStats {
  linksCount: number
  qrCount: number
  clicksCount: number
}

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
});

const route = useRoute();
const userId = route.params.id as string;

// State
const isLoading = ref(true);
const isUpdatingPlan = ref(false);
const isTogglingBan = ref(false);
const isDeleting = ref(false);
const user = ref<User | null>(null);
const selectedPlan = ref<string>('');

const stats = ref<UserStats>({
  linksCount: 0,
  qrCount: 0,
  clicksCount: 0,
});

const planOptions = PLAN_OPTIONS;

// Methods
const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'neutral' => {
  const colors: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
    active: 'success',
    pending: 'warning',
    banned: 'error',
    inactive: 'neutral',
  };
  return colors[status] || 'neutral';
};

const { getPlanColor } = usePlans();

const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const fetchUser = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch(`/api/superadmin/users/${userId}`) as {
      user: User
      stats: UserStats
    };
    user.value = response.user;
    selectedPlan.value = response.user.plan || 'free';
    stats.value = response.stats;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    user.value = null;
  } finally {
    isLoading.value = false;
  }
};

const updatePlan = async () => {
  if (!user.value || selectedPlan.value === user.value.plan) return;
  
  isUpdatingPlan.value = true;
  try {
    await $fetch(`/api/superadmin/users/${userId}/plan`, {
      method: 'POST' as any,
      body: { plan: selectedPlan.value },
    });
    await fetchUser();
  } catch (error) {
    console.error('Failed to update plan:', error);
  } finally {
    isUpdatingPlan.value = false;
  }
};

const toggleBan = async () => {
  if (!user.value) return;
  
  isTogglingBan.value = true;
  try {
    await $fetch(`/api/superadmin/users/${userId}/ban`, {
      method: 'POST' as any,
    });
    await fetchUser();
  } catch (error) {
    console.error('Failed to toggle ban:', error);
  } finally {
    isTogglingBan.value = false;
  }
};

const deleteUser = async () => {
  if (!user.value) return;
  
  const confirmed = confirm(`Are you sure you want to delete ${user.value.name || user.value.email}? This action cannot be undone.`);
  if (!confirmed) return;
  
  isDeleting.value = true;
  try {
    await $fetch(`/api/superadmin/users/${userId}`, {
      method: 'DELETE' as any,
    });
    await navigateTo('/superadmin/users');
  } catch (error) {
    console.error('Failed to delete user:', error);
    isDeleting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchUser();
});
</script>
