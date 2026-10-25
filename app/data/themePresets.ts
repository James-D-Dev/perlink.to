import type { LinkCardLayout, ThemeConfig, ThemeHeaderLayout, ThemePage, ThemeSocial } from '~/types/bio'

// Ready-made looks, grouped by feel rather than by colour: people pick "warm"
// or "elegant", not "orange". Each one sets everything the theme editor can,
// so picking a preset and then tweaking a control always works.

export type ThemePresetCategory =
  | 'minimal'
  | 'warm'
  | 'elegant'
  | 'playful'
  | 'nature'
  | 'pastel'
  | 'dark'
  | 'festive'
  | 'glass'
  | 'bold'
  | 'luxe'

export interface ThemePreset {
  id: string
  name: string
  category: ThemePresetCategory
  description: string
  preview: {
    bg: string
    card: string
    text: string
  }
  theme: ThemeConfig
  /** A Perlink Pro look (labelled; not locked yet) */
  pro?: boolean
}

export const THEME_PRESET_CATEGORIES: { id: ThemePresetCategory; label: string }[] = [
  { id: 'glass', label: 'Glass' },
  { id: 'luxe', label: 'Luxe' },
  { id: 'bold', label: 'Bold' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'warm', label: 'Warm' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'playful', label: 'Playful' },
  { id: 'nature', label: 'Nature' },
  { id: 'pastel', label: 'Pastel' },
  { id: 'dark', label: 'Dark' },
  { id: 'festive', label: 'Festive' },
]

// Font values match the options in data/fontOptions, so the editor shows their names
const F = {
  inter: 'Inter, sans-serif',
  interTight: 'Inter Tight, sans-serif',
  beVietnam: 'Be Vietnam Pro, sans-serif',
  montserrat: 'Montserrat, sans-serif',
  poppins: 'Poppins, sans-serif',
  nunito: 'Nunito, sans-serif',
  quicksand: 'Quicksand, sans-serif',
  josefin: 'Josefin Sans, sans-serif',
  grotesk: 'Space Grotesk, sans-serif',
  comfortaa: 'Comfortaa, sans-serif',
  playfair: 'Playfair Display, serif',
  cormorant: 'Cormorant Garamond, serif',
  lora: 'Lora, serif',
  notoSerif: 'Noto Serif, serif',
  dancing: 'Dancing Script, cursive',
  pacifico: 'Pacifico, cursive',
  lobster: 'Lobster, cursive',
} as const

interface Spec {
  id: string
  name: string
  category: ThemePresetCategory
  description: string
  /** A colour, or a gradient [from, to] / [from, via, to] */
  bg: string | [string, string] | [string, string, string]
  angle?: number
  /** Soft mesh of three colours over `bg` (also the aurora's colours) */
  mesh?: [string, string, string]
  /** Fine pattern over the background */
  pattern?: NonNullable<ThemeConfig['background']['pattern']>['id']
  patternColor?: string
  /** Animated background drawn over the colour */
  effect?: string
  /** Text on the page */
  text: string
  accent: string
  /** Text on accent-filled cards and buttons */
  onAccent?: string
  /** Card colour; omit to fill cards with the accent */
  surface?: string
  /** Text on surface cards, if it differs from the page text */
  surfaceText?: string
  card?: ThemeConfig['card']['style']
  border?: string
  radius: number
  shadow?: ThemeConfig['card']['shadow']
  blur?: ThemeConfig['card']['backdropBlur']
  borderWidth?: number
  /** Second accent, for gradient names */
  accent2?: string
  /** The site name painted with accent → accent2 */
  nameGradient?: boolean
  pro?: boolean
  /** [name, body] */
  fonts: [string, string]
  nameWeight?: string
  nameSize?: string
  tracking?: string
  header?: ThemeHeaderLayout
  avatar?: ThemeConfig['avatar']['shape']
  link?: LinkCardLayout
  social?: ThemeSocial['style']
  gap?: ThemePage['blockGap']
  titleAlign?: ThemePage['titleAlign']
}

