import * as THREE from 'three'
import { attachDungeonModel, loadDungeonModel } from './dungeonModels'
import { attachNaturePieces, greenLeaves, type NaturePiece } from './natureModels'
import { PREMIUM_ITEMS } from './premiumModels'
import { attachFurnitureModel } from './furnitureModels'
import type { FlowerName, FurnitureModelName } from './modelManifest'
import { attachFlowers, type FlowerStem } from './flowerModels'

// Procedural model catalog for the 3D mini room.
// Every model is assembled from primitives at runtime, so a room is fully
// described by JSON (type + transform + color). Local origin is the center of
// the object's base, facing +z. Wall-mounted models have their back on z = 0.

export type CatalogCategory = 'premium' | 'shop' | 'furniture' | 'lighting' | 'decor' | 'wall' | 'tech' | 'dungeon'

export interface CatalogLight {
  color: string
  /** Point light intensity at full night */
  intensity: number
  distance: number
  /** Light position relative to the object's origin (before scale) */
  offset: [number, number, number]
  /** Flickers like a flame (candles, torches) */
  flicker?: boolean
}

export interface CatalogItem {
  type: string
  name: string
  icon: string
  category: CatalogCategory
  defaultColor: string
  /** Mounted on a wall instead of standing on the floor */
  wallMounted?: boolean
  /** Built from a 3D model file; colour changes don't apply */
  fromModel?: boolean
  /** Has flowers: butterflies from the land come to land on it */
  attractsButterflies?: boolean
  light?: CatalogLight
  /** Area that shows an uploaded photo (local coordinates, meters); parts tagged `placeholder` hide when a photo is set */
  photo?: { width: number; height: number; center: [number, number, number] }
  /** Area that shows a product card (photo, name, price) from the site's products block */
  productCard?: { width: number; height: number; center: [number, number, number] }
  /**
   * Several product cards (e.g. a glass cabinet's shelves). They show the
   * products picked for the object, or the shop's first products. Parts tagged
   * `placeholderSlot = i` hide once card i is up.
   */
  productSlots?: { width: number; height: number; center: [number, number, number] }[]
  /** A screen that cycles slides of the shop's products; parts tagged `placeholder` hide while it does */
  productScreen?: { width: number; height: number; center: [number, number, number] }
  /** Its words can be changed in the editor (neon sign, banner), up to `max` characters */
  customText?: { default: string; max: number }
  /** Clicking it in the room opens the site's blog */
  opensBlog?: boolean
  /** Premium: comes in this pack (shared/roomPacks), bought once or with Max */
  pack?: string
  /** Clicking it in the room plays this track (from the room music library), e.g. the grand piano */
  music?: string
  build: (color: string, opts?: BuildOptions) => THREE.Group
}

export interface BuildOptions {
  /** The object's own words, for items with `customText` */
  text?: string
}

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  premium: 'Premium',
  furniture: 'Furniture',
  lighting: 'Lighting',
  decor: 'Decor',
  wall: 'Wall',
  tech: 'Tech',
  shop: 'Shop',
  dungeon: 'Dungeon',
}

// ---------- Primitive helpers ----------

function mat(color: string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, ...opts })
}

/** Material that glows when lamps are on (the scene scales emissiveIntensity) */
function glow(color: string, base = 0) {
  const m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: base, roughness: 0.4 })
  m.userData.glow = true
  m.userData.baseGlow = base
  return m
}

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Box positioned by its bottom-center */
function box(w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  return mesh(new THREE.BoxGeometry(w, h, d), material, x, y + h / 2, z)
}

function cyl(rTop: number, rBottom: number, h: number, material: THREE.Material, x = 0, y = 0, z = 0, segments = 24) {
  return mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), material, x, y + h / 2, z)
}

function sphere(r: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  return mesh(new THREE.SphereGeometry(r, 20, 14), material, x, y, z)
}

/** Furniture drawn from a model file (./furnitureModels), painted `color` where it can be */
function furnitureModel(name: FurnitureModelName, color: string) {
  const g = new THREE.Group()
  // Renderers wait on this before reading the model (thumbnails, glow materials)
  g.userData.ready = attachFurnitureModel(g, name, color)
  return g
}

function group(...children: THREE.Object3D[]) {
  const g = new THREE.Group()
  g.add(...children)
  return g
}

const WOOD = '#8b5e3c'
const DARK = '#2f2f36'
const WHITE = '#f5f5f2'
const WARM_LIGHT = '#ffd59a'

/** Catalog entry backed by a Modular Dungeon model; the model loads asynchronously */
const DUNGEON_MODEL_NAMES = new Set<string>()

/** Fetch and parse every dungeon model ahead of time so adding one is instant (cached after the first call) */
export function preloadDungeonModels() {
  for (const name of DUNGEON_MODEL_NAMES) loadDungeonModel(name).catch(() => {})
}

