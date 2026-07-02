import type { ThemeConfig } from '~/types/bio'

export type ThemePresetCategory =
  | 'classic'
  | 'vibrant'
  | 'dark'
  | 'minimal'
  | 'gradient'
  | 'neon'

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
}

export const THEME_PRESET_CATEGORIES: { id: ThemePresetCategory; label: string }[] = [
  { id: 'classic',  label: 'Classic' },
  { id: 'vibrant',  label: 'Vibrant' },
  { id: 'dark',     label: 'Dark' },
  { id: 'minimal',  label: 'Minimal' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'neon',     label: 'Neon' },
]

export const THEME_PRESETS: ThemePreset[] = [
  // ─── CLASSIC ──────────────────────────────────────────────────
  {
    id: 'classic-white',
    name: 'Clean White',
    category: 'classic',
    description: 'Timeless white with purple accents',
    preview: { bg: '#FFFFFF', card: '#F9FAFB', text: '#111827' },
    theme: {
      colors: { primary: '#7C3AED', secondary: '#A78BFA', third: '#EDE9FE' },
      background: { type: 'solid', color: '#FFFFFF' },
      card: { style: 'filled', textColor: "#ffffff", cornerRadius: 12, transparency: 1, shadow: 'sm', animationAppear: 'fadeInUp', animationHover: 'pulse' },
      button: { style: 'filled', cornerRadius: 12, shadow: 'none' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: false, animationAppear: 'fadeIn', animationHover: 'pulse' },
      link: { layout: 'horizontal-left' as const },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'classic-ivory',
    name: 'Warm Ivory',
    category: 'classic',
    description: 'Soft ivory tones with warm brown',
    preview: { bg: '#FDFAF6', card: '#FEF3C7', text: '#78350F' },
    theme: {
      colors: { primary: '#D97706', secondary: '#FCD34D', third: '#FEF3C7' },
      background: { type: 'solid', color: '#FDFAF6' },
      card: { style: 'filled', textColor: "#ffffff", cornerRadius: 16, transparency: 1, shadow: 'sm', animationAppear: 'fadeIn', animationHover: 'headShake' },
      button: { style: 'soft', cornerRadius: 16, shadow: 'none' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: true, borderColor: '#D97706', animationAppear: 'fadeIn', animationHover: 'headShake' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Georgia, serif', headingFont: 'Georgia, serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'classic-slate',
    name: 'Slate Professional',
    category: 'classic',
    description: 'Corporate slate with blue highlights',
    preview: { bg: '#F8FAFC', card: '#E2E8F0', text: '#1E293B' },
    theme: {
      colors: { primary: '#0F172A', secondary: '#3B82F6', third: '#EFF6FF' },
      background: { type: 'solid', color: '#F8FAFC' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 8, transparency: 1, shadow: 'sm', outlineColor: '#E2E8F0', animationAppear: 'fadeInLeft' },
      button: { style: 'outline', cornerRadius: 8, shadow: 'none', animationHover: 'wobble' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'rounded', size: 'lg', border: true, borderColor: '#3B82F6', animationAppear: 'fadeInLeft', animationHover: 'headShake' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },

  // ─── VIBRANT ──────────────────────────────────────────────────
  {
    id: 'vibrant-coral',
    name: 'Sunset Coral',
    category: 'vibrant',
    description: 'Bold coral and orange energy',
    preview: { bg: '#FFF7ED', card: '#FED7AA', text: '#9A3412' },
    theme: {
      colors: { primary: '#EA580C', secondary: '#FB923C', third: '#FFEDD5' },
      background: { type: 'solid', color: '#FFF7ED' },
      card: { style: 'filled', textColor: "#ffffff", cornerRadius: 20, transparency: 1, shadow: 'md', animationAppear: 'bounceInDown', animationHover: 'rubberBand', animationDuration: 'fast' },
      button: { style: 'filled', cornerRadius: 20, shadow: 'sm', animationHover: 'tada' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'xl', border: true, borderColor: '#EA580C', animationAppear: 'bounceIn', animationHover: 'rubberBand', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'xl', paragraphSize: 'sm' },
    },
  },
  {
    id: 'vibrant-emerald',
    name: 'Tropical Emerald',
    category: 'vibrant',
    description: 'Fresh tropical greens with energy',
    preview: { bg: '#ECFDF5', card: '#A7F3D0', text: '#065F46' },
    theme: {
      colors: { primary: '#059669', secondary: '#34D399', third: '#ECFDF5' },
      background: { type: 'solid', color: '#ECFDF5' },
      card: { style: 'filled', textColor: "#ffffff", cornerRadius: 16, transparency: 1, shadow: 'md', animationAppear: 'zoomIn', animationHover: 'pulse', animationDuration: 'fast' },
      button: { style: 'filled', cornerRadius: 16, shadow: 'sm', animationHover: 'bounce' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: true, borderColor: '#059669', animationAppear: 'zoomIn', animationHover: 'bounce', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'vibrant-rose',
    name: 'Rose Garden',
    category: 'vibrant',
    description: 'Bold rose and pink palette',
    preview: { bg: '#FFF1F2', card: '#FECDD3', text: '#9F1239' },
    theme: {
      colors: { primary: '#E11D48', secondary: '#FB7185', third: '#FFF1F2' },
      background: { type: 'solid', color: '#FFF1F2' },
      card: { style: 'filled', textColor: "#ffffff", cornerRadius: 24, transparency: 1, shadow: 'sm', animationAppear: 'fadeInUp', animationHover: 'heartBeat', animationDuration: 'fast' },
      button: { style: 'filled', cornerRadius: 24, shadow: 'none', animationHover: 'swing' },
      header: { alignment: 'center', spacing: 'spacious' },
      avatar: { shape: 'circle', size: 'xl', border: true, borderColor: '#E11D48', animationAppear: 'fadeInDown', animationHover: 'heartBeat', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Georgia, serif', headingFont: 'Georgia, serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'xl', paragraphSize: 'sm' },
    },
  },

  // ─── DARK ─────────────────────────────────────────────────────
  {
    id: 'dark-obsidian',
    name: 'Obsidian',
    category: 'dark',
    description: 'Deep dark with violet highlights',
    preview: { bg: '#0F0F0F', card: '#1C1C1E', text: '#FFFFFF' },
    theme: {
      colors: { primary: '#8B5CF6', secondary: '#6D28D9', third: '#1C1C2E' },
      background: { type: 'solid', color: '#0F0F0F' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 12, transparency: 0.9, shadow: 'lg', outlineColor: '#2D2D3D', animationAppear: 'fadeIn', animationHover: 'pulse' },
      button: { style: 'soft', cornerRadius: 12, shadow: 'md', animationHover: 'rubberBand' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: true, borderColor: '#8B5CF6', animationAppear: 'fadeIn', animationHover: 'pulse' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'dark-midnight',
    name: 'Midnight Blue',
    category: 'dark',
    description: 'Navy and electric blue dark mode',
    preview: { bg: '#0D1117', card: '#161B22', text: '#58A6FF' },
    theme: {
      colors: { primary: '#58A6FF', secondary: '#1F6FEB', third: '#0D1117' },
      background: { type: 'solid', color: '#0D1117' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 8, transparency: 1, shadow: 'md', outlineColor: '#30363D', animationAppear: 'slideInDown', animationHover: 'headShake' },
      button: { style: 'outline', cornerRadius: 8, shadow: 'none', animationHover: 'flash' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'rounded', size: 'lg', border: true, borderColor: '#58A6FF', animationAppear: 'slideInDown', animationHover: 'headShake' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'ui-monospace, monospace', headingFont: 'ui-monospace, monospace', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'dark-charcoal',
    name: 'Charcoal Gold',
    category: 'dark',
    description: 'Sophisticated dark with gold accents',
    preview: { bg: '#1A1A1A', card: '#2A2A2A', text: '#F5C842' },
    theme: {
      colors: { primary: '#F5C842', secondary: '#D4A017', third: '#2A2A2A' },
      background: { type: 'solid', color: '#1A1A1A' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 4, transparency: 1, shadow: 'lg', outlineColor: '#3A3A2A', animationAppear: 'backInUp', animationHover: 'wobble' },
      button: { style: 'outline', cornerRadius: 4, shadow: 'none', animationHover: 'jello' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'square', size: 'lg', border: true, borderColor: '#F5C842', animationAppear: 'backInUp', animationHover: 'wobble' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Georgia, serif', headingFont: 'Georgia, serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },

  // ─── MINIMAL ──────────────────────────────────────────────────
  {
    id: 'minimal-pure',
    name: 'Pure White',
    category: 'minimal',
    description: 'Ultra-clean with no distractions',
    preview: { bg: '#FFFFFF', card: '#FFFFFF', text: '#000000' },
    theme: {
      colors: { primary: '#000000', secondary: '#525252', third: '#F5F5F5' },
      background: { type: 'solid', color: '#FFFFFF' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 0, transparency: 1, shadow: 'none', outlineColor: '#E5E5E5', animationAppear: 'fadeIn' },
      button: { style: 'outline', cornerRadius: 0, shadow: 'none', animationHover: 'headShake' },
      header: { alignment: 'center', spacing: 'spacious' },
      avatar: { shape: 'circle', size: 'lg', border: false, animationAppear: 'fadeIn' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'minimal-sand',
    name: 'Desert Sand',
    category: 'minimal',
    description: 'Calm neutral tones, distraction-free',
    preview: { bg: '#FAF9F6', card: '#F0EDE4', text: '#4A3728' },
    theme: {
      colors: { primary: '#8B6F47', secondary: '#C4A882', third: '#F0EDE4' },
      background: { type: 'solid', color: '#FAF9F6' },
      card: { style: 'ghost', textColor: "#000000", cornerRadius: 8, transparency: 1, shadow: 'none', animationAppear: 'fadeInUp' },
      button: { style: 'ghost', cornerRadius: 8, shadow: 'none', animationHover: 'pulse' },
      header: { alignment: 'center', spacing: 'spacious' },
      avatar: { shape: 'circle', size: 'md', border: false, animationAppear: 'fadeInUp' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Georgia, serif', headingFont: 'Georgia, serif', paragraphFont: 'Georgia, serif', nameSize: 'md', paragraphSize: 'sm' },
    },
  },
  {
    id: 'minimal-frost',
    name: 'Frost',
    category: 'minimal',
    description: 'Ice-cool light grey minimalism',
    preview: { bg: '#F0F4F8', card: '#FFFFFF', text: '#334155' },
    theme: {
      colors: { primary: '#64748B', secondary: '#94A3B8', third: '#F0F4F8' },
      background: { type: 'solid', color: '#F0F4F8' },
      card: { style: 'soft', textColor: "#ffffff", cornerRadius: 16, transparency: 1, shadow: 'sm', animationAppear: 'zoomIn', animationHover: 'pulse' },
      button: { style: 'soft', cornerRadius: 16, shadow: 'none' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: false, animationAppear: 'zoomIn', animationHover: 'pulse' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },

  // ─── GRADIENT ─────────────────────────────────────────────────
  {
    id: 'gradient-aurora',
    name: 'Aurora',
    category: 'gradient',
    description: 'Northern lights — teal to purple',
    preview: { bg: '#0D9488', card: 'rgba(255,255,255,0.15)', text: '#FFFFFF' },
    theme: {
      colors: { primary: '#FFFFFF', secondary: '#A5F3FC', third: '#4C1D95' },
      background: { type: 'gradient', gradient: { angle: 135, from: '#0D9488', via: '#6366F1', to: '#7C3AED' } },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 16, transparency: 0.15, shadow: 'md', outlineColor: 'rgba(255,255,255,0.2)', animationAppear: 'fadeInUp', animationHover: 'pulse', animationDuration: 'fast' },
      button: { style: 'soft', cornerRadius: 16, shadow: 'none', animationHover: 'bounce' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: true, borderColor: 'rgba(255,255,255,0.6)', animationAppear: 'zoomIn', animationHover: 'pulse', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    category: 'gradient',
    description: 'Warm sunset from orange to pink',
    preview: { bg: '#F97316', card: 'rgba(255,255,255,0.2)', text: '#FFFFFF' },
    theme: {
      colors: { primary: '#FFFFFF', secondary: '#FDE68A', third: '#831843' },
      background: { type: 'gradient', gradient: { angle: 135, from: '#F97316', via: '#EC4899', to: '#9333EA' } },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 20, transparency: 0.2, shadow: 'lg', outlineColor: 'rgba(255,255,255,0.25)', animationAppear: 'bounceInUp', animationHover: 'rubberBand', animationDuration: 'fast' },
      button: { style: 'soft', cornerRadius: 20, shadow: 'sm', animationHover: 'heartBeat' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'xl', border: true, borderColor: 'rgba(255,255,255,0.7)', animationAppear: 'bounceInDown', animationHover: 'heartBeat', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'xl', paragraphSize: 'sm' },
    },
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Deep',
    category: 'gradient',
    description: 'Deep ocean blues to navy',
    preview: { bg: '#0EA5E9', card: 'rgba(255,255,255,0.12)', text: '#FFFFFF' },
    theme: {
      colors: { primary: '#FFFFFF', secondary: '#BAE6FD', third: '#0C4A6E' },
      background: { type: 'gradient', gradient: { angle: 160, from: '#0EA5E9', via: '#0369A1', to: '#0C4A6E' } },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 12, transparency: 0.12, shadow: 'md', outlineColor: 'rgba(255,255,255,0.15)', animationAppear: 'slideInUp', animationHover: 'wobble' },
      button: { style: 'soft', cornerRadius: 12, shadow: 'none', animationHover: 'swing' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: true, borderColor: 'rgba(186,230,253,0.8)', animationAppear: 'slideInUp', animationHover: 'swing' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'gradient-candy',
    name: 'Candy Pop',
    category: 'gradient',
    description: 'Fun pastel pink to lavender',
    preview: { bg: '#F9A8D4', card: 'rgba(255,255,255,0.3)', text: '#701A75' },
    theme: {
      colors: { primary: '#A21CAF', secondary: '#F0ABFC', third: '#FDF4FF' },
      background: { type: 'gradient', gradient: { angle: 120, from: '#F9A8D4', via: '#C084FC', to: '#818CF8' } },
      card: { style: 'soft', textColor: "#ffffff", cornerRadius: 24, transparency: 0.3, shadow: 'sm', animationAppear: 'zoomIn', animationHover: 'tada', animationDuration: 'fast' },
      button: { style: 'soft', cornerRadius: 24, shadow: 'none', animationHover: 'bounce' },
      header: { alignment: 'center', spacing: 'spacious' },
      avatar: { shape: 'circle', size: 'xl', border: true, borderColor: 'rgba(255,255,255,0.7)', animationAppear: 'zoomIn', animationHover: 'tada', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'xl', paragraphSize: 'sm' },
    },
  },

  // ─── NEON ─────────────────────────────────────────────────────
  {
    id: 'neon-cyber',
    name: 'Cyberpunk',
    category: 'neon',
    description: 'Electric yellow on near-black',
    preview: { bg: '#0A0A0A', card: '#111111', text: '#FACC15' },
    theme: {
      colors: { primary: '#FACC15', secondary: '#FDE047', third: '#1A1A00' },
      background: { type: 'solid', color: '#0A0A0A' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 0, transparency: 1, shadow: 'none', outlineColor: '#FACC15', animationAppear: 'lightSpeedInRight', animationHover: 'flash', animationDuration: 'faster' },
      button: { style: 'outline', cornerRadius: 0, shadow: 'none', animationHover: 'shakeX' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'square', size: 'lg', border: true, borderColor: '#FACC15', animationAppear: 'lightSpeedInRight', animationHover: 'flash', animationDuration: 'faster' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'ui-monospace, monospace', headingFont: 'ui-monospace, monospace', paragraphFont: 'ui-monospace, monospace', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'neon-matrix',
    name: 'Matrix',
    category: 'neon',
    description: 'Hacker green on black',
    preview: { bg: '#000000', card: '#001100', text: '#00FF41' },
    theme: {
      colors: { primary: '#00FF41', secondary: '#008F11', third: '#001100' },
      background: { type: 'solid', color: '#000000' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 4, transparency: 1, shadow: 'none', outlineColor: '#00FF41', animationAppear: 'flipInX', animationHover: 'flash', animationDuration: 'faster' },
      button: { style: 'outline', cornerRadius: 4, shadow: 'none', animationHover: 'jello' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'square', size: 'lg', border: true, borderColor: '#00FF41', animationAppear: 'flipInX', animationHover: 'flash', animationDuration: 'faster' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'ui-monospace, monospace', headingFont: 'ui-monospace, monospace', paragraphFont: 'ui-monospace, monospace', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'neon-electric',
    name: 'Electric Blue',
    category: 'neon',
    description: 'Glowing electric blue on deep black',
    preview: { bg: '#020617', card: '#0F172A', text: '#38BDF8' },
    theme: {
      colors: { primary: '#38BDF8', secondary: '#0EA5E9', third: '#0F172A' },
      background: { type: 'solid', color: '#020617' },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 8, transparency: 1, shadow: 'lg', outlineColor: '#38BDF8', animationAppear: 'rotateIn', animationHover: 'rubberBand', animationDuration: 'fast' },
      button: { style: 'outline', cornerRadius: 8, shadow: 'none', animationHover: 'wobble' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: true, borderColor: '#38BDF8', animationAppear: 'rotateIn', animationHover: 'rubberBand', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'ui-monospace, monospace', headingFont: 'ui-monospace, monospace', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    category: 'neon',
    description: 'Vaporwave purple on dark',
    preview: { bg: '#0D0019', card: '#1A0033', text: '#D946EF' },
    theme: {
      colors: { primary: '#D946EF', secondary: '#A855F7', third: '#1A0033' },
      background: { type: 'gradient', gradient: { angle: 135, from: '#0D0019', to: '#1A0033' } },
      card: { style: 'outline', textColor: "#ffffff", cornerRadius: 12, transparency: 1, shadow: 'lg', outlineColor: '#D946EF', animationAppear: 'backInDown', animationHover: 'tada', animationDuration: 'fast' },
      button: { style: 'soft', cornerRadius: 12, shadow: 'md', animationHover: 'swing' },
      header: { alignment: 'center', spacing: 'normal' },
      avatar: { shape: 'circle', size: 'lg', border: true, borderColor: '#D946EF', animationAppear: 'backInDown', animationHover: 'tada', animationDuration: 'fast' },
      link: { layout: 'horizontal-left' },
      typography: { nameFont: 'Inter, system-ui, sans-serif', headingFont: 'Inter, system-ui, sans-serif', paragraphFont: 'Inter, system-ui, sans-serif', nameSize: 'lg', paragraphSize: 'sm' },
    },
  },
]

export const THEME_PRESETS_BY_CATEGORY = THEME_PRESET_CATEGORIES.map(cat => ({
  ...cat,
  presets: THEME_PRESETS.filter(p => p.category === cat.id),
}))
