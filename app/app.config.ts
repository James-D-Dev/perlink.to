// Glass surfaces for dark mode (dashboard and superadmin). Every override
// below is a dark: class, so the light public site is unchanged.
const glassPanel = 'dark:bg-white/[0.03] dark:backdrop-blur-xl dark:ring-white/[0.08]'
const glassOverlay = 'dark:bg-[#141414]/90 dark:backdrop-blur-2xl dark:ring-white/10'
const glassField = 'dark:bg-white/[0.03] dark:ring-white/10 dark:hover:ring-white/20'

// Liquid glass (iOS 26 style) for every dialog: frosted, translucent, bright
// top edge and a soft long shadow. Matches .glass-sheet in main.css, which
// hand-built popups use.
const liquidGlass = [
  'bg-neutral-50/75 dark:bg-[#1c1c1e]/70 backdrop-blur-[40px] backdrop-saturate-[1.8]',
  'ring-1 ring-black/[0.06] dark:ring-white/[0.08]',
  'shadow-[inset_0_1px_0_0_rgb(255_255_255/0.85),0_30px_80px_-20px_rgb(0_0_0/0.35),0_8px_24px_-12px_rgb(0_0_0/0.18)]',
  'dark:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.08),0_30px_80px_-20px_rgb(0_0_0/0.7)]',
].join(' ')
const glassBackdrop = 'bg-black/20 dark:bg-black/45 backdrop-blur-[8px] backdrop-saturate-[1.2]'

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
        content: `${liquidGlass} divide-y-0 rounded-[28px]`,
        // Title centred like an iOS sheet, with room for the round close button
        header: 'justify-center px-14 pt-5 pb-1 min-h-0 sm:px-14 text-center',
        title: 'text-[17px] font-semibold tracking-tight',
        description: 'mt-1 text-[13px] text-muted',
        body: 'p-5 sm:p-6',
        footer: 'px-5 pb-5 pt-1 sm:px-6',
        close: 'top-3.5 end-3.5 size-8 justify-center rounded-full bg-black/[0.05] text-muted hover:bg-black/10 hover:text-highlighted dark:bg-white/10 dark:hover:bg-white/15',
      },
      variants: {
        fullscreen: {
          false: {
            content: `w-[calc(100vw-1.5rem)] max-w-lg rounded-[28px] ${liquidGlass}`,
          },
        },
        overlay: {
          true: {
            overlay: glassBackdrop,
          },
        },
      },
    },
    slideover: {
      slots: { content: `${liquidGlass} divide-y-0` },
      variants: { overlay: { true: { overlay: glassBackdrop } } },
    },
    popover: { slots: { content: glassOverlay } },
    dropdownMenu: { slots: { content: glassOverlay } },
    dashboardNavbar: { slots: { root: 'dark:bg-[#0a0a0a]/70 dark:backdrop-blur-xl dark:border-white/[0.08]' } },
  },
})
