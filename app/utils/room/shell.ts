import * as THREE from 'three'
import type { FloorMaterial, RoomStyle, WallMaterial } from '~/types/room'
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

  const floorTexture = createFloorTexture(style.floorMaterial, width, depth)
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: style.floorColor,
    map: floorTexture,
    // The same greyscale picture as a bump map: plank joints, grout and pores sink in
    bumpMap: floorTexture,
    bumpScale: FLOOR_BUMP[style.floorMaterial],
    roughness: FLOOR_ROUGHNESS[style.floorMaterial],
  })
  const floor = new THREE.Mesh(new THREE.BoxGeometry(width + WALL_THICKNESS, FLOOR_THICKNESS, depth + WALL_THICKNESS), floorMaterial)
  floor.position.set(-WALL_THICKNESS / 2, -FLOOR_THICKNESS / 2, -WALL_THICKNESS / 2)
  floor.receiveShadow = true

  // Each wall has its own texture repeat (its own length), so its own material
  const wallMaterial = (length: number) => {
    const finish = style.wallMaterial ?? 'paint'
    const texture = finish === 'paint' ? null : createWallTexture(finish, length, height)
    return new THREE.MeshStandardMaterial({ color: style.wallColor, map: texture, bumpMap: texture, bumpScale: WALL_BUMP[finish], roughness: WALL_ROUGHNESS[finish] })
  }
  const backMaterial = wallMaterial(width + WALL_THICKNESS)
  const leftMaterial = wallMaterial(depth)
  const back = new THREE.Mesh(new THREE.BoxGeometry(width + WALL_THICKNESS, height, WALL_THICKNESS), backMaterial)
  back.position.set(-WALL_THICKNESS / 2, height / 2, -depth / 2 - WALL_THICKNESS / 2)
  back.userData.wall = 'back'
  const left = new THREE.Mesh(new THREE.BoxGeometry(WALL_THICKNESS, height, depth), leftMaterial)
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
    for (const m of [floorMaterial, backMaterial, leftMaterial, trimMaterial]) m.visible = false
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

// ---------- Procedural floor and wall textures (greyscale, tinted by the colour picked) ----------

const FLOOR_ROUGHNESS: Record<FloorMaterial, number> = { wood: 0.7, tile: 0.3, carpet: 1, concrete: 0.8 }
const FLOOR_BUMP: Record<FloorMaterial, number> = { wood: 1.2, tile: 2.5, carpet: 1.5, concrete: 0.8 }
const WALL_ROUGHNESS: Record<WallMaterial, number> = { paint: 0.95, plaster: 1, brick: 0.95, panel: 0.6, stripes: 0.85 }
const WALL_BUMP: Record<WallMaterial, number> = { paint: 0, plaster: 1.5, brick: 3, panel: 2.5, stripes: 0.3 }

/** Deterministic noise, so a room looks the same on every load */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

function canvas2d(size: number) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  return { canvas, ctx }
}

function grey(v: number, a = 1) {
  const c = Math.max(0, Math.min(255, Math.round(v)))
  return `rgba(${c},${c},${c},${a})`
}

/** Fine per-pixel grain on top of what's drawn */
function grain(ctx: CanvasRenderingContext2D, size: number, strength: number, rand: () => number) {
  const image = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < image.data.length; i += 4) {
    const d = (rand() - 0.5) * strength
    image.data[i] = image.data[i]! + d
    image.data[i + 1] = image.data[i + 1]! + d
    image.data[i + 2] = image.data[i + 2]! + d
  }
  ctx.putImageData(image, 0, 0)
}

/** Soft round blotches that wrap at the edges, for clouded surfaces */
function blotches(ctx: CanvasRenderingContext2D, size: number, count: number, alpha: number, rand: () => number) {
  for (let i = 0; i < count; i++) {
    const x = rand() * size
    const y = rand() * size
    const r = size * (0.08 + rand() * 0.22)
    const dark = rand() < 0.5
    for (const ox of [-size, 0, size]) {
      for (const oy of [-size, 0, size]) {
        const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r)
        g.addColorStop(0, dark ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2)
      }
    }
  }
}

