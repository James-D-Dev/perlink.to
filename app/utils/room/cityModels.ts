import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

// Quaternius' LowPoly Buildings Pack (CC0), served from /public/models/city
// as OBJ + MTL. Each building is baked into two vertex-coloured meshes (walls
// and windows), so it costs two draw calls whatever its material count.

const BASE = '/models/city/'
/** Window panes use the dark material; it's also on roofs, so only upright faces count as glass */
const GLASS = /darkgrey/i
/** Share of windows lit at night */
const LIT = 0.6

interface CityModel {
  body: THREE.BufferGeometry
  windows: THREE.BufferGeometry | null
  /** Footprint and height in pack units, after centering on the origin */
  size: THREE.Vector3
}

const cache = new Map<string, Promise<CityModel>>()

/** Shared materials; the land dims the walls and lights the windows at night */
export const cityMaterials = {
  body: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }),
  windows: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.25, metalness: 0.2, emissive: new THREE.Color('#ffcf7a'), emissiveIntensity: 0 }),
}
cityMaterials.body.userData.shared = true
cityMaterials.windows.userData.shared = true

function bake(parts: { positions: number[]; normals: number[]; colors: number[] }) {
  if (!parts.positions.length) return null
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(parts.positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(parts.normals, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(parts.colors, 3))
  return geometry
}

export function loadCityModel(name: string): Promise<CityModel> {
  let promise = cache.get(name)
  if (!promise) {
    promise = new MTLLoader().setPath(BASE).loadAsync(`${name}.mtl`).then(async (materials) => {
      materials.preload()
      const obj = await new OBJLoader().setMaterials(materials).setPath(BASE).loadAsync(`${name}.obj`)
      obj.updateMatrixWorld(true)
      const body = { positions: [] as number[], normals: [] as number[], colors: [] as number[] }
      const glass = { positions: [] as number[], normals: [] as number[], colors: [] as number[] }
      const p = new THREE.Vector3()
      const n = new THREE.Vector3()
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        const geometry = mesh.geometry
        const position = geometry.attributes.position!
        const normal = geometry.attributes.normal
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        const groups = geometry.groups.length ? geometry.groups : [{ start: 0, count: position.count, materialIndex: 0 }]
        for (const group of groups) {
          const material = mats[group.materialIndex ?? 0] as THREE.MeshPhongMaterial
          // The pack's Kd values are linear but MTLLoader reads them as sRGB
          const color = material.color.clone().convertLinearToSRGB()
          const maybeGlass = GLASS.test(material.name)
          const end = Math.min(group.start + group.count, position.count)
          // Triangle by triangle, so upright panes can be told apart from roofs.
          // A pane's two triangles come one after the other, so they share one lit/unlit pick.
          let litPane = false
          for (let i = group.start; i + 2 < end; i += 3) {
            const tri: THREE.Vector3[] = []
            const normals: THREE.Vector3[] = []
            for (let k = 0; k < 3; k++) {
              tri.push(new THREE.Vector3().fromBufferAttribute(position, i + k).applyMatrix4(mesh.matrixWorld))
              normals.push(normal ? new THREE.Vector3().fromBufferAttribute(normal, i + k).applyMatrix3(normalMatrix).normalize() : new THREE.Vector3(0, 1, 0))
            }
            let target = body
            if (maybeGlass && Math.abs(normals[0]!.y + normals[1]!.y + normals[2]!.y) / 3 < 0.3) {
              if (((i - group.start) / 3) % 2 === 0) {
                p.copy(tri[0]!).add(tri[1]!).add(tri[2]!).divideScalar(3)
                const h = Math.sin(p.x * 12.9898 + p.y * 78.233 + p.z * 37.719) * 43758.5453
                litPane = h - Math.floor(h) < LIT
              }
              if (litPane) target = glass
            }
            for (let k = 0; k < 3; k++) {
              n.copy(normals[k]!)
              target.positions.push(tri[k]!.x, tri[k]!.y, tri[k]!.z)
              target.normals.push(n.x, n.y, n.z)
              target.colors.push(color.r, color.g, color.b)
            }
          }
        }
        geometry.dispose()
      })
      const bodyGeometry = bake(body)!
      const windowGeometry = bake(glass)
      // Center the footprint on the origin with the base at y = 0
      bodyGeometry.computeBoundingBox()
      const box = bodyGeometry.boundingBox!.clone()
      if (windowGeometry) {
        windowGeometry.computeBoundingBox()
        box.union(windowGeometry.boundingBox!)
      }
      const center = box.getCenter(new THREE.Vector3())
      for (const g of [bodyGeometry, windowGeometry]) g?.translate(-center.x, -box.min.y, -center.z)
      return { body: bodyGeometry, windows: windowGeometry, size: box.getSize(new THREE.Vector3()) }
    })
    cache.set(name, promise)
  }
  return promise
}

