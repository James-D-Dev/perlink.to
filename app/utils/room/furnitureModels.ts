import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { furnitureModelUrl, type FurnitureModelName } from './modelManifest'

// Furniture from Quaternius' low-poly packs (CC0, via poly.pizza), prepared in
// Blender: one mesh per item, metres, origin at the centre of its base, facing
// +z, Draco-compressed, in /public/models/furniture/<type>.glb.
//
// The parts the room's colour picker paints have materials named "Tint" (the
// colour itself) and "TintDark" (a shade darker, for trims and folds), so a
// room saved with the old box-built furniture keeps its colours. Parts named
// with "Glow" (a lamp's shade or bulb, a screen) light up as night falls;
// "TintGlow" is both. A part named "Sky" (a window's glass) shows the sky
// outside: blue by day, dark at night (RoomScene keeps it in step).
// Wall-mounted models are centred vertically with their back on z = 0.

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
function loadFurniture(name: FurnitureModelName): Promise<THREE.Object3D> {
  let promise = cache.get(name)
  if (!promise) {
    promise = gltfLoader().loadAsync(furnitureModelUrl(name)).then((gltf) => {
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
const isGlow = (material: THREE.Material) => /glow/i.test(material.name)
const isSky = (material: THREE.Material) => /^sky/i.test(material.name)

/**
 * Put a copy of the furniture model in `group`, its tint parts painted
 * `color`. Each copy gets its own tint materials (the room disposes them with
 * the object); everything else stays shared.
 */
export async function attachFurnitureModel(group: THREE.Group, name: FurnitureModelName, color: string) {
  const template = await loadFurniture(name)
  const model = template.clone(true)
  const tint = new THREE.Color(color)
  const tints = new Map<THREE.Material, THREE.Material>()
  model.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh) return
    const swap = (material: THREE.Material) => {
      if (!isTint(material) && !isGlow(material) && !isSky(material)) return material
      let own = tints.get(material)
      if (!own) {
        const copy = material.clone() as THREE.MeshStandardMaterial
        copy.userData = {}
        if (isTint(material)) copy.color.copy(tint).multiplyScalar(isDark(material) ? 0.78 : 1)
        if (isGlow(material)) {
          // Screens glow a soft blue all day; lamp shades are faint by day and
          // bright at night, like the box-built lamps were (RoomScene)
          const screen = /screen/i.test(material.name)
          copy.emissive.set(screen ? '#3a7bd5' : copy.color)
          copy.emissiveIntensity = screen ? 0.35 : 0.15
          copy.userData.glow = true
          copy.userData.baseGlow = screen ? 0.35 : 0.15
          copy.userData.nightGlow = screen ? 0.5 : 2.2
        }
        if (isSky(material)) {
          copy.emissive.set('#9fd3ff')
          copy.emissiveIntensity = 0.6
          copy.roughness = 0.1
          copy.userData.sky = true
        }
        own = copy
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
export function preloadFurniture(names: FurnitureModelName[]) {
  for (const name of names) loadFurniture(name).catch(() => {})
}
