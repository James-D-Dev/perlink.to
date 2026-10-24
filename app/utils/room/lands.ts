import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { cherryLeaves, greenLeaves, natureWind, scatterModel, type ScatterItem } from './natureModels'
import type { LandId, RoomStyle } from '~/types/room'
import { attachCityModel, beamMaterial, carMaterials, cityMaterials, createCar } from './cityModels'
import { CATALOG_BY_TYPE } from './catalog'

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
  { id: 'city', name: 'City', description: 'Downtown block: streets, traffic, street lamps and lit windows at night', icon: 'i-lucide-building-2', preview: 'linear-gradient(180deg,#9fcdf0 0%,#d9e6f2 55%,#8d8f95 56%,#55585e 100%)' },
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
  /** Ground surface, for finding the point under the cursor */
  ground?: THREE.Object3D
  /** Point on the ground under the cursor (null when it leaves); butterflies come to flowers near it */
  setAttractor?: (point: THREE.Vector3 | null) => void
  /** Tops of flower decor inside the room, extra places for butterflies to land */
  setRoomFlowers?: (spots: THREE.Vector3[]) => void
}

export interface LandContext {
  style: RoomStyle
  /** Top of the ground, just under the room floor */
  groundY: number
  /** Scenery density, 1 = full; lower on phones and low-memory devices */
  detail?: number
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

/**
 * Bake a group of plain-coloured meshes into a single vertex-coloured mesh, so
 * it costs one draw call and one material instead of one per part.
 */
function bakeGroup(source: THREE.Object3D, flatShading = true): THREE.Mesh {
  source.updateMatrixWorld(true)
  const inverse = source.matrixWorld.clone().invert()
  const relative = new THREE.Matrix4()
  const parts: THREE.BufferGeometry[] = []
  source.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return
    const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone()
    geometry.applyMatrix4(relative.multiplyMatrices(inverse, mesh.matrixWorld))
    for (const name of Object.keys(geometry.attributes)) {
      if (name !== 'position' && name !== 'normal') geometry.deleteAttribute(name)
    }
    const { r, g, b } = (mesh.material as THREE.MeshStandardMaterial).color
    const colors = new Float32Array(geometry.attributes.position!.count * 3)
    for (let i = 0; i < colors.length; i += 3) colors.set([r, g, b], i)
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    parts.push(geometry)
    mesh.geometry.dispose()
    ;(mesh.material as THREE.Material).dispose()
  })
  const merged = mergeGeometries(parts)
  parts.forEach(p => p.dispose())
  const mesh = new THREE.Mesh(merged, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading }))
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
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
function floatingGround(ctx: LandContext, radius: number, top: THREE.Material, _soil?: string, _rock?: string, _seed?: number) {
  // Just the top layer: the land floats without a soil band or rock underneath
  const group = new THREE.Group()
  const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.98, 0.4, 56), top)
  topMesh.position.y = ctx.groundY - 0.2
  topMesh.receiveShadow = true
  group.add(topMesh)
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
  // Trunk, tiers and snow caps become one mesh (they were ~9 draw calls per tree)
  const baked = new THREE.Group()
  baked.add(bakeGroup(tree))
  baked.scale.setScalar(scale)
  return baked
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

/**
 * Butterflies hop between flowers: rest with slow wing beats, then arc over
 * to another flower. Now and then two of them chase each other through the
 * air. Flowers near the cursor draw a couple of them over, and flower decor
 * inside the room counts as somewhere to land too.
 */
