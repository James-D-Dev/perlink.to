export interface FontOption {
  label: string;
  value: string;
  family: string;
  weights?: number[];
  category?: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
}

// Google Fonts configuration
// Format: family:weights (e.g., "Inter:400;600;700")
export const GOOGLE_FONTS = [
  'Inter:wght@300;400;500;600;700',
  'Inter+Tight:wght@300;400;500;600;700',
  'Cormorant+Garamond:wght@400;500;600;700',
  'Roboto:wght@400;500;700',
  'Poppins:wght@400;500;600;700',
  'Playfair+Display:wght@400;500;600;700',
  'Montserrat:wght@400;500;600;700',
  'Open+Sans:wght@400;500;600;700',
  'Lato:wght@400;700',
  'Merriweather:wght@400;700',
  'Story+Script:wght@400', // Only Regular 400
  'Birthstone:wght@400', // Only Regular 400
  'Dancing+Script:wght@400;500;600;700',
  'Pacifico:wght@400',
  'Lobster:wght@400',
  'Abril+Fatface:wght@400',
  'Bebas+Neue:wght@400',
  'Cinzel:wght@400;500;600;700',
  'Great+Vibes:wght@400',
  'Satisfy:wght@400',
  'Sacramento:wght@400',
  'Alex+Brush:wght@400',
  'Allura:wght@400',
  'Parisienne:wght@400',
  'Tangerine:wght@400;700',
  'Be+Vietnam+Pro:wght@400;500;600;700',
  'Lora:wght@400;500;600;700',
  'Nunito:wght@400;600;700;800',
  'Quicksand:wght@400;500;600;700',
  'Josefin+Sans:wght@400;600;700',
  'Space+Grotesk:wght@400;500;600;700',
  'Noto+Serif:wght@400;600;700',
  'Comfortaa:wght@400;600;700',
];

