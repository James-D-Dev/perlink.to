import * as THREE from 'three'
import type { CatalogItem } from './catalog'
import {
  animate, balloon, box, canvasTexture, cyl, glass, glow, group, heart, heartbeat, heartGeometry, heartShape,
  lathe, loop, loose, mat, mesh, metal, rod, rose, roseLeafGeometry, roses, seeded, shiny, sphere, swarm, v3,
  type RoseSpot,
} from './modelKit'

// Premium room items, sold in packs (shared/roomPacks.ts). Each one is drawn
// in code and most of them move: balloons sway, flames flicker, petals fall,
// confetti flies. Local origin is the centre of the base, facing +z; wall
// items have their back on z = 0.

const STEM = '#3f7d3a'
const PINK = '#ff8fb1'
const GOLD = '#d9a93f'
const RED = '#d0142c'

type Item = Omit<CatalogItem, 'category'>
const premium = (pack: string, items: Item[]): CatalogItem[] => items.map(item => ({ ...item, category: 'premium', pack }))

// ======================================================================
// Valentine
// ======================================================================

const VALENTINE = premium('valentine', [
  {
    type: 'vip-rose-bouquet',
    name: 'Rose bouquet',
    icon: 'i-lucide-flower',
    defaultColor: '#d61f45',
    attractsButterflies: true,
    build: (color) => {
      const parts: THREE.Object3D[] = [
        lathe([[0, 0], [0.11, 0], [0.13, 0.08], [0.09, 0.26], [0.1, 0.34], [0.09, 0.34]], glass('#e8f4f8', 0.55), 0, 32),
        cyl(0.085, 0.1, 0.2, mat('#bfe3ea', { transparent: true, opacity: 0.35 }), 0, 0.02),
      ]
      const ribbon = mesh(new THREE.TorusGeometry(0.095, 0.018, 8, 32), mat('#ffffff', { roughness: 0.3 }), 0, 0.27, 0)
      ribbon.rotation.x = Math.PI / 2
      parts.push(ribbon)
      // The blooms sway together on their stems
      const top = group()
      const blooms: [number, number, number][] = [[0, 0.62, 0], [0.11, 0.57, 0.05], [-0.1, 0.58, 0.06], [0.06, 0.55, -0.1], [-0.07, 0.54, -0.09], [0.15, 0.5, -0.03], [-0.15, 0.5, 0.0]]
      const bloomSpots: RoseSpot[] = []
      blooms.forEach(([x, y, z], i) => {
        top.add(rod(v3(x * 0.3, 0.25, z * 0.3), v3(x, y - 0.02, z), 0.007, mat(STEM)))
        bloomSpots.push({ p: v3(x, y, z), n: v3(x * 2.5, 1, z * 2.5).normalize(), size: 0.055, color: i % 3 === 2 ? PINK : color, open: 0.75 })
      })
      top.add(roses(bloomSpots))
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2
        const leaf = mesh(new THREE.SphereGeometry(0.05, 8, 6), mat(STEM, { roughness: 0.8 }), Math.cos(a) * 0.14, 0.45, Math.sin(a) * 0.14)
        leaf.scale.set(1.4, 0.3, 0.6)
        leaf.rotation.set(0, -a, 0.5)
        top.add(leaf)
      }
      parts.push(animate(top, (t) => {
        top.rotation.z = Math.sin(t * 0.9) * 0.025
        top.rotation.x = Math.cos(t * 0.7) * 0.02
      }))
      // A petal now and then, drifting down
      const petalGeo = new THREE.SphereGeometry(0.02, 8, 6)
      petalGeo.scale(1, 0.18, 0.7)
      parts.push(loose(swarm(3, petalGeo, mat(color, { roughness: 0.6, side: THREE.DoubleSide }), (i, t, d) => {
        const p = loop(t, 6, i * 2)
        d.position.set(0.12 * Math.sin(i * 2.1) + Math.sin(p * 9) * 0.04, 0.6 - p * 0.6, 0.12 * Math.cos(i * 2.1))
        d.rotation.set(p * 8, p * 5, p * 3)
        return p < 0.97
      })))
      return group(...parts)
    },
  },
  {
    type: 'vip-heart-balloons',
    name: 'Heart balloons',
    icon: 'i-lucide-heart',
    defaultColor: '#ff2e63',
    build: (color) => {
      const parts: THREE.Object3D[] = [
        box(0.16, 0.14, 0.16, mat(color, { roughness: 0.5 })),
        box(0.17, 0.02, 0.04, mat('#ffd166'), 0, 0.14),
        box(0.04, 0.02, 0.17, mat('#ffd166'), 0, 0.14),
      ]
      const balloons: [number, number, number, string, number][] = [
        [0, 1.75, 0, color, 0.42],
        [-0.3, 1.5, 0.08, PINK, 0.34],
        [0.32, 1.55, -0.06, '#ffffff', 0.32],
        [0.12, 1.3, 0.18, '#ff9ec4', 0.26],
      ]
      balloons.forEach(([x, y, z, c, w], i) => {
        // Each balloon swings on its string from the weight
        const pivot = group()
        pivot.position.set(0, 0.15, 0)
        const tip = v3(x, y - 0.15 - w * 0.42, z)
        pivot.add(rod(v3(0, 0, 0), tip, 0.003, mat('#f4f4f4'), 0.003, 4))
        const h = heart(w, w * 0.28, shiny(c), x, y - 0.15, z)
        pivot.add(h)
        parts.push(animate(pivot, (t) => {
          pivot.rotation.z = Math.sin(t * 0.8 + i * 1.7) * 0.05
          pivot.rotation.x = Math.cos(t * 0.6 + i) * 0.04
          h.rotation.y = Math.sin(t * 0.5 + i * 2) * 0.35
          h.position.y = y - 0.15 + Math.sin(t * 1.1 + i) * 0.02
        }))
      })
      return group(...parts)
    },
  },
  {
    type: 'vip-rose-arch',
    name: 'Rose arch',
    icon: 'i-lucide-rainbow',
    defaultColor: '#f4efe6',
    attractsButterflies: true,
    build: (color) => {
      // A wrought garden arch (two lattice sides, a double hoop on top)
      // smothered in climbing roses, buds and leaves, petals drifting down
      const iron = mat(color, { roughness: 0.35, metalness: 0.45 })
      const W = 0.85
      const H = 1.45
      const D = 0.16
      const R = W
      const parts: THREE.Object3D[] = []
      for (const z of [-D, D]) {
        for (const x of [-W, W]) {
          parts.push(cyl(0.018, 0.018, H, iron, x, 0, z, 10))
          parts.push(sphere(0.03, iron, x, 0.02, z, 12))
        }
        parts.push(mesh(new THREE.TorusGeometry(R, 0.016, 8, 64, Math.PI), iron, 0, H, z))
        parts.push(mesh(new THREE.TorusGeometry(R - 0.12, 0.01, 8, 64, Math.PI), iron, 0, H, z))
        // Scrolls between the two hoops
        for (let i = 1; i < 12; i++) {
          const a = (i / 12) * Math.PI
          parts.push(rod(v3(Math.cos(a) * (R - 0.12), H + Math.sin(a) * (R - 0.12), z), v3(Math.cos(a) * R, H + Math.sin(a) * R, z), 0.006, iron))
        }
      }
      // Rungs across the depth, and a diamond lattice on each side
      for (let i = 0; i <= 10; i++) {
        const a = (i / 10) * Math.PI
        parts.push(rod(v3(Math.cos(a) * R, H + Math.sin(a) * R, -D), v3(Math.cos(a) * R, H + Math.sin(a) * R, D), 0.008, iron))
      }
      for (const x of [-W, W]) {
        for (let k = 0; k < 6; k++) {
          const y0 = 0.1 + k * 0.22
          parts.push(rod(v3(x, y0, -D), v3(x, y0 + 0.22, D), 0.006, iron), rod(v3(x, y0, D), v3(x, y0 + 0.22, -D), 0.006, iron))
        }
      }

      // Where the roses grow: thick over the top, climbing the sides
      const rand = seeded(71)
      const reds = ['#c8102e', '#d81b3c', '#b0102a', '#e0234e']
      const pinks = ['#f48fb1', '#f8bbd0', '#ffd1dc']
      const bloomSpots: RoseSpot[] = []
      const leafSpots: { p: THREE.Vector3; n: THREE.Vector3; spin: number; size: number }[] = []
      const budSpots: THREE.Vector3[] = []
      const along = (u: number) => {
        // 0..1 up the left side, over the top, down the right side
        const sideLen = H
        const arcLen = Math.PI * R
        const total = sideLen * 2 + arcLen
        const d = u * total
        if (d < sideLen) return { p: v3(-W, d, 0), out: v3(-1, 0, 0) }
        if (d < sideLen + arcLen) {
          const a = Math.PI - ((d - sideLen) / arcLen) * Math.PI
          return { p: v3(Math.cos(a) * R, H + Math.sin(a) * R, 0), out: v3(Math.cos(a), Math.sin(a), 0) }
        }
        return { p: v3(W, H - (d - sideLen - arcLen), 0), out: v3(1, 0, 0) }
      }
      for (let i = 0; i < 150; i++) {
        let u = rand()
        // More roses up top than near the ground
        const { p, out } = along(u)
        if (p.y < 0.35 && rand() < 0.7) { u = 0.3 + rand() * 0.4; Object.assign(p, along(u).p) }
        const facing = v3(out.x * 0.6 + (rand() - 0.5) * 0.6, out.y * 0.6 + (rand() - 0.3) * 0.5, (rand() < 0.5 ? -1 : 1) * (0.6 + rand() * 0.6)).normalize()
        const spot = p.clone().addScaledVector(facing, 0.04 + rand() * 0.03)
        spot.z += (rand() - 0.5) * D * 1.6
        const pink = rand() < 0.28
        bloomSpots.push({ p: spot, n: facing, size: 0.04 + rand() * 0.022, color: pink ? pinks[Math.floor(rand() * pinks.length)]! : reds[Math.floor(rand() * reds.length)]!, open: 0.55 + rand() * 0.45 })
        for (let l = 0; l < 3; l++) leafSpots.push({ p: spot.clone().add(v3((rand() - 0.5) * 0.1, (rand() - 0.5) * 0.1, (rand() - 0.5) * 0.08)), n: v3(rand() - 0.5, rand() - 0.3, rand() - 0.5).normalize(), spin: rand() * 6.28, size: 0.05 + rand() * 0.03 })
        if (rand() < 0.35) budSpots.push(spot.clone().add(v3((rand() - 0.5) * 0.08, 0.05, (rand() - 0.5) * 0.06)))
      }
      // A few blooms hanging down from the top on short trailing stems
      for (let i = 0; i < 9; i++) {
        const a = 0.25 + (i / 8) * (Math.PI - 0.5)
        const top = v3(Math.cos(a) * R, H + Math.sin(a) * R, (rand() - 0.5) * D * 1.4)
        const drop = 0.12 + rand() * 0.16
        const end = top.clone().add(v3(0, -drop, 0))
        parts.push(rod(top, end, 0.004, mat(STEM)))
        bloomSpots.push({ p: end, n: v3((rand() - 0.5) * 0.4, -0.6, rand() < 0.5 ? -0.7 : 0.7).normalize(), size: 0.035 + rand() * 0.015, color: reds[i % reds.length]!, open: 0.7 })
      }
      parts.push(roses(bloomSpots))
      const leafGeo = roseLeafGeometry(1)
      const leafMat = mat('#2f6b2f', { roughness: 0.55, side: THREE.DoubleSide })
      parts.push(swarm(leafSpots.length, leafGeo, leafMat, (i, _t, d) => {
        const l = leafSpots[i]!
        d.position.copy(l.p)
        d.quaternion.setFromUnitVectors(v3(0, 1, 0), l.n)
        d.rotateY(l.spin)
        d.scale.setScalar(l.size)
      }, ['#2f6b2f', '#3d7f35', '#285a28', '#4a8c3a']))
      // Buds: a closed bloom in green sepals
      parts.push(swarm(budSpots.length, new THREE.SphereGeometry(0.014, 10, 8), mat('#b0102a', { roughness: 0.5 }), (i, _t, d) => {
        d.position.copy(budSpots[i]!)
        d.scale.set(0.85, 1.35, 0.85)
      }))
      // Petals drifting down through the arch
      const petalGeo = new THREE.SphereGeometry(0.018, 8, 6)
      petalGeo.scale(1, 0.15, 0.75)
      parts.push(loose(swarm(14, petalGeo, mat('#ffffff', { roughness: 0.6, side: THREE.DoubleSide }), (i, t, d) => {
        const p = loop(t, 7, i * 0.5)
        d.position.set(Math.sin(i * 7.7) * 0.6 + Math.sin(t * 1.1 + i) * 0.08, (H + R * 0.8) * (1 - p), Math.cos(i * 3.3) * 0.25 + Math.cos(t * 0.9 + i) * 0.05)
        d.rotation.set(t * 2 + i, t * 1.3 + i, t)
        return p < 0.98
      }, ['#c8102e', '#e0234e', '#f48fb1'])))
      return group(...parts)
    },
  },
  {
    type: 'vip-candle-heart',
    name: 'Candle heart',
    icon: 'i-lucide-flame',
    defaultColor: '#fff3e0',
    light: { color: '#ffb35c', intensity: 2.6, distance: 3.5, offset: [0, 0.25, 0], flicker: true },
    build: (color) => {
      const wax = mat(color, { roughness: 0.6 })
      const parts: THREE.Object3D[] = []
      const points = heartShape().getSpacedPoints(22)
      points.pop()
      const flames: THREE.Mesh[] = []
      const flameMat = glow('#ffb347', 1.2, 2)
      points.forEach((p, i) => {
        const x = p.x * 1.4
        const z = -p.y * 1.4
        const h = 0.06 + (i % 3) * 0.02
        parts.push(cyl(0.028, 0.03, h, wax, x, 0, z, 12))
        parts.push(cyl(0.002, 0.002, 0.012, mat('#2b2b2b'), x, h, z, 4))
        const f = mesh(new THREE.SphereGeometry(0.012, 10, 8), flameMat, x, h + 0.02, z)
        f.castShadow = false
        flames.push(f)
        parts.push(f)
      })
      parts.push(animate(group(), (t) => {
        flames.forEach((f, i) => {
          const k = 1 + 0.25 * Math.sin(t * 13 + i * 1.7) + 0.15 * Math.sin(t * 23 + i * 3.1)
          f.scale.set(1, 1.7 * k, 1)
        })
      }))
      const petalGeo = new THREE.SphereGeometry(0.025, 8, 6)
      petalGeo.scale(1, 0.15, 0.7)
      const rand = seeded(7)
      const petals = Array.from({ length: 30 }, () => [rand(), rand(), rand()])
      parts.push(swarm(30, petalGeo, mat('#c8102e', { roughness: 0.7 }), (i, _t, d) => {
        const [a, r, s] = petals[i]!
        const ang = a * Math.PI * 2
        const rr = Math.sqrt(r) * 0.34
        d.position.set(Math.cos(ang) * rr, 0.005, Math.sin(ang) * rr * 0.8 - 0.03)
        d.rotation.y = s * 6
      }))
      return group(...parts)
    },
  },
  {
    type: 'vip-neon-heart',
    name: 'Neon heart',
    icon: 'i-lucide-heart-pulse',
    defaultColor: '#ff2d78',
    wallMounted: true,
    light: { color: '#ff5c9a', intensity: 2, distance: 3.5, offset: [0, 0, 0.35] },
    build: (color) => {
      const outer = heartShape().getSpacedPoints(80).map(p => v3(p.x * 0.85, p.y * 0.85, 0.06))
      const inner = heartShape().getSpacedPoints(60).map(p => v3(p.x * 0.6, p.y * 0.6 + 0.02, 0.06))
      const outerMat = glow(color, 1.2, 2.2)
      const innerMat = glow('#ffd1e3', 0.9, 1.8)
      const tubes = group(
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(outer, true), 160, 0.022, 10, true), outerMat),
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(inner, true), 120, 0.012, 8, true), innerMat),
      )
      const plate = box(0.95, 0.8, 0.015, mat('#1b1b24', { transparent: true, opacity: 0.3 }), 0, -0.4, 0.01)
      // Mounting studs at the corners
      for (const [x, y] of [[-0.42, 0.35], [0.42, 0.35], [-0.42, -0.35], [0.42, -0.35]] as const) plate.add(sphere(0.014, metal('#c0c0c0'), x, y, 0.012, 10))
      return group(plate, animate(tubes, (t) => {
        // A heartbeat: the tube brightens and swells a little with each beat
        const beat = heartbeat(t, 66)
        outerMat.emissiveIntensity *= 0.75 + 0.6 * beat
        innerMat.emissiveIntensity *= 0.85 + 0.3 * beat
        tubes.scale.setScalar(1 + 0.035 * beat)
      }))
    },
  },
  {
    type: 'vip-love-bear',
    name: 'Teddy bear',
    icon: 'i-lucide-heart-handshake',
    defaultColor: '#c98b5b',
    build: (color) => {
      const fur = mat(color, { roughness: 0.95 })
      const light = mat(new THREE.Color(color).offsetHSL(0, -0.1, 0.18).getStyle(), { roughness: 0.95 })
      const dark = mat('#2a1d18', { roughness: 0.3 })
      const ball = (r: number, m: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) => {
        const b = sphere(r, m, x, y, z)
        b.scale.set(sx, sy, sz)
        return b
      }
      const head = group(
        ball(0.13, fur, 0, 0, 0),
        ball(0.05, fur, -0.1, 0.11, -0.01, 1, 1, 0.6),
        ball(0.05, fur, 0.1, 0.11, -0.01, 1, 1, 0.6),
        ball(0.028, light, -0.1, 0.11, 0.01, 1, 1, 0.5),
        ball(0.028, light, 0.1, 0.11, 0.01, 1, 1, 0.5),
        ball(0.055, light, 0, -0.03, 0.1, 1.1, 0.85, 0.8),
        ball(0.02, dark, 0, -0.01, 0.145),
        ball(0.016, dark, -0.05, 0.04, 0.105),
        ball(0.016, dark, 0.05, 0.04, 0.105),
        ball(0.02, mat('#ff9fb4', { roughness: 0.9 }), -0.08, -0.02, 0.09, 1, 0.6, 0.4),
        ball(0.02, mat('#ff9fb4', { roughness: 0.9 }), 0.08, -0.02, 0.09, 1, 0.6, 0.4),
      )
      head.position.set(0, 0.43, 0.01)
      const love = heart(0.2, 0.07, shiny('#e0103a', { roughness: 0.3 }), 0, 0.22, 0.17)
      return group(
        ball(0.17, fur, 0, 0.18, 0, 1, 1.05, 0.9),
        ball(0.11, light, 0, 0.17, 0.09, 1, 1.1, 0.6),
        ball(0.07, fur, -0.1, 0.06, 0.1, 1, 0.8, 1.4),
        ball(0.07, fur, 0.1, 0.06, 0.1, 1, 0.8, 1.4),
        ball(0.04, light, -0.1, 0.06, 0.2, 1, 1, 0.4),
        ball(0.04, light, 0.1, 0.06, 0.2, 1, 1, 0.4),
        ball(0.06, fur, -0.14, 0.24, 0.1, 0.8, 1.4, 0.8),
        ball(0.06, fur, 0.14, 0.24, 0.1, 0.8, 1.4, 0.8),
        animate(head, (t) => {
          head.rotation.z = Math.sin(t * 0.8) * 0.12
          head.rotation.x = Math.sin(t * 0.5) * 0.05
        }),
        animate(love, (t) => {
          love.scale.setScalar((0.2 / 0.94) * (1 + 0.12 * heartbeat(t, 70)))
        }),
      )
    },
  },
])

