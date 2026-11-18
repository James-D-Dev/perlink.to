import type { RoomStyle } from '~/types/room'

export const ROOM_STYLE_PRESETS: { name: string; style: Partial<RoomStyle> }[] = [
  { name: 'Cozy wood', style: { theme: 'classic', wallMaterial: 'paint', wallColor: '#f3ede4', floorColor: '#c8a27a', floorMaterial: 'wood', trimColor: '#ffffff' } },
  { name: 'Minimal white', style: { theme: 'classic', wallMaterial: 'paint', wallColor: '#fafafa', floorColor: '#e6e6e6', floorMaterial: 'tile', trimColor: '#d4d4d4' } },
  { name: 'Pastel', style: { theme: 'classic', wallMaterial: 'stripes', wallColor: '#fde2e4', floorColor: '#cddafd', floorMaterial: 'carpet', trimColor: '#ffffff' } },
  { name: 'Sage', style: { theme: 'classic', wallMaterial: 'panel', wallColor: '#dfe7d6', floorColor: '#b08968', floorMaterial: 'wood', trimColor: '#f8f4ec' } },
  { name: 'Night studio', style: { theme: 'classic', wallMaterial: 'plaster', wallColor: '#2b2d42', floorColor: '#4a4e69', floorMaterial: 'concrete', trimColor: '#8d99ae' } },
  { name: 'Industrial', style: { theme: 'classic', wallMaterial: 'brick', wallColor: '#b5aca3', floorColor: '#8a8a8a', floorMaterial: 'concrete', trimColor: '#3d3d3d' } },
  { name: 'Dungeon', style: { theme: 'dungeon', wallMaterial: 'paint', wallColor: '#9a9a9a', floorColor: '#b5b5b5', floorMaterial: 'tile', trimColor: '#d0d0d0' } },
]
