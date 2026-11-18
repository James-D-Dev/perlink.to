# 3D room models

The 3D rooms draw most furniture from model files in `public/models/furniture/`, one `.glb` per catalog item (`bed.glb`, `sofa.glb`…). The other items are still built from boxes and cylinders in code (`app/utils/room/catalog.ts`).

## Where things live

| What | Where |
|---|---|
| Model files | `public/models/furniture/<type>.glb` |
| Versions and sources | `app/utils/room/modelManifest.ts` (`FURNITURE_MODELS`) |
| Loader (tinting, glow, sky) | `app/utils/room/furnitureModels.ts` |
| Catalog entry (name, colour, light) | `app/utils/room/catalog.ts`, `build: color => furnitureModel('<type>', color)` |
| Flowers for vases and pots | `public/models/flowers/<name>.glb`, `FLOWER_MODELS` in the manifest, loader `app/utils/room/flowerModels.ts` |
| Draco decoder | `public/draco/` (copied from `three/examples/jsm/libs/draco/gltf/`) |

## Updating a model

1. Make the new file in Blender (below) and export it over the old one, same name.
2. In `modelManifest.ts`, bump that model's `v` (1 → 2) and update `from` if the source changed.
3. Deploy. The URL becomes `/models/furniture/<type>.glb?v=2`, a new address, so browsers fetch the new file at once. Without the bump they could keep the old file for up to 30 days (`public/_headers` caches `/models/*` for a month). The editor's tray thumbnails are redrawn on their own.

A new model is the same, plus a new entry in `FURNITURE_MODELS` and its catalog item's `build`.

If you change how a box-built item looks (for example the wall clock), bump `CATALOG_REVISION` in `modelManifest.ts` so the tray thumbnails are redrawn.

## Model conventions

- One mesh, in metres, faced so its front looks at the camera: −Y in Blender, which is +Z in three.js.
- Floor items: origin at the centre of the base.
- Wall items (`wallMounted` in the catalog): centred across and up/down, back on the wall (Blender y = 0, three z = 0).
- Size matches the box-built item it replaces, so rooms already saved don't shift.
- Material names have meaning to the loader:
  - `Tint`: painted with the colour picked in the editor. `TintDark` is a shade darker, for trims and folds.
  - Any name containing `Glow` lights up: lamp shades are faint by day and bright at night; names containing `Screen` glow soft blue all day. `TintGlow` is both tinted and glowing.
  - `Sky`: window glass that shows the sky (blue by day, dark at night).
  - Anything else keeps its colour and is shared by every copy.
- Matte surfaces: metallic 0 and roughness about 0.6, except real metal. The Poly Pizza glTF imports come in at metallic 0.4, which looks like plastic.
- For a lamp, put the catalog's `light.offset` at the centre of the glowing part.

## Making a model in Blender

The steps used so far, with the MCP for Blender connector (`claude mcp add blender -- uvx blender-mcp`):

1. Find a CC0 model on Poly Pizza (most Quaternius and Kenney models are CC0) and import it.
2. Check which way it faces. Kenney models often face +Y and need turning 180°.
3. Join its meshes, apply transforms, scale it to the catalog size and move the origin as above.
4. Rename and adjust materials as above. Split a screen or glass off into its own material if it shares one with the frame.
5. Export glTF binary with Draco compression (level 7, position 14 bits, normal 10 bits). Files are about 2–20 KB, the bookshelf 75 KB.
6. Import the exported `.glb` back to check it, look at it from the front and back, then place it in a room on perlink.to (and undo).

## Flowers

Tulip, rose, daisy and lavender were made in Blender for Perlink: one stem each, base at the origin. The petals use a material named `Petal`, painted per stem, so one model makes a mixed bouquet. The arrangements are in `catalog.ts`; `bouquet()` spreads stems by the golden angle and leans the outer ones out. v2 made the heads 1.7x larger so they read at room distance.
