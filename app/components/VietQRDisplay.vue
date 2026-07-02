<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <!-- Header -->
    <BioBlockItemHeader
      :is-active="isActive"
      title="VietQR Payment"
      iconImage="_"
      :hidden="vietQRBlock?.hidden"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('vietqr')"
    >
      <template #icon-image>
        <img src="@/assets/images/vietqr.png" class="h-5" />
      </template>
      <template #actions>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-more-vertical"
        />
      </template>
    </BioBlockItemHeader>

    <!-- QR Content -->
    <div v-if="isActive" class="p-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <!-- QR Display -->
          <div
            v-if="qrString"
            class="flex flex-col items-center gap-4 pt-4 border-t border-gray-100"
          >
            <!-- Themed QR -->
            <!-- prev -->
            <QRCodeWithTheme
              :qr-string="qrString"
              :bank-name="generatedInfo?.bankName"
              :account-number="generatedInfo?.accountNumber"
              :account-name="accountName"
              :amount="parseFloat(amount || '0')"
              :theme-id="selectedTheme"
              class="w-full max-w-xs"
            />
            <!-- next -->

            <!-- Actions -->
            <!-- <div class="flex gap-2">
          <UButton
            variant="soft"
            color="primary"
            size="sm"
            icon="i-lucide-download"
            @click="downloadQR"
          >
            Download
          </UButton>
        </div> -->
          </div>

          <!-- Placeholder when no QR generated -->
          <div
            v-else
            class="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 bg-gray-50/50 relative w-full aspect-[800/1157] overflow-hidden rounded-xl"
          >
            <UIcon name="i-lucide-qr-code" class="w-12 h-12 text-gray-300" />
            <p class="text-sm text-gray-500 text-center">
              Please complete the form beside and press the Generate button
            </p>
          </div>
        </div>
        <div class="space-y-4">
          <!-- Bank Selection -->
          <UInputMenu
            v-model="selectedBank"
            value-key="id"
            :items="bankOptions"
            placeholder="Select bank"
            class="w-full"
            size="xl"
          >
            <template #leading>
              <UIcon name="i-lucide-building-2" class="w-4 h-4 text-gray-400" />
            </template>
          </UInputMenu>

          <!-- Account Number -->
          <UInput
            v-model="accountNumber"
            placeholder="Account number"
            :maxlength="19"
            size="xl"
            class="w-full"
          >
            <template #leading>
              <UIcon
                name="i-lucide-credit-card"
                class="w-4 h-4 text-gray-400"
              />
            </template>
          </UInput>
          <!-- Account name -->
          <UInput
            v-model="accountName"
            placeholder="Account name"
            size="xl"
            class="w-full"
            @input="formatAccountName"
          >
            <template #leading>
              <UIcon name="i-lucide-user" class="w-4 h-4 text-gray-400" />
            </template>
          </UInput>
          <!-- Amount -->
          <UInput
            v-model="amount"
            type="number"
            placeholder="Amount (VND)"
            :min="0"
            size="xl"
            class="w-full"
          >
            <template #leading>
              <span class="text-gray-400 text-sm">₫</span>
            </template>
          </UInput>

          <!-- Note -->
          <UTextarea
            v-model="note"
            placeholder="Transfer note (optional)"
            :rows="2"
            class="w-full"
            size="xl"
            :maxlength="25"
          />

          <!-- Theme Navigation -->
          <div class="flex items-center justify-between gap-2">
            <UButton
              variant="soft"
              color="neutral"
              size="sm"
              icon="i-lucide-chevron-left"
              @click="prevTheme"
            />
            <span class="text-sm font-medium text-gray-700">
              Theme: {{ currentThemeName }}
            </span>
            <UButton
              variant="soft"
              color="neutral"
              size="sm"
              icon="i-lucide-chevron-right"
              @click="nextTheme"
            />
          </div>

          <!-- Generate Button -->
          <UButton
            color="primary"
            :loading="generating"
            :disabled="!canGenerate"
            class="w-full py-3"
            size="xl"
            @click="generateQR"
          >
            <div class="flex items-center justify-center flex-1">
              <UIcon name="i-lucide-qr-code" class="w-4 h-4 mr-2" />
              Generate QR Code
            </div>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface BankOption {
  label: string;
  value: string;
}

interface GeneratedInfo {
  bankName: string;
  accountNumber: string;
  accountName?: string;
  amount: number;
}

import type { BioBlock } from "~/types/bio";
import { useBioBlock } from "~/composables/useBioBlock";

const props = defineProps<{
  isActive: boolean;
  blocks: BioBlock[];
}>();

// Use composable
const { vietQRData, vietQRBlock, setVietQR, removeVietQR, toggleBlockHidden } =
  useBioBlock({
    blocks: toRef(props, "blocks"),
  });

const emit = defineEmits<{
  toggle: [];
  "update:vietqr": [
    data: {
      bankId: string;
      bankName: string;
      accountNumber: string;
      accountName: string;
      amount: string;
      note: string;
      theme?: string;
      qrString: string;
    },
  ];
}>();