function createButterflies(count: number, spots: THREE.Vector3[], rand: () => number, colors: string[]) {
  type Mode = 'rest' | 'fly' | 'lead' | 'follow'
  const group = new THREE.Group()
  const lowest = Math.min(...spots.map(s => s.y))
  let roomSpots: THREE.Vector3[] = []
  /** At most this many butterflies go into the room at once */
  const ROOM_LIMIT = 3
  /** Flower the cursor is near, and the butterflies sent to it */
  let attraction: { spot: THREE.Vector3; flies: Set<number> } | null = null
  let chaseTimer = 6 + rand() * 6

  const flies = Array.from({ length: count }, (_, i) => {
    const model = butterflyModel(colors[i % colors.length]!)
    const from = spots[Math.floor(rand() * spots.length)]!.clone()
    group.add(model.group)
    model.group.position.copy(from)
    return {
      ...model,
      index: i,
      mode: 'rest' as Mode,
      from,
      to: from.clone(),
      ctrl: from.clone(),
      t: 1,
      duration: 1,
      rest: rand() * 2,
      phase: rand() * 10,
      velocity: new THREE.Vector3(),
      chaseUntil: 0,
      partner: -1,
      wander: new THREE.Vector3(),
      wanderAt: 0,
      center: new THREE.Vector3(),
      /** Heading to or resting on a flower inside the room */
      inRoom: false,
    }
  })
  type Fly = (typeof flies)[number]
  const tmp = new THREE.Vector3()
  const desired = new THREE.Vector3()

  /** A spot a little off a flower's center, so several butterflies don't stack exactly */
  const near = (spot: THREE.Vector3, spread = 0.1) =>
    spot.clone().add(new THREE.Vector3((rand() - 0.5) * spread, 0.02, (rand() - 0.5) * spread))

  const isRoomSpot = (spot: THREE.Vector3) => roomSpots.some(r => r.distanceTo(spot) < 0.05)
  /** Butterflies other than `except` that are in (or on their way into) the room */
  const inRoomCount = (except?: Fly) => flies.filter(o => o.inRoom && o !== except).length

  function destination(f: Fly) {
    if (attraction?.flies.has(f.index)) {
      f.inRoom = isRoomSpot(attraction.spot)
      return near(attraction.spot, 0.16)
    }
    // Now and then visit a flower in the room, while there's space for one more
    if (roomSpots.length && inRoomCount(f) < ROOM_LIMIT && rand() < 0.15) {
      f.inRoom = true
      return near(roomSpots[Math.floor(rand() * roomSpots.length)]!)
    }
    f.inRoom = false
    return spots[Math.floor(rand() * spots.length)]!.clone()
  }

  function takeOff(f: Fly, to: THREE.Vector3) {
    f.mode = 'fly'
    f.from.copy(f.group.position)
    f.to.copy(to)
    const distance = f.from.distanceTo(f.to)
    f.ctrl.copy(f.from).lerp(f.to, 0.5)
    // Short hops stay low; longer flights arc higher
    f.ctrl.y += 0.25 + Math.min(distance * 0.35, 1.2) + rand() * 0.6
    f.t = 0
    f.duration = 1 + distance * 0.35
    f.partner = -1
  }

  function startChase(time: number) {
    const free = flies.filter(f => f.mode === 'rest' || f.mode === 'fly')
      .filter(f => !attraction?.flies.has(f.index))
    if (free.length < 2) return
    const lead = free[Math.floor(rand() * free.length)]!
    // The partner is the nearest other butterfly, if it's close enough to notice
    const follow = free.filter(f => f !== lead)
      .sort((a, b) => a.group.position.distanceTo(lead.group.position) - b.group.position.distanceTo(lead.group.position))[0]!
    if (follow.group.position.distanceTo(lead.group.position) > 7) return
    const until = time + 3 + rand() * 2.5
    lead.center.copy(lead.group.position).lerp(follow.group.position, 0.5)
    lead.center.y = Math.max(lead.center.y, lowest) + 0.7
    for (const [f, mode, partner] of [[lead, 'lead', follow.index], [follow, 'follow', lead.index]] as const) {
      f.mode = mode
      f.partner = partner
      f.chaseUntil = until
      f.velocity.set(rand() - 0.5, 0.6, rand() - 0.5).normalize().multiplyScalar(0.8)
    }
    lead.wanderAt = 0
  }

  function face(f: Fly, direction: THREE.Vector3) {
    tmp.copy(f.group.position).add(direction)
    f.group.lookAt(tmp.x, f.group.position.y, tmp.z)
  }

  function flap(f: Fly, time: number, speed: number, amount: number) {
    const a = Math.sin(time * speed + f.phase) * amount
    f.right.rotation.z = a
    f.left.rotation.z = -a
  }

  function update(time: number, dt: number) {
    chaseTimer -= dt
    if (chaseTimer <= 0) {
      chaseTimer = 8 + rand() * 10
      startChase(time)
    }
    for (const f of flies) {
      if (f.mode === 'rest') {
        f.rest -= dt
        // Resting: slow, gentle wing beat
        f.right.rotation.z = 0.3 + Math.sin(time * 3 + f.phase) * 0.3
        f.left.rotation.z = -f.right.rotation.z
        if (f.rest <= 0) takeOff(f, destination(f))
        continue
      }

      if (f.mode === 'lead' || f.mode === 'follow') {
        if (time > f.chaseUntil) {
          takeOff(f, destination(f))
          continue
        }
        if (f.mode === 'lead') {
          // Zig-zag between random points in a small patch of air
          if (time > f.wanderAt) {
            f.wanderAt = time + 0.5 + rand() * 0.4
            f.wander.copy(f.center).add(new THREE.Vector3((rand() - 0.5) * 3, (rand() - 0.3) * 1, (rand() - 0.5) * 3))
            f.wander.y = Math.max(f.wander.y, lowest + 0.3)
          }
          desired.copy(f.wander).sub(f.group.position).setLength(1.5)
          f.velocity.lerp(desired, 1 - Math.exp(-dt * 3))
        } else {
          // Chase the leader, weaving a little behind it
          const leader = flies[f.partner]!
          desired.copy(leader.group.position)
            .add(tmp.set(Math.sin(time * 5 + f.phase) * 0.18, Math.cos(time * 4 + f.phase) * 0.12, Math.cos(time * 5 + f.phase) * 0.18))
            .sub(f.group.position)
          desired.setLength(Math.min(2, desired.length() * 2.2))
          f.velocity.lerp(desired, 1 - Math.exp(-dt * 4))
        }
        f.group.position.addScaledVector(f.velocity, dt)
        face(f, f.velocity)
        flap(f, time, 32, 1)
        continue
      }

      // Flying to a flower: quadratic bezier arc with a little flutter
      f.t = Math.min(1, f.t + dt / f.duration)
      const t = f.t
      tmp.set(0, 0, 0)
        .addScaledVector(f.from, (1 - t) * (1 - t))
        .addScaledVector(f.ctrl, 2 * (1 - t) * t)
        .addScaledVector(f.to, t * t)
      tmp.y += Math.sin(time * 6 + f.phase) * 0.04 * (1 - t)
      desired.copy(tmp).sub(f.group.position)
      if (desired.lengthSq() > 1e-8) face(f, desired)
      f.group.position.copy(tmp)
      flap(f, time, 28, 0.9)
      if (f.t >= 1) {
        f.mode = 'rest'
        // Butterflies called by the cursor linger on the flower
        f.rest = attraction?.flies.has(f.index) ? 2 + rand() * 2 : 1 + rand() * 2.5
      }
    }
  }

  /** Send the two nearest free butterflies to the flower closest to the cursor */
  function setAttractor(point: THREE.Vector3 | null) {
    const candidates = [...roomSpots, ...spots]
    const spot = point ? candidates.find(s => s.distanceTo(point) < 0.9) : undefined
    if (!spot) {
      attraction = null
      return
    }
    if (attraction?.spot === spot) return
    const nearest = flies.filter(f => f.mode !== 'lead' && f.mode !== 'follow')
      .sort((a, b) => a.group.position.distanceTo(spot) - b.group.position.distanceTo(spot))
    const chosen: Fly[] = []
    for (const f of nearest) {
      if (chosen.length === 2) break
      // A room flower only takes butterflies while the room has space
      if (isRoomSpot(spot) && !f.inRoom && inRoomCount() >= ROOM_LIMIT) continue
      chosen.push(f)
      f.inRoom = isRoomSpot(spot)
    }
    attraction = { spot, flies: new Set(chosen.map(f => f.index)) }
    for (const f of chosen) takeOff(f, near(spot, 0.16))
  }

  function setRoomFlowers(next: THREE.Vector3[]) {
    roomSpots = next
  }

  return { group, update, setAttractor, setRoomFlowers }
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
  // The puffs are merged into one mesh: one draw call per cloud instead of one per puff
  const parts: THREE.BufferGeometry[] = []
  for (let i = 0; i < n; i++) {
    const r = 0.8 + rand() * 0.9
    parts.push(new THREE.SphereGeometry(r, 12, 8).translate((i - n / 2) * 0.9 + rand() * 0.4, rand() * 0.5, (rand() - 0.5) * 1.2))
  }
  const geometry = mergeGeometries(parts)
  parts.forEach(p => p.dispose())
  g.add(new THREE.Mesh(geometry, material))
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
  // Grass is most of the land's triangles: the wispy variants are 3-4x heavier
  // per clump than the common ones, so they're used sparingly
  const per = (n: number) => Math.max(1, Math.round(n * (ctx.detail ?? 1)))
  scatterModel(group, 'Grass_Common_Short', clumps(rand, terrain, landSpots(rand, ctx, radius, 56), per(15), 0.9, [0.2, 0.32], avoid), { castShadow: false })
  scatterModel(group, 'Grass_Wispy_Short', clumps(rand, terrain, landSpots(rand, ctx, radius, 18), per(8), 0.7, [0.22, 0.34], avoid), { castShadow: false })
  scatterModel(group, 'Grass_Common_Tall', clumps(rand, terrain, landSpots(rand, ctx, radius, 22), per(8), 0.6, [0.35, 0.55], avoid), { castShadow: false })
  scatterModel(group, 'Grass_Wispy_Tall', clumps(rand, terrain, landSpots(rand, ctx, radius, 10), per(6), 0.5, [0.45, 0.65], avoid), { castShadow: false })

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
    ground: terrain.mesh,
    setAttractor: butterflies.setAttractor,
    setRoomFlowers: butterflies.setRoomFlowers,
  }
}

