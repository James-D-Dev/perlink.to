import * as THREE from 'three'

// WebGPU for the 3D rooms (experimental, behind ?gpu=1).
//
// three.js' WebGPURenderer uses WebGPU where the browser has it and falls back
// to WebGL 2 on its own. It can't draw our hand-written GLSL materials, and the
// classic WebGLRenderer can't draw its node (TSL) materials, so one switch picks
// the whole set: once the kit is loaded, every room renderer (scene, video
// recorder, thumbnails) is a WebGPURenderer and every custom material is made
// in its TSL version (./nodeMaterials). Without it nothing changes, and the
// WebGPU code isn't even downloaded.

export type GpuKit = typeof import('./nodeMaterials')

let kit: GpuKit | null = null
let loading: Promise<GpuKit | null> | null = null

const STORAGE_KEY = 'perlink:gpu'

/** ?gpu=1 turns it on (and remembers it), ?gpu=0 off again */
export function wantsWebGPU() {
  if (typeof window === 'undefined') return false
  const param = new URLSearchParams(window.location.search).get('gpu')
  try {
    if (param === '1') localStorage.setItem(STORAGE_KEY, '1')
    if (param === '0') localStorage.removeItem(STORAGE_KEY)
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return param === '1'
  }
}

/** Loads the WebGPU renderer and the TSL materials when wanted; null otherwise */
export function loadGpuKit(): Promise<GpuKit | null> {
  if (kit) return Promise.resolve(kit)
  if (!wantsWebGPU()) return Promise.resolve(null)
  loading ??= import('./nodeMaterials')
    .then((module) => {
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
  if (kit) return kit.createGpuRenderer(params)
  const renderer = new THREE.WebGLRenderer(params)
  return { renderer, ready: Promise.resolve(), backend: () => 'webgl' }
}

/** Max anisotropic filtering, for both kinds of renderer */
export function maxAnisotropy(renderer: RoomRenderer) {
  const r = renderer as RoomRenderer & { getMaxAnisotropy?: () => number }
  return r.capabilities?.getMaxAnisotropy?.() ?? r.getMaxAnisotropy?.() ?? 1
}