function dungeonItem(
  type: string,
  name: string,
  icon: string,
  model: string,
  scale: number,
  extra: Partial<CatalogItem> = {},
): CatalogItem {
  DUNGEON_MODEL_NAMES.add(model)
  return {
    type,
    name,
    icon,
    category: 'dungeon',
    defaultColor: '#ffffff',
    fromModel: true,
    ...extra,
    build: () => {
      const g = new THREE.Group()
      // Renderers wait on this before reading the model (thumbnails, glow materials)
      g.userData.ready = attachDungeonModel(g, model, scale, !!extra.wallMounted)
      return g
    },
  }
}

const TORCH_LIGHT = '#ffad5c'

const DUNGEON_ITEMS: CatalogItem[] = [
  dungeonItem('dungeon-chest', 'Chest', 'i-lucide-package', 'Chest', 0.75),
  dungeonItem('dungeon-chest-gold', 'Treasure chest', 'i-lucide-gem', 'Chest_gold', 0.75, { light: { color: '#ffb84d', intensity: 0.5, distance: 2.5, offset: [0, 1, 0] } }),
  dungeonItem('dungeon-barrel', 'Barrel', 'i-lucide-cylinder', 'Barrel', 0.75),
  dungeonItem('dungeon-candelabrum', 'Candelabrum', 'i-lucide-flame', 'Candelabrum', 0.75, { light: { color: TORCH_LIGHT, flicker: true, intensity: 2.5, distance: 4, offset: [0, 0.85, 0] } }),
  dungeonItem('dungeon-candelabrum-tall', 'Tall candelabrum', 'i-lucide-flame-kindling', 'Candelabrum_tall', 0.75, { light: { color: TORCH_LIGHT, flicker: true, intensity: 3.5, distance: 5, offset: [0, 1.4, 0] } }),
  dungeonItem('dungeon-candle', 'Candlestick', 'i-lucide-flame', 'Candle', 0.6, { light: { color: TORCH_LIGHT, flicker: true, intensity: 1.2, distance: 2.5, offset: [0, 0.5, 0] } }),
  dungeonItem('dungeon-torch', 'Standing torch', 'i-lucide-flame', 'Torch', 0.75, { light: { color: TORCH_LIGHT, flicker: true, intensity: 4, distance: 6, offset: [0, 1.55, 0] } }),
  dungeonItem('dungeon-wall-torch', 'Wall torch', 'i-lucide-flame', 'Torch_wall', 0.5, { wallMounted: true, light: { color: TORCH_LIGHT, flicker: true, intensity: 4, distance: 6, offset: [0, 0.45, 0.5] } }),
  dungeonItem('dungeon-book-open', 'Open book', 'i-lucide-book-open', 'Book_Open', 0.35),
  dungeonItem('dungeon-book', 'Book', 'i-lucide-book', 'Book2', 0.35),
  dungeonItem('dungeon-books', 'Spell book', 'i-lucide-book-marked', 'Book3', 0.35),
  dungeonItem('dungeon-potion-blue', 'Blue potion', 'i-lucide-flask-round', 'Potion', 0.3),
  dungeonItem('dungeon-potion-green', 'Green potion', 'i-lucide-flask-conical', 'Potion2', 0.3),
  dungeonItem('dungeon-potion-ice', 'Ice potion', 'i-lucide-snowflake', 'Potion3', 0.3),
  dungeonItem('dungeon-potion-vial', 'Vial', 'i-lucide-test-tube', 'Potion4', 0.35),
  dungeonItem('dungeon-potion-dark', 'Dark potion', 'i-lucide-flask-round', 'Potion5', 0.3),
  dungeonItem('dungeon-potion-gold', 'Gold potion', 'i-lucide-flask-conical', 'Potion6', 0.3),
  dungeonItem('dungeon-bones', 'Skeleton', 'i-lucide-skull', 'Bones', 0.6),
  dungeonItem('dungeon-bones-pile', 'Bones', 'i-lucide-bone', 'Bones2', 0.6),
  dungeonItem('dungeon-rock', 'Rock', 'i-lucide-mountain', 'Rock1', 0.6),
  dungeonItem('dungeon-rock-flat', 'Flat rock', 'i-lucide-mountain', 'Rock2', 0.6),
  dungeonItem('dungeon-carpet', 'Royal carpet', 'i-lucide-rectangle-vertical', 'Carpet', 0.6),
  dungeonItem('dungeon-column', 'Column', 'i-lucide-columns-3', 'Column', 0.62),
  dungeonItem('dungeon-column-broken', 'Broken column', 'i-lucide-columns-2', 'Column_Broken2', 0.62),
  dungeonItem('dungeon-column-ruin', 'Fallen column', 'i-lucide-columns-2', 'Column_Broken', 0.62),
  dungeonItem('dungeon-stairs', 'Stairs', 'i-lucide-chevrons-up', 'Stairs', 0.75),
  dungeonItem('dungeon-window', 'Barred window', 'i-lucide-grid-2x2', 'Window', 0.75, { wallMounted: true }),
  dungeonItem('dungeon-bars', 'Iron bars', 'i-lucide-grip', 'Bars', 0.75, { wallMounted: true }),
  dungeonItem('dungeon-arch', 'Stone arch', 'i-lucide-door-open', 'Entrance', 0.75, { wallMounted: true }),
]

