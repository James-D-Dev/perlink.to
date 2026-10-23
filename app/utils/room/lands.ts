import * as THREE from 'three'
import { cherryLeaves, natureWind, scatterModel, type ScatterItem } from './natureModels'
import type { LandId, RoomStyle } from '~/types/room'

// Scenery outside the room. Each land is built from primitives and returns its
// sky colors plus an update() hook for animation (butterflies, snow, petals...).

export interface LandMeta {
  id: LandId
  name: string
  description: string
  icon: string
  /** CSS gradient for the picker card: sky -> ground */
  preview: string
}

export const LANDS: LandMeta[] = [
  { id: 'island', name: 'Sky island', description: 'Floating island above the clouds, flowers and butterflies', icon: 'i-lucide-cloud-sun', preview: 'linear-gradient(180deg,#8fd0f5 0%,#cfeaff 55%,#6fbf5a 56%,#4f8a3a 100%)' },
  { id: 'mars', name: 'Mars', description: 'Red planet surface floating in space, planets all around', icon: 'i-lucide-orbit', preview: 'linear-gradient(180deg,#0b0614 0%,#2a1440 55%,#c4572d 56%,#7a2f18 100%)' },
  { id: 'sakura', name: 'Sakura', description: 'Cherry blossoms, falling petals, butterflies and a pond', icon: 'i-lucide-flower-2', preview: 'linear-gradient(180deg,#bfe3ff 0%,#ffd6e8 55%,#9fd88a 56%,#6fb35a 100%)' },
  { id: 'winter', name: 'Winter', description: 'Snowfall, snowy pines and a snowman with a Santa hat', icon: 'i-lucide-snowflake', preview: 'linear-gradient(180deg,#9fb8d1 0%,#dce8f3 55%,#f4f8ff 56%,#d6e2ef 100%)' },
]

export interface SkyPalette {
  night: THREE.Color
  dusk: THREE.Color
  day: THREE.Color
}

/** Physical sky settings (three.js Sky shader); omitted for space */
export interface Atmosphere {
  turbidity: number
  rayleigh: number
  mie: number
}

export interface LandInstance {
  group: THREE.Group
  sky: SkyPalette
  atmosphere?: Atmosphere
  /** Stars stay visible during the day (space) */
  starsAlways: boolean
  /** Called every frame; daylight 0..1, lamps 0..1 (night lights) */
  update: (time: number, dt: number, daylight: number, lamps: number) => void
}

export interface LandContext {
  style: RoomStyle
  /** Top of the ground, just under the room floor */
  groundY: number
}

// ---------- Helpers ----------

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function std(color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...opts })
}

function place<T extends THREE.Object3D>(obj: T, x: number, y: number, z: number, shadow = true): T {
  obj.position.set(x, y, z)
  obj.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.isMesh) {
      m.castShadow = shadow
      m.receiveShadow = true
    }
  })
  return obj
}

/** Random point on the open side of the room (outside it, inside the land radius) */
function outdoorSpot(rand: () => number, style: RoomStyle, radius: number, margin = 0.6, minRadius = 0): [number, number] {
  for (let i = 0; i < 50; i++) {
    const angle = rand() * Math.PI * 2
    const r = minRadius + Math.sqrt(rand()) * (radius - margin - minRadius)
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    const insideRoom = x < style.width / 2 + 0.5 && z < style.depth / 2 + 0.5 && x > -style.width / 2 - 0.8 && z > -style.depth / 2 - 0.8
    const behindWalls = x < -style.width / 2 - 0.2 || z < -style.depth / 2 - 0.2
    if (!insideRoom && !behindWalls) return [x, z]
  }
  return [radius * 0.6, radius * 0.6]
}

/**
 * Spot for tall scenery (trees, snowman): behind or beside the walls, so it
 * frames the room and never stands between the camera and the room.
 */
function backdropSpot(rand: () => number, style: RoomStyle, radius: number, margin = 1): [number, number] {
  for (let i = 0; i < 80; i++) {
    const angle = rand() * Math.PI * 2
    const r = radius * 0.5 + Math.sqrt(rand()) * (radius * 0.5 - margin)
    const x = Math.cos(angle) * r
    const z = Math.sin(angle) * r
    // Keep canopies (up to ~1.8m wide) clear of the walls
    const behindBack = z < -style.depth / 2 - 2 && x < style.width / 2 + 4
    const behindLeft = x < -style.width / 2 - 2 && z < style.depth / 2 + 4
    if (behindBack || behindLeft) return [x, z]
  }
  return [-style.width / 2 - 2, -style.depth / 2 - 2]
}

/** Gentle wind sway for trees */
function swayer() {
  const items: { obj: THREE.Object3D; phase: number }[] = []
  return {
    add(obj: THREE.Object3D, phase: number) {
      items.push({ obj, phase })
    },
    update(time: number) {
      for (const { obj, phase } of items) {
        obj.rotation.z = Math.sin(time * 0.9 + phase) * 0.025
        obj.rotation.x = Math.cos(time * 0.7 + phase) * 0.015
      }
    },
  }
}