/**
 * Mars ground: rolling dunes and highlands pocked with impact craters (sunken
 * bowl, raised rim, light ejecta rays), flat around the room.
 */
function createMarsTerrain(ctx: LandContext, radius: number, rand: () => number) {
  const { width, depth } = ctx.style
  const roomDistance = (x: number, z: number) => Math.hypot(Math.max(Math.abs(x) - width / 2, 0), Math.max(Math.abs(z) - depth / 2, 0))

  // A few large craters and many small ones, kept clear of the room and of each other
  type Crater = { x: number; z: number; r: number; depth: number; fresh: boolean; rays: number }
  const craters: Crater[] = []
  const tryCrater = (r: number, tries = 40) => {
    for (let t = 0; t < tries; t++) {
      const a = rand() * Math.PI * 2
      const d = Math.sqrt(rand()) * (radius - r - 0.6)
      const x = Math.cos(a) * d
      const z = Math.sin(a) * d
      if (roomDistance(x, z) < r + 0.9) continue
      if (craters.some(c => Math.hypot(c.x - x, c.z - z) < (c.r + r) * 0.9)) continue
      craters.push({ x, z, r, depth: r * (0.22 + rand() * 0.12), fresh: rand() < 0.6, rays: rand() * 100 })
      return
    }
  }
  for (let i = 0; i < 3; i++) tryCrater(1.6 + rand() * 1.2)
  for (let i = 0; i < 9; i++) tryCrater(0.6 + rand() * 0.6)
  for (let i = 0; i < 22; i++) tryCrater(0.18 + rand() * 0.3)

  /** Crater shape at distance ratio t = d / r: bowl inside, rim at the edge, ejecta fading outside */
  const craterProfile = (t: number) => {
    const bowl = t < 1 ? -(1 - t * t) : 0
    const rim = Math.exp(-((t - 1) ** 2) / 0.045) * 0.55
    return bowl + rim
  }
  const relief = (x: number, z: number) => {
    const fromRoom = THREE.MathUtils.smoothstep(roomDistance(x, z), 0.5, 2.2)
    const edge = 1 - THREE.MathUtils.smoothstep(Math.hypot(x, z), radius - 1, radius - 0.05)
    // Wind-shaped dunes plus broad highlands behind the room
    const dunes = (fbm(x * 0.35 + z * 0.12, z * 0.35, 41) - 0.45) * 0.45
    const ridges = Math.abs(fbm(x * 0.18, z * 0.18, 47) - 0.5) * 0.9
    let h = (dunes + ridges) * fromRoom
    for (const c of craters) {
      const t = Math.hypot(x - c.x, z - c.z) / c.r
      if (t < 1.8) h += craterProfile(t) * c.depth
    }
    return h * edge
  }

  const geometry = new THREE.RingGeometry(0.001, radius, 200, 90)
  geometry.rotateX(-Math.PI / 2)
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const base = ['#a24f2e', '#b25c38', '#bd6a45', '#934527'].map(c => new THREE.Color(c))
  const floor = new THREE.Color('#5e2814')
  const dust = new THREE.Color('#dba27c')
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    pos.setY(i, relief(x, z))
    const n = fbm(x * 0.45, z * 0.45, 53)
    const idx = Math.min(Math.floor(n * base.length), base.length - 1)
    c.copy(base[idx]!).lerp(base[Math.min(idx + 1, base.length - 1)]!, (n * base.length) % 1)
    for (const cr of craters) {
      const dx = x - cr.x
      const dz = z - cr.z
      const t = Math.hypot(dx, dz) / cr.r
      if (t < 0.9) c.lerp(floor, (1 - (t / 0.9) ** 2) * 0.6)
      else if (t < 1.15) c.lerp(dust, 0.45)
      else if (cr.fresh && t < 2.4) {
        // Bright ejecta rays streaking out of fresh craters
        const ray = Math.max(0, Math.sin(Math.atan2(dz, dx) * 7 + cr.rays) * Math.sin(Math.atan2(dz, dx) * 3 + cr.rays * 1.7))
        c.lerp(dust, ray * (1 - (t - 1.15) / 1.25) * 0.55)
      }
    }
    colors.set([c.r, c.g, c.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = ctx.groundY + 0.01
  mesh.receiveShadow = true
  mesh.castShadow = true

  return { mesh, material, craters, heightAt: (x: number, z: number) => ctx.groundY + relief(x, z), roomDistance }
}

function buildMars(ctx: LandContext, radius: number): LandInstance {
  const rand = seeded(23)
  const group = new THREE.Group()
  const terrain = createMarsTerrain(ctx, radius, rand)
  group.add(terrain.mesh)

  // Edge band and underside, so the crater bowls aren't hidden by a solid top
  const crust = std('#8c3a1d', { flatShading: true })
  const band = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.98, 0.4, 160, 1, true), crust)
  band.position.y = ctx.groundY - 0.2
  const underside = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.98, 160), crust)
  underside.rotation.x = Math.PI / 2
  underside.position.y = ctx.groundY - 0.4
  group.add(band, underside)

  // Boulders: scattered, and clustered on the rims of the bigger craters
  const rockColors = ['#7a3418', '#8f4020', '#6a2c14', '#9a4a2a']
  const rocks = new THREE.Group()
  const addRock = (x: number, z: number, size: number) => {
    const rock = new THREE.Mesh(jitter(new THREE.DodecahedronGeometry(size, 0), rand, size * 0.25), std(rockColors[Math.floor(rand() * rockColors.length)]!, { flatShading: true }))
    rock.scale.y = 0.55 + rand() * 0.35
    rock.rotation.set(rand() * 0.6, rand() * Math.PI * 2, rand() * 0.6)
    rocks.add(place(rock, x, terrain.heightAt(x, z) + size * 0.25, z))
  }
  for (const crater of terrain.craters.filter(cr => cr.r > 0.5)) {
    const count = Math.round(crater.r * 3)
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2
      const d = crater.r * (1 + (rand() - 0.3) * 0.35)
      addRock(crater.x + Math.cos(a) * d, crater.z + Math.sin(a) * d, 0.06 + rand() * 0.14 * crater.r / 2)
    }
  }
  for (let i = 0; i < 26; i++) {
    const [x, z] = outdoorSpot(rand, ctx.style, radius, 0.6)
    if (terrain.roomDistance(x, z) < 0.4) continue
    addRock(x, z, 0.05 + rand() ** 2 * 0.3)
  }
  // All boulders as one mesh
  group.add(bakeGroup(rocks))

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

  const tintDay = new THREE.Color('#ffffff')
  const tintNight = new THREE.Color('#b4a29c')

  return {
    group,
    starsAlways: true,
    sky: { night: new THREE.Color('#05030c'), dusk: new THREE.Color('#1a0d2e'), day: new THREE.Color('#2a1440') },
    update(time, _dt, daylight) {
      terrain.material.color.copy(tintNight).lerp(tintDay, daylight)
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
    ground: terrain.mesh,
    setAttractor: butterflies.setAttractor,
    setRoomFlowers: butterflies.setRoomFlowers,
  }
}

