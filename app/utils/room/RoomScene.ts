import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import type { LandId, RoomConfig, RoomObject, RoomStyle, WallSide } from '~/types/room'
import { CATALOG_BY_TYPE, type CatalogItem } from './catalog'
import { daylightAtHour, getDaylight, type DaylightState } from './daylight'
import { buildLand, createStarSphere, type LandInstance } from './lands'
import { buildRoomShell, FLOOR_THICKNESS } from './shell'
import { flameFlicker, flameTime } from './flame'
import { animateGuestGift, buildGuestGift, guestGiftSpot } from './guestGifts'
import { drawProductCard, productSignature, type ShopProduct } from './productCard'
import type { GuestGiftType } from '#shared/guestbook'

export { createFloorTexture } from './shell'

export type ObjectPatch = Pick<RoomObject, 'position' | 'rotation'> & { wall?: WallSide }

export interface RoomSceneOptions {
  editable: boolean
  /** Small, non-interactive preview: low frame rate and quality */
  preview?: boolean
  /** Opening shot: start far away with the land tiny, then fly in to the widest zoom */
  intro?: boolean
  onSelect?: (id: string | null) => void
  /** Objects moved by a drag: the dragged one plus anything resting on it */
  onObjectChange?: (changes: { id: string; patch: ObjectPatch }[]) => void
  onHover?: (id: string | null, x: number, y: number) => void
  onActivate?: (id: string) => void
  /** Called about once a second with rendering stats (editor FPS readout) */
  onStats?: (stats: RoomSceneStats) => void
  /** A visitor's guestbook gift was clicked (live page) */
  onGuestActivate?: (id: string) => void
  /** The pointer is over a guestbook gift (null when it leaves) */
  onGuestHover?: (id: string | null, x: number, y: number) => void
  /**
   * Video recording: best quality at a fixed 2x pixel ratio, no input, and
   * no frames of its own; the recorder draws each frame with renderTour()
   */
  capture?: boolean
}

export interface RoomSceneStats {
  /** Frames actually rendered in the last second */
  fps: number
  /** Frame rate cap currently in effect (60 interacting, 30 idle, 15 preview) */
  cap: number
  drawCalls: number
  triangles: number
}

interface ObjectEntry {
  data: RoomObject
  item: CatalogItem
  root: THREE.Group
  /** Borrowed from the fixed light pool */
  light?: THREE.PointLight
  glowMaterials: THREE.MeshStandardMaterial[]
  skyMaterials: THREE.MeshStandardMaterial[]
  signature: string
  /** When the object appeared (after loading and shader compilation); null while loading */
  revealedAt: number | null
  /** Still playing the pop-in animation */
  popping?: boolean
}

/** Quality steps used by the adaptive renderer, best first */
const QUALITY_LEVELS = [
  { pixelRatio: 2, shadowSize: 2048, shadows: true },
  { pixelRatio: 1.5, shadowSize: 2048, shadows: true },
  { pixelRatio: 1.25, shadowSize: 1024, shadows: true },
  { pixelRatio: 1, shadowSize: 1024, shadows: true },
]
/** Widest zoom (camera distance from the room) */
const MAX_ZOOM_DISTANCE = 30
/** Intro: start distance, pause before flying, and flight time (ms) */
const INTRO_DISTANCE = 1400
const INTRO_HOLD = 700
const INTRO_DURATION = 3200

/** Only this many lamps cast real light; the rest just glow (each light costs shading on every surface) */
const MAX_POINT_LIGHTS = 8

/** Guestbook gifts are drawn a bit larger than life so they read from the default view */
const GIFT_SCALE = 1.3

const SUN_COLOR = new THREE.Color('#ffeccb')
const MOON_COLOR = new THREE.Color('#9fb4ff')

export class RoomScene {
  private container: HTMLElement
  private options: RoomSceneOptions
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private resizeObserver: ResizeObserver
  private frame = 0
  private disposed = false

  private shell = new THREE.Group()
  private objectsGroup = new THREE.Group()
  private outdoor = new THREE.Group()
  /** Guestbook gifts on the lawn, newest first */
  private guestsGroup = new THREE.Group()
  private guests = new Map<string, { group: THREE.Group; seed: number; bornAt: number }>()
  private guestOrder: string[] = []
  private hoveredGuest: string | null = null
  /** Products shown on product stands, by id; accent colour of their price */
  private products = new Map<string, ShopProduct>()
  private shopAccent = '#e8457a'
  private soldOutLabel = 'Sold out'
  private entries = new Map<string, ObjectEntry>()
  private style?: RoomStyle
  private styleSignature = ''
  private room?: RoomConfig

  private hemi = new THREE.HemisphereLight('#ffffff', '#7a8f52', 0.6)
  private ambient = new THREE.AmbientLight('#ffffff', 0.2)
  private sun = new THREE.DirectionalLight('#ffffff', 2)
  private sunDisc: THREE.Mesh
  private moonDisc: THREE.Mesh
  private stars = createStarSphere()
  /**
   * Lamp lights are a fixed pool: changing the number of lights would make
   * three.js recompile every material in the scene, freezing the page
   */
  private lightPool: THREE.PointLight[] = []
  /** Pulsing marker shown where an object is still loading */
  private loadingMarkers = new Map<string, THREE.Mesh>()
  private loadingMarkerGeometry = new THREE.SphereGeometry(0.14, 16, 12)
  private loadingMarkerMaterial = new THREE.MeshBasicMaterial({ color: '#5aa9ff', transparent: true, opacity: 0.6, depthWrite: false, fog: false })
  private land?: LandInstance
  private landKey = ''
  private clock = new THREE.Clock()
  private lamps = 0
  /** Visible sky: gradient dome (the camera mostly sees below the horizon) */
  private skyDome = createSkyDome()
  /** Physical sky, used only to light the scene through the environment map */
  private envScene = new THREE.Scene()
  private envSky = new Sky()
  private pmrem: THREE.PMREMGenerator
  private envTarget?: THREE.WebGLRenderTarget
  private envKey = ''
  private walls: THREE.Mesh[] = []
  private floor?: THREE.Mesh

  private selectedId: string | null = null
  private selectionBox = new THREE.Box3Helper(new THREE.Box3(), new THREE.Color('#38bdf8'))
  private hoveredId: string | null = null
  private daylightOverride: DaylightState | null = null
  /** Camera glide toward a focused object (target point and camera position) */
  private cameraGlide: { target: THREE.Vector3; position: THREE.Vector3 } | null = null
  /** Fly-in opening shot (live page); start is set on the first frame */
  private intro: { start: number | null } | null = null
  /** The camera follows renderTour() instead of the orbit controls */
  private touring = false
  /** Stops drawing frames (e.g. the editor's scene while a video records) */
  private paused = false
  /** Daylight actually shown; eases toward the target for smooth day/night switches */
  private shownDaylight: number | null = null
  private skyColor = new THREE.Color()