// ======================================================================
// Birthday
// ======================================================================

const PARTY = ['#ff4d6d', '#ffb703', '#3a86ff', '#8338ec', '#06d6a0', '#ff8fab', '#fb5607']

const BIRTHDAY = premium('birthday', [
  {
    type: 'vip-birthday-cake',
    name: 'Birthday cake',
    icon: 'i-lucide-cake',
    defaultColor: '#ffd6e0',
    light: { color: '#ffb35c', intensity: 1.6, distance: 2.5, offset: [0, 0.55, 0], flicker: true },
    build: (color) => {
      const frosting = mat(color, { roughness: 0.55 })
      const cream = mat('#fff8f0', { roughness: 0.5 })
      const parts: THREE.Object3D[] = [
        // Stand
        cyl(0.05, 0.08, 0.1, metal('#e8e8ec', 0.2)),
        cyl(0.26, 0.26, 0.015, metal('#e8e8ec', 0.2), 0, 0.1),
        // Two tiers with cream between and a drip on top
        cyl(0.22, 0.22, 0.16, frosting, 0, 0.115),
        cyl(0.225, 0.225, 0.02, cream, 0, 0.255),
        cyl(0.15, 0.15, 0.13, frosting, 0, 0.275),
        cyl(0.155, 0.155, 0.02, cream, 0, 0.395),
      ]
      // Cream drips around each tier's edge
      for (const [r, y, n] of [[0.222, 0.27, 18], [0.152, 0.41, 13]] as const) {
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2
          const drip = sphere(0.018, cream, Math.cos(a) * r, y - 0.02 - (i % 3) * 0.012, Math.sin(a) * r, 8)
          drip.scale.set(1, 1.8, 0.6)
          parts.push(drip)
        }
      }
      // Sprinkles
      const rand = seeded(11)
      const sprinkles = Array.from({ length: 70 }, () => [rand(), rand(), rand(), rand()])
      const sg = new THREE.CapsuleGeometry(0.004, 0.014, 2, 4)
      parts.push(swarm(70, sg, mat('#ffffff', { roughness: 0.4 }), (i, _t, d) => {
        const [a, r, s, top] = sprinkles[i]!
        const ang = a * Math.PI * 2
        if (top > 0.4) d.position.set(Math.cos(ang) * Math.sqrt(r) * 0.13, 0.416, Math.sin(ang) * Math.sqrt(r) * 0.13)
        else d.position.set(Math.cos(ang) * 0.152, 0.29 + r * 0.09, Math.sin(ang) * 0.152)
        d.rotation.set(Math.PI / 2, s * 6, s * 3)
      }, PARTY))
      // Candles with flickering flames
      const flameMat = glow('#ffbe55', 1.4, 2)
      const flames: THREE.Mesh[] = []
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + 0.3
        const x = Math.cos(a) * 0.08
        const z = Math.sin(a) * 0.08
        parts.push(cyl(0.008, 0.008, 0.09, mat(PARTY[i]!, { roughness: 0.5 }), x, 0.415, z, 10))
        const f = mesh(new THREE.SphereGeometry(0.011, 10, 8), flameMat, x, 0.522, z)
        f.castShadow = false
        flames.push(f)
        parts.push(f)
      }
      parts.push(animate(group(), (t) => {
        flames.forEach((f, i) => f.scale.set(1, 1.8 * (1 + 0.22 * Math.sin(t * 14 + i * 2) + 0.12 * Math.sin(t * 27 + i)), 1))
      }))
      return group(...parts)
    },
  },
  {
    type: 'vip-balloon-bunch',
    name: 'Balloon bunch',
    icon: 'i-lucide-party-popper',
    defaultColor: '#ff4d6d',
    build: (color) => {
      const colors = [color, '#ffb703', '#3a86ff', '#8338ec', '#06d6a0', '#ff8fab', '#ffffff']
      const parts: THREE.Object3D[] = [
        cyl(0.07, 0.09, 0.1, metal(GOLD, 0.3)),
        sphere(0.03, metal(GOLD, 0.3), 0, 0.12, 0, 12),
      ]
      const spots: [number, number, number][] = [[0, 1.9, 0], [-0.28, 1.7, 0.08], [0.28, 1.72, -0.05], [-0.12, 1.55, -0.22], [0.14, 1.5, 0.22], [-0.34, 1.45, -0.12], [0.36, 1.4, 0.12]]
      spots.forEach(([x, y, z], i) => {
        const pivot = group()
        pivot.position.set(0, 0.13, 0)
        const r = 0.17 - (i % 3) * 0.015
        const b = balloon(colors[i % colors.length]!, r)
        b.position.set(x, y - 0.13, z)
        pivot.add(rod(v3(0, 0, 0), v3(x, y - 0.13 - r * 1.3, z), 0.0025, mat('#f2f2f2'), 0.0025, 4), b)
        parts.push(animate(pivot, (t) => {
          pivot.rotation.z = Math.sin(t * 0.7 + i * 1.3) * 0.045
          pivot.rotation.x = Math.cos(t * 0.55 + i * 0.9) * 0.04
          b.rotation.y = t * 0.2 + i
        }))
      })
      return group(...parts)
    },
  },
  {
    type: 'vip-gift-tower',
    name: 'Gift tower',
    icon: 'i-lucide-gift',
    defaultColor: '#3a86ff',
    build: (color) => {
      const ribbon = shiny('#ffd166', { roughness: 0.25 })
      const gift = (w: number, h: number, c: string, y: number, rot: number) => {
        const g = group(
          box(w, h, w, mat(c, { roughness: 0.45 })),
          box(w + 0.006, h + 0.004, 0.035, ribbon),
          box(0.035, h + 0.004, w + 0.006, ribbon),
        )
        g.position.y = y
        g.rotation.y = rot
        return g
      }
      // The top box's lid hops off now and then, with a burst of sparkles
      const lid = group(
        box(0.25, 0.05, 0.25, mat('#ff4d6d', { roughness: 0.45 })),
        box(0.256, 0.054, 0.035, ribbon),
        box(0.035, 0.054, 0.256, ribbon),
      )
      const bowL = mesh(new THREE.TorusGeometry(0.04, 0.012, 8, 20), ribbon, -0.035, 0.07, 0)
      const bowR = mesh(new THREE.TorusGeometry(0.04, 0.012, 8, 20), ribbon, 0.035, 0.07, 0)
      bowL.rotation.set(0, 0, 0.6)
      bowR.rotation.set(0, 0, -0.6)
      lid.add(bowL, bowR)
      const sparkle = loose(swarm(14, new THREE.OctahedronGeometry(0.012, 0), glow('#fff3b0', 1.5, 1.5), (i, t, d) => {
        const p = loop(t, 4)
        if (p < 0.08 || p > 0.55) return false
        const k = (p - 0.08) / 0.47
        const a = (i / 14) * Math.PI * 2
        d.position.set(Math.cos(a) * 0.25 * k, 0.75 + Math.sin(k * Math.PI) * 0.25 + k * 0.1, Math.sin(a) * 0.25 * k)
        d.rotation.set(t * 4, t * 3, 0)
        d.scale.setScalar(1 - k * 0.6)
      }))
      return group(
        gift(0.44, 0.3, color, 0, 0),
        gift(0.34, 0.22, '#8338ec', 0.3, 0.4),
        gift(0.24, 0.2, '#ffffff', 0.52, -0.2),
        animate(lid, (t) => {
          const p = loop(t, 4)
          const hop = p < 0.3 ? Math.sin((p / 0.3) * Math.PI) : 0
          lid.position.set(0, 0.72 + hop * 0.16, 0)
          lid.rotation.set(hop * 0.25, -0.2 + hop * 0.4, hop * -0.15)
        }),
        sparkle,
      )
    },
  },
  {
    type: 'vip-disco-ball',
    name: 'Disco ball',
    icon: 'i-lucide-disc-3',
    defaultColor: '#d8dde6',
    light: { color: '#c79bff', intensity: 2.2, distance: 4.5, offset: [0, 1.6, 0] },
    build: (color) => {
      // A floor stand holding the ball up; mirror tiles catch the room's light
      const pole = metal('#2e2f36', 0.35)
      const tilesGeo = new THREE.BoxGeometry(0.03, 0.03, 0.008)
      const rows = 14
      const spots: [number, number, number][] = []
      for (let r = 1; r < rows; r++) {
        const phi = (r / rows) * Math.PI
        const n = Math.max(6, Math.round(Math.sin(phi) * 28))
        for (let c = 0; c < n; c++) spots.push([phi, (c / n) * Math.PI * 2, (r * 31 + c * 17) % 7])
      }
      const ball = group(sphere(0.2, mat('#9aa0ad', { roughness: 0.5 }), 0, 0, 0, 24))
      const mirror = new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.18, emissive: '#1d1f2a', emissiveIntensity: 0.4 })
      const tiles = swarm(spots.length, tilesGeo, mirror, (i, _t, d) => {
        const [phi, theta] = spots[i]!
        d.position.setFromSphericalCoords(0.205, phi, theta)
        d.lookAt(0, 0, 0)
      })
      ball.add(tiles)
      // A few tiles flash in colour as it turns
      const flashMat = glow('#ffffff', 0.4, 2.2)
      const flash = swarm(18, tilesGeo, flashMat, (i, t, d) => {
        const [phi, theta] = spots[(i * 37) % spots.length]!
        d.position.setFromSphericalCoords(0.207, phi, theta)
        d.lookAt(0, 0, 0)
        d.scale.setScalar(0.5 + 0.5 * Math.max(0, Math.sin(t * 3 + i * 1.9)))
      }, PARTY)
      ball.add(flash)
      ball.position.y = 1.6
      return group(
        cyl(0.16, 0.18, 0.03, pole),
        cyl(0.012, 0.012, 1.38, pole, 0, 0.03),
        cyl(0.03, 0.012, 0.03, pole, 0, 1.38),
        animate(ball, (t) => {
          ball.rotation.y = t * 0.6
        }),
      )
    },
  },
  {
    type: 'vip-confetti-popper',
    name: 'Confetti popper',
    icon: 'i-lucide-party-popper',
    defaultColor: '#8338ec',
    build: (color) => {
      // A party popper that bursts every few seconds; confetti flutters down
      const popper = group(
        mesh(new THREE.ConeGeometry(0.09, 0.3, 24, 1, true), shiny(color, { side: THREE.DoubleSide }), 0, 0.15, 0),
      )
      const cone = popper.children[0] as THREE.Mesh
      cone.rotation.x = Math.PI
      // Stripes
      for (let i = 0; i < 3; i++) popper.add(mesh(new THREE.TorusGeometry(0.03 + i * 0.022, 0.006, 6, 24), mat('#ffd166'), 0, 0.06 + i * 0.07, 0))
      popper.children.slice(1).forEach(c => (c.rotation.x = Math.PI / 2))
      popper.rotation.z = -0.35
      popper.position.set(-0.1, 0.02, 0)
      const rand = seeded(23)
      const bits = Array.from({ length: 60 }, () => [rand(), rand(), rand(), rand()])
      const confettiGeo = new THREE.PlaneGeometry(0.03, 0.018)
      const confetti = loose(swarm(60, confettiGeo, mat('#ffffff', { side: THREE.DoubleSide, roughness: 0.6 }), (i, t, d) => {
        const [a, sp, s, delay] = bits[i]!
        const p = loop(t, 5) - delay * 0.08
        if (p <= 0) return false
        const time = p * 5
        // Out of the popper, up and away, then fluttering down to the floor
        const ang = a * Math.PI * 2
        const speed = 1.1 + sp * 1.1
        const vx = Math.cos(ang) * 0.35 + 0.25
        const vz = Math.sin(ang) * 0.35
        const drag = 1 - Math.exp(-time * 2.2)
        const x = -0.05 + (vx * drag) / 2.2 * speed + Math.sin(time * 6 + i) * 0.03 * time
        const z = (vz * drag) / 2.2 * speed + Math.cos(time * 5 + i) * 0.03 * time
        const y = Math.max(0.005, 0.32 + (speed * drag) / 2.2 * 1.4 - time * 0.42)
        d.position.set(x, y, z)
        if (y > 0.006) d.rotation.set(time * (6 + s * 6), time * (4 + s * 5), time * 3)
        else d.rotation.set(-Math.PI / 2, 0, s * 6)
        return p < 0.96
      }, PARTY))
      return group(animate(popper, (t) => {
        const p = loop(t, 5)
        // A little kick when it pops
        const kick = p < 0.06 ? Math.sin((p / 0.06) * Math.PI) : 0
        popper.scale.set(1 + kick * 0.08, 1 - kick * 0.12, 1 + kick * 0.08)
      }), confetti)
    },
  },
  {
    type: 'vip-birthday-bunting',
    name: 'Party bunting',
    icon: 'i-lucide-flag-triangle-right',
    defaultColor: '#ff4d6d',
    wallMounted: true,
    build: (color) => {
      const colors = [color, '#ffb703', '#3a86ff', '#06d6a0', '#8338ec', '#ff8fab']
      const parts: THREE.Object3D[] = []
      const flagGeo = new THREE.BufferGeometry().setFromPoints([v3(-0.065, 0, 0), v3(0.065, 0, 0), v3(0, -0.16, 0)])
      flagGeo.setIndex([0, 2, 1])
      flagGeo.computeVertexNormals()
      // Two sagging strings of flags, each flag swaying on its own
      for (const [row, width, sag, y] of [[0, 1.6, 0.16, 0], [1, 1.2, 0.12, -0.28]] as const) {
        const n = row === 0 ? 11 : 8
        const curve = (u: number) => v3(-width / 2 + u * width, y - Math.sin(u * Math.PI) * sag, 0.04)
        const pts = Array.from({ length: 24 }, (_, i) => curve(i / 23))
        parts.push(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.004, 4), mat('#f5f5f5')))
        for (let i = 0; i < n; i++) {
          const u = (i + 0.5) / n
          const flag = mesh(flagGeo, mat(colors[(i + row * 2) % colors.length]!, { side: THREE.DoubleSide, roughness: 0.8 }))
          flag.position.copy(curve(u))
          parts.push(animate(flag, (t) => {
            flag.rotation.x = Math.sin(t * 1.6 + i * 0.8 + row) * 0.18
          }))
        }
      }
      // Tacks at the ends
      for (const x of [-0.8, 0.8, -0.6, 0.6]) parts.push(sphere(0.012, metal(GOLD), x, Math.abs(x) > 0.7 ? 0 : -0.28, 0.02, 10))
      return group(...parts)
    },
  },
])

