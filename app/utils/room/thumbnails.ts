import * as THREE from 'three'
import { ROOM_CATALOG, type CatalogItem } from './catalog'
import { buildRoomShell } from './shell'
import type { RoomStyle } from '~/types/room'
import { DEFAULT_ROOM_STYLE } from '~/types/room'

// Renders each catalog model once into a small PNG so the editor can show
// real previews. Results are cached in memory and in localStorage.

const SIZE = 192
// Bump when catalog models change so cached thumbnails are regenerated
const CACHE_KEY = 'perlink-room-thumbs-v6'

let memoryCache: Record<string, string> | null = null

function readCache(): Record<string, string> {
  if (memoryCache) return memoryCache
  try {
    memoryCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    memoryCache = {}
  }
  return memoryCache!
}

function writeCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Storage full or blocked: thumbnails just get re-rendered next time
  }
}

async function renderItem(renderer: THREE.WebGLRenderer, item: CatalogItem): Promise<string> {
  const scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight('#ffffff', '#b8a99a', 1.6))
  const key = new THREE.DirectionalLight('#ffffff', 2.2)
  key.position.set(3, 5, 4)
  scene.add(key)

  const model = item.build(item.defaultColor)
  // Model-based items load asynchronously
  await (model.userData.ready as Promise<void> | undefined)
  // Show lamps and screens a little lit so they read as lights
  model.traverse((obj) => {
    const m = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
    if (m?.userData?.glow) m.emissiveIntensity = (m.userData.baseGlow as number) + 0.8
    if (m?.userData?.sky) m.emissiveIntensity = 0.5
  })
  scene.add(model)

  // Frame the model's bounding sphere from a 3/4 view (front view for wall items)
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const radius = box.getBoundingSphere(new THREE.Sphere()).radius || 1
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)
  const direction = item.wallMounted
    ? new THREE.Vector3(0.35, 0.15, 1).normalize()
    : new THREE.Vector3(1, 0.85, 1.15).normalize()
  const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.05
  camera.position.copy(center).addScaledVector(direction, distance)
  camera.lookAt(center)

  renderer.render(scene, camera)
  const url = renderer.domElement.toDataURL('image/webp', 0.9)

  model.traverse((obj) => {
    if (obj.userData.shared) return
    const mesh = obj as THREE.Mesh
    mesh.geometry?.dispose()
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(material)) material.forEach(m => m.dispose())
    else material?.dispose()
  })
  return url
}

/**
 * Get thumbnails for every catalog item. Calls onUpdate as each one becomes
 * available so the UI can fill in progressively.
 */
export async function loadRoomThumbnails(onUpdate: (type: string, url: string) => void) {
  const cache = readCache()
  const missing: CatalogItem[] = []
  for (const item of ROOM_CATALOG) {
    if (cache[item.type]) onUpdate(item.type, cache[item.type]!)
    else missing.push(item)
  }
  if (!missing.length) return

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1)
  renderer.setSize(SIZE, SIZE, false)
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace

  try {
    for (const item of missing) {
      // Yield between renders so the page stays responsive
      await new Promise(resolve => setTimeout(resolve, 0))
      // One broken item shouldn't leave every thumbnail after it blank
      try {
        const url = await renderItem(renderer, item)
        cache[item.type] = url
        onUpdate(item.type, url)
      } catch (error) {
        console.error(`Failed to render thumbnail for ${item.type}:`, error)
      }
    }
    writeCache(cache)
  } finally {
    renderer.dispose()
    renderer.forceContextLoss()
  }
}

// ---------- Room style previews ----------

const styleCache = new Map<string, string>()
const STYLE_CACHE_KEY = 'perlink-room-style-thumbs-v2'

/** Render each room style as a small isometric room (cached per session and in localStorage) */
export async function loadRoomStyleThumbnails(presets: { name: string; style: Partial<RoomStyle> }[], onUpdate: (name: string, url: string) => void) {
  let stored: Record<string, string> = {}
  try {
    stored = JSON.parse(localStorage.getItem(STYLE_CACHE_KEY) || '{}')
  } catch {
    stored = {}
  }
  const missing = presets.filter((p) => {
    const url = styleCache.get(p.name) || stored[p.name]
    if (url) onUpdate(p.name, url)
    return !url
  })
  if (!missing.length) return

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1)
  renderer.setSize(256, 192, false)
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true

  try {
    for (const preset of missing) {
      const style: RoomStyle = { ...DEFAULT_ROOM_STYLE, ...preset.style }
      const scene = new THREE.Scene()
      scene.add(new THREE.HemisphereLight('#ffffff', '#8a8a8a', 1.3))
      const sun = new THREE.DirectionalLight('#fff2dd', 2.2)
      sun.position.set(8, 12, 9)
      sun.castShadow = true
      scene.add(sun)
      const shell = buildRoomShell(style)
      await shell.ready
      scene.add(shell.group)
      const camera = new THREE.PerspectiveCamera(30, 256 / 192, 0.1, 100)
      camera.position.set(11, 9, 11)
      camera.lookAt(0, 0.9, 0)
      renderer.render(scene, camera)
      const url = renderer.domElement.toDataURL('image/webp', 0.85)
      styleCache.set(preset.name, url)
      stored[preset.name] = url
      onUpdate(preset.name, url)
      shell.group.traverse((obj) => {
        if (obj.userData.shared) return
        const mesh = obj as THREE.Mesh
        mesh.geometry?.dispose()
      })
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    try {
      localStorage.setItem(STYLE_CACHE_KEY, JSON.stringify(stored))
    } catch {
      // Storage full: previews are re-rendered next time
    }
  } finally {
    renderer.dispose()
    renderer.forceContextLoss()
  }
}
