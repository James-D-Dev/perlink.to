import { computed } from 'vue'
import type { ThemeConfig, ThemeShadow, AnimateDuration } from '~/types/bio'
import { DEFAULT_THEME } from '~/types/bio'

function mergeWithDefault(theme: Partial<ThemeConfig> | undefined | null): ThemeConfig {
  if (!theme) return DEFAULT_THEME
  return {
    colors: { ...DEFAULT_THEME.colors, ...theme.colors },
    background: { ...DEFAULT_THEME.background, ...theme.background },
    card: { ...DEFAULT_THEME.card, ...theme.card },
    button: { ...DEFAULT_THEME.button, ...theme.button },
    header: { ...DEFAULT_THEME.header, ...theme.header },
    avatar: { ...DEFAULT_THEME.avatar, ...theme.avatar },
    link: { ...DEFAULT_THEME.link, ...theme.link },
    typography: { ...DEFAULT_THEME.typography, ...theme.typography },
    showShare: theme.showShare ?? DEFAULT_THEME.showShare,
  }
}

function shadowToCss(shadow: ThemeShadow): string {
  switch (shadow) {
    case 'sm': return '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)'
    case 'md': return '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)'
    case 'lg': return '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.08)'
    default:   return 'none'
  }
}

function nameSizeToCss(size: string): string {
  switch (size) {
    case 'sm': return '1rem'
    case 'md': return '1.25rem'
    case 'lg': return '1.5rem'
    case 'xl': return '2rem'
    default:   return '1.5rem'
  }
}

function paragraphSizeToCss(size: string): string {
  switch (size) {
    case 'xs': return '0.75rem'
    case 'sm': return '0.875rem'
    case 'md': return '1rem'
    default:   return '0.875rem'
  }
}

function avatarSizeToCss(size: string): string {
  switch (size) {
    case 'sm': return '64px'
    case 'md': return '80px'
    case 'lg': return '96px'
    case 'xl': return '128px'
    default:   return '96px'
  }
}

function durationClass(duration: AnimateDuration | undefined): string {
  if (!duration || duration === 'normal') return ''
  return `animate__${duration}`
}

export function getAppearClasses(animationAppear?: string, duration?: AnimateDuration): string[] {
  if (!animationAppear || animationAppear === 'none') return []
  return [
    'animate__animated',
    `animate__${animationAppear}`,
    durationClass(duration),
  ].filter(Boolean)
}

export function getHoverClasses(animationHover?: string, duration?: AnimateDuration): string[] {
  if (!animationHover || animationHover === 'none') return []
  return [
    'animate__animated',
    `animate__${animationHover}`,
    durationClass(duration),
  ].filter(Boolean)
}

function spacingToGap(spacing: string): string {
  switch (spacing) {
    case 'compact':   return '12px'
    case 'normal':    return '24px'
    case 'spacious':  return '40px'
    default:          return '24px'
  }
}