// ---------- Catalog ----------

export const ROOM_CATALOG: CatalogItem[] = [
  {
    // A plinth with a product card on top; clicking it opens the product
    type: 'product-stand',
    name: 'Product stand',
    icon: 'i-lucide-shopping-bag',
    category: 'shop',
    defaultColor: '#f4f1ec',
    productCard: { width: 0.44, height: 0.605, center: [0, 1.135, 0.026] },
    build: (color) => {
      const g = new THREE.Group()
      g.add(box(0.5, 0.06, 0.42, mat('#2f2f36'), 0, 0))
      g.add(box(0.46, 0.7, 0.38, mat(color), 0, 0.06))
      g.add(box(0.5, 0.04, 0.42, mat('#2f2f36'), 0, 0.76))
      // Card holder: a thin board with a frame
      g.add(box(0.5, 0.66, 0.04, mat('#2f2f36'), 0, 0.8))
      const card = box(0.44, 0.6, 0.012, mat(WHITE), 0, 0.832, 0.02)
      card.userData.placeholder = true
      g.add(card)
      g.add(box(0.12, 0.02, 0.1, mat('#2f2f36'), 0, 0.78, 0.05))
      return g
    },
  },
  // Furniture
  {
    type: 'bed',
    name: 'Bed',
    icon: 'i-lucide-bed-double',
    category: 'furniture',
    defaultColor: '#6c8ebf',
    build: color => furnitureModel('bed', color),
  },
  {
    type: 'sofa',
    name: 'Sofa',
    icon: 'i-lucide-sofa',
    category: 'furniture',
    defaultColor: '#c0605a',
    build: color => furnitureModel('sofa', color),
  },
  {
    type: 'desk',
    name: 'Desk',
    icon: 'i-lucide-rectangle-horizontal',
    category: 'furniture',
    defaultColor: WOOD,
    build: color => furnitureModel('desk', color),
  },
  {
    type: 'chair',
    name: 'Chair',
    icon: 'i-lucide-armchair',
    category: 'furniture',
    defaultColor: '#3d3d46',
    build: color => furnitureModel('chair', color),
  },
  {
    type: 'coffee-table',
    name: 'Coffee table',
    icon: 'i-lucide-circle',
    category: 'furniture',
    defaultColor: '#a47148',
    build: color => furnitureModel('coffee-table', color),
  },
  {
    type: 'bookshelf',
    name: 'Bookshelf',
    icon: 'i-lucide-library',
    category: 'furniture',
    defaultColor: '#f0e6d8',
    build: color => furnitureModel('bookshelf', color),
  },
  {
    type: 'cabinet',
    name: 'Dresser',
    icon: 'i-lucide-archive',
    category: 'furniture',
    defaultColor: '#e8dccb',
    build: color => furnitureModel('cabinet', color),
  },

  // Lighting
  {
    type: 'floor-lamp',
    name: 'Floor lamp',
    icon: 'i-lucide-lamp-floor',
    category: 'lighting',
    defaultColor: '#efe3c8',
    light: { color: WARM_LIGHT, intensity: 6, distance: 6, offset: [0, 1.45, 0] },
    build: color => furnitureModel('floor-lamp', color),
  },
  {
    type: 'desk-lamp',
    name: 'Desk lamp',
    icon: 'i-lucide-lamp-desk',
    category: 'lighting',
    defaultColor: '#f4d35e',
    light: { color: WARM_LIGHT, intensity: 2.5, distance: 3, offset: [0, 0.31, 0] },
    build: color => furnitureModel('desk-lamp', color),
  },
  {
    type: 'candle',
    name: 'Candle',
    icon: 'i-lucide-flame',
    category: 'lighting',
    defaultColor: '#fbf3e4',
    light: { color: '#ffb35c', intensity: 1.2, distance: 2.2, offset: [0, 0.22, 0] },
    build: (color) => group(
      cyl(0.04, 0.04, 0.16, mat(color)),
      sphere(0.018, glow('#ffb347', 0.6), 0, 0.19, 0),
    ),
  },
  {
    type: 'wall-lamp',
    name: 'Wall lamp',
    icon: 'i-lucide-lamp-wall-up',
    category: 'lighting',
    defaultColor: '#f2e2c4',
    wallMounted: true,
    light: { color: WARM_LIGHT, intensity: 3.5, distance: 4.5, offset: [0, 0, 0.25] },
    build: (color) => group(
      box(0.1, 0.18, 0.03, mat(DARK), 0, -0.09, 0.015),
      cyl(0.008, 0.008, 0.16, mat(DARK), 0, -0.02, 0.1),
      cyl(0.08, 0.12, 0.16, glow(color), 0, -0.02, 0.2),
    ),
  },
  {
    type: 'string-lights',
    name: 'String lights',
    icon: 'i-lucide-sparkles',
    category: 'lighting',
    defaultColor: '#ffd27f',
    wallMounted: true,
    light: { color: '#ffcf7a', intensity: 2.5, distance: 4, offset: [0, -0.1, 0.3] },
    build: (color) => {
      const parts: THREE.Object3D[] = []
      const count = 13
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1)
        const x = -1 + t * 2
        const y = -0.18 * Math.sin(t * Math.PI)
        parts.push(sphere(0.03, glow(color, 0.15), x, y, 0.04))
      }
      return group(...parts)
    },
  },

  // Decor
  {
    type: 'plant',
    name: 'Plant',
    icon: 'i-lucide-sprout',
    category: 'decor',
    defaultColor: '#4f8a4b',
    build: color => furnitureModel('plant', color),
  },
  {
    type: 'rug',
    name: 'Rug',
    icon: 'i-lucide-square',
    category: 'decor',
    defaultColor: '#d9b382',
    build: color => furnitureModel('rug', color),
  },
  {
    type: 'mug',
    name: 'Mug',
    icon: 'i-lucide-coffee',
    category: 'decor',
    defaultColor: '#e76f51',
    build: (color) => {
      const handle = mesh(new THREE.TorusGeometry(0.03, 0.008, 8, 16), mat(color), 0.05, 0.05, 0)
      return group(cyl(0.04, 0.035, 0.1, mat(color)), handle)
    },
  },

  // Wall
  {
    type: 'window',
    name: 'Window',
    icon: 'i-lucide-app-window',
    category: 'wall',
    defaultColor: WHITE,
    wallMounted: true,
    build: color => furnitureModel('window', color),
  },
  {
    type: 'picture-frame',
    name: 'Picture',
    icon: 'i-lucide-image',
    category: 'wall',
    defaultColor: '#264653',
    wallMounted: true,
    photo: { width: 0.5, height: 0.7, center: [0, 0, 0.031] },
    build: (color) => {
      const art = new THREE.Group()
      art.add(box(0.7, 0.9, 0.04, mat('#3a2a1e'), 0, -0.45))
      art.add(box(0.58, 0.78, 0.01, mat(WHITE), 0, -0.39, 0.025))
      // Abstract artwork, replaced by the photo once one is uploaded
      const painting = box(0.44, 0.3, 0.01, mat(color), 0, -0.25, 0.032)
      const sun = sphere(0.07, mat('#e9c46a'), 0.12, 0.18, 0.035)
      painting.userData.placeholder = true
      sun.userData.placeholder = true
      art.add(painting, sun)
      return art
    },
  },
  {
    // A notice board: clicking it in the room opens the site's blog
    type: 'blog-board',
    name: 'Blog board',
    icon: 'i-lucide-newspaper',
    category: 'wall',
    defaultColor: '#e76f51',
    wallMounted: true,
    opensBlog: true,
    build: (color) => {
      const board = new THREE.Group()
      board.add(box(1.0, 0.76, 0.04, mat('#6b4a32'), 0, -0.38))
      board.add(box(0.9, 0.66, 0.02, mat('#c9a47c', { roughness: 0.95 }), 0, -0.33, 0.025))
      // "BLOG" on a coloured header
      const header = box(0.46, 0.13, 0.012, mat(color), 0, 0.12, 0.04)
      board.add(header)
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 72
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 52px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('BLOG', 128, 38)
        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        const label = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.118), new THREE.MeshBasicMaterial({ map: texture, transparent: true }))
        label.position.set(0, 0.185, 0.047)
        board.add(label)
      }
      // Pinned notes
      const notes: [number, number, number, string][] = [
        [-0.26, -0.2, 0.08, '#fff7cc'],
        [0.02, -0.24, -0.05, '#ffffff'],
        [0.28, -0.18, 0.1, '#dff3ff'],
        [-0.12, -0.02, -0.06, '#ffe1e7'],
        [0.2, 0.0, 0.04, '#fff7cc'],
      ]
      for (const [x, y, tilt, paper] of notes) {
        const note = box(0.2, 0.17, 0.004, mat(paper), x, y - 0.085, 0.037)
        note.rotation.z = tilt
        board.add(note)
        board.add(sphere(0.013, mat(color), x, y + 0.06, 0.043))
      }
      return board
    },
  },
  {
    type: 'wall-clock',
    name: 'Clock',
    icon: 'i-lucide-clock',
    category: 'wall',
    defaultColor: '#1d3557',
    wallMounted: true,
    build: (color) => {
      const g = new THREE.Group()
      // Rim in the chosen colour, with a rounded lip
      const rim = mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.05, 48), mat(color, { roughness: 0.45 }), 0, 0, 0.025)
      rim.rotation.x = Math.PI / 2
      const lip = mesh(new THREE.TorusGeometry(0.235, 0.014, 10, 48), mat(color, { roughness: 0.4 }), 0, 0, 0.05)
      g.add(rim, lip)
      // Dial: numbers 1-12 and minute marks, drawn once (sharp at any zoom)
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 512
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#fbf8f1'
      ctx.beginPath(); ctx.arc(256, 256, 256, 0, Math.PI * 2); ctx.fill()
      ctx.translate(256, 256)
      for (let i = 0; i < 60; i++) {
        const hour = i % 5 === 0
        ctx.save()
        ctx.rotate((i / 60) * Math.PI * 2)
        ctx.fillStyle = hour ? '#1f2430' : '#8a8f99'
        ctx.fillRect(hour ? -4 : -1.5, -238, hour ? 8 : 3, hour ? 26 : 13)
        ctx.restore()
      }
      ctx.fillStyle = '#1f2430'
      ctx.font = '600 58px Georgia, "Times New Roman", serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let h = 1; h <= 12; h++) {
        const a = (h / 12) * Math.PI * 2
        ctx.fillText(String(h), Math.sin(a) * 172, -Math.cos(a) * 172 + 3)
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 4
      const dial = new THREE.Mesh(new THREE.CircleGeometry(0.215, 48), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.7 }))
      dial.position.z = 0.051
      dial.receiveShadow = true
      g.add(dial)
      // Hands that show the visitor's own time
      const handMat = mat(DARK, { roughness: 0.5 })
      const hand = (w: number, len: number, material: THREE.Material, z: number) => {
        const pivot = new THREE.Group()
        const bar = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.006), material)
        bar.position.y = len / 2 - len * 0.12
        pivot.add(bar)
        pivot.position.z = z
        return pivot
      }
      const hourHand = hand(0.016, 0.12, handMat, 0.056)
      const minuteHand = hand(0.01, 0.175, handMat, 0.062)
      const secondHand = hand(0.004, 0.19, mat('#d64545', { roughness: 0.5 }), 0.068)
      const cap = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.012, 16), mat('#d64545'), 0, 0, 0.07)
      cap.rotation.x = Math.PI / 2
      g.add(hourHand, minuteHand, secondHand, cap)
      g.traverse((o) => { if ((o as THREE.Mesh).isMesh && o !== rim && o !== lip) o.castShadow = false })
      let shown = -1
      g.userData.tick = () => {
        const now = new Date()
        const second = now.getSeconds()
        if (second === shown) return
        shown = second
        const minutes = now.getMinutes() + second / 60
        const hours = (now.getHours() % 12) + minutes / 60
        secondHand.rotation.z = -(second / 60) * Math.PI * 2
        minuteHand.rotation.z = -(minutes / 60) * Math.PI * 2
        hourHand.rotation.z = -(hours / 12) * Math.PI * 2
      }
      g.userData.tick()
      return g
    },
  },
  {
    type: 'neon-sign',
    name: 'Neon sign',
    icon: 'i-lucide-zap',
    category: 'wall',
    defaultColor: '#ff4fd8',
    wallMounted: true,
    light: { color: '#ff7be5', intensity: 1.5, distance: 3, offset: [0, 0, 0.3] },
    build: (color) => {
      const ring = mesh(new THREE.TorusGeometry(0.3, 0.025, 10, 40), glow(color, 0.8), 0, 0, 0.05)
      const bolt = box(0.05, 0.36, 0.03, glow(color, 0.8), 0, -0.18, 0.05)
      bolt.rotation.z = 0.4
      return group(box(0.8, 0.8, 0.02, mat('#1b1b24', { transparent: true, opacity: 0.35 }), 0, -0.4), ring, bolt)
    },
  },

  // Tech
  {
    type: 'tv',
    name: 'TV stand',
    icon: 'i-lucide-tv',
    category: 'tech',
    defaultColor: '#3b3b44',
    build: color => furnitureModel('tv', color),
  },
  {
    type: 'laptop',
    name: 'Laptop',
    icon: 'i-lucide-laptop',
    category: 'tech',
    defaultColor: '#b8bcc4',
    build: color => furnitureModel('laptop', color),
  },
]