// ======================================================================
// Tết
// ======================================================================

const TET_WISHES = ['An Khang', 'Thịnh Vượng', 'Phát Tài', 'Vạn Sự Như Ý', 'Xuân An Lành', 'Phúc Lộc']

/** A red greeting card with a gold border and a New Year wish in gold */
function wishTexture(text: string) {
  return canvasTexture(128, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256)
    g.addColorStop(0, '#e3192b')
    g.addColorStop(1, '#a50d1c')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 256)
    ctx.strokeStyle = '#f6c453'
    ctx.lineWidth = 6
    ctx.strokeRect(8, 8, 112, 240)
    ctx.lineWidth = 2
    ctx.strokeRect(16, 16, 96, 224)
    ctx.fillStyle = '#ffd56b'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // One word per line, written top to bottom like a calligraphy scroll
    const words = text.split(' ')
    const size = words.length > 2 ? 30 : 36
    ctx.font = `bold ${size}px "Times New Roman", Georgia, serif`
    words.forEach((w, i) => ctx.fillText(w, 64, 128 + (i - (words.length - 1) / 2) * (size + 10)))
    // A small blossom at the top
    ctx.beginPath()
    ctx.arc(64, 34, 7, 0, Math.PI * 2)
    ctx.fill()
  })
}

/**
 * Cards and lì xì hanging from a tree, each swinging on its thread. Each
 * spot is where it hangs from (in the tree's space).
 */
function hangingWishes(spots: THREE.Vector3[], seed: number, withEnvelopes: boolean) {
  const out = group()
  const thread = mat('#ffcf4d')
  const back = shiny('#c8102e', { roughness: 0.35 })
  const goldMat = metal(GOLD, 0.3)
  const textures = new Map<string, THREE.Texture>()
  const rand = seeded(seed)
  spots.forEach((spot, i) => {
    const hang = group()
    hang.position.copy(spot)
    // Long threads so the cards hang below the flowers
    const len = 0.1 + rand() * 0.1
    hang.add(cyl(0.0015, 0.0015, len, thread, 0, -len, 0, 4))
    const envelope = withEnvelopes && i % 3 === 2
    let piece: THREE.Object3D
    if (envelope) {
      piece = box(0.055, 0.085, 0.006, back, 0, -len - 0.085, 0)
      piece.add(box(0.03, 0.03, 0.002, goldMat, 0, 0, 0.004))
    } else {
      const wish = TET_WISHES[i % TET_WISHES.length]!
      if (!textures.has(wish) && typeof document !== 'undefined') textures.set(wish, wishTexture(wish))
      const texture = textures.get(wish)
      const front = new THREE.MeshStandardMaterial({ color: '#ffffff', map: texture ?? null, roughness: 0.5 })
      piece = group(
        box(0.07, 0.13, 0.004, back, 0, -0.065, 0),
        mesh(new THREE.PlaneGeometry(0.066, 0.126), front, 0, -0.065, 0.0025),
        mesh(new THREE.PlaneGeometry(0.066, 0.126), front, 0, -0.065, -0.0025),
      )
      ;(piece.children[2] as THREE.Mesh).rotation.y = Math.PI
      piece.position.y = -len
      // A tassel under the card
      piece.add(cyl(0.004, 0.002, 0.03, mat('#ffcf4d'), 0, -0.16, 0, 6))
    }
    piece.scale.setScalar(1.5)
    piece.position.y = -len - (envelope ? 0.06 : 0)
    hang.add(piece)
    hang.rotation.y = rand() * Math.PI * 2
    const phase = rand() * 6
    out.add(animate(hang, (t) => {
      hang.rotation.z = Math.sin(t * 1.4 + phase) * 0.14
      hang.rotation.x = Math.sin(t * 1.1 + phase * 2) * 0.08
    }))
  })
  return out
}

/** A five-petal flower, slightly cupped, facing up */
function flowerGeometry(r: number) {
  const shape = new THREE.Shape()
  const n = 60
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const rr = r * (0.45 + 0.55 * Math.abs(Math.cos(a * 2.5)))
    if (i === 0) shape.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
    else shape.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
  }
  const g = new THREE.ShapeGeometry(shape, 1)
  g.rotateX(-Math.PI / 2)
  const pos = g.attributes.position!
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    pos.setY(i, ((x * x + z * z) / (r * r)) * r * 0.45)
  }
  g.computeVertexNormals()
  return g
}

interface Limb { from: THREE.Vector3; to: THREE.Vector3; r: number; depth: number }

