import * as THREE from 'three/webgpu'
import {
  Fn, abs, cameraProjectionMatrix, cos, dot, float, floor, fract, instanceIndex, instancedBufferAttribute, length, max, mix,
  modelViewMatrix, modelWorldMatrix, normalize, positionGeometry, positionLocal, pow, sRGBTransferEOTF, select, sin, smoothstep,
  uniform, uv, vec2, vec3, vec4,
} from 'three/tsl'
import { SkyMesh } from 'three/addons/objects/SkyMesh.js'

// The TSL (node material) versions of the rooms' hand-written shaders, for
// WebGPURenderer (see ./gpu.ts). Only downloaded when the rooms run on WebGPU.
// Each one mirrors its GLSL twin and returns the same shape, so the room code
// uses either without knowing which. Uniform nodes have a `.value` like GLSL
// uniforms do.
//
// Colour note: GLSL materials without the colorspace include wrote their colour
// straight to the canvas; node materials always get converted to sRGB on the
// way out, so those few go through sRGBTransferEOTF first to look the same.

type Getter = () => number

/** WebGPURenderer (WebGPU, or WebGL 2 where WebGPU isn't available) */
export function createGpuRenderer(params: { antialias?: boolean; alpha?: boolean; powerPreference?: WebGLPowerPreference }) {
  const renderer = new THREE.WebGPURenderer({ antialias: params.antialias, alpha: params.alpha, powerPreference: params.powerPreference as GPUPowerPreference })
  const ready = renderer.init().then(() => undefined)
  const backend = () => ((renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend ? 'webgpu' : 'webgl2')
  return { renderer: renderer as unknown as import('three').WebGLRenderer, ready, backend }
}

/** The node version of PMREMGenerator (environment maps) */
export const createPmrem = (renderer: unknown) => new THREE.PMREMGenerator(renderer as THREE.WebGPURenderer) as unknown as import('three').PMREMGenerator

// TSL's typings are stricter than its runtime; graph-building helpers take and
// give loosely typed nodes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyNode = any

const hash = (n: AnyNode): AnyNode => fract(sin(n).mul(43758.5453))
const noise1 = (x: AnyNode): AnyNode => {
  const i = floor(x)
  const f = fract(x)
  return mix(hash(i), hash(i.add(1)), f.mul(f).mul(float(3).sub(f.mul(2))))
}
/** A column of the object's world matrix (the typings lack .element) */
const worldColumn = (i: number): AnyNode => (modelWorldMatrix as AnyNode).element(i)

// ---------- Flames (flame.ts) ----------

export function createFlameMaterial(time: Getter) {
  const uTime = uniform(0).onFrameUpdate(time)
  const material = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    fog: false,
  })
  // Billboard: the card faces the camera, sized by the object's scale
  material.vertexNode = Fn(() => {
    const center = modelViewMatrix.mul(vec4(0, 0, 0, 1))
    const size = vec2(length(worldColumn(0).xyz), length(worldColumn(1).xyz))
    const offset = positionGeometry.xy.mul(size)
    return cameraProjectionMatrix.mul(vec4(center.xy.add(offset), center.z, center.w))
  })()
  const seed = fract(sin(dot(worldColumn(3).xz, vec2(12.9898, 78.233))).mul(43758.5453)).mul(100)
  const t = uTime.add(seed)
  const flicker = float(0.82).add(noise1(t.mul(9)).mul(0.18))
  const y = uv().y.div(flicker)
  const wave = sin(y.mul(7).sub(t.mul(9))).mul(0.07).add(noise1(y.mul(4).sub(t.mul(5))).sub(0.5).mul(0.18)).mul(y)
  const x = uv().x.sub(0.5).sub(wave).mul(2)
  const width = smoothstep(0, 0.22, y).mul(pow(max(float(1).sub(y), 0), 0.8))
  const shape = float(1).sub(smoothstep(width.mul(0.55), width, abs(x)))
  const core = float(1).sub(smoothstep(0, width.mul(0.45), abs(x))).mul(float(1).sub(smoothstep(0.15, 0.6, y)))
  const edge = vec3(0.95, 0.28, 0.05)
  const mid = vec3(1.0, 0.62, 0.16)
  const hot = vec3(1.0, 0.95, 0.78)
  const color = mix(mix(edge, mid, smoothstep(0, 0.7, shape.mul(float(1).sub(y)))), hot, core)
  material.colorNode = color.mul(1.6)
  material.opacityNode = shape.mul(float(1).sub(smoothstep(0.55, 1, y).mul(0.6)))
  // The GLSL flame had no tone mapping
  material.toneMapped = false
  return material as unknown as import('three').Material
}

