// Glass surfaces for dark mode (dashboard and superadmin). Every override
// below is a dark: class, so the light public site is unchanged.
const glassPanel = 'dark:bg-white/[0.03] dark:backdrop-blur-xl dark:ring-white/[0.08]'

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

// iOS 26 fields: a soft translucent fill instead of a hard border, larger
// corners, turning white with a gentle accent ring while typing
const iosField = {
  slots: { base: 'rounded-xl' },
  variants: {
    variant: {
      outline: 'bg-black/[0.045] ring-0 hover:bg-black/[0.06] focus:bg-white dark:bg-white/[0.06] dark:hover:bg-white/[0.08] dark:focus:bg-white/[0.1]',
      subtle: 'bg-black/[0.045] ring-0 hover:bg-black/[0.06] focus:bg-white dark:bg-white/[0.06] dark:focus:bg-white/[0.1]',
      soft: 'bg-black/[0.045] hover:bg-black/[0.06] focus:bg-white dark:bg-white/[0.06] dark:focus:bg-white/[0.1]',
    },
  },
  compoundVariants: [
    { variant: ['outline', 'subtle', 'soft'], class: 'focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-primary/25 dark:focus-visible:ring-primary/40' },
    { variant: ['outline', 'subtle', 'soft'], highlight: true, class: 'ring-[3px] ring-inset ring-primary/25' },
    { color: 'error', variant: ['outline', 'subtle', 'soft'], class: 'focus-visible:ring-error/30' },
    { color: 'error', highlight: true, class: 'bg-error/[0.06] ring-error/40' },
  ],
}

// iOS 26 menus (dropdowns, selects, popovers): a glass panel that springs
// open from where it was opened, roomy rounded rows, hairline separators
const menuMotion = 'data-[state=open]:animate-[ios-menu-in_240ms_cubic-bezier(0.22,1.25,0.36,1)] data-[state=closed]:animate-[ios-menu-out_120ms_ease-in]'
const glassMenu = `${liquidGlass} rounded-[20px] ${menuMotion}`
const menuRows = {
  slots: {
    content: `${glassMenu} p-1`,
    viewport: 'divide-y divide-black/[0.07] dark:divide-white/10',
    group: 'p-0.5',
    label: 'px-3 pt-2 pb-1 text-xs font-medium text-muted',
    separator: 'mx-3 my-1 h-px bg-black/[0.08] dark:bg-white/10',
    item: 'before:inset-0 before:rounded-[14px] data-highlighted:before:bg-black/[0.06] dark:data-highlighted:before:bg-white/10',
    itemLeadingIcon: 'text-muted',
    itemDescription: 'text-[12px]',
  },
  variants: {
    size: {
      md: { item: 'px-3 py-2.5 text-[15px] gap-3', itemLeadingIcon: 'size-[18px]', label: 'px-3 pt-2 pb-1 text-xs' },
      sm: { item: 'px-2.5 py-2 text-sm gap-2.5' },
    },
  },
  compoundVariants: [
    { color: 'neutral', active: true, class: { item: 'before:bg-black/[0.06] dark:before:bg-white/10' } },
  ],
}