// ---------- City ----------

/** Building footprints in pack units (x, z), for laying out the blocks */
const CITY_FOOTPRINTS: Record<string, [number, number]> = {
  Building1_Large: [8, 2.74],
  Building1_Small: [3.74, 2.74],
  Building2_Large: [5.72, 2.22],
  Building2_Small: [3.58, 2.48],
  Building3_Big: [4.7, 4.4],
  Building3_Small: [3.06, 4.4],
  Building4: [4.64, 3.86],
  House1: [2.56, 3.87],
  House2: [3.64, 3.09],
}

/** Street lamp with its arm along +x; the bulb and glow are shared so they light up together */
function streetLamp(bulb: THREE.Material, glow: THREE.SpriteMaterial) {
  const lamp = new THREE.Group()
  const metal = std('#2f3338', { roughness: 0.6, metalness: 0.4 })
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 3, 8), metal)
  pole.position.y = 1.5
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.05, 0.05), metal)
  arm.position.set(0.3, 2.96, 0)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.18), metal)
  head.position.set(0.58, 2.92, 0)
  const light = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.13), bulb)
  light.position.set(0.58, 2.865, 0)
  const halo = new THREE.Sprite(glow)
  halo.position.set(0.58, 2.8, 0)
  halo.scale.setScalar(1)
  lamp.add(pole, arm, head, light, halo)
  lamp.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true
  })
  return lamp
}