/** A gnarled trunk that splits into spreading branches (seeded, so it's the same everywhere) */
function blossomBranches(seed: number) {
  const rand = seeded(seed)
  const out: Limb[] = []
  const grow = (from: THREE.Vector3, dir: THREE.Vector3, len: number, r: number, depth: number) => {
    // Each limb in two bends so it doesn't look like a straight stick
    const bend = dir.clone().add(v3((rand() - 0.5) * 0.5, 0, (rand() - 0.5) * 0.5)).normalize()
    const mid = from.clone().addScaledVector(dir, len * 0.5)
    const to = mid.clone().addScaledVector(bend, len * 0.5)
    out.push({ from, to: mid, r, depth }, { from: mid, to, r: r * 0.88, depth })
    if (depth === 0) return
    const kids = depth === 4 ? 2 : 3
    for (let k = 0; k < kids; k++) {
      // Spread evenly round the limb, a little random
      const a = (k / kids) * Math.PI * 2 + rand() * 1.2
      const out2 = depth >= 3 ? 0.75 : 1.05
      const d = v3(bend.x + Math.cos(a) * out2, Math.max(0.15, bend.y * 0.8 + (rand() - 0.2) * 0.35), bend.z + Math.sin(a) * out2).normalize()
      grow(to, d, len * (0.72 + rand() * 0.12), r * 0.66, depth - 1)
    }
  }
  grow(v3(0, 0, 0), v3(0.12, 1, 0.05).normalize(), 0.5, 0.05, 4)
  return out
}

/** A Tết blossom tree (peach or apricot) in a glazed pot: full of flowers, petals falling, cards and lì xì swinging */
function blossomTree(seed: number, opts: { petals: string[]; centre: string; pot: string; leaves?: boolean }) {
  const bark = mat('#3d2619', { roughness: 0.95 })
  const potH = 0.3
  const goldMat = metal(GOLD, 0.25)
  const parts: THREE.Object3D[] = [
    lathe([[0, 0], [0.15, 0], [0.17, 0.03], [0.24, 0.18], [0.25, potH - 0.03], [0.27, potH], [0.25, potH]], shiny(opts.pot, { roughness: 0.25 })),
    cyl(0.235, 0.235, 0.01, mat('#3b2a1e', { roughness: 1 }), 0, potH - 0.025),
  ]
  for (const [y, r] of [[potH - 0.004, 0.268], [0.1, 0.205]] as const) {
    const band = mesh(new THREE.TorusGeometry(r, 0.009, 8, 48), goldMat, 0, y, 0)
    band.rotation.x = Math.PI / 2
    parts.push(band)
  }
  const tree = group()
  tree.position.y = potH - 0.02
  const limbs = blossomBranches(seed)
  for (const b of limbs) tree.add(rod(b.from, b.to, b.r, bark, b.r * 0.85, 7))
  // A red ribbon tied round the trunk
  const bow = mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 24), shiny('#d0142c'), 0.02, 0.2, 0)
  bow.rotation.x = Math.PI / 2
  tree.add(bow)

  // Flowers in clusters all along the thinner branches
  const rand = seeded(seed + 1)
  const flowers: { p: THREE.Vector3; rot: number; tilt: number; size: number }[] = []
  const buds: THREE.Vector3[] = []
  const leafSpots: { p: THREE.Vector3; rot: number }[] = []
  for (const b of limbs) {
    if (b.depth > 3) continue
    const length = b.from.distanceTo(b.to)
    const clusters = Math.max(1, Math.round(length * [60, 40, 22, 8][b.depth]!))
    for (let c = 0; c < clusters; c++) {
      const at = b.from.clone().lerp(b.to, rand())
      const n = 3 + Math.floor(rand() * 3)
      for (let k = 0; k < n; k++) {
        flowers.push({ p: at.clone().add(v3((rand() - 0.5) * 0.09, (rand() - 0.3) * 0.07, (rand() - 0.5) * 0.09)), rot: rand() * 6.28, tilt: (rand() - 0.5) * 1.4, size: 0.85 + rand() * 0.55 })
      }
      if (rand() < 0.5) buds.push(at.clone().add(v3((rand() - 0.5) * 0.05, 0.02, (rand() - 0.5) * 0.05)))
      if (opts.leaves && rand() < 0.45) leafSpots.push({ p: at.clone(), rot: rand() * 6.28 })
    }
    // A bud at every tip
    if (b.depth === 0) buds.push(b.to.clone())
  }
  const petalMat = mat('#ffffff', { roughness: 0.55, side: THREE.DoubleSide })
  tree.add(swarm(flowers.length, flowerGeometry(0.036), petalMat, (i, _t, d) => {
    const f = flowers[i]!
    d.position.copy(f.p)
    d.rotation.set(f.tilt, f.rot, f.tilt * 0.6)
    d.scale.setScalar(f.size)
  }, opts.petals))
  // Stamens
  tree.add(swarm(flowers.length, new THREE.SphereGeometry(0.007, 6, 4), mat(opts.centre, { roughness: 0.5 }), (i, _t, d) => {
    const f = flowers[i]!
    d.position.copy(f.p)
    d.position.y += 0.012 * f.size
  }))
  tree.add(swarm(buds.length, new THREE.SphereGeometry(0.011, 8, 6), mat(opts.petals[0]!, { roughness: 0.5 }), (i, _t, d) => {
    d.position.copy(buds[i]!)
    d.scale.set(0.8, 1.2, 0.8)
  }))
  if (opts.leaves && leafSpots.length) {
    const leafGeo = new THREE.SphereGeometry(0.02, 8, 6)
    leafGeo.scale(0.5, 0.2, 1.4)
    tree.add(swarm(leafSpots.length, leafGeo, mat('#7cb342', { roughness: 0.7 }), (i, _t, d) => {
      const l = leafSpots[i]!
      d.position.copy(l.p)
      d.rotation.set(0.5, l.rot, 0)
    }))
  }

  // Petals drifting down around the pot
  const fall = seeded(seed + 2)
  const drops = Array.from({ length: 22 }, () => [fall(), fall(), fall()])
  const petalGeo = new THREE.CircleGeometry(0.012, 8)
  tree.add(loose(swarm(22, petalGeo, petalMat, (i, t, d) => {
    const [a, r, ph] = drops[i]!
    const p = loop(t, 8, ph * 8)
    const ang = a * Math.PI * 2
    d.position.set(Math.cos(ang) * (0.1 + r * 0.45) + Math.sin(t * 1.3 + i) * 0.07, 1.25 * (1 - p), Math.sin(ang) * (0.1 + r * 0.45) + Math.cos(t + i) * 0.05)
    d.rotation.set(t * 2 + i, t * 1.3, t * 1.7 + i)
    return p < 0.98
  }, opts.petals)))

  // Greeting cards and lì xì on the middle branches
  const hangFrom = limbs.filter(b => b.depth === 2).filter((_, i) => i % 2 === 1).slice(0, 10).map(b => b.from.clone().lerp(b.to, 0.7))
  tree.add(hangingWishes(hangFrom, seed + 3, true))

  parts.push(animate(tree, (t) => {
    tree.rotation.z = Math.sin(t * 0.6) * 0.008
    tree.rotation.x = Math.sin(t * 0.45) * 0.005
  }))
  return group(...parts)
}