function toTexture(canvas: HTMLCanvasElement, repeatX: number, repeatY: number) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeatX, repeatY)
  texture.anisotropy = 8
  return texture
}

/** One canvas covers 3 x 3 m of floor */
export function createFloorTexture(kind: FloorMaterial, width: number, depth: number): THREE.CanvasTexture {
  const size = 1024
  const { canvas, ctx } = canvas2d(size)
  const rand = seeded(7)

  if (kind === 'wood') {
    // 12 rows of 25 cm planks, 0.9-1.8 m long, joints staggered row to row
    const rows = 12
    const plank = size / rows
    for (let r = 0; r < rows; r++) {
      const y = r * plank
      let x = -rand() * size * 0.5
      while (x < size) {
        const length = size * (0.3 + rand() * 0.3)
        const shade = 214 + rand() * 38
        for (const ox of [0, size]) {
          const px = x - ox
          if (px + length < 0 || px > size) continue
          ctx.fillStyle = grey(shade)
          ctx.fillRect(px, y, length, plank)
          // Grain: long wavy strokes, a little darker
          ctx.lineWidth = 1.2
          for (let g = 0; g < 9; g++) {
            const gy = y + 3 + rand() * (plank - 6)
            const wave = (rand() - 0.5) * 6
            ctx.strokeStyle = grey(shade - 22 - rand() * 18, 0.35)
            ctx.beginPath()
            ctx.moveTo(px, gy)
            ctx.bezierCurveTo(px + length / 3, gy + wave, px + (length * 2) / 3, gy - wave, px + length, gy + wave / 2)
            ctx.stroke()
          }
          // A knot now and then
          if (rand() < 0.35) {
            const kx = px + length * (0.2 + rand() * 0.6)
            const ky = y + plank * (0.3 + rand() * 0.4)
            ctx.fillStyle = grey(shade - 60, 0.5)
            ctx.beginPath()
            ctx.ellipse(kx, ky, 7 + rand() * 5, 3 + rand() * 2, 0, 0, Math.PI * 2)
            ctx.fill()
          }
          // End joint
          ctx.fillStyle = grey(110, 0.75)
          ctx.fillRect(px + length - 2, y, 2, plank)
        }
        x += length
      }
      // Long joint with a lit bevel below it
      ctx.fillStyle = grey(95, 0.8)
      ctx.fillRect(0, y, size, 2)
      ctx.fillStyle = grey(255, 0.35)
      ctx.fillRect(0, y + 2, size, 1)
    }
    grain(ctx, size, 10, rand)
  } else if (kind === 'tile') {
    // 4 x 4 tiles of 75 cm, each a slightly different tone, bevelled into the grout
    const n = 4
    const tile = size / n
    const grout = 6
    ctx.fillStyle = grey(150)
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = i * tile + grout / 2
        const y = j * tile + grout / 2
        const w = tile - grout
        const shade = 238 + rand() * 14
        const g = ctx.createLinearGradient(x, y, x + w, y + w)
        g.addColorStop(0, grey(shade + 6))
        g.addColorStop(1, grey(shade - 8))
        ctx.fillStyle = g
        ctx.fillRect(x, y, w, w)
        ctx.fillStyle = grey(255, 0.6)
        ctx.fillRect(x, y, w, 2)
        ctx.fillRect(x, y, 2, w)
        ctx.fillStyle = grey(120, 0.35)
        ctx.fillRect(x, y + w - 2, w, 2)
        ctx.fillRect(x + w - 2, y, 2, w)
      }
    }
    blotches(ctx, size, 14, 0.04, rand)
    grain(ctx, size, 6, rand)
  } else if (kind === 'carpet') {
    // Cut-pile: soft mottling plus a dense tufted weave
    blotches(ctx, size, 26, 0.07, rand)
    const step = 4
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const v = 200 + rand() * 55
        ctx.fillStyle = grey(v, 0.55)
        ctx.fillRect(x + ((y / step) % 2) * 2, y, 3, 3)
      }
    }
    grain(ctx, size, 26, rand)
  } else {
    // Polished concrete: clouded tone, pores, and saw-cut joints every 1.5 m
    blotches(ctx, size, 40, 0.09, rand)
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = grey(90 + rand() * 60, 0.35 + rand() * 0.3)
      ctx.beginPath()
      ctx.arc(rand() * size, rand() * size, 0.6 + rand() * 1.6, 0, Math.PI * 2)
      ctx.fill()
    }
    for (const at of [0, size / 2]) {
      ctx.fillStyle = grey(120, 0.6)
      ctx.fillRect(at, 0, 2, size)
      ctx.fillRect(0, at, size, 2)
    }
    grain(ctx, size, 14, rand)
  }
  return toTexture(canvas, width / 3, depth / 3)
}

