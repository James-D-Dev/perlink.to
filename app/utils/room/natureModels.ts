import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Low-poly nature models from Quaternius' Stylized Nature MegaKit (CC0),
// served from /public/models/nature. Each model type is drawn as instanced
// meshes so a land can scatter hundreds of plants cheaply.

const BASE = '/models/nature/'

interface ModelPart {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  /** Part transform relative to the model root */
  matrix: THREE.Matrix4
}

interface LoadedModel {
  parts: ModelPart[]
  /** Model height in its own units, used to scale to a target height */
  height: number
}

export interface ScatterItem {
  x: number
  y: number
  z: number
  /** Target height in meters */
  height: number
  rotation?: number
}

/** Shared wind clock for swaying grass, leaves and flowers (seconds) */
export const natureWind = { value: 0 }

/** Make cut-out foliage sway: the higher a vertex, the more it moves */
function addWindSway(material: THREE.Material) {
  if (material.userData.wind) return
  material.userData.wind = true
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWindTime = natureWind
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWindTime;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float swayH = max(position.y, 0.0);
        float seed = 0.0;
        #ifdef USE_INSTANCING
          seed = instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.9;
        #endif
        transformed.x += sin(uWindTime * 1.7 + seed) * swayH * 0.035;
        transformed.z += cos(uWindTime * 1.3 + seed * 1.3) * swayH * 0.025;`)
  }
  material.needsUpdate = true
}

const loader = new GLTFLoader()
const cache = new Map<string, Promise<LoadedModel>>()
const textureCache = new Map<string, THREE.Texture>()

function loadModel(name: string): Promise<LoadedModel> {
  let promise = cache.get(name)
  if (!promise) {
    promise = loader.loadAsync(`${BASE}${name}.gltf`).then((gltf) => {
      gltf.scene.updateMatrixWorld(true)
      const parts: ModelPart[] = []
      const box = new THREE.Box3()
      gltf.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        const material = mesh.material as THREE.MeshStandardMaterial
        // Leaf/flower cards: cut out by alpha, visible from both sides
        if (material.alphaTest > 0 || material.transparent) {
          material.alphaTest = 0.5
          material.transparent = false
          // Uses MSAA samples to smooth the cut-out edges, so leaves don't flicker as they sway
          material.alphaToCoverage = true
          addWindSway(material)
        }
        material.side = THREE.DoubleSide
        parts.push({ geometry: mesh.geometry, material, matrix: mesh.matrixWorld.clone() })
        box.expandByObject(mesh)
      })
      return { parts, height: Math.max(box.max.y - box.min.y, 0.001) }
    })
    cache.set(name, promise)
  }
  return promise
}

function loadTexture(file: string) {
  let texture = textureCache.get(file)
  if (!texture) {
    texture = new THREE.TextureLoader().load(`${BASE}${file}`)
    texture.colorSpace = THREE.SRGBColorSpace
    // glTF textures are not flipped
    texture.flipY = false
    textureCache.set(file, texture)
  }
  return texture
}

/** Pink blossom material for the twisted trees (cherry) */
const cherryMaterials = new WeakMap<THREE.Material, THREE.Material>()
export function cherryLeaves(material: THREE.Material): THREE.Material {
  if (!material.name.startsWith('Leaves')) return material
  let pink = cherryMaterials.get(material)
  if (!pink) {
    const m = (material as THREE.MeshStandardMaterial).clone()
    m.map = loadTexture('Leaves_Cherry.png')
    m.emissive = new THREE.Color('#ffc2dc')
    m.emissiveMap = m.map
    m.emissiveIntensity = 0.07
    m.userData.shared = true
    m.userData.wind = false
    addWindSway(m)
    cherryMaterials.set(material, m)
    pink = m
  }
  return pink
}

/** Green leaves for models whose own leaf texture is the red twisted-tree one (Bush_Common) */
const greenMaterials = new WeakMap<THREE.Material, THREE.Material>()
export function greenLeaves(material: THREE.Material): THREE.Material {
  if (!material.name.startsWith('Leaves')) return material
  let green = greenMaterials.get(material)
  if (!green) {
    const m = (material as THREE.MeshStandardMaterial).clone()
    m.map = loadTexture('Leaves_NormalTree_C.png')
    m.userData.shared = true
    m.userData.wind = false
    addWindSway(m)
    greenMaterials.set(material, m)
    green = m
  }
  return green
}

/**
 * Add instanced copies of a model to `group` once it has loaded.
 * Resources are shared between lands, so meshes are marked to skip disposal.
 */
/** Side length of the culling cells scattered instances are grouped into (meters) */
const CHUNK_SIZE = 11

export async function scatterModel(
  group: THREE.Group,
  name: string,
  items: ScatterItem[],
  options: { castShadow?: boolean; material?: (m: THREE.Material) => THREE.Material } = {},
) {
  if (!items.length) return
  const model = await loadModel(name)
  const place = new THREE.Matrix4()
  const quat = new THREE.Quaternion()
  const yAxis = new THREE.Vector3(0, 1, 0)
  // Group instances into ~11 m cells so batches far out of view are skipped;
  // smaller cells cull more but cost a draw call per cell and model part
  // and the camera skips the ones that are out of view
  const cells = new Map<string, ScatterItem[]>()
  for (const item of items) {
    const key = `${Math.floor(item.x / CHUNK_SIZE)},${Math.floor(item.z / CHUNK_SIZE)}`
    const cell = cells.get(key)
    if (cell) cell.push(item)
    else cells.set(key, [item])
  }
  for (const part of model.parts) {
    const material = options.material ? options.material(part.material) : part.material
    const std = material as THREE.MeshStandardMaterial
    // Shadows follow the leaf cut-outs instead of solid cards
    const depthMaterial = std.alphaTest > 0 && std.map
      ? new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: std.map, alphaTest: std.alphaTest })
      : undefined
    for (const cell of cells.values()) {
      const mesh = new THREE.InstancedMesh(part.geometry, material, cell.length)
      cell.forEach((item, i) => {
        const s = item.height / model.height
        quat.setFromAxisAngle(yAxis, item.rotation ?? 0)
        place.compose(new THREE.Vector3(item.x, item.y, item.z), quat, new THREE.Vector3(s, s, s)).multiply(part.matrix)
        mesh.setMatrixAt(i, place)
      })
      mesh.computeBoundingSphere()
      mesh.castShadow = options.castShadow ?? true
      mesh.receiveShadow = true
      if (depthMaterial) mesh.customDepthMaterial = depthMaterial
      mesh.userData.shared = true
      group.add(mesh)
    }
  }
}

export interface NaturePiece {
  /** Model file name, e.g. 'Flower_3_Group' */
  model: string
  /** Target height in meters */
  height: number
  x?: number
  y?: number
  z?: number
  rotation?: number
  /** Swap materials, e.g. greenLeaves */
  material?: (material: THREE.Material) => THREE.Material
}

/**
 * Place nature models as ordinary room objects (decor), each piece scaled to
 * its target height with its base at `y`. Geometry and materials stay shared
 * with the land scenery, so meshes are marked to skip disposal.
 */
export async function attachNaturePieces(group: THREE.Group, pieces: NaturePiece[]) {
  const models = await Promise.all(pieces.map(p => loadModel(p.model)))
  const place = new THREE.Matrix4()
  const quat = new THREE.Quaternion()
  const yAxis = new THREE.Vector3(0, 1, 0)
  pieces.forEach((piece, i) => {
    const model = models[i]!
    const s = piece.height / model.height
    // Lift so the lowest point of the model sits on the base
    const minY = Math.min(...model.parts.map((part) => {
      part.geometry.computeBoundingBox()
      return part.geometry.boundingBox!.clone().applyMatrix4(part.matrix).min.y
    }))
    quat.setFromAxisAngle(yAxis, piece.rotation ?? 0)
    const base = new THREE.Matrix4().compose(
      new THREE.Vector3(piece.x ?? 0, (piece.y ?? 0) - minY * s, piece.z ?? 0),
      quat,
      new THREE.Vector3(s, s, s),
    )
    for (const part of model.parts) {
      const material = piece.material ? piece.material(part.material) : part.material
      const mesh = new THREE.Mesh(part.geometry, material)
      place.multiplyMatrices(base, part.matrix)
      place.decompose(mesh.position, mesh.quaternion, mesh.scale)
      mesh.castShadow = true
      mesh.receiveShadow = true
      const std = material as THREE.MeshStandardMaterial
      if (std.alphaTest > 0 && std.map) {
        mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: std.map, alphaTest: std.alphaTest })
      }
      mesh.userData.shared = true
      group.add(mesh)
    }
  })
}