const TET = premium('tet', [
  {
    type: 'vip-peach-blossom',
    name: 'Peach blossom tree',
    icon: 'i-lucide-flower-2',
    defaultColor: '#f7a1c0',
    attractsButterflies: true,
    build: color => blossomTree(41, { petals: [color, '#ffc2d6', '#f48fb1', '#fbd3e1'], centre: '#ffd54f', pot: '#7b1fa2' }),
  },
  {
    type: 'vip-apricot-blossom',
    name: 'Apricot blossom tree',
    icon: 'i-lucide-flower',
    defaultColor: '#ffcc1f',
    attractsButterflies: true,
    build: color => blossomTree(57, { petals: [color, '#ffd740', '#ffe57f', '#ffc400'], centre: '#e65100', pot: '#1d4e89', leaves: true }),
  },
  {
    type: 'vip-kumquat-tree',
    name: 'Kumquat tree',
    icon: 'i-lucide-citrus',
    defaultColor: '#ff9800',
    build: (color) => {
      const potH = 0.3
      const leaves = mat('#2e7d32', { roughness: 0.8, flatShading: true })
      const parts: THREE.Object3D[] = [
        lathe([[0, 0], [0.18, 0], [0.24, potH], [0.22, potH]], shiny('#b71c1c', { roughness: 0.3 })),
        mesh(new THREE.TorusGeometry(0.235, 0.012, 8, 40), metal(GOLD, 0.3), 0, potH - 0.01, 0),
        cyl(0.03, 0.04, 0.35, mat('#4a2f22', { roughness: 0.95 }), 0, potH),
      ]
      ;(parts[1] as THREE.Mesh).rotation.x = Math.PI / 2
      // A round canopy of leaf clumps
      const rand = seeded(5)
      const canopy: THREE.Vector3[] = []
      for (let i = 0; i < 90; i++) {
        const u = rand() * Math.PI * 2
        const v = Math.acos(2 * rand() - 1)
        const k = 0.35 + 0.65 * Math.cbrt(rand())
        canopy.push(v3(Math.sin(v) * Math.cos(u) * 0.36 * k, 0.95 + Math.cos(v) * 0.34 * k, Math.sin(v) * Math.sin(u) * 0.36 * k))
      }
      parts.push(swarm(canopy.length, new THREE.IcosahedronGeometry(0.12, 1), leaves, (i, _t, d) => {
        d.position.copy(canopy[i]!)
        d.rotation.set(i, i * 2, i * 3)
      }))
      // Kumquats on the outside of the canopy
      const fruits: THREE.Vector3[] = []
      for (let i = 0; i < 40; i++) {
        const u = rand() * Math.PI * 2
        const v = Math.acos(2 * rand() - 1) * 0.85
        fruits.push(v3(Math.sin(v) * Math.cos(u) * 0.45, 0.95 + Math.cos(v) * 0.42, Math.sin(v) * Math.sin(u) * 0.45))
      }
      parts.push(swarm(fruits.length, new THREE.SphereGeometry(0.03, 12, 10), shiny(color, { roughness: 0.35 }), (i, _t, d) => {
        d.position.copy(fruits[i]!)
        d.scale.set(1, 1.15, 1)
      }))
      // Greeting cards and lì xì hanging round the canopy
      const hangRand = seeded(6)
      const hangSpots: THREE.Vector3[] = []
      for (let i = 0; i < 8; i++) {
        const u = (i / 8) * Math.PI * 2 + hangRand() * 0.4
        hangSpots.push(v3(Math.cos(u) * 0.4, 0.82 + hangRand() * 0.28, Math.sin(u) * 0.4))
      }
      parts.push(hangingWishes(hangSpots, 8, true))
      return group(...parts)
    },
  },
  {
    type: 'vip-red-lanterns',
    name: 'Red lanterns',
    icon: 'i-lucide-lamp',
    defaultColor: '#e1121f',
    wallMounted: true,
    light: { color: '#ff6a3d', intensity: 2.6, distance: 4, offset: [0, -0.5, 0.4] },
    build: (color) => {
      const wood = mat('#3b2418', { roughness: 0.8 })
      const goldMat = metal(GOLD, 0.3)
      const parts: THREE.Object3D[] = [
        // A carved wall bracket holding a beam
        box(0.06, 0.16, 0.04, wood, -0.55, -0.1, 0.02),
        box(0.06, 0.16, 0.04, wood, 0.55, -0.1, 0.02),
        box(1.25, 0.04, 0.05, wood, 0, 0.02, 0.2),
        box(0.04, 0.04, 0.2, wood, -0.55, 0.02, 0.1),
        box(0.04, 0.04, 0.2, wood, 0.55, 0.02, 0.1),
      ]
      ;[[-0.38, 0.32, 1], [0, 0.42, 1.25], [0.38, 0.3, 0.95]].forEach(([x, drop, k], i) => {
        const shade = glow(color, 0.25, 1.7)
        const lantern = group(
          cyl(0.0025, 0.0025, drop!, mat('#2b1a12'), 0, -drop!, 0, 4),
        )
        const body = group()
        body.position.y = -drop! - 0.13 * k!
        const shell = mesh(new THREE.SphereGeometry(0.13, 24, 16), shade)
        shell.scale.set(k!, 0.9 * k!, k!)
        body.add(shell)
        // Ribs and gold caps
        for (let r = 0; r < 8; r++) {
          const rib = mesh(new THREE.TorusGeometry(0.13 * k!, 0.003, 4, 24, Math.PI), goldMat)
          rib.scale.y = 0.9
          rib.rotation.set(0, (r / 8) * Math.PI, Math.PI / 2)
          body.add(rib)
        }
        body.add(cyl(0.045 * k!, 0.05 * k!, 0.03, goldMat, 0, 0.105 * k!, 0, 16))
        body.add(cyl(0.05 * k!, 0.045 * k!, 0.03, goldMat, 0, -0.135 * k!, 0, 16))
        // Tassel
        const tassel = group(cyl(0.004, 0.004, 0.04, goldMat, 0, -0.18 * k!, 0, 4))
        for (let s = 0; s < 8; s++) {
          const a = (s / 8) * Math.PI * 2
          tassel.add(rod(v3(0, -0.18 * k!, 0), v3(Math.cos(a) * 0.012, -0.18 * k! - 0.13, Math.sin(a) * 0.012), 0.0025, mat('#ff2d2d'), 0.0015, 3))
        }
        body.add(tassel)
        lantern.add(body)
        lantern.position.set(x!, 0.02, 0.2)
        parts.push(animate(lantern, (t) => {
          lantern.rotation.z = Math.sin(t * 0.9 + i * 1.4) * 0.05
          lantern.rotation.x = Math.sin(t * 0.7 + i) * 0.035
          body.rotation.y = Math.sin(t * 0.4 + i) * 0.5
        }))
      })
      return group(...parts)
    },
  },
  {
    type: 'vip-firecrackers',
    name: 'Firecracker string',
    icon: 'i-lucide-zap',
    defaultColor: '#d0142c',
    wallMounted: true,
    build: (color) => {
      // A long string of firecrackers in a herringbone, swaying from a knot
      const red = shiny(color, { roughness: 0.35 })
      const goldMat = metal(GOLD, 0.3)
      const rope = group()
      rope.position.set(0, 0, 0.07)
      rope.add(cyl(0.006, 0.006, 1.1, mat('#8d1b1b'), 0, -1.1, 0, 6))
      for (let i = 0; i < 22; i++) {
        const y = -0.12 - i * 0.045
        for (const side of [-1, 1]) {
          const c = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.1, 10), red, side * 0.045, y, 0)
          c.rotation.z = side * 1.15
          c.add(mesh(new THREE.CylinderGeometry(0.0145, 0.0145, 0.012, 10), goldMat, 0, 0.044, 0))
          rope.add(c)
        }
      }
      // A big decorative knot at the top
      const knot = mesh(new THREE.TorusKnotGeometry(0.05, 0.012, 64, 8, 2, 3), shiny('#ffcc33', { roughness: 0.3 }), 0, -0.05, 0)
      rope.add(knot)
      rope.add(cyl(0.004, 0.004, 0.08, mat('#ffcc33'), 0, -0.02, 0, 4))
      return group(sphere(0.012, goldMat, 0, 0, 0.02, 10), animate(rope, (t) => {
        rope.rotation.z = Math.sin(t * 0.8) * 0.035
      }))
    },
  },
  {
    type: 'vip-five-fruit-tray',
    name: 'Five-fruit tray',
    icon: 'i-lucide-apple',
    defaultColor: '#b71c1c',
    build: (color) => {
      // Mâm ngũ quả, southern style: "cầu vừa đủ xài" — custard apples
      // (mãng cầu), a coconut (dừa), papayas (đu đủ), mangoes (xoài) and figs
      // (sung), stacked on a footed lacquer tray over green leaves
      const lacquer = shiny(color, { roughness: 0.22 })
      const goldMat = metal(GOLD, 0.25)
      const parts: THREE.Object3D[] = [
        lathe([[0, 0], [0.13, 0], [0.13, 0.015], [0.07, 0.04], [0.055, 0.1], [0.08, 0.13], [0.3, 0.15], [0.32, 0.18], [0.3, 0.18], [0, 0.16]], lacquer),
      ]
      for (const [y, r] of [[0.18, 0.31], [0.012, 0.13], [0.12, 0.075]] as const) {
        const band = mesh(new THREE.TorusGeometry(r, 0.008, 8, 48), goldMat, 0, y, 0)
        band.rotation.x = Math.PI / 2
        parts.push(band)
      }
      const top = 0.17
      // Leaves fanned out under the fruit, tips over the rim
      const leafGeo = new THREE.SphereGeometry(0.1, 12, 6)
      leafGeo.scale(0.38, 0.05, 1)
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2
        const leaf = mesh(leafGeo, mat(i % 2 ? '#2e7d32' : '#388e3c', { roughness: 0.6 }), Math.cos(a) * 0.24, top + 0.01, Math.sin(a) * 0.24)
        leaf.rotation.set(0.25, -a + Math.PI / 2, 0)
        leaf.rotation.order = 'YXZ'
        leaf.rotation.y = -a + Math.PI / 2
        parts.push(leaf)
      }
      /** Colour along an axis, from one end to the other (papaya, mango) */
      const tinted = (geo: THREE.BufferGeometry, axis: 'x' | 'y', stops: string[]) => {
        geo.computeBoundingBox()
        const bb = geo.boundingBox!
        const pos = geo.attributes.position!
        const cols = stops.map(c => new THREE.Color(c))
        const out = new Float32Array(pos.count * 3)
        const c = new THREE.Color()
        for (let i = 0; i < pos.count; i++) {
          const v = axis === 'x' ? pos.getX(i) : pos.getY(i)
          const lo = axis === 'x' ? bb.min.x : bb.min.y
          const hi = axis === 'x' ? bb.max.x : bb.max.y
          const f = THREE.MathUtils.clamp((v - lo) / (hi - lo), 0, 1) * (cols.length - 1)
          const k = Math.min(Math.floor(f), cols.length - 2)
          c.copy(cols[k]!).lerp(cols[k + 1]!, f - k)
          out.set([c.r, c.g, c.b], i * 3)
        }
        geo.setAttribute('color', new THREE.BufferAttribute(out, 3))
        return geo
      }
      const fruitMat = (rough = 0.45) => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: rough })

      // Mangoes round the bottom ring
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + 0.3
        const geo = tinted(new THREE.SphereGeometry(0.055, 20, 14), 'x', ['#8bc34a', '#ffd54f', '#ffb300'])
        geo.scale(1.45, 0.85, 0.95)
        const mango = mesh(geo, fruitMat(0.35), Math.cos(a) * 0.19, top + 0.05, Math.sin(a) * 0.19)
        mango.rotation.y = -a + Math.PI / 2
        mango.rotation.z = 0.15
        parts.push(mango)
      }
      // Papayas lying between them
      for (let i = 0; i < 2; i++) {
        const a = i * Math.PI + 1.0
        const geo = tinted(new THREE.LatheGeometry([[0, 0], [0.04, 0.02], [0.06, 0.08], [0.065, 0.13], [0.05, 0.18], [0.025, 0.21], [0, 0.215]].map(([r, h]) => new THREE.Vector2(r!, h!)), 20), 'y', ['#ff9800', '#ffb74d', '#9ccc65', '#558b2f'])
        const papaya = mesh(geo, fruitMat(0.4), Math.cos(a) * 0.12, top + 0.11, Math.sin(a) * 0.12)
        papaya.rotation.set(0, -a, Math.PI / 2 - 0.35)
        parts.push(papaya)
      }
      // Custard apples in the middle layer: knobbly green segments
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2
        const geo = new THREE.IcosahedronGeometry(0.06, 2)
        const pos = geo.attributes.position!
        for (let k = 0; k < pos.count; k++) {
          const v = v3(pos.getX(k), pos.getY(k), pos.getZ(k))
          const bump = 1 + 0.07 * Math.sin(v.x * 140) * Math.sin(v.y * 140) * Math.sin(v.z * 140)
          // A little heart-shaped: narrower at the bottom
          v.multiplyScalar(bump * (1 - Math.max(0, -v.y) * 1.5))
          pos.setXYZ(k, v.x, v.y, v.z)
        }
        geo.computeVertexNormals()
        parts.push(mesh(geo, mat('#a5c26b', { roughness: 0.8, flatShading: true }), Math.cos(a) * 0.08, top + 0.15, Math.sin(a) * 0.08))
        parts.push(cyl(0.005, 0.005, 0.02, mat('#5d4037'), Math.cos(a) * 0.08, top + 0.2, Math.sin(a) * 0.08, 5))
      }
      // A green coconut on top, with a red ribbon
      const coconutGeo = tinted(new THREE.SphereGeometry(0.095, 28, 20), 'y', ['#33691e', '#689f38', '#9ccc65'])
      coconutGeo.scale(1, 1.12, 1)
      const coconut = mesh(coconutGeo, fruitMat(0.5), 0, top + 0.29, 0)
      parts.push(coconut)
      parts.push(cyl(0.025, 0.035, 0.02, mat('#827717', { roughness: 0.8 }), 0, top + 0.39, 0, 10))
      const ribbon = mesh(new THREE.TorusGeometry(0.098, 0.008, 8, 40), shiny('#e53935'), 0, top + 0.27, 0)
      ribbon.rotation.x = Math.PI / 2
      parts.push(ribbon)
      const bowL = mesh(new THREE.TorusGeometry(0.025, 0.007, 8, 18), shiny('#e53935'), -0.02, top + 0.27, 0.1)
      const bowR = mesh(new THREE.TorusGeometry(0.025, 0.007, 8, 18), shiny('#e53935'), 0.02, top + 0.27, 0.1)
      bowL.rotation.z = 0.7
      bowR.rotation.z = -0.7
      parts.push(bowL, bowR)
      // Figs tucked into the gaps
      const rand = seeded(17)
      for (let i = 0; i < 14; i++) {
        const a = rand() * Math.PI * 2
        const r = 0.1 + rand() * 0.17
        parts.push(sphere(0.02, mat('#9ccc65', { roughness: 0.55 }), Math.cos(a) * r, top + 0.09 + rand() * 0.08, Math.sin(a) * r, 10))
      }
      return group(...parts)
    },
  },
])

// ======================================================================
// Wedding
// ======================================================================

/** Strokes of the letters L, O, V, E on a 0..1 grid per letter (x, y pairs) */
const LETTER_STROKES: Record<string, [number, number, number, number][]> = {
  L: [[0.15, 1, 0.15, 0], [0.15, 0, 0.85, 0]],
  O: [[0.15, 0.15, 0.15, 0.85], [0.15, 0.85, 0.5, 1], [0.5, 1, 0.85, 0.85], [0.85, 0.85, 0.85, 0.15], [0.85, 0.15, 0.5, 0], [0.5, 0, 0.15, 0.15]],
  V: [[0.1, 1, 0.5, 0], [0.5, 0, 0.9, 1]],
  E: [[0.15, 1, 0.15, 0], [0.15, 1, 0.85, 1], [0.15, 0.5, 0.7, 0.5], [0.15, 0, 0.85, 0]],
}

