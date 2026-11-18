import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// Furniture from Quaternius' low-poly packs (CC0, via poly.pizza), prepared in
// Blender: one mesh per item, metres, origin at the centre of its base, facing
// +z, Draco-compressed, in /public/models/furniture/<type>.glb.
//
// The parts the room's colour picker paints have materials named "Tint" (the
// colour itself) and "TintDark" (a shade darker, for trims and folds), so a
// room saved with the old box-built furniture keeps its colours.

const BASE = '/models/furniture/'

let loader: GLTFLoader | null = null
function gltfLoader() {
  if (!loader) {
    const draco = new DRACOLoader().setDecoderPath('/draco/')
    loader = new GLTFLoader().setDRACOLoader(draco)
  }
  return loader
}

const cache = new Map<string, Promise<THREE.Object3D>>()

/** Load a model once; its untinted materials are shared by every copy */
function loadFurniture(name: string): Promise<THREE.Object3D> {
  let promise = cache.get(name)
  if (!promise) {
    promise = gltfLoader().loadAsync(`${BASE}${name}.glb`).then((gltf) => {
      gltf.scene.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.userData.shared = true
        for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          material.userData.shared = true
          // Low-poly faces read better without smoothing across hard edges
          ;(material as THREE.MeshStandardMaterial).flatShading = true
          material.needsUpdate = true
        }
      })
      return gltf.scene
    })
    cache.set(name, promise)
  }
  return promise
}

const isTint = (material: THREE.Material) => /^tint/i.test(material.name)
const isDark = (material: THREE.Material) => /dark/i.test(material.name)

/**
 * Put a copy of the furniture model in `group`, its tint parts painted
 * `color`. Each copy gets its own tint materials (the room disposes them with
 * the object); everything else stays shared.
 */
export async function attachFurnitureModel(group: THREE.Group, name: string, color: string) {
  const template = await loadFurniture(name)
  const model = template.clone(true)
  const tint = new THREE.Color(color)
  const tints = new Map<THREE.Material, THREE.Material>()
  model.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh) return
    const swap = (material: THREE.Material) => {
      if (!isTint(material)) return material
      let own = tints.get(material)
      if (!own) {
        own = material.clone()
        own.userData = { tint: true }
        ;(own as THREE.MeshStandardMaterial).color.copy(tint).multiplyScalar(isDark(material) ? 0.78 : 1)
        tints.set(material, own)
      }
      return own
    }
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material)
    // The mesh stays marked shared: its geometry is the cached model's. Its
    // own tint materials are small; they're left to the garbage collector.
  })
  group.add(model)
}

/** Start downloading the furniture models early (the editor's tray, a room with furniture) */
export function preloadFurniture(names: string[]) {
  for (const name of names) loadFurniture(name).catch(() => {})
}
