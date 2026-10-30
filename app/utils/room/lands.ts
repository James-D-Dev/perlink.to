import * as THREE from 'three'
import { gpuKit } from './gpu'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { cherryLeaves, greenLeaves, gustAt, natureTexture, natureWind, scatterModel, swayingMaterial, windField, type ScatterItem } from './natureModels'
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
  /** CSS gradient for the picker card: sky -> ground (shown while the picture loads) */
  preview: string
  /** Picture of the land for the picker (rendered from the scene, 480×288) */
  thumbnail: string
}

export const LANDS: LandMeta[] = [
  { id: 'island', name: 'Sky island', description: 'Floating island above the clouds, flowers and butterflies', icon: 'i-lucide-cloud-sun', preview: 'linear-gradient(180deg,#8fd0f5 0%,#cfeaff 55%,#6fbf5a 56%,#4f8a3a 100%)', thumbnail: '/images/lands/island.webp' },
  { id: 'mars', name: 'Mars', description: 'Red planet surface floating in space, planets all around', icon: 'i-lucide-orbit', preview: 'linear-gradient(180deg,#0b0614 0%,#2a1440 55%,#c4572d 56%,#7a2f18 100%)', thumbnail: '/images/lands/mars.webp' },
  { id: 'sakura', name: 'Sakura', description: 'Cherry blossoms, falling petals, butterflies and a pond', icon: 'i-lucide-flower-2', preview: 'linear-gradient(180deg,#bfe3ff 0%,#ffd6e8 55%,#9fd88a 56%,#6fb35a 100%)', thumbnail: '/images/lands/sakura.webp' },
  { id: 'crimson', name: 'Crimson sakura', description: 'A giant crimson cherry tree, red grass and petals drifting under a blue sky', icon: 'i-lucide-trees', preview: 'linear-gradient(180deg,#5d9cf0 0%,#a9cdf7 55%,#a3173a 56%,#5c0f22 100%)', thumbnail: '/images/lands/crimson.webp' },
  { id: 'city', name: 'City', description: 'Downtown block: streets, traffic, street lamps and lit windows at night', icon: 'i-lucide-building-2', preview: 'linear-gradient(180deg,#9fcdf0 0%,#d9e6f2 55%,#8d8f95 56%,#55585e 100%)', thumbnail: '/images/lands/city.webp' },
  { id: 'winter', name: 'Winter', description: 'Snowfall, snowy pines and a snowman with a Santa hat', icon: 'i-lucide-snowflake', preview: 'linear-gradient(180deg,#9fb8d1 0%,#dce8f3 55%,#f4f8ff 56%,#d6e2ef 100%)', thumbnail: '/images/lands/winter.webp' },
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
  /** Light scaled for this land (1 = as usual): less sky light keeps saturated colours from turning pastel */
  light?: { sun?: number; sky?: number; exposure?: number }
  /** A landmark the low-angle video shot looks up at (crimson's giant tree) */
  focus?: { position: THREE.Vector3; height: number }
  /** Ground height at a point (absolute y), for cameras close to the ground */
  heightAt?: (x: number, z: number) => number
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

// Butterfly: a low-poly, rigged monarch by Čestmír Dammer (CC0, from
// OpenGameArt "Butterfly (animated)"), exported from Blender with its three
// actions baked (Flying, Sitting1, Sitting2). Its wing texture is recoloured
// to each land's palette.
const BUTTERFLY_DIR = '/models/butterfly/'
/** Wingspan in meters */
const BUTTERFLY_SPAN = 0.34
/** One wing beat of the Flying clip, in radians per second (10 frames at 24 fps) */
const FLYING_BEAT = (2 * Math.PI * 24) / 10

let butterflyAsset: Promise<{ scene: THREE.Object3D; clips: THREE.AnimationClip[]; skin: HTMLImageElement }> | null = null
function loadButterfly() {
  butterflyAsset ??= Promise.all([
    new GLTFLoader().loadAsync(`${BUTTERFLY_DIR}butterfly.glb`),
    new THREE.ImageLoader().loadAsync(`${BUTTERFLY_DIR}butterfly-skin.png`),
  ]).then(([gltf, skin]) => ({ scene: gltf.scene, clips: gltf.animations, skin }))
  return butterflyAsset
}

const butterflyMaterials = new Map<string, THREE.MeshStandardMaterial>()
/** The monarch's orange and yellow turned to `color`; black veins and white spots stay */
function butterflyMaterial(color: string, skin: HTMLImageElement) {
  let material = butterflyMaterials.get(color)
  if (material) return material
  const canvas = document.createElement('canvas')
  canvas.width = skin.width
  canvas.height = skin.height
  const g = canvas.getContext('2d')!
  g.drawImage(skin, 0, 0)
  const image = g.getImageData(0, 0, canvas.width, canvas.height)
  const target = new THREE.Color(color).getHSL({ h: 0, s: 0, l: 0 })
  const px = new THREE.Color()
  const hsl = { h: 0, s: 0, l: 0 }
  const d = image.data
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3]! < 8) continue
    px.setRGB(d[i]! / 255, d[i + 1]! / 255, d[i + 2]! / 255, THREE.SRGBColorSpace).getHSL(hsl, THREE.SRGBColorSpace)
    // Only the coloured parts of the wing
    if (hsl.s < 0.35 || hsl.l < 0.15 || hsl.l > 0.92) continue
    px.setHSL(target.h, Math.min(1, hsl.s * 0.5 + target.s * 0.6), hsl.l * 0.55 + target.l * 0.45, THREE.SRGBColorSpace)
    const out = px.getStyle(THREE.SRGBColorSpace).match(/\d+/g)!
    d[i] = Number(out[0]); d[i + 1] = Number(out[1]); d[i + 2] = Number(out[2])
  }
  g.putImageData(image, 0, 0)
  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  // glTF texture coordinates
  map.flipY = false
  material = new THREE.MeshStandardMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.65 })
  butterflyMaterials.set(color, material)
  return material
}

/**
 * One butterfly: an empty group right away, the animated model inside once it
 * has loaded. `wings` sets the beat (radians per second, like the drawn
 * butterflies before; 0 = perched) and `tick` advances the animation.
 */