const toast = useToast();

// State
const banks = ref<BankOption[]>([]);
const selectedBank = ref(vietQRData.value?.bankId || "");
const accountNumber = ref(vietQRData.value?.accountNumber || "");
const accountName = ref(vietQRData.value?.accountName || "");
const amount = ref(vietQRData.value?.amount || "");
const note = ref(vietQRData.value?.note || "");

// QR Themes available
const qrThemes = [
  { id: "doreamon", name: "Doreamon" },
  { id: "hello-kitty", name: "Hello Kitty" },
  { id: "merry-christmas", name: "Merry Christmas" },
  { id: "newyear-2026", name: "New Year 2026" },
  { id: "vietnam", name: "Vietnam" },
  { id: "rose", name: "Rose" },
];

const selectedThemeIndex = ref(4); // Default to vietnam (index 4)

const selectedTheme = computed(
  () => qrThemes[selectedThemeIndex.value]?.id ?? "vietnam",
);
const currentThemeName = computed(
  () => qrThemes[selectedThemeIndex.value]?.name ?? "Vietnam",
);

function prevTheme() {
  selectedThemeIndex.value =
    (selectedThemeIndex.value - 1 + qrThemes.length) % qrThemes.length;
}

function nextTheme() {
  selectedThemeIndex.value = (selectedThemeIndex.value + 1) % qrThemes.length;
}

// Auto format account name: uppercase, no accents
function formatAccountName(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  // Remove accents/diacritics
  value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Uppercase
  value = value.toUpperCase();
  // Only allow letters and spaces
  value = value.replace(/[^A-Z ]/g, "");
  accountName.value = value;
  // Update input value to show formatted text immediately
  input.value = value;
}
const generating = ref(false);
const qrString = ref(vietQRData.value?.qrString || "");
const generatedInfo = ref<GeneratedInfo | null>(null);

// Computed
const canGenerate = computed(() => {
  return selectedBank.value && accountNumber.value.length >= 6;
});

const bankOptions = computed(() =>
  banks.value.map((item) => ({
    id: item.value,
    label: item.label,
  })),
);

// Load banks on mount
onMounted(async () => {
  await loadBanks();

  // Fill generatedInfo if we have existing VietQR data
  if (
    vietQRData.value?.qrString &&
    vietQRData.value.bankId &&
    vietQRData.value.accountNumber
  ) {
    const bank = banks.value.find((b) => b.value === vietQRData.value?.bankId);
    generatedInfo.value = {
      bankName: vietQRData.value.bankName || "",
      accountNumber: vietQRData.value.accountNumber,
      accountName: vietQRData.value.accountName,
      amount: parseFloat(vietQRData.value.amount || "0"),
    };
  }
});

async function loadBanks() {
  try {
    const response = await $fetch("/api/vietqr/banks");
    if (response.success && response.banks) {
      banks.value = response.banks.map((bank: any) => ({
        label: `${bank.shortName} - ${bank.name}`,
        value: bank.bin,
      }));
    }
  } catch (error) {
    console.error("Failed to load banks:", error);
  }
}

function searchBanks(query: string): BankOption[] {
  if (!query) return banks.value;
  const lowerQuery = query.toLowerCase();
  return banks.value.filter((bank) =>
    bank.label.toLowerCase().includes(lowerQuery),
  );
}

async function generateQR() {
  if (!canGenerate.value) return;

  generating.value = true;
  try {
    const response = await $fetch("/api/vietqr/generate", {
      method: "POST",
      key: `vietqr-${Date.now()}`,
      body: {
        bankBIN: selectedBank.value,
        accountNumber: accountNumber.value,
        amount: amount.value ? parseFloat(amount.value) : 0,
        note: note.value,
        oneTime: true,
        serviceType: "QRIBFTTA",
        currency: "VND",
      },
    });

    if (response.success) {
      qrString.value = response.qrString;
      const selectedBankLabel =
        banks.value.find((b) => b.value === selectedBank.value)?.label || "";
      const bankName = selectedBankLabel.split(" - ")[0] || "";

      emit("update:vietqr", {
        bankId: selectedBank.value,
        bankName: bankName,
        accountNumber: accountNumber.value,
        accountName: accountName.value,
        amount: amount.value,
        note: note.value,
        theme: selectedTheme.value,
        qrString: response.qrString,
      });
      generatedInfo.value = {
        bankName: bankName,
        accountNumber: response.accountNumber,
        accountName: accountName.value,
        amount: response.amount,
      };
    }
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error?.message || "Failed to generate QR code",
      color: "error",
    });
  } finally {
    generating.value = false;
  }
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function copyQRString() {
  navigator.clipboard.writeText(qrString.value);
  toast.add({
    title: "Copied",
    description: "QR code text copied to clipboard",
    color: "success",
  });
}

function downloadQR() {
  const canvas = document.querySelector("canvas");
  if (canvas) {
    const link = document.createElement("a");
    link.download = `vietqr-${accountNumber.value}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
}
</script>