// Font options for Typography (Name/Bio font)
export const nameFontOptions: FontOption[] = [
  { label: 'System UI', value: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', family: 'system-ui' },
  { label: 'Inter', value: 'Inter, sans-serif', family: 'Inter', weights: [400, 500, 600, 700] },
  { label: 'Inter Tight', value: 'Inter Tight, sans-serif', family: 'Inter Tight', weights: [300, 400, 500, 600, 700] },
  { label: 'Roboto', value: 'Roboto, sans-serif', family: 'Roboto', weights: [400, 500, 700] },
  { label: 'Poppins', value: 'Poppins, sans-serif', family: 'Poppins', weights: [400, 500, 600, 700] },
  { label: 'Montserrat', value: 'Montserrat, sans-serif', family: 'Montserrat', weights: [400, 500, 600, 700] },
  { label: 'Open Sans', value: 'Open Sans, sans-serif', family: 'Open Sans', weights: [400, 500, 600, 700] },
  { label: 'Lato', value: 'Lato, sans-serif', family: 'Lato', weights: [400, 700] },
  { label: 'Merriweather', value: 'Merriweather, serif', family: 'Merriweather', weights: [400, 700], category: 'serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif', family: 'Playfair Display', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', family: 'Cormorant Garamond', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif', family: 'Times New Roman', category: 'serif' },
  // Script/Display fonts
  { label: 'Story Script', value: 'Story Script, cursive', family: 'Story Script', weights: [400], category: 'handwriting' },
  { label: 'Birthstone', value: 'Birthstone, cursive', family: 'Birthstone', weights: [400], category: 'handwriting' },
  { label: 'Dancing Script', value: 'Dancing Script, cursive', family: 'Dancing Script', weights: [400, 500, 600, 700], category: 'handwriting' },
  { label: 'Pacifico', value: 'Pacifico, cursive', family: 'Pacifico', weights: [400], category: 'handwriting' },
  { label: 'Great Vibes', value: 'Great Vibes, cursive', family: 'Great Vibes', weights: [400], category: 'handwriting' },
  { label: 'Satisfy', value: 'Satisfy, cursive', family: 'Satisfy', weights: [400], category: 'handwriting' },
  { label: 'Sacramento', value: 'Sacramento, cursive', family: 'Sacramento', weights: [400], category: 'handwriting' },
  { label: 'Alex Brush', value: 'Alex Brush, cursive', family: 'Alex Brush', weights: [400], category: 'handwriting' },
  { label: 'Allura', value: 'Allura, cursive', family: 'Allura', weights: [400], category: 'handwriting' },
  { label: 'Parisienne', value: 'Parisienne, cursive', family: 'Parisienne', weights: [400], category: 'handwriting' },
  { label: 'Tangerine', value: 'Tangerine, cursive', family: 'Tangerine', weights: [400, 700], category: 'handwriting' },
  { label: 'Lobster', value: 'Lobster, cursive', family: 'Lobster', weights: [400], category: 'display' },
  { label: 'Abril Fatface', value: 'Abril Fatface, serif', family: 'Abril Fatface', weights: [400], category: 'display' },
  { label: 'Bebas Neue', value: 'Bebas Neue, sans-serif', family: 'Bebas Neue', weights: [400], category: 'display' },
  { label: 'Cinzel', value: 'Cinzel, serif', family: 'Cinzel', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Be Vietnam Pro', value: 'Be Vietnam Pro, sans-serif', family: 'Be Vietnam Pro', weights: [400, 500, 600, 700] },
  { label: 'Nunito', value: 'Nunito, sans-serif', family: 'Nunito', weights: [400, 600, 700, 800] },
  { label: 'Quicksand', value: 'Quicksand, sans-serif', family: 'Quicksand', weights: [400, 500, 600, 700] },
  { label: 'Josefin Sans', value: 'Josefin Sans, sans-serif', family: 'Josefin Sans', weights: [400, 600, 700] },
  { label: 'Space Grotesk', value: 'Space Grotesk, sans-serif', family: 'Space Grotesk', weights: [400, 500, 600, 700] },
  { label: 'Comfortaa', value: 'Comfortaa, sans-serif', family: 'Comfortaa', weights: [400, 600, 700], category: 'display' },
  { label: 'Lora', value: 'Lora, serif', family: 'Lora', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Noto Serif', value: 'Noto Serif, serif', family: 'Noto Serif', weights: [400, 600, 700], category: 'serif' },
];

// Font options for Heading
export const headingFontOptions: FontOption[] = [
  { label: 'System UI', value: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', family: 'system-ui' },
  { label: 'Inter', value: 'Inter, sans-serif', family: 'Inter', weights: [400, 500, 600, 700] },
  { label: 'Inter Tight', value: 'Inter Tight, sans-serif', family: 'Inter Tight', weights: [300, 400, 500, 600, 700] },
  { label: 'Roboto', value: 'Roboto, sans-serif', family: 'Roboto', weights: [400, 500, 700] },
  { label: 'Poppins', value: 'Poppins, sans-serif', family: 'Poppins', weights: [400, 500, 600, 700] },
  { label: 'Montserrat', value: 'Montserrat, sans-serif', family: 'Montserrat', weights: [400, 500, 600, 700] },
  { label: 'Open Sans', value: 'Open Sans, sans-serif', family: 'Open Sans', weights: [400, 500, 600, 700] },
  { label: 'Lato', value: 'Lato, sans-serif', family: 'Lato', weights: [400, 700] },
  { label: 'Merriweather', value: 'Merriweather, serif', family: 'Merriweather', weights: [400, 700], category: 'serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif', family: 'Playfair Display', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', family: 'Cormorant Garamond', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif', family: 'Times New Roman', category: 'serif' },
  // Script/Display fonts
  { label: 'Story Script', value: 'Story Script, cursive', family: 'Story Script', weights: [400], category: 'handwriting' },
  { label: 'Birthstone', value: 'Birthstone, cursive', family: 'Birthstone', weights: [400], category: 'handwriting' },
  { label: 'Dancing Script', value: 'Dancing Script, cursive', family: 'Dancing Script', weights: [400, 500, 600, 700], category: 'handwriting' },
  { label: 'Pacifico', value: 'Pacifico, cursive', family: 'Pacifico', weights: [400], category: 'handwriting' },
  { label: 'Great Vibes', value: 'Great Vibes, cursive', family: 'Great Vibes', weights: [400], category: 'handwriting' },
  { label: 'Satisfy', value: 'Satisfy, cursive', family: 'Satisfy', weights: [400], category: 'handwriting' },
  { label: 'Sacramento', value: 'Sacramento, cursive', family: 'Sacramento', weights: [400], category: 'handwriting' },
  { label: 'Alex Brush', value: 'Alex Brush, cursive', family: 'Alex Brush', weights: [400], category: 'handwriting' },
  { label: 'Allura', value: 'Allura, cursive', family: 'Allura', weights: [400], category: 'handwriting' },
  { label: 'Parisienne', value: 'Parisienne, cursive', family: 'Parisienne', weights: [400], category: 'handwriting' },
  { label: 'Tangerine', value: 'Tangerine, cursive', family: 'Tangerine', weights: [400, 700], category: 'handwriting' },
  { label: 'Lobster', value: 'Lobster, cursive', family: 'Lobster', weights: [400], category: 'display' },
  { label: 'Abril Fatface', value: 'Abril Fatface, serif', family: 'Abril Fatface', weights: [400], category: 'display' },
  { label: 'Bebas Neue', value: 'Bebas Neue, sans-serif', family: 'Bebas Neue', weights: [400], category: 'display' },
  { label: 'Cinzel', value: 'Cinzel, serif', family: 'Cinzel', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Be Vietnam Pro', value: 'Be Vietnam Pro, sans-serif', family: 'Be Vietnam Pro', weights: [400, 500, 600, 700] },
  { label: 'Nunito', value: 'Nunito, sans-serif', family: 'Nunito', weights: [400, 600, 700, 800] },
  { label: 'Quicksand', value: 'Quicksand, sans-serif', family: 'Quicksand', weights: [400, 500, 600, 700] },
  { label: 'Josefin Sans', value: 'Josefin Sans, sans-serif', family: 'Josefin Sans', weights: [400, 600, 700] },
  { label: 'Space Grotesk', value: 'Space Grotesk, sans-serif', family: 'Space Grotesk', weights: [400, 500, 600, 700] },
  { label: 'Comfortaa', value: 'Comfortaa, sans-serif', family: 'Comfortaa', weights: [400, 600, 700], category: 'display' },
  { label: 'Lora', value: 'Lora, serif', family: 'Lora', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Noto Serif', value: 'Noto Serif, serif', family: 'Noto Serif', weights: [400, 600, 700], category: 'serif' },
];

// Font options for Paragraph
export const paragraphFontOptions: FontOption[] = [
  { label: 'System UI', value: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', family: 'system-ui' },
  { label: 'Inter', value: 'Inter, sans-serif', family: 'Inter', weights: [400, 500, 600, 700] },
  { label: 'Inter Tight', value: 'Inter Tight, sans-serif', family: 'Inter Tight', weights: [300, 400, 500, 600, 700] },
  { label: 'Roboto', value: 'Roboto, sans-serif', family: 'Roboto', weights: [400, 500, 700] },
  { label: 'Poppins', value: 'Poppins, sans-serif', family: 'Poppins', weights: [400, 500, 600, 700] },
  { label: 'Montserrat', value: 'Montserrat, sans-serif', family: 'Montserrat', weights: [400, 500, 600, 700] },
  { label: 'Open Sans', value: 'Open Sans, sans-serif', family: 'Open Sans', weights: [400, 500, 600, 700] },
  { label: 'Lato', value: 'Lato, sans-serif', family: 'Lato', weights: [400, 700] },
  { label: 'Merriweather', value: 'Merriweather, serif', family: 'Merriweather', weights: [400, 700], category: 'serif' },
  { label: 'Playfair Display', value: 'Playfair Display, serif', family: 'Playfair Display', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', family: 'Cormorant Garamond', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif', family: 'Times New Roman', category: 'serif' },
  { label: 'Be Vietnam Pro', value: 'Be Vietnam Pro, sans-serif', family: 'Be Vietnam Pro', weights: [400, 500, 600, 700] },
  { label: 'Nunito', value: 'Nunito, sans-serif', family: 'Nunito', weights: [400, 600, 700, 800] },
  { label: 'Quicksand', value: 'Quicksand, sans-serif', family: 'Quicksand', weights: [400, 500, 600, 700] },
  { label: 'Josefin Sans', value: 'Josefin Sans, sans-serif', family: 'Josefin Sans', weights: [400, 600, 700] },
  { label: 'Space Grotesk', value: 'Space Grotesk, sans-serif', family: 'Space Grotesk', weights: [400, 500, 600, 700] },
  { label: 'Comfortaa', value: 'Comfortaa, sans-serif', family: 'Comfortaa', weights: [400, 600, 700], category: 'display' },
  { label: 'Lora', value: 'Lora, serif', family: 'Lora', weights: [400, 500, 600, 700], category: 'serif' },
  { label: 'Noto Serif', value: 'Noto Serif, serif', family: 'Noto Serif', weights: [400, 600, 700], category: 'serif' },
];

// Legacy font options for backward compatibility
export const fontOptions = nameFontOptions;

/** Heading + body pairs that work together, for one-tap typography */
export const FONT_PAIRS: { id: string; heading: string; body: string }[] = [
  { id: 'modern', heading: 'Inter Tight, sans-serif', body: 'Inter, sans-serif' },
  { id: 'vietnam', heading: 'Be Vietnam Pro, sans-serif', body: 'Be Vietnam Pro, sans-serif' },
  { id: 'editorial', heading: 'Playfair Display, serif', body: 'Inter, sans-serif' },
  { id: 'classic', heading: 'Lora, serif', body: 'Be Vietnam Pro, sans-serif' },
  { id: 'refined', heading: 'Cormorant Garamond, serif', body: 'Josefin Sans, sans-serif' },
  { id: 'friendly', heading: 'Nunito, sans-serif', body: 'Nunito, sans-serif' },
  { id: 'soft', heading: 'Quicksand, sans-serif', body: 'Quicksand, sans-serif' },
  { id: 'tech', heading: 'Space Grotesk, sans-serif', body: 'Space Grotesk, sans-serif' },
  { id: 'bold', heading: 'Montserrat, sans-serif', body: 'Inter, sans-serif' },
  { id: 'rounded', heading: 'Comfortaa, sans-serif', body: 'Nunito, sans-serif' },
  { id: 'handwritten', heading: 'Dancing Script, cursive', body: 'Lora, serif' },
  { id: 'fun', heading: 'Pacifico, cursive', body: 'Poppins, sans-serif' },
];
