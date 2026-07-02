<template>
  <div class="relative w-full aspect-[800/1157] overflow-hidden rounded-xl">
    <!-- Background Theme Image -->
    <img
      :src="themeImage"
      :alt="themeName"
      class="absolute inset-0 w-full h-full object-cover"
    />
    
    <!-- QR Code Overlay -->
    <div
      v-if="qrString"
      class="absolute"
      :style="qrPositionStyle"
    >
      <div class="bg-white rounded-lg">
        <QRCode
          :value="qrString"
          :size="qrSize"
          level="M"
          class="rounded"
          :dotsOptions="{
            type: 'rounded',
            color: '#000',
          }"
          :cornersSquareOptions="{
            type: 'extra-rounded',
            color: '#000',
          }"
        />
      </div>
    </div>
    
    <!-- Bank Name Overlay -->
    <div
      v-if="bankName && config.bankName"
      class="absolute font-semibold text-gray-900"
      :style="getTextStyle(config.bankName)"
    >
      {{ bankName }}
    </div>
    
    <!-- Account Number Overlay -->
    <div
      v-if="accountNumber && config.accountNumber"
      class="absolute font-medium text-gray-800"
      :style="getTextStyle(config.accountNumber)"
    >
      {{ accountNumber }}
    </div>
    
    <!-- Account Name Overlay -->
    <div
      v-if="accountName && config.accountName"
      class="absolute font-medium text-gray-700"
      :style="getTextStyle(config.accountName)"
    >
      {{ accountName }}
    </div>
    
    <!-- Amount Overlay -->
    <!-- <div
      v-if="amount && config.amount"
      class="absolute font-bold text-primary"
      :style="getTextStyle(config.amount)"
    >
      {{ formatAmount(amount) }} VND
    </div> -->
  </div>
</template>

<script setup lang="ts">
import QRCode from "@/plugins/QRCodeVue3/index.vue";

interface PositionConfig {
  left: string;
  top: string;
  fontSize?: string;
  color?: string;
}

interface ThemeConfig {
  qr: { left: string; top: string; size: number };
  bankName?: PositionConfig;
  accountNumber?: PositionConfig;
  accountName?: PositionConfig;
  amount?: PositionConfig;
}

const props = defineProps<{
  qrString: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  amount?: number;
  themeId: string;
}>();

// Theme configurations with hardcoded positions
const themeConfigs: Record<string, ThemeConfig> = {
  doreamon: {
     qr: { left: "50%", top: "47%", size: 145 },
    bankName: { left: "35.2%", top: "84.5%", fontSize: "12px", color: "#3e120d" },
    accountNumber: { left: "35.2%", top: "69.5%", fontSize: "12px", color: "#3e120d" },
    accountName: { left: "35.2%", top: "77%", fontSize: "12px", color: "#3e120d" },
    amount: { left: "35.2%", top: "65%", fontSize: "12px", color: "#ffdd00" },
  },
  "hello-kitty": {
     qr: { left: "50%", top: "45%", size: 145 },
    bankName: { left: "40%", top: "84.5%", fontSize: "12px", color: "#3e120d" },
    accountNumber: { left: "40%", top: "69%", fontSize: "12px", color: "#3e120d" },
    accountName: { left: "40%", top: "77%", fontSize: "12px", color: "#3e120d" },
    amount: { left: "40%", top: "65%", fontSize: "12px", color: "#ffdd00" },
  },
  "merry-christmas": {
   qr: { left: "50%", top: "46%", size: 145 },
    bankName: { left: "33.5%", top: "86.5%", fontSize: "12px", color: "#3e120d" },
    accountNumber: { left: "33.5%", top: "70.5%", fontSize: "12px", color: "#3e120d" },
    accountName: { left: "33.5%", top: "78.5%", fontSize: "12px", color: "#3e120d" },
    amount: { left: "33.5%", top: "65%", fontSize: "12px", color: "#ffdd00" },
  },
  "newyear-2026": {
    qr: { left: "49%", top: "48%", size: 145 },
    bankName: { left: "33.6%", top: "88%", fontSize: "12px", color: "#3e120d" },
    accountNumber: { left: "33.6%", top: "71.5%", fontSize: "12px", color: "#3e120d" },
    accountName: { left: "33.6%", top: "80%", fontSize: "12px", color: "#3e120d" },
    amount: { left: "33.6%", top: "65%", fontSize: "12px", color: "#ffdd00" },
  },
  vietnam: {
    qr: { left: "51%", top: "45%", size: 145 },
    bankName: { left: "35.2%", top: "85%", fontSize: "12px", color: "#3e120d" },
    accountNumber: { left: "35.2%", top: "68.5%", fontSize: "12px", color: "#3e120d" },
    accountName: { left: "35.2%", top: "77%", fontSize: "12px", color: "#3e120d" },
    amount: { left: "35.2%", top: "65%", fontSize: "12px", color: "#ffdd00" },
  },
  rose: {
   qr: { left: "49%", top: "43.5%", size: 145 },
    bankName: { left: "34.3%", top: "84%", fontSize: "12px", color: "#3e120d" },
    accountNumber: { left: "34.3%", top: "68.1%", fontSize: "12px", color: "#3e120d" },
    accountName: { left: "34.3%", top: "76.2%", fontSize: "12px", color: "#3e120d" },
    amount: { left: "34.3%", top: "65%", fontSize: "12px", color: "#ffdd00" },
  },
};

// Default config if theme not found
const defaultConfig: ThemeConfig = {
  qr: { left: "50%", top: "40%", size: 140 },
  bankName: { left: "50%", top: "58%", fontSize: "16px" },
  accountNumber: { left: "50%", top: "61%", fontSize: "14px" },
  accountName: { left: "50%", top: "64%", fontSize: "14px" },
  amount: { left: "50%", top: "68%", fontSize: "18px" },
};

const config = computed(() => themeConfigs[props.themeId] || defaultConfig);

const themeImage = computed(() => `/images/qr-theme/${props.themeId}.jpg`);
const themeName = computed(() => props.themeId);

const qrSize = computed(() => config.value.qr.size);

const qrPositionStyle = computed(() => ({
  left: config.value.qr.left,
  top: config.value.qr.top,
  transform: "translate(-50%, -50%)",
}));

function getTextStyle(posConfig?: PositionConfig) {
  if (!posConfig) return {};
  return {
    left: posConfig.left,
    top: posConfig.top,
    fontSize: posConfig.fontSize,
    color: posConfig.color,
  };
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}
</script>
