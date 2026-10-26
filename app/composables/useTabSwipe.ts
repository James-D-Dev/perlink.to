import type { Ref } from 'vue'

/**
 * Swipe sideways between tabs, like Flutter's PageView: the page follows the
 * finger (with resistance at the ends), and a long or quick swipe slides to
 * the next or previous tab. Only the current tab is mounted, so nothing heavy
 * (a 3D preview) runs off-screen.
 *
 * Swipes that start on something that handles its own sideways gestures are
 * left alone: fields, sliders, horizontal scrollers, drag handles, or
 * anything marked `data-no-swipe`.
 */
export function useTabSwipe<T extends string>(
  area: Ref<HTMLElement | null>,
  tabs: Ref<readonly T[]>,
  active: Ref<T>,
  enabled: Ref<boolean>,
) {
  let startX = 0
  let startY = 0
  let startTime = 0
  let axis: 'x' | 'y' | null = null
  let tracking = false
  let dx = 0

  const IGNORE = 'input, textarea, select, [contenteditable="true"], [data-no-swipe], .drag-handle, [role="slider"]'

  function scrollsSideways(target: Element, root: HTMLElement) {
    for (let el: Element | null = target; el && el !== root; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 1) {
        const overflow = getComputedStyle(el).overflowX
        if (overflow === 'auto' || overflow === 'scroll') return true
      }
    }
    return false
  }

  const neighbour = (step: 1 | -1) => tabs.value[tabs.value.indexOf(active.value) + step]

  function setOffset(x: number, animate: boolean) {
    const el = area.value
    if (!el) return
    el.style.transition = animate ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
    el.style.transform = x ? `translate3d(${x}px, 0, 0)` : ''
  }

  function onStart(event: TouchEvent) {
    const el = area.value
    const touch = event.touches[0]
    tracking = false
    if (!enabled.value || !el || !touch || event.touches.length > 1) return
    const target = event.target as Element
    if (target.closest(IGNORE) || scrollsSideways(target, el)) return
    tracking = true
    axis = null
    dx = 0
    startX = touch.clientX
    startY = touch.clientY
    startTime = performance.now()
  }

  function onMove(event: TouchEvent) {
    const touch = event.touches[0]
    if (!tracking || !touch) return
    const x = touch.clientX - startX
    const y = touch.clientY - startY
    if (!axis) {
      if (Math.abs(x) < 10 && Math.abs(y) < 10) return
      axis = Math.abs(x) > Math.abs(y) * 1.2 ? 'x' : 'y'
      if (axis === 'y') {
        tracking = false
        return
      }
    }
    // No tab that way: it gives a little, then holds
    dx = neighbour(x < 0 ? 1 : -1) ? x : x * 0.25
    setOffset(dx, false)
  }

  async function onEnd() {
    if (!tracking || axis !== 'x') return
    tracking = false
    const el = area.value
    if (!el) return
    const width = el.clientWidth
    const speed = Math.abs(dx) / Math.max(performance.now() - startTime, 1)
    const next = neighbour(dx < 0 ? 1 : -1)
    if (!next || (Math.abs(dx) < width * 0.25 && speed < 0.5)) {
      setOffset(0, true)
      return
    }
    // Out one side, in from the other
    const direction = dx < 0 ? -1 : 1
    setOffset(direction * width, true)
    await new Promise(resolve => setTimeout(resolve, 180))
    active.value = next
    await nextTick()
    setOffset(-direction * width * 0.35, false)
    el.getBoundingClientRect()
    setOffset(0, true)
    // Start the new tab at its top if the page had scrolled past it
    if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  watch(area, (el, old) => {
    old?.removeEventListener('touchstart', onStart)
    old?.removeEventListener('touchmove', onMove)
    old?.removeEventListener('touchend', onEnd)
    old?.removeEventListener('touchcancel', onEnd)
    el?.addEventListener('touchstart', onStart, { passive: true })
    el?.addEventListener('touchmove', onMove, { passive: true })
    el?.addEventListener('touchend', onEnd)
    el?.addEventListener('touchcancel', onEnd)
  })
  onBeforeUnmount(() => {
    area.value?.removeEventListener('touchstart', onStart)
    area.value?.removeEventListener('touchmove', onMove)
    area.value?.removeEventListener('touchend', onEnd)
    area.value?.removeEventListener('touchcancel', onEnd)
  })
}
