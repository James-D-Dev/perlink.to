<script setup lang="ts">
import { useDevicePixelRatio } from "@vueuse/core";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";

interface RosePetal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  dx: number; // Horizontal drift
  dy: number; // Vertical fall speed
}

interface Props {
  quantity?: number;
  speed?: number;
  maxSize?: number;
  minSize?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  quantity: 30,
  speed: 1,
  maxSize: 20,
  minSize: 10,
  class: "",
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const rosePetals = ref<RosePetal[]>([]);
const canvasSize = reactive<{ w: number; h: number }>({ w: 0, h: 0 });
const { pixelRatio } = useDevicePixelRatio();
const roseImage = ref<HTMLImageElement | null>(null);
const imageLoaded = ref(false);

onMounted(() => {
  // Load rose image
  const img = new Image();
  img.src = "/images/backgrounds/rose.webp";
  img.onload = () => {
    roseImage.value = img;
    imageLoaded.value = true;
    initCanvas();
    animate();
  };

  if (canvasRef.value) {
    context.value = canvasRef.value.getContext("2d");
  }
  window.addEventListener("resize", initCanvas);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", initCanvas);
});

function initCanvas() {
  resizeCanvas();
  if (imageLoaded.value) {
    createRosePetals();
  }
}

function resizeCanvas() {
  if (canvasContainerRef.value && canvasRef.value && context.value) {
    rosePetals.value.length = 0;
    canvasSize.w = canvasContainerRef.value.offsetWidth;
    canvasSize.h = canvasContainerRef.value.offsetHeight;
    canvasRef.value.width = canvasSize.w * pixelRatio.value;
    canvasRef.value.height = canvasSize.h * pixelRatio.value;
    canvasRef.value.style.width = `${canvasSize.w}px`;
    canvasRef.value.style.height = `${canvasSize.h}px`;
    context.value.scale(pixelRatio.value, pixelRatio.value);
  }
}

function createRosePetals() {
  for (let i = 0; i < props.quantity; i++) {
    const petal = createRosePetal();
    rosePetals.value.push(petal);
  }
}

function createRosePetal(): RosePetal {
  const x = Math.random() * canvasSize.w;
  const y = Math.random() * canvasSize.h;
  const size = Math.random() * (props.maxSize! - props.minSize!) + props.minSize!;
  const rotation = Math.random() * Math.PI * 2;
  const rotationSpeed = (Math.random() - 0.5) * 0.02;
  const alpha = Math.random() * 0.3 + 0.7; // Opacity between 0.7 and 1
  const dx = (Math.random() - 0.5) * 0.5; // Slight horizontal drift
  const dy = Math.random() * 0.5 + props.speed; // Falling speed

  return { x, y, size, rotation, rotationSpeed, alpha, dx, dy };
}

function drawRosePetal(petal: RosePetal) {
  if (context.value && roseImage.value) {
    const { x, y, size, rotation, alpha } = petal;

    context.value.save();
    context.value.translate(x, y);
    context.value.rotate(rotation);
    context.value.globalAlpha = alpha;
    context.value.drawImage(
      roseImage.value,
      -size / 2,
      -size / 2,
      size,
      size
    );
    context.value.restore();
  }
}

function animate() {
  if (context.value) {
    context.value.clearRect(0, 0, canvasSize.w, canvasSize.h);
  }

  rosePetals.value.forEach((petal) => {
    petal.x += petal.dx; // Drift horizontally
    petal.y += petal.dy; // Fall down
    petal.rotation += petal.rotationSpeed; // Rotate

    // Reset petal when it moves out of the canvas
    if (petal.y > canvasSize.h + petal.size) {
      petal.y = -petal.size; // Reset to the top
      petal.x = Math.random() * canvasSize.w; // Random horizontal position
    }

    // Wrap around horizontally
    if (petal.x > canvasSize.w + petal.size) {
      petal.x = -petal.size;
    } else if (petal.x < -petal.size) {
      petal.x = canvasSize.w + petal.size;
    }

    drawRosePetal(petal);
  });

  requestAnimationFrame(animate);
}
</script>

<template>
  <div
    ref="canvasContainerRef"
    :class="$props.class"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" />
  </div>
</template>