function buildCity(ctx: LandContext, radius: number): LandInstance {
  const rand = seeded(61)
  const { width, depth } = ctx.style
  const g0 = ctx.groundY
  // Plaza around the room, a road loop, then a sidewalk and the buildings
  const hx = width / 2 + 1.4
  const hz = depth / 2 + 1.4
  const road = 2.1
  const walk = 1.1
  const ox = hx + road + walk
  const oz = hz + road + walk

  // Lawns between the streets; roads and sidewalks are laid on top
  const lawnColor = new THREE.Color('#7ba65a')
  const lawn = std('#7ba65a', { roughness: 1 })
  const { group } = floatingGround(ctx, radius, lawn)
  // Ground the buildings, houses, park and trees must not overlap
  const blocked: { x0: number; z0: number; x1: number; z1: number }[] = []
  const block = (x: number, z: number, w: number, d: number, pad = 0) =>
    blocked.push({ x0: x - w / 2 - pad, z0: z - d / 2 - pad, x1: x + w / 2 + pad, z1: z + d / 2 + pad })
  const isFree = (x: number, z: number, w: number, d: number) =>
    !blocked.some(b => x + w / 2 > b.x0 && x - w / 2 < b.x1 && z + d / 2 > b.z0 && z - d / 2 < b.z1)

  // Flat ground layers; a shape's (x, y) maps to world (x, -z) once laid flat
  const rect = (x0: number, z0: number, x1: number, z1: number) => {
    const path = new THREE.Path()
    path.moveTo(x0, -z0)
    path.lineTo(x1, -z0)
    path.lineTo(x1, -z1)
    path.lineTo(x0, -z1)
    path.closePath()
    return path
  }
  const layer = (outerX: number, outerZ: number, innerX: number, innerZ: number, material: THREE.Material, y: number) => {
    const shape = new THREE.Shape(rect(-outerX, -outerZ, outerX, outerZ).getPoints())
    if (innerX > 0) shape.holes.push(rect(-innerX, -innerZ, innerX, innerZ))
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), material)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = g0 + y
    mesh.receiveShadow = true
    group.add(mesh)
  }
  const pavement = std('#aaa69e', { roughness: 0.95 })
  const asphalt = std('#3a3c42', { roughness: 0.9 })
  layer(hx, hz, 0, 0, pavement, 0.03)
  layer(hx + road, hz + road, hx, hz, asphalt, 0.012)
  layer(ox, oz, hx + road, hz + road, pavement, 0.03)

  // Avenues leading off the loop to the island edge, one on each side
  type Avenue = { axis: 'x' | 'z'; dir: 1 | -1; at: number }
  const avenues: Avenue[] = [
    { axis: 'x', dir: 1, at: 0.3 + road / 2 },
    { axis: 'z', dir: 1, at: 0.3 + road / 2 },
    { axis: 'z', dir: -1, at: 0.05 },
    { axis: 'x', dir: -1, at: 0.05 },
  ]
  const strip = (x0: number, z0: number, x1: number, z1: number, material: THREE.Material, y: number) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(x1 - x0), Math.abs(z1 - z0)), material)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set((x0 + x1) / 2, g0 + y, (z0 + z1) / 2)
    mesh.receiveShadow = true
    group.add(mesh)
  }
  for (const a of avenues) {
    const start = (a.axis === 'x' ? hx : hz) + road - 0.01
    const end = radius * 1.02
    const along = (from: number, to: number) => [a.dir * from, a.dir * to] as const
    const [s0, s1] = along(start, end)
    // Sidewalks either side, then the asphalt over the sidewalk ring it crosses
    for (const side of [-1, 1]) {
      const c = a.at + side * (road / 2 + 0.35)
      if (a.axis === 'x') strip(s0, c - 0.35, s1, c + 0.35, pavement, 0.031)
      else strip(c - 0.35, s0, c + 0.35, s1, pavement, 0.031)
    }
    if (a.axis === 'x') strip(s0, a.at - road / 2, s1, a.at + road / 2, asphalt, 0.033)
    else strip(a.at - road / 2, s0, a.at + road / 2, s1, asphalt, 0.033)
    const mid = a.dir * (start + end) / 2
    if (a.axis === 'x') block(mid, a.at, end - start, road + 1.4, 0.2)
    else block(a.at, mid, road + 1.4, end - start, 0.2)
  }
  block(0, 0, ox * 2, oz * 2, 0.2)

  // Lane markings and crosswalks
  const paint = std('#eeeeea', { roughness: 0.6 })
  const markings = new THREE.Group()
  const mark = (x: number, z: number, w: number, d: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), paint)
    m.rotation.x = -Math.PI / 2
    m.position.set(x, g0 + 0.036, z)
    markings.add(m)
  }
  const cx = hx + road / 2
  const cz = hz + road / 2
  for (let x = -cx + 0.6; x < cx - 0.6; x += 1) {
    mark(x, cz, 0.5, 0.07)
    mark(x, -cz, 0.5, 0.07)
  }
  for (let z = -cz + 0.6; z < cz - 0.6; z += 1) {
    mark(cx, z, 0.07, 0.5)
    mark(-cx, z, 0.07, 0.5)
  }
  // Crosswalks at the back-right corner, off to the side of the view
  for (let i = 0; i < 6; i++) {
    mark(width / 2 - 0.4 + i * 0.32, -cz, 0.18, road * 0.85)
    mark(cx, -(depth / 2 - 0.4 + i * 0.32), road * 0.85, 0.18)
  }
  for (const a of avenues) {
    const start = (a.axis === 'x' ? hx : hz) + road + 0.6
    for (let d = start; d < radius - 0.4; d += 1) {
      if (a.axis === 'x') mark(a.dir * d, a.at, 0.5, 0.07)
      else mark(a.at, a.dir * d, 0.07, 0.5)
    }
  }
  group.add(markings)
  const markGeometries = markings.children.map(m => (m as THREE.Mesh).geometry.clone().applyMatrix4(m.matrix.compose(m.position, m.quaternion, m.scale)))
  markings.clear()
  group.remove(markings)
  const markMesh = new THREE.Mesh(mergeGeometries(markGeometries), paint)
  markMesh.receiveShadow = true
  group.add(markMesh)

  // Buildings: tall rows behind the walls, lower houses to the sides, the front corner kept open
  const fits = (x: number, z: number, w: number, d: number) =>
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].every(([sx, sz]) => Math.hypot(x + sx! * w / 2, z + sz! * d / 2) < radius - 0.3)
  /** Houses, so each can get flower pots by its door */
  const houses: { x: number; z: number; rotation: number; depth: number }[] = []
  const row = (names: string[], scale: number, axis: 'x' | 'z', from: number, to: number, edge: number, rotation: number) => {
    // Leave a gap where an avenue crosses this row
    const gaps = avenues
      .filter(a => a.axis !== axis && Math.sign(edge) === a.dir)
      .map(a => [a.at - road / 2 - 1.1, a.at + road / 2 + 1.1] as const)
    let cursor = from
    let i = 0
    let misses = 0
    while (cursor < to) {
      const name = names[i % names.length]!
      i++
      const [fx, fz] = CITY_FOOTPRINTS[name]!
      const along = fx * scale
      const across = fz * scale
      const offset = edge + Math.sign(edge) * (across / 2 + 0.25)
      const x = axis === 'x' ? cursor + along / 2 : offset
      const z = axis === 'x' ? offset : cursor + along / 2
      const [w, d] = axis === 'x' ? [along, across] : [across, along]
      const gap = gaps.find(([g0_, g1]) => cursor < g1 && cursor + along > g0_)
      if (!gap && fits(x, z, w, d) && isFree(x, z, w, d)) {
        attachCityModel(group, name, x, g0, z, rotation, scale).catch(() => {})
        block(x, z, w, d, 0.2)
        if (name.startsWith('House')) houses.push({ x, z, rotation, depth: across })
        cursor += along + 0.35
        misses = 0
      } else if (++misses >= names.length) {
        // Nothing fits here: skip past the avenue, or along the curving island edge
        const blocking = gaps.find(([g0_, g1]) => cursor < g1 && cursor + 2 > g0_)
        cursor = blocking && cursor >= blocking[0] - 2 ? blocking[1] : cursor + 0.5
        misses = 0
      }
    }
  }
  row(['Building2_Large', 'Building1_Small', 'Building4', 'Building2_Small'], 1.15, 'x', -ox, radius, -oz, 0)
  // Side rows stop at the street corners so they don't overlap the back row
  row(['Building3_Big', 'Building1_Large', 'Building2_Small'], 1.15, 'z', -oz, oz, -ox, Math.PI / 2)
  row(['House2', 'House1'], 0.95, 'z', -oz, -0.5, ox, -Math.PI / 2)
  row(['House1', 'House2'], 0.95, 'x', -ox, -0.5, oz, Math.PI)
  // Corner tower behind the room
  const corner = -Math.max(ox, oz) - 2.6
  if (fits(corner, corner, 4.7 * 1.3, 4.4 * 1.3) && isFree(corner, corner, 6, 6)) {
    attachCityModel(group, 'Building3_Big', corner, g0, corner, Math.PI / 4, 1.3).catch(() => {})
    block(corner, corner, 6.2, 6.2)
  }

  let pondWater: ReturnType<typeof createWater> | null = null
  // Park with a pond on the open corner between the two front avenues; kept
  // low (no trees) because it sits in front of the camera
  const pondR = 1.3
  const pondX = (0.3 + road + 0.7 + Math.min(ox + 3, radius * 0.55)) / 2 + 0.6
  const pondZ = Math.min(oz + pondR + 1.6, Math.sqrt(Math.max((radius - pondR - 0.8) ** 2 - pondX ** 2, 0)))
  const parkFits = Math.hypot(pondX, pondZ) + pondR < radius - 0.5 && pondZ - pondR > oz + 0.2
  const parkSpots: [number, number][] = []
  if (parkFits) {
    const water = createWater(pondR)
    water.mesh.position.set(pondX, g0 + 0.035, pondZ)
    group.add(water.mesh)
    pondWater = water
    block(pondX, pondZ, pondR * 2 + 2.2, pondR * 2 + 2.2)
    const shore: ScatterItem[] = []
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 + rand() * 0.15
      const r = pondR + 0.05 + rand() * 0.12
      shore.push({ x: pondX + Math.cos(a) * r, y: g0, z: pondZ + Math.sin(a) * r, height: 0.12 + rand() * 0.12, rotation: rand() * Math.PI * 2 })
    }
    for (const [name, items] of byVariant(['Pebble_Round_1', 'Pebble_Round_2', 'Pebble_Round_3', 'Pebble_Round_4'], shore, rand)) scatterModel(group, name, items)
    const reeds: ScatterItem[] = Array.from({ length: 10 }, (_, i) => {
      const a = Math.PI * (0.9 + (i / 10) * 0.9)
      return { x: pondX + Math.cos(a) * (pondR + 0.25), y: g0, z: pondZ + Math.sin(a) * (pondR + 0.25), height: 0.5 + rand() * 0.3, rotation: rand() * Math.PI * 2 }
    })
    scatterModel(group, 'Grass_Wispy_Tall', reeds, { castShadow: false })
    for (let i = 0; i < 4; i++) {
      const pad = new THREE.Mesh(new THREE.CircleGeometry(0.16, 14, 0.3, Math.PI * 1.8), std('#4f9d3a', { side: THREE.DoubleSide }))
      pad.rotation.x = -Math.PI / 2
      const a = rand() * Math.PI * 2
      const r = rand() * 0.8
      pad.position.set(pondX + Math.cos(a) * r, g0 + 0.045, pondZ + Math.sin(a) * r)
      group.add(pad)
    }
    // Flowers and bushes around the pond
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.3
      parkSpots.push([pondX + Math.cos(a) * (pondR + 0.9), pondZ + Math.sin(a) * (pondR + 0.9)])
    }
    const flowers = parkSpots.map(([x, z]) => ({ x, y: g0, z, height: 0.3 + rand() * 0.12, rotation: rand() * Math.PI * 2 }))
    for (const [name, items] of byVariant(['Flower_3_Group', 'Flower_4_Group', 'Bush_Common_Flowers'], flowers, rand)) scatterModel(group, name, items, { castShadow: false })
  }

  // Street lamps along the outer sidewalk, facing the road
  const bulb = new THREE.MeshStandardMaterial({ color: '#fff4d8', emissive: '#ffd58a', emissiveIntensity: 0 })
  const glow = new THREE.SpriteMaterial({ map: softDotTexture(), color: '#ffcf7a', blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 })
  const lampSpots: [number, number, number][] = [
    [hx + road + 0.4, -hz + 0.6, Math.PI], [hx + road + 0.4, hz - 0.6, Math.PI],
    [-hx + 0.6, hz + road + 0.4, Math.PI / 2], [hx - 0.6, hz + road + 0.4, Math.PI / 2],
    [-hx - road - 0.4, hz - 0.6, 0], [hx - 0.6, -hz - road - 0.4, -Math.PI / 2],
  ]
  for (const a of avenues) {
    // One lamp partway down each avenue, arm reaching over the road
    const d = ((a.axis === 'x' ? hx : hz) + road + radius) / 2
    const side = a.at + road / 2 + 0.4
    if (a.axis === 'x') lampSpots.push([a.dir * d, side, -Math.PI / 2])
    else lampSpots.push([side, a.dir * d, Math.PI])
  }
  // Pools of light on the ground under each lamp at night
  const poolMaterial = new THREE.MeshBasicMaterial({ map: softDotTexture(), color: '#ffcf86', blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false })
  const poolGeometry = new THREE.PlaneGeometry(3.2, 3.2)
  for (const [x, z, angle] of lampSpots) {
    const lamp = streetLamp(bulb, glow)
    lamp.position.set(x, g0 + 0.03, z)
    lamp.rotation.y = angle
    group.add(lamp)
    // The bulb hangs 0.58 m along the arm
    const pool = new THREE.Mesh(poolGeometry, poolMaterial)
    pool.rotation.x = -Math.PI / 2
    pool.position.set(x + Math.cos(angle) * 0.58, g0 + 0.04, z - Math.sin(angle) * 0.58)
    pool.renderOrder = 1
    group.add(pool)
  }

  // Traffic light on the back-right corner, cycling green, amber, red
  const signal = new THREE.Group()
  const signalMetal = std('#2b2e33', { roughness: 0.6, metalness: 0.4 })
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.4, 8), signalMetal)
  post.position.y = 1.2
  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 0.2), signalMetal)
  housing.position.y = 2.35
  signal.add(post, housing)
  const signalColors = ['#ff3b30', '#ffcc00', '#34c759']
  const signalLights = signalColors.map((color, i) => {
    const material = new THREE.MeshStandardMaterial({ color: '#222222', emissive: color, emissiveIntensity: 0 })
    const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), material)
    bulbMesh.position.set(0, 2.55 - i * 0.2, 0.11)
    signal.add(bulbMesh)
    return material
  })
  signal.position.set(hx + road + 0.35, g0 + 0.03, -hz - road - 0.35)
  // Lights turned toward the default camera
  signal.rotation.y = 0.4
  group.add(signal)

  // Trees in planters along the outer sidewalk, and a small park on the open corner
  const planter = std('#8e8a83', { roughness: 0.9 })
  const trees: ScatterItem[] = []
  const treeAt = (x: number, z: number, height: number) => {
    if (Math.hypot(x, z) > radius - 0.6) return
    const box = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.3, 12), planter)
    box.position.set(x, g0 + 0.15, z)
    box.castShadow = true
    box.receiveShadow = true
    group.add(box)
    trees.push({ x, y: g0 + 0.28, z, height, rotation: rand() * Math.PI * 2 })
    block(x, z, 1, 1)
  }
  // Only on the far halves of the front streets, so they don't hide the room
  for (let z = -hz; z < 0; z += 3) treeAt(ox - 0.45, z + 1.2, 2.6 + rand() * 0.8)
  for (let x = -hx; x < 0; x += 3) treeAt(x + 1.2, oz - 0.45, 2.6 + rand() * 0.8)
  // Fill the leftover ground: small houses facing the nearest street, then trees
  const candidates: [number, number][] = []
  for (let x = -radius; x <= radius; x += 0.9) {
    for (let z = -radius; z <= radius; z += 0.9) candidates.push([x, z])
  }
  candidates.sort(() => rand() - 0.5)
  let fillerHouses = 0
  // The quadrant between the camera and the room stays open (park, low plants only)
  const cameraSide = (x: number, z: number) => x > 0 && z > 0
  for (const [x, z] of candidates) {
    if (fillerHouses >= 8) break
    if (cameraSide(x, z)) continue
    const name = rand() < 0.5 ? 'House1' : 'House2'
    const [fx, fz] = CITY_FOOTPRINTS[name]!
    const scale = 0.8
    // Face the centre along whichever axis is further out
    const alongX = Math.abs(x) > Math.abs(z)
    const rotation = alongX ? -Math.sign(x) * Math.PI / 2 : (z > 0 ? Math.PI : 0)
    const [w, d] = alongX ? [fz * scale, fx * scale] : [fx * scale, fz * scale]
    if (!fits(x, z, w, d) || !isFree(x, z, w + 0.8, d + 0.8)) continue
    attachCityModel(group, name, x, g0, z, rotation, scale).catch(() => {})
    block(x, z, w, d, 0.5)
    houses.push({ x, z, rotation, depth: fz * scale })
    fillerHouses++
  }
  for (const [x, z] of candidates) {
    if (trees.length >= 40) break
    if (cameraSide(x, z) || Math.hypot(x, z) > radius - 0.7 || !isFree(x, z, 1.3, 1.3)) continue
    trees.push({ x, y: g0, z, height: 2.2 + rand() * 1.4, rotation: rand() * Math.PI * 2 })
    block(x, z, 1.3, 1.3)
  }
  for (const [name, list] of byVariant(['CommonTree_2', 'CommonTree_3', 'CommonTree_4', 'CommonTree_1'], trees, rand)) scatterModel(group, name, list)

  // The open lawn on the camera side gets low planting only: flower beds and bushes
  const low: ScatterItem[] = []
  for (const [x, z] of candidates) {
    if (low.length >= 18) break
    if (!cameraSide(x, z) || Math.hypot(x, z) > radius - 0.6 || !isFree(x, z, 0.9, 0.9)) continue
    low.push({ x, y: g0, z, height: 0.35 + rand() * 0.35, rotation: rand() * Math.PI * 2 })
    block(x, z, 0.9, 0.9)
  }
  for (const [name, list] of byVariant(['Bush_Common_Flowers', 'Flower_3_Group', 'Flower_4_Group', 'Bush_Common'], low, rand)) {
    scatterModel(group, name, list, { castShadow: name.startsWith('Bush'), material: name === 'Bush_Common' ? greenLeaves : undefined })
  }

  // Pots by each house's door (house fronts face +z before rotation)
  const potTypes = ['garden-flower-pot', 'garden-fern-pot', 'garden-ceramic-flowers', 'garden-flower-pot']
  houses.forEach((h, i) => {
    const front = new THREE.Vector3(Math.sin(h.rotation), 0, Math.cos(h.rotation))
    const side = new THREE.Vector3(front.z, 0, -front.x)
    for (const [k, offset] of [[0, -0.75], [1, 0.75]] as const) {
      const item = CATALOG_BY_TYPE[potTypes[(i * 2 + k) % potTypes.length]!]
      if (!item) continue
      const pot = item.build(item.defaultColor)
      pot.scale.setScalar(0.85)
      pot.position.set(h.x + front.x * (h.depth / 2 + 0.3) + side.x * offset, g0 + 0.03, h.z + front.z * (h.depth / 2 + 0.3) + side.z * offset)
      pot.traverse(o => ((o as THREE.Mesh).isMesh && (o.castShadow = true)))
      group.add(pot)
    }
  })

  // Benches on the plaza in front of the room
  const wood = std('#8a5a3a', { roughness: 0.8 })
  const bench = (x: number, z: number, angle: number) => {
    const b = new THREE.Group()
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.36), wood)
    seat.position.y = 0.42
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 0.05), wood)
    back.position.set(0, 0.62, -0.16)
    b.add(seat, back)
    for (const sx of [-0.52, 0.52]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.34), signalMetal)
      leg.position.set(sx, 0.21, 0)
      b.add(leg)
    }
    b.traverse(o => ((o as THREE.Mesh).isMesh && (o.castShadow = true)))
    b.position.set(x, g0 + 0.03, z)
    b.rotation.y = angle
    group.add(b)
  }
  bench(hx - 0.55, -0.6, -Math.PI / 2)
  bench(0.6, hz - 0.55, Math.PI)
  if (parkFits) bench(pondX - pondR - 0.9, pondZ, Math.PI / 2)

  // Cars driving round the loop, one lane each way
  const loop = (half: number) => {
    // Rounded rectangle through the lane centre
    const ax = hx + half
    const az = hz + half
    const r = 0.8
    const points: THREE.Vector3[] = []
    const corners: [number, number, number][] = [[ax - r, az - r, 0], [-ax + r, az - r, Math.PI / 2], [-ax + r, -az + r, Math.PI], [ax - r, -az + r, Math.PI * 1.5]]
    for (const [x, z, start] of corners) {
      for (let k = 0; k <= 4; k++) {
        const a = start + (k / 4) * (Math.PI / 2)
        points.push(new THREE.Vector3(x + Math.cos(a) * r, 0, z + Math.sin(a) * r))
      }
    }
    return new THREE.CatmullRomCurve3(points, true, 'centripetal')
  }
  const outerLane = loop(road * 0.73)
  const innerLane = loop(road * 0.27)
  const CAR_SCALE = 0.42
  const cars = [
    { model: 'Taxi', lane: outerLane, speed: 1.6, t: 0.05, reverse: false },
    { model: 'NormalCar1', lane: outerLane, speed: 1.6, t: 0.55, reverse: false },
    { model: 'Cop', lane: innerLane, speed: 1.5, t: 0.3, reverse: true },
  ].map((c) => {
    const mesh = createCar(c.model, CAR_SCALE, true)
    group.add(mesh)
    return { ...c, mesh, length: c.lane.getLength(), velocity: c.speed }
  })
  // Crosswalks at the traffic light: cars wait before them on amber and red
  const crossings = [
    { x0: width / 2 - 0.65, x1: width / 2 - 0.4 + 5 * 0.32 + 0.25, z0: -hz - road, z1: -hz },
    { x0: hx, x1: hx + road, z0: -(depth / 2 - 0.4 + 5 * 0.32 + 0.25), z1: -(depth / 2 - 0.65) },
  ]
  const onCrossing = (p: THREE.Vector3) => crossings.some(c => p.x > c.x0 && p.x < c.x1 && p.z > c.z0 && p.z < c.z1)
  const ahead = new THREE.Vector3()
  // Parked along the avenues, against the kerb
  const parked: [string, Avenue, number][] = [['SUV', avenues[0]!, 0.75], ['SportsCar', avenues[1]!, 0.7], ['NormalCar2', avenues[0]!, 0.9]]
  for (const [model, a, f] of parked) {
    const d = ((a.axis === 'x' ? hx : hz) + road) * (1 - f) + radius * f * 0.92
    const lane = a.at - road * 0.3
    const car = createCar(model, CAR_SCALE)
    if (a.axis === 'x') {
      car.position.set(a.dir * d, g0 + 0.033, lane)
      car.rotation.y = a.dir > 0 ? Math.PI : 0
    } else {
      car.position.set(lane, g0 + 0.033, a.dir * d)
      car.rotation.y = a.dir > 0 ? Math.PI / 2 : -Math.PI / 2
    }
    if (Math.hypot(car.position.x, car.position.z) < radius - 1) group.add(car)
  }
  const tangent = new THREE.Vector3()

  const cloudMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#dfe8f2', emissiveIntensity: 0.12 })
  const clouds = skyClouds(group, rand, cloudMaterial)

  const nightTint = new THREE.Color('#3b4258')
  const white = new THREE.Color('#ffffff')
  const cloudNight = new THREE.Color('#4a5470')

  return {
    group,
    starsAlways: false,
    sky: { night: new THREE.Color('#0b1026'), dusk: new THREE.Color('#f09a6b'), day: new THREE.Color('#9fcdf0') },
    atmosphere: { turbidity: 4, rayleigh: 1.6, mie: 0.005 },
    update(time, dt, daylight, lamps) {
      natureWind.value = time
      lawn.color.copy(nightTint).lerp(white, daylight).multiply(lawnColor)
      if (pondWater) {
        pondWater.uniforms.time.value = time
        pondWater.uniforms.daylight.value = daylight
      }
      cityMaterials.body.color.copy(nightTint).lerp(white, daylight)
      cityMaterials.windows.emissiveIntensity = lamps * 0.9
      bulb.emissiveIntensity = lamps * 2.2
      glow.opacity = lamps * 0.5
      poolMaterial.opacity = lamps * 0.45
      beamMaterial.opacity = lamps * 0.55
      carMaterials.head.emissiveIntensity = 0.3 + lamps * 2
      carMaterials.tail.emissiveIntensity = 0.3 + lamps * 1.2
      // Police lights flash in short double pulses
      carMaterials.siren.emissiveIntensity = (time * 4) % 2 < 0.25 || ((time * 4) % 2 > 0.5 && (time * 4) % 2 < 0.75) ? 3 : 0.2
      cloudMaterial.color.copy(cloudNight).lerp(white, daylight)
      clouds.rotation.y = time * 0.004
      // 9 s cycle: green 5 s, amber 1 s, red 3 s
      const phase = time % 9
      const active = phase < 5 ? 2 : phase < 6 ? 1 : 0
      signalLights.forEach((m, i) => (m.emissiveIntensity = i === active ? 2.2 : 0.05))
      const stopping = active !== 2
      for (const car of cars) {
        const p = car.lane.getPointAt(car.t)
        car.lane.getTangentAt(car.t, tangent)
        if (car.reverse) tangent.negate()
        let target = car.speed
        // Wait at the crossing: the front bumper would roll onto it, the car isn't on it yet
        ahead.copy(p).addScaledVector(tangent, 1.05)
        if (stopping && onCrossing(ahead) && !onCrossing(p)) target = 0
        // Keep a safe gap behind the car ahead in the same lane
        for (const other of cars) {
          if (other === car || other.lane !== car.lane || other.reverse !== car.reverse) continue
          const gap = ((((other.t - car.t) * (car.reverse ? -1 : 1)) % 1) + 1) % 1 * car.length
          if (gap < 3.4) target = Math.min(target, Math.max(0, (gap - 2.3) * 1.4))
        }
        // Brake firmly, pull away gently
        const change = target - car.velocity
        car.velocity += THREE.MathUtils.clamp(change, -3.5 * dt, 1.1 * dt)
        car.t = (car.t + (car.reverse ? -1 : 1) * (car.velocity * dt) / car.length + 1) % 1
        car.mesh.position.set(p.x, g0 + 0.012, p.z)
        car.mesh.rotation.y = Math.atan2(-tangent.z, tangent.x)
      }
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
    case 'city':
      // A city needs more room for streets and buildings
      return buildCity(ctx, radius * 1.65)
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
