// Glass surfaces for dark mode (dashboard and superadmin). Every override
// below is a dark: class, so the light public site is unchanged.
const glassPanel = 'dark:bg-white/[0.03] dark:backdrop-blur-xl dark:ring-white/[0.08]'
const glassOverlay = 'dark:bg-[#141414]/90 dark:backdrop-blur-2xl dark:ring-white/10'
const glassField = 'dark:bg-white/[0.03] dark:ring-white/10 dark:hover:ring-white/20'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'perlink-cyan',
      // Warm grays, matching the paper/sand design system
      neutral: 'stone',
    },
    colorMode:{
      preference: 'light',
      fallback: 'light',
    },
    card: {
      slots: {
        root: `rounded-xl ${glassPanel} dark:divide-white/10 dark:shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset]`,
      },
    },
    input: { slots: { base: glassField } },
    textarea: { slots: { base: glassField } },
    select: { slots: { base: glassField, content: glassOverlay } },
    selectMenu: { slots: { base: glassField, content: glassOverlay } },
    inputNumber: { slots: { base: glassField } },
    button: {
      slots: {
        base: 'transition-all',
      },
    },
    // Loading placeholders shimmer instead of pulsing (see .shimmer in main.css)
    skeleton: {
      base: 'shimmer rounded-md',
    },
    modal: {
      slots: {
        content: `${glassOverlay} dark:divide-white/10`,
      },
      variants: {
         overlay: {
          true: {
            overlay: 'bg-black/75 backdrop-blur-xs'
          }
        },
      }
    },
    slideover: { slots: { content: `${glassOverlay} dark:divide-white/10` } },
    popover: { slots: { content: glassOverlay } },
    dropdownMenu: { slots: { content: glassOverlay } },
    dashboardNavbar: { slots: { root: 'dark:bg-[#0a0a0a]/70 dark:backdrop-blur-xl dark:border-white/[0.08]' } },
  },
})