// ---------- Sky dome (RoomScene.createSkyDome) ----------

export function createSkyDome() {
  const zenith = uniform(new THREE.Color())
  const horizon = uniform(new THREE.Color())
  const below = uniform(new THREE.Color())
  const material = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide, depthWrite: false, fog: false })
  const y = normalize(positionLocal).y
  material.colorNode = select(
    y.greaterThan(0),
    mix(horizon, zenith, smoothstep(0, 0.55, y)),
    mix(horizon, below, smoothstep(0, 0.5, y.negate())),
  )
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(95, 32, 16), material)
  mesh.renderOrder = -1
  const white = new THREE.Color('#ffffff')
  return {
    mesh: mesh as unknown as import('three').Mesh,
    setColor(base: import('three').Color) {
      zenith.value.copy(base).offsetHSL(0, 0.08, -0.14)
      horizon.value.copy(base).lerp(white, 0.35)
      below.value.copy(base).offsetHSL(0, 0.12, -0.04)
    },
  }
}

// ---------- Physical sky (three's Sky -> SkyMesh) ----------

/** SkyMesh, with a `material.uniforms` view so the room code can set it like Sky */
export function createSky() {
  const sky = new SkyMesh()
  // Like the GLSL Sky as we use it: no clouds (it only lights the scene)
  sky.cloudCoverage.value = 0
  ;(sky.material as unknown as { uniforms: Record<string, { value: unknown }> }).uniforms = {
    turbidity: sky.turbidity,
    rayleigh: sky.rayleigh,
    mieCoefficient: sky.mieCoefficient,
    mieDirectionalG: sky.mieDirectionalG,
    sunPosition: sky.sunPosition,
    cloudCoverage: sky.cloudCoverage,
  }
  return sky as unknown as import('three/examples/jsm/objects/Sky.js').Sky
}

// ---------- Stars (lands.createStarSphere) ----------

export function createStars(positions: Float32Array, sizes: Float32Array, phases: Float32Array) {
  const count = sizes.length
  const time = uniform(0)
  const opacity = uniform(0)
  const position: AnyNode = instancedBufferAttribute(new THREE.InstancedBufferAttribute(positions, 3))
  const size: AnyNode = instancedBufferAttribute(new THREE.InstancedBufferAttribute(sizes, 1))
  const phase: AnyNode = instancedBufferAttribute(new THREE.InstancedBufferAttribute(phases, 1))
  const twinkle = float(0.55).add(sin(time.mul(float(1.2).add(phase.mul(0.6))).add(phase.mul(7))).mul(0.45))
  const material = new THREE.PointsNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: false })
  material.positionNode = position
  // Pixels (the material multiplies by the device pixel ratio itself)
  material.sizeNode = size.mul(float(0.8).add(twinkle.mul(0.5)))
  const d = length(uv().sub(0.5))
  material.colorNode = sRGBTransferEOTF(vec3(1, 0.98, 0.92)) as AnyNode
  material.opacityNode = float(1).sub(smoothstep(0, 0.5, d)).mul(opacity).mul(twinkle)
  material.toneMapped = false
  const sprite = new THREE.Sprite(material)
  sprite.count = count
  sprite.frustumCulled = false
  return {
    points: sprite as unknown as import('three').Points,
    material: { uniforms: { time, opacity } } as unknown as import('three').ShaderMaterial,
  }
}

// ---------- Sized points: fireflies and snow (lands.ts) ----------

/**
 * WebGPU draws point primitives 1 pixel wide, so sized points are instanced
 * sprites here; `markDirty` after changing `positions`.
 */
