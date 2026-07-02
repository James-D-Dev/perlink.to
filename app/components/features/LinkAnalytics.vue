<template>
  <div class="space-y-6">
    <!-- Period Selector -->
    <div class="flex items-center justify-between">
      <!-- <h3 class="text-lg font-semibold">Analytics</h3> -->
      <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
        <button
          v-for="p in periods"
          :key="p.value"
          class="px-3 py-1 text-sm rounded-md transition-colors"
          :class="
            period === p.value
              ? 'bg-white shadow-sm font-medium text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          "
          @click="period = p.value"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div
        v-for="card in overviewCards"
        :key="card.label"
        class="bg-white rounded-xl p-4 border border-gray-200"
      >
        <div class="flex items-center gap-2 mb-2">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center"
            :class="card.bgClass"
          >
            <UIcon :name="card.icon" class="w-4 h-4" :class="card.iconClass" />
          </div>
        </div>
        <div class="text-2xl font-bold">
          {{ card.value.toLocaleString() }}
        </div>
        <div class="text-xs text-muted-foreground mt-1">{{ card.label }}</div>
      </div>
    </div>

    <!-- Timeseries Chart -->
    <div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
      <h4 class="text-sm font-medium mb-4">Clicks over time</h4>
      <div v-if="timeseries.length === 0" class="text-center py-8 text-muted-foreground text-sm">
        No data for this period
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="point in timeseries"
          :key="point.date"
          class="flex items-center gap-3"
        >
          <span class="text-xs text-muted-foreground w-16 shrink-0">
            {{ formatChartDate(point.date) }}
          </span>
          <div class="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-perlink-blue rounded-full transition-all"
              :style="{ width: getBarWidth(point.clicks) + '%' }"
            />
          </div>
          <span class="text-xs font-medium w-10 text-right">{{
            point.clicks
          }}</span>
        </div>
      </div>
    </div>

    <!-- Breakdown Panels -->
    <div class="grid md:grid-cols-2 gap-4">
      <!-- Referrers -->
      <div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h4 class="text-sm font-medium mb-4">Top Referrers</h4>
        <div v-if="referrers.length === 0" class="text-center py-6 text-muted-foreground text-sm">
          No data
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="item in referrers"
            :key="item.name"
            class="flex items-center gap-3"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium truncate">{{
                  item.name
                }}</span>
                <span class="text-xs text-muted-foreground ml-2"
                  >{{ item.clicks }} ({{ item.percentage }}%)</span
                >
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-perlink-cyan rounded-full"
                  :style="{ width: item.percentage + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Devices -->
      <div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h4 class="text-sm font-medium mb-4">Devices</h4>
        <div v-if="devices.length === 0" class="text-center py-6 text-muted-foreground text-sm">
          No data
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="item in devices"
            :key="item.name"
            class="flex items-center gap-3"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium truncate">{{
                  item.name
                }}</span>
                <span class="text-xs text-muted-foreground ml-2"
                  >{{ item.clicks }} ({{ item.percentage }}%)</span
                >
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-green-400 rounded-full"
                  :style="{ width: item.percentage + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Countries -->
      <FeaturesCountryMap :countries="countries" />

      <!-- Browsers -->
      <div class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h4 class="text-sm font-medium mb-4">Browsers</h4>
        <div v-if="browsers.length === 0" class="text-center py-6 text-muted-foreground text-sm">
          No data
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="item in browsers"
            :key="item.name"
            class="flex items-center gap-3"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium truncate">{{
                  item.name
                }}</span>
                <span class="text-xs text-muted-foreground ml-2"
                  >{{ item.clicks }} ({{ item.percentage }}%)</span
                >
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-purple-400 rounded-full"
                  :style="{ width: item.percentage + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BreakdownItem {
  name: string;
  clicks: number;
  percentage: number;
}

interface TimeseriesPoint {
  date: string;
  clicks: number;
  unique: number;
}

const props = defineProps<{
  linkId: string;
}>();

const periods = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

const period = ref("7d");

// Data
const overview = ref({ total_clicks: 0, unique_clicks: 0, today_clicks: 0, bot_clicks: 0 });
const timeseries = ref<TimeseriesPoint[]>([]);
const referrers = ref<BreakdownItem[]>([]);
const devices = ref<BreakdownItem[]>([]);
const countries = ref<BreakdownItem[]>([]);
const browsers = ref<BreakdownItem[]>([]);

const overviewCards = computed(() => [
  {
    label: "Total Clicks",
    value: overview.value.total_clicks,
    icon: "i-mingcute-cursor-3-line",
    bgClass: "bg-perlink-cyan/10",
    iconClass: "text-perlink-cyan",
  },
  {
    label: "Unique Clicks",
    value: overview.value.unique_clicks,
    icon: "i-mingcute-user-2-line",
    bgClass: "bg-green-100",
    iconClass: "text-green-600",
  },
  {
    label: "Today",
    value: overview.value.today_clicks,
    icon: "i-mingcute-flash-line",
    bgClass: "bg-amber-100",
    iconClass: "text-amber-600",
  },
  {
    label: "Bot Clicks",
    value: overview.value.bot_clicks,
    icon: "i-mingcute-robot-line",
    bgClass: "bg-gray-100",
    iconClass: "text-gray-500",
  },
]);

const fetchAnalytics = async () => {
  if (!props.linkId) return;

  try {
    const [overviewRes, timeseriesRes, referrersRes, devicesRes, geoRes] =
      await Promise.all([
        $fetch<any>(`/api/analytics/${props.linkId}/overview?period=${period.value}`),
        $fetch<any>(`/api/analytics/${props.linkId}/timeseries?period=${period.value}`),
        $fetch<any>(`/api/analytics/${props.linkId}/referrers?period=${period.value}`),
        $fetch<any>(`/api/analytics/${props.linkId}/devices?period=${period.value}`),
        $fetch<any>(`/api/analytics/${props.linkId}/geo?period=${period.value}`),
      ]);

    if (overviewRes.success) overview.value = overviewRes.data;
    if (timeseriesRes.success) timeseries.value = timeseriesRes.data;
    if (referrersRes.success) referrers.value = referrersRes.data;
    if (devicesRes.success) {
      devices.value = devicesRes.data.devices;
      browsers.value = devicesRes.data.browsers;
    }
    if (geoRes.success) countries.value = geoRes.data.countries;
  } catch (e) {
    console.error("Failed to fetch analytics", e);
  }
};

// Chart helpers
const getBarWidth = (clicks: number): number => {
  const max = Math.max(...timeseries.value.map((p) => p.clicks), 1);
  return Math.round((clicks / max) * 100);
};

const formatChartDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

// Fetch on mount and period change
watch(period, () => fetchAnalytics());
onMounted(() => fetchAnalytics());
</script>