ROOM_CATALOG.push(...DUNGEON_ITEMS)

// ---------- Garden collection (Decor) ----------
// Arrangements built from the land's nature models (Quaternius, CC0): flowers,
// grass, ferns, mushrooms and rocks, some in a pot or planter.

const SOIL = '#4a3426'
const GOLD = '#d4a64a'

type Profile = [number, number][]

/** Turned shape (pot, vase, bowl) from a radius/height outline, bottom to rim and back down inside */
function lathe(profile: Profile, material: THREE.Material, y = 0) {
  return mesh(new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), 40), material, 0, y)
}

/** Soil surface inside a container */
function soil(radius: number, y: number) {
  return cyl(radius, radius, 0.012, mat(SOIL, { roughness: 1 }), 0, y - 0.012)
}

/** Glazed ceramic: glossy, with a clear coat that catches the light */
const glaze = (color: string) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.12 })

/**
 * A natural-looking bouquet: stems spread by the golden angle within
 * `radius`, the outer ones leaning out more, each head turned its own way
 */
function bouquet(stems: [FlowerName, string, number][], radius: number, lean = [0.08, 0.32] as [number, number]): FlowerStem[] {
  const n = stems.length
  return stems.map(([flower, color, height], i) => {
    const r = radius * Math.sqrt((i + 0.5) / n)
    const angle = i * 2.39996
    return {
      flower,
      color,
      height,
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r,
      lean: lean[0] + (lean[1] - lean[0]) * (r / Math.max(radius, 0.001)),
      turn: i * 1.31,
    }
  })
}

