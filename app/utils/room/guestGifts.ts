import * as THREE from 'three'
import type { RoomStyle } from '~/types/room'
import type { GuestGiftType } from '#shared/guestbook'

// Small low-poly gifts that visitors leave with guestbook messages. They are
// built from primitives (no model files to load) and stand on the lawn in
// front of the room's open sides.

const std = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...extra })

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

function flower() {
  const g = new THREE.Group()
  const paper = std('#f6e7d8')
  const cone = mesh(new THREE.ConeGeometry(0.11, 0.32, 10, 1, true), paper, 0, 0.16, 0)
  cone.rotation.x = Math.PI
  g.add(cone)
  const colors = ['#ff6b8b', '#ffb347', '#ff8fb1', '#e04f7a', '#fff0a8']
  colors.forEach((color, i) => {
    const angle = (i / colors.length) * Math.PI * 2
    const r = i === colors.length - 1 ? 0 : 0.07
    g.add(mesh(new THREE.SphereGeometry(0.055, 10, 8), std(color), Math.cos(angle) * r, 0.36 + (i % 2) * 0.03, Math.sin(angle) * r))
  })
  for (let i = 0; i < 3; i++) {
    const leaf = mesh(new THREE.SphereGeometry(0.045, 8, 6), std('#4f9d5d'), Math.cos(i * 2.1) * 0.09, 0.3, Math.sin(i * 2.1) * 0.09)
    leaf.scale.set(1, 0.4, 1.6)
    g.add(leaf)
  }
  return g
}

function giftBox() {
  const g = new THREE.Group()
  const box = std('#e5484d')
  const ribbon = std('#ffd166', { metalness: 0.3, roughness: 0.35 })
  g.add(mesh(new THREE.BoxGeometry(0.3, 0.24, 0.3), box, 0, 0.12, 0))
  g.add(mesh(new THREE.BoxGeometry(0.32, 0.05, 0.32), box, 0, 0.255, 0))
  g.add(mesh(new THREE.BoxGeometry(0.06, 0.28, 0.325), ribbon, 0, 0.14, 0))
  g.add(mesh(new THREE.BoxGeometry(0.325, 0.28, 0.06), ribbon, 0, 0.14, 0))
  for (const side of [-1, 1]) {
    const bow = mesh(new THREE.TorusGeometry(0.05, 0.016, 6, 14), ribbon, side * 0.045, 0.31, 0)
    bow.rotation.set(0, Math.PI / 2, side * 0.6)
    g.add(bow)
  }
  return g
}

function cake() {
  const g = new THREE.Group()
  g.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 20), std('#f2c6a0'), 0, 0.06, 0))
  g.add(mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.03, 20), std('#ffffff'), 0, 0.125, 0))
  g.add(mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 18), std('#ff9fbf'), 0, 0.19, 0))
  g.add(mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.02, 18), std('#ffffff'), 0, 0.245, 0))
  g.add(mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.09, 6), std('#7cc6fe'), 0, 0.3, 0))
  const flame = mesh(new THREE.SphereGeometry(0.02, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffcf5c' }), 0, 0.36, 0)
  flame.scale.y = 1.6
  flame.castShadow = false
  g.add(flame)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    g.add(mesh(new THREE.SphereGeometry(0.018, 6, 5), std('#e5484d'), Math.cos(a) * 0.17, 0.14, Math.sin(a) * 0.17))
  }
  return g
}

function balloon(seed: number) {
  const g = new THREE.Group()
  const float = new THREE.Group()
  float.name = 'float'
  const color = ['#ff5d73', '#5ab0ff', '#ffc94d', '#9b7bff'][seed % 4]!
  const ball = mesh(new THREE.SphereGeometry(0.16, 18, 14), std(color, { roughness: 0.25, metalness: 0.1 }), 0, 0.95, 0)
  ball.scale.y = 1.15
  float.add(ball)
  float.add(mesh(new THREE.ConeGeometry(0.03, 0.05, 8), std(color), 0, 0.77, 0))
  const string = mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.72, 4), std('#f5f5f5'), 0, 0.39, 0)
  string.castShadow = false
  float.add(string)
  g.add(float)
  g.add(mesh(new THREE.BoxGeometry(0.07, 0.05, 0.07), std('#8a8f98'), 0, 0.025, 0))
  return g
}

