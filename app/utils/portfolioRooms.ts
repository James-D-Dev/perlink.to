import type { DemoRoom } from '~/data/portfolio3d/types'
import type { LandId, RoomConfig, RoomObject } from '~/types/room'
import { DESK_TOP, photo, room } from '~/data/templateKit'

// Live demo rooms for the 3D portfolio pages: one per kind of work, with
// sample work in the picture frames (tap one to see it large), in a 6 x 6 m
// room (back wall at z = -3, left wall at x = -3)

type Obj = Omit<RoomObject, 'id' | 'scale'> & { scale?: number }

interface Dressing {
  land: LandId
  mode: 'day' | 'night'
  wall: string
  floor: string
  floorMaterial: 'wood' | 'tile' | 'carpet' | 'concrete'
  accent: string
  /** Five pieces of work: three on the back wall, two on the left */
  work: [string, string, string, string, string]
  extra: Obj[]
}

const DRESSINGS: Record<DemoRoom, Dressing> = {
  designer: {
    land: 'sakura', mode: 'day', wall: '#fbeee6', floor: '#d9b48f', floorMaterial: 'wood', accent: '#e76f51',
    work: ['creator-art-1', 'creator-art-2', 'creator-art-3', 'agency-1', 'creator-art-4'],
    extra: [
      { type: 'plant', position: [-2.5, 0, 1.4], rotation: 0 },
      { type: 'sofa', position: [-1.2, 0, 1.9], rotation: 180, color: '#f4a261' },
    ],
  },
  developer: {
    land: 'city', mode: 'night', wall: '#23232d', floor: '#3a3a44', floorMaterial: 'concrete', accent: '#7c5cff',
    work: ['neon-1', 'blog-tech-1', 'neon-3', 'neon-2', 'blog-tech-2'],
    extra: [
      { type: 'neon-sign', position: [-3, 2.2, 1.3], rotation: 0, wall: 'left', color: '#22d3ee' },
      { type: 'tv', position: [-1.4, 0, 1.9], rotation: 180, color: '#2b2b33' },
      { type: 'string-lights', position: [0, 2.85, -3], rotation: 0, wall: 'back', color: '#a78bfa' },
    ],
  },
  photographer: {
    land: 'island', mode: 'day', wall: '#f7f6f3', floor: '#e4ddd2', floorMaterial: 'tile', accent: '#1c1a17',
    work: ['photog-1', 'photog-4', 'photo-2', 'photog-2', 'photo-3'],
    extra: [
      { type: 'wall-lamp', position: [-3, 2.5, 1.2], rotation: 0, wall: 'left' },
      { type: 'coffee-table', position: [-1.1, 0, 1.4], rotation: 0, color: '#ffffff' },
      { type: 'mug', position: [-1.1, 0.43, 1.4], rotation: 0 },
    ],
  },
  architect: {
    land: 'zen', mode: 'day', wall: '#ecebe7', floor: '#9c9a94', floorMaterial: 'concrete', accent: '#3d3d3d',
    work: ['interior-1', 'villa-1', 'interior-3', 'interior-2', 'villa-3'],
    extra: [
      { type: 'bookshelf', position: [-2.6, 0, 1.6], rotation: 90 },
      { type: 'plant', position: [-1.2, 0, 2.3], rotation: 0 },
    ],
  },
  student: {
    land: 'autumn', mode: 'day', wall: '#eef3fb', floor: '#c8a27a', floorMaterial: 'wood', accent: '#2453ff',
    work: ['cv-1', 'course-1', 'personal-work-1', 'cv-2', 'personal-work-3'],
    extra: [
      { type: 'blog-board', position: [-3, 1.9, 1.4], rotation: 0, wall: 'left', color: '#2453ff' },
      { type: 'bookshelf', position: [-1.3, 0, 2.6], rotation: 180 },
    ],
  },
}

function build(kind: DemoRoom): RoomConfig {
  const d = DRESSINGS[kind]
  const frame = (name: string, position: [number, number, number], wall: 'back' | 'left'): Obj =>
    ({ type: 'picture-frame', position, rotation: 0, wall, color: '#ffffff', image: photo(`${name}-md`), scale: 1.25 })
  const objects: Obj[] = [
    // The work: three on the back wall, two on the left
    frame(d.work[0], [-2.0, 2.25, -3], 'back'),
    frame(d.work[1], [-0.7, 2.25, -3], 'back'),
    frame(d.work[2], [0.6, 2.25, -3], 'back'),
    frame(d.work[3], [-3, 2.2, -1.7], 'left'),
    frame(d.work[4], [-3, 2.2, -0.4], 'left'),
    // A desk to work at
    { type: 'desk', position: [1.9, 0, -2.6], rotation: 0 },
    { type: 'chair', position: [1.9, 0, -1.8], rotation: 180 },
    { type: 'laptop', position: [1.75, DESK_TOP, -2.6], rotation: 0 },
    { type: 'desk-lamp', position: [2.4, DESK_TOP, -2.7], rotation: 0, color: d.accent },
    { type: 'wall-clock', position: [1.9, 2.4, -3], rotation: 0, wall: 'back' },
    { type: 'rug', position: [0, 0, 0.2], rotation: 0, color: d.accent },
    { type: 'floor-lamp', position: [2.5, 0, 1.2], rotation: 0 },
    { type: 'plant', position: [2.5, 0, -0.6], rotation: 0 },
    ...d.extra,
  ]
  const base = room(
    { wallColor: d.wall, floorColor: d.floor, floorMaterial: d.floorMaterial, trimColor: '#ffffff' },
    objects as Omit<RoomObject, 'id' | 'scale'>[],
  )
  return { ...base, land: d.land, environment: { ...base.environment, mode: d.mode }, guestbook: false }
}

const cache = new Map<DemoRoom, RoomConfig>()
/** The demo room for a kind of work (built once, so the scene isn't rebuilt on every render) */
export function portfolioRoom(kind: DemoRoom): RoomConfig {
  let config = cache.get(kind)
  if (!config) {
    config = build(kind)
    cache.set(kind, config)
  }
  return config
}

export const DEMO_ROOMS: DemoRoom[] = ['designer', 'developer', 'photographer', 'architect', 'student']
