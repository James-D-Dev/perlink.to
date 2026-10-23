import * as THREE from 'three'
import type { RoomStyle } from '~/types/room'
import { loadDungeonModel } from './dungeonModels'

// Room shell: floor plus back and left walls. The plain floor and walls are
// always built because they are the drop/drag targets; themed styles hide
// them and add model-based visuals on top.

export const WALL_THICKNESS = 0.12
export const FLOOR_THICKNESS = 0.14

export interface RoomShell {
  group: THREE.Group
  floor: THREE.Mesh
  walls: THREE.Mesh[]
  /** Resolves when themed (model-based) parts have loaded */
  ready: Promise<void>
}

export function buildRoomShell(style: RoomStyle): RoomShell {
  const group = new THREE.Group()
  const { width, depth, height } = style

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: style.floorColor,
    map: createFloorTexture(style.floorMaterial, width, depth),
    roughness: style.floorMaterial === 'tile' ? 0.35 : 0.85,
  })
  const floor = new THREE.Mesh(new THREE.BoxGeometry(width + WALL_THICKNESS, FLOOR_THICKNESS, depth + WALL_THICKNESS), floorMaterial)
  floor.position.set(-WALL_THICKNESS / 2, -FLOOR_THICKNESS / 2, -WALL_THICKNESS / 2)
  floor.receiveShadow = true

  const wallMaterial = new THREE.MeshStandardMaterial({ color: style.wallColor, roughness: 0.95 })
  const back = new THREE.Mesh(new THREE.BoxGeometry(width + WALL_THICKNESS, height, WALL_THICKNESS), wallMaterial)
  back.position.set(-WALL_THICKNESS / 2, height / 2, -depth / 2 - WALL_THICKNESS / 2)
  back.userData.wall = 'back'
  const left = new THREE.Mesh(new THREE.BoxGeometry(WALL_THICKNESS, height, depth), wallMaterial)
  left.position.set(-width / 2 - WALL_THICKNESS / 2, height / 2, 0)
  left.userData.wall = 'left'
  const walls = [back, left]
  for (const wall of walls) {
    wall.receiveShadow = true
    wall.castShadow = true
  }

  const trimMaterial = new THREE.MeshStandardMaterial({ color: style.trimColor, roughness: 0.6 })
  const backTrim = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, 0.03), trimMaterial)
  backTrim.position.set(0, 0.05, -depth / 2 + 0.015)
  const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.1, depth), trimMaterial)
  leftTrim.position.set(-width / 2 + 0.015, 0.05, 0)

  group.add(floor, back, left, backTrim, leftTrim)

  let ready: Promise<void> = Promise.resolve()
  if (style.theme === 'dungeon') {
    // Keep the plain shell as invisible drop targets; draw stone pieces instead
    for (const m of [floorMaterial, wallMaterial, trimMaterial]) m.visible = false
    floor.castShadow = false
    back.castShadow = false
    left.castShadow = false
    const dungeon = new THREE.Group()
    group.add(dungeon)
    ready = buildDungeonShell(dungeon, style)
  }
  return { group, floor, walls, ready }
}

/** Place a copy of a pack model with a given position, rotation and per-axis scale */
async function piece(group: THREE.Group, name: string, x: number, y: number, z: number, rotY: number, sx: number, sy: number, sz: number) {
  const model = (await loadDungeonModel(name)).clone()
  model.position.set(x, y, z)
  model.rotation.y = rotY
  model.scale.set(sx, sy, sz)
  model.userData.shared = true
  group.add(model)
}

