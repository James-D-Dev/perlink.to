import type { ThemeBackground } from '~/types/bio'

export interface BackgroundPreset {
  id: string
  name: string
  preview: string
  value: ThemeBackground
}

export interface BackgroundCategory {
  label: string
  value: string
  presets: BackgroundPreset[]
}

export const backgroundCategories: BackgroundCategory[] = [
  {
    label: 'Solid',
    value: 'solid',
    presets: [
      { id: 'solid-white', name: 'Pure White', preview: '#FFFFFF', value: { type: 'solid', color: '#FFFFFF' } },
      { id: 'solid-black', name: 'Midnight', preview: '#0A0A0A', value: { type: 'solid', color: '#0A0A0A' } },
      { id: 'solid-slate', name: 'Slate', preview: '#0F172A', value: { type: 'solid', color: '#0F172A' } },
      { id: 'solid-warm', name: 'Warm White', preview: '#FAFAF8', value: { type: 'solid', color: '#FAFAF8' } },
      { id: 'solid-cream', name: 'Cream', preview: '#FDF8F0', value: { type: 'solid', color: '#FDF8F0' } },
      { id: 'solid-blush', name: 'Blush', preview: '#FFF1F2', value: { type: 'solid', color: '#FFF1F2' } },
      { id: 'solid-mint', name: 'Mint', preview: '#F0FDF4', value: { type: 'solid', color: '#F0FDF4' } },
      { id: 'solid-sky', name: 'Sky', preview: '#F0F9FF', value: { type: 'solid', color: '#F0F9FF' } },
      { id: 'solid-lavender', name: 'Lavender', preview: '#F5F3FF', value: { type: 'solid', color: '#F5F3FF' } },
      { id: 'solid-charcoal', name: 'Charcoal', preview: '#1C1C1E', value: { type: 'solid', color: '#1C1C1E' } },
    ],
  },
  {
    label: 'Gradient',
    value: 'gradient',
    presets: [
      { id: 'grad-aurora', name: 'Aurora', preview: 'linear-gradient(135deg, #0D9488, #6366F1, #7C3AED)', value: { type: 'gradient', gradient: { angle: 135, from: '#0D9488', via: '#6366F1', to: '#7C3AED' } } },
      { id: 'grad-sunset', name: 'Sunset', preview: 'linear-gradient(135deg, #F97316, #EC4899, #9333EA)', value: { type: 'gradient', gradient: { angle: 135, from: '#F97316', via: '#EC4899', to: '#9333EA' } } },
      { id: 'grad-ocean', name: 'Ocean', preview: 'linear-gradient(160deg, #0EA5E9, #0369A1, #0C4A6E)', value: { type: 'gradient', gradient: { angle: 160, from: '#0EA5E9', via: '#0369A1', to: '#0C4A6E' } } },
      { id: 'grad-rose', name: 'Rose Garden', preview: 'linear-gradient(120deg, #F9A8D4, #C084FC, #818CF8)', value: { type: 'gradient', gradient: { angle: 120, from: '#F9A8D4', via: '#C084FC', to: '#818CF8' } } },
      { id: 'grad-forest', name: 'Forest', preview: 'linear-gradient(135deg, #059669, #0D9488)', value: { type: 'gradient', gradient: { angle: 135, from: '#059669', to: '#0D9488' } } },
      { id: 'grad-galaxy', name: 'Galaxy', preview: 'linear-gradient(135deg, #0D0019, #1A0033)', value: { type: 'gradient', gradient: { angle: 135, from: '#0D0019', to: '#1A0033' } } },
      { id: 'grad-golden', name: 'Golden Hour', preview: 'linear-gradient(135deg, #F59E0B, #EF4444)', value: { type: 'gradient', gradient: { angle: 135, from: '#F59E0B', to: '#EF4444' } } },
      { id: 'grad-arctic', name: 'Arctic', preview: 'linear-gradient(135deg, #BAE6FD, #E0F2FE)', value: { type: 'gradient', gradient: { angle: 135, from: '#BAE6FD', to: '#E0F2FE' } } },
      { id: 'grad-peach', name: 'Peach', preview: 'linear-gradient(135deg, #FED7AA, #FCA5A5)', value: { type: 'gradient', gradient: { angle: 135, from: '#FED7AA', to: '#FCA5A5' } } },
      { id: 'grad-midnight', name: 'Midnight Blue', preview: 'linear-gradient(135deg, #1E3A5F, #0F172A)', value: { type: 'gradient', gradient: { angle: 135, from: '#1E3A5F', to: '#0F172A' } } },
      { id: 'mesh-dream', name: 'Dream', preview: '', value: { type: 'gradient', color: '#fff7fb', gradient: { style: 'mesh', from: '#ffc6e0', via: '#d9c6ff', to: '#bfe8ff' } } },
      { id: 'mesh-peach', name: 'Peach mesh', preview: '', value: { type: 'gradient', color: '#fff8f1', gradient: { style: 'mesh', from: '#ffd1b3', via: '#ffb3c7', to: '#ffe9a8' } } },
      { id: 'mesh-lagoon', name: 'Lagoon mesh', preview: '', value: { type: 'gradient', color: '#f3fbff', gradient: { style: 'mesh', from: '#a7e8ff', via: '#b6c8ff', to: '#b7f5df' } } },
      { id: 'mesh-sunset', name: 'Sunset mesh', preview: '', value: { type: 'gradient', color: '#fff4ec', gradient: { style: 'mesh', from: '#ffb38a', via: '#ff8fb1', to: '#ffd36e' } } },
      { id: 'mesh-night', name: 'Night mesh', preview: '', value: { type: 'gradient', color: '#0b0b1a', gradient: { style: 'mesh', from: '#4f2aa8', via: '#0f5ea8', to: '#a12e8f' } } },
      { id: 'mesh-forest', name: 'Forest mesh', preview: '', value: { type: 'gradient', color: '#f4fbf3', gradient: { style: 'mesh', from: '#b9e6b0', via: '#e3f3a7', to: '#a7dccf' } } },
    ],
  },
  {
    // Laid over the current solid or gradient background
    label: 'Pattern',
    value: 'pattern',
    presets: [
      { id: 'pat-dots', name: 'dots', preview: '', value: { type: 'solid', pattern: { id: 'dots' } } },
      { id: 'pat-grid', name: 'grid', preview: '', value: { type: 'solid', pattern: { id: 'grid' } } },
      { id: 'pat-lines', name: 'lines', preview: '', value: { type: 'solid', pattern: { id: 'lines' } } },
      { id: 'pat-checker', name: 'checker', preview: '', value: { type: 'solid', pattern: { id: 'checker' } } },
      { id: 'pat-diagonal', name: 'diagonal', preview: '', value: { type: 'solid', pattern: { id: 'diagonal' } } },
      { id: 'pat-waves', name: 'waves', preview: '', value: { type: 'solid', pattern: { id: 'waves' } } },
    ],
  },
  {
    label: 'Image',
    value: 'image',
    presets: [
      { id: 'img-abstract1', name: 'Abstract Waves', preview: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200&q=60', value: { type: 'image', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=80' } },
      { id: 'img-abstract2', name: 'Neon Glow', preview: 'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=200&q=60', value: { type: 'image', imageUrl: 'https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?w=1200&q=80' } },
      { id: 'img-nature1', name: 'Green Forest', preview: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&q=60', value: { type: 'image', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80' } },
      { id: 'img-nature2', name: 'Ocean Sunset', preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=60', value: { type: 'image', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80' } },
      { id: 'img-dark1', name: 'Dark Stars', preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=60', value: { type: 'image', imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80' } },
      { id: 'img-custom', name: 'Custom URL', preview: '', value: { type: 'image', imageUrl: '' } },
    ],
  },
  {
    label: 'Video',
    value: 'video',
    presets: [
      { id: 'vid-custom', name: 'Custom URL', preview: '', value: { type: 'video', videoUrl: '' } },
    ],
  },
  {
    label: 'Effect',
    value: 'effect',
    presets: [
      { id: 'fx-aurora', name: 'Aurora', preview: 'fx-aurora', value: { type: 'effect', effectId: 'aurora', color: '#fdf7ff' } },
      { id: 'fx-particles', name: 'Particles', preview: 'fx-particles', value: { type: 'effect', effectId: 'particles' } },
      { id: 'fx-falling-stars', name: 'Falling Stars', preview: 'fx-falling-stars', value: { type: 'effect', effectId: 'falling-stars' } },
      { id: 'fx-stars', name: 'Stars', preview: 'fx-stars', value: { type: 'effect', effectId: 'stars' } },
      { id: 'fx-snow', name: 'Snow', preview: 'fx-snow', value: { type: 'effect', effectId: 'snow' } },
      { id: 'fx-rose', name: 'Rose', preview: 'fx-rose', value: { type: 'effect', effectId: 'rose' } },
      { id: 'fx-flickering-grid', name: 'Flickering Grid', preview: 'fx-flickering-grid', value: { type: 'effect', effectId: 'flickering-grid' } },
      { id: 'fx-interactive-grid', name: 'Interactive Grid', preview: 'fx-interactive-grid', value: { type: 'effect', effectId: 'interactive-grid' } },
      { id: 'fx-neural', name: 'Neural', preview: 'fx-neural', value: { type: 'effect', effectId: 'neural' } },
      { id: 'fx-silk', name: 'Silk', preview: 'fx-silk', value: { type: 'effect', effectId: 'silk' } },
      { id: 'fx-black-hole', name: 'Black Hole', preview: 'fx-black-hole', value: { type: 'effect', effectId: 'black-hole' } },
      { id: 'fx-thunderstorm', name: 'Thunderstorm', preview: 'fx-thunderstorm', value: { type: 'effect', effectId: 'thunderstorm' } },
    ],
  },
]
