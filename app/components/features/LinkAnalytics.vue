<template>
  <div class="space-y-4">
    <!-- Period -->
    <div class="inline-flex rounded-full bg-sand p-0.5" role="tablist" aria-label="Period">
      <button
        v-for="p in periods"
        :key="p.value"
        type="button"
        role="tab"
        :aria-selected="period === p.value"
        class="rounded-full px-3 py-1 text-sm transition-colors"
        :class="period === p.value ? 'bg-paper font-medium text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
        @click="period = p.value"
      >
        {{ p.label }}
      </button>
    </div>

    <!-- Stat tiles: cells on a hairline grid -->
    <div class="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line md:grid-cols-4">
      <div v-for="card in overviewCards" :key="card.label" class="bg-paper p-4 sm:p-5">
        <p class="text-xs text-ink-muted">{{ card.label }}</p>
        <p class="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight text-ink sm:text-3xl">{{ compact(card.value) }}</p>
      </div>
    </div>

    <!-- Views over time: column chart -->
    <section class="rounded-xl bg-paper p-4 ring-1 ring-line sm:p-5">
      <div class="flex items-baseline justify-between gap-3">
        <h4 class="text-sm font-medium text-ink">Views over time</h4>
        <p v-if="timeseries.length" class="text-xs text-ink-muted">Peak {{ compact(maxClicks) }}</p>
      </div>
      <div v-if="timeseries.length === 0" class="py-10 text-center text-sm text-ink-muted">
        No views in this period yet
      </div>
      <div v-else class="mt-4">
        <div class="flex h-40 items-end gap-0.5 border-b border-line">
          <div
            v-for="point in timeseries"
            :key="point.date"
            class="group relative flex h-full flex-1 items-end justify-center"
            :aria-label="`${formatChartDate(point.date)}: ${point.clicks} views`"
          >
            <div
              class="w-full max-w-6 rounded-t-[4px] bg-ink/85 transition-colors group-hover:bg-ink"
              :style="{ height: `max(${getBarWidth(point.clicks)}%, 2px)` }"
            />
            <!-- Tooltip -->
            <div class="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-paper group-hover:block">
              {{ formatChartDate(point.date) }} · {{ point.clicks }} views
            </div>
          </div>
        </div>
        <div class="mt-2 flex justify-between text-[11px] tabular-nums text-ink-muted">
          <span>{{ formatChartDate(timeseries[0]!.date) }}</span>
          <span v-if="timeseries.length > 1">{{ formatChartDate(timeseries[timeseries.length - 1]!.date) }}</span>
        </div>
      </div>
    </section>

    <!-- Breakdowns -->
    <div class="grid gap-4 md:grid-cols-2">
      <section v-for="panel in breakdowns" :key="panel.title" class="rounded-xl bg-paper p-4 ring-1 ring-line sm:p-5">
        <h4 class="text-sm font-medium text-ink">{{ panel.title }}</h4>
        <div v-if="panel.items.length === 0" class="py-8 text-center text-sm text-ink-muted">No data yet</div>
        <ul v-else class="mt-4 space-y-3">
          <li v-for="item in panel.items.slice(0, 8)" :key="item.name">
            <div class="mb-1 flex items-baseline justify-between gap-2 text-sm">
              <span class="truncate text-ink">{{ item.name }}</span>
              <span class="shrink-0 tabular-nums text-ink-muted">{{ item.clicks }} <span class="text-ink-faint">· {{ item.percentage }}%</span></span>
            </div>
            <div class="h-1 overflow-hidden rounded-full bg-sand-strong">
              <div class="h-full rounded-full bg-ink/80" :style="{ width: item.percentage + '%' }" />
            </div>
          </li>
        </ul>
      </section>

      <FeaturesCountryMap :countries="countries" class="md:col-span-2" />
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
  { label: "Views", value: overview.value.total_clicks },
  { label: "Unique visitors", value: overview.value.unique_clicks },
  { label: "Today", value: overview.value.today_clicks },
  { label: "Bots filtered", value: overview.value.bot_clicks },
]);

const breakdowns = computed(() => [
  { title: "Top referrers", items: referrers.value },
  { title: "Devices", items: devices.value },
  { title: "Browsers", items: browsers.value },
]);

const maxClicks = computed(() => Math.max(...timeseries.value.map((p) => p.clicks), 0));

// 1,284 / 12.9K / 4.2M
const compact = (value: number) =>
  new Intl.NumberFormat("en", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);

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
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

// Fetch on mount and period change
watch(period, () => fetchAnalytics());
onMounted(() => fetchAnalytics());
</script>