/** Jitter vertices for an organic, hand-made low-poly look */
function jitter(geometry: THREE.BufferGeometry, rand: () => number, amount: number) {
  const pos = geometry.attributes.position as THREE.BufferAttribute
  // Keep shared vertices together so the surface stays closed
  const offsets = new Map<string, [number, number, number]>()
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`
    let o = offsets.get(key)
    if (!o) {
      o = [(rand() - 0.5) * amount, (rand() - 0.5) * amount, (rand() - 0.5) * amount]
      offsets.set(key, o)
    }
    pos.setXYZ(i, pos.getX(i) + o[0], pos.getY(i) + o[1], pos.getZ(i) + o[2])
  }
  geometry.computeVertexNormals()
  return geometry
}

/** Grass/snow top, soil band and a rocky point underneath, so every land floats */
function floatingGround(ctx: LandContext, radius: number, top: THREE.Material, soil: string, rock: string, seed: number) {
  const group = new THREE.Group()
  const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.98, 0.4, 56), top)
  topMesh.position.y = ctx.groundY - 0.2
  topMesh.receiveShadow = true

  const soilMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.98, radius * 0.9, 0.7, 40), std(soil, { flatShading: true }))
  soilMesh.position.y = ctx.groundY - 0.75

  // Jagged rock underside
  const height = radius * 1.15
  const rockGeometry = new THREE.ConeGeometry(radius * 0.9, height, 14, 4)
  const rand = seeded(seed)
  const pos = rockGeometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y < height / 2 - 0.01) {
      pos.setX(i, pos.getX(i) * (0.85 + rand() * 0.3))
      pos.setZ(i, pos.getZ(i) * (0.85 + rand() * 0.3))
      pos.setY(i, y + (rand() - 0.5) * 0.6)
    }
  }
  rockGeometry.computeVertexNormals()
  const rockMesh = new THREE.Mesh(rockGeometry, std(rock, { flatShading: true }))
  rockMesh.rotation.x = Math.PI
  rockMesh.position.y = ctx.groundY - 1.1 - height / 2

  group.add(topMesh, soilMesh, rockMesh)
  return { group, top: topMesh }
}

/** Layered pine with optional snow caps */
function pineTree(rand: () => number, scale = 1, snow = false) {
  const tree = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.6, 6), std('#5a3d2b'))
  trunk.position.y = 0.3
  tree.add(trunk)
  const greens = ['#2f5d46', '#356b4f', '#28503c']
  const tiers = 4
  for (let i = 0; i < tiers; i++) {
    const r = 0.8 - i * 0.17
    const tier = new THREE.Mesh(
      jitter(new THREE.ConeGeometry(r, 0.75, 9, 1), rand, 0.06),
      std(greens[i % greens.length]!, { flatShading: true }),
    )
    tier.position.y = 0.75 + i * 0.42
    tier.rotation.y = rand() * Math.PI
    tree.add(tier)
    if (snow) {
      const cap = new THREE.Mesh(jitter(new THREE.ConeGeometry(r * 0.78, 0.32, 9), rand, 0.04), std('#ffffff', { flatShading: true }))
      cap.position.y = 0.98 + i * 0.42
      tree.add(cap)
    }
  }
  tree.scale.setScalar(scale)
  return tree
}

// ---------- Butterflies (fly from flower to flower) ----------

function butterflyModel(color: string) {
  const g = new THREE.Group()
  const wingShape = new THREE.Shape()
  wingShape.moveTo(0, 0)
  wingShape.bezierCurveTo(0.08, 0.1, 0.18, 0.08, 0.16, -0.02)
  wingShape.bezierCurveTo(0.14, -0.1, 0.05, -0.08, 0, 0)
  const wingGeometry = new THREE.ShapeGeometry(wingShape)
  wingGeometry.rotateX(-Math.PI / 2)
  const wingMaterial = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide, roughness: 0.5, emissive: color, emissiveIntensity: 0.15 })
  const right = new THREE.Mesh(wingGeometry, wingMaterial)
  const left = new THREE.Mesh(wingGeometry, wingMaterial)
  left.scale.x = -1
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 4), std('#2a2a2a'))
  body.rotation.x = Math.PI / 2
  g.add(right, left, body)
  return { group: g, left, right }
}

function createButterflies(count: number, spots: THREE.Vector3[], rand: () => number, colors: string[]) {
  const group = new THREE.Group()
  const flies = Array.from({ length: count }, (_, i) => {
    const model = butterflyModel(colors[i % colors.length]!)
    const from = spots[Math.floor(rand() * spots.length)]!.clone()
    group.add(model.group)
    model.group.position.copy(from)
    return { ...model, from, to: from.clone(), ctrl: from.clone(), t: 1, duration: 1, rest: rand() * 2, phase: rand() * 10 }
  })
  const tmp = new THREE.Vector3()

  function update(time: number, dt: number) {
    for (const f of flies) {
      if (f.rest > 0) {
        f.rest -= dt
        // Resting: slow wing beat
        const a = 0.3 + Math.sin(time * 3 + f.phase) * 0.3
        f.right.rotation.z = a
        f.left.rotation.z = -a
        if (f.rest <= 0) {
          f.from.copy(f.group.position)
          f.to.copy(spots[Math.floor(rand() * spots.length)]!)
          f.ctrl.copy(f.from).lerp(f.to, 0.5)
          f.ctrl.y += 0.8 + rand() * 1.4
          f.t = 0
          f.duration = 2 + f.from.distanceTo(f.to) * 0.35
        }
        continue
      }
      f.t = Math.min(1, f.t + dt / f.duration)
      const t = f.t
      // Quadratic bezier arc between flowers, with a little flutter
      tmp.set(0, 0, 0)
        .addScaledVector(f.from, (1 - t) * (1 - t))
        .addScaledVector(f.ctrl, 2 * (1 - t) * t)
        .addScaledVector(f.to, t * t)
      tmp.y += Math.sin(time * 6 + f.phase) * 0.04
      f.group.lookAt(tmp.x, f.group.position.y, tmp.z)
      f.group.position.copy(tmp)
      const flap = Math.sin(time * 28 + f.phase) * 0.9
      f.right.rotation.z = flap
      f.left.rotation.z = -flap
      if (f.t >= 1) f.rest = 1 + rand() * 2.5
    }
  }
  return { group, update }
}

// ---------- Particles ----------

function softDotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.8)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

/** Glowing fireflies that wander near the ground at night */
function createFireflies(count: number, ctx: LandContext, radius: number, rand: () => number) {
  const positions = new Float32Array(count * 3)
  const base = Array.from({ length: count }, () => {
    const [x, z] = outdoorSpot(rand, ctx.style, radius, 0.8)
    return { x, z, y: ctx.groundY + 0.3 + rand() * 1.2, phase: rand() * 10 }
  })
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({ color: '#d9ff7a', size: 0.12, map: softDotTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })
  const points = new THREE.Points(geometry, material)
  function update(time: number, lamps: number) {
    material.opacity = lamps * (0.6 + Math.sin(time * 2) * 0.2)
    base.forEach((b, i) => {
      positions[i * 3] = b.x + Math.sin(time * 0.5 + b.phase) * 0.4
      positions[i * 3 + 1] = b.y + Math.sin(time * 0.8 + b.phase * 2) * 0.25
      positions[i * 3 + 2] = b.z + Math.cos(time * 0.4 + b.phase) * 0.4
    })
    geometry.attributes.position!.needsUpdate = true
  }
  return { points, update }
}

/** Falling snowflakes over the land */
function createSnowfall(count: number, ctx: LandContext, radius: number, rand: () => number) {
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  const phases = new Float32Array(count)
  const top = ctx.groundY + 9
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * radius
    positions[i * 3] = Math.cos(a) * r
    positions[i * 3 + 1] = ctx.groundY + rand() * 9
    positions[i * 3 + 2] = Math.sin(a) * r
    speeds[i] = 0.4 + rand() * 0.6
    phases[i] = rand() * 10
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({ color: '#ffffff', size: 0.09, map: softDotTexture(), transparent: true, depthWrite: false, opacity: 0.9 })
  const points = new THREE.Points(geometry, material)
  function update(time: number, dt: number, daylight: number) {
    material.color.setScalar(0.6 + 0.4 * daylight)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1]! -= speeds[i]! * dt
      positions[i * 3]! += Math.sin(time + phases[i]!) * 0.15 * dt
      if (positions[i * 3 + 1]! < ctx.groundY) positions[i * 3 + 1] = top
    }
    geometry.attributes.position!.needsUpdate = true
  }
  return { points, update }
}

/** Pink petals drifting down from the cherry trees */
function createPetals(count: number, ctx: LandContext, sources: THREE.Vector3[], rand: () => number) {
  const geometry = new THREE.PlaneGeometry(0.07, 0.05)
  const material = new THREE.MeshStandardMaterial({ color: '#ffc0d9', side: THREE.DoubleSide, roughness: 0.7 })
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  const dummy = new THREE.Object3D()
  const petals = Array.from({ length: count }, () => {
    const s = sources[Math.floor(rand() * sources.length)]!
    return {
      origin: s,
      pos: new THREE.Vector3(s.x + (rand() - 0.5) * 1.6, s.y - rand() * 2.5, s.z + (rand() - 0.5) * 1.6),
      speed: 0.25 + rand() * 0.3,
      spin: rand() * 4,
      phase: rand() * 10,
    }
  })
  function update(time: number, dt: number) {
    petals.forEach((p, i) => {
      p.pos.y -= p.speed * dt
      p.pos.x += Math.sin(time * 1.3 + p.phase) * 0.3 * dt + 0.08 * dt
      p.pos.z += Math.cos(time * 1.1 + p.phase) * 0.2 * dt
      if (p.pos.y < ctx.groundY + 0.02) {
        p.pos.set(p.origin.x + (rand() - 0.5) * 1.6, p.origin.y, p.origin.z + (rand() - 0.5) * 1.6)
      }
      dummy.position.copy(p.pos)
      dummy.rotation.set(time * p.spin, time * p.spin * 0.7, p.phase)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }
  return { mesh, update }
}

function cloudPuff(rand: () => number, material: THREE.Material) {
  const g = new THREE.Group()
  const n = 4 + Math.floor(rand() * 3)
  for (let i = 0; i < n; i++) {
    const r = 0.8 + rand() * 0.9
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), material)
    s.position.set((i - n / 2) * 0.9 + rand() * 0.4, rand() * 0.5, (rand() - 0.5) * 1.2)
    g.add(s)
  }
  g.scale.y = 0.55
  return g
}

// ---------- Lands ----------

// ---------- Terrain ----------

function hash2(x: number, z: number, seed: number) {
  const v = Math.sin(x * 127.1 + z * 311.7 + seed * 74.7) * 43758.5453
  return v - Math.floor(v)
}

function noise2(x: number, z: number, seed: number) {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = x - xi
  const zf = z - zi
  const u = xf * xf * (3 - 2 * xf)
  const v = zf * zf * (3 - 2 * zf)
  const a = hash2(xi, zi, seed)
  const b = hash2(xi + 1, zi, seed)
  const c = hash2(xi, zi + 1, seed)
  const d = hash2(xi + 1, zi + 1, seed)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

function fbm(x: number, z: number, seed: number) {
  return noise2(x, z, seed) * 0.55 + noise2(x * 2.1, z * 2.1, seed + 1) * 0.3 + noise2(x * 4.3, z * 4.3, seed + 2) * 0.15
}

interface Terrain {
  mesh: THREE.Mesh
  material: THREE.MeshStandardMaterial
  /** Ground height (absolute y) at a point */
  heightAt: (x: number, z: number) => number
  /** True on the path, in the room area or anywhere plants shouldn't grow */
  blocked: (x: number, z: number) => boolean
}

/**
 * Rolling ground: flat under and around the room, gentle bumps in front,
 * soft hills behind the walls, colour variation and a sandy path.
 */
function createTerrain(ctx: LandContext, radius: number, seed: number, colors: { grass: string[]; dry: string; path: string }): Terrain {
  const { width, depth } = ctx.style
  // Path from the room's front corner out to the island edge
  const path = [
    new THREE.Vector2(width / 2 + 0.4, depth / 2 + 0.4),
    new THREE.Vector2(width / 2 + 1.8, depth / 2 + 1.2),
    new THREE.Vector2(radius * 0.5, radius * 0.62),
    new THREE.Vector2(radius * 0.62, radius * 0.95),
  ]
  const pathDistance = (x: number, z: number) => {
    let best = Infinity
    const p = new THREE.Vector2(x, z)
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i]!
      const b = path[i + 1]!
      const ab = b.clone().sub(a)
      const t = THREE.MathUtils.clamp(p.clone().sub(a).dot(ab) / ab.lengthSq(), 0, 1)
      best = Math.min(best, p.distanceTo(a.clone().addScaledVector(ab, t)))
    }
    return best
  }
  const roomDistance = (x: number, z: number) => {
    const dx = Math.max(Math.abs(x) - width / 2, 0)
    const dz = Math.max(Math.abs(z) - depth / 2, 0)
    return Math.hypot(dx, dz)
  }
  const relief = (x: number, z: number) => {
    const fromRoom = THREE.MathUtils.smoothstep(roomDistance(x, z), 0.6, 2.4)
    const r = Math.hypot(x, z)
    const rim = 1 - THREE.MathUtils.smoothstep(r, radius - 1.2, radius - 0.1)
    // Hills rise behind the walls so trees stand on slopes
    const behind = THREE.MathUtils.smoothstep(-Math.min(x + width / 2, z + depth / 2), 0.5, 4)
    let h = (fbm(x * 0.32, z * 0.32, seed) - 0.45) * 0.5 + behind * (0.5 + fbm(x * 0.2, z * 0.2, seed + 9) * 0.9)
    h *= fromRoom * rim
    const onPath = 1 - THREE.MathUtils.smoothstep(pathDistance(x, z), 0.25, 0.6)
    return h - onPath * 0.03
  }

  const geometry = new THREE.RingGeometry(0.001, radius, 160, 64)
  geometry.rotateX(-Math.PI / 2)
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const colorAttr = new Float32Array(pos.count * 3)
  const grass = colors.grass.map(c => new THREE.Color(c))
  const dry = new THREE.Color(colors.dry)
  const sand = new THREE.Color(colors.path)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    pos.setY(i, relief(x, z))
    // Patchy greens, a few dry spots, then the sandy path on top
    const n = fbm(x * 0.5, z * 0.5, seed + 3)
    const idx = Math.min(Math.floor(n * grass.length), grass.length - 1)
    c.copy(grass[idx]!).lerp(grass[Math.min(idx + 1, grass.length - 1)]!, (n * grass.length) % 1)
    c.lerp(dry, THREE.MathUtils.smoothstep(fbm(x * 0.8, z * 0.8, seed + 5), 0.62, 0.8) * 0.6)
    c.lerp(sand, 1 - THREE.MathUtils.smoothstep(pathDistance(x, z), 0.28, 0.55))
    colorAttr.set([c.r, c.g, c.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colorAttr, 3))
  geometry.computeVertexNormals()
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = ctx.groundY + 0.01
  mesh.receiveShadow = true

  return {
    mesh,
    material,
    heightAt: (x, z) => ctx.groundY + relief(x, z),
    blocked: (x, z) => roomDistance(x, z) < 0.15 || pathDistance(x, z) < 0.5,
  }
}

// ---------- Model-based scenery ----------

/** Split items between several model variants (e.g. CommonTree_1..5) */
function byVariant(names: string[], items: ScatterItem[], rand: () => number) {
  const groups = new Map<string, ScatterItem[]>()
  for (const item of items) {
    const name = names[Math.floor(rand() * names.length)]!
    if (!groups.has(name)) groups.set(name, [])
    groups.get(name)!.push(item)
  }
  return groups
}

/** Items clumped around centers, like plants grow in nature */
function clumps(rand: () => number, terrain: Terrain, centers: [number, number][], perClump: number, spread: number, height: [number, number], avoid?: (x: number, z: number) => boolean) {
  const items: ScatterItem[] = []
  for (const [cx, cz] of centers) {
    for (let i = 0; i < perClump; i++) {
      const a = rand() * Math.PI * 2
      const r = Math.pow(rand(), 1.6) * spread
      const x = cx + Math.cos(a) * r
      const z = cz + Math.sin(a) * r
      if (terrain.blocked(x, z) || avoid?.(x, z)) continue
      items.push({ x, y: terrain.heightAt(x, z), z, height: height[0] + rand() * (height[1] - height[0]), rotation: rand() * Math.PI * 2 })
    }
  }
  return items
}

/** Random points anywhere on the land outside the room */
function landSpots(rand: () => number, ctx: LandContext, radius: number, count: number, margin = 0.5): [number, number][] {
  const spots: [number, number][] = []
  while (spots.length < count) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * (radius - margin)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (Math.abs(x) < ctx.style.width / 2 + 0.3 && Math.abs(z) < ctx.style.depth / 2 + 0.3) continue
    spots.push([x, z])
  }
  return spots
}

/** Groves of trees behind and beside the walls, with undergrowth and big rocks */
function plantGroves(group: THREE.Group, ctx: LandContext, radius: number, terrain: Terrain, rand: () => number, treeNames: string[], material?: (m: THREE.Material) => THREE.Material) {
  const { width, depth } = ctx.style
  const allCenters: [number, number][] = [
    [-width / 2 + 0.8, -depth / 2 - 3.2],
    [width / 2 - 0.4, -depth / 2 - 3.8],
    [-width / 2 - 3.2, depth / 2 - 1],
    [-width / 2 - 3.6, -depth / 2 + 0.6],
    [-width / 2 - 2.9, -depth / 2 - 2.9],
    [width / 2 + 2.6, -depth / 2 - 1.6],
    [-width / 2 - 1.6, depth / 2 + 2.8],
  ]
  const groveCenters = allCenters.filter(([x, z]) => Math.hypot(x, z) < radius - 1.2)

  const trees: ScatterItem[] = []
  groveCenters.forEach(([cx, cz], g) => {
    const count = g >= 5 ? 1 : 3
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2
      const r = i === 0 ? 0 : 0.9 + rand() * 0.7
      const x = cx + Math.cos(a) * r
      const z = cz + Math.sin(a) * r
      // One tall tree per grove, smaller ones around it
      const height = i === 0 ? 4.8 + rand() * 1.2 : 3.2 + rand() * 1.1
      trees.push({ x, y: terrain.heightAt(x, z), z, height, rotation: rand() * Math.PI * 2 })
    }
  })
  for (const [name, list] of byVariant(treeNames, trees, rand)) scatterModel(group, name, list, { material })

  // Undergrowth at the tree bases
  scatterModel(group, 'Fern_1', clumps(rand, terrain, groveCenters, 4, 1.8, [0.35, 0.6]), { castShadow: false })
  scatterModel(group, 'Mushroom_Common', clumps(rand, terrain, groveCenters, 2, 1.4, [0.1, 0.18]), { castShadow: false })
  for (const [name, list] of byVariant(['Bush_Common_Flowers'], clumps(rand, terrain, groveCenters, 2, 2, [0.6, 1]), rand)) scatterModel(group, name, list)

  // A few large boulders among the groves
  const boulders = groveCenters.slice(0, 4).map(([cx, cz]) => {
    const x = cx + (rand() - 0.5) * 2
    const z = cz + (rand() - 0.5) * 2
    return { x, y: terrain.heightAt(x, z) - 0.15, z, height: 1 + rand() * 1.1, rotation: rand() * Math.PI * 2 }
  })
  for (const [name, list] of byVariant(['Rock_Medium_1', 'Rock_Medium_2', 'Rock_Medium_3'], boulders, rand)) scatterModel(group, name, list)
  return trees
}

/** Dense grass clumps, flower patches, bushes and pebbles in front; returns flower tops for butterflies */
function plantMeadow(group: THREE.Group, ctx: LandContext, radius: number, terrain: Terrain, rand: () => number, avoid?: (x: number, z: number) => boolean) {
  scatterModel(group, 'Grass_Common_Short', clumps(rand, terrain, landSpots(rand, ctx, radius, 60), 16, 0.9, [0.2, 0.32], avoid), { castShadow: false })
  scatterModel(group, 'Grass_Wispy_Short', clumps(rand, terrain, landSpots(rand, ctx, radius, 30), 10, 0.7, [0.22, 0.34], avoid), { castShadow: false })
  scatterModel(group, 'Grass_Common_Tall', clumps(rand, terrain, landSpots(rand, ctx, radius, 22), 8, 0.6, [0.35, 0.55], avoid), { castShadow: false })
  scatterModel(group, 'Grass_Wispy_Tall', clumps(rand, terrain, landSpots(rand, ctx, radius, 12), 6, 0.5, [0.45, 0.65], avoid), { castShadow: false })

  // Flower patches: each patch is one kind, like wildflowers grow
  const patchCenters = Array.from({ length: 8 }, () => outdoorSpot(rand, ctx.style, radius, 0.8))
  const flowers: ScatterItem[] = []
  patchCenters.forEach((center, i) => {
    const name = ['Flower_3_Group', 'Flower_4_Group', 'Flower_3_Single', 'Flower_4_Single'][i % 4]!
    const items = clumps(rand, terrain, [center], 7, 0.75, name.includes('Group') ? [0.3, 0.42] : [0.26, 0.38], avoid)
    scatterModel(group, name, items, { castShadow: false })
    flowers.push(...items)
  })
  for (const [name, list] of byVariant(['Bush_Common_Flowers'], clumps(rand, terrain, Array.from({ length: 5 }, () => outdoorSpot(rand, ctx.style, radius, 1)), 1, 0.2, [0.55, 0.85], avoid), rand)) scatterModel(group, name, list)
  scatterModel(group, 'Plant_1', clumps(rand, terrain, landSpots(rand, ctx, radius, 6), 2, 0.4, [0.3, 0.45], avoid), { castShadow: false })
  return flowers.map(f => new THREE.Vector3(f.x, f.y + f.height * 0.9, f.z))
}

/** Pebbles lining both sides of the path */
function plantPathEdges(group: THREE.Group, terrain: Terrain, rand: () => number, ctx: LandContext, radius: number) {
  const items: ScatterItem[] = []
  for (let i = 0; i < 140 && items.length < 26; i++) {
    const [x, z] = landSpots(rand, ctx, radius, 1)[0]!
    if (!terrain.blocked(x, z)) continue
    if (Math.abs(x) < ctx.style.width / 2 + 0.2 && Math.abs(z) < ctx.style.depth / 2 + 0.2) continue
    items.push({ x, y: terrain.heightAt(x, z), z, height: 0.06 + rand() * 0.08, rotation: rand() * Math.PI * 2 })
  }
  for (const [name, list] of byVariant(['Pebble_Round_1', 'Pebble_Round_2', 'Pebble_Round_3', 'Pebble_Round_4', 'Pebble_Round_5'], items, rand)) scatterModel(group, name, list, { castShadow: false })
}

/** Soft clouds on the horizon, visible above the walls */
function skyClouds(group: THREE.Group, rand: () => number, material: THREE.Material) {
  const clouds = new THREE.Group()
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (1.05 + rand() * 0.9)
    const r = 26 + rand() * 10
    const puff = cloudPuff(rand, material)
    puff.position.set(Math.cos(a) * r, 5 + rand() * 6, Math.sin(a) * r)
    puff.scale.multiplyScalar(1.6 + rand() * 1.4)
    clouds.add(puff)
  }
  group.add(clouds)
  return clouds
}

/** Animated water: deep center, light rim, moving ripples and sky sparkle */
function createWater(radius: number) {
  const uniforms = {
    time: { value: 0 },
    daylight: { value: 1 },
    deep: { value: new THREE.Color('#2a7aa6') },
    shallow: { value: new THREE.Color('#7fd0e6') },
    night: { value: new THREE.Color('#0f2a44') },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float daylight;
      uniform vec3 deep;
      uniform vec3 shallow;
      uniform vec3 night;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - 0.5;
        float r = length(p) * 2.0;
        float w = sin(p.x * 38.0 + time * 1.3) * 0.5 + sin(p.y * 31.0 - time * 1.1) * 0.5;
        w += sin((p.x + p.y) * 52.0 + time * 1.9) * 0.35;
        vec3 color = mix(deep, shallow, smoothstep(0.35, 1.0, r));
        color = mix(night, color, 0.25 + 0.75 * daylight);
        float sparkle = smoothstep(1.05, 1.3, w) * (0.25 + 0.5 * daylight);
        color += vec3(sparkle);
        float rim = smoothstep(0.86, 0.98, r);
        color = mix(color, vec3(0.92, 0.97, 1.0), rim * 0.45 * (0.4 + 0.6 * daylight));
        float alpha = (1.0 - smoothstep(0.98, 1.0, r)) * 0.94;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  })
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), material)
  mesh.rotation.x = -Math.PI / 2
  return { mesh, uniforms }
}

function buildIsland(ctx: LandContext, radius: number): LandInstance {
  const rand = seeded(11)
  const { group } = floatingGround(ctx, radius, std('#5f9a3c'), '#8a5a3b', '#6f6258', 3)
  const terrain = createTerrain(ctx, radius, 4, { grass: ['#5f9a3c', '#74ad45', '#8cbf4f', '#6aa340'], dry: '#b9b85a', path: '#d6c08a' })
  group.add(terrain.mesh)

  plantGroves(group, ctx, radius, terrain, rand, ['CommonTree_1', 'CommonTree_2', 'CommonTree_3', 'CommonTree_4', 'CommonTree_5', 'Pine_1'])
  const flowerTops = plantMeadow(group, ctx, radius, terrain, rand)
  plantPathEdges(group, terrain, rand, ctx, radius)

  const cloudMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#ffffff', emissiveIntensity: 0.15 })
  const horizon = skyClouds(group, rand, cloudMaterial)

  // Sea of clouds under the island
  const clouds = new THREE.Group()
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + rand() * 0.3
    const r = radius * (0.9 + rand() * 1.6)
    const puff = cloudPuff(rand, cloudMaterial)
    puff.position.set(Math.cos(a) * r, ctx.groundY - radius * (0.75 + rand() * 0.5), Math.sin(a) * r)
    puff.scale.multiplyScalar(1.2 + rand() * 1.4)
    clouds.add(puff)
  }
  group.add(clouds)

  // Small rocks floating around the island
  const rocks = Array.from({ length: 4 }, (_, i) => {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4 + rand() * 0.4), std('#7a6a5c', { flatShading: true }))
    const a = (i / 4) * Math.PI * 2 + 0.5
    rock.position.set(Math.cos(a) * (radius + 2), ctx.groundY - 2 - rand() * 2, Math.sin(a) * (radius + 2))
    group.add(rock)
    return { rock, baseY: rock.position.y, phase: rand() * 10 }
  })

  const butterflies = createButterflies(6, flowerTops, rand, ['#ffb347', '#7ad7f0', '#ff7eb6', '#fff176'])
  const fireflies = createFireflies(30, ctx, radius, rand)
  group.add(butterflies.group, fireflies.points)

  const nightTint = new THREE.Color('#33415e')
  const white = new THREE.Color('#ffffff')
  const cloudNight = new THREE.Color('#4a5878')

  return {
    group,
    starsAlways: false,
    sky: { night: new THREE.Color('#070b1f'), dusk: new THREE.Color('#f2a65a'), day: new THREE.Color('#8fd0f5') },
    atmosphere: { turbidity: 2.5, rayleigh: 2.2, mie: 0.003 },
    update(time, dt, daylight, lamps) {
      natureWind.value = time
      terrain.material.color.copy(nightTint).lerp(white, daylight)
      cloudMaterial.color.copy(cloudNight).lerp(white, daylight)
      cloudMaterial.emissiveIntensity = 0.05 + daylight * 0.15
      clouds.rotation.y = time * 0.004
      horizon.rotation.y = Math.sin(time * 0.02) * 0.05
      rocks.forEach((r) => {
        r.rock.position.y = r.baseY + Math.sin(time * 0.6 + r.phase) * 0.25
        r.rock.rotation.y = time * 0.1 + r.phase
      })
      butterflies.group.visible = daylight > 0.25
      if (butterflies.group.visible) butterflies.update(time, dt)
      fireflies.update(time, lamps)
    },
  }
}

function buildMars(ctx: LandContext, radius: number): LandInstance {
  const rand = seeded(23)
  const sand = std('#c4572d', { flatShading: true })
  const { group } = floatingGround(ctx, radius, sand, '#8c3a1d', '#5a2a1a', 7)

  // Craters and rocks
  for (let i = 0; i < 7; i++) {
    const [x, z] = outdoorSpot(rand, ctx.style, radius, 1)
    const crater = new THREE.Mesh(new THREE.TorusGeometry(0.35 + rand() * 0.45, 0.08, 6, 18), std('#9e4322', { flatShading: true }))
    crater.rotation.x = Math.PI / 2
    crater.position.set(x, ctx.groundY + 0.02, z)
    group.add(crater)
  }
  for (let i = 0; i < 12; i++) {
    const [x, z] = outdoorSpot(rand, ctx.style, radius, 0.6)
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12 + rand() * 0.25), std('#7a3418', { flatShading: true }))
    group.add(place(rock, x, ctx.groundY + 0.08, z))
  }

  // Planets around the room (no fog so they stay crisp)
  const planets = new THREE.Group()
  // Planets glow in their own colors so they read in deep space; placed to the
  // sides of the default view where the walls don't hide them
  // Striped surface texture so planets read as round, banded worlds
  const bands = (colors: string[], seed: number) => {
    const r = seeded(seed)
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 128
    const g = c.getContext('2d')!
    let y = 0
    while (y < 128) {
      const h = 4 + r() * 14
      g.fillStyle = colors[Math.floor(r() * colors.length)]!
      g.fillRect(0, y, 256, h)
      y += h
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }
  const planetMaterial = (colors: string[], seed: number, glow = 0.35) => {
    const map = bands(colors, seed)
    return new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: '#ffffff', emissiveIntensity: glow, roughness: 1, fog: false })
  }
  const giant = new THREE.Mesh(new THREE.SphereGeometry(4.5, 48, 32), planetMaterial(['#e0b07a', '#c98d55', '#f0d2a0', '#b9773f'], 3))
  giant.position.set(-38, -11, -14)
  giant.rotation.z = 0.3
  const ring = new THREE.Mesh(new THREE.RingGeometry(6, 9.5, 64), new THREE.MeshStandardMaterial({ color: '#e8d3ad', emissive: '#e8d3ad', emissiveIntensity: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 0.7, fog: false }))
  ring.rotation.set(-1.2, 0.3, 0.2)
  giant.add(ring)
  const blue = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 24), planetMaterial(['#4f8dff', '#3b6fd8', '#7fb0ff', '#2f5cb8'], 9))
  blue.position.set(-6, -9, -38)
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 16), planetMaterial(['#d6d6e0', '#b8b8c6', '#e8e8f0'], 15, 0.3))
  moon.position.set(-2, -6, -34)
  const purple = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 24), planetMaterial(['#b07cff', '#8f5be0', '#d1b0ff'], 21))
  purple.position.set(-26, -16, -34)
  planets.add(giant, blue, moon, purple)
  group.add(planets)

  // Asteroids drifting around
  const asteroids = Array.from({ length: 8 }, () => {
    const a = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + rand() * 0.6), std('#8a5a44', { flatShading: true, emissive: '#3a1c12', emissiveIntensity: 0.6 }))
    const angle = rand() * Math.PI * 2
    const r = radius + 3 + rand() * 6
    a.position.set(Math.cos(angle) * r, ctx.groundY - 4 + rand() * 4, Math.sin(angle) * r)
    group.add(a)
    return { a, angle, r, speed: 0.02 + rand() * 0.04, baseY: a.position.y }
  })

  const sandDay = new THREE.Color('#c4572d')
  const sandNight = new THREE.Color('#8a3a1e')

  return {
    group,
    starsAlways: true,
    sky: { night: new THREE.Color('#05030c'), dusk: new THREE.Color('#1a0d2e'), day: new THREE.Color('#2a1440') },
    update(time, _dt, daylight) {
      sand.color.copy(sandNight).lerp(sandDay, daylight)
      giant.rotation.y = time * 0.02
      blue.rotation.y = time * 0.05
      moon.position.x = -6 + Math.cos(time * 0.15) * 5
      moon.position.z = -38 + Math.sin(time * 0.15) * 5
      asteroids.forEach((s) => {
        s.angle += s.speed * 0.016
        s.a.position.x = Math.cos(s.angle) * s.r
        s.a.position.z = Math.sin(s.angle) * s.r
        s.a.rotation.x = time * 0.3
        s.a.rotation.y = time * 0.2
      })
    },
  }
}

function buildSakura(ctx: LandContext, radius: number): LandInstance {
  const rand = seeded(37)
  const { group } = floatingGround(ctx, radius, std('#7fc06a'), '#8a5a3b', '#6f6258', 13)
  const terrain = createTerrain(ctx, radius, 21, { grass: ['#7fc06a', '#93cc72', '#a7d97f', '#88c46c'], dry: '#c9d48a', path: '#e3d3a8' })
  group.add(terrain.mesh)

  // Pond to the right of the path: animated water, stone shore, reeds, lily pads
  const pondX = radius * 0.68
  const pondZ = radius * 0.22
  const pondR = 1.35
  const pondY = terrain.heightAt(pondX, pondZ)
  const inPond = (x: number, z: number) => Math.hypot(x - pondX, z - pondZ) < pondR + 0.35
  const water = createWater(pondR)
  water.mesh.position.set(pondX, pondY + 0.03, pondZ)
  group.add(water.mesh)
  const shore: ScatterItem[] = []
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + rand() * 0.15
    const r = pondR + 0.05 + rand() * 0.12
    const x = pondX + Math.cos(a) * r
    const z = pondZ + Math.sin(a) * r
    shore.push({ x, y: terrain.heightAt(x, z), z, height: 0.12 + rand() * 0.12, rotation: rand() * Math.PI * 2 })
  }
  for (const [name, items] of byVariant(['Pebble_Round_1', 'Pebble_Round_2', 'Pebble_Round_3', 'Pebble_Round_4', 'Pebble_Round_5'], shore, rand)) scatterModel(group, name, items)
  const reeds = clumps(rand, terrain, [[pondX - pondR, pondZ - 0.4], [pondX + 0.6, pondZ + pondR]], 7, 0.4, [0.5, 0.8])
  scatterModel(group, 'Grass_Wispy_Tall', reeds, { castShadow: false })
  const pads = Array.from({ length: 5 }, () => {
    const pad = new THREE.Mesh(new THREE.CircleGeometry(0.17, 14, 0.3, Math.PI * 1.8), std('#4f9d3a', { side: THREE.DoubleSide }))
    pad.rotation.x = -Math.PI / 2
    const a = rand() * Math.PI * 2
    const r = rand() * 0.9
    pad.position.set(pondX + Math.cos(a) * r, pondY + 0.04, pondZ + Math.sin(a) * r)
    group.add(pad)
    return { pad, phase: rand() * 10 }
  })

  // Cherry groves: twisted trees with pink blossom leaves
  const trees = plantGroves(group, ctx, radius, terrain, rand, ['TwistedTree_1', 'TwistedTree_2', 'TwistedTree_3'], cherryLeaves)
  const petalSources = trees.map(t => new THREE.Vector3(t.x, t.y + t.height * 0.75, t.z))

  const flowerTops = plantMeadow(group, ctx, radius, terrain, rand, inPond)
  plantPathEdges(group, terrain, rand, ctx, radius)

  const cloudMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#ffe6f0', emissiveIntensity: 0.15 })
  skyClouds(group, rand, cloudMaterial)

  const petals = createPetals(180, ctx, petalSources, rand)
  const butterflies = createButterflies(5, flowerTops, rand, ['#ffffff', '#ffb6d9', '#c4b5fd'])
  const fireflies = createFireflies(20, ctx, radius, rand)
  group.add(petals.mesh, butterflies.group, fireflies.points)

  const nightTint = new THREE.Color('#3a3f63')
  const white = new THREE.Color('#ffffff')
  const cloudNight = new THREE.Color('#5a4f78')

  return {
    group,
    starsAlways: false,
    sky: { night: new THREE.Color('#140c2a'), dusk: new THREE.Color('#ffb3c7'), day: new THREE.Color('#bfe3ff') },
    atmosphere: { turbidity: 2, rayleigh: 1.8, mie: 0.0025 },
    update(time, dt, daylight, lamps) {
      natureWind.value = time
      terrain.material.color.copy(nightTint).lerp(white, daylight)
      cloudMaterial.color.copy(cloudNight).lerp(white, daylight)
      water.uniforms.time.value = time
      water.uniforms.daylight.value = daylight
      pads.forEach(p => (p.pad.position.y = pondY + 0.04 + Math.sin(time + p.phase) * 0.004))
      petals.update(time, dt)
      butterflies.group.visible = daylight > 0.25
      if (butterflies.group.visible) butterflies.update(time, dt)
      fireflies.update(time, lamps)
    },
  }
}

function snowyPine(scale: number, rand: () => number = seeded(5)) {
  return pineTree(rand, scale, true)
}
function snowman() {
  const g = new THREE.Group()
  const snow = std('#ffffff', { roughness: 1 })
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 14), snow)
  bottom.position.y = 0.38
  const middle = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), snow)
  middle.position.y = 0.95
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 14), snow)
  head.position.y = 1.38
  const black = std('#111111')
  const eyes = [-0.07, 0.07].map((x) => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), black)
    e.position.set(x, 1.43, 0.2)
    return e
  })
  const buttons = [0.85, 0.98, 1.1].map((y) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), black)
    b.position.set(0, y, 0.29)
    return b
  })
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 10), std('#f97316'))
  nose.rotation.x = Math.PI / 2
  nose.position.set(0, 1.37, 0.3)
  // Red scarf with a hanging tail
  const red = std('#dc2626')
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.055, 8, 20), red)
  scarf.rotation.x = Math.PI / 2
  scarf.position.y = 1.2
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.3, 0.04), red)
  tail.position.set(0.1, 1.05, 0.2)
  tail.rotation.z = 0.2
  // Santa hat
  const hat = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.38, 16), red)
  hat.position.y = 1.72
  hat.rotation.z = -0.25
  const brim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.045, 8, 20), snow)
  brim.rotation.x = Math.PI / 2
  brim.position.y = 1.54
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), snow)
  pom.position.set(0.09, 1.9, 0)
  // Stick arms
  const wood = std('#5a3d2b')
  const arms = [-1, 1].map((side) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 5), wood)
    arm.position.set(side * 0.45, 1.05, 0)
    arm.rotation.z = side * -1.1
    return arm
  })
  g.add(bottom, middle, head, ...eyes, ...buttons, nose, scarf, tail, hat, brim, pom, ...arms)
  return g
}

function christmasTree(rand: () => number) {
  const g = snowyPine(1.3)
  const bulbs: THREE.MeshStandardMaterial[] = []
  const colors = ['#ff3b3b', '#ffd400', '#3bd1ff', '#7cff6b', '#ff7bd5']
  for (let i = 0; i < 18; i++) {
    const tier = Math.floor(rand() * 4)
    const r = (0.72 - tier * 0.17) * (0.8 + rand() * 0.1)
    const a = rand() * Math.PI * 2
    const color = colors[i % colors.length]!
    const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.2 })
    bulbs.push(m)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), m)
    bulb.position.set(Math.cos(a) * r, 0.62 + tier * 0.42 + rand() * 0.12, Math.sin(a) * r)
    g.add(bulb)
  }
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), new THREE.MeshStandardMaterial({ color: '#ffd400', emissive: '#ffd400', emissiveIntensity: 0.5 }))
  star.position.y = 2.45
  bulbs.push(star.material as THREE.MeshStandardMaterial)
  g.add(star)
  const light = new THREE.PointLight('#ffcf7a', 0, 4, 1.6)
  light.position.y = 1.2
  g.add(light)
  return { group: g, bulbs, light }
}

function buildWinter(ctx: LandContext, radius: number): LandInstance {
  const rand = seeded(53)
  const snowTop = std('#f4f8ff', { roughness: 1 })
  const { group } = floatingGround(ctx, radius, snowTop, '#c9d6e3', '#8796a8', 19)

  const sway = swayer()
  for (let i = 0; i < 10; i++) {
    const [x, z] = backdropSpot(rand, ctx.style, radius)
    const pine = pineTree(rand, 1.1 + rand() * 0.8, true)
    group.add(place(pine, x, ctx.groundY, z))
    sway.add(pine, rand() * 10)
  }
  // Little snow mounds
  for (let i = 0; i < 10; i++) {
    const [x, z] = outdoorSpot(rand, ctx.style, radius, 0.6)
    const mound = new THREE.Mesh(new THREE.SphereGeometry(0.25 + rand() * 0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), snowTop)
    group.add(place(mound, x, ctx.groundY, z))
  }

  const man = snowman()
  man.rotation.y = Math.PI / 4
  group.add(place(man, ctx.style.width / 2 + 1.4, ctx.groundY, -ctx.style.depth / 2 - 0.9))

  const xmas = christmasTree(rand)
  group.add(place(xmas.group, -ctx.style.width / 2 - 1.3, ctx.groundY, ctx.style.depth / 2 + 0.2))

  const snowfall = createSnowfall(700, ctx, radius + 2, rand)
  group.add(snowfall.points)

  const snowDay = new THREE.Color('#f4f8ff')
  const snowNight = new THREE.Color('#a9b9d3')

  return {
    group,
    starsAlways: false,
    sky: { night: new THREE.Color('#0b1424'), dusk: new THREE.Color('#e7b8a6'), day: new THREE.Color('#bcd3e8') },
    atmosphere: { turbidity: 6, rayleigh: 1.2, mie: 0.005 },
    update(time, dt, daylight, lamps) {
      snowTop.color.copy(snowNight).lerp(snowDay, daylight)
      snowfall.update(time, dt, daylight)
      sway.update(time)
      // Christmas lights twinkle at night
      xmas.bulbs.forEach((m, i) => {
        m.emissiveIntensity = 0.2 + lamps * (1.6 + Math.sin(time * 3 + i) * 0.8)
      })
      xmas.light.intensity = lamps * 3
    },
  }
}

export function buildLand(id: LandId, ctx: LandContext): LandInstance {
  const radius = Math.max(ctx.style.width, ctx.style.depth) * 1.1 + 2.5
  switch (id) {
    case 'mars':
      return buildMars(ctx, radius)
    case 'sakura':
      return buildSakura(ctx, radius)
    case 'winter':
      return buildWinter(ctx, radius)
    default:
      return buildIsland(ctx, radius)
  }
}

// ---------- Twinkling star sphere (all lands) ----------

export function createStarSphere(count = 1400) {
  const rand = seeded(97)
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const phases = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    // Uniform on a sphere so stars surround the whole scene, below the island too
    const u = rand() * 2 - 1
    const theta = rand() * Math.PI * 2
    const r = 85
    const s = Math.sqrt(1 - u * u)
    positions[i * 3] = r * s * Math.cos(theta)
    positions[i * 3 + 1] = r * u
    positions[i * 3 + 2] = r * s * Math.sin(theta)
    sizes[i] = 0.6 + rand() * 1.8
    phases[i] = rand() * Math.PI * 2
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
  const material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, opacity: { value: 0 }, pixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },
    vertexShader: `
      attribute float size;
      attribute float phase;
      uniform float time;
      uniform float pixelRatio;
      varying float vTwinkle;
      void main() {
        vTwinkle = 0.55 + 0.45 * sin(time * (1.2 + phase * 0.6) + phase * 7.0);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * pixelRatio * (0.8 + vTwinkle * 0.5);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform float opacity;
      varying float vTwinkle;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float alpha = smoothstep(0.5, 0.0, d) * opacity * vTwinkle;
        gl_FragColor = vec4(vec3(1.0, 0.98, 0.92), alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  return { points, material }
}
