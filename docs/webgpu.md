# WebGPU for the 3D rooms (experimental)

The rooms render with WebGL by default. Add `?gpu=1` to any page with a room
(a site's 3D view, the room editor) to switch to three.js' `WebGPURenderer`:
it uses WebGPU where the browser has it and falls back to WebGL 2 by itself.
The choice is remembered in the browser (`localStorage`, key `perlink:gpu`);
`?gpu=0` turns it off again. The console logs `[room] renderer: webgpu` (or
`webgl2` for the fallback).

How it's built (`app/utils/room/gpu.ts`):

- One switch for everything. `WebGPURenderer` can't draw hand-written GLSL
  materials and `WebGLRenderer` can't draw node (TSL) materials, so once the
  kit is loaded every room renderer (scene, video recorder, thumbnails) is a
  `WebGPURenderer` and every custom material is made in its TSL version.
- The WebGPU code (`three/webgpu`, `three/tsl`, `nodeMaterials.ts`) is loaded
  lazily, only when switched on; both builds share `three.core.js`.
- TSL twins of the GLSL pieces live in `app/utils/room/nodeMaterials.ts`:
  flames, the gradient sky dome, the physical sky (`SkyMesh`), stars, water,
  foliage wind sway, and sized points (fireflies, snow) — WebGPU draws point
  primitives 1 px wide, so those become instanced sprites.
- `RoomScene.clearGroup` only frees geometry/materials nothing else in the
  scene still uses (WebGPU drops a frame that uses a freed buffer; sprites
  share one built-in geometry).

Next step before making it the default: check performance and looks on a few
phones and laptops (both backends), and the video recorder.