/** One canvas covers 1 x 1 m of wall */
export function createWallTexture(kind: Exclude<WallMaterial, 'paint'>, length: number, height: number): THREE.CanvasTexture {
  const size = 512
  const { canvas, ctx } = canvas2d(size)
  const rand = seeded(11)

  if (kind === 'plaster') {
    // Limewash: many faint, overlapping clouds (2 x 2 m before it repeats) and a sandy grain
    blotches(ctx, size, 90, 0.025, rand)
    grain(ctx, size, 16, rand)
  } else if (kind === 'brick') {
    // Running bond: 12 courses a metre, bricks 33 cm long, light mortar
    const rows = 12
    const brickH = size / rows
    const brickW = size / 3
    const mortar = 5
    ctx.fillStyle = grey(240)
    ctx.fillRect(0, 0, size, size)
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 ? brickW / 2 : 0
      for (let c = -1; c < 4; c++) {
        const x = c * brickW + offset + mortar / 2
        const y = r * brickH + mortar / 2
        const shade = 178 + rand() * 42
        ctx.fillStyle = grey(shade)
        ctx.fillRect(x, y, brickW - mortar, brickH - mortar)
        // Worn faces: a few lighter and darker specks
        for (let k = 0; k < 14; k++) {
          ctx.fillStyle = grey(shade + (rand() - 0.5) * 70, 0.5)
          ctx.fillRect(x + rand() * (brickW - mortar), y + rand() * (brickH - mortar), 2, 2)
        }
        ctx.fillStyle = grey(255, 0.18)
        ctx.fillRect(x, y, brickW - mortar, 2)
      }
    }
    grain(ctx, size, 14, rand)
  } else if (kind === 'panel') {
    // Beadboard: vertical boards 12.8 cm wide with a groove and a bead between them
    const boards = 8
    const w = size / boards
    for (let i = 0; i < boards; i++) {
      const x = i * w
      const shade = 236 + rand() * 14
      ctx.fillStyle = grey(shade)
      ctx.fillRect(x, 0, w, size)
      ctx.fillStyle = grey(120, 0.8)
      ctx.fillRect(x, 0, 3, size)
      ctx.fillStyle = grey(255, 0.7)
      ctx.fillRect(x + 3, 0, 2, size)
      ctx.strokeStyle = grey(shade - 18, 0.25)
      for (let g = 0; g < 4; g++) {
        const gx = x + 8 + rand() * (w - 14)
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        ctx.bezierCurveTo(gx + 3, size / 3, gx - 3, (size * 2) / 3, gx, size)
        ctx.stroke()
      }
    }
    grain(ctx, size, 6, rand)
  } else {
    // Striped wallpaper: wide bands, a fine pinstripe between them, a little paper texture
    const band = size / 8
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = grey(i % 2 ? 228 : 252)
      ctx.fillRect(i * band, 0, band, size)
      ctx.fillStyle = grey(200)
      ctx.fillRect(i * band + band - 3, 0, 1.5, size)
    }
    grain(ctx, size, 8, rand)
  }
  // Plaster's clouds are drawn over 2 m so they don't repeat every metre
  const metres = kind === 'plaster' ? 2 : 1
  return toTexture(canvas, length / metres, height / metres)
}