export function createPointSprites(positions: Float32Array, params: import('three').PointsMaterialParameters) {
  const attribute = new THREE.InstancedBufferAttribute(positions, 3)
  attribute.setUsage(THREE.DynamicDrawUsage)
  const material = new THREE.PointsNodeMaterial(params as THREE.PointsMaterialParameters)
  material.positionNode = instancedBufferAttribute(attribute) as AnyNode
  const sprite = new THREE.Sprite(material)
  sprite.count = positions.length / 3
  sprite.frustumCulled = false
  return {
    object: sprite as unknown as import('three').Object3D,
    material: material as unknown as import('three').PointsMaterial,
    markDirty: () => {
      attribute.needsUpdate = true
    },
  }
}

// ---------- Water (lands.createWater) ----------

export function createWater(radius: number) {
  const uniforms = {
    time: uniform(0),
    daylight: uniform(1),
    deep: uniform(new THREE.Color('#2a7aa6')),
    shallow: uniform(new THREE.Color('#7fd0e6')),
    night: uniform(new THREE.Color('#0f2a44')),
  }
  const material = new THREE.MeshBasicNodeMaterial({ transparent: true })
  const p = uv().sub(0.5)
  const r = length(p).mul(2)
  const t = uniforms.time
  const w = sin(p.x.mul(38).add(t.mul(1.3))).mul(0.5)
    .add(sin(p.y.mul(31).sub(t.mul(1.1))).mul(0.5))
    .add(sin(p.x.add(p.y).mul(52).add(t.mul(1.9))).mul(0.35))
  const day = uniforms.daylight
  let color = mix(uniforms.deep, uniforms.shallow, smoothstep(0.35, 1, r))
  color = mix(uniforms.night, color, day.mul(0.75).add(0.25))
  color = color.add(smoothstep(1.05, 1.3, w).mul(day.mul(0.5).add(0.25)))
  const rim = smoothstep(0.86, 0.98, r)
  color = mix(color, vec3(0.92, 0.97, 1.0), rim.mul(0.45).mul(day.mul(0.6).add(0.4)))
  material.colorNode = sRGBTransferEOTF(color) as AnyNode
  material.opacityNode = float(1).sub(smoothstep(0.98, 1, r)).mul(0.94)
  material.toneMapped = false
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), material)
  mesh.rotation.x = -Math.PI / 2
  return {
    mesh: mesh as unknown as import('three').Mesh,
    uniforms: uniforms as unknown as {
      time: { value: number }; daylight: { value: number }
      deep: { value: import('three').Color }; shallow: { value: import('three').Color }; night: { value: import('three').Color }
    },
  }
}

// ---------- Wind sway for foliage (natureModels.addWindSway) ----------

const windCache = new WeakMap<object, import('three').Material>()

/** A node copy of a foliage material that sways like the GLSL one (cached per material) */
export function windMaterial(source: import('three').MeshStandardMaterial, time: Getter) {
  const cached = windCache.get(source)
  if (cached) return cached
  const material = new THREE.MeshStandardNodeMaterial({
    color: source.color,
    map: source.map,
    alphaMap: source.alphaMap,
    alphaTest: source.alphaTest,
    transparent: source.transparent,
    opacity: source.opacity,
    side: source.side,
    roughness: source.roughness,
    metalness: source.metalness,
    roughnessMap: source.roughnessMap,
    metalnessMap: source.metalnessMap,
    normalMap: source.normalMap,
    emissive: source.emissive,
    emissiveMap: source.emissiveMap,
    emissiveIntensity: source.emissiveIntensity,
    vertexColors: source.vertexColors,
    flatShading: source.flatShading,
    depthWrite: source.depthWrite,
  } as THREE.MeshStandardNodeMaterialParameters)
  const uTime = uniform(0).onFrameUpdate(time)
  const height = max(positionLocal.y, 0)
  const seed = float(instanceIndex).mul(1.37)
  material.positionNode = positionLocal.add(vec3(
    sin(uTime.mul(1.7).add(seed)).mul(height).mul(0.035),
    0,
    cos(uTime.mul(1.3).add(seed.mul(1.3))).mul(height).mul(0.025),
  ))
  material.userData = { ...source.userData }
  windCache.set(source, material as unknown as import('three').Material)
  return material as unknown as import('three').Material
}