export function useBioTheme(themeInput: Ref<Partial<ThemeConfig> | undefined | null> | Partial<ThemeConfig> | undefined | null) {
  const theme = computed(() => {
    const raw = isRef(themeInput) ? themeInput.value : themeInput
    return mergeWithDefault(raw)
  })

  const backgroundStyle = computed(() => {
    const bg = theme.value.background
    if (bg.type === 'gradient' && bg.gradient) {
      const { angle, from, to, via } = bg.gradient
      const stops = via
        ? `${from}, ${via}, ${to}`
        : `${from}, ${to}`
      return { background: `linear-gradient(${angle}deg, ${stops})` }
    }
    if (bg.type === 'image' && bg.imageUrl) {
      return {
        backgroundImage: bg.imageOverlay
          ? `linear-gradient(${bg.imageOverlay}, ${bg.imageOverlay}), url(${bg.imageUrl})`
          : `url(${bg.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }
    }
    return { backgroundColor: theme.value.colors.third || '#FFFFFF' }
  })

  const bgLayerStyle = computed(() => backgroundStyle.value)

  const pageStyle = computed(() => ({
    fontFamily: theme.value.typography.paragraphFont,
    ...bgLayerStyle.value
  }))

  const cardTransparency = computed(() => theme.value.card.transparency ?? 1)

  const cardStyle = computed(() => {
    const card = theme.value.card
    const bg = theme.value.background
    const color = theme.value.colors.primary
    // const cardBg = bg.type === 'solid' ? (bg.color || '#FFFFFF') : '#FFFFFF'
    const blurMap: Record<string, string> = { sm: 'blur(4px)', md: 'blur(8px)', lg: 'blur(16px)', xl: 'blur(24px)' }
    const backdropFilter = card.backdropBlur && card.backdropBlur !== 'none' ? blurMap[card.backdropBlur] : undefined
    const base = {
      borderRadius: `${card.cornerRadius}px`,
      boxShadow: shadowToCss(card.shadow),
      backdropFilter,
    }
    const cardText = card.textColor || undefined
    switch (card.style) {
      case 'outline':
        return { ...base, backgroundColor: `${color}20`, border: `1px solid ${card.outlineColor || color}`, color: cardText }
      case 'ghost':
        return { ...base, backgroundColor: `${color}60`, border: 'none', color: cardText }
      case 'soft':
        return { ...base, backgroundColor: `${color}80`, border: 'none', color: cardText }
      default:
        return { ...base, backgroundColor: color, border: 'none', color: cardText }
    }
  })

  const buttonStyle = computed(() => {
    const btn = theme.value.button
    const color = theme.value.colors.primary
    const base = {
      borderRadius: `${btn.cornerRadius}px`,
      boxShadow: shadowToCss(btn.shadow),
      transition: 'transform 0.15s, box-shadow 0.15s',
    }
    const btnText = btn.textColor
    switch (btn.style) {
      case 'outline':
        return { ...base, backgroundColor: 'transparent', color: btnText || color, border: `2px solid ${color}` }
      case 'ghost':
        return { ...base, backgroundColor: 'transparent', color: btnText || color, border: 'none' }
      case 'soft':
        return { ...base, backgroundColor: `${color}20`, color: btnText || color, border: 'none' }
      default:
        return { ...base, backgroundColor: color, color: btnText || '#ffffff', border: 'none' }
    }
  })

  const headerAlignment = computed(() => theme.value.header.alignment)
  const headerSpacing = computed(() => {
    if (["cover", "banner-circle", "banner-square"].includes(theme.value.header.layout || "")) {
      return "0px";
    }
    return spacingToGap(theme.value.header.spacing);
  })
  const headerLayout = computed(() => theme.value.header.layout ?? 'centered')

  const cardAppearClasses = computed(() =>
    getAppearClasses(theme.value.card.animationAppear, theme.value.card.animationDuration)
  )
  const cardHoverClasses = computed(() =>
    getHoverClasses(theme.value.card.animationHover, theme.value.card.animationDuration)
  )
  const buttonAppearClasses = computed(() =>
    getAppearClasses(theme.value.button.animationAppear, theme.value.button.animationDuration)
  )
  const buttonHoverClasses = computed(() =>
    getHoverClasses(theme.value.button.animationHover, theme.value.button.animationDuration)
  )
  const avatarAppearClasses = computed(() =>
    getAppearClasses(theme.value.avatar.animationAppear, theme.value.avatar.animationDuration)
  )
  const avatarHoverClasses = computed(() =>
    getHoverClasses(theme.value.avatar.animationHover, theme.value.avatar.animationDuration)
  )

  const avatarStyle = computed(() => {
    const av = theme.value.avatar
    const size = avatarSizeToCss(av.size)
    const radius = av.shape === 'circle' ? '9999px'
      : av.shape === 'square' ? '0px'
      : '16px'
    return {
      width: size,
      height: size,
      borderRadius: radius,
      border: av.border ? `3px solid ${av.borderColor || theme.value.colors.primary}` : 'none',
      objectFit: 'cover' as const,
    }
  })

  const nameStyle = computed(() => ({
    fontFamily: theme.value.header.fontFamily || theme.value.typography.nameFont,
    fontSize: theme.value.header.fontSize || nameSizeToCss(theme.value.typography.nameSize),
    fontWeight: '700',
    color: theme.value.header.textColor,
  }))

  const paragraphStyle = computed(() => ({
    fontFamily: theme.value.typography.bioFontFamily || theme.value.typography.paragraphFont,
    fontSize: theme.value.typography.bioFontSize || paragraphSizeToCss(theme.value.typography.paragraphSize),
    color: theme.value.typography.bioTextColor,
  }))

  const socialButtonStyle = computed(() => ({
    backgroundColor: `${theme.value.colors.primary}15`,
    color: theme.value.colors.primary,
    borderRadius: '9999px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }))

  const linkLayout = computed(() => theme.value.link.layout)

  return {
    theme,
    backgroundStyle,
    bgLayerStyle,
    pageStyle,
    cardStyle,
    cardTransparency,
    buttonStyle,
    linkLayout,
    headerAlignment,
    headerSpacing,
    headerLayout,
    avatarStyle,
    nameStyle,
    paragraphStyle,
    socialButtonStyle,
    cardAppearClasses,
    cardHoverClasses,
    buttonAppearClasses,
    buttonHoverClasses,
    avatarAppearClasses,
    avatarHoverClasses,
  }
}
