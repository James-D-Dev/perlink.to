import * as THREE from 'three'
import { attachDungeonModel, loadDungeonModel } from './dungeonModels'
import { attachNaturePieces, greenLeaves, type NaturePiece } from './natureModels'

// Procedural model catalog for the 3D mini room.
// Every model is assembled from primitives at runtime, so a room is fully
// described by JSON (type + transform + color). Local origin is the center of
// the object's base, facing +z. Wall-mounted models have their back on z = 0.

export type CatalogCategory = 'furniture' | 'lighting' | 'decor' | 'wall' | 'tech' | 'dungeon'

export interface CatalogLight {
  color: string
  /** Point light intensity at full night */
  intensity: number
  distance: number
  /** Light position relative to the object's origin (before scale) */
  offset: [number, number, number]
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
  light?: CatalogLight
  /** Area that shows an uploaded photo (local coordinates, meters); parts tagged `placeholder` hide when a photo is set */
  photo?: { width: number; height: number; center: [number, number, number] }
  build: (color: string) => THREE.Group
}

export const CATEGORY_LABELS: Record<CatalogCategory, string> = {
  furniture: 'Furniture',
  lighting: 'Lighting',
  decor: 'Decor',
  wall: 'Wall',
  tech: 'Tech',
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

function group(...children: THREE.Object3D[]) {
  const g = new THREE.Group()
  g.add(...children)
  return g
}

function legs(w: number, d: number, h: number, r: number, material: THREE.Material, inset = 0.05) {
  const x = w / 2 - inset
  const z = d / 2 - inset
  return [
    cyl(r, r, h, material, -x, 0, -z, 8),
    cyl(r, r, h, material, x, 0, -z, 8),
    cyl(r, r, h, material, -x, 0, z, 8),
    cyl(r, r, h, material, x, 0, z, 8),
  ]
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
  dungeonItem('dungeon-candelabrum', 'Candelabrum', 'i-lucide-flame', 'Candelabrum', 0.75, { light: { color: TORCH_LIGHT, intensity: 2.5, distance: 4, offset: [0, 0.85, 0] } }),
  dungeonItem('dungeon-candelabrum-tall', 'Tall candelabrum', 'i-lucide-flame-kindling', 'Candelabrum_tall', 0.75, { light: { color: TORCH_LIGHT, intensity: 3.5, distance: 5, offset: [0, 1.4, 0] } }),
  dungeonItem('dungeon-candle', 'Candlestick', 'i-lucide-flame', 'Candle', 0.6, { light: { color: TORCH_LIGHT, intensity: 1.2, distance: 2.5, offset: [0, 0.5, 0] } }),
  dungeonItem('dungeon-torch', 'Standing torch', 'i-lucide-flame', 'Torch', 0.75, { light: { color: TORCH_LIGHT, intensity: 4, distance: 6, offset: [0, 1.55, 0] } }),
  dungeonItem('dungeon-wall-torch', 'Wall torch', 'i-lucide-flame', 'Torch_wall', 0.5, { wallMounted: true, light: { color: TORCH_LIGHT, intensity: 4, distance: 6, offset: [0, 0.45, 0.5] } }),
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
  // Furniture
  {
    type: 'bed',
    name: 'Bed',
    icon: 'i-lucide-bed-double',
    category: 'furniture',
    defaultColor: '#6c8ebf',
    build: (color) => {
      const frame = mat(WOOD)
      return group(
        box(1.6, 0.3, 2.1, frame),
        box(1.6, 0.9, 0.08, frame, 0, 0, -1.03),
        box(1.5, 0.2, 2.0, mat(WHITE), 0, 0.3, 0.02),
        box(1.52, 0.06, 1.3, mat(color), 0, 0.5, 0.38),
        box(0.6, 0.12, 0.35, mat(WHITE, { roughness: 0.9 }), -0.38, 0.5, -0.75),
        box(0.6, 0.12, 0.35, mat(WHITE, { roughness: 0.9 }), 0.38, 0.5, -0.75),
      )
    },
  },
  {
    type: 'sofa',
    name: 'Sofa',
    icon: 'i-lucide-sofa',
    category: 'furniture',
    defaultColor: '#c0605a',
    build: (color) => {
      const fabric = mat(color, { roughness: 0.95 })
      return group(
        box(2.0, 0.42, 0.85, fabric),
        box(2.0, 0.5, 0.2, fabric, 0, 0.42, -0.33),
        box(0.18, 0.28, 0.85, fabric, -0.91, 0.42, 0),
        box(0.18, 0.28, 0.85, fabric, 0.91, 0.42, 0),
        box(0.8, 0.1, 0.6, mat(color, { roughness: 1 }), -0.41, 0.42, 0.08),
        box(0.8, 0.1, 0.6, mat(color, { roughness: 1 }), 0.41, 0.42, 0.08),
      )
    },
  },
  {
    type: 'desk',
    name: 'Desk',
    icon: 'i-lucide-rectangle-horizontal',
    category: 'furniture',
    defaultColor: WOOD,
    build: (color) => {
      const wood = mat(color)
      return group(
        box(1.3, 0.05, 0.65, wood, 0, 0.71),
        ...legs(1.3, 0.65, 0.71, 0.025, mat(DARK, { metalness: 0.6, roughness: 0.4 })),
        box(0.4, 0.45, 0.6, wood, 0.42, 0.22),
      )
    },
  },
  {
    type: 'chair',
    name: 'Chair',
    icon: 'i-lucide-armchair',
    category: 'furniture',
    defaultColor: '#3d3d46',
    build: (color) => {
      const m = mat(color)
      return group(
        box(0.46, 0.06, 0.46, m, 0, 0.44),
        box(0.46, 0.5, 0.05, m, 0, 0.5, -0.2),
        ...legs(0.46, 0.46, 0.44, 0.018, mat(DARK, { metalness: 0.6, roughness: 0.4 }), 0.04),
      )
    },
  },
  {
    type: 'coffee-table',
    name: 'Coffee table',
    icon: 'i-lucide-circle',
    category: 'furniture',
    defaultColor: '#a47148',
    build: (color) => group(
      cyl(0.5, 0.5, 0.05, mat(color), 0, 0.38, 0, 32),
      cyl(0.05, 0.08, 0.38, mat(DARK)),
      cyl(0.25, 0.25, 0.03, mat(DARK)),
    ),
  },
  {
    type: 'bookshelf',
    name: 'Bookshelf',
    icon: 'i-lucide-library',
    category: 'furniture',
    defaultColor: '#f0e6d8',
    build: (color) => {
      const m = mat(color)
      const parts: THREE.Object3D[] = [
        box(0.9, 1.9, 0.04, m, 0, 0, -0.15),
        box(0.04, 1.9, 0.32, m, -0.43),
        box(0.04, 1.9, 0.32, m, 0.43),
      ]
      const bookColors = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#16a085', '#d35400']
      for (let shelf = 0; shelf < 5; shelf++) {
        const y = shelf * 0.46
        parts.push(box(0.86, 0.03, 0.3, m, 0, y))
        if (shelf === 4) break
        let x = -0.38
        let i = shelf * 2
        while (x < 0.32) {
          const w = 0.05 + ((i * 7) % 4) * 0.012
          const h = 0.26 + ((i * 5) % 5) * 0.03
          parts.push(box(w, h, 0.22, mat(bookColors[i % bookColors.length]!), x + w / 2, y + 0.03, 0))
          x += w + 0.008
          i++
        }
      }
      return group(...parts)
    },
  },
  {
    type: 'cabinet',
    name: 'Dresser',
    icon: 'i-lucide-archive',
    category: 'furniture',
    defaultColor: '#e8dccb',
    build: (color) => {
      const m = mat(color)
      const handle = mat('#b08d57', { metalness: 0.8, roughness: 0.3 })
      const parts: THREE.Object3D[] = [box(1.0, 0.8, 0.45, m)]
      for (let i = 0; i < 3; i++) {
        parts.push(box(0.92, 0.22, 0.02, mat(color, { roughness: 0.6 }), 0, 0.06 + i * 0.25, 0.225))
        parts.push(box(0.18, 0.025, 0.03, handle, 0, 0.16 + i * 0.25, 0.24))
      }
      return group(...parts)
    },
  },

  // Lighting
  {
    type: 'floor-lamp',
    name: 'Floor lamp',
    icon: 'i-lucide-lamp-floor',
    category: 'lighting',
    defaultColor: '#efe3c8',
    light: { color: WARM_LIGHT, intensity: 6, distance: 6, offset: [0, 1.45, 0] },
    build: (color) => group(
      cyl(0.18, 0.2, 0.04, mat(DARK)),
      cyl(0.015, 0.015, 1.45, mat(DARK, { metalness: 0.6 })),
      cyl(0.16, 0.24, 0.32, glow(color), 0, 1.35),
    ),
  },
  {
    type: 'desk-lamp',
    name: 'Desk lamp',
    icon: 'i-lucide-lamp-desk',
    category: 'lighting',
    defaultColor: '#f4d35e',
    light: { color: WARM_LIGHT, intensity: 2.5, distance: 3, offset: [0, 0.32, 0.08] },
    build: (color) => {
      const arm = cyl(0.012, 0.012, 0.36, mat(DARK))
      arm.rotation.x = -0.35
      arm.position.set(0, 0.17, 0.03)
      const shade = cyl(0.05, 0.1, 0.12, glow(color), 0, 0.3, 0.1)
      return group(cyl(0.08, 0.09, 0.025, mat(DARK)), arm, shade)
    },
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
    build: (color) => {
      const leaves = mat(color, { roughness: 0.9, flatShading: true })
      const leaf = (r: number, x: number, y: number, z: number) =>
        mesh(new THREE.IcosahedronGeometry(r, 0), leaves, x, y, z)
      return group(
        cyl(0.2, 0.15, 0.36, mat('#c96f4a')),
        leaf(0.3, 0, 0.7, 0),
        leaf(0.22, 0.16, 0.92, 0.06),
        leaf(0.2, -0.14, 0.88, -0.08),
        leaf(0.17, 0.02, 1.1, 0),
      )
    },
  },
  {
    type: 'rug',
    name: 'Rug',
    icon: 'i-lucide-square',
    category: 'decor',
    defaultColor: '#d9b382',
    build: (color) => group(
      box(2.2, 0.015, 1.5, mat(color, { roughness: 1 })),
      box(1.9, 0.017, 1.2, mat(new THREE.Color(color).offsetHSL(0, 0, -0.12).getStyle(), { roughness: 1 })),
    ),
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
    build: (color) => {
      const frame = mat(color)
      const glass = new THREE.MeshStandardMaterial({ color: '#9fd3ff', emissive: '#9fd3ff', emissiveIntensity: 0.6, roughness: 0.1 })
      glass.userData.sky = true
      const pane = mesh(new THREE.PlaneGeometry(1.3, 1.1), glass, 0, 0, 0.02)
      pane.castShadow = false
      return group(
        pane,
        box(1.44, 0.07, 0.08, frame, 0, 0.55),
        box(1.44, 0.07, 0.08, frame, 0, -0.62),
        box(0.07, 1.17, 0.08, frame, -0.685, -0.585),
        box(0.07, 1.17, 0.08, frame, 0.685, -0.585),
        box(0.04, 1.1, 0.05, frame, 0, -0.55),
        box(1.3, 0.04, 0.05, frame, 0, -0.02),
        box(1.6, 0.05, 0.2, frame, 0, -0.68, 0.06),
      )
    },
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
    type: 'wall-clock',
    name: 'Clock',
    icon: 'i-lucide-clock',
    category: 'wall',
    defaultColor: '#1d3557',
    wallMounted: true,
    build: (color) => {
      const face = mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 32), mat(color), 0, 0, 0.02)
      face.rotation.x = Math.PI / 2
      const dial = mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.01, 32), mat(WHITE), 0, 0, 0.045)
      dial.rotation.x = Math.PI / 2
      const hour = box(0.015, 0.1, 0.01, mat(DARK), 0, 0, 0.055)
      const minute = box(0.01, 0.15, 0.01, mat(DARK), 0, 0, 0.06)
      minute.rotation.z = -1.2
      return group(face, dial, hour, minute)
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
    build: (color) => {
      const screen = new THREE.MeshStandardMaterial({ color: '#1e3a5f', emissive: '#3a7bd5', emissiveIntensity: 0.35, roughness: 0.2 })
      return group(
        box(1.6, 0.45, 0.42, mat(color)),
        box(0.3, 0.06, 0.2, mat(DARK), 0, 0.45),
        box(1.3, 0.76, 0.05, mat('#111114'), 0, 0.51),
        mesh(new THREE.PlaneGeometry(1.24, 0.7), screen, 0, 0.89, 0.026),
      )
    },
  },
  {
    type: 'laptop',
    name: 'Laptop',
    icon: 'i-lucide-laptop',
    category: 'tech',
    defaultColor: '#b8bcc4',
    build: (color) => {
      const screenGroup = new THREE.Group()
      screenGroup.add(box(0.34, 0.23, 0.012, mat(color, { metalness: 0.7, roughness: 0.35 })))
      const display = new THREE.MeshStandardMaterial({ color: '#203a5c', emissive: '#6fa8ff', emissiveIntensity: 0.4 })
      screenGroup.add(mesh(new THREE.PlaneGeometry(0.31, 0.19), display, 0, 0.115, 0.0065))
      screenGroup.position.set(0, 0.015, -0.11)
      screenGroup.rotation.x = -0.25
      return group(box(0.34, 0.015, 0.24, mat(color, { metalness: 0.7, roughness: 0.35 })), screenGroup)
    },
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

const glaze = (color: string) => mat(color, { roughness: 0.32 })

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
): CatalogItem {
  return {
    type,
    name,
    icon,
    category: 'decor',
    defaultColor: container?.defaultColor ?? '#ffffff',
    // Without a container there's nothing to recolour
    fromModel: !container,
    build: (color) => {
      const g = new THREE.Group()
      let base = 0
      if (container) {
        const [parts, top] = container.build(color)
        g.add(...parts)
        base = top
      }
      g.userData.ready = attachNaturePieces(g, pieces.map(p => ({ ...p, y: (p.y ?? 0) + base })))
      return g
    },
  }
}