const WEDDING = premium('wedding', [
  {
    type: 'vip-wedding-cake',
    name: 'Wedding cake',
    icon: 'i-lucide-cake-slice',
    defaultColor: '#fffaf3',
    build: (color) => {
      const icing = mat(color, { roughness: 0.45 })
      const pearl = shiny('#fff8ec', { roughness: 0.15 })
      const cake = group()
      const tiers: [number, number, number][] = [[0.24, 0.18, 0], [0.18, 0.16, 0.18], [0.12, 0.14, 0.34]]
      for (const [r, h, y] of tiers) {
        cake.add(cyl(r, r, h, icing, 0, y, 0, 40))
        // Pearl borders top and bottom
        const n = Math.round(r * 120)
        cake.add(swarm(n * 2, new THREE.SphereGeometry(0.009, 8, 6), pearl, (i, _t, d) => {
          const a = ((i % n) / n) * Math.PI * 2
          d.position.set(Math.cos(a) * (r + 0.004), y + (i < n ? 0.01 : h - 0.004), Math.sin(a) * (r + 0.004))
        }))
        // A cascade of sugar roses
      }
      ;[[0.2, 0.12, 0.13], [0.24, 0.07, 0.05], [0.15, 0.27, 0.1], [0.13, 0.3, -0.06], [0.08, 0.43, 0.06], [0.0, 0.5, 0.0]].forEach(([x, y, z], i) => {
        cake.add(rose(i % 2 ? '#f9c6d3' : '#ffffff', 0.035, x!, y!, z!))
      })
      // Topper: two gold rings
      const ring = (x: number) => {
        const m = mesh(new THREE.TorusGeometry(0.035, 0.007, 10, 32), metal('#e9c46a', 0.15), x, 0.56, 0)
        m.rotation.y = x * 6
        return m
      }
      cake.add(ring(-0.022), ring(0.022))
      cake.position.y = 0.12
      return group(
        // A turning cake stand
        cyl(0.06, 0.1, 0.1, metal('#e8e8ec', 0.15)),
        cyl(0.29, 0.29, 0.02, metal('#e8e8ec', 0.15), 0, 0.1),
        animate(cake, (t) => {
          cake.rotation.y = t * 0.25
        }),
      )
    },
  },
  {
    type: 'vip-champagne-tower',
    name: 'Champagne tower',
    icon: 'i-lucide-wine',
    defaultColor: '#f3d27a',
    build: (color) => {
      // A classic coupe tower (4 x 4, 3 x 3, 2 x 2, 1) on a silver tray. A
      // bottle pours into the top glass; champagne spills over the rims and
      // runs down, glass to glass, to the bottom row
      const RIM = 0.056 // coupe rim radius
      const GLASS_H = 0.115 // foot to rim
      const STEP = GLASS_H - 0.006 // an upper glass's foot sits in the gap between four rims
      const BASE_Y = 0.035
      const parts: THREE.Object3D[] = [
        // Brushed silver tray (not a mirror, so it doesn't turn sky-blue)
        cyl(0.36, 0.38, 0.025, mat('#e4e6ea', { metalness: 0.45, roughness: 0.32 })),
        mesh(new THREE.TorusGeometry(0.37, 0.01, 8, 64), metal(GOLD, 0.25), 0, 0.028, 0),
      ]
      ;(parts[1] as THREE.Mesh).rotation.x = Math.PI / 2

      // Every glass: where its foot stands
      const glasses: { p: THREE.Vector3; level: number }[] = []
      for (let level = 0; level < 4; level++) {
        const n = 4 - level
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            glasses.push({ p: v3((i - (n - 1) / 2) * RIM * 2, BASE_Y + level * STEP, (j - (n - 1) / 2) * RIM * 2), level })
          }
        }
      }
      const at = (geo: THREE.BufferGeometry, material: THREE.Material, dy = 0) => {
        const g = swarm(glasses.length, geo, material, (i, _t, d) => {
          d.position.copy(glasses[i]!.p)
          d.position.y += dy
        })
        g.castShadow = false
        return g
      }
      const crystal = glass('#f7fbff', 0.38)
      const lip = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.02, clearcoat: 1, transparent: true, opacity: 0.75 })
      const wine = new THREE.MeshPhysicalMaterial({ color, roughness: 0.08, clearcoat: 1, transparent: true, opacity: 0.88, emissive: color, emissiveIntensity: 0.18 })
      const surface = new THREE.MeshStandardMaterial({ color: '#fff3c4', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.9, emissive: '#ffe08a', emissiveIntensity: 0.25 })
      // Foot, stem with a knop, shallow bowl, bright rim
      parts.push(at(new THREE.CylinderGeometry(0.03, 0.034, 0.004, 24), crystal, 0.002))
      parts.push(at(new THREE.CylinderGeometry(0.0035, 0.005, 0.06, 10), crystal, 0.034))
      parts.push(at(new THREE.SphereGeometry(0.008, 12, 8), crystal, 0.045))
      const bowl = new THREE.LatheGeometry([[0.004, 0], [0.025, 0.006], [0.045, 0.02], [0.054, 0.042], [RIM, 0.05], [RIM - 0.002, 0.05], [0.051, 0.04], [0.042, 0.02], [0.022, 0.008], [0.003, 0.005]].map(([r, h]) => new THREE.Vector2(r!, h!)), 32)
      parts.push(at(bowl, crystal, 0.065))
      parts.push(at(new THREE.TorusGeometry(RIM - 0.001, 0.0018, 6, 40).rotateX(Math.PI / 2), lip, 0.065 + 0.05))
      // Champagne filling each bowl to the brim, with its surface
      const fill = new THREE.LatheGeometry([[0, 0.006], [0.021, 0.009], [0.04, 0.021], [0.05, 0.04], [0.053, 0.047], [0, 0.047]].map(([r, h]) => new THREE.Vector2(r!, h!)), 28)
      parts.push(at(fill, wine, 0.065))
      parts.push(at(new THREE.CircleGeometry(0.053, 28).rotateX(-Math.PI / 2), surface, 0.065 + 0.0475))

      // Bubbles rising in every glass
      parts.push(swarm(glasses.length * 3, new THREE.SphereGeometry(0.0028, 6, 4), glow('#fffbe6', 0.9, 1), (i, t, d) => {
        const g = glasses[i % glasses.length]!.p
        const k = Math.floor(i / glasses.length)
        const p = loop(t, 1.4, k * 0.47 + (i % 7) * 0.11)
        const a = i * 2.3
        d.position.set(g.x + Math.cos(a) * 0.02, g.y + 0.075 + p * 0.035, g.z + Math.sin(a) * 0.02)
        d.scale.setScalar(Math.sin(p * Math.PI) * 1.2)
      }))

      // Overflow: from the four corners of each upper glass's rim, a thin
      // stream and drops run down into the glass below
      const spills: { from: THREE.Vector3; to: THREE.Vector3 }[] = []
      for (const g of glasses) {
        if (g.level === 0) continue
        const rimY = g.p.y + 0.065 + 0.05
        for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]] as const) {
          const from = v3(g.p.x + dx * RIM * 0.72, rimY, g.p.z + dz * RIM * 0.72)
          const to = v3(g.p.x + dx * RIM, rimY - STEP + 0.005, g.p.z + dz * RIM)
          spills.push({ from, to })
        }
      }
      const streamMat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.55, emissive: color, emissiveIntensity: 0.3, depthWrite: false })
      const streams = swarm(spills.length, new THREE.CylinderGeometry(0.0022, 0.0028, 1, 6), streamMat, (i, t, d) => {
        const { from, to } = spills[i]!
        d.position.copy(from).lerp(to, 0.5)
        d.position.x += (to.x - from.x) * 0.15
        d.position.z += (to.z - from.z) * 0.15
        d.quaternion.setFromUnitVectors(v3(0, 1, 0), from.clone().sub(to).normalize())
        const wobble = 0.8 + 0.35 * Math.sin(t * 14 + i * 1.7)
        d.scale.set(wobble, from.distanceTo(to), wobble)
      })
      parts.push(streams)
      parts.push(swarm(spills.length * 3, new THREE.SphereGeometry(0.004, 6, 4), streamMat, (i, t, d) => {
        const { from, to } = spills[i % spills.length]!
        const p = loop(t, 0.6, Math.floor(i / spills.length) * 0.2 + (i % 5) * 0.07)
        // Out over the rim, then falling (eased) to the glass below
        d.position.copy(from).lerp(to, p * p)
        d.position.x += (to.x - from.x) * Math.sin(p * Math.PI) * 0.2
        d.position.z += (to.z - from.z) * Math.sin(p * Math.PI) * 0.2
        d.scale.set(1, 1.6, 1)
      }))

      // The bottle, held above the top glass and tilted to pour
      const topRim = BASE_Y + 3 * STEP + 0.065 + 0.05
      const bottleGlass = shiny('#16391f', { roughness: 0.12 })
      const foil = metal('#e2b84f', 0.3)
      const L = 0.3
      // Built neck-down from the tip (origin) back to the base (-y)
      const body = group(
        lathe([[0.0, 0], [0.012, 0], [0.0135, -0.008], [0.013, -0.05], [0.02, -0.09], [0.036, -0.13], [0.04, -0.16], [0.04, -L + 0.01], [0.034, -L], [0, -L + 0.02]], bottleGlass, 0, 28),
        lathe([[0.0, -0.002], [0.0145, -0.002], [0.0145, -0.07], [0.021, -0.095], [0, -0.095]], foil, 0, 24),
        lathe([[0.0, -0.17], [0.0405, -0.17], [0.0405, -0.235], [0, -0.235]], mat('#f5ead2', { roughness: 0.55 }), 0, 28),
        lathe([[0.0, -0.172], [0.041, -0.172], [0.041, -0.18], [0, -0.18]], foil, 0, 28),
      )
      const bottle = group(body)
      const tip = v3(0.012, topRim + 0.085, 0)
      bottle.position.copy(tip)
      // Base up and to the side: the neck points down into the glass
      const toBase = v3(Math.cos(0.62), Math.sin(0.62), 0.12).normalize()
      body.quaternion.setFromUnitVectors(v3(0, -1, 0), toBase)
      parts.push(animate(bottle, (t) => {
        // A gentle pour: tips in a little more, then back
        bottle.rotation.z = Math.sin(t * 0.9) * 0.05
      }))
      // The pour: a stream from the tip into the top glass, drops along it
      const pourTop = tip.clone().add(v3(0, -0.004, 0))
      const pourBottom = v3(0.004, topRim - 0.002, 0)
      const pour = mesh(new THREE.CylinderGeometry(0.003, 0.0045, pourTop.distanceTo(pourBottom), 8), streamMat)
      pour.position.copy(pourTop).lerp(pourBottom, 0.5)
      pour.castShadow = false
      parts.push(animate(pour, (t) => {
        const w = 0.85 + 0.3 * Math.sin(t * 16)
        pour.scale.set(w, 1, w)
      }))
      parts.push(swarm(6, new THREE.SphereGeometry(0.005, 6, 4), streamMat, (i, t, d) => {
        const p = loop(t, 0.45, i / 6)
        d.position.copy(pourTop).lerp(pourBottom, p * p)
        d.scale.set(1, 1.8, 1)
      }))
      // Splash ring where it lands
      const splash = mesh(new THREE.TorusGeometry(0.012, 0.0018, 6, 24).rotateX(Math.PI / 2), streamMat, pourBottom.x, topRim - 0.001, 0)
      splash.castShadow = false
      parts.push(animate(splash, (t) => {
        splash.scale.setScalar(0.6 + loop(t, 0.5) * 1.6)
      }))
      return group(...parts)
    },
  },
  {
    type: 'vip-wedding-arch',
    name: 'Wedding arch',
    icon: 'i-lucide-door-open',
    defaultColor: '#ffffff',
    attractsButterflies: true,
    build: (color) => {
      const frame = mat('#f3eee6', { roughness: 0.5 })
      const parts: THREE.Object3D[] = [
        cyl(0.035, 0.035, 2.1, frame, -0.85, 0, 0),
        cyl(0.035, 0.035, 2.1, frame, 0.85, 0, 0),
        box(1.82, 0.06, 0.08, frame, 0, 2.08, 0),
        box(0.22, 0.04, 0.22, frame, -0.85, 0, 0),
        box(0.22, 0.04, 0.22, frame, 0.85, 0, 0),
      ]
      // Sheer drapes that move in a breeze
      const drapeMat = new THREE.MeshStandardMaterial({ color, roughness: 0.9, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })
      for (const side of [-1, 1]) {
        const geo = new THREE.PlaneGeometry(0.5, 2.05, 10, 24)
        const base = Float32Array.from(geo.attributes.position!.array)
        const drape = mesh(geo, drapeMat, side * 0.62, 1.04, 0.05)
        drape.castShadow = false
        parts.push(animate(drape, (t) => {
          const pos = geo.attributes.position!
          for (let i = 0; i < pos.count; i++) {
            const x = base[i * 3]!
            const y = base[i * 3 + 1]!
            const hang = (1.025 - y) / 2.05 // 0 at the top, 1 at the bottom
            // Gathered at the top, swept to the side in the middle
            const gather = Math.sin((x + 0.25) * 25) * 0.025 * (0.4 + hang)
            pos.setXYZ(i, x * (1 - 0.35 * Math.sin(hang * Math.PI)) - side * 0.06 * Math.sin(hang * Math.PI), y, gather + Math.sin(t * 1.4 + y * 2 + x * 4) * 0.03 * hang)
          }
          pos.needsUpdate = true
          geo.computeVertexNormals()
        }))
      }
      // Bridal florals: a lush cluster of detailed roses on the top left
      // that spills along the beam and down the post, a smaller one on the
      // right, with rose leaves, eucalyptus sprigs and baby's breath
      const rand = seeded(83)
      // Ivory and champagne rather than pure white, so they stand out on a pale wall
      const whites = ['#fff6ea', '#fbead6', '#f6e1cf', '#fffaf3']
      const blush = ['#f4b6c6', '#ec9fb3', '#f8cdd8', '#e48aa2']
      const bloomSpots: RoseSpot[] = []
      const leafSpots: { p: THREE.Vector3; n: THREE.Vector3; spin: number; size: number }[] = []
      const sprigSpots: { p: THREE.Vector3; n: THREE.Vector3; spin: number }[] = []
      const breath: THREE.Vector3[] = []
      const budSpots: THREE.Vector3[] = []
      /** Flowers in an oval round (cx, cy), thick in the middle and thinning out */
      const cluster = (cx: number, cy: number, rx: number, ry: number, count: number) => {
        for (let i = 0; i < count; i++) {
          const a = rand() * Math.PI * 2
          const r = Math.sqrt(rand())
          const x = cx + Math.cos(a) * rx * r
          const y = cy + Math.sin(a) * ry * r
          const front = rand() < 0.78
          const z = front ? 0.05 + (1 - r) * 0.07 + rand() * 0.03 : -0.05 - rand() * 0.05
          const n = v3(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.6 + 0.15, front ? 1 : -1).normalize()
          const big = 1 - r * 0.45
          bloomSpots.push({ p: v3(x, y, z), n, size: (0.045 + rand() * 0.028) * big, color: rand() < 0.5 ? blush[Math.floor(rand() * blush.length)]! : whites[Math.floor(rand() * whites.length)]!, open: 0.6 + rand() * 0.4 })
          for (let l = 0; l < 2; l++) leafSpots.push({ p: v3(x + (rand() - 0.5) * 0.1, y + (rand() - 0.5) * 0.08, z - 0.02), n: v3(rand() - 0.5, rand() - 0.2, (front ? 1 : -1) * rand()).normalize(), spin: rand() * 6.28, size: 0.055 + rand() * 0.03 })
          if (rand() < 0.5) sprigSpots.push({ p: v3(x + (rand() - 0.5) * 0.14, y + (rand() - 0.5) * 0.1, z - 0.03), n: v3(Math.cos(a), Math.sin(a), 0.3).normalize(), spin: rand() * 6.28 })
          for (let k = 0; k < 3; k++) breath.push(v3(x + (rand() - 0.5) * 0.12, y + (rand() - 0.5) * 0.1, z + 0.02 + rand() * 0.03))
          if (rand() < 0.25) budSpots.push(v3(x + (rand() - 0.5) * 0.1, y + rand() * 0.06, z + 0.01))
        }
      }
      // Left: the main cluster at the corner, a trail along the beam and down the post
      cluster(-0.78, 2.1, 0.26, 0.17, 30)
      cluster(-0.42, 2.13, 0.2, 0.09, 12)
      cluster(-0.85, 1.82, 0.1, 0.2, 11)
      cluster(-0.85, 1.55, 0.07, 0.14, 5)
      // Right: smaller, balancing it
      cluster(0.8, 2.1, 0.18, 0.13, 16)
      cluster(0.55, 2.13, 0.12, 0.07, 6)
      cluster(0.85, 1.9, 0.07, 0.12, 5)
      parts.push(roses(bloomSpots))
      parts.push(swarm(leafSpots.length, roseLeafGeometry(1), mat('#4f7a45', { roughness: 0.55, side: THREE.DoubleSide }), (i, _t, d) => {
        const l = leafSpots[i]!
        d.position.copy(l.p)
        d.quaternion.setFromUnitVectors(v3(0, 1, 0), l.n)
        d.rotateY(l.spin)
        d.scale.setScalar(l.size)
      }, ['#4f7a45', '#5d8a50', '#3f6b3a']))
      // Eucalyptus: round silver-green leaves along a sprig
      const sprigLeaves: { p: THREE.Vector3; q: THREE.Quaternion; s: number }[] = []
      for (const sp of sprigSpots) {
        for (let k = 0; k < 5; k++) {
          const p = sp.p.clone().addScaledVector(sp.n, k * 0.025)
          p.y += (k % 2 ? 1 : -1) * 0.012
          const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2 + (rand() - 0.5) * 0.6, sp.spin + k, 0))
          sprigLeaves.push({ p, q, s: 1 - k * 0.12 })
        }
      }
      parts.push(swarm(sprigLeaves.length, new THREE.CircleGeometry(0.014, 10), mat('#9db8a4', { roughness: 0.7, side: THREE.DoubleSide }), (i, _t, d) => {
        const l = sprigLeaves[i]!
        d.position.copy(l.p)
        d.quaternion.copy(l.q)
        d.scale.setScalar(l.s)
      }))
      parts.push(swarm(breath.length, new THREE.SphereGeometry(0.005, 6, 4), mat('#ffffff', { roughness: 0.6 }), (i, _t, d) => {
        d.position.copy(breath[i]!)
      }))
      parts.push(swarm(budSpots.length, new THREE.SphereGeometry(0.012, 10, 8), mat('#f6dfe3', { roughness: 0.5 }), (i, _t, d) => {
        d.position.copy(budSpots[i]!)
        d.scale.set(0.85, 1.35, 0.85)
      }))
      // Fairy lights twinkling across the top
      const bulbs: THREE.Vector3[] = []
      for (let i = 0; i < 26; i++) {
        const u = i / 25
        bulbs.push(v3(-0.85 + u * 1.7, 2.02 - Math.sin(u * Math.PI) * 0.12 - (i % 2) * 0.02, 0.07))
      }
      parts.push(swarm(bulbs.length, new THREE.SphereGeometry(0.012, 8, 6), glow('#fff1c1', 0.6, 2.6), (i, t, d) => {
        d.position.copy(bulbs[i]!)
        d.scale.setScalar(0.7 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2.4 + i * 1.7)))
      }))
      return group(...parts)
    },
  },
  {
    type: 'vip-love-marquee',
    name: 'LOVE marquee letters',
    icon: 'i-lucide-type',
    defaultColor: '#f4f1ea',
    light: { color: '#ffd89b', intensity: 2.4, distance: 4, offset: [0, 0.4, 0.3] },
    build: (color) => {
      const face = glow(color, 0.12, 0.5)
      face.roughness = 0.5
      const side = metal('#c9a14a', 0.35)
      const H = 0.62
      const W = 0.42
      const parts: THREE.Object3D[] = []
      const bulbs: THREE.Vector3[] = []
      'LOVE'.split('').forEach((ch, li) => {
        const ox = (li - 1.5) * (W + 0.06)
        for (const [x1, y1, x2, y2] of LETTER_STROKES[ch]!) {
          const a = v3(ox - W / 2 + x1 * W, y1 * H + 0.02, 0)
          const b = v3(ox - W / 2 + x2 * W, y2 * H + 0.02, 0)
          const len = a.distanceTo(b)
          const stroke = mesh(new THREE.BoxGeometry(len + 0.07, 0.07, 0.08), face)
          stroke.position.copy(a).add(b).multiplyScalar(0.5)
          stroke.rotation.z = Math.atan2(b.y - a.y, b.x - a.x)
          stroke.add(mesh(new THREE.BoxGeometry(len + 0.075, 0.075, 0.06), side, 0, 0, -0.012))
          parts.push(stroke)
          const n = Math.max(2, Math.round(len / 0.07))
          for (let k = 0; k <= n; k++) bulbs.push(a.clone().lerp(b, k / n).setZ(0.045))
        }
      })
      // Bulbs chase along the letters
      parts.push(swarm(bulbs.length, new THREE.SphereGeometry(0.02, 10, 8), glow('#ffe6a8', 1.3, 2.4), (i, t, d) => {
        d.position.copy(bulbs[i]!)
        d.scale.setScalar(0.65 + 0.45 * (Math.sin(t * 5 - i * 0.6) > 0.3 ? 1 : 0.35))
      }))
      return group(...parts)
    },
  },
  {
    type: 'vip-candle-lanterns',
    name: 'Candle lanterns',
    icon: 'i-lucide-lamp-desk',
    defaultColor: '#2f2b28',
    light: { color: '#ffb35c', intensity: 2.2, distance: 3.5, offset: [0, 0.35, 0], flicker: true },
    build: (color) => {
      const frame = metal(color, 0.45)
      const panes = glass('#fff6e5', 0.25)
      const flameMat = glow('#ffb347', 1.3, 2)
      const flames: THREE.Mesh[] = []
      const lantern = (x: number, z: number, s: number) => {
        const g = group(
          box(0.2, 0.02, 0.2, frame),
          box(0.17, 0.3, 0.17, panes, 0, 0.02),
          box(0.22, 0.03, 0.22, frame, 0, 0.32),
          mesh(new THREE.ConeGeometry(0.15, 0.1, 4), frame, 0, 0.4, 0),
          mesh(new THREE.TorusGeometry(0.035, 0.006, 6, 18), frame, 0, 0.48, 0),
          cyl(0.035, 0.035, 0.1, mat('#fff3e0', { roughness: 0.6 }), 0, 0.02),
        )
        ;(g.children[3] as THREE.Mesh).rotation.y = Math.PI / 4
        for (const [cx, cz] of [[-0.09, -0.09], [0.09, -0.09], [-0.09, 0.09], [0.09, 0.09]]) g.add(box(0.012, 0.3, 0.012, frame, cx!, 0.02, cz!))
        const f = mesh(new THREE.SphereGeometry(0.014, 10, 8), flameMat, 0, 0.14, 0)
        f.castShadow = false
        flames.push(f)
        g.add(f)
        g.position.set(x, 0, z)
        g.scale.setScalar(s)
        return g
      }
      const petals = new THREE.SphereGeometry(0.02, 8, 6)
      petals.scale(1, 0.15, 0.7)
      const rand = seeded(31)
      const scatter = Array.from({ length: 14 }, () => [rand(), rand()])
      return group(
        lantern(-0.14, 0, 1.2),
        lantern(0.16, 0.08, 0.85),
        animate(group(), (t) => {
          flames.forEach((f, i) => f.scale.set(1, 1.7 * (1 + 0.22 * Math.sin(t * 12 + i * 2.2) + 0.12 * Math.sin(t * 25 + i)), 1))
        }),
        swarm(14, petals, mat('#f4f1ea', { roughness: 0.7 }), (i, _t, d) => {
          const [a, r] = scatter[i]!
          d.position.set(Math.cos(a * 6.28) * (0.2 + r * 0.15), 0.004, Math.sin(a * 6.28) * (0.12 + r * 0.12) + 0.05)
          d.rotation.y = a * 9
        }),
      )
    },
  },
  {
    type: 'vip-sparkler-fountain',
    name: 'Sparkler fountain',
    icon: 'i-lucide-sparkles',
    defaultColor: '#ffd36b',
    light: { color: '#ffd27a', intensity: 3, distance: 4, offset: [0, 0.5, 0], flicker: true },
    build: (color) => {
      const base = group(
        cyl(0.13, 0.15, 0.16, shiny('#f4f1ea', { roughness: 0.3 })),
        mesh(new THREE.TorusGeometry(0.135, 0.012, 8, 32), metal(GOLD, 0.25), 0, 0.16, 0),
        cyl(0.025, 0.035, 0.03, metal('#555'), 0, 0.16),
      )
      ;(base.children[1] as THREE.Mesh).rotation.x = Math.PI / 2
      // Sparks shoot up and fall in a fountain
      const rand = seeded(13)
      const sparks = Array.from({ length: 90 }, () => [rand(), rand(), rand()])
      const sparkGeo = new THREE.SphereGeometry(0.009, 6, 4)
      sparkGeo.scale(1, 3, 1)
      const fountain = swarm(90, sparkGeo, glow(color, 2.2, 2), (i, t, d) => {
        const [a, sp, ph] = sparks[i]!
        const life = 1.1
        const p = loop(t, life, ph * life)
        const time = p * life
        const ang = a * Math.PI * 2
        const vy = 1.6 + sp * 0.9
        const vr = 0.18 + sp * 0.25
        const y = 0.19 + vy * time - 2.2 * time * time
        if (y < 0.16) return false
        d.position.set(Math.cos(ang) * vr * time, y, Math.sin(ang) * vr * time)
        // Stretched along the way it moves
        const vyNow = vy - 4.4 * time
        d.rotation.set(0, -ang, Math.atan2(vr, vyNow) * 0.8)
        d.scale.setScalar(1 - p * 0.7)
      })
      return group(base, fountain)
    },
  },
])

