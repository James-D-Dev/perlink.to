export interface ColorPalette {
  name: string
  primary: string
  secondary: string
  third: string
  textColor: string
}

export interface ColorPaletteCategory {
  label: string
  value: string
  palettes: ColorPalette[]
}

export const colorPaletteCategories: ColorPaletteCategory[] = [
  {
    label: 'Neutral',
    value: 'neutral',
    palettes: [
      { name: 'Basic Grayscale', primary: '#FFFFFF', secondary: '#9CA3AF', third: '#111111', textColor: '#111111' },
      { name: 'Emerald Sea', primary: '#0D9488', secondary: '#5EAAA8', third: '#F0F9FF', textColor: '#FFFFFF' },
      { name: 'Golden Sand', primary: '#F5F0E8', secondary: '#B8985A', third: '#1E2A3A', textColor: '#1E2A3A' },
      { name: 'Misty Harbor', primary: '#F3F4F6', secondary: '#0D9488', third: '#1F2937', textColor: '#1F2937' },
      { name: 'Twilight Blue', primary: '#1E3A5F', secondary: '#4A6FA5', third: '#E8ECF4', textColor: '#FFFFFF' },
      { name: 'Earthy Elegance', primary: '#6B3A2A', secondary: '#C4795A', third: '#F9F3EE', textColor: '#FFFFFF' },
    ],
  },
  {
    label: 'Bold',
    value: 'bold',
    palettes: [
      { name: 'Crimson Fire', primary: '#DC2626', secondary: '#F97316', third: '#1C1917', textColor: '#FFFFFF' },
      { name: 'Royal Purple', primary: '#7C3AED', secondary: '#A855F7', third: '#2E1065', textColor: '#FFFFFF' },
      { name: 'Ocean Depth', primary: '#0369A1', secondary: '#0EA5E9', third: '#F0F9FF', textColor: '#FFFFFF' },
      { name: 'Forest Storm', primary: '#166534', secondary: '#16A34A', third: '#F0FDF4', textColor: '#FFFFFF' },
      { name: 'Midnight Gold', primary: '#0A0A0A', secondary: '#D97706', third: '#FFFBEB', textColor: '#D97706' },
      { name: 'Hot Coral', primary: '#FF4D4D', secondary: '#FF8C69', third: '#1A0000', textColor: '#FFFFFF' },
    ],
  },
  {
    label: 'Playful',
    value: 'playful',
    palettes: [
      { name: 'Candy Pop', primary: '#F472B6', secondary: '#A78BFA', third: '#FFF7FB', textColor: '#4A044E' },
      { name: 'Citrus Splash', primary: '#FACC15', secondary: '#FB923C', third: '#1C1400', textColor: '#422006' },
      { name: 'Mint Breeze', primary: '#34D399', secondary: '#6EE7B7', third: '#F0FDF4', textColor: '#064E3B' },
      { name: 'Sky Berry', primary: '#38BDF8', secondary: '#E879F9', third: '#0F0A1E', textColor: '#0F0A1E' },
      { name: 'Lemon Lavender', primary: '#FDE68A', secondary: '#C4B5FD', third: '#1E1830', textColor: '#1E1830' },
      { name: 'Watermelon', primary: '#F43F5E', secondary: '#86EFAC', third: '#FFF1F2', textColor: '#FFFFFF' },
    ],
  },
  {
    label: 'Dark',
    value: 'dark',
    palettes: [
      { name: 'Midnight Aura', primary: '#8B5CF6', secondary: '#6D28D9', third: '#1C1C2E', textColor: '#FFFFFF' },
      { name: 'Carbon Code', primary: '#58A6FF', secondary: '#1F6FEB', third: '#0D1117', textColor: '#0D1117' },
      { name: 'Noir Gold', primary: '#F5C842', secondary: '#D4A017', third: '#2A2A2A', textColor: '#0A0A0A' },
      { name: 'Matrix Green', primary: '#00FF41', secondary: '#008F11', third: '#001100', textColor: '#001100' },
      { name: 'Neon Cyan', primary: '#38BDF8', secondary: '#0EA5E9', third: '#020617', textColor: '#020617' },
      { name: 'Galactic', primary: '#D946EF', secondary: '#A855F7', third: '#1A0033', textColor: '#FFFFFF' },
    ],
  },
  {
    label: 'Gradient',
    value: 'gradient',
    palettes: [
      { name: 'Aurora', primary: '#7C3AED', secondary: '#06B6D4', third: '#EDE9FE', textColor: '#FFFFFF' },
      { name: 'Sunset', primary: '#F97316', secondary: '#EC4899', third: '#9333EA', textColor: '#FFFFFF' },
      { name: 'Ocean Wave', primary: '#0EA5E9', secondary: '#0369A1', third: '#0C4A6E', textColor: '#0C4A6E' },
      { name: 'Rose Petal', primary: '#F9A8D4', secondary: '#C084FC', third: '#818CF8', textColor: '#3B0764' },
      { name: 'Forest Mist', primary: '#059669', secondary: '#0D9488', third: '#1E3A5F', textColor: '#FFFFFF' },
      { name: 'Amber Dusk', primary: '#F59E0B', secondary: '#EF4444', third: '#7C3AED', textColor: '#1C1400' },
    ],
  },
]
