<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-white/10">
    <!-- Header with toggle -->
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-sm font-medium">Countries</h4>
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-white/[0.06] rounded-lg p-0.5">
        <button
          class="flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors"
          :class="
            view === 'map'
              ? 'bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl shadow-sm font-medium text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700'
          "
          @click="view = 'map'"
        >
          <UIcon name="i-lucide-map" class="w-3.5 h-3.5" />
          Map
        </button>
        <button
          class="flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors"
          :class="
            view === 'list'
              ? 'bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl shadow-sm font-medium text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700'
          "
          @click="view = 'list'"
        >
          <UIcon name="i-lucide-list" class="w-3.5 h-3.5" />
          List
        </button>
      </div>
    </div>
    <!-- No data -->

    <!-- Map View -->
    <div v-if="view === 'map'" class="space-y-3">
      <div class="w-full" style="height: 340px">
        <canvas ref="canvasRef" />
      </div>
      <!-- Top 5 legend -->
      <div class="flex flex-wrap gap-x-4 gap-y-1">
        <div
          v-for="item in countries.slice(0, 5)"
          :key="item.name"
          class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-neutral-300 cursor-pointer select-none rounded px-1 py-0.5 transition-colors"
          :class="hoveredLegend === item.name ? 'bg-gray-100 dark:bg-white/[0.06]' : 'hover:bg-gray-50 dark:hover:bg-white/5'"
          @mouseenter="highlightCountry(item.name)"
          @mouseleave="clearHighlight"
          @click="highlightCountry(item.name)"
        >
          <span
            class="w-2.5 h-2.5 rounded-sm inline-block"
            :style="{ backgroundColor: rankColor(countries.indexOf(item)) }"
          />
          {{ resolveCountryName(item.name) }}
          <span class="text-gray-400 dark:text-neutral-500">{{ item.clicks }}</span>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-3">
      <div
        v-if="countries.length === 0"
        class="text-center py-8 text-gray-400 dark:text-neutral-500 text-sm"
      >
        No data
      </div>
      <div v-else>
        <div
          v-for="item in countries"
          :key="item.name"
          class="flex items-center gap-3"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium truncate">{{ resolveCountryName(item.name) }}</span>
              <span class="text-xs text-gray-500 dark:text-neutral-400 ml-2"
                >{{ item.clicks }} ({{ item.percentage }}%)</span
              >
            </div>
            <div class="h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :style="{
                  width: item.percentage + '%',
                  backgroundColor: '#f59e0b',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, Tooltip } from "chart.js";
import {
  ChoroplethController,
  GeoFeature,
  ProjectionScale,
  ColorScale,
  topojson,
} from "chartjs-chart-geo";

interface BreakdownItem {
  name: string;
  clicks: number;
  percentage: number;
}

const props = defineProps<{
  countries: BreakdownItem[];
}>();

const view = ref<"map" | "list">("map");
const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
const hoveredLegend = ref<string | null>(null);

function highlightCountry(name: string) {
  hoveredLegend.value = name;
  if (!chartInstance) return;
  const resolvedName = resolveCountryName(name);
  const labels = chartInstance.data.labels as string[];
  const idx = labels.findIndex((l) => l === resolvedName);
  if (idx === -1) return;
  chartInstance.setActiveElements([{ datasetIndex: 0, index: idx }]);
  chartInstance.tooltip?.setActiveElements([{ datasetIndex: 0, index: idx }], { x: 0, y: 0 });
  chartInstance.update();
}

function clearHighlight() {
  hoveredLegend.value = null;
  if (!chartInstance) return;
  chartInstance.setActiveElements([]);
  chartInstance.tooltip?.setActiveElements([], { x: 0, y: 0 });
  chartInstance.update();
}

// Amber color scale (light → dark) matching Google Analytics palette
const SCALE_COLORS = [
  "#fef3c7",
  "#fcd34d",
  "#f59e0b",
  "#d97706",
  "#b45309",
  "#78350f",
];

function rankColor(rank: number): string {
  return SCALE_COLORS[Math.min(rank, SCALE_COLORS.length - 1)] ?? "#f59e0b";
}