// Petal colours
const PINK = '#f28aa6'
const ROSE_RED = '#c8243b'
const CORAL = '#f47a5b'
const BLUSH = '#f9c6cf'
const BUTTER = '#f6d55c'
const WHITE_PETAL = '#fbf7ef'
const LILAC = '#9a7bd1'
const PEACH = '#f6b48f'

/** Container builders: parts plus the height plants stand on */
type Container = (color: string) => [THREE.Object3D[], number]

/** Classic terracotta pot with a rolled rim, on a saucer */
const terracottaPot = (scale = 1): Container => (color) => {
  const k = scale
  const clay = mat(color, { roughness: 0.85 })
  const pot: Profile = [[0, 0.02], [0.12, 0.02], [0.13, 0.035], [0.155, 0.24], [0.18, 0.245], [0.185, 0.3], [0.17, 0.305], [0.165, 0.27], [0, 0.27]]
  const saucer: Profile = [[0, 0], [0.16, 0], [0.175, 0.03], [0.165, 0.032], [0.15, 0.012], [0, 0.012]]
  const scaled = (p: Profile): Profile => p.map(([r, h]) => [r * k, h * k])
  return [[lathe(scaled(saucer), clay), lathe(scaled(pot), clay), soil(0.165 * k, 0.272 * k)], 0.27 * k]
}

