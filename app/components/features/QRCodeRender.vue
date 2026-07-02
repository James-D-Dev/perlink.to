<template>
  <div class="flex flex-col space-y-6">
    <QRCodeVue3
      ref="qrCodeRef"
      :width="width"
      :height="height"
      :value="value"
      :qrOptions="qrOptions"
      :imageOptions="imageOptions"
      :dotsOptions="dotsOptions"
      :backgroundOptions="backgroundOptions"
      :cornersSquareOptions="cornersSquareOptions"
      :cornersDotOptions="cornersDotOptions"
      fileExt="png"
      :download="true"
      myclass="perlink-qr"
      imgclass="perlink-img-qr"
      downloadButton="qr-download-button"
      :downloadOptions="downloadOptions"
      :image="image"
      :margin="24"
    />

    <!-- <Button variant="outline" class="space-x-1" @click="downloadHandle">
      <Icon name="material-symbols:download-rounded" class="w-6 h-6" />
      <span>Download QR Code</span>
    </Button> -->
  </div>
</template>
<script setup lang="ts">
import QRCodeVue3 from "@/plugins/QRCodeVue3/index.vue";

enum DotOptionsType {
  "rounded" = "rounded",
  "dots" = "dots",
  "classy" = "classy",
  "classy-rounded" = "classy-rounded",
  "square" = "square",
  "extra-rounded" = "extra-rounded",
}

enum SquareOptionsType {
  "dot" = "dot",
  "square" = "square",
  "extra-rounded" = "extra-rounded",
}

enum DownloadType {
  "png" = "png",
  "jpeg" = "jpeg",
  "webp" = "webp",
}

enum ErrorCorrectionLevel {
  "L" = "L",
  "M" = "M",
  "Q" = "Q",
  "H" = "H",
}

enum QRMode {
  "Numeric" = "Numeric",
  "Alphanumeric" = "Alphanumeric",
  "Byte" = "Byte",
  "Kanji" = "Kanji",
}

interface ColorStop {
  offset: number;
  color: string;
}

interface GradientType {
  type: "linear" | "radial";
  rotation: number;
  colorStops: ColorStop[];
}

interface DownloadOptions {
  name: string;
  extension: DownloadType;
}

interface BackgroundOptions {
  color: string;
  gradient: GradientType | null;
}

interface CornersSquareOptions {
  type: SquareOptionsType;
  color: string;
  gradient: GradientType | null;
}

interface CornersDotOptions {
  type: DotOptionsType;
  color: string;
  gradient: GradientType | null;
}

interface DotsOptions {
  type: DotOptionsType;
  color: string;
  gradient: GradientType | null;
}

interface ImageOptions {
  hideBackgroundDots: boolean;
  imageSize: number;
  margin: number;
}

interface QRCodeOptions {
  typeNumber: number;
  mode: QRMode;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

const props = defineProps({
  width: {
    type: Number,
    default: 500,
  },
  height: {
    type: Number,
    default: 500,
  },
  value: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  foreground: {
    type: String,
    default: "#000000",
  },
  background: {
    type: String,
    default: "#ffffff",
  },
  logoSize: {
    type: Number,
    default: 0.4,
  },
  dotsType: {
    type: String,
    default: "rounded", // 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
  },
  cornersSquareType: {
    type: String,
    default: "square", // 'dot' | 'square' | 'extra-rounded'
  },
  cornersDotType: {
    type: String,
    default: "square", // 'dot' | 'square' (cornersDotOptions only accepts these 2)
  },
});

const qrOptions = ref<QRCodeOptions>({
  typeNumber: 0,
  mode: QRMode.Byte,
  errorCorrectionLevel: ErrorCorrectionLevel.H,
});
const imageOptions = computed<ImageOptions>(() => ({
  hideBackgroundDots: true,
  imageSize: props.logoSize,
  margin: 4,
}));
const dotsOptions = computed<DotsOptions>(() => ({
  type: (props.dotsType as DotOptionsType) || DotOptionsType.rounded,
  color: props.foreground,
  gradient: null,
}));

const backgroundOptions = computed<BackgroundOptions>(() => ({
  color: props.background,
  gradient: null,
}));
const cornersSquareOptions = computed<CornersSquareOptions>(() => ({
  type: (props.cornersSquareType as SquareOptionsType) || SquareOptionsType.square,
  color: props.foreground,
  gradient: null,
}));
// cornersDotOptions.type only accepts: 'dot' | 'square' (not full DotOptionsType)
const cornersDotOptions = computed(() => ({
  type: props.cornersDotType as 'dot' | 'square',
  color: props.foreground,
  gradient: null as GradientType | null,
}));
const downloadOptions = ref<DownloadOptions>({
  name: `qrcode`,
  extension: DownloadType.png,
});

const downloadHandle = () => {
  const downloadButton = document.querySelector(
    ".qr-download-button",
  ) as HTMLElement;
  console.log("downloadButton", downloadButton);

  downloadButton.click();
};

// Template ref for QRCodeVue3
const qrCodeRef = ref<any>(null);

// Expose update method
function updateQR() {
  if (qrCodeRef.value?.update) {
    console.log("Updating QR code...");
    qrCodeRef.value.update({
      width: props.width,
      height: props.height,
      value: props.value,
      qrOptions: qrOptions.value,
      imageOptions: imageOptions.value,
      dotsOptions: dotsOptions.value,
      backgroundOptions: backgroundOptions.value,
      cornersSquareOptions: cornersSquareOptions.value,
      cornersDotOptions: cornersDotOptions.value,
      image: props.image,
    });
  }
}

defineExpose({
  updateQR,
});
</script>

<style lang="css">
.qr-download-button {
  display: none;
}

.perlink-img-qr {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
  overflow: hidden;
}
</style>
