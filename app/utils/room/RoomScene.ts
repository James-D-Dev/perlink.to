import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import type { LandId, RoomConfig, RoomObject, RoomStyle, WallSide } from '~/types/room'
import { CATALOG_BY_TYPE, type CatalogItem } from './catalog'
import { getDaylight, type DaylightState } from './daylight'
import { buildLand, createStarSphere, type LandInstance } from './lands'
import { buildRoomShell, FLOOR_THICKNESS } from './shell'

export { createFloorTexture } from './shell'

export type ObjectPatch = Pick<RoomObject, 'position' | 'rotation'> & { wall?: WallSide }

export interface RoomSceneOptions {
  editable: boolean
  /** Small, non-interactive preview: low frame rate and quality */
  preview?: boolean
  /** Opening shot: start far away with the land tiny, then fly in to the widest zoom */
  intro?: boolean
  onSelect?: (id: string | null) => void
  onObjectChange?: (id: string, patch: ObjectPatch) => void
  onHover?: (id: string | null, x: number, y: number) => void
  onActivate?: (id: string) => void
}

interface ObjectEntry {
  data: RoomObject
  item: CatalogItem
  root: THREE.Group
  light?: THREE.PointLight
  glowMaterials: THREE.MeshStandardMaterial[]
  skyMaterials: THREE.MeshStandardMaterial[]
  signature: string
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
  /** Daylight actually shown; eases toward the target for smooth day/night switches */
  private shownDaylight: number | null = null
  private skyColor = new THREE.Color()

  // Performance: render on demand at a frame rate that matches what's happening
  private visibilityObserver: IntersectionObserver
  private onScreen = true
  private lastRender = 0
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
    this.scene.add(this.sunDisc, this.moonDisc, this.stars.points, this.shell, this.objectsGroup, this.outdoor)

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
    this.quality = options.preview ? 3 : coarse || memory < 4 ? 2 : 0
    this.applyQuality()

