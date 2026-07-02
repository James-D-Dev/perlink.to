import { GOOGLE_FONTS, type FontOption } from '~/data/fontOptions';

// Track loaded fonts to avoid duplicate loading
const loadedFonts = new Set<string>();

/**
 * Load Google Fonts dynamically
 * @param families - Array of font families to load (e.g., ['Inter', 'Roboto'])
 */
export function useGoogleFonts() {
  const loadFonts = (fontOptions: FontOption[]) => {
    const fontsToLoad = fontOptions.filter(font => {
      // Skip system fonts
      if (font.family === 'system-ui' || font.family === 'Times New Roman') return false;
      // Skip already loaded fonts
      if (loadedFonts.has(font.family)) return false;
      return true;
    });

    if (fontsToLoad.length === 0) return;

    // Build Google Fonts URL
    const families = fontsToLoad.map(font => {
      const googleFont = GOOGLE_FONTS.find(gf => gf.startsWith(font.family.replace(/ /g, '+')));
      if (googleFont) return googleFont;
      
      // Default to 400 weight if not specified
      const weights = font.weights?.length 
        ? `wght@${font.weights.join(';')}` 
        : 'wght@400';
      return `${font.family.replace(/ /g, '+')}:${weights}`;
    });

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`;
    
    document.head.appendChild(link);

    // Mark fonts as loaded
    fontsToLoad.forEach(font => loadedFonts.add(font.family));
  };

  /**
   * Load a single font family
   */
  const loadFont = (fontOption: FontOption) => {
    if (fontOption.family === 'system-ui' || fontOption.family === 'Times New Roman') return;
    if (loadedFonts.has(fontOption.family)) return;

    const googleFont = GOOGLE_FONTS.find(gf => gf.startsWith(fontOption.family.replace(/ /g, '+')));
    const family = googleFont || `${fontOption.family.replace(/ /g, '+')}:wght@400`;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
    
    document.head.appendChild(link);
    loadedFonts.add(fontOption.family);
  };

  /**
   * Preload fonts for bio page (load all fonts that might be used)
   */
  const preloadBioFonts = () => {
    // Load all Google Fonts from the list
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    const families = GOOGLE_FONTS.join('&family=');
    link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
    document.head.appendChild(link);
    
    // Mark all as loaded
    GOOGLE_FONTS.forEach(gf => {
      const familyPart = gf.split(':')[0];
      if (familyPart) {
        const family = familyPart.replace(/\+/g, ' ');
        loadedFonts.add(family);
      }
    });
  };

  return {
    loadFonts,
    loadFont,
    preloadBioFonts,
    loadedFonts: readonly(loadedFonts),
  };
}

/**
 * Generate Google Fonts URL for server-side rendering
 */
export function getGoogleFontsUrl(fontOptions?: FontOption[]): string {
  if (!fontOptions || fontOptions.length === 0) {
    // Return all fonts
    const families = GOOGLE_FONTS.join('&family=');
    return `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  }

  const googleFonts = fontOptions.filter(f => 
    f.family !== 'system-ui' && f.family !== 'Times New Roman'
  );

  if (googleFonts.length === 0) return '';

  const families = googleFonts.map(font => {
    const googleFont = GOOGLE_FONTS.find(gf => gf.startsWith(font.family.replace(/ /g, '+')));
    if (googleFont) return googleFont;
    
    const weights = font.weights?.length 
      ? `wght@${font.weights.join(';')}` 
      : 'wght@400';
    return `${font.family.replace(/ /g, '+')}:${weights}`;
  });

  return `https://fonts.googleapis.com/css2?family=${families.join('&family=')}&display=swap`;
}