/** Stone walls, columns, caps and tiled floor from the Modular Dungeon pack */
async function buildDungeonShell(group: THREE.Group, style: RoomStyle) {
  const { width, depth, height } = style
  const UNIT = 0.75 // meters per pack unit
  const nx = Math.max(1, Math.round(width / 1.5))
  const nz = Math.max(1, Math.round(depth / 1.5))
  const tileW = width / nx
  const tileD = depth / nz
  const rows = Math.max(1, Math.round(height / 1.5))
  const panelH = height / rows
  const jobs: Promise<void>[] = []

  // Floor tiles (pack tile is 2 x 2 units, 0.37 high); top sits at y = 0
  const floorY = 0.5
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      jobs.push(piece(group, 'ModularFloor', -width / 2 + (i + 0.5) * tileW, -0.36 * floorY, -depth / 2 + (j + 0.5) * tileD, 0, tileW / 2, floorY, tileD / 2))
    }
  }

  // Wall panels face +x in the pack: rotate for the back wall, as-is for the left wall
  const wallFront = 0.06 * UNIT
  for (let r = 0; r < rows; r++) {
    const y = (r + 0.5) * panelH
    for (let i = 0; i < nx; i++) {
      jobs.push(piece(group, 'ModularStoneWall', -width / 2 + (i + 0.5) * tileW, y, -depth / 2 - wallFront, -Math.PI / 2, UNIT, panelH / 2, tileW / 2))
    }
    for (let j = 0; j < nz; j++) {
      jobs.push(piece(group, 'ModularStoneWall', -width / 2 - wallFront, y, -depth / 2 + (j + 0.5) * tileD, 0, UNIT, panelH / 2, tileD / 2))
    }
  }

  // Columns at panel joints and corners
  const column = async (x: number, z: number) => {
    const bottom = 0.61
    const middle = 0.52
    const middles = Math.max(1, Math.round((height / UNIT - bottom * 2) / middle))
    const sy = height / ((bottom * 2 + middle * middles) * UNIT) * UNIT
    let y = 0
    await piece(group, 'ModularColumn_bottom', x, y, z, 0, UNIT, sy, UNIT)
    y += bottom * sy
    for (let m = 0; m < middles; m++) {
      await piece(group, 'ModularColumn_middle', x, y, z, 0, UNIT, sy, UNIT)
      y += middle * sy
    }
    await piece(group, 'ModularColumn_top', x, y, z, 0, UNIT, sy, UNIT)
  }
  // Set back into the wall so they only stand slightly proud and don't cover wall decor
  const inset = 0.25
  for (let i = 0; i <= nx; i++) jobs.push(column(-width / 2 + i * tileW - (i === 0 ? inset : 0), -depth / 2 - inset))
  for (let j = 1; j <= nz; j++) jobs.push(column(-width / 2 - inset, -depth / 2 + j * tileD))

  // Capstones: a large block over each column with lower slabs between them
  const capMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color().setRGB(0.62, 0.62, 0.62), roughness: 0.85, flatShading: true })
  const addCap = (w: number, h: number, d: number, x: number, z: number) => {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), capMaterial)
    cap.position.set(x, height + h / 2, z)
    cap.castShadow = true
    cap.receiveShadow = true
    group.add(cap)
  }
  const block = 0.85
  const slab = 0.55
  const backZ = -depth / 2 - inset
  const leftX = -width / 2 - inset
  for (let i = 0; i <= nx; i++) addCap(block, 0.26, block, -width / 2 + i * tileW - (i === 0 ? inset : 0), backZ)
  for (let j = 1; j <= nz; j++) addCap(block, 0.26, block, leftX, -depth / 2 + j * tileD)
  for (let i = 0; i < nx; i++) addCap(tileW - block + 0.02, 0.16, slab, -width / 2 + (i + 0.5) * tileW, backZ)
  for (let j = 0; j < nz; j++) addCap(slab, 0.16, tileD - block + 0.02, leftX, -depth / 2 + (j + 0.5) * tileD)

  await Promise.all(jobs)
}

// ---------- Procedural floor textures (grayscale, tinted by material color) ----------

export function createFloorTexture(kind: RoomStyle['floorMaterial'], width: number, depth: number): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  // Deterministic noise so the floor looks the same on every load
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  if (kind === 'wood') {
    const plank = size / 8
    for (let i = 0; i < 8; i++) {
      const shade = 225 + Math.floor(rand() * 30)
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`
      ctx.fillRect(0, i * plank, size, plank)
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(0, i * plank, size, 2)
      const joint = Math.floor(rand() * size)
      ctx.fillRect(joint, i * plank, 2, plank)
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'
      for (let g = 0; g < 4; g++) {
        ctx.beginPath()
        const y = i * plank + rand() * plank
        ctx.moveTo(0, y)
        ctx.bezierCurveTo(size / 3, y + 4, (size * 2) / 3, y - 4, size, y)
        ctx.stroke()
      }
    }
  } else if (kind === 'tile') {
    const tile = size / 4
    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    for (let i = 0; i <= 4; i++) {
      ctx.fillRect(i * tile - 2, 0, 4, size)
      ctx.fillRect(0, i * tile - 2, size, 4)
    }
  } else {
    // Carpet and concrete: fine noise, concrete a bit stronger
    const strength = kind === 'concrete' ? 40 : 22
    const image = ctx.getImageData(0, 0, size, size)
    for (let i = 0; i < image.data.length; i += 4) {
      const v = 255 - Math.floor(rand() * strength)
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v
    }
    ctx.putImageData(image, 0, 0)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(width / 3, depth / 3)
  texture.anisotropy = 4
  return texture
}
