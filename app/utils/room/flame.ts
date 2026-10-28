import * as THREE from 'three'
import { gpuKit } from './gpu'

// Animated candle/torch flames: a camera-facing card with a procedural,
// flickering teardrop flame. One shared material; each flame gets its own
// motion from its position in the world.

/** Shared flame clock in seconds, advanced by the scene every frame */
export const flameTime = { value: 0 }

const glslMaterial = new THREE.ShaderMaterial({
  uniforms: { uTime: flameTime },
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  fog: false,
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying float vSeed;
    void main() {
      vUv = uv;
      vSeed = fract(sin(dot(modelMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453) * 100.0;
      // Billboard: keep the card facing the camera, sized by the object's scale
      vec4 center = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      vec2 size = vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
      center.xy += position.xy * size;
      gl_Position = projectionMatrix * center;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying float vSeed;

    float hash(float n) { return fract(sin(n) * 43758.5453); }
    float noise(float x) {
      float i = floor(x);
      float f = fract(x);
      return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
    }

    void main() {
      float t = uTime + vSeed;
      // Height flickers; the tip licks up and down
      float flicker = 0.82 + 0.18 * noise(t * 9.0);
      float y = vUv.y / flicker;
      // Waves travel up the flame and grow toward the tip
      float wave = (sin(y * 7.0 - t * 9.0) * 0.07 + (noise(y * 4.0 - t * 5.0) - 0.5) * 0.18) * y;
      float x = (vUv.x - 0.5 - wave) * 2.0;
      // Teardrop: rounded base, pointed tip
      float width = smoothstep(0.0, 0.22, y) * pow(max(1.0 - y, 0.0), 0.8);
      float shape = 1.0 - smoothstep(width * 0.55, width, abs(x));
      float core = (1.0 - smoothstep(0.0, width * 0.45, abs(x))) * (1.0 - smoothstep(0.15, 0.6, y));
      vec3 edge = vec3(0.95, 0.28, 0.05);
      vec3 mid = vec3(1.0, 0.62, 0.16);
      vec3 hot = vec3(1.0, 0.95, 0.78);
      vec3 color = mix(edge, mid, smoothstep(0.0, 0.7, shape * (1.0 - y)));
      color = mix(color, hot, core);
      float alpha = shape * (1.0 - smoothstep(0.55, 1.0, y) * 0.6);
      gl_FragColor = vec4(color * 1.6, alpha);
      #include <colorspace_fragment>
    }
  `,
})
glslMaterial.userData.shared = true

// On WebGPU the same flame is a node material (./nodeMaterials), made once
let nodeMaterial: THREE.Material | null = null
function flameMaterial() {
  const kit = gpuKit()
  if (!kit) return glslMaterial
  if (!nodeMaterial) {
    nodeMaterial = kit.createFlameMaterial(() => flameTime.value)
    nodeMaterial.userData.shared = true
  }
  return nodeMaterial
}

// Unit card with its base at the origin
const geometry = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0)

/** A flame with its base at `position`, sized in meters */
export function createFlame(position: THREE.Vector3, height: number, width = height * 0.5) {
  const flame = new THREE.Mesh(geometry, flameMaterial())
  flame.position.copy(position)
  flame.scale.set(width, height, 1)
  flame.renderOrder = 2
  flame.userData.shared = true
  return flame
}

/** Light multiplier between about 0.75 and 1.05 that flickers like a flame */
export function flameFlicker(time: number, seed: number) {
  return 0.9 + 0.1 * Math.sin(time * 13 + seed) * Math.sin(time * 7.3 + seed * 2.1) + 0.05 * Math.sin(time * 23 + seed * 0.7)
}