    // Stop rendering while the canvas is scrolled out of view
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.onScreen = !!entry?.isIntersecting
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
    this.land = buildLand(landId, { style, groundY: -FLOOR_THICKNESS })
    this.outdoor.add(this.land.group)
  }

  // ---------- Objects ----------

  private syncObjects(objects: RoomObject[]) {
    const seen = new Set<string>()
    for (const data of objects) {
      const item = CATALOG_BY_TYPE[data.type]
      if (!item) continue
      seen.add(data.id)
      const signature = `${data.type}|${data.color || ''}`
      const existing = this.entries.get(data.id)
      if (existing && existing.signature === signature) {
        existing.data = data
        if (!(this.drag?.active && this.drag.id === data.id)) this.applyTransform(existing)
        continue
      }
      if (existing) this.removeEntry(data.id)
      this.addEntry(data, item, signature)
    }
    for (const id of [...this.entries.keys()]) {
      if (!seen.has(id)) this.removeEntry(id)
    }
    if (this.selectedId && !this.entries.has(this.selectedId)) this.selectedId = null
    this.selectionBox.visible = !!this.selectedId
  }

  private addEntry(data: RoomObject, item: CatalogItem, signature: string) {
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
    // Model-based items load asynchronously; pick up their glowing parts when ready
    ;(model.userData.ready as Promise<void> | undefined)?.then(collectMaterials).catch(() => {})

    let light: THREE.PointLight | undefined
    const lightCount = [...this.entries.values()].filter(e => e.light).length
    if (item.light && lightCount < MAX_POINT_LIGHTS) {
      light = new THREE.PointLight(item.light.color, 0, item.light.distance, 1.6)
      light.position.set(...item.light.offset)
      root.add(light)
    }

    const entry: ObjectEntry = { data, item, root, light, glowMaterials, skyMaterials, signature }
    this.entries.set(data.id, entry)
    this.objectsGroup.add(root)
    this.applyTransform(entry)
  }

  private removeEntry(id: string) {
    const entry = this.entries.get(id)
    if (!entry) return
    this.objectsGroup.remove(entry.root)
    this.clearGroup(entry.root)
    this.entries.delete(id)
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
    }
  }

  private commitDrag(id: string) {
    const entry = this.entries.get(id)
    if (!entry) return
    const p = entry.root.position
    const round = (n: number) => Math.round(n * 1000) / 1000
    const patch: ObjectPatch = { position: [round(p.x), round(p.y), round(p.z)], rotation: entry.data.rotation }
    if (entry.item.wallMounted) patch.wall = (entry.root.userData.wall as WallSide | undefined) ?? entry.data.wall ?? 'back'
    this.options.onObjectChange?.(id, patch)
  }

  private cancelDrag() {
    if (!this.drag) return
    const entry = this.entries.get(this.drag.id)
    if (entry) this.applyTransform(entry)
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

  /** Editor: pressing on an object selects it and starts dragging it */
  private handleEditPointerDown = (e: PointerEvent) => {
    // A second finger turns the gesture into pan/zoom
    if (this.drag) {
      this.cancelDrag()
      return
    }
    if (e.button !== 0) return
    const id = this.pickObject(e.clientX, e.clientY)
    if (!id) return
    const entry = this.entries.get(id)
    if (!entry) return
    this.controls.enabled = false
    this.select(id)
    this.options.onSelect?.(id)

    const offset = new THREE.Vector3()
    if (!entry.item.wallMounted) {
      const grab = this.surfaceTarget(e.clientX, e.clientY, entry.root)
      if (grab) offset.set(entry.root.position.x - grab.position[0], 0, entry.root.position.z - grab.position[2])
    }
    entry.root.userData.wall = entry.data.wall
    this.drag = { id, startX: e.clientX, startY: e.clientY, active: false, offset }
    this.renderer.domElement.setPointerCapture(e.pointerId)
  }

  private handlePointerUp = (e: PointerEvent) => {
    if (this.drag) {
      const { id, active } = this.drag
      this.drag = null
      this.controls.enabled = true
      if (this.renderer.domElement.hasPointerCapture(e.pointerId)) this.renderer.domElement.releasePointerCapture(e.pointerId)
      this.renderer.domElement.style.cursor = 'grab'
      if (active) this.commitDrag(id)
      return
    }
    // Ignore drags (orbiting or panning)
    if (Math.hypot(e.clientX - this.pointerDown.x, e.clientY - this.pointerDown.y) > 5) return
    const id = this.pickObject(e.clientX, e.clientY)
    if (this.options.editable) {
      this.select(id)
      this.options.onSelect?.(id)
    } else if (id) {
      this.options.onActivate?.(id)
    }
  }

  private handlePointerMove = (e: PointerEvent) => {
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
      this.renderer.domElement.style.cursor = this.pickObject(e.clientX, e.clientY) ? 'grab' : ''
      return
    }
    const id = this.pickObject(e.clientX, e.clientY)
    const hasLink = id ? !!this.entries.get(id)?.data.link?.url : false
    this.renderer.domElement.style.cursor = hasLink ? 'pointer' : 'grab'
    const rect = this.renderer.domElement.getBoundingClientRect()
    const nextId = hasLink ? id : null
    if (nextId !== this.hoveredId || nextId) {
      this.hoveredId = nextId
      this.options.onHover?.(nextId, e.clientX - rect.left, e.clientY - rect.top)
    }
  }

  private handlePointerCancel = () => {
    this.cancelDrag()
  }

  private handlePointerLeave = () => {
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, level.pixelRatio))
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
    if (this.quality >= QUALITY_LEVELS.length - 1 || performance.now() - this.startedAt < 5000) return
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
    if (!this.onScreen) return
    // 60 fps while interacting, 30 fps for ambient motion, 15 fps for previews
    const active = now < this.activeUntil || !!this.cameraGlide || !!this.drag?.active || !!this.intro
    const fps = this.options.preview ? 15 : active ? 60 : 30
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
    this.land?.update(time, dt, this.shownDaylight ?? 1, this.lamps)
    const entry = this.selectedId ? this.entries.get(this.selectedId) : undefined
    if (entry) this.selectionBox.box.setFromObject(entry.root)
    if (this.cameraGlide) {
      this.controls.target.lerp(this.cameraGlide.target, 0.12)
      this.camera.position.lerp(this.cameraGlide.position, 0.12)
      if (this.controls.target.distanceTo(this.cameraGlide.target) < 0.01) this.cameraGlide = null
    }
    if (this.intro) this.updateIntro(now)
    else this.controls.update()
    this.keepSkyAroundCamera()
    this.renderer.render(this.scene, this.camera)
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
      if (entry.light && entry.item.light) {
        entry.light.intensity = entry.item.light.intensity * lamps * (entry.data.scale || 1)
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