const GARDEN_ITEMS: CatalogItem[] = [
  // Flowers, always in a container
  natureItem('garden-flower-pot', 'Flower pot', 'i-lucide-flower', [
    { model: 'Flower_3_Group', height: 0.3 },
    { model: 'Grass_Common_Short', height: 0.12, x: 0.07, z: 0.05, rotation: 1.5 },
  ], { defaultColor: '#c8734f', build: terracottaPot() }),
  natureItem('garden-ceramic-flowers', 'Ceramic planter', 'i-lucide-flower-2', [
    { model: 'Flower_4_Group', height: 0.32 },
    { model: 'Flower_3_Single', height: 0.26, x: -0.07, z: 0.05, rotation: 2 },
    { model: 'Grass_Common_Short', height: 0.12, x: 0.08, z: -0.05 },
  ], { defaultColor: '#2f5d62', build: ceramicPlanter() }),
  natureItem('garden-flower-vase', 'Flower vase', 'i-lucide-flower', [
    { model: 'Flower_4_Single', height: 0.32 },
    { model: 'Flower_3_Single', height: 0.28, x: 0.02, z: 0.015, rotation: 2.1 },
    { model: 'Flower_4_Single', height: 0.26, x: -0.02, z: -0.01, rotation: 4.2 },
  ], { defaultColor: '#f2efe9', build: tallVase }),
  natureItem('garden-bud-vase', 'Bud vase', 'i-lucide-flower-2', [
    { model: 'Flower_3_Single', height: 0.22 },
  ], { defaultColor: '#e9a6b3', build: budVase }),
  natureItem('garden-flower-bowl', 'Flower bowl', 'i-lucide-flower', [
    { model: 'Flower_3_Group', height: 0.28, x: -0.1 },
    { model: 'Flower_4_Group', height: 0.26, x: 0.1, z: 0.04, rotation: 1.4 },
    { model: 'Grass_Common_Short', height: 0.12, x: 0.02, z: -0.12 },
    { model: 'Clover_1', height: 0.05, x: 0.15, z: -0.1 },
  ], { defaultColor: '#efe6d6', build: flowerBowl }),
  natureItem('garden-flower-bed', 'Flower bed', 'i-lucide-flower', [
    { model: 'Flower_4_Group', height: 0.32, x: -0.3, z: 0 },
    { model: 'Flower_3_Group', height: 0.3, x: 0.02, z: 0.02, rotation: 1.2 },
    { model: 'Flower_4_Group', height: 0.28, x: 0.32, z: -0.02, rotation: 2.4 },
    { model: 'Grass_Common_Short', height: 0.15, x: -0.14, z: 0.08 },
    { model: 'Grass_Common_Short', height: 0.14, x: 0.18, z: 0.07, rotation: 2 },
  ], { defaultColor: '#9a6a46', build: planterBox }),
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

export const CATALOG_BY_TYPE: Record<string, CatalogItem> = Object.fromEntries(
  ROOM_CATALOG.map(item => [item.type, item]),
)
