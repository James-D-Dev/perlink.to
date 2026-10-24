import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { createFlame } from './flame'

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
    // The low-poly fire is replaced by an animated flame (see addFlames)
    material.visible = false
    material.userData.fire = true
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
  addFlames(group, model)
}

/** Vertices of the parts of a model drawn with materials matching `test`, in `group` space */
function verticesOf(group: THREE.Group, model: THREE.Object3D, test: (m: THREE.Material) => boolean) {
  group.updateMatrixWorld(true)
  const toGroup = group.matrixWorld.clone().invert()
  const points: THREE.Vector3[] = []
  model.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    const matrix = toGroup.clone().multiply(mesh.matrixWorld)
    const position = mesh.geometry.attributes.position!
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const ranges = mesh.geometry.groups.length
      ? mesh.geometry.groups.filter(g => test(materials[g.materialIndex ?? 0]!)).map(g => [g.start, g.start + g.count])
      : test(materials[0]!) ? [[0, position.count]] : []
    for (const [start, end] of ranges) {
      for (let i = start!; i < Math.min(end!, position.count); i++) {
        points.push(new THREE.Vector3().fromBufferAttribute(position, i).applyMatrix4(matrix))
      }
    }
  })
  return points
}

/**
 * Light the model: a flame on the wick of every candle (candles are found by
 * grouping the wax geometry by position), and one replacing a torch's fire.
 */
function addFlames(group: THREE.Group, model: THREE.Object3D) {
  const fire = verticesOf(group, model, m => !!m.userData.fire)
  if (fire.length) {
    const box = new THREE.Box3().setFromPoints(fire)
    const size = box.getSize(new THREE.Vector3())
    const base = box.getCenter(new THREE.Vector3()).setY(box.min.y + size.y * 0.05)
    group.add(createFlame(base, size.y * 1.9, Math.max(size.x, size.z) * 1.5))
    return
  }
  const wax = verticesOf(group, model, m => /^candle/i.test(m.name))
  if (!wax.length) return
  // Each separate piece of wax is one candle: join triangles that share a vertex
  const parent = new Map<number, number>()
  const find = (i: number): number => {
    let root = i
    while (parent.get(root) !== root) root = parent.get(root)!
    parent.set(i, root)
    return root
  }
  const byPosition = new Map<string, number>()
  const keyOf = (p: THREE.Vector3) => `${p.x.toFixed(4)},${p.y.toFixed(4)},${p.z.toFixed(4)}`
  for (let tri = 0; tri < wax.length / 3; tri++) {
    parent.set(tri, tri)
    for (let v = 0; v < 3; v++) {
      const key = keyOf(wax[tri * 3 + v]!)
      const other = byPosition.get(key)
      if (other === undefined) byPosition.set(key, tri)
      else parent.set(find(tri), find(other))
    }
  }
  const pieces = new Map<number, THREE.Vector3[]>()
  wax.forEach((p, i) => {
    const root = find(Math.floor(i / 3))
    if (!pieces.has(root)) pieces.set(root, [])
    pieces.get(root)!.push(p)
  })
  // Low-poly candle tops are slanted, so centre on the candle's footprint, then
  // on its wick (the dark part sticking out of the top) when there is one
  const wicks = verticesOf(group, model, m => /^black/i.test(m.name))
  const box = new THREE.Box3()
  const candles = [...pieces.values()].map((points) => {
    box.setFromPoints(points)
    const x = (box.min.x + box.max.x) / 2
    const z = (box.min.z + box.max.z) / 2
    const radius = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2
    const wick = wicks.filter(p => Math.hypot(p.x - x, p.z - z) < radius && p.y > box.max.y - 0.03)
    if (wick.length) {
      const w = new THREE.Box3().setFromPoints(wick)
      return { x: (w.min.x + w.max.x) / 2, z: (w.min.z + w.max.z) / 2, top: w.max.y }
    }
    return { x, z, top: box.max.y }
  })
  // A wick or drip modelled as its own piece belongs to the candle under it
  const merged: typeof candles = []
  for (const c of candles.sort((a, b) => b.top - a.top)) {
    if (!merged.some(m => Math.hypot(m.x - c.x, m.z - c.z) < 0.03)) merged.push(c)
  }
  for (const c of merged) group.add(createFlame(new THREE.Vector3(c.x, c.top + 0.004, c.z), 0.075, 0.035))
}
