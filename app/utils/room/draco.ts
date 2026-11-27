import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// One Draco decoder for every room model (nature, flowers, furniture), warmed
// up as the scene starts: each loader used to bring its own pool of up to four
// workers, each compiling the decoder's WebAssembly, and only once a model
// needed it (after the land was on screen)
let shared: DRACOLoader | null = null

export function dracoLoader() {
  if (!shared) {
    shared = new DRACOLoader().setDecoderPath('/draco/')
    // Phones have few cores and the page needs one
    shared.setWorkerLimit(typeof navigator !== 'undefined' && (navigator.hardwareConcurrency ?? 4) <= 4 ? 1 : 2)
  }
  return shared
}

/** Fetch and compile the decoder now, alongside the scene being built */
export function warmDraco() {
  dracoLoader().preload()
}
