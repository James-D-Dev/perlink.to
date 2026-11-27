import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { dracoLoader } from './draco'
import { flowerModelUrl, type FlowerName } from './modelManifest'

// Cut flowers for vases and pots: tulip, rose, daisy, lavender, made in
// Blender for Perlink (public/models/flowers, see docs/3d-models.md). Each
// stem stands on the origin, about 0.3 m tall; its "Petal" material takes the
// colour of each stem, so one model makes a whole mixed bouquet.

export interface FlowerStem {
  flower: FlowerName
  /** Petal colour */
  color: string
  /** Height of the flower head above the stem's base, metres */
  height: number
  x?: number
  y?: number
  z?: number
  /** Lean away from the centre (radians); bouquets fan out */
  lean?: number
  /** Turn about the stem (radians), so heads don't all face the same way */
  turn?: number
}

let loader: GLTFLoader | null = null
function gltfLoader() {
  if (!loader) loader = new GLTFLoader().setDRACOLoader(dracoLoader())
  return loader
}

const cache = new Map<FlowerName, Promise<THREE.Object3D>>()
function loadFlower(name: FlowerName) {
  let promise = cache.get(name)
  if (!promise) {
    promise = gltfLoader().loadAsync(flowerModelUrl(name)).then((gltf) => {
      gltf.scene.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.userData.shared = true
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          material.userData.shared = true
          ;(material as THREE.MeshStandardMaterial).flatShading = true
          material.side = THREE.DoubleSide
        }
      })
      // Its own height (stem base to the top of the head), which stems are scaled from
      gltf.scene.userData.height = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3()).y || 0.33
      return gltf.scene
    })
    cache.set(name, promise)
  }
  return promise
}

/** One petal material per colour, shared by every flower of that colour */
const petals = new Map<string, THREE.Material>()
function petalMaterial(template: THREE.Material, color: string) {
  const key = `${template.uuid}:${color}`
  let material = petals.get(key)
  if (!material) {
    const copy = template.clone() as THREE.MeshStandardMaterial
    copy.color.set(color)
    copy.userData = { shared: true }
    material = copy
    petals.set(key, material)
  }
  return material
}

/** Add a bouquet's stems to `group` */
export async function attachFlowers(group: THREE.Group, stems: FlowerStem[]) {
  const templates = await Promise.all(stems.map(stem => loadFlower(stem.flower)))
  stems.forEach((stem, i) => {
    const flower = templates[i]!.clone(true)
    flower.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const swap = (m: THREE.Material) => (/^petal/i.test(m.name) ? petalMaterial(m, stem.color) : m)
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material)
    })
    const x = stem.x ?? 0
    const z = stem.z ?? 0
    flower.scale.setScalar(stem.height / (templates[i]!.userData.height as number))
    flower.position.set(x, stem.y ?? 0, z)
    // Lean outward, away from the bouquet's centre, then turn the head
    const away = Math.atan2(z, x)
    const lean = stem.lean ?? 0
    flower.rotation.set(Math.sin(away) * lean, stem.turn ?? 0, -Math.cos(away) * lean, 'XYZ')
    group.add(flower)
  })
}
