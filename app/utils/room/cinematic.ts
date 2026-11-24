import * as THREE from 'three'

// The room video's film look (pmndrs postprocessing): depth of field, the
// scene's own Neutral tone mapping, a light vignette and a touch of contrast.
// No glow: it caught every sunlit wall and washed the video out on phones.
// Only the video recorder's scene uses it (loaded on demand), so visitors'
// phones never pay for it.
//
// The scene renders into a half-float buffer (render targets skip the
// renderer's tone mapping), so tone mapping happens here, with the
// renderer's exposure as before.

export interface Cinematic {
  render: (dt: number) => void
  setSize: (width: number, height: number) => void
  /** Keep this point sharp; `range` world units around it stay in focus, `blur` scales the bokeh */
  focus: (point: THREE.Vector3, range: number, blur: number) => void
  dispose: () => void
}

export async function createCinematic(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): Promise<Cinematic> {
  const pp = await import('postprocessing')
  const composer = new pp.EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
    multisampling: Math.min(4, renderer.capabilities.maxSamples),
  })
  composer.addPass(new pp.RenderPass(scene, camera))

  const target = new THREE.Vector3()
  const depthOfField = new pp.DepthOfFieldEffect(camera, { focusRange: 4, bokehScale: 2, resolutionScale: 0.5 })
  depthOfField.target = target
  // Depth of field needs its own pass (it can't share one with other blurs)
  composer.addPass(new pp.EffectPass(camera, depthOfField))

  composer.addPass(new pp.EffectPass(
    camera,
    new pp.ToneMappingEffect({ mode: pp.ToneMappingMode.NEUTRAL }),
    new pp.BrightnessContrastEffect({ contrast: 0.08 }),
    new pp.VignetteEffect({ offset: 0.32, darkness: 0.5 }),
  ))

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
      target.copy(point)
      depthOfField.cocMaterial.focusRange = range
      depthOfField.bokehScale = blur
    },
    dispose: () => composer.dispose(),
  }
}
