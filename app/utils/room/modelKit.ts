import * as THREE from 'three'

// Building blocks for the premium room items (./premiumModels.ts): the same
// primitives as the catalog, plus animation. A part with `userData.tick`
// is called every frame by the room (RoomScene.updateObjectEffects) with
// the time in seconds and how lit the lamps are (0 by day, 1 at night).

export type Tick = (time: number, lamps: number) => void

/**
 * Whether a piano in the room is playing (the visitor clicked it): its keys
 * move with the music, and rest when it's quiet
 */
export const pianoState = { playing: false }

export function mat(color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts })
}

/** Glossy, coated material (balloons, ornaments, glaze) */
export function shiny(color: string, opts: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08, ...opts })
}

export function metal(color: string, roughness = 0.25) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.9 })
}

export function glass(tint = '#eaf6fb', opacity = 0.35) {
  // Clear-coated and see-through, without a transmission pass: reads as glass in every light
  return new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.05, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, transparent: true, opacity: Math.max(opacity, 0.3), depthWrite: false })
}

/**
 * Material that glows; the room raises it as night falls (baseGlow by day,
 * baseGlow + nightGlow at night)
 */
export function glow(color: string, base = 0, night = 2.4) {
  const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: base, roughness: 0.4 })
  m.userData.glow = true
  m.userData.baseGlow = base
  m.userData.nightGlow = night
  return m
}

export function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Box positioned by its bottom-center */
export function box(w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  return mesh(new THREE.BoxGeometry(w, h, d), material, x, y + h / 2, z)
}

/** Cylinder positioned by its bottom-center */
export function cyl(rTop: number, rBottom: number, h: number, material: THREE.Material, x = 0, y = 0, z = 0, segments = 24) {
  return mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), material, x, y + h / 2, z)
}

export function sphere(r: number, material: THREE.Material, x = 0, y = 0, z = 0, segments = 20) {
  return mesh(new THREE.SphereGeometry(r, segments, Math.round(segments * 0.7)), material, x, y, z)
}

export function group(...children: THREE.Object3D[]) {
  const g = new THREE.Group()
  if (children.length) g.add(...children)
  return g
}

/** A turned shape from [radius, height] points */
export function lathe(profile: [number, number][], material: THREE.Material, y = 0, segments = 40) {
  return mesh(new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), segments), material, 0, y)
}

/** A cylinder between two points (strings, branches, struts) */
export function rod(from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material, radiusEnd = radius, segments = 6) {
  const m = mesh(new THREE.CylinderGeometry(radiusEnd, radius, from.distanceTo(to), segments), material)
  m.position.copy(from).add(to).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize())
  return m
}

export const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/** Parts that fly around a model (particles, orbits): thumbnails frame the model without them */
export function loose<T extends THREE.Object3D>(obj: T): T {
  obj.userData.ignoreBounds = true
  return obj
}

/** Makes `obj` animate; runs once right away so thumbnails show a nice pose */
export function animate<T extends THREE.Object3D>(obj: T, tick: Tick): T {
  obj.userData.tick = tick
  tick(0, 0.6)
  return obj
}

/** The same random numbers every time for a given seed, so models look the same everywhere */
export function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const dummy = new THREE.Object3D()

/**
 * Many small copies of one shape drawn at once (confetti, petals, bubbles,
 * sparks). `place(i, t, dummy)` positions copy i at time t; return false to
 * hide it.
 */
export function swarm(count: number, geometry: THREE.BufferGeometry, material: THREE.Material, place: (i: number, t: number, d: THREE.Object3D) => boolean | void, colors?: string[]) {
  const instanced = new THREE.InstancedMesh(geometry, material, count)
  instanced.castShadow = false
  instanced.receiveShadow = false
  instanced.frustumCulled = false
  if (colors) {
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) instanced.setColorAt(i, c.set(colors[i % colors.length]!))
  }
  return animate(instanced, (t) => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(0, 0, 0)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.setScalar(1)
      if (place(i, t, dummy) === false) dummy.scale.setScalar(0)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
    }
    instanced.instanceMatrix.needsUpdate = true
  })
}

/** 0 → 1 → 0 over a loop of `period` seconds, offset by `phase` */
export const loop = (t: number, period: number, phase = 0) => (((t + phase) % period) + period) % period / period

/** A heartbeat: two quick pulses, then rest (0..1) */
export function heartbeat(t: number, bpm = 60) {
  const p = loop(t, 60 / bpm)
  const pulse = (c: number, w: number) => Math.exp(-((p - c) ** 2) / w)
  return Math.min(1, pulse(0.1, 0.002) + 0.7 * pulse(0.28, 0.003))
}

// ---------- Shapes ----------