// ======================================================================
// Galaxy
// ======================================================================

/** Vertical colour bands on a sphere (a gas giant) */
function bandedSphere(r: number, colors: string[], seed: number) {
  const geo = new THREE.SphereGeometry(r, 48, 32)
  const pos = geo.attributes.position!
  const rand = seeded(seed)
  const offsets = colors.map(() => rand() * 0.2)
  const palette = colors.map(c => new THREE.Color(c))
  const out = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / r
    const band = THREE.MathUtils.clamp(y * 0.5 + 0.5, 0, 1) * (palette.length - 1)
    const k = Math.min(Math.floor(band), palette.length - 1)
    const f = band - k + Math.sin(y * 40 + pos.getX(i) * 6) * 0.06 + offsets[k]!
    c.copy(palette[k]!).lerp(palette[Math.min(k + 1, palette.length - 1)]!, THREE.MathUtils.clamp(f, 0, 1))
    out.set([c.r, c.g, c.b], i * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(out, 3))
  return geo
}

const GALAXY = premium('galaxy', [
  {
    type: 'vip-floating-planet',
    name: 'Floating planet',
    icon: 'i-lucide-orbit',
    defaultColor: '#9b7bff',
    light: { color: '#a98bff', intensity: 1.8, distance: 3.5, offset: [0, 0.7, 0] },
    build: (color) => {
      const base = group(
        cyl(0.2, 0.24, 0.06, mat('#1c1b2e', { roughness: 0.4, metalness: 0.4 })),
        cyl(0.17, 0.17, 0.012, glow(color, 0.8, 1.8), 0, 0.06),
      )
      const planet = group()
      planet.position.y = 0.72
      const body = mesh(bandedSphere(0.2, ['#3b2a6b', '#7a5cff', '#f0b8ff', '#ffd6a5', '#9b7bff', '#2b1f55'], 3), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.65 }))
      planet.add(body)
      const ring = mesh(new THREE.RingGeometry(0.27, 0.42, 72), new THREE.MeshStandardMaterial({ color: '#ffe3c2', roughness: 0.5, transparent: true, opacity: 0.75, side: THREE.DoubleSide }))
      ring.rotation.x = -Math.PI / 2 + 0.35
      ring.castShadow = false
      planet.add(ring)
      // Two moons in orbit
      const moonA = sphere(0.035, mat('#d9d4ff', { roughness: 0.8 }), 0, 0, 0, 14)
      const moonB = sphere(0.024, glow('#7ee8ff', 0.6, 1.6), 0, 0, 0, 12)
      planet.add(moonA, moonB)
      loose(moonA)
      loose(moonB)
      return group(base, animate(planet, (t) => {
        planet.position.y = 0.72 + Math.sin(t * 0.9) * 0.04
        body.rotation.y = t * 0.3
        ring.rotation.z = t * 0.05
        moonA.position.set(Math.cos(t * 0.8) * 0.5, Math.sin(t * 0.8) * 0.08, Math.sin(t * 0.8) * 0.5)
        moonB.position.set(Math.cos(-t * 1.3 + 2) * 0.33, 0.15 + Math.sin(t * 1.3) * 0.05, Math.sin(-t * 1.3 + 2) * 0.33)
      }))
    },
  },
  {
    type: 'vip-jellyfish-lamp',
    name: 'Jellyfish lamp',
    icon: 'i-lucide-sparkle',
    defaultColor: '#6ee7ff',
    light: { color: '#7ee8ff', intensity: 2, distance: 3.5, offset: [0, 1.1, 0] },
    build: (color) => {
      const bellMat = new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.2, transmission: 0.5, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
      bellMat.userData.glow = true
      bellMat.userData.baseGlow = 0.5
      bellMat.userData.nightGlow = 1.6
      const jelly = group()
      const bell = mesh(new THREE.SphereGeometry(0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), bellMat)
      jelly.add(bell)
      jelly.add(sphere(0.07, glow('#ffffff', 0.8, 1.6), 0, 0.03, 0, 16))
      // Tentacles: chains of small segments that wave
      const tentacles: THREE.Mesh[][] = []
      const tentMat = glow(color, 0.5, 1.4)
      for (let k = 0; k < 9; k++) {
        const a = (k / 9) * Math.PI * 2
        const chain: THREE.Mesh[] = []
        for (let s = 0; s < 10; s++) {
          const seg = mesh(new THREE.SphereGeometry(0.008 - s * 0.0004, 6, 4), tentMat)
          seg.castShadow = false
          seg.userData.base = [Math.cos(a) * 0.12, Math.sin(a) * 0.12]
          chain.push(seg)
          jelly.add(seg)
        }
        tentacles.push(chain)
      }
      jelly.position.y = 1.1
      return group(
        // A slim glass stand with a glowing foot
        cyl(0.16, 0.18, 0.04, mat('#15151f', { roughness: 0.4, metalness: 0.5 })),
        cyl(0.008, 0.008, 0.85, glass('#dff7ff', 0.4), 0, 0.04, 0, 8),
        animate(jelly, (t) => {
          const pulse = Math.max(0, Math.sin(t * 2.2))
          jelly.position.y = 1.1 + Math.sin(t * 1.1) * 0.06
          bell.scale.set(1 + pulse * 0.08, 1 - pulse * 0.1, 1 + pulse * 0.08)
          tentacles.forEach((chain, k) => {
            chain.forEach((seg, s) => {
              const [bx, bz] = seg.userData.base as [number, number]
              const sway = Math.sin(t * 2 - s * 0.6 + k) * 0.015 * s
              seg.position.set(bx * (1 - s * 0.04) + sway, -0.02 - s * 0.045, bz * (1 - s * 0.04) + Math.cos(t * 1.7 - s * 0.5 + k) * 0.01 * s)
            })
          })
        }),
      )
    },
  },
  {
    type: 'vip-snow-globe',
    name: 'Snow globe',
    icon: 'i-lucide-snowflake',
    defaultColor: '#7a4b2a',
    build: (color) => {
      const wood = mat(color, { roughness: 0.6 })
      const parts: THREE.Object3D[] = [
        lathe([[0, 0], [0.16, 0], [0.17, 0.03], [0.14, 0.1], [0.12, 0.12], [0, 0.12]], wood),
        mesh(new THREE.TorusGeometry(0.12, 0.008, 8, 40), metal(GOLD, 0.25), 0, 0.12, 0),
      ]
      ;(parts[1] as THREE.Mesh).rotation.x = Math.PI / 2
      // Inside: a snowy ground, a little house with a lit window, a tree
      const inside = group(
        cyl(0.12, 0.12, 0.02, mat('#ffffff', { roughness: 0.9 }), 0, 0.12),
        box(0.07, 0.05, 0.06, mat('#c0392b', { roughness: 0.7 }), -0.02, 0.14, 0),
        box(0.02, 0.02, 0.003, glow('#ffd27a', 0.8, 2), -0.02, 0.15, 0.031),
        mesh(new THREE.ConeGeometry(0.03, 0.12, 12), mat('#2e7d32', { roughness: 0.8 }), 0.06, 0.2, -0.02),
        mesh(new THREE.ConeGeometry(0.06, 0.04, 4), mat('#ffffff', { roughness: 0.8 }), -0.02, 0.21, 0),
      )
      ;(inside.children[4] as THREE.Mesh).rotation.y = Math.PI / 4
      parts.push(inside)
      const dome = sphere(0.14, glass('#f2fbff', 0.22), 0, 0.24, 0, 32)
      dome.castShadow = false
      parts.push(dome)
      // Snow swirling inside the glass
      const rand = seeded(19)
      const flakes = Array.from({ length: 50 }, () => [rand(), rand(), rand()])
      parts.push(swarm(50, new THREE.SphereGeometry(0.004, 6, 4), mat('#ffffff', { roughness: 0.5 }), (i, t, d) => {
        const [a, r, ph] = flakes[i]!
        const p = loop(t, 6, ph * 6)
        const ang = a * Math.PI * 2 + t * 0.6
        const rr = 0.03 + r * 0.08
        d.position.set(Math.cos(ang) * rr, 0.36 - p * 0.22, Math.sin(ang) * rr)
      }))
      return group(...parts)
    },
  },
  {
    type: 'vip-star-projector',
    name: 'Star projector',
    icon: 'i-lucide-stars',
    defaultColor: '#3b2f7a',
    light: { color: '#8fb3ff', intensity: 1.8, distance: 4, offset: [0, 0.3, 0] },
    build: (color) => {
      const shell = mat(color, { roughness: 0.35, metalness: 0.3 })
      const dome = group(mesh(new THREE.SphereGeometry(0.13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), shell))
      // Star-shaped holes glowing through the dome
      const rand = seeded(29)
      const holes = Array.from({ length: 40 }, () => [Math.acos(1 - rand() * 0.95), rand() * Math.PI * 2])
      dome.add(swarm(40, new THREE.OctahedronGeometry(0.008, 0), glow('#cfe1ff', 1, 2.4), (i, _t, d) => {
        const [phi, theta] = holes[i]!
        d.position.setFromSphericalCoords(0.131, phi, theta)
      }))
      dome.position.y = 0.06
      // Stars hover in a slowly turning cloud around it
      const cloudRand = seeded(37)
      const stars = Array.from({ length: 60 }, () => [cloudRand(), cloudRand(), cloudRand(), cloudRand()])
      const cloud = loose(swarm(60, new THREE.OctahedronGeometry(0.01, 0), glow('#e3ecff', 1.2, 2.4), (i, t, d) => {
        const [a, r, h, tw] = stars[i]!
        const ang = a * Math.PI * 2 + t * 0.12
        d.position.set(Math.cos(ang) * (0.3 + r * 0.5), 0.25 + h * 0.9, Math.sin(ang) * (0.3 + r * 0.5))
        d.rotation.set(t, t * 1.3, 0)
        d.scale.setScalar(0.4 + 0.8 * (0.5 + 0.5 * Math.sin(t * 2 + tw * 20)))
      }))
      return group(
        cyl(0.14, 0.15, 0.06, mat('#1d1a33', { roughness: 0.4, metalness: 0.4 })),
        animate(dome, (t) => {
          dome.rotation.y = t * 0.25
        }),
        cloud,
      )
    },
  },
  {
    type: 'vip-moon-lamp',
    name: 'Moon lamp',
    icon: 'i-lucide-moon',
    defaultColor: '#fff1cf',
    light: { color: '#ffe2a8', intensity: 2.6, distance: 4.5, offset: [0, 1.2, 0.2] },
    build: (color) => {
      const moonMat = glow(color, 0.12, 1.4)
      moonMat.roughness = 0.95
      const moon = group(mesh(new THREE.SphereGeometry(0.22, 40, 28), moonMat))
      // Craters
      const rand = seeded(43)
      for (let i = 0; i < 16; i++) {
        const phi = Math.acos(2 * rand() - 1)
        const theta = rand() * Math.PI * 2
        const crater = mesh(new THREE.SphereGeometry(0.02 + rand() * 0.035, 12, 8), glow(new THREE.Color(color).offsetHSL(0.02, -0.25, -0.3).getStyle(), 0.05, 0.9))
        crater.position.setFromSphericalCoords(0.205, phi, theta)
        crater.scale.set(1, 1, 0.3)
        crater.lookAt(0, 0, 0)
        moon.add(crater)
      }
      moon.position.set(0, 1.2, 0.18)
      // An arched stand it hangs from
      const stand = metal('#2b2b30', 0.3)
      const arc = new THREE.CatmullRomCurve3([v3(0, 0.04, -0.15), v3(0, 0.9, -0.2), v3(0, 1.55, -0.05), v3(0, 1.62, 0.18)])
      return group(
        cyl(0.17, 0.19, 0.04, stand, 0, 0, -0.15),
        mesh(new THREE.TubeGeometry(arc, 40, 0.012, 8), stand),
        cyl(0.002, 0.002, 0.2, mat('#cccccc'), 0, 1.42, 0.18, 4),
        animate(moon, (t) => {
          moon.rotation.y = t * 0.15
          moon.position.y = 1.2 + Math.sin(t * 0.7) * 0.01
        }),
      )
    },
  },
  {
    type: 'vip-nebula-painting',
    name: 'Nebula painting',
    icon: 'i-lucide-image',
    defaultColor: '#c9a14a',
    wallMounted: true,
    build: (color) => {
      // A painted nebula that glows at night, stars twinkling over it
      const texture = canvasTexture(512, 384, (ctx) => {
        ctx.fillStyle = '#070617'
        ctx.fillRect(0, 0, 512, 384)
        const rand = seeded(53)
        const blob = (x: number, y: number, r: number, c: string) => {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r)
          g.addColorStop(0, c)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, 512, 384)
        }
        ctx.globalCompositeOperation = 'lighter'
        blob(180, 170, 220, 'rgba(120,60,255,0.55)')
        blob(330, 210, 200, 'rgba(255,70,170,0.45)')
        blob(260, 150, 120, 'rgba(90,200,255,0.45)')
        blob(380, 120, 110, 'rgba(255,190,120,0.35)')
        for (let i = 0; i < 40; i++) blob(rand() * 512, rand() * 384, 30 + rand() * 60, `rgba(${150 + rand() * 100},${80 + rand() * 120},255,0.12)`)
        for (let i = 0; i < 420; i++) {
          ctx.fillStyle = `rgba(255,255,255,${0.3 + rand() * 0.7})`
          const s = rand() < 0.94 ? 1 : 2
          ctx.fillRect(rand() * 512, rand() * 384, s, s)
        }
      })
      const canvasMat = new THREE.MeshStandardMaterial({ map: texture, emissive: '#ffffff', emissiveMap: texture, emissiveIntensity: 0.35, roughness: 0.8 })
      canvasMat.userData.glow = true
      canvasMat.userData.baseGlow = 0.35
      canvasMat.userData.nightGlow = 0.9
      const frameMat = metal(color, 0.35)
      const W = 1.2
      const H = 0.9
      const parts: THREE.Object3D[] = [
        // Frame centred on the mounting point, canvas just in front of it
        box(W + 0.1, H + 0.1, 0.04, frameMat, 0, -(H + 0.1) / 2, 0.02),
        mesh(new THREE.PlaneGeometry(W, H), canvasMat, 0, 0, 0.0405),
      ]
      // Stars that twinkle in front of the paint
      const rand = seeded(61)
      const stars = Array.from({ length: 22 }, () => [rand(), rand(), rand()])
      parts.push(swarm(22, new THREE.OctahedronGeometry(0.008, 0), glow('#ffffff', 1.2, 2), (i, t, d) => {
        const [x, y, ph] = stars[i]!
        d.position.set((x - 0.5) * W * 0.95, (y - 0.5) * H * 0.95, 0.045)
        d.scale.set(1, 1, 0.3)
        d.scale.multiplyScalar(0.3 + 1.2 * Math.max(0, Math.sin(t * 1.8 + ph * 30)))
      }))
      return group(...parts)
    },
  },
])

export const PREMIUM_ITEMS: CatalogItem[] = [...VALENTINE, ...BIRTHDAY, ...TET, ...WEDDING, ...GALAXY]
