// v-reveal: an element below the fold rises into place (fade, slide up,
// unblur) as it scrolls into view; v-reveal="120" delays it 120 ms, for
// staggering a row. What's already on screen when the page loads is left as
// it is (no flash), and nothing moves for people who prefer reduced motion.
// See .mk-reveal in main.css.
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null
  const watch = (el: Element) => {
    observer ??= new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('mk-revealed')
        observer!.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    observer.observe(el)
  }

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
      if (el.getBoundingClientRect().top < window.innerHeight) return
      el.style.setProperty('--reveal-delay', `${binding.value ?? 0}ms`)
      el.classList.add('mk-reveal')
      watch(el)
    },
  })
})