/** A heart outline about 0.94 wide and 0.78 tall, centred on the origin */
export function heartShape() {
  const h = new THREE.Shape()
  h.moveTo(0, 0.22)
  h.bezierCurveTo(0, 0.27, -0.05, 0.4, -0.22, 0.4)
  h.bezierCurveTo(-0.47, 0.4, -0.47, 0.12, -0.47, 0.12)
  h.bezierCurveTo(-0.47, -0.04, -0.32, -0.2, 0, -0.38)
  h.bezierCurveTo(0.32, -0.2, 0.47, -0.04, 0.47, 0.12)
  h.bezierCurveTo(0.47, 0.12, 0.47, 0.4, 0.22, 0.4)
  h.bezierCurveTo(0.05, 0.4, 0, 0.27, 0, 0.22)
  return h
}

/** A unit puffy heart geometry (0.94 wide, about 0.3 thick), centred. A new one each call: the room frees geometry with its object */
export function heartGeometry() {
  const geometry = new THREE.ExtrudeGeometry(heartShape(), { depth: 0.12, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.05, bevelSegments: 4, curveSegments: 16 })
  geometry.center()
  return geometry
}

/** A puffy 3D heart of the given width and total thickness, facing +z */
export function heart(width: number, depth: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  const d = depth * 0.94 / width
  const geometry = new THREE.ExtrudeGeometry(heartShape(), { depth: d * 0.4, bevelEnabled: true, bevelThickness: d * 0.3, bevelSize: 0.05, bevelSegments: 6, curveSegments: 24 })
  geometry.center()
  const m = mesh(geometry, material, x, y, z)
  m.scale.setScalar(width / 0.94)
  return m
}

/** A rose bloom: a cup of petals around a curled centre */
export function rose(color: string, r: number, x: number, y: number, z: number) {
  const petal = mat(color, { roughness: 0.55 })
  const dark = mat(new THREE.Color(color).offsetHSL(0, 0.05, -0.12).getStyle(), { roughness: 0.6 })
  const bloom = new THREE.Group()
  const cup = mesh(new THREE.SphereGeometry(r, 16, 10, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.65), petal)
  cup.rotation.x = Math.PI
  cup.position.y = r * 0.35
  const centre = mesh(new THREE.TorusKnotGeometry(r * 0.38, r * 0.16, 40, 6, 2, 3), dark, 0, r * 0.55, 0)
  centre.rotation.x = Math.PI / 2
  bloom.add(cup, centre)
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const outer = mesh(new THREE.SphereGeometry(r * 0.55, 10, 8), petal, Math.cos(a) * r * 0.75, r * 0.15, Math.sin(a) * r * 0.75)
    outer.scale.set(1, 0.55, 0.7)
    outer.rotation.y = -a
    bloom.add(outer)
  }
  bloom.position.set(x, y, z)
  return bloom
}

/** A five-petal blossom (peach, apricot) as one small mesh */
export function blossomGeometry(r: number) {
  const shape = new THREE.Shape()
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const b = a + Math.PI / 5
    const x1 = Math.cos(a) * r
    const y1 = Math.sin(a) * r
    if (i === 0) shape.moveTo(x1, y1)
    shape.quadraticCurveTo(Math.cos(b) * r * 1.5, Math.sin(b) * r * 1.5, Math.cos(a + (2 * Math.PI) / 5) * r, Math.sin(a + (2 * Math.PI) / 5) * r)
  }
  const g = new THREE.ShapeGeometry(shape, 6)
  g.rotateX(-Math.PI / 2)
  return g
}

/** A balloon: a slightly pear-shaped sphere with a knot */
export function balloon(color: string, r: number) {
  const m = shiny(color)
  const body = mesh(new THREE.SphereGeometry(r, 24, 18), m)
  body.scale.set(1, 1.18, 1)
  const knot = mesh(new THREE.ConeGeometry(r * 0.14, r * 0.2, 10), m, 0, -r * 1.22, 0)
  knot.rotation.x = Math.PI
  return group(body, knot)
}

/** A canvas drawn once and used as a texture */
export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d')!)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

// ---------- Detailed roses ----------

/** One rose petal: a rounded, cupped blade whose tip curls back (base at the origin, pointing up +y, cupped towards +z) */
function petalGeometry() {
  const g = new THREE.PlaneGeometry(1, 1.1, 6, 8)
  const pos = g.attributes.position!
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const v = (y + 0.55) / 1.1 // 0 at the base, 1 at the tip
    // Narrow at the base, round at the top
    const w = Math.sin(Math.min(1, v * 1.15) * Math.PI * 0.62 + 0.25) * (v > 0.85 ? 1 - (v - 0.85) * 1.2 : 1)
    const nx = x * w
    // Cupped across, curling outward at the tip
    const z = -1.1 * nx * nx + 0.35 * Math.max(0, v - 0.6) ** 2 * 3
    pos.setXYZ(i, nx, v * 1.1, -z)
  }
  g.computeVertexNormals()
  return g
}