/**
 * Add a building to `group` once loaded: centered at (x, z) on the ground,
 * turned by `rotation`, scaled from pack units to meters.
 */
export async function attachCityModel(group: THREE.Group, name: string, x: number, y: number, z: number, rotation: number, scale: number) {
  const model = await loadCityModel(name)
  const building = new THREE.Group()
  building.position.set(x, y, z)
  building.rotation.y = rotation
  building.scale.setScalar(scale)
  const parts: [THREE.BufferGeometry | null, THREE.Material][] = [[model.body, cityMaterials.body], [model.windows, cityMaterials.windows]]
  for (const [geometry, material] of parts) {
    if (!geometry) continue
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.userData.shared = true
    building.add(mesh)
  }
  building.userData.shared = true
  group.add(building)
  return model.size.clone().multiplyScalar(scale)
}

// ---------- Cars ----------
// Quaternius' Realistic Car Pack (CC0), served from /public/models/cars.
// Baked like the buildings, with the lights split out so they can glow.

const CAR_BASE = '/models/cars/'

interface CarModel {
  parts: Record<'body' | 'head' | 'tail' | 'siren', THREE.BufferGeometry | null>
}

const carCache = new Map<string, Promise<CarModel>>()

/** Shared car materials; the land switches the lights on at night and flashes the siren */
export const carMaterials = {
  body: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.45, metalness: 0.3 }),
  head: new THREE.MeshStandardMaterial({ color: '#fffbe6', emissive: new THREE.Color('#fff1c4'), emissiveIntensity: 0 }),
  tail: new THREE.MeshStandardMaterial({ color: '#7a1010', emissive: new THREE.Color('#ff2a2a'), emissiveIntensity: 0 }),
  siren: new THREE.MeshStandardMaterial({ color: '#1a3cff', emissive: new THREE.Color('#2f6bff'), emissiveIntensity: 0 }),
}
for (const m of Object.values(carMaterials)) m.userData.shared = true

/** Fan of light a headlight throws on the road: bright near the car, widening and fading ahead */
function beamTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const g = canvas.getContext('2d')!
  const fade = g.createLinearGradient(0, 0, 256, 0)
  fade.addColorStop(0, 'rgba(255,255,255,0.95)')
  fade.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  fade.addColorStop(1, 'rgba(255,255,255,0)')
  g.filter = 'blur(6px)'
  g.fillStyle = fade
  g.beginPath()
  g.moveTo(8, 50)
  g.lineTo(248, 8)
  g.lineTo(248, 120)
  g.lineTo(8, 78)
  g.closePath()
  g.fill()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Shared headlight beam material; the land fades it in at night */
export const beamMaterial = new THREE.MeshBasicMaterial({
  map: beamTexture(),
  color: '#fff1cc',
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  opacity: 0,
  fog: false,
})
beamMaterial.userData.shared = true
/** Beam patch in car units (the car models are ~4.2 units long, front at +x) */
const beamGeometry = new THREE.PlaneGeometry(7, 3.4).rotateX(-Math.PI / 2).translate(2 + 3.5, 0.06, 0)

