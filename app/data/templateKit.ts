import { nanoid } from 'nanoid'
import type { BioBlock, LinkCardLayout, MenuSection, ThemeConfig, ThemeHeaderLayout, ThemePage, ThemeSocial } from '~/types/bio'
import type { RoomConfig, RoomObject, RoomStyle } from '~/types/room'
import { DEFAULT_ROOM_ENVIRONMENT, DEFAULT_ROOM_STYLE } from '~/types/room'

// Building blocks for the page templates (data/pageTemplates and
// data/pageTemplatesMore): a theme from a few choices, sample photos,
// blocks, menus and a 3D room.

export interface Look {
  bg: string
  /** Text on the page and on cards */
  text: string
  accent: string
  /** Text on accent-coloured buttons */
  onAccent: string
  surface: string
  /** Hairline around cards; omit for borderless cards */
  border?: string
  radius: number
  shadow?: ThemeConfig['card']['shadow']
  nameFont: string
  nameWeight: string
  nameSize: string
  tracking?: string
  headingFont?: string
  bodyFont?: string
  header: ThemeHeaderLayout
  banner?: string
  avatar?: ThemeConfig['avatar']['shape']
  link: LinkCardLayout
  social: ThemeSocial['style']
  gap?: ThemePage['blockGap']
  titleAlign?: ThemePage['titleAlign']
}

// Every value here maps to a control in the theme editor, so users can
// rebuild or tweak any template by hand
export function look(l: Look): ThemeConfig {
  const body = l.bodyFont ?? 'Inter, sans-serif'
  return {
    colors: { primary: l.accent, secondary: l.border ?? l.surface, third: l.bg },
    background: { type: 'solid', color: l.bg },
    card: {
      style: l.border ? 'outline' : 'filled',
      backgroundColor: l.surface,
      outlineColor: l.border,
      textColor: l.text,
      cornerRadius: l.radius,
      transparency: 1,
      shadow: l.shadow ?? 'none',
      animationAppear: 'fadeIn',
      animationHover: 'none',
    },
    button: { style: 'filled', cornerRadius: l.radius, shadow: 'none', textColor: l.onAccent },
    header: {
      alignment: 'center',
      spacing: 'spacious',
      layout: l.header,
      bannerUrl: l.banner,
      fontFamily: l.nameFont,
      fontSize: l.nameSize,
      fontWeight: l.nameWeight,
      letterSpacing: l.tracking,
      textColor: l.text,
    },
    avatar: { shape: l.avatar ?? 'circle', size: 'lg', border: false, animationAppear: 'fadeIn', animationHover: 'none' },
    link: { layout: l.link },
    typography: {
      nameFont: l.nameFont,
      headingFont: l.headingFont ?? l.nameFont,
      paragraphFont: body,
      nameSize: 'lg',
      paragraphSize: 'sm',
      bioFontFamily: body,
      bioFontSize: '1rem',
      bioTextColor: l.text,
      textColor: l.text,
    },
    social: { style: l.social },
    page: { blockGap: l.gap ?? 'normal', titleAlign: l.titleAlign ?? 'center' },
  }
}

// Sample photos from Pexels (free to use, no attribution required)
export const photo = (name: string) => `/images/templates/photos/${name}.jpg`

export function album(...names: string[]) {
  return names.map((name, index) => ({ id: nanoid(6), url: photo(name), index }))
}

export function room(style: Partial<RoomStyle>, objects: Omit<RoomObject, 'id' | 'scale'>[]): RoomConfig {
  return {
    version: 1,
    style: { ...DEFAULT_ROOM_STYLE, ...style },
    environment: { ...DEFAULT_ROOM_ENVIRONMENT },
    objects: objects.map(o => ({ scale: 1, ...o, id: nanoid(8) })),
  }
}

export function withIndex(blocks: Omit<BioBlock, 'index' | 'hidden'>[]): BioBlock[] {
  return blocks.map((b, index) => ({ ...b, id: nanoid(8), index, hidden: false }) as BioBlock)
}

export function menu(sections: { name: string; items: [string, string, string?, string?][] }[]): MenuSection[] {
  return sections.map(s => ({
    id: nanoid(6),
    name: s.name,
    items: s.items.map(([name, price, description, tag]) => ({ id: nanoid(6), name, price, description, tag })),
  }))
}

export function social(...providers: string[]) {
  return providers.map((provider, index) => ({ id: nanoid(6), provider, url: '', index }))
}

export function links(...items: [string, string][]) {
  return items.map(([title, url], order) => ({ id: nanoid(6), title, url, icon: 'link', order, isActive: true }))
}

export const SAMPLE_ADDRESS = '12 Riverside Street, District 1'
export const SAMPLE_PHONE = '+84 90 123 4567'

export const COFFEE_TABLE_TOP = 0.43
export const DESK_TOP = 0.76
