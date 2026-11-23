import { ref } from 'vue'

/**
 * How far a live page's 3D room has got, for the loader's percentage. The
 * steps can't be timed exactly (a code download, building the scene,
 * compiling it), so each step sets where the number is (`floor`) and how far
 * it may creep while the step runs (`ceiling`); the loader eases between
 * them, and the land on screen makes it 100. Only set in the browser.
 */
export const roomLoadStep = ref({ floor: 0, ceiling: 30 })

export function setRoomLoadStep(floor: number, ceiling = floor) {
  if (import.meta.server) return
  const now = roomLoadStep.value
  roomLoadStep.value = { floor: Math.max(now.floor, floor), ceiling: Math.max(now.ceiling, ceiling, floor) }
}

/** A new load begins (tapping "3D room" again after going back to 2D) */
export function resetRoomLoadStep() {
  roomLoadStep.value = { floor: 0, ceiling: 30 }
}
