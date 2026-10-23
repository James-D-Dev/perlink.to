import * as THREE from 'three'
import { ROOM_CATALOG, type CatalogItem } from './catalog'

// Renders each catalog model once into a small PNG so the editor can show
// real previews. Results are cached in memory and in localStorage.

const SIZE = 192
// Bump when catalog models change so cached thumbnails are regenerated
const CACHE_KEY = 'perlink-room-thumbs-v1'

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

function renderItem(renderer: THREE.WebGLRenderer, item: CatalogItem): string {
  const scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight('#ffffff', '#b8a99a', 1.6))
  const key = new THREE.DirectionalLight('#ffffff', 2.2)
  key.position.set(3, 5, 4)
  scene.add(key)

  const model = item.build(item.defaultColor)
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
      const url = renderItem(renderer, item)
      cache[item.type] = url
      onUpdate(item.type, url)
    }
    writeCache(cache)
  } finally {
    renderer.dispose()
    renderer.forceContextLoss()
  }
}
