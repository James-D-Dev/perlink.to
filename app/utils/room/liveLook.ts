import * as THREE from 'three'

// The rooms' everyday look (pmndrs postprocessing), on capable devices only:
// - ambient occlusion: soft contact shadows in corners and under furniture,
//   so objects sit on the floor instead of floating on it
// - bloom from what's bright enough to glow: lamps, neon, candles, screens
// - the scene's own Neutral tone mapping, a little contrast, a light vignette
//
// The room turns it off when its adaptive quality steps down (RoomScene), and
// it never runs on WebGPU, in previews, thumbnails or the video recorder
// (which has its own film look, ./cinematic).
//
// The scene renders into a half-float buffer (render targets skip the
// renderer's tone mapping), so tone mapping happens here, after the glow.

export interface LiveLook {
  render: (dt: number) => void
  dispose: () => void
}

export async function createLiveLook(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): Promise<LiveLook> {
  const pp = await import('postprocessing')
  const composer = new pp.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
    multisampling: Math.min(4, renderer.capabilities.maxSamples),
  })
  composer.addPass(new pp.RenderPass(scene, camera))

  // Normals at half resolution feed the ambient occlusion
  const normalPass = new pp.NormalPass(scene, camera, { resolutionScale: 0.5 })
  composer.addPass(normalPass)
  const ao = new pp.SSAOEffect(camera, normalPass.texture, {
    blendFunction: pp.BlendFunction.MULTIPLY,
    // Enough samples that white walls don't look grainy
    samples: 16,
    rings: 7,
    // In world units. Distance: how far from the camera occlusion still
    // shows (the camera sits ~8-30 m away). Proximity: how big a gap in depth
    // still counts as touching (a chair leg on the floor, not the floor seen
    // past the room's edge)
    worldDistanceThreshold: 60,
    worldDistanceFalloff: 10,
    worldProximityThreshold: 0.6,
    worldProximityFalloff: 0.3,
    radius: 0.12,
    intensity: 2,
    // Keep it on white walls too, a little lighter than on dark floors
    luminanceInfluence: 0.2,
    bias: 0.025,
    fade: 0.02,
    resolutionScale: 0.5,
    color: new THREE.Color('#2a2118'),
  })

  composer.addPass(new pp.EffectPass(
    camera,
    ao,
    // Only what is brighter than daylit walls glows: lamps, neon, flames
    new pp.BloomEffect({ mipmapBlur: true, luminanceThreshold: 1.5, luminanceSmoothing: 0.25, intensity: 0.65, radius: 0.6 }),
    new pp.ToneMappingEffect({ mode: pp.ToneMappingMode.NEUTRAL }),
    new pp.BrightnessContrastEffect({ contrast: 0.06 }),
    new pp.HueSaturationEffect({ saturation: 0.06 }),
    new pp.VignetteEffect({ offset: 0.38, darkness: 0.38 }),
  ))

  // Follow the renderer's size (the quality level can change its pixel ratio)
  const size = new THREE.Vector2()
  const last = new THREE.Vector2()
  const css = new THREE.Vector2()
  return {
    render(dt) {
      renderer.getDrawingBufferSize(size)
      if (!size.equals(last)) {
        last.copy(size)
        renderer.getSize(css)
        composer.setSize(css.x, css.y, false)
      }
      composer.render(dt)
    },
    dispose: () => composer.dispose(),
  }
}