  // Performance: render on demand at a frame rate that matches what's happening
  private visibilityObserver: IntersectionObserver
  private onScreen = true
  private lastRender = 0
  private statsFrames = 0
  private statsSince = 0
  private statsCap = 60
  private activeUntil = 0
  private quality = 0
  private frameRatios: number[] = []
  private startedAt = performance.now()
  private pointerDown = { x: 0, y: 0 }
  /** Object being dragged directly in the editor */
  private drag: {
    id: string
    startX: number
    startY: number
    active: boolean
    /** Grab point offset so the object doesn't jump to the cursor */
    offset: THREE.Vector3
    /** Objects resting on the dragged one, carried along at a fixed offset */
    riders: { entry: ObjectEntry; offset: THREE.Vector3 }[]
  } | null = null

  constructor(container: HTMLElement, options: RoomSceneOptions) {
    this.container = container
    this.options = options

    // MSAA stays on everywhere: without it the cut-out grass and leaves shimmer as they sway
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // Neutral keeps colours saturated (ACES and AgX wash out this pastel scenery)
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.domElement.style.display = 'block'
    this.renderer.domElement.style.touchAction = 'none'
    container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200)
    this.camera.position.set(9.5, 7.5, 9.5)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 1, 0)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 3
    this.controls.maxDistance = MAX_ZOOM_DISTANCE
    this.controls.minPolarAngle = 0.25
    this.controls.maxPolarAngle = 1.45
    // Keep the camera on the open side of the room so the walls stay behind
    this.controls.minAzimuthAngle = 0.05
    this.controls.maxAzimuthAngle = Math.PI / 2 - 0.05
    if (options.intro && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.intro = { start: null }
      this.controls.enabled = false
      this.controls.maxDistance = Infinity
      this.placeIntroCamera(0)
    }
    // Left drag orbits, right drag / two fingers pan, wheel / pinch zoom
    this.controls.enablePan = true
    this.controls.screenSpacePanning = true
    this.controls.panSpeed = 0.9
    this.controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
    this.controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }
    this.controls.addEventListener('change', this.clampTarget)
    this.controls.addEventListener('change', this.markActive)

    this.scene.add(this.hemi, this.ambient, this.sun, this.sun.target)
    this.pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.add(this.skyDome.mesh)
    this.envSky.scale.setScalar(50)
    this.envScene.add(this.envSky)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.camera.left = -14
    this.sun.shadow.camera.right = 14
    this.sun.shadow.camera.top = 14
    this.sun.shadow.camera.bottom = -14
    this.sun.shadow.camera.far = 80
    this.sun.shadow.bias = -0.0005
    this.sun.shadow.normalBias = 0.02

    this.sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 24, 16),
      new THREE.MeshBasicMaterial({ color: '#ffe8a3', fog: false }),
    )
    this.moonDisc = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshBasicMaterial({ color: '#e8ecff', fog: false }),
    )
    this.scene.add(this.sunDisc, this.moonDisc, this.stars.points, this.shell, this.objectsGroup, this.outdoor, this.guestsGroup)
    for (let i = 0; i < MAX_POINT_LIGHTS; i++) {
      const light = new THREE.PointLight('#ffffff', 0, 2, 1.6)
      this.lightPool.push(light)
      this.scene.add(light)
    }

    this.selectionBox.visible = false
    this.scene.add(this.selectionBox)

    if (options.editable) {
      // Capture phase runs before OrbitControls, so grabbing an object doesn't orbit
      this.renderer.domElement.addEventListener('pointerdown', this.handleEditPointerDown, { capture: true })
    }

    this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown)
    this.renderer.domElement.addEventListener('pointerup', this.handlePointerUp)
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove)
    this.renderer.domElement.addEventListener('pointerleave', this.handlePointerLeave)
    this.renderer.domElement.addEventListener('pointercancel', this.handlePointerCancel)

    // Phones, low-memory devices and previews start at a lighter quality level
    const coarse = window.matchMedia?.('(pointer: coarse)').matches
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
    this.quality = options.capture ? 0 : options.preview ? 3 : coarse || memory < 4 ? 2 : 0
    if (options.capture) this.controls.enabled = false
    this.applyQuality()

    // Stop rendering while the canvas is scrolled out of view
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      // A recording renders off-screen
      this.onScreen = !!entry?.isIntersecting || !!options.capture
      if (this.onScreen) this.markActive()
    })
    this.visibilityObserver.observe(container)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)
    this.resize()
    this.animate()
  }

  // ---------- Public API ----------

  setRoom(room: RoomConfig) {
    this.room = room
    this.markActive()
    const signature = JSON.stringify(room.style)
    if (signature !== this.styleSignature) {
      this.styleSignature = signature
      this.style = room.style
      this.buildShell(room.style)
      // Wall objects depend on room size
      for (const entry of this.entries.values()) this.applyTransform(entry)
    }
    const landId: LandId = room.land ?? 'island'
    const landKey = `${landId}|${signature}`
    if (landKey !== this.landKey) {
      this.landKey = landKey
      this.buildOutdoor(landId, room.style)
    }
    this.syncObjects(room.objects)
  }

  /**
   * Picture of the current view (site thumbnail, room video preview), without
   * the selection box, lit at the given hour or light (midday by default)
   */
  snapshot(light: number | DaylightState = 12, maxWidth = 960): Promise<Blob | null> {
    const boxWasVisible = this.selectionBox.visible
    this.selectionBox.visible = false
    // Always pictured at midday, whatever the time is now; the next frame
    // eases back from the light that was showing
    const shownBefore = this.shownDaylight
    this.shownDaylight = null
    this.applyDaylight(typeof light === 'number' ? daylightAtHour(light) : light)
    this.land?.update(this.clock.elapsedTime, 0, this.shownDaylight ?? 1, this.lamps)
    this.renderer.render(this.scene, this.camera)
    this.shownDaylight = shownBefore
    // Copy the frame now, before the WebGL buffer is cleared, at thumbnail size
    const source = this.renderer.domElement
    const width = Math.min(maxWidth, source.width)
    const small = document.createElement('canvas')
    small.width = width
    small.height = Math.round(source.height * (width / source.width))
    small.getContext('2d')?.drawImage(source, 0, 0, small.width, small.height)
    this.selectionBox.visible = boxWasVisible
    return new Promise<Blob | null>(resolve => small.toBlob(resolve, 'image/webp', 0.82))
  }

  /** Products the stands can show (from the site's products block) */
  setProducts(products: ShopProduct[], accent?: string, soldOutLabel?: string) {
    this.products = new Map(products.map(p => [p.id, p]))
    if (accent) this.shopAccent = accent
    if (soldOutLabel) this.soldOutLabel = soldOutLabel
    // Stands whose product changed get redrawn
    if (this.room) this.syncObjects(this.room.objects)
    this.markActive()
  }

  /**
   * Guestbook gifts to show, newest first. New ones pop in (animate = true
   * after the first load); ones no longer listed are removed.
   */
  setGuests(list: { id: string; gift: GuestGiftType }[], animate = false) {
    const keep = new Set(list.map(g => g.id))
    for (const [id, guest] of this.guests) {
      if (keep.has(id)) continue
      this.guestsGroup.remove(guest.group)
      this.clearGroup(guest.group)
      this.guests.delete(id)
    }
    for (const { id, gift } of list) {
      if (this.guests.has(id)) continue
      const seed = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
      const group = buildGuestGift(gift, seed)
      group.userData.guestId = id
      group.scale.setScalar(GIFT_SCALE)
      this.guestsGroup.add(group)
      this.guests.set(id, { group, seed, bornAt: animate ? performance.now() : 0 })
    }
    this.guestOrder = list.map(g => g.id)
    this.placeGuests()
    this.markActive()
  }

  /** Glide the camera to a guestbook gift */
  focusGuest(id: string) {
    const guest = this.guests.get(id)
    if (!guest) return
    const target = guest.group.position.clone().setY(guest.group.position.y + 0.3)
    const offset = this.camera.position.clone().sub(this.controls.target).setLength(6)
    this.cameraGlide = { target, position: target.clone().add(offset) }
    this.markActive()
  }

  /** Stand each gift on the ground at its spot (also after the land or room size changes) */
  private placeGuests() {
    if (!this.style) return
    const down = new THREE.Raycaster()
    const ground = this.land?.ground
    this.guestOrder.forEach((id, index) => {
      const guest = this.guests.get(id)
      if (!guest) return
      const spot = guestGiftSpot(index, this.style!)
      let y = -FLOOR_THICKNESS
      if (ground) {
        down.set(new THREE.Vector3(spot.x, 30, spot.z), new THREE.Vector3(0, -1, 0))
        const hit = down.intersectObject(ground, true)[0]
        if (hit) y = hit.point.y
      }
      guest.group.position.set(spot.x, y, spot.z)
      guest.group.rotation.y = spot.rotation + ((guest.seed % 60) - 30) * 0.01
    })
  }

  private updateGuests(now: number, time: number) {
    for (const guest of this.guests.values()) {
      animateGuestGift(guest.group, time, guest.seed % 100)
      if (!guest.bornAt) continue
      const t = Math.min((now - guest.bornAt) / 700, 1)
      // Pop in with a small overshoot
      const scale = t >= 1 ? 1 : 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2
      guest.group.scale.setScalar(Math.max(scale, 0.001) * GIFT_SCALE)
      if (t >= 1) guest.bornAt = 0
      else this.markActive()
    }
  }

  private pickGuest(clientX: number, clientY: number): string | null {
    if (!this.guests.size) return null
    this.setPointer(clientX, clientY)
    const hit = this.raycaster.intersectObjects(this.guestsGroup.children, true)[0]
    let obj: THREE.Object3D | null = hit?.object ?? null
    while (obj && !obj.userData.guestId) obj = obj.parent
    return (obj?.userData.guestId as string) ?? null
  }

  /** Pause drawing to free the GPU for something else, e.g. recording a video */
  setPaused(paused: boolean) {
    this.paused = paused
    if (!paused) this.markActive()
  }

  /** Objects or land still loading (a recording waits for them) */
  get loading() {
    return this.loadingMarkers.size > 0
  }

  /**
   * One frame of the room tour, progress 0..1: the camera sweeps across the
   * open side of the room while moving in, then rises and pulls back to show
   * the land. Returns the canvas with the frame on it, to copy right away.
   */
  renderTour(progress: number): HTMLCanvasElement {
    this.touring = true
    const p = THREE.MathUtils.clamp(progress, 0, 1)
    const ease = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2)
    const size = Math.max(this.style?.width ?? 6, this.style?.depth ?? 6)
    const height = this.style?.height ?? 3.2
    const sweep = ease(Math.min(p / 0.78, 1))
    const reveal = ease(Math.max((p - 0.78) / 0.22, 0))
    const azimuth = THREE.MathUtils.lerp(0.18, Math.PI / 2 - 0.18, sweep)
    const distance = Math.min(THREE.MathUtils.lerp(THREE.MathUtils.lerp(3.1, 2.15, sweep), 3.9, reveal) * size, MAX_ZOOM_DISTANCE - 1)
    const polar = THREE.MathUtils.lerp(THREE.MathUtils.lerp(1.12, 1.0, sweep), 0.82, reveal)
    this.controls.target.set(0, height * 0.32, 0)
    this.camera.position.setFromSphericalCoords(distance, polar, azimuth).add(this.controls.target)
    this.camera.lookAt(this.controls.target)
    this.renderFrame(performance.now())
    return this.renderer.domElement
  }

  select(id: string | null) {
    this.selectedId = id && this.entries.has(id) ? id : null
    this.selectionBox.visible = !!this.selectedId
  }

  /** Glide the camera to look at an object, moving in closer if far away */
  focusObject(id: string) {
    const entry = this.entries.get(id)
    if (!entry) return
    const center = new THREE.Box3().setFromObject(entry.root).getCenter(new THREE.Vector3())
    const offset = this.camera.position.clone().sub(this.controls.target)
    offset.setLength(Math.min(offset.length(), 8))
    // Aim a bit below the object so it sits above the editor's bottom panels
    const target = center.clone().setY(Math.max(center.y - 1, 0))
    this.cameraGlide = { target, position: target.clone().add(offset) }
    this.markActive()
  }

  /** Zoom toward (factor < 1) or away from (factor > 1) the current focus point */
  zoomBy(factor: number) {
    const offset = this.camera.position.clone().sub(this.controls.target)
    offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, this.controls.minDistance, this.controls.maxDistance))
    this.camera.position.copy(this.controls.target).add(offset)
    this.controls.update()
  }

  /** Return the camera to the default angle */
  resetView() {
    this.cameraGlide = null
    this.camera.position.set(9.5, 7.5, 9.5)
    this.controls.target.set(0, 1, 0)
    this.controls.update()
  }

  /** Force a time of day (editor preview); null returns to the configured mode */
  setDaylightOverride(state: DaylightState | null) {
    this.daylightOverride = state
    this.markActive()
  }

  /**
   * Where a catalog item dropped at a screen point should land.
   * Floor items stack on top of furniture; wall items stick to the nearest wall.
   */
  getDropTarget(clientX: number, clientY: number, wallMounted: boolean): { position: [number, number, number]; wall?: WallSide } | null {
    return wallMounted ? this.wallTarget(clientX, clientY) : this.surfaceTarget(clientX, clientY)
  }

  /** Point on whichever wall is under the cursor; moving past a corner lands on the other wall */
  private wallTarget(clientX: number, clientY: number): { position: [number, number, number]; wall: WallSide } | null {
    if (!this.style) return null
    this.setPointer(clientX, clientY)
    const { width, depth, height } = this.style
    const hit = this.raycaster.intersectObjects(this.walls, false)[0]
    if (!hit) return null
    const wall = hit.object.userData.wall as WallSide
    const y = THREE.MathUtils.clamp(hit.point.y, 0.4, height - 0.3)
    return wall === 'back'
      ? { wall, position: [THREE.MathUtils.clamp(hit.point.x, -width / 2 + 0.4, width / 2 - 0.4), y, -depth / 2] }
      : { wall, position: [-width / 2, y, THREE.MathUtils.clamp(hit.point.z, -depth / 2 + 0.4, depth / 2 - 0.4)] }
  }

  /** Point on the floor or on top of furniture under the cursor */
  private surfaceTarget(clientX: number, clientY: number, exclude?: THREE.Object3D): { position: [number, number, number] } | null {
    if (!this.style) return null
    this.setPointer(clientX, clientY)
    const { width, depth } = this.style
    const targets: THREE.Object3D[] = this.objectsGroup.children.filter(c => c !== exclude)
    if (this.floor) targets.push(this.floor)
    const hits = this.raycaster.intersectObjects(targets, true)
    const hit = hits.find(h => (h.face?.normal.y ?? 0) > 0.5 || h.object === this.floor)
    if (!hit) return null
    const onFloor = hit.object === this.floor
    return {
      position: [
        THREE.MathUtils.clamp(hit.point.x, -width / 2 + 0.2, width / 2 - 0.2),
        onFloor ? 0 : Math.max(hit.point.y, 0),
        THREE.MathUtils.clamp(hit.point.z, -depth / 2 + 0.2, depth / 2 - 0.2),
      ],
    }
  }

  dispose() {
    this.disposed = true
    this.loadingMarkerGeometry.dispose()
    this.loadingMarkerMaterial.dispose()
    cancelAnimationFrame(this.frame)
    this.resizeObserver.disconnect()
    this.visibilityObserver.disconnect()
    const el = this.renderer.domElement
    el.removeEventListener('pointerdown', this.handlePointerDown)
    el.removeEventListener('pointerup', this.handlePointerUp)
    el.removeEventListener('pointermove', this.handlePointerMove)
    el.removeEventListener('pointerleave', this.handlePointerLeave)
    el.removeEventListener('pointercancel', this.handlePointerCancel)
    el.removeEventListener('pointerdown', this.handleEditPointerDown, { capture: true })
    this.controls.removeEventListener('change', this.clampTarget)
    this.controls.dispose()
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      mesh.geometry?.dispose()
      const material = mesh.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(material)) material.forEach(m => this.disposeMaterial(m))
      else if (material) this.disposeMaterial(material)
    })
    this.envTarget?.dispose()
    this.pmrem.dispose()
    this.renderer.dispose()
    el.remove()
  }

  // ---------- Room shell & outdoor ----------

  private buildShell(style: RoomStyle) {
    this.clearGroup(this.shell)
    const shell = buildRoomShell(style)
    this.floor = shell.floor
    this.walls = shell.walls
    this.shell.add(shell.group)
  }

  private buildOutdoor(landId: LandId, style: RoomStyle) {
    this.clearGroup(this.outdoor)
    // Lighter scenery on devices that start at a reduced quality level (phones, low memory)
    this.land = buildLand(landId, { style, groundY: -FLOOR_THICKNESS, detail: this.quality >= 2 ? 0.55 : 1 })
    this.outdoor.add(this.land.group)
    this.updateRoomFlowers()
    this.placeGuests()
  }

  private lastAttractorCheck = 0

  /** Tell the land where the cursor is on the ground or room floor, so butterflies can come over */
  private updateAttractor(clientX: number, clientY: number) {
    if (!this.land?.setAttractor) return
    const now = performance.now()
    if (now - this.lastAttractorCheck < 80) return
    this.lastAttractorCheck = now
    this.setPointer(clientX, clientY)
    const surfaces = [this.land.ground, this.floor, ...this.objectsGroup.children].filter((o): o is THREE.Object3D => !!o)
    const hit = this.raycaster.intersectObjects(surfaces, true)[0]
    this.land.setAttractor(hit ? hit.point : null)
  }

  /** Tops of flower decor in the room, where butterflies may also land */
  private updateRoomFlowers() {
    if (!this.land?.setRoomFlowers) return
    const box = new THREE.Box3()
    const spots: THREE.Vector3[] = []
    for (const entry of this.entries.values()) {
      if (!entry.item.attractsButterflies || entry.revealedAt === null) continue
      box.setFromObject(entry.root)
      const center = box.getCenter(new THREE.Vector3())
      spots.push(new THREE.Vector3(center.x, box.max.y - 0.04, center.z))
    }
    this.land.setRoomFlowers(spots)
  }

  // ---------- Objects ----------

  private syncObjects(objects: RoomObject[]) {
    const seen = new Set<string>()
    for (const data of objects) {
      const item = CATALOG_BY_TYPE[data.type]
      if (!item) continue
      seen.add(data.id)
      const product = item.productCard && data.productId ? this.products.get(data.productId) : undefined
      const signature = `${data.type}|${data.color || ''}|${data.image || ''}|${data.productId || ''}|${productSignature(product)}`
      const existing = this.entries.get(data.id)
      if (existing && existing.signature === signature) {
        existing.data = data
        if (!(this.drag?.active && this.drag.id === data.id)) this.applyTransform(existing)
        continue
      }
      if (existing) this.removeEntry(data.id)
      // Rebuilt objects (e.g. a colour change) swap in quietly; new ones get the loading marker and pop-in
      this.addEntry(data, item, signature, !existing)
    }
    for (const id of [...this.entries.keys()]) {
      if (!seen.has(id)) this.removeEntry(id)
    }
    if (this.selectedId && !this.entries.has(this.selectedId)) this.selectedId = null
    this.selectionBox.visible = !!this.selectedId
    this.updateRoomFlowers()
  }

  private addEntry(data: RoomObject, item: CatalogItem, signature: string, animate: boolean) {
    const root = new THREE.Group()
    const model = item.build(data.color || item.defaultColor)
    root.add(model)
    root.userData.objectId = data.id

    const glowMaterials: THREE.MeshStandardMaterial[] = []
    const skyMaterials: THREE.MeshStandardMaterial[] = []
    const collectMaterials = () => {
      model.traverse((obj) => {
        const material = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
        if (!material?.userData) return
        if (material.userData.glow && !glowMaterials.includes(material)) glowMaterials.push(material)
        if (material.userData.sky && !skyMaterials.includes(material)) skyMaterials.push(material)
      })
    }
    collectMaterials()
    if (item.photo && data.image) this.addPhoto(model, item.photo, data.image)
    const product = item.productCard && data.productId ? this.products.get(data.productId) : undefined
    if (item.productCard && product) this.addProductCard(model, item.productCard, product)
    // Model-based items load asynchronously; pick up their glowing parts when ready
    ;(model.userData.ready as Promise<void> | undefined)?.then(collectMaterials).catch(() => {})

    const entry: ObjectEntry = { data, item, root, glowMaterials, skyMaterials, signature, revealedAt: null }
    this.entries.set(data.id, entry)
    this.assignLight(entry)
    this.objectsGroup.add(root)
    this.applyTransform(entry)
    this.revealWhenReady(entry, model, animate)
  }

  /**
   * Keep a new object hidden (with a pulsing marker) until its model has
   * loaded and its shaders are compiled in the background, then pop it in.
   * Compiling on first draw instead would stall the page.
   */
  private revealWhenReady(entry: ObjectEntry, model: THREE.Group, animate: boolean) {
    entry.root.visible = false
    const marker = new THREE.Mesh(this.loadingMarkerGeometry, this.loadingMarkerMaterial)
    marker.visible = animate
    this.loadingMarkers.set(entry.data.id, marker)
    this.scene.add(marker)
    const ready = (model.userData.ready as Promise<void> | undefined) ?? Promise.resolve()
    const current = () => !this.disposed && this.entries.get(entry.data.id) === entry
    ready
      .catch(() => {})
      .then(() => (current() ? this.renderer.compileAsync(entry.root, this.camera, this.scene) : undefined))
      .catch(() => {})
      .then(() => {
        this.removeLoadingMarker(entry.data.id, marker)
        if (!current()) return
        entry.root.visible = true
        entry.revealedAt = performance.now()
        entry.popping = animate
        this.updateRoomFlowers()
        this.markActive()
      })
  }

  private removeLoadingMarker(id: string, marker: THREE.Mesh) {
    this.scene.remove(marker)
    if (this.loadingMarkers.get(id) === marker) this.loadingMarkers.delete(id)
  }

  /** Give a lamp a light from the pool, if one is free */
  private assignLight(entry: ObjectEntry) {
    if (!entry.item.light || entry.light) return
    const used = new Set([...this.entries.values()].map(e => e.light))
    const light = this.lightPool.find(l => !used.has(l))
    if (!light) return
    light.color.set(entry.item.light.color)
    light.distance = entry.item.light.distance
    light.intensity = 0
    entry.light = light
  }

  /** Pooled lights live in the scene, so follow their lamp each frame; markers pulse while loading */
  private updateObjectEffects(now: number) {
    const offset = new THREE.Vector3()
    for (const entry of this.entries.values()) {
      if (entry.popping && entry.revealedAt !== null) {
        // Pop in: a quick overshoot from slightly smaller to full size
        const t = Math.min((now - entry.revealedAt) / 260, 1)
        const back = 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2
        entry.root.scale.setScalar((entry.data.scale || 1) * (0.7 + 0.3 * back))
        if (t >= 1) entry.popping = false
      }
      if (entry.light && entry.item.light) {
        entry.root.updateWorldMatrix(true, false)
        entry.light.position.copy(entry.root.localToWorld(offset.set(...entry.item.light.offset)))
        if (entry.revealedAt === null) entry.light.intensity = 0
      }
      const marker = this.loadingMarkers.get(entry.data.id)
      if (marker) {
        entry.root.updateWorldMatrix(true, false)
        marker.position.setFromMatrixPosition(entry.root.matrixWorld)
        marker.position.y += entry.item.wallMounted ? 0 : 0.3
        marker.scale.setScalar(0.8 + 0.3 * Math.sin(now / 160))
      }
    }
    this.loadingMarkerMaterial.opacity = 0.45 + 0.25 * Math.sin(now / 160)
  }

  /** Show an uploaded photo in the item's photo area, cropped to fill it */
  private addPhoto(model: THREE.Group, slot: NonNullable<CatalogItem['photo']>, url: string) {
    model.traverse((obj) => {
      if (obj.userData.placeholder) obj.visible = false
    })
    const material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55 })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(slot.width, slot.height), material)
    plane.position.set(...slot.center)
    plane.receiveShadow = true
    model.add(plane)
    new THREE.TextureLoader().load(url, (texture) => {
      if (this.disposed) return texture.dispose()
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      const image = texture.image as { width: number; height: number }
      const imageAspect = image.width / image.height
      // Turn the frame sideways for photos whose orientation doesn't match it
      const turn = (imageAspect > 1) !== (slot.width > slot.height)
      const width = turn ? slot.height : slot.width
      const height = turn ? slot.width : slot.height
      if (turn) {
        model.rotation.z = Math.PI / 2
        plane.rotation.z = -Math.PI / 2
        plane.geometry.dispose()
        plane.geometry = new THREE.PlaneGeometry(width, height)
      }
      // Cover: crop the longer side so the photo isn't stretched
      const slotAspect = width / height
      if (imageAspect > slotAspect) {
        texture.repeat.set(slotAspect / imageAspect, 1)
        texture.offset.set((1 - texture.repeat.x) / 2, 0)
      } else {
        texture.repeat.set(1, imageAspect / slotAspect)
        texture.offset.set(0, (1 - texture.repeat.y) / 2)
      }
      material.map = texture
      material.needsUpdate = true
      this.markActive()
    }, undefined, () => {
      // Missing photo: fall back to the artwork
      plane.visible = false
      model.traverse((obj) => {
        if (obj.userData.placeholder) obj.visible = true
      })
    })
  }

  /** Draws the product's card (photo, name, price) onto a stand */
  private addProductCard(model: THREE.Group, slot: NonNullable<CatalogItem['productCard']>, product: ShopProduct) {
    const material = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(slot.width, slot.height), material)
    plane.position.set(...slot.center)
    plane.visible = false
    model.add(plane)
    drawProductCard(product, this.shopAccent, this.soldOutLabel).then((canvas) => {
      if (this.disposed) return
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      material.map = texture
      material.needsUpdate = true
      plane.visible = true
      model.traverse((obj) => {
        if (obj.userData.placeholder) obj.visible = false
      })
      this.markActive()
    }).catch(() => {})
  }

  private removeEntry(id: string) {
    const entry = this.entries.get(id)
    if (!entry) return
    this.objectsGroup.remove(entry.root)
    this.clearGroup(entry.root)
    this.entries.delete(id)
    const marker = this.loadingMarkers.get(id)
    if (marker) this.removeLoadingMarker(id, marker)
    if (entry.light) {
      // Return the light to the pool and hand it to a lamp that had none
      entry.light.intensity = 0
      const waiting = [...this.entries.values()].find(e => e.item.light && !e.light)
      if (waiting) this.assignLight(waiting)
    }
  }

  private applyTransform(entry: ObjectEntry) {
    const { data, root, item } = entry
    const [x, y, z] = data.position
    root.position.set(x, y, z)
    root.scale.setScalar(data.scale || 1)
    if (item.wallMounted && this.style) {
      const wall = data.wall || 'back'
      if (wall === 'back') {
        root.position.z = -this.style.depth / 2
        root.rotation.set(0, 0, 0)
      } else {
        root.position.x = -this.style.width / 2
        root.rotation.set(0, Math.PI / 2, 0)
      }
    } else {
      root.rotation.set(0, THREE.MathUtils.degToRad(data.rotation || 0), 0)
    }
  }

  /** Keep the camera's focus point inside the room while panning */
  private clampTarget = () => {
    if (!this.style) return
    const t = this.controls.target
    const { width, depth, height } = this.style
    const clamped = new THREE.Vector3(
      THREE.MathUtils.clamp(t.x, -width / 2 - 1, width / 2 + 1),
      THREE.MathUtils.clamp(t.y, 0, height + 0.5),
      THREE.MathUtils.clamp(t.z, -depth / 2 - 1, depth / 2 + 1),
    )
    const delta = clamped.sub(t)
    if (delta.lengthSq() === 0) return
    t.add(delta)
    this.camera.position.add(delta)
  }

  private moveDragged(clientX: number, clientY: number) {
    const entry = this.drag ? this.entries.get(this.drag.id) : undefined
    if (!entry || !this.drag || !this.style) return
    this.markActive()
    if (entry.item.wallMounted) {
      const target = this.wallTarget(clientX, clientY)
      if (!target) return
      entry.root.position.set(...target.position)
      entry.root.rotation.set(0, target.wall === 'back' ? 0 : Math.PI / 2, 0)
      entry.root.userData.wall = target.wall
    } else {
      const target = this.surfaceTarget(clientX, clientY, entry.root)
      if (!target) return
      const { width, depth } = this.style
      const [x, y, z] = target.position
      entry.root.position.set(
        THREE.MathUtils.clamp(x + this.drag.offset.x, -width / 2 + 0.15, width / 2 - 0.15),
        y,
        THREE.MathUtils.clamp(z + this.drag.offset.z, -depth / 2 + 0.15, depth / 2 - 0.15),
      )
      for (const rider of this.drag.riders) rider.entry.root.position.copy(entry.root.position).add(rider.offset)
    }
  }

  /** Ids of the objects resting on top of an object, including ones stacked on those */
  ridersOf(id: string): string[] {
    const entry = this.entries.get(id)
    return entry ? this.findRiders(entry).map(r => r.data.id) : []
  }

  /**
   * Objects whose base sits on top of `entry`: above its own base, no higher
   * than its top, and inside its footprint. Followed recursively, so a candle
   * on a tray on a table counts too.
   */
  private findRiders(entry: ObjectEntry): ObjectEntry[] {
    if (entry.item.wallMounted) return []
    const riders: ObjectEntry[] = []
    const queue = [entry]
    const box = new THREE.Box3()
    while (queue.length) {
      const base = queue.shift()!
      box.setFromObject(base.root)
      for (const other of this.entries.values()) {
        if (other === entry || other.item.wallMounted || riders.includes(other)) continue
        const [x, y, z] = other.data.position
        if (y < base.data.position[1] + 0.05 || y > box.max.y + 0.05) continue
        if (x < box.min.x - 0.02 || x > box.max.x + 0.02 || z < box.min.z - 0.02 || z > box.max.z + 0.02) continue
        riders.push(other)
        queue.push(other)
      }
    }
    return riders
  }

  private commitDrag(id: string, riders: ObjectEntry[]) {
    const entry = this.entries.get(id)
    if (!entry) return
    const round = (n: number) => Math.round(n * 1000) / 1000
    const positionOf = (e: ObjectEntry): [number, number, number] => [round(e.root.position.x), round(e.root.position.y), round(e.root.position.z)]
    const patch: ObjectPatch = { position: positionOf(entry), rotation: entry.data.rotation }
    if (entry.item.wallMounted) patch.wall = (entry.root.userData.wall as WallSide | undefined) ?? entry.data.wall ?? 'back'
    this.options.onObjectChange?.([
      { id, patch },
      ...riders.map(r => ({ id: r.data.id, patch: { position: positionOf(r), rotation: r.data.rotation } })),
    ])
  }

  private cancelDrag() {
    if (!this.drag) return
    const entry = this.entries.get(this.drag.id)
    if (entry) this.applyTransform(entry)
    for (const rider of this.drag.riders) this.applyTransform(rider.entry)
    this.drag = null
    this.controls.enabled = true
  }

  // ---------- Pointer ----------

  private setPointer(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1)
    this.raycaster.setFromCamera(this.pointer, this.camera)
  }

  private pickObject(clientX: number, clientY: number): string | null {
    this.setPointer(clientX, clientY)
    const hit = this.raycaster.intersectObjects(this.objectsGroup.children, true)[0]
    let obj: THREE.Object3D | null = hit?.object ?? null
    while (obj && !obj.userData.objectId) obj = obj.parent
    return (obj?.userData.objectId as string) ?? null
  }

  private handlePointerDown = (e: PointerEvent) => {
    this.pointerDown = { x: e.clientX, y: e.clientY }
    this.cameraGlide = null
  }

  /**
   * Editor: an object moves only once it's selected. Pressing an unselected
   * object does nothing here (a click selects it on release, a drag orbits
   * the camera); pressing the selected one starts dragging it.
   */
  private handleEditPointerDown = (e: PointerEvent) => {
    // A second finger turns the gesture into pan/zoom
    if (this.drag) {
      this.cancelDrag()
      return
    }
    if (e.button !== 0) return
    const id = this.pickObject(e.clientX, e.clientY)
    if (!id || id !== this.selectedId) return
    const entry = this.entries.get(id)
    if (!entry) return
    this.controls.enabled = false

    const offset = new THREE.Vector3()
    if (!entry.item.wallMounted) {
      const grab = this.surfaceTarget(e.clientX, e.clientY, entry.root)
      if (grab) offset.set(entry.root.position.x - grab.position[0], 0, entry.root.position.z - grab.position[2])
    }
    entry.root.userData.wall = entry.data.wall
    const riders = this.findRiders(entry).map(r => ({ entry: r, offset: r.root.position.clone().sub(entry.root.position) }))
    this.drag = { id, startX: e.clientX, startY: e.clientY, active: false, offset, riders }
    this.renderer.domElement.setPointerCapture(e.pointerId)
  }

  private handlePointerUp = (e: PointerEvent) => {
    if (this.drag) {
      const { id, active, riders } = this.drag
      this.drag = null
      this.controls.enabled = true
      if (this.renderer.domElement.hasPointerCapture(e.pointerId)) this.renderer.domElement.releasePointerCapture(e.pointerId)
      this.renderer.domElement.style.cursor = 'grab'
      if (active) this.commitDrag(id, riders.map(r => r.entry))
      return
    }
    // Ignore drags (orbiting or panning)
    if (Math.hypot(e.clientX - this.pointerDown.x, e.clientY - this.pointerDown.y) > 5) return
    if (!this.options.editable) {
      const guestId = this.pickGuest(e.clientX, e.clientY)
      if (guestId) {
        this.options.onGuestActivate?.(guestId)
        return
      }
    }
    const id = this.pickObject(e.clientX, e.clientY)
    if (this.options.editable) {
      this.select(id)
      this.options.onSelect?.(id)
    } else if (id) {
      this.options.onActivate?.(id)
    }
  }

  private handlePointerMove = (e: PointerEvent) => {
    this.updateAttractor(e.clientX, e.clientY)
    if (this.options.editable) {
      if (this.drag) {
        if (!this.drag.active && Math.hypot(e.clientX - this.drag.startX, e.clientY - this.drag.startY) > 4) {
          this.drag.active = true
        }
        if (this.drag.active) {
          this.renderer.domElement.style.cursor = 'grabbing'
          this.moveDragged(e.clientX, e.clientY)
        }
        return
      }
      if (e.buttons) return
      // Pointer: click to select; grab: the selected object can be dragged
      const hovered = this.pickObject(e.clientX, e.clientY)
      this.renderer.domElement.style.cursor = !hovered ? '' : hovered === this.selectedId ? 'grab' : 'pointer'
      return
    }
    const id = this.pickObject(e.clientX, e.clientY)
    const data = id ? this.entries.get(id)?.data : undefined
    const clickable = !!(data?.link?.url || data?.image || (data?.productId && this.products.has(data.productId)))
    const rect = this.renderer.domElement.getBoundingClientRect()
    const guestId = clickable ? null : this.pickGuest(e.clientX, e.clientY)
    if (guestId !== this.hoveredGuest || guestId) {
      this.hoveredGuest = guestId
      this.options.onGuestHover?.(guestId, e.clientX - rect.left, e.clientY - rect.top)
    }
    this.renderer.domElement.style.cursor = clickable || guestId ? 'pointer' : 'grab'
    const nextId = clickable ? id : null
    if (nextId !== this.hoveredId || nextId) {
      this.hoveredId = nextId
      this.options.onHover?.(nextId, e.clientX - rect.left, e.clientY - rect.top)
    }
  }

  private handlePointerCancel = () => {
    this.cancelDrag()
  }

  private handlePointerLeave = () => {
    this.land?.setAttractor?.(null)
    if (this.hoveredGuest) {
      this.hoveredGuest = null
      this.options.onGuestHover?.(null, 0, 0)
    }
    if (this.hoveredId) {
      this.hoveredId = null
      this.options.onHover?.(null, 0, 0)
    }
  }

  // ---------- Render loop ----------

  private resize() {
    const { clientWidth, clientHeight } = this.container
    if (!clientWidth || !clientHeight) return
    this.renderer.setSize(clientWidth, clientHeight, false)
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.camera.aspect = clientWidth / clientHeight
    // Pull back on narrow screens so the whole room fits
    this.camera.fov = clientWidth / clientHeight < 0.8 ? 46 : clientWidth / clientHeight < 1.3 ? 38 : 32
    this.camera.updateProjectionMatrix()
    this.markActive()
  }

  /**
   * Opening shot progress 0..1: the camera starts so far away that the land is
   * a speck, then flies in along the default view direction (swinging around a
   * little) until it reaches the widest zoom, where it stops.
   */
  private placeIntroCamera(progress: number) {
    const ease = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
    // Interpolate distance in log space so the approach feels like a steady flight
    const distance = Math.exp(THREE.MathUtils.lerp(Math.log(INTRO_DISTANCE), Math.log(MAX_ZOOM_DISTANCE), ease))
    const azimuth = Math.PI / 4 + 0.5 * (1 - ease)
    const polar = 1.0 - 0.25 * (1 - ease)
    this.controls.target.set(0, 1, 0)
    this.camera.position.setFromSphericalCoords(distance, polar, azimuth).add(this.controls.target)
    this.camera.lookAt(this.controls.target)
  }

  private updateIntro(now: number) {
    if (!this.intro) return
    // Hold on the distant view for a moment so the land's models can load
    this.intro.start ??= now + INTRO_HOLD
    const progress = THREE.MathUtils.clamp((now - this.intro.start) / INTRO_DURATION, 0, 1)
    this.placeIntroCamera(progress)
    if (progress >= 1) {
      this.intro = null
      this.controls.maxDistance = MAX_ZOOM_DISTANCE
      this.controls.enabled = true
    }
  }

  /** Something changed: render at full frame rate for a moment */
  private markActive = () => {
    this.activeUntil = performance.now() + 1500
  }

  private applyQuality() {
    const level = QUALITY_LEVELS[this.quality]!
    // A recording is always full resolution (1080x1920 from a 540x960 box)
    this.renderer.setPixelRatio(this.options.capture ? 2 : Math.min(window.devicePixelRatio, level.pixelRatio))
    this.renderer.shadowMap.enabled = level.shadows
    if (this.sun.shadow.mapSize.x !== level.shadowSize) {
      this.sun.shadow.mapSize.set(level.shadowSize, level.shadowSize)
      this.sun.shadow.map?.dispose()
      this.sun.shadow.map = null
    }
    this.resize()
  }

  /**
   * Watch how long frames actually take compared to the target. If the device
   * keeps falling behind, step down resolution and shadow quality.
   */
  private trackPerformance(interval: number, target: number) {
    // Skip the first seconds: models and shaders loading cause hitches that aren't representative
    if (this.options.capture || this.quality >= QUALITY_LEVELS.length - 1 || performance.now() - this.startedAt < 5000) return
    this.frameRatios.push(interval / target)
    if (this.frameRatios.length < 120) return
    const sorted = [...this.frameRatios].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]!
    this.frameRatios = []
    if (median > 1.8) {
      this.quality++
      this.applyQuality()
    }
  }

  private animate = (now: number = performance.now()) => {
    if (this.disposed) return
    this.frame = requestAnimationFrame(this.animate)
    // A recording draws its own frames
    if (!this.onScreen || this.options.capture || this.paused) return
    // 60 fps while interacting, 30 fps for ambient motion, 15 fps for previews
    const active = now < this.activeUntil || !!this.cameraGlide || !!this.drag?.active || !!this.intro || this.loadingMarkers.size > 0
    const fps = this.options.preview ? 15 : active ? 60 : 30
    this.statsCap = fps
    const target = 1000 / fps
    const interval = now - this.lastRender
    if (interval < target - 2) return
    if (this.lastRender && interval < 250) this.trackPerformance(interval, target)
    this.lastRender = now
    this.renderFrame(now)
  }

  private renderFrame(now: number) {
    const dt = Math.min(this.clock.getDelta(), 0.1)
    const time = this.clock.elapsedTime
    if (this.room) {
      this.applyDaylight(this.daylightOverride ?? getDaylight(this.room.environment))
    }
    this.stars.material.uniforms.time!.value = time
    flameTime.value = time
    this.land?.update(time, dt, this.shownDaylight ?? 1, this.lamps)
    const entry = this.selectedId ? this.entries.get(this.selectedId) : undefined
    if (entry) this.selectionBox.box.setFromObject(entry.root)
    if (this.cameraGlide) {
      this.controls.target.lerp(this.cameraGlide.target, 0.12)
      this.camera.position.lerp(this.cameraGlide.position, 0.12)
      if (this.controls.target.distanceTo(this.cameraGlide.target) < 0.01) this.cameraGlide = null
    }
    if (this.intro) this.updateIntro(now)
    else if (!this.touring) this.controls.update()
    this.updateObjectEffects(now)
    this.updateGuests(now, time)
    this.keepSkyAroundCamera()
    this.renderer.render(this.scene, this.camera)
    this.reportStats(now)
  }

  private reportStats(now: number) {
    if (!this.options.onStats) return
    this.statsFrames++
    if (!this.statsSince) this.statsSince = now
    if (now - this.statsSince < 1000) return
    const { render } = this.renderer.info
    this.options.onStats({
      fps: Math.round((this.statsFrames * 1000) / (now - this.statsSince)),
      cap: this.statsCap,
      drawCalls: render.calls,
      triangles: render.triangles,
    })
    this.statsFrames = 0
    this.statsSince = now
  }

  /**
   * The sky dome and stars travel with the camera like a skybox, and fog and
   * the far plane stretch when the camera is far out (the intro's start).
   */
  private keepSkyAroundCamera() {
    this.skyDome.mesh.position.copy(this.camera.position)
    this.stars.points.position.copy(this.camera.position)
    const extra = Math.max(0, this.camera.position.distanceTo(this.controls.target) - MAX_ZOOM_DISTANCE)
    const fog = this.scene.fog as THREE.Fog | null
    if (fog) {
      fog.near = 30 + extra
      fog.far = 90 + extra
    }
    const far = 200 + extra
    if (this.camera.far !== far) {
      this.camera.far = far
      this.camera.updateProjectionMatrix()
    }
  }

  private applyDaylight({ daylight: target, isDay, arc }: DaylightState) {
    this.shownDaylight = this.shownDaylight === null
      ? target
      : this.shownDaylight + (target - this.shownDaylight) * 0.06
    const d = this.shownDaylight
    // Sky: night -> dusk -> day
    const sky = this.land?.sky
    if (sky) {
      if (d < 0.5) this.skyColor.copy(sky.night).lerp(sky.dusk, d * 2)
      else this.skyColor.copy(sky.dusk).lerp(sky.day, (d - 0.5) * 2)
    }
    this.scene.background = this.skyColor
    this.skyDome.setColor(this.skyColor)
    if (!this.scene.fog) this.scene.fog = new THREE.Fog(this.skyColor, 30, 90)
    ;(this.scene.fog as THREE.Fog).color.copy(this.skyColor)

    // Sun or moon travels an arc behind the room, rising on the right
    const angle = Math.PI * (0.08 + 0.84 * arc)
    const arcPos = new THREE.Vector3(Math.cos(angle) * 22 - 14, Math.sin(angle) * 16 + 2, -Math.cos(angle) * 22 - 14)
    // The directional light comes in from the open side so the room is lit
    this.sun.position.set(Math.cos(angle) * 8 + 10, Math.max(Math.sin(angle) * 16, 3) + 5, 12)
    this.sun.color.copy(isDay ? SUN_COLOR : MOON_COLOR)

    const atmosphere = this.land?.atmosphere
    if (atmosphere) {
      // Physical sky: sun height follows daylight so dusk turns orange naturally
      const sunDir = this.sun.position.clone().normalize()
      const skyDir = new THREE.Vector3(sunDir.x, THREE.MathUtils.lerp(-0.15, sunDir.y, d), sunDir.z).normalize()
      {
        const u = this.envSky.material.uniforms
        u.turbidity!.value = atmosphere.turbidity
        u.rayleigh!.value = atmosphere.rayleigh
        u.mieCoefficient!.value = atmosphere.mie
        u.mieDirectionalG!.value = 0.8
        u.sunPosition!.value.copy(skyDir)
      }
      this.updateEnvironment(`${Math.round(skyDir.y * 40)}|${Math.round(skyDir.x * 8)}|${atmosphere.turbidity}`)
      // The physical sky is very bright (HDR), so its light is scaled down
      this.scene.environmentIntensity = 0.08 + 0.32 * d
      // Image-based light does the fill; keep flat ambient low so colours stay rich
      this.hemi.intensity = 0.08 + 0.3 * d
      this.ambient.intensity = 0.03 + 0.05 * d
      this.sun.intensity = isDay ? 0.6 + 3.2 * d : 0.3 * (1 - d) + 0.05
      this.sunDisc.visible = false
    } else {
      if (this.scene.environment) {
        this.scene.environment = null
        this.envKey = ''
      }
      this.hemi.intensity = 0.15 + 0.9 * d
      this.ambient.intensity = 0.06 + 0.2 * d
      this.sun.intensity = isDay ? 0.4 + 2.2 * d : 0.25 * (1 - d) + 0.05
      this.sunDisc.visible = isDay
    }
    this.hemi.color.copy(this.skyColor).lerp(new THREE.Color('#ffffff'), 0.5)
    this.renderer.toneMappingExposure = atmosphere ? 0.75 + 0.1 * d : 1 + 0.1 * d
    this.moonDisc.visible = !isDay
    ;(isDay ? this.sunDisc : this.moonDisc).position.copy(arcPos)

    this.stars.material.uniforms.opacity!.value = this.land?.starsAlways ? 1 : Math.max(0, 1 - d * 1.6)

    // Lamps fade in as it gets dark
    const lamps = THREE.MathUtils.smoothstep(0.6 - d, 0, 0.45)
    this.lamps = lamps
    for (const entry of this.entries.values()) {
      if (entry.light && entry.item.light && entry.revealedAt !== null) {
        const flicker = entry.item.light.flicker ? flameFlicker(flameTime.value, entry.root.position.x * 7 + entry.root.position.z * 3) : 1
        entry.light.intensity = entry.item.light.intensity * lamps * (entry.data.scale || 1) * flicker
      }
      for (const m of entry.glowMaterials) {
        m.emissiveIntensity = (m.userData.baseGlow as number) + ((m.userData.nightGlow as number | undefined) ?? 2.4) * lamps
      }
      for (const m of entry.skyMaterials) {
        m.color.copy(this.skyColor)
        m.emissive.copy(this.skyColor)
        m.emissiveIntensity = 0.25 + 0.55 * d
      }
    }
  }

  /** Re-render the sky into the environment map when the sun has moved */
  private updateEnvironment(key: string) {
    if (key === this.envKey) return
    this.envKey = key
    const target = this.pmrem.fromScene(this.envScene, 0.04)
    this.envTarget?.dispose()
    this.envTarget = target
    this.scene.environment = target.texture
  }

  // ---------- Cleanup helpers ----------

  private clearGroup(group: THREE.Object3D) {
    for (const child of [...group.children]) {
      child.traverse((obj) => {
        // Model geometry/materials are cached and shared between lands
        if (obj.userData.shared) return
        const mesh = obj as THREE.Mesh
        mesh.geometry?.dispose()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(material)) material.forEach(m => this.disposeMaterial(m))
        else if (material) this.disposeMaterial(material)
      })
      group.remove(child)
    }
  }

  private disposeMaterial(material: THREE.Material) {
    const map = (material as THREE.MeshStandardMaterial).map
    map?.dispose()
    material.dispose()
  }
}


/** Gradient sky dome: deeper blue overhead, light at the horizon, rich below it */
function createSkyDome() {
  const uniforms = {
    zenith: { value: new THREE.Color() },
    horizon: { value: new THREE.Color() },
    below: { value: new THREE.Color() },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 zenith;
      uniform vec3 horizon;
      uniform vec3 below;
      varying vec3 vDir;
      void main() {
        float y = vDir.y;
        vec3 color = y > 0.0
          ? mix(horizon, zenith, smoothstep(0.0, 0.55, y))
          : mix(horizon, below, smoothstep(0.0, 0.5, -y));
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(95, 32, 16), material)
  mesh.renderOrder = -1
  const white = new THREE.Color('#ffffff')
  return {
    mesh,
    setColor(base: THREE.Color) {
      uniforms.zenith.value.copy(base).offsetHSL(0, 0.08, -0.14)
      uniforms.horizon.value.copy(base).lerp(white, 0.35)
      uniforms.below.value.copy(base).offsetHSL(0, 0.12, -0.04)
    },
  }
}