// ISO 3166-1 alpha-2 → { numeric id, display name }
// DB stores alpha-2 codes from Cloudflare cf-ipcountry header
const alpha2Map: Record<string, { numeric: number; name: string }> = {
  AF: { numeric: 4, name: "Afghanistan" },
  AL: { numeric: 8, name: "Albania" },
  DZ: { numeric: 12, name: "Algeria" },
  AO: { numeric: 24, name: "Angola" },
  AR: { numeric: 32, name: "Argentina" },
  AM: { numeric: 51, name: "Armenia" },
  AU: { numeric: 36, name: "Australia" },
  AT: { numeric: 40, name: "Austria" },
  AZ: { numeric: 31, name: "Azerbaijan" },
  BD: { numeric: 50, name: "Bangladesh" },
  BY: { numeric: 112, name: "Belarus" },
  BE: { numeric: 56, name: "Belgium" },
  BO: { numeric: 68, name: "Bolivia" },
  BA: { numeric: 70, name: "Bosnia and Herzegovina" },
  BR: { numeric: 76, name: "Brazil" },
  BG: { numeric: 100, name: "Bulgaria" },
  KH: { numeric: 116, name: "Cambodia" },
  CM: { numeric: 120, name: "Cameroon" },
  CA: { numeric: 124, name: "Canada" },
  CL: { numeric: 152, name: "Chile" },
  CN: { numeric: 156, name: "China" },
  CO: { numeric: 170, name: "Colombia" },
  HR: { numeric: 191, name: "Croatia" },
  CU: { numeric: 192, name: "Cuba" },
  CZ: { numeric: 203, name: "Czech Republic" },
  DK: { numeric: 208, name: "Denmark" },
  EC: { numeric: 218, name: "Ecuador" },
  EG: { numeric: 818, name: "Egypt" },
  ET: { numeric: 231, name: "Ethiopia" },
  FI: { numeric: 246, name: "Finland" },
  FR: { numeric: 250, name: "France" },
  DE: { numeric: 276, name: "Germany" },
  GH: { numeric: 288, name: "Ghana" },
  GR: { numeric: 300, name: "Greece" },
  GT: { numeric: 320, name: "Guatemala" },
  HN: { numeric: 340, name: "Honduras" },
  HU: { numeric: 348, name: "Hungary" },
  IN: { numeric: 356, name: "India" },
  ID: { numeric: 360, name: "Indonesia" },
  IR: { numeric: 364, name: "Iran" },
  IQ: { numeric: 368, name: "Iraq" },
  IE: { numeric: 372, name: "Ireland" },
  IL: { numeric: 376, name: "Israel" },
  IT: { numeric: 380, name: "Italy" },
  JP: { numeric: 392, name: "Japan" },
  JO: { numeric: 400, name: "Jordan" },
  KZ: { numeric: 398, name: "Kazakhstan" },
  KE: { numeric: 404, name: "Kenya" },
  KW: { numeric: 414, name: "Kuwait" },
  LA: { numeric: 418, name: "Laos" },
  LV: { numeric: 428, name: "Latvia" },
  LB: { numeric: 422, name: "Lebanon" },
  LY: { numeric: 434, name: "Libya" },
  LT: { numeric: 440, name: "Lithuania" },
  MY: { numeric: 458, name: "Malaysia" },
  MX: { numeric: 484, name: "Mexico" },
  MA: { numeric: 504, name: "Morocco" },
  MZ: { numeric: 508, name: "Mozambique" },
  MM: { numeric: 104, name: "Myanmar" },
  NP: { numeric: 524, name: "Nepal" },
  NL: { numeric: 528, name: "Netherlands" },
  NZ: { numeric: 554, name: "New Zealand" },
  NG: { numeric: 566, name: "Nigeria" },
  KP: { numeric: 408, name: "North Korea" },
  NO: { numeric: 578, name: "Norway" },
  OM: { numeric: 512, name: "Oman" },
  PK: { numeric: 586, name: "Pakistan" },
  PA: { numeric: 591, name: "Panama" },
  PY: { numeric: 600, name: "Paraguay" },
  PE: { numeric: 604, name: "Peru" },
  PH: { numeric: 608, name: "Philippines" },
  PL: { numeric: 616, name: "Poland" },
  PT: { numeric: 620, name: "Portugal" },
  RO: { numeric: 642, name: "Romania" },
  RU: { numeric: 643, name: "Russia" },
  SA: { numeric: 682, name: "Saudi Arabia" },
  RS: { numeric: 688, name: "Serbia" },
  SK: { numeric: 703, name: "Slovakia" },
  SO: { numeric: 706, name: "Somalia" },
  ZA: { numeric: 710, name: "South Africa" },
  KR: { numeric: 410, name: "South Korea" },
  ES: { numeric: 724, name: "Spain" },
  LK: { numeric: 144, name: "Sri Lanka" },
  SD: { numeric: 729, name: "Sudan" },
  SE: { numeric: 752, name: "Sweden" },
  CH: { numeric: 756, name: "Switzerland" },
  SY: { numeric: 760, name: "Syria" },
  TW: { numeric: 158, name: "Taiwan" },
  TZ: { numeric: 834, name: "Tanzania" },
  TH: { numeric: 764, name: "Thailand" },
  TN: { numeric: 788, name: "Tunisia" },
  TR: { numeric: 792, name: "Turkey" },
  UG: { numeric: 800, name: "Uganda" },
  UA: { numeric: 804, name: "Ukraine" },
  AE: { numeric: 784, name: "United Arab Emirates" },
  GB: { numeric: 826, name: "United Kingdom" },
  US: { numeric: 840, name: "United States" },
  UY: { numeric: 858, name: "Uruguay" },
  UZ: { numeric: 860, name: "Uzbekistan" },
  VE: { numeric: 862, name: "Venezuela" },
  VN: { numeric: 704, name: "Vietnam" },
  YE: { numeric: 887, name: "Yemen" },
  ZM: { numeric: 894, name: "Zambia" },
  ZW: { numeric: 716, name: "Zimbabwe" },
};

