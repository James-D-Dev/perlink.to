import * as THREE from 'three'

// Phones: every physically based material (Standard, Physical) becomes a
// Lambert one, in place. Lambert's shader is a fraction of the size, so a
// first visit compiles far less (the screen froze for seconds compiling the
// room's 29 shader programs on a cold cache), and each pixel costs less.
// Clearcoat, sheen and reflections go; colours, textures, glow, transparency
// and the wind / breeze vertex tweaks (they only touch vertex chunks both
// shaders share) stay.
//
// In place, not a new material: lamps, clouds and night glows keep changing
// the same material objects the scene holds on to.

let enabled = false
const done = new WeakSet<THREE.Material>()

export function setLightMaterials(on: boolean) {
  enabled = on
}
export const lightMaterialsOn = () => enabled

export function lighten(object: THREE.Object3D) {
  if (!enabled) return
  object.traverse((child) => {
    const material = (child as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
    if (!material) return
    if (Array.isArray(material)) material.forEach(toLambert)
    else toLambert(material)
  })
}

function toLambert(material: THREE.Material) {
  if (done.has(material)) return
  done.add(material)
  const m = material as THREE.MeshStandardMaterial & { transmission?: number, _transmission?: number }
  if (!m.isMeshStandardMaterial) return
  // See-through glass without the extra pass transmission needs
  const transmission = m._transmission ?? 0
  if (transmission > 0) {
    m.transparent = true
    m.opacity = Math.min(m.opacity, 0.6)
    m.depthWrite = false
  }
  Object.setPrototypeOf(m, THREE.MeshLambertMaterial.prototype)
  const l = m as unknown as THREE.MeshLambertMaterial & Record<string, unknown>
  l.isMeshStandardMaterial = false
  l.isMeshPhysicalMaterial = false
  l.isMeshLambertMaterial = true
  l.type = 'MeshLambertMaterial'
  l.defines = {}
  // Lambert's own settings, at its defaults
  l.specularMap = null
  l.combine = THREE.MultiplyOperation
  l.reflectivity = 1
  l.refractionRatio = 0.98
  // A reflection map multiplied into a matte colour only darkens it
  l.envMap = null
  l.needsUpdate = true
}
