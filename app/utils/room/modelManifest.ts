// Every model file the 3D rooms load, with its version and where it came from.
//
// To update a model: export the new file over the old one (same name, see
// docs/3d-models.md), then bump its `v` here. The URL carries the version
// (`/models/furniture/sofa.glb?v=2`), so browsers fetch the new file at once
// while unchanged files stay cached for a year, and the editor's cached tray
// thumbnails are redrawn (MODELS_REVISION feeds their cache key).
//
// `from` records the source and licence (CC0 needs no credit, but we keep it).

export interface ModelFile {
  /** Bump on every change to the file */
  v: number
  from: string
}

export const FURNITURE_MODELS = {
  'bed': { v: 1, from: 'Quaternius "Bed King", poly.pizza/m/3kiLmRcb1o (CC0)' },
  'sofa': { v: 1, from: 'Quaternius "Couch Medium", poly.pizza/m/mWgQ94zhDZ (CC0)' },
  'desk': { v: 1, from: 'Quaternius "Desk", poly.pizza/m/V86Go2rlnq (CC0)' },
  'chair': { v: 1, from: 'Quaternius "Chair", poly.pizza/m/iMNqRzPwwe (CC0)' },
  'coffee-table': { v: 1, from: 'Quaternius "Table Round Small", poly.pizza/m/oEArSZykyi (CC0)' },
  'bookshelf': { v: 1, from: 'Quaternius "Bookcase with Books", poly.pizza/m/tACDGJ4CGW (CC0)' },
  'cabinet': { v: 1, from: 'Quaternius "Drawer", poly.pizza/m/8xZQEZL2w3 (CC0)' },
  'floor-lamp': { v: 1, from: 'Quaternius "Light Stand", poly.pizza/m/9L6lLUl9sD (CC0)' },
  'desk-lamp': { v: 1, from: 'Quaternius "Table Lamp", poly.pizza/m/9Mo3JruPHY (CC0)' },
  'tv': { v: 1, from: 'Kenney "Television" poly.pizza/m/9trLeWoBek on Quaternius "Drawer" poly.pizza/m/G1H0wnCHQf (CC0)' },
  'laptop': { v: 1, from: 'Kenney "Laptop", poly.pizza/m/GnbwSUiVty (CC0)' },
  'rug': { v: 1, from: 'Quaternius "Rug", poly.pizza/m/7H5qKjuxVY (CC0)' },
  'plant': { v: 1, from: 'Quaternius "Houseplant", poly.pizza/m/VtJh4Irl4w (CC0)' },
  'window': { v: 1, from: 'Quaternius "Window Large", poly.pizza/m/EipzkrS9nG (CC0)' },
} satisfies Record<string, ModelFile>

/** Flowers for vases and pots (stem base at the origin, about 0.3 m tall), made in Blender for Perlink */
export const FLOWER_MODELS = {
  // v2: heads 1.7x larger (lavender 1.25x), leaves 1.25x, so they read at room distance
  tulip: { v: 2, from: 'Made in Blender for Perlink (low-poly, 6 pointed petals)' },
  rose: { v: 2, from: 'Made in Blender for Perlink (three twisted petal rings)' },
  daisy: { v: 2, from: 'Made in Blender for Perlink (10 petals round a centre)' },
  lavender: { v: 2, from: 'Made in Blender for Perlink (spike of buds)' },
} satisfies Record<string, ModelFile>

export type FlowerName = keyof typeof FLOWER_MODELS

export const flowerModelUrl = (name: FlowerName) => `/models/flowers/${name}.glb?v=${FLOWER_MODELS[name].v}`

export type FurnitureModelName = keyof typeof FURNITURE_MODELS

/** URL of a furniture model, with its version */
export const furnitureModelUrl = (name: FurnitureModelName) => `/models/furniture/${name}.glb?v=${FURNITURE_MODELS[name].v}`

/**
 * Bump when a box-built catalog item changes the way it looks (the wall
 * clock, a container…); model files bump their own `v` above
 */
const CATALOG_REVISION = 41

/** Changes whenever any model or the catalog's look changes (tray thumbnail cache key) */
export const MODELS_REVISION = `${CATALOG_REVISION}.${[...Object.values(FURNITURE_MODELS), ...Object.values(FLOWER_MODELS)].reduce((sum, m) => sum + m.v, 0)}`
