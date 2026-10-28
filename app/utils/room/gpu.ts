import * as THREE from 'three'

// WebGPU for the 3D rooms: on by default where the browser has WebGPU,
// except on phones and tablets.
//
// three.js' WebGPURenderer can't draw our hand-written GLSL materials, and the
// classic WebGLRenderer can't draw its node (TSL) materials, so one switch picks
// the whole set: once the kit is loaded, every room renderer (scene, video
// recorder, thumbnails) is a WebGPURenderer and every custom material is made
// in its TSL version (./nodeMaterials). Without WebGPU the rooms use the classic
// WebGLRenderer, not WebGPURenderer's WebGL 2 fallback (much slower), and the
// WebGPU code isn't even downloaded.

export type GpuKit = typeof import('./nodeMaterials')

let kit: GpuKit | null = null
let loading: Promise<GpuKit | null> | null = null

// Renamed when the defaults changed, so choices made while testing don't stick
const STORAGE_KEY = 'perlink:renderer'

const hasWebGPU = () => typeof navigator !== 'undefined' && 'gpu' in navigator

/** Phones and tablets: WebGPU ran noticeably worse there than classic WebGL */
const isMobile = () =>
  (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile === true
  || window.matchMedia('(pointer: coarse)').matches

/**
 * WebGPU when the browser has it, except on mobile. ?gpu=0 turns it off (and
 * remembers it), ?gpu=1 turns it on even on mobile, ?gpu=auto goes back to
 * the default, ?gpu=webgl2 makes WebGPURenderer use its WebGL 2 fallback (to
 * test that path on a browser that has WebGPU)
 */
export function gpuMode(): 'webgpu' | 'webgl2' | null {
  if (typeof window === 'undefined') return null
  const param = new URLSearchParams(window.location.search).get('gpu')
  let choice = param
  try {
    if (param === '0' || param === '1' || param === 'webgl2') localStorage.setItem(STORAGE_KEY, param)
    if (param === 'auto') localStorage.removeItem(STORAGE_KEY)
    choice = localStorage.getItem(STORAGE_KEY)
  } catch {}
  if (choice === 'webgl2') return 'webgl2'
  if (choice === '0' || !hasWebGPU()) return null
  return choice === '1' || !isMobile() ? 'webgpu' : null
}

export const wantsWebGPU = () => gpuMode() !== null

/** Loads the WebGPU renderer and the TSL materials when wanted; null otherwise */
export function loadGpuKit(): Promise<GpuKit | null> {
  if (kit) return Promise.resolve(kit)
  const mode = gpuMode()
  if (!mode) return Promise.resolve(null)
  loading ??= (async () => {
    // navigator.gpu can be there without a usable GPU (blocklisted drivers,
    // some Linux/Android); WebGPURenderer would then drop to WebGL 2, so stay
    // on the classic renderer instead
    if (mode === 'webgpu') {
      const adapter = await (navigator as Navigator & { gpu: { requestAdapter(): Promise<unknown> } }).gpu.requestAdapter().catch(() => null)
      if (!adapter) return null
    }
    return import('./nodeMaterials')
  })()
    .then((module) => {
      if (!module) return null
      kit = module
      return module
    })
    .catch((error) => {
      console.warn('[room] WebGPU kit failed to load, staying on WebGL', error)
      return null
    })
  return loading
}

/** The loaded kit, if the rooms are on WebGPU */
export const gpuKit = () => kit

/** What the room code needs from a renderer, whichever kind it is */
export type RoomRenderer = THREE.WebGLRenderer

export interface CreatedRenderer {
  renderer: RoomRenderer
  /** Resolves once the renderer can draw (WebGPU sets up asynchronously) */
  ready: Promise<void>
  /** 'webgpu', 'webgl2' (WebGPURenderer's fallback) or 'webgl' (classic) */
  backend: () => string
}

/** A renderer for the rooms: WebGPURenderer when the kit is loaded, else WebGLRenderer */
export function createRoomRenderer(params: { antialias?: boolean; alpha?: boolean; preserveDrawingBuffer?: boolean; powerPreference?: WebGLPowerPreference }): CreatedRenderer {
  if (kit) return kit.createGpuRenderer({ ...params, forceWebGL: gpuMode() === 'webgl2' })
  const renderer = new THREE.WebGLRenderer(params)
  return { renderer, ready: Promise.resolve(), backend: () => 'webgl' }
}

/** Max anisotropic filtering, for both kinds of renderer */
export function maxAnisotropy(renderer: RoomRenderer) {
  const r = renderer as RoomRenderer & { getMaxAnisotropy?: () => number }
  return r.capabilities?.getMaxAnisotropy?.() ?? r.getMaxAnisotropy?.() ?? 1
}

/**
 * Compile an object's materials ahead of drawing it, so it doesn't stall the
 * frame it first appears in. WebGPU's compileAsync only picks up objects that
 * are visible and inside the camera's view (it walks the scene like a render),
 * so they're shown and unculled for that synchronous walk and put back right
 * after; WebGL's compiles everything anyway. `scene` gives the lights.
 */
export function compileOffscreen(renderer: RoomRenderer, object: THREE.Object3D, camera: THREE.Camera, scene: THREE.Scene): Promise<unknown> {
  const saved: [THREE.Object3D, boolean, boolean][] = []
  object.traverse((obj) => {
    saved.push([obj, obj.visible, obj.frustumCulled])
    obj.visible = true
    obj.frustumCulled = false
  })
  const done = renderer.compileAsync(object, camera, scene)
  for (const [obj, visible, culled] of saved) {
    obj.visible = visible
    obj.frustumCulled = culled
  }
  return done
}