function bear() {
  const g = new THREE.Group()
  const fur = std('#b9835a', { roughness: 0.9 })
  const light = std('#e8c9a6', { roughness: 0.9 })
  const dark = std('#2b211b')
  g.add(mesh(new THREE.SphereGeometry(0.13, 14, 12), fur, 0, 0.13, 0))
  g.add(mesh(new THREE.SphereGeometry(0.08, 12, 10), light, 0, 0.12, 0.07))
  g.add(mesh(new THREE.SphereGeometry(0.1, 14, 12), fur, 0, 0.31, 0.01))
  g.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), light, 0, 0.29, 0.09))
  g.add(mesh(new THREE.SphereGeometry(0.016, 8, 6), dark, 0, 0.3, 0.13))
  for (const side of [-1, 1]) {
    g.add(mesh(new THREE.SphereGeometry(0.038, 10, 8), fur, side * 0.075, 0.39, 0))
    g.add(mesh(new THREE.SphereGeometry(0.012, 6, 5), dark, side * 0.035, 0.33, 0.085))
    g.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), fur, side * 0.12, 0.17, 0.03))
    g.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), fur, side * 0.07, 0.04, 0.08))
  }
  return g
}

function star() {
  const g = new THREE.Group()
  const float = new THREE.Group()
  float.name = 'float'
  const shape = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.07 : 0.17
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r)
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 })
  geometry.center()
  const body = mesh(geometry, std('#ffd34d', { emissive: '#ffb703', emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.3 }), 0, 0.55, 0)
  float.add(body)
  g.add(float)
  const post = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.38, 5), std('#c9a227'), 0, 0.19, 0)
  g.add(post)
  return g
}

const BUILDERS: Record<GuestGiftType, (seed: number) => THREE.Group> = { flower, gift: giftBox, cake, balloon, bear, star }

/** seed: any whole number per gift, so its colour stays the same between visits */
export function buildGuestGift(type: GuestGiftType, seed: number): THREE.Group {
  const group = (BUILDERS[type] ?? giftBox)(seed)
  group.userData.gift = type
  return group
}

/**
 * Where the n-th gift stands: rings around the room's open corner (+x, +z),
 * just outside its walls, newest closest. Returns x, z and a turn to face out.
 */
export function guestGiftSpot(index: number, style: Pick<RoomStyle, 'width' | 'depth'>) {
  const hw = style.width / 2
  const hd = style.depth / 2
  let row = 0
  let start = 0
  let perRow = 9
  while (index >= start + perRow) {
    start += perRow
    row++
    perRow = 9 + row * 3
  }
  const slot = index - start
  // Spread across the quarter, a little off-grid so rows don't line up
  const a = 0.14 + ((slot + 0.5) / perRow) * (Math.PI / 2 - 0.28) + (row % 2 ? 0.05 : 0)
  const sin = Math.sin(a)
  const cos = Math.cos(a)
  const edge = Math.min(sin > 0.01 ? hw / sin : Infinity, cos > 0.01 ? hd / cos : Infinity)
  const r = edge + 0.75 + row * 0.7
  return { x: sin * r, z: cos * r, rotation: a + Math.PI }
}

/** Balloons and stars bob and turn gently */
export function animateGuestGift(group: THREE.Group, time: number, seed: number) {
  const float = group.getObjectByName('float')
  if (float) {
    float.position.y = Math.sin(time * 1.6 + seed) * 0.04
    float.rotation.y = Math.sin(time * 0.7 + seed) * 0.3
  }
}
