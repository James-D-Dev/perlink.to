/**
 * Full-screen 3D pages handle pinch themselves (camera zoom). Stop the browser
 * from zooming the whole page when a pinch starts on the UI around the canvas.
 * iOS Safari ignores `touch-action` for pinch in some cases, so its gesture
 * events and multi-touch moves are cancelled too.
 */
export function usePreventPageZoom() {
  const cancel = (event: Event) => event.preventDefault()
  const cancelPinch = (event: TouchEvent) => {
    if (event.touches.length > 1) event.preventDefault()
  }

  onMounted(() => {
    document.addEventListener('gesturestart', cancel, { passive: false })
    document.addEventListener('gesturechange', cancel, { passive: false })
    document.addEventListener('touchmove', cancelPinch, { passive: false })
  })

  onBeforeUnmount(() => {
    document.removeEventListener('gesturestart', cancel)
    document.removeEventListener('gesturechange', cancel)
    document.removeEventListener('touchmove', cancelPinch)
  })
}