/** Rounded glazed planter with a gold band */
const ceramicPlanter = (scale = 1): Container => (color) => {
  const k = scale
  const body: Profile = [[0, 0], [0.1, 0], [0.16, 0.04], [0.195, 0.12], [0.19, 0.2], [0.165, 0.26], [0.17, 0.285], [0.155, 0.29], [0.15, 0.26], [0, 0.26]]
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.192 * k, 0.006 * k, 8, 48), mat(GOLD, { metalness: 0.7, roughness: 0.3 }))
  band.rotation.x = Math.PI / 2
  band.position.y = 0.16 * k
  return [[lathe(body.map(([r, h]) => [r * k, h * k]), glaze(color)), band, soil(0.152 * k, 0.262 * k)], 0.26 * k]
}

/** Tall slim vase with a flared lip */
const tallVase: Container = (color) => {
  const body: Profile = [[0, 0], [0.055, 0], [0.085, 0.05], [0.095, 0.13], [0.075, 0.24], [0.042, 0.32], [0.038, 0.37], [0.058, 0.41], [0.05, 0.412], [0.032, 0.375], [0, 0.375]]
  return [[lathe(body, glaze(color))], 0.37]
}

/** Small round bud vase */
const budVase: Container = (color) => {
  const body: Profile = [[0, 0], [0.04, 0], [0.07, 0.04], [0.075, 0.08], [0.05, 0.13], [0.022, 0.16], [0.03, 0.185], [0.024, 0.186], [0.016, 0.165], [0, 0.165]]
  return [[lathe(body, glaze(color))], 0.16]
}

/** Wide, low glazed bowl */
const flowerBowl: Container = (color) => {
  const body: Profile = [[0, 0], [0.12, 0], [0.13, 0.02], [0.24, 0.07], [0.29, 0.13], [0.3, 0.145], [0.285, 0.148], [0.27, 0.125], [0, 0.125]]
  return [[lathe(body, glaze(color)), soil(0.27, 0.127)], 0.125]
}

/** Wooden planter box with a top trim and little feet */
const planterBox: Container = (color) => {
  const wood = mat(color, { roughness: 0.8 })
  const trim = mat(new THREE.Color(color).multiplyScalar(0.8).getStyle(), { roughness: 0.8 })
  const parts: THREE.Object3D[] = [
    box(0.96, 0.26, 0.38, wood, 0, 0.05),
    box(1.02, 0.04, 0.44, trim, 0, 0.31),
    box(0.9, 0.012, 0.32, mat(SOIL, { roughness: 1 }), 0, 0.3),
  ]
  for (const [x, z] of [[-0.42, -0.14], [0.42, -0.14], [-0.42, 0.14], [0.42, 0.14]] as const) {
    parts.push(box(0.07, 0.06, 0.07, trim, x, 0, z))
  }
  return [parts, 0.31]
}

/** Tall cylinder planter for trees */
const cylinderPlanter: Container = (color) => {
  const body: Profile = [[0, 0], [0.24, 0], [0.25, 0.02], [0.26, 0.5], [0.24, 0.5], [0.24, 0.47], [0, 0.47]]
  return [[lathe(body, mat(color, { roughness: 0.5 })), soil(0.24, 0.472)], 0.47]
}

