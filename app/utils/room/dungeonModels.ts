import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

// Quaternius' LowPoly Modular Dungeon Pack (CC0), served from
// /public/models/dungeon as OBJ + MTL with flat colours.

const BASE = '/models/dungeon/'
const METALS = /steel|gold/i
/** Materials that glow on specific models only (the material names are shared across the pack) */
const GLOWING: Record<string, string[]> = { Chest_gold: ['Gold'] }

const cache = new Map<string, Promise<THREE.Group>>()

/** Convert the loader's Phong materials to standard ones so they match the scene lighting */
function convertMaterial(source: THREE.Material, model: string): THREE.Material {
  const phong = source as THREE.MeshPhongMaterial
  const name = phong.name || ''
  // The pack's Kd values are linear (Blender export) but MTLLoader reads them as
  // sRGB, which makes everything far too dark; undo that conversion
  const color = phong.color?.clone().convertLinearToSRGB() ?? new THREE.Color('#cccccc')
  const metal = METALS.test(name)
  const material = new THREE.MeshStandardMaterial({
    name,
    color,
    flatShading: true,
    roughness: metal ? 0.4 : 0.85,
    metalness: metal ? 0.6 : 0,
  })
  if (GLOWING[model]?.includes(name)) {
    // Treasure: warm gold that lights itself, brighter at night
    material.color.set('#f5b52e')
    material.emissive.set('#ff9500')
    material.emissiveIntensity = 0.55
    material.metalness = 0.3
    material.roughness = 0.35
    material.userData.glow = true
    material.userData.baseGlow = 0.55
    material.userData.nightGlow = 0.6
  } else if (/fire/i.test(name)) {
    // Flames glow; the scene brightens them further at night
    material.emissive = color.clone()
    material.emissiveIntensity = 0.8
    material.userData.glow = true
    material.userData.baseGlow = 0.8
  } else if (/liquid|ice|glass/i.test(name)) {
    material.transparent = true
    material.opacity = /glass/i.test(name) ? 0.55 : 0.85
    material.emissive = color.clone()
    material.emissiveIntensity = 0.25
    material.roughness = 0.15
  }
  material.userData.shared = true
  return material
}

/** Load a model once; returns the raw scene in the pack's own units */
export function loadDungeonModel(name: string): Promise<THREE.Group> {
  let promise = cache.get(name)
  if (!promise) {
    promise = new MTLLoader().setPath(BASE).loadAsync(`${name}.mtl`).then(async (materials) => {
      materials.preload()
      const obj = await new OBJLoader().setMaterials(materials).setPath(BASE).loadAsync(`${name}.obj`)
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(m => convertMaterial(m, name)) : convertMaterial(mesh.material, name)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.userData.shared = true
      })
      return obj
    })
    cache.set(name, promise)
  }
  return promise
}

/**
 * Add a copy of a model to `group`, scaled from pack units to meters.
 * Floor items sit centered on the origin; wall items (which face +x in the
 * pack) are turned to face +z with their back on z = 0, centered vertically.
 */
export async function attachDungeonModel(group: THREE.Group, name: string, scale: number, wallMounted = false) {
  const template = await loadDungeonModel(name)
  const model = template.clone()
  model.scale.setScalar(scale)
  if (wallMounted) model.rotation.y = -Math.PI / 2
  model.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  if (wallMounted) model.position.set(-center.x, -center.y, -box.min.z)
  else model.position.set(-center.x, -box.min.y, -center.z)
  model.userData.shared = true
  group.add(model)
}