function resolveCountryName(code: string): string {
  return alpha2Map[code.toUpperCase()]?.name ?? code;
}

// Fallback: full name → numeric (in case API returns full names)
const nameToNumeric: Record<string, number> = {
  Afghanistan: 4,
  Albania: 8,
  Algeria: 12,
  Angola: 24,
  Argentina: 32,
  Armenia: 51,
  Australia: 36,
  Austria: 40,
  Azerbaijan: 31,
  Bangladesh: 50,
  Belarus: 112,
  Belgium: 56,
  Bolivia: 68,
  "Bosnia and Herzegovina": 70,
  Brazil: 76,
  Bulgaria: 100,
  Cambodia: 116,
  Cameroon: 120,
  Canada: 124,
  Chile: 152,
  China: 156,
  Colombia: 170,
  Croatia: 191,
  Cuba: 192,
  "Czech Republic": 203,
  Denmark: 208,
  Ecuador: 218,
  Egypt: 818,
  Ethiopia: 231,
  Finland: 246,
  France: 250,
  Germany: 276,
  Ghana: 288,
  Greece: 300,
  Guatemala: 320,
  Honduras: 340,
  Hungary: 348,
  India: 356,
  Indonesia: 360,
  Iran: 364,
  Iraq: 368,
  Ireland: 372,
  Israel: 376,
  Italy: 380,
  Japan: 392,
  Jordan: 400,
  Kazakhstan: 398,
  Kenya: 404,
  Kuwait: 414,
  Laos: 418,
  Latvia: 428,
  Lebanon: 422,
  Libya: 434,
  Lithuania: 440,
  Malaysia: 458,
  Mexico: 484,
  Morocco: 504,
  Mozambique: 508,
  Myanmar: 104,
  Nepal: 524,
  Netherlands: 528,
  "New Zealand": 554,
  Nigeria: 566,
  "North Korea": 408,
  Norway: 578,
  Oman: 512,
  Pakistan: 586,
  Panama: 591,
  Paraguay: 600,
  Peru: 604,
  Philippines: 608,
  Poland: 616,
  Portugal: 620,
  Romania: 642,
  Russia: 643,
  "Saudi Arabia": 682,
  Serbia: 688,
  Slovakia: 703,
  Somalia: 706,
  "South Africa": 710,
  "South Korea": 410,
  Spain: 724,
  "Sri Lanka": 144,
  Sudan: 729,
  Sweden: 752,
  Switzerland: 756,
  Syria: 760,
  Taiwan: 158,
  Tanzania: 834,
  Thailand: 764,
  Tunisia: 788,
  Turkey: 792,
  Uganda: 800,
  Ukraine: 804,
  "United Arab Emirates": 784,
  "United Kingdom": 826,
  "United States": 840,
  Uruguay: 858,
  Uzbekistan: 860,
  Venezuela: 862,
  Vietnam: 704,
  Yemen: 887,
  Zambia: 894,
  Zimbabwe: 716,
};

