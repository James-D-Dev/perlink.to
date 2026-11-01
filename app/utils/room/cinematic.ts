import * as THREE from 'three'

// The room video's film look (pmndrs postprocessing): depth of field, a soft
// glow from the bright parts, the scene's own Neutral tone mapping, a light
// vignette and a touch of contrast. Loaded on demand.
//
// 'glow' is the lighter look for viewing a room (not recording): the glow
// and the tone mapping only, on devices that keep up (see RoomScene).
//
// The scene renders into a half-float buffer (render targets skip the
// renderer's tone mapping), so tone mapping happens here, after the glow,
// with the renderer's exposure as before.

export interface Cinematic {
  render: (dt: number) => void
  setSize: (width: number, height: number) => void
  /** Keep this point sharp; `range` world units around it stay in focus, `blur` scales the bokeh */
  focus: (point: THREE.Vector3, range: number, blur: number) => void
  dispose: () => void
}

export async function createCinematic(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, look: 'film' | 'glow' = 'film'): Promise<Cinematic> {
  const pp = await import('postprocessing')
  const composer = new pp.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
    multisampling: Math.min(4, renderer.capabilities.maxSamples),
  })
  composer.addPass(new pp.RenderPass(scene, camera))

  const target = new THREE.Vector3()
  const depthOfField = look === 'film' ? new pp.DepthOfFieldEffect(camera, { focusRange: 4, bokehScale: 2, resolutionScale: 0.5 }) : null
  if (depthOfField) {
    depthOfField.target = target
    // Depth of field needs its own pass (it can't share one with other blurs)
    composer.addPass(new pp.EffectPass(camera, depthOfField))
  }

  const bloom = new pp.BloomEffect({ mipmapBlur: true, luminanceThreshold: 0.75, luminanceSmoothing: 0.2, intensity: 0.65, radius: 0.7 })
  const toneMapping = new pp.ToneMappingEffect({ mode: pp.ToneMappingMode.NEUTRAL })
  composer.addPass(look === 'film'
    ? new pp.EffectPass(camera, bloom, toneMapping, new pp.BrightnessContrastEffect({ contrast: 0.08 }), new pp.VignetteEffect({ offset: 0.32, darkness: 0.5 }))
    : new pp.EffectPass(camera, bloom, toneMapping))

  // Follow the renderer's size (the quality level can change its pixel ratio)
  const size = new THREE.Vector2()
  const last = new THREE.Vector2()
  return {
    render(dt) {
      renderer.getDrawingBufferSize(size)
      if (!size.equals(last)) {
        last.copy(size)
        const css = renderer.getSize(new THREE.Vector2())
        composer.setSize(css.x, css.y, false)
      }
      composer.render(dt)
    },
    setSize: (width, height) => composer.setSize(width, height, false),
    focus(point, range, blur) {
      if (!depthOfField) return
      target.copy(point)
      depthOfField.cocMaterial.focusRange = range
      depthOfField.bokehScale = blur
    },
    dispose: () => composer.dispose(),
  }
}