function carPart(name: string): keyof CarModel['parts'] {
  if (/headlight|whitelight/i.test(name)) return 'head'
  if (/taillight/i.test(name)) return 'tail'
  if (/bluelight/i.test(name)) return 'siren'
  return 'body'
}

export function loadCarModel(name: string): Promise<CarModel> {
  let promise = carCache.get(name)
  if (!promise) {
    promise = new MTLLoader().setPath(CAR_BASE).loadAsync(`${name}.mtl`).then(async (materials) => {
      materials.preload()
      const obj = await new OBJLoader().setMaterials(materials).setPath(CAR_BASE).loadAsync(`${name}.obj`)
      obj.updateMatrixWorld(true)
      const buckets = {
        body: { positions: [] as number[], normals: [] as number[], colors: [] as number[] },
        head: { positions: [] as number[], normals: [] as number[], colors: [] as number[] },
        tail: { positions: [] as number[], normals: [] as number[], colors: [] as number[] },
        siren: { positions: [] as number[], normals: [] as number[], colors: [] as number[] },
      }
      const p = new THREE.Vector3()
      const n = new THREE.Vector3()
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        const position = mesh.geometry.attributes.position!
        const normal = mesh.geometry.attributes.normal
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        const groups = mesh.geometry.groups.length ? mesh.geometry.groups : [{ start: 0, count: position.count, materialIndex: 0 }]
        for (const group of groups) {
          const material = mats[group.materialIndex ?? 0] as THREE.MeshPhongMaterial
          const color = material.color.clone().convertLinearToSRGB()
          const target = buckets[carPart(material.name)]
          for (let i = group.start; i < Math.min(group.start + group.count, position.count); i++) {
            p.fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld)
            target.positions.push(p.x, p.y, p.z)
            if (normal) n.fromBufferAttribute(normal, i).applyMatrix3(normalMatrix).normalize()
            else n.set(0, 1, 0)
            target.normals.push(n.x, n.y, n.z)
            target.colors.push(color.r, color.g, color.b)
          }
        }
        mesh.geometry.dispose()
      })
      const parts = {
        body: bake(buckets.body),
        head: bake(buckets.head),
        tail: bake(buckets.tail),
        siren: bake(buckets.siren),
      }
      // Turn the car so its front (headlights) points along +x, base at y = 0, centered
      const box = new THREE.Box3()
      for (const g of Object.values(parts)) {
        if (!g) continue
        g.computeBoundingBox()
        box.union(g.boundingBox!)
      }
      const center = box.getCenter(new THREE.Vector3())
      parts.head?.computeBoundingBox()
      const frontZ = parts.head ? parts.head.boundingBox!.getCenter(new THREE.Vector3()).z - center.z : 1
      const turn = frontZ >= 0 ? Math.PI / 2 : -Math.PI / 2
      for (const g of Object.values(parts)) {
        g?.translate(-center.x, -box.min.y, -center.z)
        g?.rotateY(turn)
      }
      return { parts }
    })
    carCache.set(name, promise)
  }
  return promise
}

/** A car pointing along +x, filled in once its model has loaded; moving cars light the road ahead */
export function createCar(name: string, scale: number, beams = false) {
  const car = new THREE.Group()
  car.scale.setScalar(scale)
  car.userData.shared = true
  if (beams) {
    const beam = new THREE.Mesh(beamGeometry, beamMaterial)
    beam.renderOrder = 1
    beam.userData.shared = true
    car.add(beam)
  }
  loadCarModel(name).then(({ parts }) => {
    for (const key of Object.keys(parts) as (keyof typeof parts)[]) {
      const geometry = parts[key]
      if (!geometry) continue
      const mesh = new THREE.Mesh(geometry, carMaterials[key])
      mesh.castShadow = key === 'body'
      mesh.receiveShadow = key === 'body'
      mesh.userData.shared = true
      car.add(mesh)
    }
  }).catch(() => {})
  return car
}