function butterflyModel(color: string) {
  const group = new THREE.Group()
  let mixer: THREE.AnimationMixer | null = null
  let fly: THREE.AnimationAction | null = null
  let sit: THREE.AnimationAction | null = null
  let flyWeight = 0
  let target = { weight: 0.35, beat: 3 }
  loadButterfly().then(({ scene, clips, skin }) => {
    const model = cloneSkinned(scene)
    const material = butterflyMaterial(color, skin)
    model.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return
      ;(obj as THREE.Mesh).material = material
      // Geometry and material are shared by every butterfly
      obj.userData.shared = true
      obj.frustumCulled = false
    })
    // Wingspan 10.44 units, head towards +Z, body 0.85 up: centre the body
    const scale = BUTTERFLY_SPAN / 10.44
    model.scale.setScalar(scale)
    model.position.set(0, -0.85 * scale, 0.48 * scale)
    group.add(model)
    mixer = new THREE.AnimationMixer(model)
    const clip = (name: string) => clips.find(c => c.name === name)
    const flying = clip('Flying')
    const sitting = clip('Sitting1') ?? clip('Sitting2')
    if (flying) {
      fly = mixer.clipAction(flying).play()
      fly.time = Math.random() * flying.duration
    }
    if (sitting) sit = mixer.clipAction(sitting).play()
  }).catch(() => {})
  return {
    group,
    wings(beat: number, perched: boolean) {
      target = perched ? { weight: 0.35, beat: 3 } : { weight: 1, beat }
    },
    tick(dt: number) {
      if (!mixer) return
      flyWeight += (target.weight - flyWeight) * Math.min(1, dt * 6)
      fly?.setEffectiveWeight(flyWeight).setEffectiveTimeScale(target.beat / FLYING_BEAT)
      sit?.setEffectiveWeight(1 - flyWeight)
      mixer.update(dt)
    },
  }
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

  function flap(f: Fly, speed: number) {
    f.wings(speed, false)
  }

  function update(time: number, dt: number) {
    chaseTimer -= dt
    if (chaseTimer <= 0) {
      chaseTimer = 8 + rand() * 10
      startChase(time)
    }
    for (const f of flies) {
      f.tick(dt)
      if (f.mode === 'rest') {
        f.rest -= dt
        // Resting: perched, with a slow, gentle wing beat
        f.wings(3, true)
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
        flap(f, 32)
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
      flap(f, 28)
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

/**
 * Sized, soft points whose positions change each frame. On WebGPU points are
 * 1 pixel wide, so there they're instanced sprites (./gpu.ts)
 */
function sizedPoints(positions: Float32Array, params: THREE.PointsMaterialParameters) {
  const kit = gpuKit()
  if (kit) return kit.createPointSprites(positions, params)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial(params)
  return {
    object: new THREE.Points(geometry, material) as THREE.Object3D,
    material,
    markDirty: () => {
      geometry.attributes.position!.needsUpdate = true
    },
  }
}

/** Glowing fireflies that wander near the ground at night */
function createFireflies(count: number, ctx: LandContext, radius: number, rand: () => number) {
  const positions = new Float32Array(count * 3)
  const base = Array.from({ length: count }, () => {
    const [x, z] = outdoorSpot(rand, ctx.style, radius, 0.8)
    return { x, z, y: ctx.groundY + 0.3 + rand() * 1.2, phase: rand() * 10 }
  })
  const { object: points, material, markDirty } = sizedPoints(positions, { color: '#d9ff7a', size: 0.12, map: softDotTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })
  function update(time: number, lamps: number) {
    material.opacity = lamps * (0.6 + Math.sin(time * 2) * 0.2)
    base.forEach((b, i) => {
      positions[i * 3] = b.x + Math.sin(time * 0.5 + b.phase) * 0.4
      positions[i * 3 + 1] = b.y + Math.sin(time * 0.8 + b.phase * 2) * 0.25
      positions[i * 3 + 2] = b.z + Math.cos(time * 0.4 + b.phase) * 0.4
    })
    markDirty()
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
  const { object: points, material, markDirty } = sizedPoints(positions, { color: '#ffffff', size: 0.09, map: softDotTexture(), transparent: true, depthWrite: false, opacity: 0.9 })
  function update(time: number, dt: number, daylight: number) {
    material.color.setScalar(0.6 + 0.4 * daylight)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1]! -= speeds[i]! * dt
      positions[i * 3]! += Math.sin(time + phases[i]!) * 0.15 * dt
      if (positions[i * 3 + 1]! < ctx.groundY) positions[i * 3 + 1] = top
    }
    markDirty()
  }
  return { points, update }
}

/** Pink petals drifting down from the cherry trees */
/**
 * A cherry petal: narrow at the base, round, with the small notch at its tip
 * that cherry petals have. `length` is base to tip.
 */
function cherryPetalGeometry(length: number) {
  const w = length * 0.42
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(-w * 0.55, length * 0.08, -w * 1.05, length * 0.45, -w * 0.8, length * 0.82)
  shape.quadraticCurveTo(-w * 0.55, length * 1.02, -w * 0.18, length * 0.98)
  // The notch
  shape.lineTo(0, length * 0.86)
  shape.lineTo(w * 0.18, length * 0.98)
  shape.quadraticCurveTo(w * 0.55, length * 1.02, w * 0.8, length * 0.82)
  shape.bezierCurveTo(w * 1.05, length * 0.45, w * 0.55, length * 0.08, 0, 0)
  const geometry = new THREE.ShapeGeometry(shape, 3)
  // Cupped a little, like a real petal, and centred so it spins about its middle
  const pos = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / w
    pos.setZ(i, x * x * length * 0.12)
  }
  geometry.translate(0, -length * 0.5, 0)
  geometry.computeVertexNormals()
  return geometry
}

function createPetals(count: number, ctx: LandContext, sources: THREE.Vector3[], rand: () => number, options: { colors?: string[]; size?: number } = {}) {
  const size = options.size ?? 1
  const geometry = cherryPetalGeometry(0.075 * size)
  const material = new THREE.MeshStandardMaterial({ color: options.colors ? '#ffffff' : '#ffc0d9', side: THREE.DoubleSide, roughness: 0.7 })
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  if (options.colors) {
    const palette = options.colors.map(c => new THREE.Color(c))
    for (let i = 0; i < count; i++) mesh.setColorAt(i, palette[Math.floor(rand() * palette.length)]!)
  }
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
  // Where the petals can be: round their sources (plus the breeze's drift),
  // down to the ground. A fixed bound, so the renderer can skip them when it's
  // off screen (the instances' own bound would go stale as they fall)
  const bounds = new THREE.Box3()
  for (const s of sources) bounds.expandByPoint(s)
  // With gusts (windField) they're carried a long way downwind
  const windy = windField.gust.value > 0
  bounds.expandByScalar(windy ? 9 : 3)
  bounds.min.y = ctx.groundY
  mesh.boundingBox = bounds
  mesh.boundingSphere = bounds.getBoundingSphere(new THREE.Sphere())
  // And they're only moved while they're drawn: off screen they wait in the air
  let drawn = true
  mesh.onBeforeRender = () => {
    drawn = true
  }
  function update(time: number, dt: number) {
    if (!drawn || dt <= 0) return
    drawn = false
    petals.forEach((p, i) => {
      // Carried along the wind, faster (and held up a little) as a gust passes
      const gust = windy ? gustAt(p.pos.x, p.pos.z, time) : 0
      const push = windy ? 0.25 + gust * 1.8 : 0
      p.pos.y -= p.speed * dt * (1 - gust * 0.5)
      p.pos.x += Math.sin(time * 1.3 + p.phase) * 0.3 * dt + 0.08 * dt + windField.dir.x * push * dt
      p.pos.z += Math.cos(time * 1.1 + p.phase) * 0.2 * dt + windField.dir.y * push * dt
      // Back to the crown once on the ground, or if it ever strays out of bounds
      if (p.pos.y < ctx.groundY + 0.02 || !bounds.containsPoint(p.pos)) {
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

/**
 * Wind made visible, the way games draw it: a thin glowing line is drawn
 * along a curve (its head runs ahead, a tapering tail follows and catches
 * up), often curling into a little loop at the end, then it's gone. Each
 * line always faces the camera, and starts on a gust band (windField) as it
 * crosses the grass, so the grass bows as a line sweeps over it. Never over
 * the room. Not on WebGPU (it's a GLSL shader; that renderer is experimental).
 */
function createWindStreaks(count: number, ctx: LandContext, radius: number, rand: () => number) {
  const group = new THREE.Group()
  if (gpuKit()) return { group, update: () => {} }
  const points = 72
  // Slow and few: a line now and then, not a show
  const life = 3.2
  const trail = 0.38
  const { k, speed, dir } = windField
  const side = new THREE.Vector2(-dir.y, dir.x)
  const roomReach = Math.hypot(ctx.style.width, ctx.style.depth) / 2 + 0.5
  const material = new THREE.ShaderMaterial({
    uniforms: { uHead: { value: 0 }, uTrail: { value: trail }, uWidth: { value: 0.05 }, uOpacity: { value: 0 }, uColor: { value: new THREE.Color('#ffffff') } },
    vertexShader: /* glsl */ `
      attribute float along;
      attribute float edge;
      attribute vec3 tangent;
      uniform float uHead;
      uniform float uTrail;
      uniform float uWidth;
      varying float vAlpha;
      varying float vEdge;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vec3 t = normalize(mat3(modelMatrix) * tangent);
        // Always side-on to the camera, so it reads as a line from anywhere
        vec3 across = normalize(cross(t, cameraPosition - world.xyz));
        float tail = uHead - uTrail;
        float inside = step(tail, along) * step(along, uHead);
        float k = clamp((along - tail) / uTrail, 0.0, 1.0);
        world.xyz += across * edge * uWidth * (0.2 + 0.8 * k) * inside;
        vAlpha = inside * pow(k, 1.4) * smoothstep(uHead, uHead - 0.02, along);
        vEdge = edge;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform vec3 uColor;
      varying float vAlpha;
      varying float vEdge;
      void main() {
        // Bright core, soft edges
        float a = vAlpha * uOpacity * (1.0 - vEdge * vEdge);
        gl_FragColor = vec4(uColor * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })

  const index: number[] = []
  for (let i = 0; i < points - 1; i++) {
    const a = i * 2
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  const edges = new Float32Array(points * 2).map((_, i) => (i % 2 ? 1 : -1))

  const streaks = Array.from({ length: count }, () => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points * 2 * 3), 3))
    geometry.setAttribute('tangent', new THREE.BufferAttribute(new Float32Array(points * 2 * 3), 3))
    geometry.setAttribute('along', new THREE.BufferAttribute(new Float32Array(points * 2), 1))
    geometry.setAttribute('edge', new THREE.BufferAttribute(edges, 1))
    geometry.setIndex(index)
    const mesh = new THREE.Mesh(geometry, material.clone())
    mesh.frustumCulled = false
    mesh.visible = false
    group.add(mesh)
    return { mesh, uniforms: (mesh.material as THREE.ShaderMaterial).uniforms, age: -rand() * 5, length: 4 }
  })

  const p = new THREE.Vector3()
  const prev = new THREE.Vector3()
  const up = new THREE.Vector3(0, 1, 0)
  const wind = new THREE.Vector3(dir.x, 0, dir.y)
  const sideways = new THREE.Vector3(side.x, 0, side.y)

  /** A new curve: a gentle S along the wind, rising a little, often ending in a loop */
  function shape(st: (typeof streaks)[number], start: THREE.Vector3) {
    const geometry = st.mesh.geometry
    const pos = geometry.attributes.position as THREE.BufferAttribute
    const tan = geometry.attributes.tangent as THREE.BufferAttribute
    const alongAttr = geometry.attributes.along as THREE.BufferAttribute
    const length = 2.4 + rand() * 1.8
    const sway = (rand() - 0.5) * 0.9
    const rise = 0.2 + rand() * 0.5
    const loop = rand() < 0.6
    const loopRadius = 0.22 + rand() * 0.22
    const straight = loop ? 0.72 : 1
    const path: THREE.Vector3[] = []
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1)
      if (t <= straight) {
        const f = t / straight
        path.push(start.clone()
          .addScaledVector(wind, f * length)
          .addScaledVector(sideways, Math.sin(f * Math.PI * 1.3) * sway)
          .addScaledVector(up, Math.sin(f * Math.PI * 0.5) * rise))
      }
      else {
        // The curl: one loop, up and over, in the wind's vertical plane
        const end = path[path.length - 1]!
        const a = ((t - straight) / (1 - straight)) * Math.PI * 2
        path.push(end.clone()
          .addScaledVector(wind, Math.sin(a) * loopRadius + a * 0.04)
          .addScaledVector(up, (1 - Math.cos(a)) * loopRadius))
      }
    }
    // Parameter by distance along the curve, so the head moves evenly
    let total = 0
    const dist = [0]
    for (let i = 1; i < points; i++) {
      total += path[i]!.distanceTo(path[i - 1]!)
      dist.push(total)
    }
    for (let i = 0; i < points; i++) {
      p.copy(path[i]!)
      prev.copy(path[Math.min(i + 1, points - 1)]!).sub(path[Math.max(i - 1, 0)]!).normalize()
      for (let e = 0; e < 2; e++) {
        pos.setXYZ(i * 2 + e, p.x, p.y, p.z)
        tan.setXYZ(i * 2 + e, prev.x, prev.y, prev.z)
        alongAttr.setX(i * 2 + e, dist[i]! / total)
      }
    }
    pos.needsUpdate = true
    tan.needsUpdate = true
    alongAttr.needsUpdate = true
    st.length = total
  }

  /** Where a gust band now crosses the land over the grass (null if none) */
  function startOnGust(time: number) {
    const spacing = (Math.PI * 2) / k
    // Crest positions along the wind: (time * speed + π/2 + 2πn) / k
    const first = (time * speed + Math.PI / 2) / k
    const n = Math.floor((-radius - first) / spacing) + 1
    const crest = first + n * spacing
    if (crest > radius * 0.6) return null
    const lateral = (rand() < 0.5 ? -1 : 1) * (roomReach + rand() * (radius * 0.75 - roomReach))
    const x = dir.x * crest + side.x * lateral
    const z = dir.y * crest + side.y * lateral
    // The whole curve (up to ~4.5 m downwind) stays over the land
    if (Math.hypot(x, z) > radius - 1 || Math.hypot(x + dir.x * 4.5, z + dir.y * 4.5) > radius - 0.3) return null
    return new THREE.Vector3(x, ctx.groundY + 0.3 + rand() * 1.3, z)
  }

  let last = 0
  function update(time: number, daylight: number) {
    const dt = Math.min(Math.max(time - last, 0), 0.1)
    last = time
    for (const st of streaks) {
      st.age += dt
      if (st.age < 0) continue
      if (!st.mesh.visible) {
        const start = startOnGust(time)
        if (!start) continue
        shape(st, start)
        st.mesh.visible = true
        st.age = 0
      }
      const t = st.age / life
      // Head eases out along the curve; the tail catches up and it's gone
      const head = (1 - Math.pow(1 - Math.min(t, 1), 2)) * (1 + trail)
      st.uniforms.uHead!.value = head
      st.uniforms.uOpacity!.value = (0.45 + 0.2 * (1 - daylight)) * windField.gust.value
      if (t >= 1) {
        st.mesh.visible = false
        st.age = -(2 + rand() * 4)
      }
    }
  }
  return { group, update }
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

/**
 * A lawn of long, soft grass blades (like the crimson land's: one even field,
 * not scattered little clumps, which read as noise), flower patches standing
 * out of it, bushes; returns flower tops for butterflies
 */
function plantMeadow(group: THREE.Group, ctx: LandContext, radius: number, terrain: Terrain, rand: () => number, lawn: [string, string, string], avoid?: (x: number, z: number) => boolean) {
  group.add(bladeGrass(ctx, radius, terrain, rand, Math.round(15000 * (ctx.detail ?? 1)), {
    colors: lawn,
    tints: ['#ffffff', '#f2ffe0', '#dff5c8', '#fff6d8'],
    height: [0.3, 0.68],
    pathClear: 0.95,
    avoid,
  }))

  // Flower patches: each patch is one kind, like wildflowers grow
  const patchCenters = Array.from({ length: 8 }, () => outdoorSpot(rand, ctx.style, radius, 0.8))
  const flowers: ScatterItem[] = []
  patchCenters.forEach((center, i) => {
    const name = ['Flower_3_Group', 'Flower_4_Group', 'Flower_3_Single', 'Flower_4_Single'][i % 4]!
    // Taller than the lawn, so they stand out of it
    const items = clumps(rand, terrain, [center], 7, 0.75, name.includes('Group') ? [0.6, 0.78] : [0.55, 0.72], avoid)
    scatterModel(group, name, items, { castShadow: false })
    flowers.push(...items)
  })
  for (const [name, list] of byVariant(['Bush_Common_Flowers'], clumps(rand, terrain, Array.from({ length: 5 }, () => outdoorSpot(rand, ctx.style, radius, 1)), 1, 0.2, [0.55, 0.85], avoid), rand)) scatterModel(group, name, list)
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
  // TSL version on WebGPU (./gpu.ts)
  const kit = gpuKit()
  if (kit) return kit.createWater(radius)
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
  const flowerTops = plantMeadow(group, ctx, radius, terrain, rand, ['#2d5a1c', '#4f9a34', '#a6dc6a'])
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
    heightAt: terrain.heightAt,
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

  const flowerTops = plantMeadow(group, ctx, radius, terrain, rand, ['#2f5a1e', '#5f9e3a', '#b9e27c'], inPond)
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
    // Its pale greens and pinks burn out under the full midday sun, most of
    // all seen from above (the ground and crowns face it)
    light: { sun: 0.9, sky: 0.45 },
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
    heightAt: terrain.heightAt,
    setAttractor: butterflies.setAttractor,
    setRoomFlowers: butterflies.setRoomFlowers,
  }
}

// ---------- Crimson sakura ----------

/** White blossom clusters on a transparent card (coloured per instance) */
let blossomCanvas: THREE.CanvasTexture | null = null
function blossomTexture() {
  if (blossomCanvas) return blossomCanvas
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const g = canvas.getContext('2d')!
  const rand = seeded(91)
  // Round flower heads of five petals, packed towards the middle
  for (let i = 0; i < 46; i++) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * size * 0.4
    const x = size / 2 + Math.cos(a) * r
    const y = size / 2 + Math.sin(a) * r
    const petal = 7 + rand() * 7
    const turn = rand() * Math.PI
    for (let k = 0; k < 5; k++) {
      const pa = turn + (k / 5) * Math.PI * 2
      const shade = g.createRadialGradient(x, y, 0, x, y, petal * 1.8)
      shade.addColorStop(0, '#ffffff')
      shade.addColorStop(1, `rgb(${215 + rand() * 30},${215 + rand() * 30},${225 + rand() * 30})`)
      g.fillStyle = shade
      g.beginPath()
      g.ellipse(x + Math.cos(pa) * petal * 0.75, y + Math.sin(pa) * petal * 0.75, petal * 0.75, petal * 0.5, pa, 0, Math.PI * 2)
      g.fill()
    }
  }
  blossomCanvas = new THREE.CanvasTexture(canvas)
  blossomCanvas.colorSpace = THREE.SRGBColorSpace
  return blossomCanvas
}

/** Smooth 3D value noise, 0..1 (bark bumps) */
function noise3(x: number, y: number, z: number) {
  const h = (i: number, j: number, k: number) => {
    const n = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453
    return n - Math.floor(n)
  }
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const u = x - xi, v = y - yi, w = z - zi
  const su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v), sw = w * w * (3 - 2 * w)
  const lerp = THREE.MathUtils.lerp
  const x0 = lerp(lerp(h(xi, yi, zi), h(xi + 1, yi, zi), su), lerp(h(xi, yi + 1, zi), h(xi + 1, yi + 1, zi), su), sv)
  const x1 = lerp(lerp(h(xi, yi, zi + 1), h(xi + 1, yi, zi + 1), su), lerp(h(xi, yi + 1, zi + 1), h(xi + 1, yi + 1, zi + 1), su), sv)
  return lerp(x0, x1, sw)
}

/** Bark for the old cherry's trunk, repeated round it (its own copy: the shared one isn't repeated) */
let trunkBarkTexture: THREE.Texture | null = null

/**
 * The old cherry's trunk, sculpted from a dense cylinder: a cone that flares
 * hard at the ground (further on one side, a mound down the slope), big
 * lumps and a hollow, bark fissures twisting up it; coloured black in the
 * fissures and silver-grey on the ridges. Returns the mesh's geometry and the
 * centre and radius of its top, where the limbs start.
 */
function crimsonTrunk(rand: () => number, height: number, lean: THREE.Vector3, slopeAngle: number) {
  const h = height * 0.42
  const rBase = height * 0.26
  const rTop = height * 0.08
  const radial = 40
  const rows = 22
  const geometry = new THREE.CylinderGeometry(1, 1, 1, radial, rows, true)
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const crevice = new THREE.Color('#141012')
  const ridge = new THREE.Color('#aaa0a6')
  const c = new THREE.Color()
  const seed = rand() * 100
  // A few big burls, low on the trunk
  const burls = Array.from({ length: 7 }, () => ({ angle: rand() * Math.PI * 2, t: 0.15 + rand() * 0.6, size: 0.18 + rand() * 0.22 }))
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i) + 0.5
    const angle = Math.atan2(pos.getZ(i), pos.getX(i))
    // Cone, flaring hard at the ground, more so down the slope
    const flare = Math.pow(1 - t, 3.2)
    const downhill = Math.pow(Math.max(0, Math.cos(angle - slopeAngle)), 2)
    let r = rTop + (rBase - rTop) * flare + rBase * 0.7 * Math.pow(1 - t, 4) * downhill
    // Big lumps and burls, a hollow on one side
    const ca = Math.cos(angle), sa = Math.sin(angle)
    const lumps = (noise3(ca * 1.3 + seed, t * 2.6, sa * 1.3) - 0.5) * 0.75 + (noise3(ca * 3.5, t * 7 + seed, sa * 3.5) - 0.5) * 0.35
    const hollow = Math.exp(-((angle - slopeAngle - 2.2) ** 2) * 6 - ((t - 0.45) ** 2) * 40) * 0.28
    // Bark fissures twisting up the trunk
    const fissure = Math.pow(Math.abs(Math.sin(angle * 11 + t * 5 + noise3(ca * 2, t * 4, sa * 2) * 3)), 0.35)
    let burl = 0
    for (const b of burls) {
      const da = Math.atan2(Math.sin(angle - b.angle), Math.cos(angle - b.angle))
      burl += b.size * Math.exp(-(da * da) * 9 - ((t - b.t) ** 2) * 60)
    }
    r *= 1 + lumps + burl - hollow - (1 - fissure) * 0.1
    // Leans a little, and the top drifts with it
    const x = ca * r + lean.x * h * Math.pow(t, 1.6) * 0.35
    const z = sa * r + lean.z * h * Math.pow(t, 1.6) * 0.35
    pos.setXYZ(i, x, t * h - h * 0.08, z)
    // Mostly black; only thin ridges between the fissures and the tops of lumps catch the light
    const ridgeLine = Math.pow(Math.abs(Math.sin(angle * 11 + t * 5 + noise3(ca * 2, t * 4, sa * 2) * 3)), 8)
    c.copy(crevice).lerp(ridge, THREE.MathUtils.clamp(ridgeLine * 0.7 + Math.max(lumps + burl, 0) * 0.45 + (noise3(ca * 6, t * 12, sa * 6) - 0.5) * 0.2, 0, 1))
    colors.set([c.r, c.g, c.b], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  const top = new THREE.Vector3(lean.x * h * 0.35, h * 0.9, lean.z * h * 0.35)
  return { geometry, top, topRadius: rTop }
}

/**
 * A giant old cherry with a crimson crown, grown from code, after a
 * reference shot: a short, very thick trunk with buttress roots and knotted
 * bark forks low into five limbs that spread almost level, twist and fork
 * again, their tips drooping; the crown is a wide, flat umbrella of blossom
 * clumps (sky between them), bright pink-red on top, crimson in the middle
 * and dark red underneath. The crown reaches towards the middle of the land
 * (place.toward), over the room's back half but high, so the room stays in
 * view (place.blocked).
 * Returns the tree and the blossom points (petals fall from them).
 */
function crimsonTree(rand: () => number, height: number, detail: number, place: { origin: THREE.Vector3; toward: THREE.Vector3; blocked: (x: number, y: number, z: number) => boolean }) {
  const up = new THREE.Vector3(0, 1, 0)
  const over = (p: THREE.Vector3) => place.blocked(place.origin.x + p.x, place.origin.y + p.y, place.origin.z + p.z)
  const limbs: THREE.BufferGeometry[] = []
  const blossoms: { position: THREE.Vector3; size: number }[] = []
  const maxDepth = detail < 0.7 ? 4 : 5

  function segment(from: THREE.Vector3, dir: THREE.Vector3, length: number, rTop: number, rBottom: number, sides = 9, rows = 3) {
    // A little longer than the piece, so bends don't show gaps
    const geometry = new THREE.CylinderGeometry(rTop, rBottom, length * 1.08, sides, rows)
    geometry.translate(0, length / 2, 0)
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(up, dir))
    geometry.translate(from.x, from.y, from.z)
    limbs.push(geometry)
  }

  function grow(start: THREE.Vector3, direction: THREE.Vector3, length: number, radius: number, depth: number) {
    const pieces = depth <= 1 ? 4 : 3
    const end = radius * (depth === 0 ? 0.5 : 0.58)
    const p = start.clone()
    const d = direction.clone()
    for (let i = 0; i < pieces; i++) {
      // Every piece turns (twisting limbs); the outer ones droop a little
      // Snaking: limbs swing up and down along their length, the outer ones droop
      const wave = depth <= 2 ? Math.sin(i * 1.7 + rand() * 2) * 0.3 : 0
      d.add(new THREE.Vector3((rand() - 0.5) * 0.5, (rand() - 0.5) * 0.18 + wave - (depth >= 3 ? 0.1 : 0), (rand() - 0.5) * 0.5)).normalize()
      if (d.y < -0.35) d.setY(-0.35).normalize()
      const r0 = radius + (end - radius) * (i / pieces)
      const r1 = radius + (end - radius) * ((i + 1) / pieces)
      // Twigs don't grow into the space kept clear over the room, where they
      // couldn't carry blossoms and would hang there bare
      if (depth >= 2 && over(p.clone().addScaledVector(d, length / pieces))) return
      // Thick limbs keep their roundness and rows (for the bark bumps); twigs,
      // most of the pieces, are thin enough for 5 sides and one row
      segment(p, d, length / pieces, r1, r0, depth <= 1 ? 10 : depth === 2 ? 6 : 5, depth <= 1 ? 3 : 1)
      p.addScaledVector(d, length / pieces)
      if (depth >= 2 && !over(p)) blossoms.push({ position: p.clone(), size: 0.8 + rand() * 0.5 + (depth - 2) * 0.15 })
    }
    if (depth >= maxDepth || (depth >= 2 && over(p))) {
      if (!over(p)) blossoms.push({ position: p.clone(), size: 1.1 + rand() * 0.5 })
      return
    }
    // The trunk forks low into five near-level limbs; limbs fork in two or three
    const children = depth === 0 ? 5 : depth === 1 ? 3 : rand() < 0.5 ? 2 : 3
    const side = new THREE.Vector3().crossVectors(d, Math.abs(d.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : up).normalize()
    const side2 = new THREE.Vector3().crossVectors(d, side).normalize()
    const turn = rand() * Math.PI * 2
    for (let c = 0; c < children; c++) {
      const around = turn + (c / children) * Math.PI * 2 + (rand() - 0.5) * 0.5
      const spread = depth === 0 ? 1.15 + rand() * 0.2 : depth === 1 ? 0.45 + rand() * 0.3 : 0.4 + rand() * 0.45
      const child = d.clone().multiplyScalar(Math.cos(spread))
        .addScaledVector(side, Math.cos(around) * Math.sin(spread))
        .addScaledVector(side2, Math.sin(around) * Math.sin(spread))
      // Keep the crown flat: limbs rise a little at first, then run level
      child.y += depth === 0 ? 0.22 : depth === 1 ? 0 : -0.04
      if (depth <= 2) child.addScaledVector(place.toward, depth === 0 ? 0.35 : 0.25)
      child.normalize()
      const factor = depth === 0 ? 1.05 : 0.7
      grow(p, child, length * factor * (0.85 + rand() * 0.3), end, depth + 1)
    }
  }

  // The trunk: one sculpted mass (crimsonTrunk), then limbs from its top
  // Leans towards the middle; the root mound spreads the other way, down the slope
  const lean = place.toward.clone().multiplyScalar(0.5)
  const trunk = crimsonTrunk(rand, height, lean, Math.atan2(-place.toward.z, -place.toward.x))
  // Two or three short, thick knobs reaching up, crowned with blossoms
  for (let i = 0; i < 3; i++) {
    const a = rand() * Math.PI * 2
    const dir = new THREE.Vector3(Math.cos(a) * 0.45, 1, Math.sin(a) * 0.45).normalize()
    const from = trunk.top.clone().add(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)).multiplyScalar(trunk.topRadius * 0.5))
    grow(from, dir, height * (0.04 + rand() * 0.03), trunk.topRadius * 0.5, maxDepth - 1)
  }
  // Long limbs, much thinner than the trunk, snaking out almost level
  const limbCount = 6
  const turn = rand() * Math.PI * 2
  for (let i = 0; i < limbCount; i++) {
    const a = turn + (i / limbCount) * Math.PI * 2 + (rand() - 0.5) * 0.5
    const out = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
    const dir = out.clone().setY(0.12 + rand() * 0.15).addScaledVector(place.toward, 0.5).normalize()
    const from = trunk.top.clone().addScaledVector(out, trunk.topRadius * 0.55).add(new THREE.Vector3(0, -rand() * height * 0.05, 0))
    grow(from, dir, height * (0.36 + rand() * 0.12), trunk.topRadius * (0.3 + rand() * 0.1), 1)
  }

  // The crown sits above the fork, so the knobs and limbs show under it
  const crownBase = trunk.top.y + height * 0.04
  // Twigs lower down get small tufts rather than staying bare; only those
  // close to the trunk lose theirs, so the fork stays in view
  for (let i = blossoms.length - 1; i >= 0; i--) {
    const b = blossoms[i]!
    if (b.position.y >= crownBase) continue
    if (Math.hypot(b.position.x - trunk.top.x, b.position.z - trunk.top.z) < trunk.topRadius * 3) blossoms.splice(i, 1)
    else b.size *= 0.6
  }
  // A flat umbrella, not a tall dome: squash anything above a set thickness
  const flatTop = crownBase + height * 0.2
  // The top rolls a little (clumps rise and dip), so it isn't a flat slab
  const roll = (x: number, z: number) => (noise3(x * 0.55, 0, z * 0.55) - 0.5) * height * 0.14
  for (const b of blossoms) {
    const top = flatTop + roll(b.position.x, b.position.z)
    if (b.position.y > top) b.position.y = top + (b.position.y - top) * 0.3
  }
  // Fill the dome: the limbs reach outwards, which leaves a hole over the trunk
  const centre = blossoms.reduce((sum, b) => sum.add(b.position), new THREE.Vector3()).divideScalar(Math.max(blossoms.length, 1))
  const crownTop = Math.max(...blossoms.map(b => b.position.y))
  const reach = Math.max(...blossoms.map(b => Math.hypot(b.position.x - centre.x, b.position.z - centre.z)))
  const fill = Math.round(blossoms.length * 0.3)
  for (let i = 0; i < fill; i++) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * reach * 0.8
    // Higher in the middle, a dome
    const dome = 1 - (r / (reach * 0.8)) ** 2 * 0.5
    const position = new THREE.Vector3(centre.x + Math.cos(a) * r, crownTop - height * 0.06 * (1 - dome) - rand() * height * 0.08, centre.z + Math.sin(a) * r)
    if (!over(position)) blossoms.push({ position, size: 1 + rand() * 0.5 })
  }
  // A second, lower tier: a ring under the outer crown, clear of the trunk
  for (let i = 0; i < Math.round(blossoms.length * 0.22); i++) {
    const a = rand() * Math.PI * 2
    const r = reach * (0.45 + rand() * 0.5)
    // Its rim droops, and it rolls like the top
    const droop = ((r / reach) ** 2) * height * 0.06
    const position = new THREE.Vector3(centre.x + Math.cos(a) * r, 0, centre.z + Math.sin(a) * r)
    position.y = crownBase - height * (0.07 + rand() * 0.07) - droop + roll(position.x, position.z) * 0.7
    if (Math.hypot(position.x - trunk.top.x, position.z - trunk.top.z) < trunk.topRadius * 3) continue
    if (!over(position)) blossoms.push({ position, size: 0.75 + rand() * 0.35 })
  }
  // A third, sparse tier on top: a few small peaks rising out of the crown,
  // their feet sunk in it so they grow from it
  const peaks = detail < 0.7 ? 7 : 11
  for (let i = 0; i < peaks; i++) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * reach * 0.75
    const x = centre.x + Math.cos(a) * r
    const z = centre.z + Math.sin(a) * r
    // Feet at the crown's real top (clumps sit a little above the squash line)
    const foot = crownTop + roll(x, z) * 0.5 - height * 0.04
    // A solid, rounded mound of clumps (a dome), its wide foot merging into the crown
    const rise = height * (0.08 + rand() * 0.06)
    const width = height * (0.12 + rand() * 0.05)
    for (let j = 0; j < 18; j++) {
      const ang = rand() * Math.PI * 2
      const rr = Math.sqrt(rand()) * width
      const cap = Math.sqrt(Math.max(0, 1 - (rr / width) ** 2))
      const position = new THREE.Vector3(x + Math.cos(ang) * rr, foot + cap * rise * (0.55 + rand() * 0.45), z + Math.sin(ang) * rr)
      if (!over(position)) blossoms.push({ position, size: 1 + rand() * 0.3 })
    }
  }
  // And right over the trunk, where the knobs reach up through the crown
  for (let i = 0; i < Math.round(fill * 0.5); i++) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * reach * 0.45
    const position = new THREE.Vector3(trunk.top.x + Math.cos(a) * r, crownTop - rand() * height * 0.1, trunk.top.z + Math.sin(a) * r)
    if (!over(position)) blossoms.push({ position, size: 1 + rand() * 0.5 })
  }

  const wood = mergeGeometries(limbs)!
  limbs.forEach(g => g.dispose())
  // Knotted limbs: small bumps along their surface; squashed like the crown,
  // so no twigs stick out of its top
  const pos = wood.attributes.position as THREE.BufferAttribute
  const nor = wood.attributes.normal as THREE.BufferAttribute
  const k = 12.8 / height
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i)
    let y = pos.getY(i)
    const woodTop = flatTop + roll(x, z) - height * 0.02
    if (y > woodTop) y = woodTop + (y - woodTop) * 0.3
    const amount = height * 0.004 * (noise3(x * k, y * k, z * k) - 0.5) * 2
    pos.setXYZ(i, x + nor.getX(i) * amount, y + nor.getY(i) * amount, z + nor.getZ(i) * amount)
  }
  wood.computeVertexNormals()

  const tree = new THREE.Group()
  const barkMap = natureTexture('Bark_TwistedTree.jpg')
  const bark = new THREE.MeshStandardMaterial({ map: barkMap, color: '#2e262b', roughness: 1, envMapIntensity: 0.15 })
  const branches = new THREE.Mesh(wood, bark)
  branches.castShadow = true
  branches.receiveShadow = true
  // The trunk carries its own colours: black fissures, silver-grey ridges
  // Fine fissures from the bark texture, repeated round the trunk; little sky
  // reflection, or the black bark turns blue-grey
  trunkBarkTexture ??= new THREE.TextureLoader().load('/models/nature/Bark_TwistedTree.jpg', (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(5, 3)
    t.needsUpdate = true
  })
  const trunkBark = trunkBarkTexture
  const trunkMesh = new THREE.Mesh(trunk.geometry, new THREE.MeshStandardMaterial({ map: trunkBark, color: '#ffffff', vertexColors: true, roughness: 1, flatShading: true, envMapIntensity: 0.15 }))
  trunkMesh.castShadow = true
  trunkMesh.receiveShadow = true
  tree.add(trunkMesh, branches)

  // Blossom clumps: several cards per spot, flattened so the crown spreads wide
  const cardPlanes = [0, 1, 2].map((i) => {
    const plane = new THREE.PlaneGeometry(1, 1)
    plane.rotateY((i * Math.PI) / 3)
    plane.rotateX((i - 1) * 0.45)
    return plane
  })
  const cardGeometry = mergeGeometries(cardPlanes)!
  cardPlanes.forEach(g => g.dispose())
  const blossomMaterial = swayingMaterial(new THREE.MeshLambertMaterial({
    map: blossomTexture(),
    alphaTest: 0.4,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#3a0410'),
    emissiveIntensity: 0.1,
  }))
  const perSpot = 4
  const crown = new THREE.InstancedMesh(cardGeometry, blossomMaterial, blossoms.length * perSpot)
  // Shaded by height in the crown: dark red underneath, crimson, pink-red on top
  const ys = blossoms.map(b => b.position.y)
  const low = Math.min(...ys)
  const high = Math.max(...ys)
  // Darker than they look: the room's bright light lifts them to crimson
  const under = new THREE.Color('#2a0309')
  const middle = new THREE.Color('#8a0a22')
  const top = new THREE.Color('#e8284e')
  const shade = new THREE.Color()
  const dummy = new THREE.Object3D()
  const unit = height * 0.1
  let n = 0
  for (const b of blossoms) {
    for (let j = 0; j < perSpot; j++) {
      dummy.position.copy(b.position).add(new THREE.Vector3((rand() - 0.5) * unit * 1.3, (rand() - 0.4) * unit * 0.45, (rand() - 0.5) * unit * 1.3))
      if (over(dummy.position)) continue
      // Gaps between the clumps, so from above the crown breaks up and the
      // limbs and grass show through (not one solid lid)
      if (noise3(dummy.position.x * 0.5 + 3, 0, dummy.position.z * 0.5 + 7) < 0.36 && rand() < 0.9) continue
      dummy.rotation.set((rand() - 0.5) * 0.5, rand() * Math.PI * 2, (rand() - 0.5) * 0.5)
      dummy.scale.set(unit * b.size * (0.8 + rand() * 0.5), unit * b.size * (0.55 + rand() * 0.3), unit * b.size * (0.8 + rand() * 0.5))
      dummy.updateMatrix()
      crown.setMatrixAt(n, dummy.matrix)
      // Mostly crimson; only the very top turns pink-red
      const t = Math.pow(THREE.MathUtils.clamp((dummy.position.y - low) / Math.max(high - low, 0.01) + (rand() - 0.5) * 0.25, 0, 1), 1.8)
      if (t < 0.5) shade.copy(under).lerp(middle, t / 0.5)
      else shade.copy(middle).lerp(top, (t - 0.5) / 0.5)
      crown.setColorAt(n, shade)
      n++
    }
  }
  crown.count = n
  // No crown shadow: it would leave the trunk in the dark (the reference shot
  // lights it), and a thousand clumps cost a lot in the shadow pass
  crown.castShadow = false
  tree.add(crown)
  return { tree, blossoms: blossoms.map(b => b.position) }
}

/** A field of grass blades (thousands, instanced), dark at the root and bright at the tip */
function bladeGrass(ctx: LandContext, radius: number, terrain: Terrain, rand: () => number, count: number, look: {
  /** Root, middle and tip colours of a blade */
  colors: [string, string, string]
  /** Per-blade tints over those */
  tints: string[]
  height: [number, number]
  /** How much of the path stays clear, 0..1 */
  pathClear: number
  avoid?: (x: number, z: number) => boolean
}) {
  const blade = new THREE.BufferGeometry()
  blade.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, -0.32, 0.5, 0.04, 0.32, 0.5, 0.04, 0, 1, 0.12], 3))
  const [root, mid, tip] = look.colors.map(c => new THREE.Color(c)) as [THREE.Color, THREE.Color, THREE.Color]
  blade.setAttribute('color', new THREE.Float32BufferAttribute([...root.toArray(), ...root.toArray(), ...mid.toArray(), ...mid.toArray(), ...tip.toArray()], 3))
  blade.setIndex([0, 1, 2, 1, 3, 2, 2, 3, 4])
  blade.computeVertexNormals()
  const material = swayingMaterial(new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }))
  const mesh = new THREE.InstancedMesh(blade, material, count)
  const dummy = new THREE.Object3D()
  const tints = look.tints.map(c => new THREE.Color(c))
  // Clumped, like grass grows: a few hundred tufts with blades around each
  const centers = landSpots(rand, ctx, radius, Math.ceil(count / 22), 0.3)
  let n = 0
  for (let tries = 0; n < count && tries < count * 4; tries++) {
    const [cx, cz] = centers[tries % centers.length]!
    const a = rand() * Math.PI * 2
    const r = Math.pow(rand(), 0.7) * 0.55
    const x = cx + Math.cos(a) * r
    const z = cz + Math.sin(a) * r
    if (Math.hypot(x, z) > radius - 0.15) continue
    if (Math.abs(x) < ctx.style.width / 2 + 0.05 && Math.abs(z) < ctx.style.depth / 2 + 0.05) continue
    if (terrain.blocked(x, z) && rand() < look.pathClear) continue
    if (look.avoid?.(x, z)) continue
    const height = look.height[0] + rand() * (look.height[1] - look.height[0])
    dummy.position.set(x, terrain.heightAt(x, z) - 0.01, z)
    dummy.rotation.set((rand() - 0.5) * 0.5, rand() * Math.PI * 2, (rand() - 0.5) * 0.5)
    dummy.scale.set(0.025 + rand() * 0.022, height, 1)
    dummy.updateMatrix()
    mesh.setMatrixAt(n, dummy.matrix)
    mesh.setColorAt(n, tints[Math.floor(rand() * tints.length)]!)
    n++
  }
  mesh.count = n
  mesh.receiveShadow = true
  return mesh
}

function buildCrimson(ctx: LandContext, radius: number): LandInstance {
  const rand = seeded(53)
  const detail = ctx.detail ?? 1
  const { width, depth } = ctx.style
  const { group } = floatingGround(ctx, radius, std('#3a0812'))
  // Ground the same red as the grass roots, the path barely showing through it
  const terrain = createTerrain(ctx, radius, 29, { grass: ['#3a0812', '#4a0b18', '#560e1e', '#420915'], dry: '#30060f', path: '#5a1424' })
  group.add(terrain.mesh)

  // One giant tree behind the room's back corner, its crown spreading over the land
  const heroX = -width / 2 - 2
  const heroZ = -depth / 2 - 2
  const heroHeight = Math.max(8, ctx.style.height * 2.5)
  const origin = new THREE.Vector3(heroX, terrain.heightAt(heroX, heroZ), heroZ)
  const wallTop = ctx.groundY + ctx.style.height
  const hero = crimsonTree(rand, heroHeight, detail, {
    origin,
    toward: new THREE.Vector3(-heroX, 0, -heroZ).normalize(),
    // Over the room's back half only, and well above the walls; nothing over
    // the front half of the land, between the camera and the room
    blocked: (x, y, z) => {
      if (x + z > -0.5) return true
      const overRoom = Math.abs(x) < width / 2 + 0.6 && Math.abs(z) < depth / 2 + 0.6
      return overRoom && y < wallTop + 1.4
    },
  })
  hero.tree.position.copy(origin)
  group.add(hero.tree)
  hero.tree.updateMatrixWorld(true)
  const petalSources = hero.blossoms.map(p => p.clone().applyMatrix4(hero.tree.matrixWorld))

  const grass = bladeGrass(ctx, radius, terrain, rand, Math.round(15000 * detail), {
    colors: ['#2a040c', '#8c0f2c', '#ff4f78'],
    tints: ['#ffffff', '#ffd0da', '#e8a0b0', '#ffe4ea'],
    height: [0.3, 0.72],
    pathClear: 0.6,
  })
  group.add(grass)

  const cloudMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, emissive: '#eaf2ff', emissiveIntensity: 0.2 })
  skyClouds(group, rand, cloudMaterial)
  skyClouds(group, rand, cloudMaterial)

  const petals = createPetals(Math.round(900 * detail), ctx, petalSources, rand, { colors: ['#e8355d', '#ff5c7a', '#ff8fa3', '#c41e45', '#ffd1db'], size: 1.6 })
  const wind = createWindStreaks(detail < 0.7 ? 3 : 4, ctx, radius, rand)
  group.add(wind.group)
  const flutterSpots = landSpots(rand, ctx, radius, 12, 1).map(([x, z]) => new THREE.Vector3(x, terrain.heightAt(x, z) + 0.45, z))
  const butterflies = createButterflies(3, flutterSpots, rand, ['#ffffff', '#ffe4ec'])
  const fireflies = createFireflies(24, ctx, radius, rand)
  group.add(petals.mesh, butterflies.group, fireflies.points)

  const nightTint = new THREE.Color('#3a2a4a')
  const white = new THREE.Color('#ffffff')
  const cloudNight = new THREE.Color('#4f4870')

  return {
    group,
    starsAlways: false,
    sky: { night: new THREE.Color('#0d0a1f'), dusk: new THREE.Color('#ff9a8a'), day: new THREE.Color('#4f86d9') },
    // Clear, deep saturated blue (less haze than the other lands)
    atmosphere: { turbidity: 1.2, rayleigh: 3.4, mie: 0.004 },
    // The blue sky light turns crimson pink and strong sun washes it out
    light: { sun: 0.75, sky: 0.3 },
    focus: { position: origin.clone(), height: heroHeight },
    heightAt: terrain.heightAt,
    update(time, dt, daylight, lamps) {
      natureWind.value = time
      terrain.material.color.copy(nightTint).lerp(white, daylight)
      cloudMaterial.color.copy(cloudNight).lerp(white, daylight)
      petals.update(time, dt)
      wind.update(time, daylight)
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
  // Gusting wind is a land's own (crimson); the others just sway
  windField.gust.value = id === 'crimson' ? 1 : 0
  // No wind inside the room's walls (potted plants use the same leaves)
  windField.room.set(ctx.style.width / 2, ctx.style.depth / 2)
  switch (id) {
    case 'mars':
      return buildMars(ctx, radius)
    case 'sakura':
      return buildSakura(ctx, radius)
    case 'crimson':
      return buildCrimson(ctx, radius)
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
  // TSL version on WebGPU (./gpu.ts)
  const kit = gpuKit()
  if (kit) return kit.createStars(positions, sizes, phases)
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