function preset(s: Spec): ThemePreset {
  const style = s.card ?? (s.border ? 'outline' : 'filled')
  const onAccent = s.onAccent ?? '#ffffff'
  const cardText = s.surface ? (s.surfaceText ?? s.text) : onAccent
  const gradient = Array.isArray(s.bg)
    ? { angle: s.angle ?? 160, from: s.bg[0], via: s.bg.length === 3 ? s.bg[1] : undefined, to: s.bg[s.bg.length - 1] }
    : undefined
  const bgColor = Array.isArray(s.bg) ? s.bg[0] : s.bg
  const mesh = s.mesh ? { style: 'mesh' as const, from: s.mesh[0], via: s.mesh[1], to: s.mesh[2] } : undefined
  const pattern = s.pattern ? { id: s.pattern, color: s.patternColor } : undefined
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    pro: s.pro,
    preview: { bg: bgColor, card: s.surface ?? s.accent, text: s.text },
    theme: {
      colors: { primary: s.accent, secondary: s.accent2 ?? s.border ?? s.surface ?? s.accent, third: bgColor },
      background: s.effect
        ? { type: 'effect', effectId: s.effect, color: bgColor, gradient: mesh }
        : mesh ? { type: 'gradient', color: bgColor, gradient: mesh, pattern }
          : gradient ? { type: 'gradient', gradient, pattern } : { type: 'solid', color: bgColor, pattern },
      card: {
        style,
        backgroundColor: s.surface,
        outlineColor: s.border,
        textColor: cardText,
        cornerRadius: s.radius,
        transparency: 1,
        shadow: s.shadow ?? 'none',
        backdropBlur: s.blur ?? 'none',
        borderWidth: s.borderWidth,
        animationAppear: 'fadeInUp',
        animationHover: 'none',
      },
      button: { style: 'filled', cornerRadius: s.radius, shadow: 'none', textColor: onAccent },
      header: {
        alignment: 'center',
        spacing: 'normal',
        layout: s.header ?? 'centered',
        fontFamily: s.fonts[0],
        fontSize: s.nameSize ?? '1.875rem',
        fontWeight: s.nameWeight ?? '700',
        letterSpacing: s.tracking,
        textColor: s.text,
        textGradient: s.nameGradient,
      },
      avatar: { shape: s.avatar ?? 'circle', size: 'lg', border: false, animationAppear: 'fadeIn', animationHover: 'none' },
      link: { layout: s.link ?? 'horizontal-left' },
      typography: {
        nameFont: s.fonts[0],
        headingFont: s.fonts[0],
        paragraphFont: s.fonts[1],
        nameSize: 'lg',
        paragraphSize: 'sm',
        bioFontFamily: s.fonts[1],
        bioTextColor: s.text,
        textColor: s.text,
      },
      social: { style: s.social ?? 'soft' },
      page: { blockGap: s.gap ?? 'normal', titleAlign: s.titleAlign ?? 'center' },
    },
  }
}