// iOS 26 buttons: capsules that press in slightly; neutral outline and
// subtle buttons are frosted glass, soft ones a light translucent fill
const glassButton = 'ring-black/[0.08] bg-white/70 backdrop-blur-xl shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_1px_2px_rgb(0_0_0/0.06)] hover:bg-white/90 active:bg-white dark:bg-white/[0.07] dark:ring-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] dark:hover:bg-white/[0.12]'

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
        // Same shape as the editor's cards (rounded-3xl, paper on a hairline ring)
        root: `rounded-3xl bg-paper ring-line divide-line ${glassPanel} dark:divide-white/10 dark:shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset]`,
      },
    },
    input: iosField,
    textarea: iosField,
    inputMenu: {
      ...iosField,
      slots: { ...iosField.slots, ...menuRows.slots },
      variants: { ...iosField.variants, size: menuRows.variants.size },
    },
    inputNumber: iosField,
    select: {
      ...iosField,
      slots: { ...iosField.slots, ...menuRows.slots },
      variants: { ...iosField.variants, size: menuRows.variants.size },
      compoundVariants: [...iosField.compoundVariants, { transition: true, class: { content: menuMotion } }],
    },
    selectMenu: {
      ...iosField,
      slots: { ...iosField.slots, ...menuRows.slots },
      variants: { ...iosField.variants, size: menuRows.variants.size },
      compoundVariants: [...iosField.compoundVariants, { transition: true, class: { content: menuMotion } }],
    },
    button: {
      slots: {
        base: 'rounded-full transition-[background-color,color,box-shadow,transform,opacity] duration-150 active:scale-[0.97] disabled:active:scale-100',
      },
      compoundVariants: [
        { color: 'neutral', variant: ['outline', 'subtle'], class: glassButton },
        { color: 'neutral', variant: 'soft', class: 'bg-black/[0.05] hover:bg-black/[0.08] active:bg-black/[0.1] dark:bg-white/10 dark:hover:bg-white/15' },
        { color: 'neutral', variant: 'ghost', class: 'hover:bg-black/[0.05] dark:hover:bg-white/10' },
        { variant: 'solid', class: 'shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]' },
      ],
    },
    // Loading placeholders shimmer instead of pulsing (see .shimmer in main.css)
    skeleton: {
      base: 'shimmer rounded-md',
    },
    modal: {
      slots: {
        overlay: 'z-50',
        content: `${liquidGlass} divide-y-0 rounded-[28px] z-50`,
        // Title centred like an iOS sheet, with room for the round close button
        // A grab handle on top when it's a bottom sheet (phones)
        header: 'relative justify-center px-14 pt-5 pb-1 min-h-0 sm:px-14 text-center max-sm:pt-6 max-sm:before:absolute max-sm:before:left-1/2 max-sm:before:top-2 max-sm:before:h-1 max-sm:before:w-9 max-sm:before:-translate-x-1/2 max-sm:before:rounded-full max-sm:before:bg-black/15 dark:max-sm:before:bg-white/20',
        title: 'text-[17px] font-semibold tracking-tight',
        description: 'mt-1 text-[13px] text-muted',
        body: 'p-5 sm:p-6',
        footer: 'px-5 pb-5 pt-1 sm:px-6',
        close: 'top-3.5 end-3.5 size-8 justify-center rounded-full bg-black/[0.05] text-muted hover:bg-black/10 hover:text-highlighted dark:bg-white/10 dark:hover:bg-white/15',
      },
      variants: {
        fullscreen: {
          false: {
            // Phones: a bottom sheet across the screen, clear of the home indicator
            content: `w-[calc(100vw-1.5rem)] max-w-lg rounded-[28px] ${liquidGlass} max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:rounded-t-[28px] max-sm:pb-[env(safe-area-inset-bottom)]`,
          },
        },
        overlay: {
          true: {
            overlay: glassBackdrop,
          },
        },
        // Springs open like an iOS sheet (keyframes in main.css)
        transition: {
          true: {
            content: 'data-[state=open]:animate-[ios-sheet-in_420ms_cubic-bezier(0.22,1.25,0.36,1)] data-[state=closed]:animate-[ios-sheet-out_180ms_ease-in] max-sm:data-[state=open]:animate-[ios-slide-up_380ms_cubic-bezier(0.22,1,0.36,1)] max-sm:data-[state=closed]:animate-[ios-slide-down_220ms_ease-in]',
          },
        },
      },
      compoundVariants: [
        {
          scrollable: false,
          fullscreen: false,
          class: { content: 'max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-h-[92dvh]' },
        },
      ],
    },
    // Notification banners: a glass capsule that drops in from the top with a little bounce
    toast: {
      slots: {
        root: `${liquidGlass} rounded-[22px] p-3.5 pe-3 items-center gap-3`,
        title: 'text-[15px] font-semibold tracking-tight',
        description: 'text-[13px] text-muted',
        icon: 'size-6',
        close: 'rounded-full',
      },
    },
    toaster: {
      slots: {
        viewport: 'sm:w-[400px]',
      },
      compoundVariants: [
        {
          position: ['top-left', 'top-center', 'top-right'],
          class: {
            viewport: 'top-3 sm:top-4',
            base: 'data-[state=open]:animate-[ios-drop-in_560ms_cubic-bezier(0.22,1.3,0.36,1)] data-[state=closed]:animate-[ios-lift-out_220ms_ease-in]',
          },
        },
      ],
    },
    // Inline notices: rounder, frosted when neutral, fading up into place
    alert: {
      slots: {
        root: 'rounded-[20px] p-4 animate-[ios-fade-up_360ms_cubic-bezier(0.22,1,0.36,1)]',
        title: 'font-semibold',
      },
      compoundVariants: [
        { color: 'neutral', variant: ['outline', 'subtle'], class: { root: `${liquidGlass}` } },
        { variant: ['soft', 'subtle'], class: { root: 'backdrop-blur-xl' } },
      ],
    },
    // Draggable sheets (UDrawer/vaul): bottom sheets on phones (AppSheet)
    // and the dashboard's phone menu from the left. Same glass as dialogs; the
    // bottom one has a grab handle and an iOS-style centred title, clear of
    // the home bar
    drawer: {
      slots: {
        // Above the editor's teleported phone action bar (z-20)
        overlay: `${glassBackdrop} z-50`,
        content: `${liquidGlass} ring-1 z-50`,
        handle: '!bg-black/15 dark:!bg-white/25 transition-opacity',
        container: 'gap-0 p-0',
        header: 'px-5 pt-3 pb-1 text-center',
        title: 'text-[17px] font-semibold tracking-tight',
        description: 'mt-1 text-[13px] text-muted',
        body: 'p-5',
        footer: 'flex-row justify-end gap-2 px-5 pb-5 pt-1',
      },
      compoundVariants: [
        { direction: 'bottom', class: { content: 'mt-16 max-h-[94dvh] rounded-t-[28px] pb-[env(safe-area-inset-bottom)]', handle: '!w-9 !h-1 mt-2' } },
        { direction: 'left', class: { content: 'inset-y-0 left-0 w-[min(18rem,85vw)] rounded-r-[28px] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]' } },
      ],
    },
    slideover: {
      slots: { overlay: 'z-50', content: `${liquidGlass} divide-y-0 z-50` },
      variants: { overlay: { true: { overlay: glassBackdrop } } },
    },
    popover: { slots: { content: glassMenu } },
    dropdownMenu: menuRows,
    contextMenu: menuRows,
    tooltip: {
      slots: {
        content: 'h-7 rounded-full px-3 text-[12px] font-medium bg-neutral-900/85 text-white ring-0 backdrop-blur-xl shadow-lg dark:bg-white/90 dark:text-neutral-900 data-[state=delayed-open]:animate-[ios-menu-in_180ms_cubic-bezier(0.22,1.25,0.36,1)]',
      },
    },
    dashboardNavbar: { slots: { root: 'dark:bg-[#0a0a0a]/70 dark:backdrop-blur-xl dark:border-white/[0.08]' } },
  },
})