export interface RoseSpot {
  /** Centre of the bloom */
  p: THREE.Vector3
  /** Which way the bloom faces */
  n: THREE.Vector3
  /** Bloom radius in metres (about 0.04 for a garden rose) */
  size: number
  color: string
  /** 0 = tight bud .. 1 = fully open */
  open?: number
  spin?: number
}

const PETALS_PER_ROSE = 14
const UP = new THREE.Vector3(0, 1, 0)

/**
 * Many detailed roses drawn in one go: each bloom is 14 cupped petals in a
 * spiral, tight in the middle and opening outward, with a shaded heart.
 */
export function roses(spots: RoseSpot[]) {
  const count = spots.length * PETALS_PER_ROSE
  const petalMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55, side: THREE.DoubleSide })
  const petals = new THREE.InstancedMesh(petalGeometry(), petalMat, count)
  petals.castShadow = true
  petals.receiveShadow = true
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const local = new THREE.Quaternion()
  const euler = new THREE.Euler()
  const pos = new THREE.Vector3()
  const scale = new THREE.Vector3()
  const color = new THREE.Color()
  const dark = new THREE.Color()
  spots.forEach((s, j) => {
    q.setFromUnitVectors(UP, s.n.clone().normalize())
    const open = s.open ?? 0.85
    const spin = s.spin ?? j * 2.39
    const base = new THREE.Color(s.color)
    for (let k = 0; k < PETALS_PER_ROSE; k++) {
      // Golden-angle spiral; inner petals small and upright, outer ones big and splayed
      const t = k / (PETALS_PER_ROSE - 1)
      const angle = spin + k * 2.39996
      const tilt = 0.12 + t * t * (0.5 + open * 1.0)
      const size = s.size * (0.45 + t * 0.75)
      const radius = s.size * t * 0.32
      euler.set(tilt, angle, 0, 'YXZ')
      local.setFromEuler(euler)
      pos.set(Math.sin(angle) * radius, -s.size * 0.35 * t, Math.cos(angle) * radius).applyQuaternion(q).add(s.p)
      scale.set(size * (0.8 + t * 0.4), size, size)
      m.compose(pos, q.clone().multiply(local), scale)
      petals.setMatrixAt(j * PETALS_PER_ROSE + k, m)
      // Inner petals deeper in colour, outer ones lighter
      dark.copy(base).offsetHSL(0, 0.02, -0.12 * (1 - t))
      color.copy(dark).lerp(base.clone().offsetHSL(0, -0.05, 0.05), t * 0.6)
      petals.setColorAt(j * PETALS_PER_ROSE + k, color)
    }
  })
  petals.instanceMatrix.needsUpdate = true
  if (petals.instanceColor) petals.instanceColor.needsUpdate = true
  return petals
}

/** Rose leaves: pointed, with a fold down the middle (base at the origin, pointing +y) */
export function roseLeafGeometry(length: number) {
  const g = new THREE.PlaneGeometry(0.55, 1, 4, 6)
  const pos = g.attributes.position!
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i) + 0.5
    const w = Math.sin(y * Math.PI) ** 0.8 * (1 - y * 0.35)
    pos.setXYZ(i, x * w * length, y * length, Math.abs(x * w) * length * 0.25 - y * y * length * 0.12)
  }
  g.computeVertexNormals()
  return g
}

/**
 * A photo-studio reflection (dark room, soft white light strips) for glossy
 * finishes, so lacquer and gold catch highlights on any land. Null where
 * there's no canvas (server).
 */
export function studioReflection() {
  if (typeof document === 'undefined') return null
  const texture = canvasTexture(1024, 512, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 512)
    // A bright room above and around, darker floor: lacquer mirrors it
    g.addColorStop(0, '#c9ccd3')
    g.addColorStop(0.42, '#7d808a')
    g.addColorStop(0.6, '#3b3c42')
    g.addColorStop(1, '#141416')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 1024, 512)
    // Softboxes: long bright strips with soft edges
    const strip = (x: number, y: number, w: number, h: number, a: number) => {
      const s = ctx.createLinearGradient(x, 0, x + w, 0)
      s.addColorStop(0, 'rgba(255,255,255,0)')
      s.addColorStop(0.5, `rgba(255,255,255,${a})`)
      s.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = s
      ctx.fillRect(x, y, w, h)
    }
    strip(120, 40, 160, 300, 1)
    strip(470, 20, 110, 340, 1)
    strip(760, 60, 200, 260, 0.95)
    // A warm glow low down, like lamps in the room
    const warm = ctx.createRadialGradient(300, 420, 0, 300, 420, 260)
    warm.addColorStop(0, 'rgba(255,200,140,0.35)')
    warm.addColorStop(1, 'rgba(255,200,140,0)')
    ctx.fillStyle = warm
    ctx.fillRect(0, 0, 1024, 512)
  })
  texture.mapping = THREE.EquirectangularReflectionMapping
  return texture
}