export const THEME_PRESETS: ThemePreset[] = [
  // ─── MINIMAL ──────────────────────────────────────────────────
  preset({ id: 'paper', name: 'Paper', category: 'minimal', description: 'White page, black type, nothing extra',
    bg: '#FFFFFF', text: '#111111', accent: '#111111', surface: '#FFFFFF', border: '#E5E5E5', radius: 10,
    fonts: [F.interTight, F.inter], nameWeight: '600', tracking: '-0.03em', social: 'plain' }),
  preset({ id: 'stone', name: 'Stone', category: 'minimal', description: 'Warm grey with soft cards',
    bg: '#F4F2EE', text: '#2B2A27', accent: '#2B2A27', surface: '#FFFFFF', radius: 14, shadow: 'sm',
    fonts: [F.beVietnam, F.beVietnam], nameWeight: '600', tracking: '-0.02em', social: 'outline' }),
  preset({ id: 'mono', name: 'Mono', category: 'minimal', description: 'Black buttons, square corners',
    bg: '#FAFAFA', text: '#0A0A0A', accent: '#0A0A0A', radius: 0,
    fonts: [F.grotesk, F.grotesk], nameWeight: '700', tracking: '-0.02em', avatar: 'square', link: 'centered', social: 'filled' }),
  preset({ id: 'swiss', name: 'Swiss', category: 'minimal', description: 'Left-aligned, red accent',
    bg: '#FFFFFF', text: '#111111', accent: '#E11D2E', surface: '#F5F5F5', radius: 4,
    fonts: [F.interTight, F.inter], nameWeight: '700', tracking: '-0.04em', header: 'left', titleAlign: 'left', social: 'plain' }),
  preset({ id: 'cloud', name: 'Cloud', category: 'minimal', description: 'Airy blue-grey, rounded',
    bg: '#F3F6FA', text: '#1E293B', accent: '#334155', surface: '#FFFFFF', radius: 18, shadow: 'sm',
    fonts: [F.beVietnam, F.inter], nameWeight: '600', social: 'soft', gap: 'relaxed' }),

  // ─── WARM ─────────────────────────────────────────────────────
  preset({ id: 'coffee', name: 'Coffee house', category: 'warm', description: 'Cream and espresso, for cafés',
    bg: '#F6EFE6', text: '#3B2A1E', accent: '#6F4E37', surface: '#FFFAF3', border: '#E6D7C3', radius: 12,
    fonts: [F.lora, F.beVietnam], nameWeight: '600', social: 'soft' }),
  preset({ id: 'terracotta', name: 'Terracotta', category: 'warm', description: 'Clay orange on sand',
    bg: '#F7EDE2', text: '#4A2C21', accent: '#C2552D', radius: 16, shadow: 'sm',
    fonts: [F.playfair, F.inter], nameWeight: '700', link: 'centered', social: 'filled' }),
  preset({ id: 'bakery', name: 'Bakery', category: 'warm', description: 'Butter yellow and brown',
    bg: '#FFF7E6', text: '#5A3A1A', accent: '#D98E04', surface: '#FFFFFF', radius: 20, shadow: 'sm',
    fonts: [F.nunito, F.nunito], nameWeight: '800', social: 'soft' }),
  preset({ id: 'honey', name: 'Honey', category: 'warm', description: 'Golden gradient, dark text',
    bg: ['#FDE68A', '#FBBF24'], angle: 170, text: '#422006', accent: '#422006', onAccent: '#FDE68A', radius: 14,
    fonts: [F.poppins, F.poppins], nameWeight: '700', social: 'filled' }),
  preset({ id: 'cinnamon', name: 'Cinnamon', category: 'warm', description: 'Deep brown with cream cards',
    bg: '#3E2723', text: '#FFF3E0', accent: '#FFB74D', onAccent: '#3E2723', surface: '#4E342E', radius: 12,
    fonts: [F.lora, F.inter], nameWeight: '600', social: 'outline' }),

  // ─── ELEGANT ──────────────────────────────────────────────────
  preset({ id: 'ivory', name: 'Ivory', category: 'elegant', description: 'Serif type on ivory, thin lines',
    bg: '#FBF8F2', text: '#2C2620', accent: '#2C2620', surface: '#FBF8F2', border: '#D9CFC1', radius: 2,
    fonts: [F.cormorant, F.lora], nameWeight: '500', nameSize: '2.25rem', link: 'centered', social: 'plain', gap: 'relaxed' }),
  preset({ id: 'spa', name: 'Spa', category: 'elegant', description: 'Sage and linen, calm and clean',
    bg: '#EEF1EA', text: '#2F3A2F', accent: '#6B7F65', surface: '#F8F9F5', radius: 24,
    fonts: [F.cormorant, F.josefin], nameWeight: '600', nameSize: '2.25rem', link: 'centered', social: 'outline', gap: 'relaxed' }),
  preset({ id: 'champagne', name: 'Champagne', category: 'elegant', description: 'Soft gold on blush',
    bg: ['#FBF3EC', '#F3E2D3'], text: '#4B3A2E', accent: '#B08D57', surface: '#FFFFFF', radius: 999,
    fonts: [F.playfair, F.josefin], nameWeight: '500', link: 'centered', social: 'outline' }),
  preset({ id: 'noir', name: 'Noir', category: 'elegant', description: 'Black and gold, for evenings',
    bg: '#0E0E0E', text: '#F2EDE4', accent: '#C9A45C', onAccent: '#0E0E0E', surface: '#0E0E0E', border: '#3A3326', radius: 2,
    fonts: [F.cormorant, F.josefin], nameWeight: '500', nameSize: '2.25rem', tracking: '0.04em', link: 'centered', social: 'plain' }),
  preset({ id: 'atelier', name: 'Atelier', category: 'elegant', description: 'Navy and cream, tailored',
    bg: '#F5F1E8', text: '#1B2A41', accent: '#1B2A41', onAccent: '#F5F1E8', radius: 6,
    fonts: [F.notoSerif, F.inter], nameWeight: '600', header: 'left', titleAlign: 'left', social: 'filled' }),

  // ─── PLAYFUL ──────────────────────────────────────────────────
  preset({ id: 'bubblegum', name: 'Bubblegum', category: 'playful', description: 'Pink, round and bouncy',
    bg: '#FFE4F1', text: '#5B1340', accent: '#EC4899', radius: 999, shadow: 'md',
    fonts: [F.comfortaa, F.nunito], nameWeight: '700', link: 'centered', social: 'filled' }),
  preset({ id: 'lemonade', name: 'Lemonade', category: 'playful', description: 'Lemon yellow, blue buttons',
    bg: '#FFF9C4', text: '#1E3A8A', accent: '#2563EB', radius: 16, shadow: 'md',
    fonts: [F.nunito, F.nunito], nameWeight: '800', social: 'filled' }),
  preset({ id: 'sticker', name: 'Sticker', category: 'playful', description: 'White cards with thick outlines',
    bg: '#A7F3D0', text: '#111827', accent: '#111827', surface: '#FFFFFF', border: '#111827', radius: 14, shadow: 'lg',
    fonts: [F.grotesk, F.grotesk], nameWeight: '700', social: 'outline' }),
  preset({ id: 'candy', name: 'Candy', category: 'playful', description: 'Sweet gradient, white cards',
    bg: ['#FBC2EB', '#A6C1EE'], angle: 135, text: '#3B0764', accent: '#7C3AED', surface: '#FFFFFF', radius: 20, shadow: 'md',
    fonts: [F.quicksand, F.quicksand], nameWeight: '700', social: 'soft' }),
  preset({ id: 'retro', name: 'Retro', category: 'playful', description: 'Seventies orange and teal',
    bg: '#FDF0D5', text: '#003049', accent: '#F77F00', surface: '#FCBF49', surfaceText: '#003049', radius: 12, shadow: 'md',
    fonts: [F.lobster, F.poppins], nameWeight: '400', nameSize: '2.25rem', social: 'filled' }),

  // ─── NATURE ───────────────────────────────────────────────────
  preset({ id: 'forest', name: 'Forest', category: 'nature', description: 'Deep green with cream text',
    bg: '#1F3B2D', text: '#F1EBDD', accent: '#D9C38F', onAccent: '#1F3B2D', surface: '#2A4A39', radius: 14,
    fonts: [F.lora, F.inter], nameWeight: '600', social: 'outline' }),
  preset({ id: 'matcha', name: 'Matcha', category: 'nature', description: 'Soft green tea tones',
    bg: '#EEF3E2', text: '#2E3B1F', accent: '#7A9A3B', surface: '#FFFFFF', radius: 16,
    fonts: [F.quicksand, F.beVietnam], nameWeight: '700', social: 'soft' }),
  preset({ id: 'ocean', name: 'Ocean', category: 'nature', description: 'Sea blue gradient, white cards',
    bg: ['#E0F2FE', '#BAE6FD'], text: '#0C4A6E', accent: '#0369A1', surface: '#FFFFFF', radius: 16, shadow: 'sm',
    fonts: [F.montserrat, F.inter], nameWeight: '700', social: 'soft' }),
  preset({ id: 'sand', name: 'Beach', category: 'nature', description: 'Sand and turquoise, for homestays',
    bg: '#F5EBDD', text: '#3D3426', accent: '#14B8A6', surface: '#FFFDF8', radius: 20, shadow: 'sm',
    fonts: [F.josefin, F.inter], nameWeight: '700', link: 'vertical', social: 'filled' }),
  preset({ id: 'lotus', name: 'Lotus', category: 'nature', description: 'Lotus pink and leaf green',
    bg: '#FDF2F4', text: '#3F1D2B', accent: '#5B8C51', surface: '#FFFFFF', border: '#F3C6D2', radius: 18,
    fonts: [F.playfair, F.beVietnam], nameWeight: '600', link: 'centered', social: 'outline' }),

  // ─── PASTEL ───────────────────────────────────────────────────
  preset({ id: 'lavender', name: 'Lavender', category: 'pastel', description: 'Lilac page, purple buttons',
    bg: '#F3EEFF', text: '#3B2A63', accent: '#8B5CF6', radius: 999,
    fonts: [F.quicksand, F.quicksand], nameWeight: '700', link: 'centered', social: 'soft' }),
  preset({ id: 'peach', name: 'Peach', category: 'pastel', description: 'Peach gradient, coral accent',
    bg: ['#FFE5D9', '#FFD6E0'], text: '#5C2A2A', accent: '#F27059', surface: '#FFFFFF', radius: 18, shadow: 'sm',
    fonts: [F.nunito, F.nunito], nameWeight: '800', social: 'soft' }),
  preset({ id: 'mint', name: 'Mint', category: 'pastel', description: 'Fresh mint and teal',
    bg: '#E8FAF2', text: '#134E4A', accent: '#14B8A6', surface: '#FFFFFF', radius: 14,
    fonts: [F.beVietnam, F.beVietnam], nameWeight: '700', social: 'soft' }),
  preset({ id: 'sky', name: 'Baby blue', category: 'pastel', description: 'Light blue, gentle and friendly',
    bg: '#EAF4FF', text: '#1E3A5F', accent: '#5B9BD5', surface: '#FFFFFF', radius: 999,
    fonts: [F.comfortaa, F.nunito], nameWeight: '700', link: 'centered', social: 'outline' }),
  preset({ id: 'sorbet', name: 'Sorbet', category: 'pastel', description: 'Rainbow pastel gradient',
    bg: ['#FFDEE9', '#E3F0FF', '#D7FFE9'], angle: 160, text: '#33334D', accent: '#33334D', surface: '#FFFFFF', radius: 16, shadow: 'sm', blur: 'md',
    fonts: [F.poppins, F.poppins], nameWeight: '600', social: 'soft' }),

  // ─── DARK ─────────────────────────────────────────────────────
  preset({ id: 'midnight', name: 'Midnight', category: 'dark', description: 'Near-black with white cards',
    bg: '#0B0B0F', text: '#F4F4F5', accent: '#FFFFFF', onAccent: '#0B0B0F', radius: 12,
    fonts: [F.interTight, F.inter], nameWeight: '600', tracking: '-0.03em', social: 'outline' }),
  preset({ id: 'graphite', name: 'Graphite', category: 'dark', description: 'Charcoal cards, quiet borders',
    bg: '#18181B', text: '#E4E4E7', accent: '#A1A1AA', surface: '#27272A', border: '#3F3F46', radius: 10,
    fonts: [F.grotesk, F.inter], nameWeight: '600', social: 'plain' }),
  preset({ id: 'neon', name: 'Neon night', category: 'dark', description: 'Glowing pink on deep purple',
    bg: ['#12002B', '#2A0845'], text: '#FDF4FF', accent: '#F472B6', surface: '#12002B', border: '#F472B6', radius: 14, shadow: 'lg',
    fonts: [F.grotesk, F.grotesk], nameWeight: '700', social: 'outline' }),
  preset({ id: 'aurora', name: 'Aurora', category: 'dark', description: 'Northern lights gradient, glass cards',
    bg: ['#0F172A', '#134E4A', '#312E81'], angle: 160, text: '#F0FDFA', accent: '#5EEAD4', onAccent: '#0F172A', surface: '#FFFFFF1A', radius: 16, blur: 'lg',
    fonts: [F.montserrat, F.inter], nameWeight: '700', social: 'outline' }),
  preset({ id: 'starry', name: 'Starry', category: 'dark', description: 'Navy sky with falling stars',
    bg: '#0B1026', effect: 'falling-stars', text: '#E8EDFF', accent: '#A5B4FC', onAccent: '#0B1026', surface: '#151B3B', radius: 14,
    fonts: [F.josefin, F.inter], nameWeight: '700', social: 'outline' }),

  // ─── FESTIVE ──────────────────────────────────────────────────
  preset({ id: 'tet', name: 'Lunar New Year', category: 'festive', description: 'Red and gold for Tết',
    bg: ['#B91C1C', '#7F1D1D'], text: '#FFF7E0', accent: '#FBBF24', onAccent: '#7F1D1D', surface: '#991B1B', border: '#FBBF24', radius: 12, shadow: 'md',
    fonts: [F.playfair, F.beVietnam], nameWeight: '700', link: 'centered', social: 'outline' }),
  preset({ id: 'wedding', name: 'Wedding', category: 'festive', description: 'Script names, blush and white',
    bg: '#FDF6F4', effect: 'rose', text: '#5A3E3A', accent: '#C08479', surface: '#FFFFFF', border: '#EBD3CE', radius: 999,
    fonts: [F.dancing, F.lora], nameWeight: '600', nameSize: '2.5rem', link: 'centered', social: 'outline', gap: 'relaxed' }),
  preset({ id: 'birthday', name: 'Birthday', category: 'festive', description: 'Confetti colours, round cards',
    bg: ['#FFF1C1', '#FFD1E8'], angle: 135, text: '#4C1D95', accent: '#F43F5E', radius: 999, shadow: 'md',
    fonts: [F.pacifico, F.nunito], nameWeight: '400', nameSize: '2.25rem', link: 'centered', social: 'filled' }),
  preset({ id: 'christmas', name: 'Christmas', category: 'festive', description: 'Pine green, red and snow',
    bg: '#14452F', effect: 'snow', text: '#FFFFFF', accent: '#DC2626', surface: '#1B5E3F', radius: 14,
    fonts: [F.lora, F.inter], nameWeight: '700', social: 'filled' }),
  preset({ id: 'midautumn', name: 'Mid-Autumn', category: 'festive', description: 'Lantern orange on night blue',
    bg: ['#1E1B4B', '#312E81'], text: '#FEF3C7', accent: '#F59E0B', onAccent: '#1E1B4B', surface: '#2E2A6B', radius: 16, shadow: 'md',
    fonts: [F.notoSerif, F.beVietnam], nameWeight: '700', link: 'centered', social: 'outline' }),
  // ─── GLASS ────────────────────────────────────────────────────
  preset({ id: 'aurora-glass', name: 'Aurora glass', category: 'glass', description: 'Living aurora behind frosted glass cards', pro: true,
    bg: '#f7f4ff', effect: 'aurora', mesh: ['#ff9ec7', '#a78bfa', '#7dd3fc'],
    text: '#2a1f4d', accent: '#7c3aed', accent2: '#ec4899', surface: '#ffffff8c', border: '#ffffffcc', borderWidth: 1, blur: 'lg', radius: 22, shadow: 'glow',
    fonts: [F.interTight, F.inter], nameWeight: '700', tracking: '-0.03em', nameGradient: true, link: 'centered', social: 'outline', gap: 'relaxed' }),
  preset({ id: 'frost', name: 'Frost', category: 'glass', description: 'Ice-blue mesh, clear glass, crisp type', pro: true,
    bg: '#f4faff', mesh: ['#bfe3ff', '#d9ccff', '#bff3e3'],
    text: '#0f2a43', accent: '#2563eb', accent2: '#06b6d4', surface: '#ffffffa6', border: '#ffffff', borderWidth: 1, blur: 'md', radius: 18, shadow: 'md',
    fonts: [F.interTight, F.inter], nameWeight: '600', tracking: '-0.03em', nameGradient: true, social: 'soft' }),
  preset({ id: 'midnight-glass', name: 'Midnight glass', category: 'glass', description: 'Glowing glass over a deep violet night', pro: true,
    bg: '#0b0b1a', mesh: ['#4f2aa8', '#0f5ea8', '#a12e8f'],
    text: '#f5f3ff', accent: '#a78bfa', accent2: '#38bdf8', onAccent: '#0b0b1a', surface: '#ffffff14', surfaceText: '#f5f3ff', border: '#ffffff2e', borderWidth: 1, blur: 'lg', radius: 20, shadow: 'glow',
    fonts: [F.grotesk, F.inter], nameWeight: '700', nameGradient: true, link: 'centered', social: 'outline' }),
  preset({ id: 'sakura-glass', name: 'Sakura glass', category: 'glass', description: 'Cherry blossom pink in soft glass', pro: true,
    bg: '#fff6f9', mesh: ['#ffc2d9', '#ffe0ec', '#e8d4ff'],
    text: '#5b1f3a', accent: '#db2777', accent2: '#a855f7', surface: '#ffffffa0', border: '#ffffff', borderWidth: 1, blur: 'md', radius: 999, shadow: 'sm',
    fonts: [F.playfair, F.beVietnam], nameWeight: '600', nameSize: '2.25rem', nameGradient: true, link: 'centered', social: 'outline', gap: 'relaxed' }),
  preset({ id: 'lagoon-glass', name: 'Lagoon', category: 'glass', description: 'Turquoise light drifting under clear cards',
    bg: '#f0fbfb', effect: 'aurora', mesh: ['#5eead4', '#7dd3fc', '#a5b4fc'],
    text: '#083344', accent: '#0e7490', accent2: '#14b8a6', surface: '#ffffff99', border: '#ffffffcc', borderWidth: 1, blur: 'lg', radius: 18,
    fonts: [F.montserrat, F.inter], nameWeight: '700', nameGradient: true, social: 'soft' }),

  // ─── LUXE ─────────────────────────────────────────────────────
  preset({ id: 'gold-noir', name: 'Gold noir', category: 'luxe', description: 'Black silk, gold lines and a gold name', pro: true,
    bg: '#0c0b09', pattern: 'diagonal', patternColor: '#c9a45c',
    text: '#f2e6c9', accent: '#c9a45c', accent2: '#f5e3a1', onAccent: '#0c0b09', surface: '#0c0b09d9', surfaceText: '#f2e6c9', border: '#c9a45c', borderWidth: 1, radius: 2,
    fonts: [F.cormorant, F.josefin], nameWeight: '600', nameSize: '2.5rem', tracking: '0.04em', nameGradient: true, link: 'centered', social: 'plain', gap: 'relaxed' }),
  preset({ id: 'marble', name: 'Marble', category: 'luxe', description: 'Soft stone tones, thin borders, serif type', pro: true,
    bg: '#fbfaf8', mesh: ['#ece8e1', '#f6f2ea', '#e6e2dc'],
    text: '#2b2621', accent: '#8b7355', accent2: '#c2a878', surface: '#ffffffd9', border: '#e2dbd0', borderWidth: 1, radius: 4, shadow: 'sm',
    fonts: [F.cormorant, F.lora], nameWeight: '500', nameSize: '2.5rem', link: 'centered', social: 'outline', gap: 'relaxed' }),
  preset({ id: 'emerald', name: 'Emerald velvet', category: 'luxe', description: 'Deep green velvet with gold trim', pro: true,
    bg: ['#0b3d2e', '#062019'], angle: 170,
    text: '#f4ead2', accent: '#d4af37', accent2: '#f3dc8a', onAccent: '#062019', surface: '#0f4a37', surfaceText: '#f4ead2', border: '#d4af37', borderWidth: 1, radius: 6, shadow: 'lg',
    fonts: [F.playfair, F.josefin], nameWeight: '600', nameSize: '2.25rem', nameGradient: true, link: 'centered', social: 'outline' }),
  preset({ id: 'royal', name: 'Royal navy', category: 'luxe', description: 'Navy and gold, quietly grand', pro: true,
    bg: ['#0b1d3a', '#13294b', '#0a1630'], angle: 160,
    text: '#eef2ff', accent: '#e6c36a', accent2: '#fff1c1', onAccent: '#0b1d3a', surface: '#ffffff0f', surfaceText: '#eef2ff', border: '#e6c36a66', borderWidth: 1, blur: 'md', radius: 10,
    fonts: [F.notoSerif, F.inter], nameWeight: '600', nameGradient: true, social: 'outline' }),
  preset({ id: 'rose-gold', name: 'Rose gold', category: 'luxe', description: 'Blush mesh and rose-gold accents', pro: true,
    bg: '#fff8f6', mesh: ['#f6d5cf', '#fbe7df', '#ecd2dc'],
    text: '#4a2a2a', accent: '#b76e79', accent2: '#e0a96d', surface: '#ffffffcc', border: '#ead2cc', borderWidth: 1, radius: 999, shadow: 'sm',
    fonts: [F.playfair, F.josefin], nameWeight: '600', nameSize: '2.25rem', nameGradient: true, link: 'centered', social: 'outline', gap: 'relaxed' }),
  preset({ id: 'pearl', name: 'Pearl', category: 'luxe', description: 'Iridescent pearl sheen, white cards',
    bg: '#fdfcff', mesh: ['#f1e8ff', '#e6f6ff', '#fff0f5'],
    text: '#262338', accent: '#5b5b8a', accent2: '#c084fc', surface: '#ffffff', border: '#ece8f5', borderWidth: 1, radius: 14, shadow: 'md',
    fonts: [F.cormorant, F.inter], nameWeight: '600', nameSize: '2.25rem', link: 'centered', social: 'soft' }),

  // ─── BOLD ─────────────────────────────────────────────────────
  preset({ id: 'brutal', name: 'Brutal', category: 'bold', description: 'Thick outlines, hard shadows, loud and clear',
    bg: '#fff5d6', pattern: 'dots', patternColor: '#111111',
    text: '#111111', accent: '#ff5c39', surface: '#ffffff', border: '#111111', borderWidth: 2, radius: 8, shadow: 'hard',
    fonts: [F.grotesk, F.grotesk], nameWeight: '700', tracking: '-0.03em', social: 'outline', titleAlign: 'left' }),
  preset({ id: 'brutal-pink', name: 'Hot pink', category: 'bold', description: 'Bubblegum pink with black outlines', pro: true,
    bg: '#ff90e8', text: '#000000', accent: '#000000', onAccent: '#ff90e8', surface: '#ffffff', border: '#000000', borderWidth: 3, radius: 0, shadow: 'hard',
    fonts: [F.grotesk, F.grotesk], nameWeight: '700', nameSize: '2.25rem', tracking: '-0.04em', avatar: 'square', social: 'filled' }),
  preset({ id: 'y2k', name: 'Y2K', category: 'bold', description: 'Chrome pastels, pill outlines, 2000s energy', pro: true,
    bg: ['#e0c3fc', '#8ec5fc'], angle: 135,
    text: '#1a1a2e', accent: '#ff4fd8', accent2: '#4f7bff', surface: '#ffffff', border: '#1a1a2e', borderWidth: 2, radius: 999, shadow: 'hard',
    fonts: [F.comfortaa, F.nunito], nameWeight: '700', nameSize: '2.25rem', nameGradient: true, link: 'centered', social: 'filled' }),
  preset({ id: 'vaporwave', name: 'Vaporwave', category: 'bold', description: 'Neon pink and cyan on a purple dusk', pro: true,
    bg: ['#2b0f54', '#ab1fa8', '#ff6c95'], angle: 180, pattern: 'grid', patternColor: '#ff71ce',
    text: '#ffffff', accent: '#01cdfe', accent2: '#ff71ce', onAccent: '#1a0b33', surface: '#1a0b33cc', surfaceText: '#ffffff', border: '#01cdfe', borderWidth: 1, radius: 4, shadow: 'glow',
    fonts: [F.grotesk, F.grotesk], nameWeight: '700', nameSize: '2.25rem', tracking: '0.02em', nameGradient: true, link: 'centered', social: 'outline' }),
  preset({ id: 'comic', name: 'Comic', category: 'bold', description: 'Halftone yellow, black ink, red pops',
    bg: '#ffe14d', pattern: 'dots', patternColor: '#e11d48',
    text: '#111111', accent: '#e11d48', surface: '#ffffff', border: '#111111', borderWidth: 3, radius: 14, shadow: 'hard',
    fonts: [F.lobster, F.nunito], nameWeight: '400', nameSize: '2.5rem', link: 'centered', social: 'filled' }),
  preset({ id: 'terminal', name: 'Terminal', category: 'bold', description: 'Green phosphor on a black grid', pro: true,
    bg: '#050a05', pattern: 'grid', patternColor: '#39ff14',
    text: '#b6ffa8', accent: '#39ff14', onAccent: '#050a05', surface: '#050a05e6', surfaceText: '#b6ffa8', border: '#39ff14', borderWidth: 1, radius: 0, shadow: 'glow',
    fonts: ['ui-monospace, monospace', 'ui-monospace, monospace'], nameWeight: '700', avatar: 'square', titleAlign: 'left', social: 'plain' }),
  preset({ id: 'poster', name: 'Poster', category: 'bold', description: 'Big type, red blocks, paper cream',
    bg: '#f3ede1', text: '#141414', accent: '#e63946', radius: 0,
    fonts: [F.montserrat, F.inter], nameWeight: '800', nameSize: '2.5rem', tracking: '-0.05em', header: 'left', titleAlign: 'left', avatar: 'square', link: 'centered', social: 'filled' }),

  // ─── More in the other groups ─────────────────────────────────
  preset({ id: 'notebook', name: 'Notebook', category: 'minimal', description: 'Grid paper and ink-blue notes',
    bg: '#fdfdf8', pattern: 'grid', patternColor: '#4f7bd9',
    text: '#1e2b4a', accent: '#2f5bd3', surface: '#ffffff', border: '#d7def0', borderWidth: 1, radius: 8,
    fonts: [F.grotesk, F.inter], nameWeight: '600', titleAlign: 'left', social: 'outline' }),
  preset({ id: 'ruled', name: 'Ruled paper', category: 'minimal', description: 'Soft lined paper, calm serif',
    bg: '#fffdf7', pattern: 'lines', patternColor: '#8fb3d9',
    text: '#2b2a27', accent: '#2b2a27', surface: '#fffdf7', border: '#e7e1d4', borderWidth: 1, radius: 4,
    fonts: [F.lora, F.inter], nameWeight: '600', social: 'plain' }),
  preset({ id: 'latte', name: 'Latte art', category: 'warm', description: 'Creamy coffee mesh, caramel accents', pro: true,
    bg: '#fbf4ec', mesh: ['#ead2b8', '#f6e1c6', '#e2c2a6'],
    text: '#3b2a1e', accent: '#9a5b2e', accent2: '#d6a15c', surface: '#fffaf3d9', border: '#ead9c3', borderWidth: 1, blur: 'sm', radius: 18, shadow: 'sm',
    fonts: [F.lora, F.nunito], nameWeight: '600', nameSize: '2.25rem', social: 'soft' }),
  preset({ id: 'sunset-mesh', name: 'Golden hour', category: 'warm', description: 'Peach, coral and honey melting together', pro: true,
    bg: '#fff4ec', mesh: ['#ffb38a', '#ff8fb1', '#ffd36e'],
    text: '#4a1d10', accent: '#e8590c', accent2: '#d6336c', surface: '#ffffffb3', border: '#ffffff', borderWidth: 1, blur: 'md', radius: 20, shadow: 'md',
    fonts: [F.poppins, F.poppins], nameWeight: '700', nameGradient: true, social: 'soft' }),
  preset({ id: 'botanical', name: 'Botanical', category: 'nature', description: 'Leaf green dots on linen',
    bg: '#f3f1e7', pattern: 'dots', patternColor: '#3f6b3a',
    text: '#22331f', accent: '#3f6b3a', surface: '#fbfaf4', border: '#d9d6c4', borderWidth: 1, radius: 16,
    fonts: [F.cormorant, F.beVietnam], nameWeight: '600', nameSize: '2.25rem', link: 'centered', social: 'outline' }),
  preset({ id: 'meadow', name: 'Meadow', category: 'nature', description: 'Fresh grass and sky in a soft mesh', pro: true,
    bg: '#f6fbf2', mesh: ['#c8eeb0', '#b9e4ff', '#f2f6b5'],
    text: '#1f3a1a', accent: '#3a8a2e', accent2: '#0ea5a4', surface: '#ffffffb8', border: '#ffffff', borderWidth: 1, blur: 'sm', radius: 18,
    fonts: [F.quicksand, F.beVietnam], nameWeight: '700', nameGradient: true, social: 'soft' }),
  preset({ id: 'cotton-candy', name: 'Cotton candy', category: 'pastel', description: 'Pastel aurora that never sits still', pro: true,
    bg: '#fff7fc', effect: 'aurora', mesh: ['#ffc6e0', '#c9b8ff', '#b8f0ff'],
    text: '#3d2a5a', accent: '#d946ef', accent2: '#6366f1', surface: '#ffffffb3', border: '#ffffff', borderWidth: 1, blur: 'md', radius: 999,
    fonts: [F.comfortaa, F.nunito], nameWeight: '700', nameGradient: true, link: 'centered', social: 'soft' }),
  preset({ id: 'dreamy', name: 'Dreamy', category: 'pastel', description: 'Lilac and sky mesh, round and soft',
    bg: '#fbf9ff', mesh: ['#e3d5ff', '#cfe8ff', '#ffd9ec'],
    text: '#33284d', accent: '#7c5cff', surface: '#ffffffc2', border: '#ffffff', borderWidth: 1, blur: 'sm', radius: 22,
    fonts: [F.quicksand, F.quicksand], nameWeight: '700', social: 'soft' }),
  preset({ id: 'cyber', name: 'Cyber glow', category: 'dark', description: 'Cyan neon edges on deep black', pro: true,
    bg: '#04060c', pattern: 'grid', patternColor: '#22d3ee',
    text: '#e6fbff', accent: '#22d3ee', accent2: '#a855f7', onAccent: '#04060c', surface: '#0b1220', surfaceText: '#e6fbff', border: '#22d3ee', borderWidth: 1, radius: 12, shadow: 'glow',
    fonts: [F.grotesk, F.inter], nameWeight: '700', nameGradient: true, social: 'outline' }),
  preset({ id: 'obsidian', name: 'Obsidian', category: 'dark', description: 'Polished black with a violet glow',
    bg: ['#0a0a0f', '#16141f'], angle: 170,
    text: '#ece9f6', accent: '#8b5cf6', accent2: '#ec4899', surface: '#17151f', surfaceText: '#ece9f6', border: '#2a2638', borderWidth: 1, radius: 14, shadow: 'glow',
    fonts: [F.interTight, F.inter], nameWeight: '600', tracking: '-0.03em', social: 'outline' }),
  preset({ id: 'lixi', name: 'Lì xì', category: 'festive', description: 'Red envelope red with gold waves', pro: true,
    bg: '#b3121f', pattern: 'waves', patternColor: '#f5c542',
    text: '#fff3d6', accent: '#f5c542', accent2: '#ffe08a', onAccent: '#7a0a12', surface: '#8f0d18', surfaceText: '#fff3d6', border: '#f5c542', borderWidth: 2, radius: 14, shadow: 'lg',
    fonts: [F.playfair, F.beVietnam], nameWeight: '700', nameSize: '2.25rem', nameGradient: true, link: 'centered', social: 'outline' }),
  preset({ id: 'party', name: 'Party', category: 'festive', description: 'Confetti dots and neon outlines', pro: true,
    bg: '#1b0b3a', pattern: 'dots', patternColor: '#facc15',
    text: '#fdf4ff', accent: '#f472b6', accent2: '#facc15', onAccent: '#1b0b3a', surface: '#2a1257', surfaceText: '#fdf4ff', border: '#f472b6', borderWidth: 2, radius: 999, shadow: 'glow',
    fonts: [F.pacifico, F.nunito], nameWeight: '400', nameSize: '2.5rem', nameGradient: true, link: 'centered', social: 'filled' }),
]

export const THEME_PRESETS_BY_CATEGORY = THEME_PRESET_CATEGORIES.map(cat => ({
  ...cat,
  presets: THEME_PRESETS.filter(p => p.category === cat.id),
}))
