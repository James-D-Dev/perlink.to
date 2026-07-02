export const EFFECT_BG_CLASS: Record<string, string> = {
  'particles': 'bg-black',
  'falling-stars': 'bg-black',
  'stars': 'bg-indigo-950',
  'snow': 'bg-transparent',
  'rose': 'bg-transparent',
  'flickering-grid': 'bg-white',
  'interactive-grid': 'bg-white',
  'neural': 'bg-black',
  'silk': 'bg-purple-900',
  'black-hole': 'bg-white',
  'thunderstorm': 'bg-slate-900',
}

export function getEffectBgClass(effectId?: string): string {
  return EFFECT_BG_CLASS[effectId ?? ''] ?? 'bg-gray-50'
}