async function buildChart() {
  if (!canvasRef.value) return;

  Chart.register(
    ChoroplethController,
    GeoFeature,
    ProjectionScale,
    ColorScale,
    Tooltip,
  );

  const worldData = await import("world-atlas/countries-110m.json");
  const world = (worldData as any).default ?? worldData;
  const features = (topojson.feature(world, world.objects.countries) as any)
    .features;

  // Build numeric → display name for all countries in alpha2Map
  const numericToName: Record<number, string> = {};
  for (const entry of Object.values(alpha2Map)) {
    numericToName[entry.numeric] = entry.name;
  }

  // Build click lookup by numeric id
  // Support both alpha-2 codes ("VN") and full names ("Vietnam")
  const clicksByNumericId: Record<number, { clicks: number; name: string }> =
    {};
  for (const item of props.countries) {
    const upper = item.name.toUpperCase();
    const byAlpha2 = alpha2Map[upper];
    if (byAlpha2) {
      clicksByNumericId[byAlpha2.numeric] = { clicks: item.clicks, name: byAlpha2.name };
    } else {
      const num = nameToNumeric[item.name];
      if (num !== undefined)
        clicksByNumericId[num] = { clicks: item.clicks, name: item.name };
    }
  }

  const maxClicks = Math.max(...props.countries.map((c) => c.clicks), 1);

  const data = features.map((f: any) => ({
    feature: f,
    value: clicksByNumericId[Number(f.id)]?.clicks ?? 0,
  }));

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const config = {
    type: "choropleth",
    data: {
      labels: features.map(
        (f: any) => numericToName[Number(f.id)] ?? clicksByNumericId[Number(f.id)]?.name ?? String(f.id),
      ),
      datasets: [
        {
          label: "Clicks",
          data,
          backgroundColor(ctx: any) {
            const val: number = ctx.raw?.value ?? 0;
            if (val === 0) return "#e5e7eb";
            const ratio = val / maxClicks;
            if (ratio > 0.75) return "#78350f";
            if (ratio > 0.5) return "#b45309";
            if (ratio > 0.25) return "#d97706";
            if (ratio > 0.1) return "#f59e0b";
            return "#fef3c7";
          },
          borderColor: "#fff",
          borderWidth: 0.5,
          hoverBackgroundColor: "#0ea5e9",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      showOutline: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          filter(item: any) {
            return (item.raw?.value ?? 0) > 0;
          },
          callbacks: {
            title(items: any[]) {
              const item = items[0];
              if (!item) return "";
              return item.chart.data.labels?.[item.dataIndex] ?? "";
            },
            label(ctx: any) {
              const val: number = ctx.raw?.value ?? 0;
              return `${val} clicks`;
            },
          },
        },
      },
      scales: {
        projection: {
          axis: "x",
          projection: "naturalEarth1",
        },
        color: {
          axis: "x",
          display: false,
          interpolate: (v: number) => {
            if (v <= 0) return "#e5e7eb";
            if (v > 0.75) return "#78350f";
            if (v > 0.5) return "#b45309";
            if (v > 0.25) return "#d97706";
            if (v > 0.1) return "#f59e0b";
            return "#fef3c7";
          },
          min: 0,
          max: maxClicks,
        },
      },
    },
  };

  chartInstance = new Chart(canvasRef.value, config as any);
}

watch(
  () => [view.value, props.countries] as const,
  ([v]) => {
    if (v === "map") nextTick(() => buildChart());
    else if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  },
  { deep: true },
);

onMounted(() => buildChart());
onUnmounted(() => {
  chartInstance?.destroy();
  chartInstance = null;
});
</script>
