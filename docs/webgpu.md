# WebGPU for the 3D rooms (experimental)

The rooms render with the classic `WebGLRenderer`. Add `?gpu=1` to any page
with a room to switch to three.js' `WebGPURenderer` on WebGPU (where the
browser has it and a usable GPU adapter; otherwise it stays on classic WebGL,
not `WebGPURenderer`'s own WebGL 2 fallback, which is several times slower on
our scenes: it emulates WebGPU's pipelines and bind groups in JavaScript on
top of WebGL). It was the default for a day and lagged on phones.

The choice is remembered in the browser (`localStorage`, key
`perlink:renderer`):

- `?gpu=1`: WebGPU
- `?gpu=webgl2`: `WebGPURenderer` forced onto its WebGL 2 fallback, to test it
- `?gpu=0`: back to classic WebGL

The console logs `[room] renderer: webgpu` (or `webgl2`) and the time of the
first frame; the editor's FPS chip shows the renderer (WebGL / WebGPU /
WebGL 2).

How it's built (`app/utils/room/gpu.ts`):

- One switch for everything. `WebGPURenderer` can't draw hand-written GLSL
  materials and `WebGLRenderer` can't draw node (TSL) materials, so once the
  kit is loaded every room renderer (scene, video recorder, thumbnails) is a
  `WebGPURenderer` and every custom material is made in its TSL version.
- The WebGPU code (`three/webgpu`, `three/tsl`, `nodeMaterials.ts`) is loaded
  lazily, only after `navigator.gpu.requestAdapter()` returned an adapter;
  both builds share `three.core.js`.
- TSL twins of the GLSL pieces live in `app/utils/room/nodeMaterials.ts`:
  flames, the gradient sky dome, the physical sky (`SkyMesh`), stars, water,
  foliage wind sway, and sized points (fireflies, snow) — WebGPU draws point
  primitives 1 px wide, so those become instanced sprites.
- New scenery and lands are compiled (`compileOffscreen`) before they join
  the scene, so the frame they appear in doesn't stall. WebGPU's
  `compileAsync` skips hidden and culled objects, so they're shown and
  unculled for that walk.
- Freeing resources: `RoomScene.clearGroup` and `dispose` never free cached
  models (`userData.shared`) or sprite geometry (all sprites share one).
  Another room on the page (the editor, while the video recorder has its own
  scene) may still be drawing them, and WebGPU drops every frame that uses a
  freed buffer, where WebGL quietly re-uploads it.