function natureItem(
  type: string,
  name: string,
  icon: string,
  pieces: NaturePiece[],
  container?: { defaultColor: string; build: Container },
  /** Cut flowers (./flowerModels), standing on the container's soil */
  flowers: FlowerStem[] = [],
): CatalogItem {
  return {
    type,
    name,
    icon,
    category: 'decor',
    defaultColor: container?.defaultColor ?? '#ffffff',
    // Without a container there's nothing to recolour
    fromModel: !container,
    attractsButterflies: flowers.length > 0 || pieces.some(p => p.model.includes('Flower')),
    build: (color) => {
      const g = new THREE.Group()
      let base = 0
      if (container) {
        const [parts, top] = container.build(color)
        g.add(...parts)
        base = top
      }
      g.userData.ready = Promise.all([
        attachNaturePieces(g, pieces.map(p => ({ ...p, y: (p.y ?? 0) + base }))),
        flowers.length ? attachFlowers(g, flowers.map(f => ({ ...f, y: (f.y ?? 0) + base }))) : null,
      ])
      return g
    },
  }
}

const GARDEN_ITEMS: CatalogItem[] = [
  // Flowers, always in a container
  natureItem('garden-flower-pot', 'Flower pot', 'i-lucide-flower', [
    { model: 'Grass_Common_Short', height: 0.12, x: 0.09, z: 0.06, rotation: 1.5 },
    { model: 'Grass_Common_Short', height: 0.1, x: -0.1, z: -0.04, rotation: 3.1 },
  ], { defaultColor: '#c8734f', build: terracottaPot() }, bouquet([
    ['tulip', PINK, 0.36], ['tulip', CORAL, 0.33], ['tulip', WHITE_PETAL, 0.31], ['daisy', WHITE_PETAL, 0.25],
    ['tulip', BUTTER, 0.3], ['daisy', WHITE_PETAL, 0.23], ['tulip', PINK, 0.28],
  ], 0.1)),
  natureItem('garden-ceramic-flowers', 'Ceramic planter', 'i-lucide-flower-2', [
    { model: 'Fern_1', height: 0.2, x: -0.08, z: 0.06, rotation: 2 },
  ], { defaultColor: '#2f5d62', build: ceramicPlanter() }, bouquet([
    ['daisy', WHITE_PETAL, 0.3], ['lavender', LILAC, 0.36], ['daisy', BUTTER, 0.27], ['lavender', LILAC, 0.33],
    ['daisy', WHITE_PETAL, 0.26], ['lavender', LILAC, 0.3], ['daisy', WHITE_PETAL, 0.24], ['daisy', BUTTER, 0.22],
  ], 0.11)),
  natureItem('garden-flower-vase', 'Flower vase', 'i-lucide-flower', [], { defaultColor: '#f2efe9', build: tallVase }, bouquet([
    ['rose', BLUSH, 0.42], ['tulip', PINK, 0.4], ['rose', PEACH, 0.38], ['lavender', LILAC, 0.44],
    ['tulip', WHITE_PETAL, 0.37], ['rose', BLUSH, 0.35], ['lavender', LILAC, 0.4], ['tulip', CORAL, 0.34],
  ], 0.025, [0.12, 0.42])),
  natureItem('garden-bud-vase', 'Bud vase', 'i-lucide-flower-2', [], { defaultColor: '#e9a6b3', build: budVase }, [
    { flower: 'rose', color: ROSE_RED, height: 0.27, x: 0.004, lean: 0.08, turn: 0.4 },
    { flower: 'lavender', color: LILAC, height: 0.24, x: -0.006, z: 0.004, lean: 0.22, turn: 2 },
  ]),
  natureItem('garden-flower-bowl', 'Flower bowl', 'i-lucide-flower', [
    { model: 'Clover_1', height: 0.05, x: 0.2, z: -0.12 },
    { model: 'Clover_2', height: 0.05, x: -0.2, z: 0.1, rotation: 1.2 },
  ], { defaultColor: '#efe6d6', build: flowerBowl }, bouquet([
    ['rose', BLUSH, 0.26], ['rose', PEACH, 0.25], ['rose', ROSE_RED, 0.24], ['rose', BLUSH, 0.25], ['daisy', WHITE_PETAL, 0.22],
    ['rose', PEACH, 0.24], ['rose', BLUSH, 0.23], ['daisy', WHITE_PETAL, 0.22], ['rose', ROSE_RED, 0.23], ['rose', BLUSH, 0.22],
    ['rose', PEACH, 0.22], ['daisy', WHITE_PETAL, 0.21],
  ], 0.19, [0.2, 0.75])),
  natureItem('garden-flower-bed', 'Flower bed', 'i-lucide-flower', [
    { model: 'Grass_Common_Short', height: 0.14, x: -0.38, z: 0.1 },
    { model: 'Grass_Common_Short', height: 0.13, x: 0.38, z: 0.1, rotation: 2 },
  ], { defaultColor: '#9a6a46', build: planterBox }, [
    // Lavender along the back, tulips in front
    ...[-0.36, -0.22, -0.08, 0.06, 0.2, 0.34].map((x, i) => ({ flower: 'lavender' as const, color: LILAC, height: 0.36 + (i % 2) * 0.04, x, z: -0.08, lean: 0.1, turn: i * 1.7 })),
    ...[-0.38, -0.25, -0.12, 0.01, 0.14, 0.27, 0.4].map((x, i) => ({ flower: 'tulip' as const, color: [PINK, CORAL, BUTTER, WHITE_PETAL][i % 4]!, height: 0.28 + (i % 3) * 0.03, x, z: 0.07, lean: 0.12, turn: i * 2.3 })),
  ]),
  natureItem('garden-bush-flowers', 'Flowering shrub', 'i-lucide-flower-2', [
    { model: 'Bush_Common_Flowers', height: 0.6 },
  ], { defaultColor: '#c8734f', build: terracottaPot(1.5) }),

  // Green plants
  natureItem('garden-fern-pot', 'Potted fern', 'i-lucide-leaf', [
    { model: 'Fern_1', height: 0.5 },
  ], { defaultColor: '#f2efe9', build: ceramicPlanter() }),
  natureItem('garden-indoor-tree', 'Indoor tree', 'i-lucide-tree-deciduous', [
    { model: 'CommonTree_1', height: 1.6 },
  ], { defaultColor: '#3d3d42', build: cylinderPlanter }),
  natureItem('garden-pine-pot', 'Potted pine', 'i-lucide-tree-pine', [
    { model: 'Pine_1', height: 1.2 },
  ], { defaultColor: '#c8734f', build: terracottaPot(1.4) }),

  // Ground decor
  natureItem('garden-bush', 'Bush', 'i-lucide-shrub', [
    { model: 'Bush_Common', height: 0.7, material: greenLeaves },
  ]),
  natureItem('garden-autumn-bush', 'Autumn bush', 'i-lucide-shrub', [
    { model: 'Bush_Common', height: 0.7 },
  ]),
  natureItem('garden-tall-grass', 'Tall grass', 'i-lucide-sprout', [
    { model: 'Grass_Wispy_Tall', height: 0.6 },
    { model: 'Grass_Common_Tall', height: 0.5, x: 0.14, z: 0.04, rotation: 1 },
    { model: 'Grass_Common_Tall', height: 0.44, x: -0.12, z: 0.08, rotation: 2.3 },
  ]),
  natureItem('garden-mushrooms', 'Mushrooms', 'i-lucide-sprout', [
    { model: 'Mushroom_Common', height: 0.22 },
    { model: 'Mushroom_Common', height: 0.16, x: 0.18, z: 0.07, rotation: 1.8 },
    { model: 'Mushroom_Common', height: 0.11, x: 0.07, z: 0.16, rotation: 3.4 },
    { model: 'Clover_2', height: 0.07, x: -0.14, z: 0.06 },
    { model: 'Grass_Common_Short', height: 0.14, x: 0.06, z: -0.14, rotation: 1.4 },
  ]),
  natureItem('garden-rocks', 'Garden rocks', 'i-lucide-mountain', [
    { model: 'Rock_Medium_1', height: 0.34 },
    { model: 'Rock_Medium_2', height: 0.2, x: 0.36, z: 0.12, rotation: 1 },
    { model: 'Pebble_Round_1', height: 0.06, x: -0.26, z: 0.22 },
    { model: 'Pebble_Round_3', height: 0.05, x: 0.12, z: 0.3 },
    { model: 'Grass_Common_Short', height: 0.18, x: -0.24, z: -0.12 },
    { model: 'Fern_1', height: 0.3, x: 0.26, z: -0.22, rotation: 2 },
  ]),
  natureItem('garden-pebble-tray', 'Pebble tray', 'i-lucide-circle-dot', [
    { model: 'Pebble_Round_1', height: 0.05, x: -0.2, z: 0.05 },
    { model: 'Pebble_Round_2', height: 0.045, x: -0.05, z: -0.1, rotation: 1 },
    { model: 'Pebble_Round_4', height: 0.05, x: 0.08, z: 0.1, rotation: 2 },
    { model: 'Pebble_Round_5', height: 0.04, x: 0.2, z: -0.05 },
    { model: 'Plant_1', height: 0.22, x: 0.22, z: 0.1 },
  ], {
    defaultColor: '#e8e2d6',
    build: color => [[box(0.7, 0.06, 0.45, mat(color, { roughness: 0.6 }))], 0.06],
  }),
]

ROOM_CATALOG.push(...GARDEN_ITEMS)

// Premium items, sold in packs (./premiumModels.ts)
ROOM_CATALOG.push(...PREMIUM_ITEMS)

export const CATALOG_BY_TYPE: Record<string, CatalogItem> = Object.fromEntries(
  ROOM_CATALOG.map(item => [item.type, item]),
)
